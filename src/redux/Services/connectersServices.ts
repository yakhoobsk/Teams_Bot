import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";

interface pagnation {
    limit: number;
    page: number;
}

// Boomi flows respond with a single-element array ([{ Status_Code,
// Status_Response, Status_Message, ... }]) far more often than a flat
// object, but not always - normalize both shapes so the real
// Status_Response/Status_Message always get read instead of silently
// falling through to the generic fallback text.
const unwrapStatus = (data: any): { Status_Response?: string; Status_Message?: string } => {
    if (Array.isArray(data)) {
        return data[0] || {};
    }
    return data || {};
};
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "AI agent creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "AI agent created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "AI agent creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);


export const aiconnecterUpdate = createAsyncThunk("AI/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.put("/teams_bot/AI_Agent_Details/update", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Update successful");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const aiconnecterDelete = createAsyncThunk("update/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/AI_Agent_Details/Delete_Agent", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Delete failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Delete successful");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Delete failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Group creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Group created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Group creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);


export const GroupsUpdate = createAsyncThunk("Groups/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/group/updated", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Update successful");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const GroupsDelete = createAsyncThunk("Groups/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/group/delete", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Delete failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Delete successful");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Delete failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

// team module access (User Management > Team button)

export const TeamModuleAccessUpdate = createAsyncThunk("TeamModuleAccess/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/team/update", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Team access update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Team access updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Team access update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

// role management

export const RoleManagementGet = createAsyncThunk(
    "RoleManagementGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Role_Management/get");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const RoleManagementCreate = createAsyncThunk("RoleManagement/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Role_Management/create", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Role creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Role created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Role creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const RoleManagementUpdate = createAsyncThunk("RoleManagement/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Role_Management/Update", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Role update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Role updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Role update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const RoleManagementDelete = createAsyncThunk("RoleManagement/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Role_Management/delete", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Role deletion failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Role deleted successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Role deletion failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Database connector creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Database connector created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Database connector creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);


export const databaseconnecterUpdate = createAsyncThunk("database/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Database_connectors/update", payload);
        const data = unwrapStatus(response.data);

        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Database connector update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Database connector updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Database connector update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const databaseconnecterDelete = createAsyncThunk("database/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Database_connectors/Delete_Connectors", payload);
        const data = unwrapStatus(response.data);

        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Delete failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Delete successful");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Delete failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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

        const response = await boomiApi.post("/teams_bot/connectortickets/create", payload);
        const data = unwrapStatus(response.data);

        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "ITSM connector creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "ITSM connector created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "ITSM connector creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Teams configuration creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Teams configuration created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Teams configuration creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);


export const TeamsconfigUpdate = createAsyncThunk("Teamsconfig/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Temas_Configuration/update", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Teams configuration update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Teams configuration updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Teams configuration update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "REST API connector creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "REST API connector created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "REST API connector creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const RestApiConnectersUpdate = createAsyncThunk("RestApiConnecters/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.put("/teams_bot/restconfigure/updated", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "REST API connector update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "REST API connector updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "REST API connector update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const RestApiConnectersDelete = createAsyncThunk("RestApiConnecters/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.delete("/teams_bot/restconfigure/delete", { data: payload });
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "REST API connector deletion failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "REST API connector deleted successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "REST API connector deletion failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);


// restapi connectors

export const TeamsconfigrationGet = createAsyncThunk(
    "TeamsconfigrationGet/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Temas_Configuration/get_teams");
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Team configuration update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Team configuration updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Team configuration update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Individual alert update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Individual alert updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Individual alert update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const IndividualuserCreate = createAsyncThunk("IndividualuserCreate/Create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Individual/Insert", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Individual alert creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Individual alert created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Individual alert creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const IndividualuserDelete = createAsyncThunk("Individualuser/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Individual/Delete", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Individual alert deletion failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Individual alert deleted successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Individual alert deletion failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

// atom status (Atom Management)

export const AtomStatusGet = createAsyncThunk(
    "AtomStatus/fetch",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Atomstatus/fetch");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const AtomStatusUpdate = createAsyncThunk("AtomStatusUpdate/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Atomstatus/Update", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Atom status update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Atom status updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Atom status update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

// team (group) alerts

export const GroupAlertGet = createAsyncThunk(
    "GroupAlert/get",
    async (_: any, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/teams_bot/Group_Alert/Get");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const GroupAlertCreate = createAsyncThunk("GroupAlertCreate/Create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Group_Alert/Create", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Team alert creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Team alert created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Team alert creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const GroupAlertUpdate = createAsyncThunk("GroupAlertUpdate/Update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.put("/teams_bot/Group_Alert/Update", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Team alert update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Team alert updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Team alert update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const GroupAlertDelete = createAsyncThunk("GroupAlertDelete/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Group_Alert/Delete", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Team alert deletion failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Team alert deleted successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Team alert deletion failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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

        const response = await boomiApi.post("/teams_bot/Channel/Create", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Channel creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Channel created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Channel creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const ChannelsDelete = createAsyncThunk("Channels/Delete", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/channels/delete", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Channel deletion failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Channel deleted successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Channel deletion failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const ExistChannelCreate = createAsyncThunk("ExistChannel/Create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Exist_Channel/Create", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "Existing channel creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "Existing channel created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Existing channel creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
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
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "User creation failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "User created successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "User creation failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);

export const UserUpdate = createAsyncThunk("UsersUpdate/update", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/teams_bot/Update_User/detail", payload);
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "User update failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "User updated successfully");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "User update failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);




export const LogoutUser = createAsyncThunk("LogoutUser/user", async (_: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.get("/teams_bot/logout/teams");
        const data = unwrapStatus(response.data);
        if (data?.Status_Response === "Failure") {
            const message = data?.Status_Message || "LogoutUser failed";
            showSnackbar("error", message);
            return rejectWithValue(message);
        }

        showSnackbar("success", data?.Status_Message || "LogoutUser successful");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "LogoutUser failed";
        showSnackbar("error", message);
        return rejectWithValue(message);
    }
}
);
