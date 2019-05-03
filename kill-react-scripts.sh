#!/bin/bash

# kills any existing react-scripts processes and thus frees
# default port 3000 to be used by new react-scripts instance

echo "killing any existing react-scripts instances"

processes=`ps -ef | grep -i -E "react-scripts.*(start|test)"`
while read process; do
  echo killing process $process
  processId=`awk '{print $2}' <<< $process`
  kill -9 $processId
done <<< $processes
