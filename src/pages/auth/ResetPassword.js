import { Grid, TextField, Button, Box, Alert } from "@mui/material";
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from "../../services/userAuthApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams(); // Get UID & Token from URL
  const [resetPassword, { isLoading, isError, isSuccess }] = useResetPasswordMutation();
  
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = data.get('password');
    const password2 = data.get('password2');
  
    // Check if both fields are filled
    if (!password || !password2) {
      setError({ status: true, msg: "❌ All fields are required.", type: 'error' });
      return;
    }
  
    // Check if passwords match
    if (password !== password2) {
      setError({ status: true, msg: "❌ Passwords do not match.", type: 'error' });
      return;
    }
  
    // Check if password is at least 8 characters
    if (password.length < 8) {
      setError({ status: true, msg: "❌ Password must be at least 8 characters long.", type: 'error' });
      return;
    }
  
    // Optional: Check for common passwords (basic frontend check)
    const commonPasswords = ["password", "12345678", "qwerty", "letmein", "password123"];
    if (commonPasswords.includes(password.toLowerCase())) {
      setError({ status: true, msg: "❌ This password is too common. Please choose a stronger one.", type: 'error' });
      return;
    }
  
    // If all checks pass, proceed with API call
    try {
      await resetPassword({ uid, token, password, password2 }).unwrap();
      setError({ status: true, msg: "✅ Password Reset Successfully! Redirecting to Login...", type: 'success' });
  
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError({ status: true, msg: "❌ Invalid or Expired Token!", type: 'error' });
    }
  };
  

  return (
    <Grid container justifyContent='center'>
      <Grid item sm={6} xs={12}>
        <h1>Reset Password</h1>
        <Box component='form' noValidate sx={{ mt: 1 }} id='password-reset-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required fullWidth id='password' name='password' label='New Password' type='password' />
          <TextField margin='normal' required fullWidth id='password2' name='password2' label='Confirm New Password' type='password' />
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Box>
          {error.status && <Alert severity={error.type}>{error.msg}</Alert>}
          {isSuccess && <Alert severity="success">Password reset successful!</Alert>}
          {isError && <Alert severity="error">Error resetting password.</Alert>}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
