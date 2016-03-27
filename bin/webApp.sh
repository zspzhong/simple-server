#!/usr/bin/env bash
node /root/simple-server/lib/webApp.js -f /root/simple-server/conf/config.json -c $1 1>/root/simple-server/logs/access.log 2>/root/simple-server/logs/error.log