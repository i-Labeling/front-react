import React from "react";
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

  const dataList = [
    { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
    {
      id: 5664566,
      name: "Geanne Tereza",
      accessType: "Operator",
      token: "GGHHRDFFD",
    },
    { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
    {
      id: 5664566,
      name: "Geanne Tereza",
      accessType: "Operator",
      token: "GGHHRDFFD",
    },
    { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
    { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
    { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
  ];

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
                <TableCell className={classes.tableHeadCell}>ID</TableCell>
                <TableCell className={classes.tableHeadCell}>Name</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Access Type
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Token</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((data, index) => (
                <AccessControlItem data={data} key={index} />
              ))}
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
