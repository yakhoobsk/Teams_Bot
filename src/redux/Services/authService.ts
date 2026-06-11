import { createAsyncThunk } from "@reduxjs/toolkit";
import { showSnackbar } from "../../utils/snackbar";
import { AiApi } from "./commonAxios";

interface LoginPayload {
    user_email: string;
    password: string;
}

export const LoginUser = createAsyncThunk("auth/login", async (payload: LoginPayload, { rejectWithValue }) => {
    try {
        const response = await AiApi.post("/auth/login/", payload);

        if (response.data.status !== "success") {
            showSnackbar("error", response?.data?.message || "Login failed");
        } else {
            showSnackbar("success", response?.data?.message || "Login successful");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("error", error.response?.data?.message || "Login failed");
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
}
);


export const Logout = createAsyncThunk(
    "logout/create",
    async ({ payload, navigate, clearAuthAction }: any, { dispatch, rejectWithValue }) => {
        try {
            const response = await AiApi.post("/auth/logout/", payload);

            if (response.data?.status !== "success") {
                showSnackbar("error", response.data?.message || "Logout failed");
                return rejectWithValue(response.data?.message || "Logout failed");
            }

            showSnackbar("success", response.data?.message || "Logged out successfully");

            dispatch(clearAuthAction());
            localStorage.clear();
            navigate("/login");
            return response.data;

        } catch (error: any) {
            showSnackbar("error", error?.response?.data?.message || "Logout failed");
            return rejectWithValue(error?.response?.data?.message || "Logout failed");
        }
    }
);