package server

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/acme/autocert"

	"nexustimer/realtime/internal/config"
	"nexustimer/realtime/internal/hub"
)

const (
	readHeaderTimeout = 10 * time.Second
	shutdownTimeout   = 5 * time.Second
)

type Pinger interface {
	Ping(ctx context.Context) error
}

type Server struct {
	cfg    config.Config
	hub    *hub.Hub
	redis  Pinger
	logger *slog.Logger
}

func New(cfg config.Config, h *hub.Hub, redis Pinger, logger *slog.Logger) *Server {
	return &Server{cfg: cfg, hub: h, redis: redis, logger: logger}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", s.handleWebSocket)
	mux.HandleFunc("GET /health", s.handleHealth)
	return mux
}

func (s *Server) Run(ctx context.Context) error {
	healthMux := http.NewServeMux()
	healthMux.HandleFunc("GET /health", s.handleHealth)

	servers := []*http.Server{{Addr: s.cfg.HealthAddr, Handler: healthMux, ReadHeaderTimeout: readHeaderTimeout}}
	public := &http.Server{Handler: s.Handler(), ReadHeaderTimeout: readHeaderTimeout}

	errc := make(chan error, 3)
	serve := func(name string, listen func() error) {
		go func() {
			if err := listen(); err != nil && !errors.Is(err, http.ErrServerClosed) {
				errc <- fmt.Errorf("%s listener: %w", name, err)
			}
		}()
	}

	serve("health", servers[0].ListenAndServe)

	if s.cfg.Domain != "" {
		certs := &autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(s.cfg.Domain),
			Cache:      autocert.DirCache(s.cfg.CertDir),
		}
		acme := &http.Server{Addr: ":80", Handler: certs.HTTPHandler(nil), ReadHeaderTimeout: readHeaderTimeout}
		public.Addr = ":443"
		public.TLSConfig = certs.TLSConfig()
		servers = append(servers, acme, public)

		serve("acme", acme.ListenAndServe)
		serve("https", func() error { return public.ListenAndServeTLS("", "") })
		s.logger.Info("listening", "url", "https://"+s.cfg.Domain)
	} else {
		public.Addr = s.cfg.Addr
		servers = append(servers, public)

		serve("http", public.ListenAndServe)
		s.logger.Info("listening", "addr", s.cfg.Addr)
	}

	var runErr error
	select {
	case <-ctx.Done():
	case runErr = <-errc:
	}

	s.logger.Info("shutting down", "connections", s.hub.Stats().Connections)
	// Hijacked WebSocket connections are not closed by http.Server.Shutdown
	s.hub.CloseAll(websocket.CloseServiceRestart, "restarting")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()
	for _, srv := range servers {
		_ = srv.Shutdown(shutdownCtx)
	}
	return runErr
}
