import React, { useState } from "react";
import "../styles/signup.css";
import signupImage from "../assets/signup.svg";
import { login } from "../state/counter/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const authValue = useSelector((state: RootState) => state.auth.user);
  // const history = useNavigate();
  console.log(authValue)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter values in both fields");
      return;
    }

    try {
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
console.log("user",data)
        // Dispatch login action after successful login
        dispatch(login(user));
        window.location.href="/"
        // Handle the JWT as needed, e.g., store it in local storage or state
        // localStorage.setItem("sessionTokenTodoApp", jwt);

        // Retrieve the stored data from localStorage
        // const storedData = localStorage.getItem("sessionTokenTodoApp");

        // if (storedData) {
        //   try {
        //     // Parse the stored data as JSON
        //     // const userData = JSON.parse(storedData);

        //     // Check if the isAdmin property exists and is true
        //     // if (userData.isAdmin) {
        //     //   // Redirect to admin dashboard
        //     //  window.location.href="/admin"
        //     // } else {
        //     //   // Redirect to user dashboard
        //     //   window.location.href="/user"
        //     // }

        //   } catch (error) {
        //     console.error("Error parsing stored data:", error);
        //   }
        // } else {
        //   console.log("No stored data found in localStorage");
        // }
      } else {
        console.error("Failed to login. Status:", response.status);
        // Handle failed login, e.g., display error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
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

  return (
    <div className="container">
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
        <button
          type="submit"
          className="submitBtn"
          disabled={!email || !password}
        >
          Submit
        </button>
        <div className="other">
          <p>Dont't Have an account ?</p>
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
