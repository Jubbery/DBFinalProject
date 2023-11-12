import React, { useState } from "react";
import { TextField, Button, Link, Grid, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      // Handle response data, store token, redirect user, etc.
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      component="form"
      onSubmit={handleLogin}
    >
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p>{errorMessage}</p>}
        <Button fullWidth variant="contained" color="primary" type="submit">
          Login
        </Button>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Link href="/faq">Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link href="/welcome">Create account</Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
