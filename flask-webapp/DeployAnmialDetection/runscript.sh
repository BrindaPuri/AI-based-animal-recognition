#!/bin/bash

flaskPath=animalDetection/backend
reactPath=animalDetection/frontend

process_ids=()


append() { process_ids+=( "$1" ); }

python3 -m pip install --user --upgrade pip
python3 -m pip --version
python3 -m pip install --user virtualenv

echo 'all functions in this script tested working in linux'

echo 'activating python virtual env'
virtualenv env
source env/local/bin/activate

python3 -m pip install -r requirements.txt

echo 'starting backend server'
nohup python3 ${flaskPath}/app.py > flask-log.txt & 
append "$!"

echo 'starting frontend server'
npm --prefix ${reactPath} install -g npm@latest
rm -rf ${reactPath}/node_modules
npm --prefix ${reactPath} install
nohup npm --prefix ${reactPath} run start > react-log.txt &
append "$!"

echo 'The background server process name:'
printf ' - %s\n' "${process_ids[@]}"

echo 'kill this script will kill all bg processes it created'

echo 'flask: http://127.0.0.1:5000/'
echo 'react: http://127.0.0.1:3000/'

echo 'opening up http://localhost:3000/'

__cleanup ()
{
    echo 'deactivating python virtual env'
    deactivate
    echo 'deactivated'

    echo 'start killing background processes'
    for pid in ${process_ids[@]}; do
        echo 'killing process' ${pid}
        kill $pid
    done

    rm animalDetection/backend/images/*
    echo 'removed everything in animalDetection/backend/images/'

    echo 'done cleaning up'
}

trap __cleanup SIGINT SIGTERM INT

for pid in ${process_ids[@]}; do
    # echo 'waiting on' ${pid}
    wait $pid
    # echo ${pid} ' ended'
done
