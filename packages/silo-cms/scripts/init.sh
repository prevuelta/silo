#!/bin/bash

DB_PATH=./app/db/app.db

if test -f "$DB_PATH"; then 
  echo "Database exists"
else
  sqlite3 $DB_PATH < ./app/db/schema.schema;
fi

npm run generateSecrets
