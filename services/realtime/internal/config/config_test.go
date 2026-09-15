package config

import (
	"slices"
	"strings"
	"testing"
)

func TestLoadRequiresRedisAndSecret(t *testing.T) {
	t.Setenv("REDIS_URL", "")
	t.Setenv("REALTIME_SECRET", "")

	_, err := Load()
	if err == nil {
		t.Fatal("expected an error")
	}
	for _, want := range []string{"REDIS_URL", "REALTIME_SECRET"} {
		if !strings.Contains(err.Error(), want) {
			t.Errorf("error %q does not mention %s", err, want)
		}
	}
}

func TestLoadDefaults(t *testing.T) {
	t.Setenv("REDIS_URL", "redis://localhost:6379")
	t.Setenv("REALTIME_SECRET", "secret")
	t.Setenv("PORT", "")
	t.Setenv("REALTIME_DOMAIN", "")
	t.Setenv("AUTOCERT_DIR", "")
	t.Setenv("HEALTH_ADDR", "")
	t.Setenv("ALLOWED_ORIGINS", "")

	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Addr != ":8080" || cfg.CertDir != defaultCertDir || cfg.HealthAddr != defaultHealthAddr {
		t.Errorf("unexpected defaults: %+v", cfg)
	}
	if cfg.AllowedOrigins != nil {
		t.Errorf("AllowedOrigins = %v, want empty", cfg.AllowedOrigins)
	}
}

func TestLoadParsesAllowedOrigins(t *testing.T) {
	t.Setenv("REDIS_URL", "redis://localhost:6379")
	t.Setenv("REALTIME_SECRET", "secret")
	t.Setenv("ALLOWED_ORIGINS", " https://a.test, ,https://b.test ")

	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if want := []string{"https://a.test", "https://b.test"}; !slices.Equal(cfg.AllowedOrigins, want) {
		t.Errorf("AllowedOrigins = %v, want %v", cfg.AllowedOrigins, want)
	}
}
