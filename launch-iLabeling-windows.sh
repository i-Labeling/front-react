#!/bin/bash
source .env

backend_path=$BACKEND_PATH
frontend_path=$FRONTEND_PATH

find_pid_by_port() {
    local port=$1
    local pid=$(lsof -t -i :"$port" -s TCP:LISTEN | head -n 1)


    if [ -n "$pid" ]; then
        echo "$pid"
    else
        echo "No process found using port $port"
    fi
}

terminate_backend() {
    local backend_pid=$1

    if [ -n "$backend_pid" ]; then
        echo "Terminating backend process with PID $backend_pid"
        kill "$backend_pid"
    else
        echo "No process found using port 5002"
    fi
}

launch_backend() {
    cd "$backend_path" || exit

    python -m pipenv run flask db upgrade
    python -m pipenv run python  src/main.py &

    backend_pid=$!
}

launch_frontend() {
    cd "$frontend_path" || exit

    npm run dev
}

trap 

launch_backend

sleep 15

launch_frontend &

echo "** NO trap"

backend_pid=$(find_pid_by_port 5002)
trap ctrl_c INT

function ctrl_c() {
    terminate_backend "$backend_pid"
}

wait
