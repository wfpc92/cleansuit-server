#!/bin/bash
for i in *.json; do
    mongoexport -d Cleansuit -c ${i/.json/} -o $i
done
