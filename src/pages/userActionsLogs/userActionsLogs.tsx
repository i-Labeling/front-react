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
  TextField,
} from "@mui/material";
import { useStyles } from "./styles";
import UserActionItem from "../../components/userActionItem/userActionItem";

type UserData = {
  login: string;
  profile: number;
};

type UserAction = {
  user_id: number;
  userData: UserData;
};

const UserActionsLogs: React.FC = () => {
  const classes = useStyles();
  const [listUsersActions, setListUsersActions] = useState<any[]>();
  const userToken = localStorage.getItem("jwtToken");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const fetchUsersActions = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/actionslogs", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const users = await response.json();
        users.sort((a: any, b: any) => {
          const [dayA, monthA, yearA] = a.date.split("-").map(Number);
          const [dayB, monthB, yearB] = b.date.split("-").map(Number);

          const dateA = new Date(
            yearA,
            monthA - 1,
            dayA,
            a.hour.split(":")[0],
            a.hour.split(":")[1]
          ).getTime();
          const dateB = new Date(
            yearB,
            monthB - 1,
            dayB,
            b.hour.split(":")[0],
            b.hour.split(":")[1]
          ).getTime();

          return dateB - dateA;
        });
        setListUsersActions(users);
      }
    } catch (e) {
      console.error("Failed to get users actions", e);
    }
  }, [listUsersActions]);

  useEffect(() => {
    fetchUsersActions();
  }, []);

  return (
    <>
      <CustomMenu />
      <CardGeneral>
        <Title title="View User Actions by day" className={classes.title} />
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>Email</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Access Type
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Date</TableCell>
                <TableCell className={classes.tableHeadCell}>Hour</TableCell>
                <TableCell className={classes.tableHeadCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listUsersActions &&
                listUsersActions.map(
                  (data: any, index: React.Key | null | undefined) => (
                    <UserActionItem data={data} key={index} />
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardGeneral>
    </>
  );
};

export default UserActionsLogs;
