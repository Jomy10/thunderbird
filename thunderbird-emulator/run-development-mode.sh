set -e
cd "$(dirname "$0")"

mkdir game || true
touch game/env.txt || true
echo "dev" > game/env.txt
