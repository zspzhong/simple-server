#!/usr/bin/env bash
nohup node /root/simple-server/lib/runScript.js -f /root/simple-server/conf/configDev.json -c $1 -a $2 1>>../logs/script_access.log 2>>../logs/script_error.log &