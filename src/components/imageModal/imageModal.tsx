import { Box, IconButton, Modal } from "@mui/material";
import React from "react";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  src?: string;
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

const ImageModal: React.FC<ModalProps> = (props: ModalProps) => {
  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onBackdropClick={props.onClose}
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{ position: "absolute", top: 5, right: 5, color: "#AEAEAE" }}
        >
          <DisabledByDefaultRoundedIcon />
        </IconButton>
        <div
          style={{
            marginTop: "5%",
            width: "100%",
            height: "auto",
          }}
        >
          <img src={props.src} style={{ width: "100%", height: "auto" }} />
        </div>
      </Box>
    </Modal>
  );
};

export default ImageModal;
