#!/bin/bash

"pwd"
pwd

ENV_FILE=./config/.env
touch $ENV_FILE

source $ENV_FILE

echo $SITE_NAME;

if [ -z ${JWT_SECRET+x} ];
then
    echo "Setting secret...";
    echo "JWT_SECRET=$(uuidgen)" >> "$ENV_FILE"
    echo "SESSION_SECRET=$(uuidgen)" >> "$ENV_FILE"
else
    echo 'JWT secret already set';
    exit;
fi;

exit;
