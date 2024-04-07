import React, { useState } from "react";
import { login } from "../hooks/authApi";
import { useAuth } from "../hooks/authContext";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      const userData = { email, password };
      console.log("Login Process", userData);

      const result = await login(userData);
      signIn(result.access_token, result.profile_picture);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="off"
      />
      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="off"
      />
      <button style={styles.button} onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <span
        style={styles.registerText}
        onClick={() => navigation.navigate("Register")}
      >
        Don't have an account? Register here.
      </span>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 30,
    borderRadius: 4,
    border: "1px solid gray",
    marginBottom: 16,
    paddingLeft: 8,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "blue",
    color: "white",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
  },
  registerText: {
    marginTop: 20,
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Login;
