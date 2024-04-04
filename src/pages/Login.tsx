import React, { useState } from "react";
import "../styles/signup.css";
import signupImage from "../assets/signup.svg";
import { login } from "../state/counter/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const authValue = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  // const history = useNavigate();
  console.log(authValue);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter values in both fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://todoappapi-nk0o.onrender.com/api/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
     

      if (response.ok) {
        // const jwt = await response.text(); // Assuming the JWT is returned as text
        // console.log("JWT:", jwt);
        const data = await response.json();
        const user = {
          token: data.token,
          isAdmin: data.isAdmin,
        };
        console.log("user", data);
        // Dispatch login action after successful login
        setIsLoading(false);
        dispatch(login(user));
        // window.location.href = "/";
        navigate("/user")
        toast.success("Successfully Logged in")

      } else {
        setIsLoading(false);
         toast.dismiss(); 
         toast.error("Failed to log in. Please check your credentials.");
        console.error("Failed to login. Status:", response.status);
        // Handle failed login, e.g., display error message to the user
      }
 
   
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      toast.error("Invalid Email or Password")
    }
  };

  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPassword(e.target.value);
  };
  if (isLoading) {
        
  //       // toast.promise(Promise.resolve(response), {
  //       //   loading: "Loading...",
  //       //   success: "Login successful!",
  //       //   error: "An error occurred while logging in.",
  //   // });
    toast.dismiss();
    toast.loading("Loading...")
  //   // return;
  }
  console.log(isLoading)
  return (
    <div className="container app">
      <img src={signupImage} alt="" />
      <h3>Login Here!</h3>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="user@example.com"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="*******"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {/* <button
          type="submit"
          className="submitBtn"
          disabled={!email || !password}
        >
          Submit
        </button> */}
        <button
          type="submit"
          className="submitBtn"
          disabled={!email || !password || isLoading}
        >
          {isLoading ? "Logging in..." : "Submit"}
        </button>
        <div className="other">
          <p>Dont't Have an account ?</p>
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </div>
      </form>
      <Toaster position="top-right" richColors />
    </div>
  );
}
