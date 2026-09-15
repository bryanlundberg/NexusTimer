package server

import (
	"errors"
	"net/http"
	"slices"
	"sync"
	"time"

	"github.com/gorilla/websocket"

	"nexustimer/realtime/internal/auth"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  512,
	WriteBufferSize: 512,
	// Write buffers are only held while writing, which keeps idle connections cheap
	WriteBufferPool: &sync.Pool{},
	// Origin is checked before upgrading so the rejection gets a proper status code
	CheckOrigin: func(*http.Request) bool { return true },
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	if len(s.cfg.AllowedOrigins) > 0 && !slices.Contains(s.cfg.AllowedOrigins, r.Header.Get("Origin")) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	userID, err := auth.VerifyTicket(r.URL.Query().Get("ticket"), s.cfg.Secret, time.Now())
	if err != nil {
		if !errors.Is(err, auth.ErrExpired) {
			s.logger.Debug("rejected ticket", "error", err, "remote", r.RemoteAddr)
		}
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return // Upgrade already wrote the error response
	}
	s.hub.Register(userID, conn)
}
