#!/bin/bash

DB_PATH="$SITE_DIR/db/app.db"

mkdir -p "$SITE_DIR/db"

echo "DB Path$DB_PATH"
pwd

if test -f "$DB_PATH"; then 
  echo "Database exists"
else
  sqlite3 $DB_PATH < "./app/db/schema.schema"
fi

npm run generateSecrets
