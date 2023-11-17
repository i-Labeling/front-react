import { Box, Button, Grid, IconButton, Modal } from "@mui/material";
import React from "react";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import { useStyles } from "./styles";

interface ModalProps {
  open: boolean;
  onPositiveButton: () => void;
  onNegativeButton: () => void;
  onClose: () => void;
  text: string;
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
};

const CustomModal: React.FC<ModalProps> = (props: ModalProps) => {
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
          <h2 className={classes.text}>{props.text}</h2>
        </div>
        <div className={classes.grid}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={props.onPositiveButton}
                className={classes.button}
                style={{
                  textTransform: "none",
                }}
              >
                Yes
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={props.onNegativeButton}
                className={classes.negativeButton}
                style={{
                  textTransform: "none",
                }}
              >
                No
              </Button>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
};

export default CustomModal;
