import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";

interface pagnation {
    limit: number;
    page: number;
}
// ai Agent

export const AIConnectersGet = createAsyncThunk(
    "AIConnectersGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/AI_Agent_Details/agents_get");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const aiconnecterCreate = createAsyncThunk("AI/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/AI_Agent_Details/create", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Ai failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Ai successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ai failed");
    }
}
);


export const aiconnecterUpdate = createAsyncThunk("AI/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.put("/teams_bot/AI_Agent_Details/update", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Ai failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Ai successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ai failed");
    }
}
);


// database connecters

export const DataBaseConnectersGet = createAsyncThunk(
    "DataBaseConnectersGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Database_connectors/get");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const databaseconnecterCreate = createAsyncThunk("database/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Database_connectors/create", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Ai failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Ai successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ai failed");
    }
}
);


export const databaseconnecterUpdate = createAsyncThunk("database/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Database_connectors/update", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Ai failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Ai successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ai failed");
    }
}
);


// itsm connecters

export const ITSMConnectersGet = createAsyncThunk(
    "ITSMConnectersGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Tickets_Connectors/get");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const itsmconnecterCreate = createAsyncThunk("itsm/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Tickets_Connectors/create", payload);

        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Ai failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Ai successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ai failed");
    }
}
);


//  teams config
export const TeamsconfigGet = createAsyncThunk(
    "TeamsconfigGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Temas_Configuration/get_divisions");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const TeamsconfigCreate = createAsyncThunk("Teamsconfig/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Tickets_Connectors/create", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Ai failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Ai successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ai failed");
    }
}
);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// user mangement


export const UsersGet = createAsyncThunk(
    "UsersGet/get",
    async (
        { Payload, pagnation }: { Payload: any; pagnation: pagnation },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(urlGenarator(`/teams_bot/boomi_user/pagenation_get`, pagnation), Payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const LogoutUser = createAsyncThunk("LogoutUser/user", async (_: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.get("/teams_bot/logout/teams");
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "LogoutUser failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "LogoutUser successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "LogoutUser failed");
    }
}
);
