#!/bin/bash

# bash ./scripts/build-site-styles.sh
# bash ./scripts/build-site-scripts.sh
# run-p watch-site:styles watch-site:js watch-site:html sync

VIEWS_PATH="$SITE_DIR/src/views" 
SCRIPTS_PATH="$SITE_DIR/src/scripts" 
STYLES_PATH="$SITE_DIR/src/styles" 
echo "Watching $VIEWS_PATH"

nodemon --watch $VIEWS_PATH -e 'pug' --exec "node -r esm ./scripts/build-site-html.js" &
nodemon --watch $SCRIPTS_PATH --exec "bash ./scripts/build-site-scripts.sh" &
nodemon --watch $STYLES_PATH --exec "bash ./scripts/build-site-styles.sh" &
source ./config/.env
run-p serve &
browser-sync start --port 9300 --proxy 'localhost:'$PORT --files "$SITE_DIR" &

