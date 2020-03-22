#!/bin/bash

node ./update-silo-starter.js
git add --all;
TAG=$(git describe --abbrev=0 --tags)
MESSAGE="New package versions $TAG"
echo $MESSAGE
git commit -m "$MESSAGE";
git push

