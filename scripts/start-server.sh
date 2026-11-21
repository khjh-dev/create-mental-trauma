#!/usr/bin/env bash
# Синхронизирует серверную часть пака и запускает сервер (Linux).
# Запускать из папки сервера:  bash ../scripts/start-server.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
DIST="$ROOT/dist"
URL="${PACKWIZ_URL:-$(tr -d '\r\n' < "$ROOT/pack-url.txt")}"

mkdir -p "$DIST"

if [[ "$URL" == *CHANGE-ME* ]]; then
  echo "В pack-url.txt заглушка — укажите реальный адрес pack.toml" >&2
  exit 1
fi

BOOTSTRAP="$DIST/packwiz-installer-bootstrap.jar"
INSTALLER="$DIST/packwiz-installer.jar"

[[ -f "$BOOTSTRAP" ]] || curl -fsSL -o "$BOOTSTRAP" \
  https://github.com/packwiz/packwiz-installer-bootstrap/releases/download/v0.0.3/packwiz-installer-bootstrap.jar

[[ -f "$INSTALLER" ]] || curl -fsSL -o "$INSTALLER" \
  https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar || true

ARGS=()
[[ -f "$INSTALLER" ]] && ARGS+=(--bootstrap-main-jar "$INSTALLER" --bootstrap-no-update)
ARGS+=(-g -s server "$URL")

java -jar "$BOOTSTRAP" "${ARGS[@]}"

NF_ARGS=$(ls libraries/net/neoforged/neoforge/*/unix_args.txt 2>/dev/null | head -n1 || true)
if [[ -n "${NF_ARGS}" ]]; then
  exec java ${JAVA_ARGS:--Xmx8G} "@${NF_ARGS}" nogui
fi
exec java ${JAVA_ARGS:--Xmx8G} -jar server.jar nogui
