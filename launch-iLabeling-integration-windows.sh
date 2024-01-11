#!/bin/bash
source .env

backend_path=$BACKEND_PATH
frontend_path=$FRONTEND_PATH
routine_integration_path=$ROUTINE_INTEGRATION_PATH
api_dashboard_path=$API_DASHBOARD_PATH
mock_wiptrack_path=$MOCK_ILABELING_PATH

#BACK-END
launch_backend() {
    cd "$backend_path" || exit

    python -m pipenv run flask db upgrade
    python -m pipenv run python src/main.py &
}

#ROUTINE INTEGRATION

launch_get_banco_data() {
    cd "$api_dashboard_path" || exit
    
    python getBancoData.py &
}

launch_melhorias_iLabeling() {
    cd "$routine_integration_path" || exit
    
    python Melhorias_iLabeling.py &
}

#MOCK WIPTRACK

launch_mock_wiptrack() {
    cd "$mock_wiptrack_path" || exit

    python -m pipenv run python src/main.py &
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


wait
