"use client";
import axios from "axios";
import React, { useState } from "react";
import { BACKEND_URL } from "../lib/config";
interface AuthProps {
  type: "signin" | "signup";
}

const AuthForm = ({ type }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = type === "signin" ? "signin" : "signup";
      const response = await axios.post(`${BACKEND_URL}/${endpoint}`, {
        email,
        password,
      });
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="border border-blue-300">
      <form
        onSubmit={handleSubmit}
        className="text-2xl flex flex-col items-center"
      >
        <input
          type="username"
          placeholder="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {type === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};
export default AuthForm;
