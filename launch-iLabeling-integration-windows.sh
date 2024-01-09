#!/bin/bash
source .env

backend_path=$BACKEND_PATH
frontend_path=$FRONTEND_PATH
routine_integration_path=$ROUTINE_INTEGRATION_PATH
mock_wiptrack_path=$MOCK_ILABELING_PATH

find_pid_by_port() {
    local port=$1
    local pid=$(lsof -t -i :"$port" -s TCP:LISTEN | head -n 1)


    if [ -n "$pid" ]; then
        echo "$pid"
    else
        echo "No process found using port $port"
    fi
}

#BACK-END

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
    python -m pipenv run python src/main.py &

    backend_pid=$!
}

#ROUTINE INTEGRATION

launch_get_banco_data() {
    cd "$routine_integration_path" || exit
    
    python getBancoData.py &

    get_banco_data_pid=$!
}

launch_melhorias_iLabeling() {
    cd "$routine_integration_path" || exit
    
    python Melhorias_iLabeling.py &

    # melhorias_iLabeling_pid=$!
}

terminate_routine_integration() {
    local get_banco_data_pid=$1

    if [ -n "$get_banco_data_pid" ]; then
        echo "Terminating routine integration process with PID $get_banco_data_pid"
        kill "$get_banco_data_pid"
    else
        echo "No process found using port 5002"
    fi
}

#MOCK WIPTRACK

launch_mock_wiptrack() {
    cd "$mock_wiptrack_path" || exit

    python -m pipenv run python src/main.py &

    mock_wiptrack_pid=$!
}

terminate_mock_wiptrack() {
    local mock_wiptrack_pid=$1

    if [ -n "$mock_wiptrack_pid" ]; then
        echo "Terminating mock wiptrack process with PID $mock_wiptrack_pid"
        kill "$mock_wiptrack_pid"
    else
        echo "No process found using port 5001"
    fi
}

#FRONT-END

launch_frontend() {
    cd "$frontend_path" || exit

    npm run dev
}

echo "Mock wiptrack"
launch_mock_wiptrack 

sleep 15

echo "backend"
launch_backend

sleep 15

echo "Get banco data"
launch_get_banco_data

sleep 15

echo "Melhorias iLabeling"
launch_melhorias_iLabeling 

sleep 15

echo "front-end"
launch_frontend &

backend_pid=$(find_pid_by_port 5002)
mock_wiptrack_pid=$(find_pid_by_port 5001)
get_banco_data_pid=$(find_pid_by_port 5000)

trap ctrl_c INT

function ctrl_c() {
    terminate_backend "$backend_pid"
    terminate_routine_integration "$get_banco_data_pid"
    terminate_mock_wiptrack "$mock_wiptrack_pid"
}

wait
