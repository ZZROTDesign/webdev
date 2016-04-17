#!/bin/sh
cd /usr/src/app || exit

#Install Scripts Here


#For updating
npm install -g npm-check-updates

ncu -u -a --packageFile package.json
