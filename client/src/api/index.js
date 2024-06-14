import axios from "axios";
import { HOST } from "../utils";

const apiUrl = `${HOST}/api/users`;

const getAllUsers = async () => {
  try {
    const data = await axios.get(apiUrl);
    let res = data.data.data;
    const newData = [];
    for (const key in res) {
      newData.push(res[key]);
    }
    return newData;
  } catch (error) {
    return error.response;
  }
};

const createNewUser = async (data) => {
  try {
    const res = await axios.post(apiUrl, data);
    return res;
  } catch (error) {
    return error.response;
  }
};

const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/${id}`);
    return res;
  } catch (error) {
    return error.response;
  }
};

const deleteUserRequest = async () => {
  try {
    const res = await axios.delete(apiUrl);
    return res;
  } catch (error) {
    return error.response;
  }
};

const verifyUser = async (id, pinCode) => {
  try {
    const res = await axios.post(`${apiUrl}/${id}`, {
      pinCode: Number(pinCode),
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const getRequestUser = async () => {
  try {
    const res = await axios.get(`${apiUrl}/verify`);
    return res.data;
  } catch (error) {
    return error.response;
  }
};

const updateUser = async (id, data) => {
  try {
    const res = await axios.patch(`${apiUrl}/${id}`, data);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const API = {
  getAllUsers,
  deleteUser,
  createNewUser,
  verifyUser,
  getRequestUser,
  updateUser,
  deleteUserRequest,
};
