package config

import (
	"errors"
	"os"
	"strings"
)

const (
	defaultPort       = "8080"
	defaultCertDir    = "/data/autocert"
	defaultHealthAddr = "127.0.0.1:8081"
)

type Config struct {
	RedisURL string
	// Secret must match REALTIME_SECRET in the Next.js app.
	Secret         []byte
	Addr           string
	Domain         string
	CertDir        string
	HealthAddr     string
	AllowedOrigins []string
}

func Load() (Config, error) {
	cfg := Config{
		RedisURL:       os.Getenv("REDIS_URL"),
		Secret:         []byte(os.Getenv("REALTIME_SECRET")),
		Addr:           ":" + envOr("PORT", defaultPort),
		Domain:         os.Getenv("REALTIME_DOMAIN"),
		CertDir:        envOr("AUTOCERT_DIR", defaultCertDir),
		HealthAddr:     HealthAddr(),
		AllowedOrigins: splitList(os.Getenv("ALLOWED_ORIGINS")),
	}

	var errs []error
	if cfg.RedisURL == "" {
		errs = append(errs, errors.New("REDIS_URL is required"))
	}
	if len(cfg.Secret) == 0 {
		errs = append(errs, errors.New("REALTIME_SECRET is required"))
	}
	return cfg, errors.Join(errs...)
}

func HealthAddr() string {
	return envOr("HEALTH_ADDR", defaultHealthAddr)
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func splitList(value string) []string {
	var items []string
	for item := range strings.SplitSeq(value, ",") {
		if item = strings.TrimSpace(item); item != "" {
			items = append(items, item)
		}
	}
	return items
}
