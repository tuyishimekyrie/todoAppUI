import React, { useState } from "react";
import "../styles/signup.css";
import signupImage from "../assets/signup.svg";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [person, setPerson] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if any field is empty
    if (
      !person.name ||
      !person.email ||
      !person.password ||
      !person.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (person.password !== person.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setIsLoading(true);
    // Prepare data to send to the server
    const userData = {
      name: person.name,
      email: person.email,
      password: person.password,
      isAdmin: false,
    };

    try {
      const response = await fetch(
        "https://todoappapi-nk0o.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      toast.loading("Loading data from server...");
      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      // If account creation is successful, clear the form fields
      setPerson({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      toast.success("Account created successfully!");
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating account:", error);
      alert("Failed to create account. Please try again later.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "confirmPassword") {
      setPasswordMismatch(false);
    }
  };
  if (isLoading) {
    toast.loading("Sending Data to the Server...");
  }
  return (
    <div className="container app">
      <img src={signupImage} alt="" />
      <Toaster position="top-right" richColors />
      <h3>Create Account Here!</h3>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Type username"
            value={person.name}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="user@example.com"
            value={person.email}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="*******"
            value={person.password}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="input">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="*******"
            value={person.confirmPassword}
            onChange={(e) => handleInputChange(e)}
          />
          {passwordMismatch && <p className="error">Passwords do not match</p>}
        </div>
        <button className="submitBtn" type="submit" disabled={isLoading}>
          {isLoading ? "Submitting...." : "Submit"}
        </button>

        <div className="other">
          <p>Already Have an account ?</p>
          <Link to="/login" className="link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
