#!/bin/bash
mkdir simple-$1
cd simple-$1
git init

mkdir conf
echo `cat << configDev.json
{
  "name": "simple-$1",
  "appEnv": {
    "mode": "dev",
    "port": "$2",
    "rootPath": "/Users/shasharoman/private/simple-$1",
    "srcPath": "/Users/shasharoman/private/simple-$1/src",
    "logPath": "/Users/shasharoman/private/simple-$1/logs",
    "baseUrl": "http://127.0.0.1:$2"
  },
  "appOption": {
    "middleware": []
  },
  "applicationList": [],
  "mysqlOption": {
    "host": "192.168.99.100",
    "port": 3306,
    "user": "root",
    "password": " ",
    "database": "simple_$1",
    "connectionLimit": 10
  },
  "redisOption": {
    "host": "192.168.99.100",
    "port": 6379,
    "user": "",
    "password": ""
  }
}` > conf/configDev.json

mkdir logs
touch logs/empty

echo `cat << package.json
{
	"name": "simple-$1",
	"version": "1.0.0",
	"description": "simple-$1",
	"author": "shasharoman",
	"license": "ISC",
	"dependencies": {
    	"async": "^1.5.2",
    	"lodash": "^4.11.1"
  	}
}` > package.json

mkdir src

if [ $# -ge 3 ]
then
	mkdir src/$3
	mkdir src/$3/service

	echo `cat << meta-info.json
	{
	  "initial": "",
	  "serviceList": [
	    {
	      "name": "",
	      "path": "",
	      "realizeFile": "",
	      "realizeFunction": "",
	      "method": ""
	    }
	  ]
	}` > src/$3/meta-info.json
fi