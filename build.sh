#!/bin/sh
set -e

if [ -z "$(which elm-make)" ]
then
  if [ -z "$(which npm)" ]
  then
    echo Installing npm ...
    apt-get install -y npm
  fi

  echo Installing elm compiler ...
  npm install -g elm
fi

echo Building the the plugin ...
sbt scripted
