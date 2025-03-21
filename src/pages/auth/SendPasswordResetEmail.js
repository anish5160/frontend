import { Grid, TextField, Button, Box, Alert, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSendPasswordResetEmailMutation } from "../../services/userAuthApi";

const SendPasswordResetEmail = () => {
  const [serverError, setServerError] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = { email: data.get("email") };

    const res = await sendPasswordResetEmail(actualData);
    if (res.error) {
      console.log("Error:", res.error);
      if (res.error.data && res.error.data.errors) {
        setServerError(res.error.data.errors);
      } else {
        setServerError({ non_field_errors: ["Something went wrong. Please try again."] });
      }
      setServerMsg("");
    }
    if (res.data) {
      console.log("Success:", res.data);
      setServerError({});
      setServerMsg(res.data.msg || "Password reset email sent successfully.");
      document.getElementById("password-reset-email-form").reset();
    }
  };

  const handleInputChange = () => {
    setServerError({});
    setServerMsg("");
  };

  return (
    <Grid container justifyContent="center">
      <Grid item sm={6} xs={12}>
        <h1>Reset Password</h1>
        <Box component="form" noValidate sx={{ mt: 1 }} id="password-reset-email-form" onSubmit={handleSubmit} method="post">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            onChange={handleInputChange}
          />
          {serverError.email && (
            <Typography style={{ fontSize: 12, color: "red", paddingTop: 5 }}>
              {serverError.email[0]}
            </Typography>
          )}
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, px: 5 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Sending... <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
                </>
              ) : (
                "Send"
              )}
            </Button>
          </Box>
          {serverMsg && <Alert severity="success">{serverMsg}</Alert>}
          {serverError.non_field_errors && (
            <Alert severity="error">{serverError.non_field_errors[0]}</Alert>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SendPasswordResetEmail;
