import React from "react";

import { TableCell, TableRow } from "@mui/material";
import { useStyles } from "./styles";

interface UserActionItemProps {
  data: any;
}

const UserActionItem: React.FC<UserActionItemProps> = (
  props: UserActionItemProps
) => {
  const classes = useStyles();

  const getProfileName = (profileId: number) => {
    switch (profileId) {
      case 1:
        return "Maintenance";
      case 2:
        return "Operator";
      case 3:
        return "Manager";
      default:
        return "";
    }
  };

  const profileName = getProfileName(props.data.profile);

  return (
    <>
      <TableRow key={props.data.id}>
        <TableCell className={classes.tableBodyCell}>
          {props.data.login}
        </TableCell>
        <TableCell className={classes.tableBodyCell}>{profileName}</TableCell>
        <TableCell className={classes.tableBodyCell}>
          {props.data.date}
        </TableCell>
        <TableCell className={classes.tableBodyCell}>
          {props.data.hour}
        </TableCell>
        <TableCell className={classes.tableBodyCell}>
          {props.data.action}
        </TableCell>
      </TableRow>
    </>
  );
};

export default UserActionItem;
