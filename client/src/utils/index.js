import { enqueueSnackbar } from "notistack";

export const ShowSnackBar = (mess, variant) => {
  enqueueSnackbar(mess, {
    variant: variant,
    autoHideDuration: 1500,
    anchorOrigin: { horizontal: "right", vertical: "top" },
  });
};

export const HOST = "http://192.168.179.173:8000";
