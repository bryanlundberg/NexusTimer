#!/usr/bin/env bash

set -euo pipefail

REMOTE=app/realtime
IMAGE=nexustimer-realtime:latest

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
command -v docker >/dev/null || { echo "no docker" >&2; exit 1; }

echo "==> build"
docker build --platform linux/amd64 --provenance=false -t "$IMAGE" .

echo "==> image"
docker save "$IMAGE" | gzip | ssh -i "$KEY" "$HOST" 'docker load'

echo "==> source"
tar --exclude='.env' --exclude='.env.production' -cz . | ssh -i "$KEY" "$HOST" "mkdir -p $REMOTE && tar -xz -C $REMOTE"

echo "==> settings"
scp -i "$KEY" .env.production "$HOST:$REMOTE/.env"

echo "==> up"
ssh -i "$KEY" "$HOST" "cd $REMOTE && docker compose up -d"
ssh -i "$KEY" "$HOST" "cd $REMOTE && docker compose ps && curl -fsS https://$(setting REALTIME_DOMAIN)/health && echo"
