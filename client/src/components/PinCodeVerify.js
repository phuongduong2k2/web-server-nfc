import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { createRef, useEffect, useState } from "react";

const ref = createRef(null);

const PinCodeVerify = (props) => {
  const {
    onSubmit = () => {},
    title,
    onClose = () => {},
    onTransitionExited = () => {},
  } = props;

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
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      onTransitionExited={onTransitionExited}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          onSubmit(formJson);
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit this user, you have to enter user's pin code
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="pinCode"
          name="pinCode"
          label="Pin Code"
          type="number"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Verify</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinCodeVerify;

export const PinCodeVerifyUtils = {
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
