#!/bin/bash

node -r esm ./scripts/build-site-html.js
bash ./scripts/build-site-scripts.sh
bash ./scripts/build-site-styles.sh
