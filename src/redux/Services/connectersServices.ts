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
            showSnackbar("error", data?.Status_Message || "Update failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Update successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Update failed");
    }
}
);

export const aiconnecterDelete = createAsyncThunk("update/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/AI_Agent_Details/Delete_Agent", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Delete failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Delete successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
}
);
// group managemnt

export const GroupsGet = createAsyncThunk(
    "GroupsGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/group/Get_group");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);



export const GroupsCreate = createAsyncThunk("Groups/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/group/management", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Group creation failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Group created successfully");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Group creation failed");
    }
}
);


export const GroupsUpdate = createAsyncThunk("Groups/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/group/updated", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Update failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Update successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Update failed");
    }
}
);

export const GroupsDelete = createAsyncThunk("Groups/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/group/delete", payload);
        const data = response.data?.[0];
        if (data?.Status_Response === "Failure") {
            showSnackbar("error", data?.Status_Message || "Delete failed");
        } else if (data?.Status_Response === "Success") {
            showSnackbar("success", data?.Status_Message || "Delete successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
}
);

// database connecters

export const DataBaseConnectersGet = createAsyncThunk(
    "DataBaseConnectersGet/get",
    async (type: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Database_connectors/get", type);
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
            const response = await boomiApi.post("/teams_bot/Temas_Configuration/all_connectors");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const TeamsconfigDashboardGet = createAsyncThunk(
    "TeamsconfigDashboardGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/dashboard/get");
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

        const response = await boomiApi.post("/teams_bot/Temas_Configuration/insert", payload);
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


export const TeamsconfigUpdate = createAsyncThunk("Teamsconfig/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Temas_Configuration/update", payload);
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



////////////////////////////////////////////////////////////////


// Rest API connecters



export const RestApiConnectersGet = createAsyncThunk(
    "RestApiConnectersGet/get",
    async (payload: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/restconfigure/fetch", payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const RestApiConnectersCreate = createAsyncThunk("RestApiConnecters/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/restconfigure/create", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);

export const RestApiConnectersUpdate = createAsyncThunk("RestApiConnecters/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.put("/teams_bot/restconfigure/updated", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);

export const RestApiConnectersDelete = createAsyncThunk("RestApiConnecters/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.delete("/teams_bot/restconfigure/delete", { data: payload });
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);


// restapi connectors

export const TeamsconfigrationGet = createAsyncThunk(
    "TeamsconfigrationGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.get("/teams_bot/Temas_Configuration/get_teams");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const TeamsconfigrationUpdate = createAsyncThunk("Teamsconfigration/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Temas_Configuration/Create_Team", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);


//  individual user
export const IndividualUser = createAsyncThunk(
    "Individualuser/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Individual/Get");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const IndividualuserUpdate = createAsyncThunk("IndividualuserUpdate/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.put("/teams_bot/Individual/Update", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);

export const IndividualuserCreate = createAsyncThunk("IndividualuserCreate/Create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Individual/Insert", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);

export const IndividualuserDelete = createAsyncThunk("Individualuser/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Individual/Delete", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);

// channels and alerts
export const ChannelsUser = createAsyncThunk(
    "Channels/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/channels/detailsget");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const ChannelsCreate = createAsyncThunk("ChannelsCreate/Create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/channels/insert", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
    }
}
);

export const ChannelsDelete = createAsyncThunk("Channels/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/channels/delete", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "Rest API failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "Rest API successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Rest API failed");
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


export const UserswithoutpagnationGet = createAsyncThunk(
    "UserswithoutpagnationGet/get",
    async (
        _: any,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(`/teams_bot/userfetch/get`);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const userCreate = createAsyncThunk("UsersCreate/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/create_User/details", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "User creation failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "User created successfully");
        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "User creation failed");
    }
}
);

export const UserUpdate = createAsyncThunk("UsersUpdate/update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Update_User/detail", payload);
        if (response?.data?.Status_Response === "Failure") {
            showSnackbar("error", response?.data?.Status_Message || "User update failed");
        } else if (response?.data?.Status_Response === "Success") {
            showSnackbar("success", response?.data?.Status_Message || "User updated successfully");
        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "User update failed");
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
