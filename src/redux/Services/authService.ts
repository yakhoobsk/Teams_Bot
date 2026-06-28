import { createAsyncThunk } from "@reduxjs/toolkit";
import { showSnackbar } from "../../utils/snackbar";
import { boomiApi } from "./commonAxios";


interface LoginPayload {
    Email_ID: string;
}

interface LoginOTPPayload {
    "Email_id": string;
    Otp: any;
}

export const LoginUser = createAsyncThunk("auth/login", async (payload: LoginPayload, { rejectWithValue }) => {
    try {
        const response = await boomiApi.post("/teams_bot/OTP/generation", payload);

        if (response.data?.["Status code"] === "Success") {
            showSnackbar("error", response?.data?.["Status message"] || "Login failed");
        } else {
            showSnackbar("success", response?.data?.["Status message"] || "Login successful");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("success", error.response?.data?.["Status message"] || "Login failed");
        return rejectWithValue(error.response?.data?.["Status message"] || "Login failed");
    }
}
);

export const Loginotp = createAsyncThunk("auth/OTP", async (payload: LoginOTPPayload, { rejectWithValue }) => {
    try {
        const response = await boomiApi.post("/teams_bot/OTP/login_validation", payload);

        if (response.data?.["Status message"] === "success") {
            showSnackbar("error", response.data?.["Status message"] || "Login failed");
        } else {
            showSnackbar("success", response.data?.["Status message"] || "Login successful");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("error", error.response.data?.["Status message"] || "Login failed");
        return rejectWithValue(error.response.data?.["Status message"] || "Login failed");
    }
}
);


export const Logout = createAsyncThunk(
    "logout/create",
    async ({ payload, navigate, clearAuthAction }: any, { dispatch, rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/auth/logout/", payload);
            console.log(boomiApi)
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