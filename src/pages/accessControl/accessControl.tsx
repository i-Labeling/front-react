import React, { useEffect, useState } from "react";
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
import { useUser } from "../../contexts/userStateContext";

const AccessControl: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [listUsers, setListUsers] = useState<any[]>();
  const [listReady, setListReady] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log("list users", listUsers);
  }, [listUsers]);

  const headers = {
    "Content-Type": "application/json",
    //Authorization: `Bearer ${user.token}`,
    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJwcm9maWxlIjoiSVQiLCJyb2xlIjpbIkRBU0hCT0FSRCIsIkNBREFTVFJPIiwiU0VUVVAiLCJQUk9DRVNTTyBDT05UUk9MQURPUiIsIlBST0NFU1NPIElITSIsIk9QRVJBUiBJSE0iXSwiZXhwIjoxNzAxMzI5ODQ0fQ.hrYI58MLxM79-xEV69auZ8E0GhrAWUfCZTha3zVzl4abfQ3Vyp1he9AXyiqT68hd_wLVBkKx6BO_C9Ho0h4aZwVN8ggui-1pK1RL-Qtm9ajQnhpHfh62u2aEPjL4eSR6t2Y76sv865eBrj1Y3vjZJs0rjv6-VqslU46WoCK99n2HEL3y62gE-oS5CumQ4N5_6ssZy8U7XPkdOH4K_stHUP47aCch2mSBwsUetwnhCktCsk1PTwl9JwyjeSBr-1SFtdFCQldemd2g6iiotzbDRHo77-MafYhFufjUglXEQnErvmSiDnxE2womG1Wv9iYTje90Rl9DSt2sEtCYx3I_oXzc2BsK8PiYPH-K8YEyqu8TrgEbHW6j4FmjfHKxww4yZAqTsBDLTGis9aldcbxpBuoQ_VyhbAWhEFy9XM5AHCT7RSs7b85yC6W4zeOadItFcgVs-St6zw9UOA1SiAqMRSrUUpWaJZrssha19dZLNqgwDkwF8x4Ne5uJkqCwZBiF`,
  };

  const getUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/usuarios", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const users = await response.json();
        setListUsers(users);
        setListReady(true);
      }
    } catch (e) {
      console.error("Failed to getting users", e);
    }
  };

  // const dataList = [
  //   { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
  //   {
  //     id: 5664566,
  //     name: "Geanne Tereza",
  //     accessType: "Operator",
  //     token: "GGHHRDFFD",
  //   },
  //   { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
  //   {
  //     id: 5664566,
  //     name: "Geanne Tereza",
  //     accessType: "Operator",
  //     token: "GGHHRDFFD",
  //   },
  //   { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
  //   { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
  //   { id: 7577885, name: "John Doe", accessType: "Admin", token: "ABC123XYZ" },
  // ];

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
