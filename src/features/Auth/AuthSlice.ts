import { createSlice } from '@reduxjs/toolkit'


export interface AuthState {
    isAuthenticated: boolean;
}

const initialState : AuthState = {
    isAuthenticated: false,

}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state) => {
            state.isAuthenticated = true;
            console.log("Authenticated");
        },
        logout: (state) => {
            state.isAuthenticated = false;
            console.log("Logged out");

        }
    }
})


export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;