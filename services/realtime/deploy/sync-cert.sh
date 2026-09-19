#!/bin/sh
# Installed by certs.sh, which fills in APP and puts a root copy in /usr/local/bin.
set -eu

APP=__APP__
cd "$APP"

DOMAIN=$(grep -E '^REALTIME_DOMAIN=' .env | cut -d= -f2- | tr -d '"')
[ -n "$DOMAIN" ] || { echo "no REALTIME_DOMAIN" >&2; exit 1; }

volume=""
container=$(docker compose ps -q gateway 2>/dev/null || true)
if [ -n "$container" ]; then
  volume=$(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/data/autocert"}}{{.Name}}{{end}}{{end}}' "$container")
fi
[ -n "$volume" ] || volume=$(docker volume ls -q --filter name=_autocert | head -n 1)
[ -n "$volume" ] || { echo "no cache volume" >&2; exit 1; }

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

docker run --rm --entrypoint cat -v "$volume":/src:ro redis:8-alpine "/src/$DOMAIN" > "$tmp/blob.pem"
[ -s "$tmp/blob.pem" ] || { echo "nothing cached for $DOMAIN" >&2; exit 1; }

awk -v out="$tmp/fullchain.pem" '/^-----BEGIN CERTIFICATE-----/{c=1} c{print > out} /^-----END CERTIFICATE-----/{c=0}' "$tmp/blob.pem"
awk -v out="$tmp/privkey.pem" '/^-----BEGIN .*PRIVATE KEY-----/{k=1} k{print > out} /^-----END .*PRIVATE KEY-----/{k=0}' "$tmp/blob.pem"
[ -s "$tmp/fullchain.pem" ] && [ -s "$tmp/privkey.pem" ] || { echo "split failed" >&2; exit 1; }

new=$(sha256sum "$tmp/fullchain.pem" | cut -d' ' -f1)
old=$(sha256sum certs/fullchain.pem 2>/dev/null | cut -d' ' -f1 || true)
if [ "$new" = "$old" ]; then
  exit 0
fi

install -d -m 755 certs
install -m 644 "$tmp/fullchain.pem" certs/fullchain.pem
install -m 640 -o 999 -g 999 "$tmp/privkey.pem" certs/privkey.pem

docker compose restart redis || echo "redis not running" >&2
