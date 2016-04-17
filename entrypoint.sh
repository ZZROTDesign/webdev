#!/bin/sh
cd /usr/src/app || exit

# Install Gulp CLI globally.
npm install -g gulp

#Install any additional packages from 3rd party package.json
npm install

#Clean the npm cache
npm cache clean

#Run our default Gulp task.
gulp
