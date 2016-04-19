#!/bin/sh
cd /usr/src || exit

#Install any additional packages from 3rd party package.json
npm install

#Clean the npm cache
npm cache clean

#Clean the public folder first
gulp clean

#Run our default Gulp task.
gulp
