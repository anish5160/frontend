import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../services/userAuthApi';
import { getToken, storeToken } from '../../services/Localstorage';
import { setUserToken } from '../../features/authSlice';

const UserLogin = () => {
  const [server_error, setServerError] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    };

    console.log('Sending data:', actualData);

    const res = await loginUser(actualData)
    console.log('Response:', res);

    if (res.error) {
      console.log('Error:', res.error);
      const errorData = res.error.data?.errors;  // Optional chaining to avoid undefined errors
      if (errorData) {
        setServerError(errorData);
      } else {
        setServerError({ non_field_errors: ["An unknown error occurred."] });
      }
    }
    if (res.data) {
      console.log('Login successful:', res.data);
      storeToken(res.data.token);
      let { access_token } = getToken() 
      dispatch(setUserToken({access_token: access_token}))  
      
      navigate('/dashboard')
    }
 }
 useEffect(() => {
  let { access_token } = getToken()
  dispatch(setUserToken({ access_token: access_token }))
 }, [dispatch])
 
  return <>
   
    <Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email && <Typography color="error">{server_error.email[0]}</Typography>}
      <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
      {server_error.password && <Typography color="error">{server_error.password[0]}</Typography>}

      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button>
      </Box>
      <NavLink to='/sendpasswordresetemail' style={{ textDecoration: 'none' }}>
  Forgot Password?
</NavLink>


      {server_error.non_field_errors ? <Alert severity='error'>
          {server_error.non_field_errors[0]}</Alert> : ''}
    </Box>
  </>;
};

export default UserLogin;
