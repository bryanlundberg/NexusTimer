#!/usr/bin/env bash
# Run once before the first deploy that publishes the TLS port.
set -euo pipefail

REMOTE=app/realtime

cd "$(dirname "$0")/.."

[ -f .env.production ] || { echo "missing .env.production" >&2; exit 1; }

setting() { grep -E "^$1=" .env.production | head -n 1 | cut -d= -f2- | tr -d '"\r'; }
HOST=$(setting DEPLOY_HOST)
KEY=$(setting DEPLOY_KEY)
KEY="${KEY/#\~/$HOME}"
if [ ! -f "$KEY" ]; then
  case "$KEY" in
    /mnt/?/*) alt="/${KEY#/mnt/}" ;;
    /?/*) alt="/mnt$KEY" ;;
    *) alt="" ;;
  esac
  if [ -n "$alt" ] && [ -f "$alt" ]; then KEY="$alt"; fi
fi
[ -n "$HOST" ] && [ -f "$KEY" ] || { echo "check DEPLOY_HOST and DEPLOY_KEY" >&2; exit 1; }

run() { ssh -i "$KEY" "$HOST" "$@"; }

staged=$(mktemp)
trap 'rm -f "$staged"' EXIT
sed "s|__APP__|/home/${HOST%%@*}/$REMOTE|" deploy/sync-cert.sh > "$staged"

echo "==> install"
scp -q -i "$KEY" "$staged" "$HOST:/tmp/sync-redis-cert.sh"
run "sudo install -m 755 -o root -g root /tmp/sync-redis-cert.sh /usr/local/bin/sync-redis-cert.sh && rm /tmp/sync-redis-cert.sh"
run "printf '0 4 * * * root /usr/local/bin/sync-redis-cert.sh >> /var/log/redis-cert.log 2>&1\n' | sudo tee /etc/cron.d/redis-cert >/dev/null && sudo chmod 644 /etc/cron.d/redis-cert"

echo "==> run"
run "sudo /usr/local/bin/sync-redis-cert.sh"
run "sudo openssl x509 -in $REMOTE/certs/fullchain.pem -noout -subject -enddate"
