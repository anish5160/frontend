import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi';
import { storeToken } from '../../services/Localstorage';

const Registration = () => {
  const [server_error, setServerError] = useState({});
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password2: data.get('password2'),
      tc: data.get('tc') === 'true', // Convert to boolean
    };

    const res = await registerUser(actualData);

    if (res.error) {
      const errors = res.error?.data?.errors;
      if (errors) {
        setServerError(res.error.data.errors);
      }
    }
    if (res.data) {
      storeToken(res.data.token)
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Box component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
        <TextField margin='normal' required fullWidth id='name' name='name' label='Name' />
        {server_error.name && <Typography color="error">{server_error.name[0]}</Typography>}

        <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
        {server_error.email && <Typography color="error">{server_error.email[0]}</Typography>}

        <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
        {server_error.password && <Typography color="error">{server_error.password[0]}</Typography>}

        <TextField margin='normal' required fullWidth id='password2' name='password2' label='Confirm Password' type='password' />
        {server_error.password2 && <Typography color="error">{server_error.password2[0]}</Typography>}

       <FormControlLabel
  control={<Checkbox value="true" color="primary" name="tc" id="tc" />}
  label={
    <div>
      I agree to the terms and conditions.
      {server_error.tc && <span style={{ color: 'red', marginLeft: '8px' }}>Error</span>}
    </div>
  }
/>
{server_error.tc && <Typography color="error">{server_error.tc[0]}</Typography>}
        <Box textAlign='center'>
          <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
        </Box>
        {server_error.non_field_errors ? <Alert severity='error'>
          {server_error.non_field_errors[0]}</Alert> : ''}
      </Box>
    </>
  );
};

export default Registration;