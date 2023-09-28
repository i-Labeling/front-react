import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {   createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from './pages/home/home.tsx';
import LogsInfo from './pages/logsInfo/logInfo.tsx';
import ConfSetup from './pages/confSetup/confSetup.tsx';
import EndProcess from './pages/endProcess/endProcess.tsx';
import Dashboard from './pages/dashboard/dashboard.tsx';
import Test from './pages/testPage/testPage.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/logs",
    element: <LogsInfo/>
  },
  {
    path: "/conf",
    element: <ConfSetup/>
  },
  {
    path: "/end",
    element: <EndProcess/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "/test",
    element: <Test/>
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
