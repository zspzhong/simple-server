#!/usr/bin/env bash
node /root/simple-server/lib/webApp.js -f /root/simple-server/conf/config.json -c $1 1>../logs/access.log 2>../logs/error.log