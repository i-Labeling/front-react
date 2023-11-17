import { Box, Button, Grid, IconButton, Modal } from "@mui/material";
import React from "react";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import { useStyles } from "./styles";
import SplitMessage from "../splitMessage/splitMessage";

interface ModalProps {
  open: boolean;
  onConfirmButton: () => void;
  onClose: () => void;
  title: string;
  subtitle?: string;
  token?: number;
  message?: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "10%",
  minHeight: "15%",
  bgcolor: "background.paper",
  boxShadow: 24,
  boxRadius: 10,
  p: 4,
  textAlign: "center",
};

const TokenModal: React.FC<ModalProps> = (props: ModalProps) => {
  const classes = useStyles();
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} onClick={handleBackdropClick}>
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{ position: "absolute", top: 5, right: 5, color: "#AEAEAE" }}
        >
          <DisabledByDefaultRoundedIcon />
        </IconButton>
        <div style={{ marginTop: "15%" }}>
          <h2 className={classes.text}>{props.title}</h2>
          <h3 className={classes.text}>{props.subtitle}</h3>
          <h2 className={classes.text}>{props.token}</h2>
          <SplitMessage className={classes.message} message={props.message} />
        </div>
        <div className={classes.grid}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={props.onConfirmButton}
                className={classes.button}
                style={{
                  textTransform: "none",
                }}
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
};

export default TokenModal;
