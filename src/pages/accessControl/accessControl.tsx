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

const AccessControl: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [listUsers, setListUsers] = useState<any[]>();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/usuarios", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const users = await response.json();
        if (JSON.stringify(users) !== JSON.stringify(listUsers)) {
          setListUsers(users);
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
      </CardGeneral>
    </>
  );
};

export default AccessControl;
