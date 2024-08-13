import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accountList: [], // List of accounts
    loggedInAccount: null, // Details of the currently logged-in account
    loginError: null // Error message for login issues
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        createAccount(state, action) {
            state.accountList.push(action.payload); // Add new account to the list
        },
        loginSuccess(state, action) {
            state.loggedInAccount = action.payload; // Store the logged-in account
            state.loginError = null; // Clear any previous errors
        },
        loginFailure(state) {
            state.loggedInAccount = null; // Clear logged-in account
            state.loginError = 'Invalid username or password'; // Set error message
        }
    }
});

export const { createAccount, loginSuccess, loginFailure } = accountSlice.actions;
export default accountSlice.reducer;
