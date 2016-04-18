#!/bin/sh
cd /usr/src || exit

#Install any additional packages from 3rd party package.json
npm install

#Clean the npm cache
npm cache clean

#Run our default Gulp task.
gulp
