#!/bin/sh
cd /usr/src/app

#For updating
npm install -g npm-check-updates
ncu -d -u --packageData
