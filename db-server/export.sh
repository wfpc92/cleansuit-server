#!/bin/bash
for i in *.json; do
    ~/webapps/mongodb/mongodb-linux-x86_64-3.2.4/bin/mongoexport -d Cleansuit --port 17551 --username uclean --password limpiaropa0 -c ${i/.json/} -o $i
done
