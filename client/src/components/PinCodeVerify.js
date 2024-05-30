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
  const { onClose = () => {}, onSubmit = () => {} } = props;

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
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          onSubmit();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const pinCode = formJson.pinCode;
          console.log(pinCode);
        },
      }}
    >
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="pinCode"
          name="pinCode"
          label="Enter your Pin Code"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Subscribe</Button>
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
