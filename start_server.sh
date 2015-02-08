#!/bin/bash

clear
cd /home/ubuntu/chanakya
echo "=========================TAXI STOP========================"
sudo su
echo "Granting Sudo Access"
export PORT=80
echo "Envt Port done"
rm -r nohup.out
nohup npm start &
echo "-----------[ Running Node Server | TaxiStop ]-------------"
