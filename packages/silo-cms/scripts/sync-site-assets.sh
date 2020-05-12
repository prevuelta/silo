#!/bin/bash

mkdir -p "$SITE_DIR/dist/assets"
rsync -avz "$SITE_DIR/assets/" "$SITE_DIR/dist/assets/"
