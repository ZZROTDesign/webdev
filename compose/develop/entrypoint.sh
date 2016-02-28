#!/bin/bash
cd /usr/src/app

#Need to install Gulp CLI globally.
npm install -g gulp

#Install all packages from Package.json.
npm install

#For updating
#npm install -g npm-check-updates
#ncu -d -u --packageData

#Run our default Gulp task.
gulp
