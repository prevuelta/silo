#!/bin/bash

SCRIPTS=$(npm run --prefix "$SITE_DIR" | grep "^  [^ ]")

if [[ $SCRIPTS == *"silo:copy"* ]]; then
    npm run "silo:copy:assets" --if-present --prefix "$SITE_DIR"
else
    bash ./scripts/copy-site-assets.sh
fi


if [[ $SCRIPTS == *"silo:build:html"* ]]; then
    npm run "silo:build:html" --if-present --prefix "$SITE_DIR"
else
    node -r esm ./scripts/build-site-html.js
fi

if [[ $SCRIPTS == *"silo:build:scripts"* ]]; then
    npm run "silo:build:scripts" --if-present --prefix "$SITE_DIR"
else
    bash ./scripts/build-site-scripts.sh
fi

if [[ $SCRIPTS == *"silo:build:styles"* ]]; then
    npm run "silo:build:styles" --if-present --prefix "$SITE_DIR"
else
    bash ./scripts/build-site-styles.sh
fi


