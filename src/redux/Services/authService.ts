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

export const LoginUser = createAsyncThunk(
    "auth/login",
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post(
                "/teams_bot/OTP/generation",
                payload
            );

            const data = response.data;

            const statusCode =
                data.Status_code || data["Status code"];

            const statusResponse =
                data.Status_Response || data["Status Response"];

            const statusMessage =
                data.Status_Message || data["Status message"];

            if (statusResponse === "Success" || statusCode === "200") {
                showSnackbar("success", statusMessage || "OTP Sent Successfully");
                return data;
            }

            showSnackbar("error", statusMessage || "Login Failed");
            return rejectWithValue(statusMessage || "Login Failed");
        } catch (error: any) {
            const data = error.response?.data;

            const message =
                data?.Status_Message ||
                data?.["Status message"] ||
                "Something went wrong";

            showSnackbar("error", message);

            return rejectWithValue(message);
        }
    }
);

export const Loginotp = createAsyncThunk("auth/OTP", async (payload: LoginOTPPayload, { rejectWithValue }) => {
    try {
        const response = await boomiApi.post("/teams_bot/OTP/login_validation", payload);
        const data = response.data;

        // Same fields the OTP screen itself checks before navigating (auth/index.tsx) -
        // this endpoint uses "Status_Response" (underscore), unlike the email step's
        // "Status Response" (space).
        const statusCode = String(data?.["Status code"] ?? data?.Status_code ?? "").trim();
        const statusResponse = String(data?.["Status_Response"] ?? data?.Status_Response ?? "")
            .trim()
            .toLowerCase();
        const statusMessage = data?.Status_Message || data?.["Status message"];

        if (statusCode === "200" && statusResponse === "success") {
            showSnackbar("success", statusMessage || "Login successful");
        } else {
            showSnackbar("error", statusMessage || "Login failed");
        }

        return data;
    } catch (error: any) {
        const message =
            error.response?.data?.Status_Message ||
            error.response?.data?.["Status message"] ||
            "Login failed";

        showSnackbar("error", message);
        return rejectWithValue(message);
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