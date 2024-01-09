import React, { useCallback, useEffect, useState } from "react";
import CustomMenu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import Title from "../../components/textTitle/textTitle";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SimpleButton from "../../components/simpleButton/simpleButton";
import { useNavigate } from "react-router-dom";
import AccessControlItem from "../../components/accessControlItem/accessControlItem";
import { useStyles } from "./styles";
import axiosInstance from "../../services/instanceAxios";

const AccessControl: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [listUsers, setListUsers] = useState<any[]>();
  const userToken = localStorage.getItem("jwtToken");
  const userProfile = sessionStorage.getItem("profile");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/usuarios", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const users = await response.json();
        if (JSON.stringify(users) !== JSON.stringify(listUsers)) {
          setListUsers(users);
          await axiosInstance
            .post("usersIHM", {
              users: users,
            })
            .then((res) => {
              console.log("Success users post CLP", res);
            })
            .catch((res) => console.log(res));
        }
      }
    } catch (e) {
      console.error("Failed to get users", e);
    }
  }, [listUsers]);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchUsers]);

  const handleNewUserClick = () => {
    navigate("/registeruser");
  };

  const handleUserActionLogs = () => {
    navigate("/actionslogs");
  };

  return (
    <>
      <CustomMenu />
      <CardGeneral>
        <Title title="Access Control" className={classes.title} />
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>Email</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Access Type
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Token</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listUsers &&
                listUsers.map(
                  (data: any, index: React.Key | null | undefined) => (
                    <AccessControlItem data={data} key={index} />
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.buttonContainer}>
          <SimpleButton
            title="Create New User"
            personalisedStyle={classes.button}
            onClick={handleNewUserClick}
          />
        </div>
        <div className={classes.viewbuttonContainer}>
          {userProfile == "IT" && (
            <SimpleButton
              title="View users actions"
              personalisedStyle={classes.button}
              onClick={handleUserActionLogs}
            />
          )}
        </div>
      </CardGeneral>
    </>
  );
};

export default AccessControl;
