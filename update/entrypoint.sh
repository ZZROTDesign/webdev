#!/bin/sh
cd /usr/src/app

#For updating
npm install -g npm-check-updates

ncu -u --packageFile package.json
