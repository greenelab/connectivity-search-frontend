#!/bin/bash
#
# Kills all existing react-scripts processes and thus frees default port 3000
# to be used by new react-scripts process.

echo "Killing all existing react-scripts processes ..."

PROCESSES=`ps -ef | grep --extended-regexp "react-scripts.*(start|test)" | grep --invert-match grep`

if [ -z "$PROCESSES" ]; then
    exit
fi

while read PROC; do
  CMD=`awk '{print $8, $9, $10}' <<< $PROC`
  PID=`awk '{print $2}' <<< $PROC`
  echo "Killing: $CMD"
  kill -9 $PID
done <<< $PROCESSES
