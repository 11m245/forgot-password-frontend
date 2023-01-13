import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { createContext } from "react";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { Forgot } from "./components/Forgot";
import { Success } from "./components/success.js";
import { Routes, Route, Outlet } from "react-router-dom";
import { NotFound } from "./components/notfound";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
export const apiContext = createContext();
function App() {
  const serverapi = "https://forgot-password-backend.vercel.app";
  //  const serverapi = "http://localhost:4000";
  return (
    <div className="App">
      <ToastContainer theme="dark" />
      <div className="project-container">
        <apiContext.Provider
          value={{
            api: serverapi,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<LoginForm />}></Route>
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/forgot-password" element={<Forgot />} />
              <Route path="/success" element={<Success />} />
            </Route>
            <Route path="*" element={<NotFound />} />

            <Route
              path="/change-password/:id"
              element={<ChangePasswordForm />}
            />
          </Routes>
        </apiContext.Provider>
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <h1>Welcome to Short Url Application</h1>
      <Outlet />
    </>
  );
}

export default App;
