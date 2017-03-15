#!/bin/bash
for i in *.json; do
    mongoimport -d Cleansuit -c ${i/.json/} --file $i
done
