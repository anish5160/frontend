import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useChangeUserPasswordMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/Localstorage';

const ChangePassword = () => {
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState('');
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const { access_token } = getToken() || { access_token: '' };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      current_password: data.get('current_password'), // 🔥 Added current password
      password: data.get('password'),
      password2: data.get('password2'),
    };

    const res = await changeUserPassword({ actualData, access_token });

    if (res.error) {
      setServerError(res.error.data.errors);
      setServerMsg('');
    }
    if (res.data) {
      setServerMsg('Password changed successfully!');
      setServerError({});
      document.getElementById('password-change-form').reset();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: 600, mx: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Change Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} id="password-change-form">
        <TextField
          margin="normal"
          required
          fullWidth
          name="current_password"
          label="Current Password"
          type="password"
          id="current_password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          type="password"
          id="password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password2"
          label="Confirm New Password"
          type="password"
          id="password2"
        />
        <Box textAlign="center">
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, px: 5 }}>
            Update
          </Button>
        </Box>

        {/* Error Alerts */}
        {server_error.current_password && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {server_error.current_password}
          </Alert>
        )}
        {server_error.password && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {server_error.password}
          </Alert>
        )}
        {server_error.password2 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {server_error.password2}
          </Alert>
        )}

        {/* Success Message */}
        {server_msg && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {server_msg}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ChangePassword;
