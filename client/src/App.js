import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import "./App.css";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  duration,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import Fade from "@mui/material/Fade";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ConfirmDialog from "./components/ConfirmDialog";
import PinCodeVerify, { PinCodeVerifyUtils } from "./components/PinCodeVerify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "8px",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const API = "http://localhost:8000/api/users";

function App() {
  const [data, setData] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [userSelected, setUserSelected] = useState({});

  const [dialog, setDialog] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    pinCode: "",
    nfcId: "",
  });

  const getAllUsers = async () => {
    try {
      const data = await axios.get(API);
      let res = data.data.data;
      const newData = [];
      for (const key in res) {
        newData.push(res[key]);
      }
      setData(newData);
    } catch (error) {
      openSnackBar("failed", "error");
    }
  };

  const createNewUser = async (data) => {
    try {
      const res = await axios.post(API, data);
      setOpen(false);
      if (res.status === 200) {
        openSnackBar("Create new user success", "success");
      }
    } catch (error) {
      openSnackBar("failed", "error");
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(`${API}/${id}`);
      if (res.status === 200) {
        openSnackBar("Delete user success", "success");
      }
    } catch (error) {
      openSnackBar("failed", "error");
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const openSnackBar = (mess, variant) => {
    enqueueSnackbar(mess, {
      variant: variant,
      autoHideDuration: 1000,
      anchorOrigin: { horizontal: "right", vertical: "top" },
    });
    getAllUsers();
  };

  const renderData = () => {
    return data.map((ite, index) => (
      <div key={index} className="userItem">
        <div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {ite.name}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ID: {ite._id}
          </Typography>
        </div>
        <Button
          color="warning"
          variant="contained"
          onClick={() => {
            setOpen(true);
            setUserSelected(ite);
          }}
        >
          Edit
        </Button>
      </div>
    ));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createNewUser(newUser);
  };

  const hanldeChangeText = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const renderAddModal = () => {
    return (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add user
        </Typography>
        <div className="space" />
        <div className="fieldsModal">
          <TextField
            onChange={hanldeChangeText}
            name="name"
            id="outlined-basic"
            label="Name"
            variant="outlined"
            required
          />
          <div className="space" />
          <TextField
            onChange={hanldeChangeText}
            name="pinCode"
            id="out"
            label="Pin Code"
            variant="outlined"
            required
          />
          <div className="space" />
          <TextField
            onChange={hanldeChangeText}
            name="nfcId"
            id="outlin"
            label="NFC ID"
            variant="outlined"
            required
          />
        </div>
        <div className="space" />
        <div className="footerModal">
          <Button
            color="error"
            variant="outlined"
            style={{ marginLeft: 10 }}
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" style={{ marginLeft: 10 }}>
            Submit
          </Button>
        </div>
      </>
    );
  };

  const renderEditModal = () => {
    return (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit user
        </Typography>
        <div className="space" />
        <div className="fieldsModal">
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={userSelected?.name}
          />
          <div className="space" />
          <TextField id="outlined-basic" label="NFC ID" variant="outlined" />
        </div>
        <div className="space" />
        <div className="footerModal">
          <Button
            color="error"
            variant="outlined"
            style={{ marginLeft: 10 }}
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setDialog(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={() => {
              handleClose();
            }}
          >
            Submit
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <SnackbarProvider maxSnack={5} />
      <PinCodeVerify />
      <ConfirmDialog
        title={"Confirm!"}
        description="After delete this user is not exist on DB"
        isOpen={dialog}
        onClose={() => {
          setDialog(false);
        }}
        onConfirm={() => {
          setDialog(false);
          deleteUser(userSelected._id);
          handleClose();
        }}
      />
      <Helmet bodyAttributes={{ style: "background-color : #1E293B" }} />
      <div className="container">
        <Button
          color="error"
          variant="outlined"
          style={{ marginLeft: 10 }}
          onClick={() => {
            PinCodeVerifyUtils.show();
          }}
        >
          Test
        </Button>
        <Modal
          closeAfterTransition
          onTransitionExited={() => {
            setUserSelected({});
          }}
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Fade in={isOpen}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
              {userSelected?._id ? renderEditModal() : renderAddModal()}
            </Box>
          </Fade>
        </Modal>
        <div className="inputGr">
          <Button
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setOpen(true);
            }}
          >
            Add user
          </Button>
        </div>
        <div className="space" />
        <div className="containerUsers">
          <div style={{ width: "500px" }}>{renderData()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
