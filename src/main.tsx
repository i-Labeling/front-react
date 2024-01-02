import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home/home.tsx";
import LogsInfo from "./pages/logsInfo/logInfo.tsx";
import ConfSetup from "./pages/confSetup/confSetup.tsx";
import EndProcess from "./pages/endProcess/endProcess.tsx";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import Test from "./pages/testPage/testPage.tsx";
import Login from "./pages/Login/login.tsx";
import GridInspection from "./pages/gridInspection/gridInspection.tsx";
import { GlobalStateProvider } from "./contexts/globalStateContext.tsx";
import RegisterUser from "./pages/registerUser/registerUser.tsx";
import EditUser from "./pages/editUser/editUser.tsx";
import AccessControl from "./pages/accessControl/accessControl.tsx";
import { UserProvider } from "./contexts/userStateContext.tsx";
import { ToastContainer, toast } from "react-toastify";
import PrivateRoutes from "./components/privateRoutes/privateRoutes.tsx";
import UserActionsLogs from "./pages/userActionsLogs/userActionsLogs.tsx";

type Profile = "ADMIN" | "OPERATOR" | "IT";

interface PrivateRouteProps {
  profileRequired: Profile;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  profileRequired,
  children,
}) => {
  const userProfile = sessionStorage.getItem("profile");
  const navigate = useNavigate();

  const hasRequiredProfile = userProfile === profileRequired;

  React.useEffect(() => {
    if (!hasRequiredProfile) {
      toast.error("User does not have the required profile");
      navigate("/home");
    }
  }, [hasRequiredProfile]);

  return hasRequiredProfile && <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GlobalStateProvider>
    <UserProvider>
      <React.StrictMode>
        <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route path="/logs" element={<LogsInfo />} />
              <Route path="/conf" element={<ConfSetup />} />
              <Route path="/end" element={<EndProcess />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test" element={<Test />} />
              <Route path="/gridinspection" element={<GridInspection />} />
              <Route path="/registeruser" element={<RegisterUser />} />
              <Route path="/edituser" element={<EditUser />} />
              <Route
                path="/accesscontrol"
                element={
                  <PrivateRoute profileRequired="IT">
                    <AccessControl />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/actionslogs"
                element={
                  <PrivateRoute profileRequired="IT">
                    <UserActionsLogs />{" "}
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<Login />} path="/" />
          </Routes>
        </Router>
        <ToastContainer />
      </React.StrictMode>
    </UserProvider>
  </GlobalStateProvider>
);
