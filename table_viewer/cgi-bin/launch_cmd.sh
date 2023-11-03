#!/bin/bash
# Extract the query string from the environment variables
#echo $QUERY_STRING >> logfile.txt
command=$(echo "$QUERY_STRING" | sed 's/%20/ /g')
echo "Executing with: $command" >> logfile.txt
bash -c "$command"