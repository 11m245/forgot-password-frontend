import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { apiContext } from "../App";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export function ChangePasswordForm() {
  const { id } = useParams();
  const { api } = useContext(apiContext);
  const [userName, setUserName] = useState(" ");
  const [isApiLoded, setIsApiLoaded] = useState(false);
  const navigate = useNavigate();
  // console.log(api);
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        username: userName,
        password: "",
        cpassword: "",
      },
      enableReinitialize: true,
      validationSchema: yup.object({
        password: yup.string().required().min(8),
        cpassword: yup.string().required().min(8),
      }),
      onSubmit: () => {
        // console.log(values);
        updatePassword(values);
      },
    });
  // async function checkResponse(response) {
  //   let data = await response.json();
  //   // console.log("ck", data);
  //   if (response.status === 200) {
  //     toast.success(data.message);
  //     navigate("/success");
  //     return data;
  //   } else {
  //     toast.error(data.message);
  //   }
  // }
  async function checkPostPasswordResponse(response) {
    const data = await response.json();
    if (response.status === 200) {
      // toast.success(data.message);
      data.message === "Password Change Success"
        ? toast.success(data.message)
        : toast.error(data.message);
      navigate("/");
      return data;
    } else {
      console.log(data.message);
    }
  }
  function updatePassword(values) {
    fetch(`${api}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", resetToken: `${id}` },
      body: JSON.stringify(values),
    })
      .then((response) => checkPostPasswordResponse(response))
      .catch((error) => console.log(error));
  }
  function checkTokenResponse(response) {
    const data = response.json();
    if (response.status === 200) {
      return data;
    } else {
      console.log("error in response got");
    }
  }
  useEffect(() => {
    if (isApiLoded === false) {
      fetch(`${api}/change-password`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          resetToken: `${id}`,
        },
      })
        .then((response) => checkTokenResponse(response))
        .then((data) => {
          setUserName(data.username);
          values.username = userName;
        })
        .then(setIsApiLoaded(true))
        .catch((err) => console.log(err));
    }
  }, [isApiLoded]);
  return (
    <>
      <form onSubmit={handleSubmit} className="login-form form">
        <h3>Change Password Form</h3>
        <h4>hi {userName}</h4>
        <TextField
          id="username"
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled
          error={touched.username && Boolean(errors.username)}
          helperText={
            touched.username && errors.username ? errors.username : null
          }
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && Boolean(errors.password)}
          helperText={
            touched.password && errors.password ? errors.password : null
          }
        />
        <TextField
          id="cpassword"
          label="Confirm Password"
          type="cpassword"
          name="cpassword"
          value={values.cpassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.cpassword && Boolean(errors.cpassword)}
          helperText={
            touched.cpassword && errors.cpassword ? errors.cpassword : null
          }
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
        <div className="signup-forgot d-flex justify-content-between">
          <Link to="/signup" className="link-primary">
            Don't have an account? Sign Up
          </Link>
          <Link to="/forgot-password" className="link-danger text-danger">
            ResetPassword
          </Link>
        </div>
      </form>
    </>
  );
}
