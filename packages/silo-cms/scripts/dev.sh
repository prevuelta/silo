#!/bin/bash

echo "Port $PORT"

VIEWS_PATH="$SITE_DIR/src/views" 
SCRIPTS_PATH="$SITE_DIR/src/scripts" 
STYLES_PATH="$SITE_DIR/src/styles" 
ASSETS_PATH="$SITE_DIR/assets"

echo "Watching $VIEWS_PATH"

nodemon --watch $VIEWS_PATH -e 'pug' --exec "node -r esm ./scripts/build-site-html.js" &
nodemon --watch $SCRIPTS_PATH --exec "bash ./scripts/build-site-scripts.sh" &
nodemon --watch $STYLES_PATH --exec "bash ./scripts/build-site-styles.sh" &
nodemon --watch $ASSETS_PATH -e '*' --exec  "bash ./scripts/sync-site-assets.sh" & 

source ./config/.env

npm run serve 
# browser-sync start --port 9300 --proxy 'localhost:'$PORT --files "$SITE_DIR" 

