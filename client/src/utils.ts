import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const getImageUrl = (path: string) => {
  return new URL(`./assets/${path}`, import.meta.url).href;
};

export const swalNormalAlert = (warning: string) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: warning,
  });
};
