import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TokenModal from "../tokenModal/tokenModal";
import { useStyles } from "./styles";
import ConfirmationModal from "../confirmationModal/confirmationModal";
import { toast } from "react-toastify";

interface AccessControlItemProps {
  data: any;
}

const AccessControlItem: React.FC<AccessControlItemProps> = (
  props: AccessControlItemProps
) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const userToken = localStorage.getItem("jwtToken");
  const [token, setToken] = useState<any>();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const options = ["Edit user", "Remove user", "Regenerate token"];

  const ITEM_HEIGHT = 48;

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

  const handleEdit = async (id: number) => {
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
    try {
      const response = await fetch("http://127.0.0.1:5002/user/delete", {
        method: "DELETE",
        body: JSON.stringify({ id: props.data.id }),
      });

      if (response.ok) {
        toast.success("User successfully removed!");
        setOpenRemoveModal(false);
      }
    } catch (e) {
      toast.error("Failed to delete user!");
      console.error("Failed to delete user", e);
    }
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const regenerateToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/update-token", {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          id: props.data.id,
        }),
      });

      if (response.ok) {
        const { tokenUser } = await response.json();
        toast.success("User Token successfully generated!");
        setToken(tokenUser);
        setOpenTokenModal(true);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
    }
  };

  const handleRemove = () => {
    setOpenRemoveModal(true);
  };

  const handleMenu = (selectedOption: string) => {
    setAnchorEl(null);

    switch (selectedOption) {
      case "Edit user":
        handleEdit(props.data.id);
        break;
      case "Remove user":
        handleRemove();
        break;
      case "Regenerate token":
        regenerateToken();
        break;
      default:
        break;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const maskToken = (token: string) => {
    const maskedPart = "*".repeat(Math.min(token.length, 7));
    return maskedPart;
  };

  return (
    <>
      <TableRow key={props.data.id}>
        <TableCell className={classes.tableBodyCell}>
          {props.data.login}
        </TableCell>
        <TableCell className={classes.tableBodyCell}>{profileName}</TableCell>
        <TableCell className={classes.tableBodyCell}>
          <div className={classes.tokenCell}>
            {maskToken(props.data.token ?? "123232")}
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
