#!/bin/bash

clear
cd /home/ubuntu/taxistop
echo "======================TAXI STOP ENGINE====================="
echo "Setting Port to 3300 and Envt to Production"
export PORT=3300
export NODE_ENV=production
echo "...Done"
echo "Building CSS and JS file..."
gulp build
echo "...Done"
echo "Killing Node Server running on port 3300..."
NP=`sudo netstat -lpn | grep 3300 | awk 'NR==1{print $7}' | awk '{split($0, array, "/")} END{print array[1]}'`
echo "Killing PID: $NP"
kill -9 $NP
echo "...Done"
echo "Backing up and removing nohup output file..."
mv nohup.out nohup.out.bak
rm -r nohup.out
echo "...Done"
echo "Starting Node Server..."
nohup npm start &
echo "...Done"
echo "----------[ Running Server | TaxiStop Engine ]------------"