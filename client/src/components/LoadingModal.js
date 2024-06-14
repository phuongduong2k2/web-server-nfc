import { Box, CircularProgress, Fade, Modal, Typography } from "@mui/material";
import { createRef, useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "8px",
  transform: "translate(-50%, -50%)",
  width: 50,
  bgcolor: "background.paper",
  boxShadow: 24,
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  aspectRatio: 1,
  p: 4,
};

const ref = createRef(null);

const LoadingModal = (props) => {
  const { handleClose = () => {} } = props;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    ref.current = {
      show: () => {
        setOpen(true);
      },
      hide: () => {
        setOpen(false);
      },
    };
  }, [isOpen]);

  return (
    <Modal
      closeAfterTransition
      onTransitionExited={() => {}}
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <CircularProgress />
        </Box>
      </Fade>
    </Modal>
  );
};

export default LoadingModal;

export const LoadingModalUtils = {
  show: () => {
    if (ref.current) {
      ref.current.show();
    }
  },
  hide: () => {
    if (ref.current) {
      ref.current.hide();
    }
  },
};
