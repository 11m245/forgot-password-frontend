import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useFormik } from "formik";
import * as yup from "yup";
import { useContext, useRef, useState } from "react";
import { apiContext } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Forgot() {
  const { api } = useContext(apiContext);
  const [isVerifiedUser, setIsVerifiedUser] = useState(false);
  const [isWrongUser, setIsWrongUser] = useState(false);
  const [isOptedReset, setIsOptedReset] = useState(false);
  const usernameRef = useRef(null);
  const navigate = useNavigate();
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        username: "",
      },
      validationSchema: yup.object({
        username: yup.string().required().min(6),
      }),
      onSubmit: () => {
        // console.log(values);
        verifyUser(values);
      },
    });

  async function checkResponse(response) {
    if (response.status === 200) {
      setIsVerifiedUser(true);
      setIsWrongUser(false);
      setIsOptedReset(false);
    } else {
      setIsVerifiedUser(false);
      setIsWrongUser(true);
      setIsOptedReset(false);
    }
  }

  function verifyUser(values) {
    // console.log("verify user called");
    fetch(`${api}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => checkResponse(response))
      .catch((err) => console.log(err));
  }

  async function checkResponseForReset(response) {
    const data = await response.json();
    if (response.status === 200) {
      toast.success(data.message);
      setIsOptedReset(true);
      setIsVerifiedUser(true);
      setIsWrongUser(false);
    } else {
      toast.error(data.message);
      setIsVerifiedUser(false);
      setIsWrongUser(true);
      setIsOptedReset(true);
    }
  }

  function sendResetLink(user) {
    // console.log("send link request for user", user);
    fetch(`${api}/sendResetLink`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => checkResponseForReset(response))

      .catch((err) => console.log(err));
  }
  return (
    <>
      <h3>Forgot Password?</h3>
      <form onSubmit={handleSubmit} className="verify-user-form form">
        <TextField
          id="username"
          type="text"
          label="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.username && errors.username ? true : false}
          helperText={
            touched.username && errors.username ? errors.username : null
          }
          inputRef={usernameRef}
        />

        <Button
          type="submit"
          className="verify-user-button"
          variant="contained"
        >
          verify user
        </Button>
      </form>

      {isVerifiedUser ? (
        <Button
          type="submit"
          className="verify-user-button"
          variant="contained"
          endIcon={<LockResetIcon />}
          onClick={() => sendResetLink({ username: usernameRef.current.value })}
        >
          Password Reset
        </Button>
      ) : null}

      {(isOptedReset && isVerifiedUser) === true ? (
        <p>
          Password Reset Link hasbeen sent to your email id please use the link
          and reset
        </p>
      ) : null}
      {isWrongUser ? (
        <div>
          <p>
            Invalid User please Verify your email/username or register yourself
          </p>
          <Button
            onClick={() => navigate("/signup")}
            variant="outlined"
            color="success"
            startIcon={<PersonAddIcon />}
          >
            Sign Up
          </Button>
        </div>
      ) : null}
    </>
  );
}
