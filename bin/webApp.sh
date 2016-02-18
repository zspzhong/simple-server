#!/usr/bin/env bash
#!/usr/bin/env bash
node /root/simple/lib/webApp.js -f /root/simple/conf/config.json -c $1 1>../logs/webAppAccess.log 2>../logs/webAppError.log