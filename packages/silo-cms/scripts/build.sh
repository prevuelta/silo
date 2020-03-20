#!/bin/bash

node -r esm ./scripts/build-site-html.js
bash ./scripts/build-site-scripts.sh
bash ./scritps/build-site-styles.sh
