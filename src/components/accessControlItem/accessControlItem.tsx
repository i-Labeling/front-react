import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TokenModal from "../tokenModal/tokenModal";
import { useStyles } from "./styles";
import ConfirmationModal from "../confirmationModal/confirmationModal";

interface AccessControlItemProps {
  data: any;
}

const AccessControlItem: React.FC<AccessControlItemProps> = (
  props: AccessControlItemProps
) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [token, setToken] = useState<number>();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const options = ["Edit user", "Remove user", "Regenerate token"];

  const ITEM_HEIGHT = 48;

  const handleEdit = async (id: number) => {
    // Handle edit action with the specific ID
    console.log(`Edit clicked for ID: ${id}`);
    navigate(`/edituser?id=${id}`);
  };

  const handleCloseModal = () => {
    setOpenTokenModal(false);
  };

  const handleConfirmModal = () => {
    setOpenTokenModal(false);
  };

  const handleCloseRemoveModal = () => {
    setOpenRemoveModal(false);
  };

  const handleConfirmRemoveModal = async () => {
    await fetch("http://127.0.0.1:5002/user/delete", {
      method: "DELETE", // Alterado para POST
      body: JSON.stringify({ id: props.data.id }),
    });
    setOpenRemoveModal(false);
  };

  const regenerateToken = (id: number) => {
    // Handle edit action with the specific ID
    console.log(`Regenerating token to ID: ${id}`);

    //Create function to generate the token
    setToken(344544);
    setOpenTokenModal(true);
  };

  const handleRemove = (id: number) => {
    // Handle remove action with the specific ID
    console.log(`Remove clicked for ID: ${id}`);
    setOpenRemoveModal(true);
  };

  const handleMenu = (selectedOption: string) => {
    setAnchorEl(null);

    switch (selectedOption) {
      case "Edit user":
        handleEdit(props.data.id);
        break;
      case "Remove user":
        handleRemove(props.data.id);
        break;
      case "Regenerate token":
        regenerateToken(props.data.id);
        break;
      default:
        break;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //TO DO: Verificar log ingo e mostrar password para o dono do acesso
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const maskToken = (token: string | any[]) => {
    return showPassword ? token : "*".repeat(token.length);
  };

  return (
    <>
      <TableRow key={props.data.id}>
        <TableCell className={classes.tableBodyCell}>{props.data.id}</TableCell>
        <TableCell className={classes.tableBodyCell}>
          {props.data.login}
        </TableCell>
        <TableCell className={classes.tableBodyCell}>
          {props.data.profile}
        </TableCell>
        <TableCell className={classes.tableBodyCell}>
          <div className={classes.tokenCell}>
            {/* {maskToken(props.data.token)} */}
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenu}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={() => handleMenu(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </TableCell>
      </TableRow>
      <ConfirmationModal
        open={openRemoveModal}
        onClose={handleCloseRemoveModal}
        onNegativeButton={handleCloseRemoveModal}
        onPositiveButton={handleConfirmRemoveModal}
        text={"Are you sure you want to delete it?"}
      />
      <TokenModal
        open={openTokenModal}
        onClose={handleCloseModal}
        onConfirmButton={handleConfirmModal}
        title="User Registered!"
        subtitle="This is your unique  token:"
        message="Make sure to take notes,\n one time exhibition token"
        token={token}
      />
    </>
  );
};

export default AccessControlItem;
