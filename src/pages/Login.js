import React, { useState, useEffect } from "react";
import { login } from "../hooks/authApi";
import { useAuth } from "../hooks/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { getUserToken, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigation = useNavigate();
  const userToken = getUserToken();

  useEffect(() => {
    if (userToken !== null) {
      navigation("/");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const userData = { email, password };

      const result = await login(userData);
      signIn(result.access_token, result.profile_picture);
      console.log(getUserToken());

      navigation("/");
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
      <button style={styles.button} onClick={handleLogin}>
        Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    zIndex: 50,
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
