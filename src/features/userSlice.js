import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  name: '',
};

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    unsetUserInfo: (state) => {
      state.email = '';
      state.name = '';
    },
  },
});

// Exporting actions
export const { setUserInfo, unsetUserInfo } = userSlice.actions;

// Exporting reducer
export default userSlice.reducer;
