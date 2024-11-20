import React from "react";
// Import your firebase auth and functions here !!!

export const TestAuth = () => {
  const handleRegister = async () => {
    try {
      const email = "testuser@example.com";
      const password = "password123";
      // const userCredential = await [Firebase function here] !!
      console.log("Registered User:", userCredential.user);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const email = "testuser@example.com";
      const password = "password123";
      // const userCredential = await [Firebase function here] !!
      console.log("Logged In User:", userCredential.user);
      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleRegister} style={{ padding: "10px 20px", margin: "10px" }}>
        Register
      </button>
      <button onClick={handleLogin} style={{ padding: "10px 20px", margin: "10px" }}>
        Login
      </button>
    </div>
  );
};