import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./App.css";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import Fade from "@mui/material/Fade";
import { SnackbarProvider } from "notistack";
import ConfirmDialog from "./components/ConfirmDialog";
import PinCodeVerify, { PinCodeVerifyUtils } from "./components/PinCodeVerify";
import { API } from "./api";
import { ShowSnackBar } from "./utils";
import LoadingModal, { LoadingModalUtils } from "./components/LoadingModal";

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

const baseData = {
  id: "",
  name: "",
  pinCode: "",
  nfcId: "",
};

let timeout = null;
let interval = null;

function App() {
  const [data, setData] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [userSelected, setUserSelected] = useState(baseData);

  const [dialog, setDialog] = useState(false);

  const [isVerified, setVerify] = useState(false);

  const [newUser, setNewUser] = useState(baseData);

  const getAllUsers = async () => {
    const data = await API.getAllUsers();
    if (data) {
      setData(data);
    } else {
      openSnackBar("failed", "error");
    }
  };

  const createNewUser = async (data) => {
    const res = await API.createNewUser(data);
    getAllUsers();
    if (res.status === 200) {
      setOpen(false);
      openSnackBar("Create new user success", "success");
    } else {
      openSnackBar("failed", "error");
    }
  };

  const deleteUser = async (id) => {
    const res = await API.deleteUser(id);
    getAllUsers();
    if (res.status === 200) {
      openSnackBar("Delete user success", "success");
    } else {
      openSnackBar("failed", "error");
    }
  };

  const verifyUser = async (id, pinCode) => {
    const res = await API.verifyUser(id, pinCode);
    setVerify(res.status === 200);
    if (res.status === 200) {
      openSnackBar("Verify success", "success");
      PinCodeVerifyUtils.hide();
    } else {
      openSnackBar("Verify failed", "error");
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const getRequestUser = async () => {
    await API.createNewUser({
      name: "null",
      pinCode: null,
      nfcId: null,
    });
    timeout = setTimeout(async () => {
      clearInterval(interval);
      handleClose();
      LoadingModalUtils.hide();
      openSnackBar("Failed, please insert your NFC card", "warning");
      await API.deleteUserRequest();
    }, 3000);
    interval = setInterval(async () => {
      const res = await API.getRequestUser();
      if (res?.data[0]?.nfcId) {
        await API.deleteUser(res.data[0]._id);
        setNewUser({
          id: res.data[0]._id,
          name: "",
          pinCode: 0,
          nfcId: res.data[0].nfcId,
        });
        clearInterval(interval);
        clearTimeout(timeout);
      }
    }, 500);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setVerify(false);
  };

  const openSnackBar = (mess, variant) => {
    ShowSnackBar(mess, variant);
    // getAllUsers();
  };

  const renderData = () => {
    return data?.map((ite, index) => (
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
            // setOpen(true);
            setUserSelected({
              id: ite._id,
              name: ite.name,
              nfcId: ite.nfcId,
              pinCode: ite.pinCode,
            });
            PinCodeVerifyUtils.show();
          }}
        >
          Edit
        </Button>
      </div>
    ));
  };

  const updateUser = async (id, data) => {
    try {
      const res = await API.updateUser(id, data);
      setUserSelected(baseData);
      getAllUsers();
      if (res.status === 200) {
        openSnackBar("Update user success", "success");
      } else {
        openSnackBar("Update user failed", "error");
      }
    } catch (error) {
      openSnackBar("failed", "error");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userSelected.id) {
      updateUser(userSelected.id, {
        name: userSelected.name,
        pinCode: userSelected.pinCode,
        nfcId: userSelected.nfcId,
      });
    } else {
      console.log(newUser);
      createNewUser(newUser);
    }
  };

  const hanldeChangeNewUser = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const hanldeChangeEditUser = (e) => {
    setUserSelected({
      ...userSelected,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!!newUser.nfcId) {
      LoadingModalUtils.hide();
      return;
    }
    if (isOpen && !userSelected?.id) {
      LoadingModalUtils.show();
    }
  }, [isOpen, userSelected, newUser.nfcId]);

  const renderAddModal = () => {
    return (
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add user
        </Typography>
        <div className="space" />
        <div className="fieldsModal">
          <TextField
            value={newUser.name}
            onChange={hanldeChangeNewUser}
            name="name"
            id="outlined-basic"
            label="Name"
            variant="outlined"
            required
          />
          <div className="space" />
          <TextField
            value={newUser.pinCode}
            onChange={hanldeChangeNewUser}
            name="pinCode"
            id="out"
            label="Pin Code"
            type="number"
            variant="outlined"
            required
          />
          <div className="space" />
          <TextField
            value={newUser.nfcId}
            onChange={hanldeChangeNewUser}
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
              setNewUser({
                id: "",
                name: "",
                pinCode: "",
                nfcId: "",
              });
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
            name="name"
            variant="outlined"
            required
            value={userSelected?.name}
            onChange={hanldeChangeEditUser}
          />
          <div className="space" />
          <TextField
            id="outlined-basic"
            label="Pin code"
            name="pinCode"
            variant="outlined"
            required
            value={userSelected?.pinCode}
            onChange={hanldeChangeEditUser}
          />
          <div className="space" />
          <TextField
            id="outlined-basic"
            label="NFC ID"
            name="nfcId"
            variant="outlined"
            required
            value={userSelected?.nfcId}
            onChange={hanldeChangeEditUser}
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
            type="submit"
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
      <LoadingModal />
      <PinCodeVerify
        onTransitionExited={() => {
          if (isVerified) {
            setOpen(true);
          } else {
            setUserSelected({});
          }
        }}
        title={`Verify "${userSelected?.name}"`}
        onSubmit={async (data) => {
          verifyUser(userSelected.id, data.pinCode);
        }}
      />
      <ConfirmDialog
        title={"Confirm!"}
        description="After delete this user is not exist on DB"
        isOpen={dialog}
        onClose={() => {
          setDialog(false);
        }}
        onConfirm={() => {
          setDialog(false);
          deleteUser(userSelected.id);
          handleClose();
        }}
      />
      <Helmet bodyAttributes={{ style: "background-color : #1E293B" }} />
      <div className="container">
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
              {userSelected?.id ? renderEditModal() : renderAddModal()}
            </Box>
          </Fade>
        </Modal>
        <div className="inputGr">
          <Button
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setOpen(true);
              getRequestUser();
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
