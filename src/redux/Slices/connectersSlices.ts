import { createSlice } from "@reduxjs/toolkit";
import { AIConnectersGet, DataBaseConnectersGet, ITSMConnectersGet, TeamsconfigGet, UsersGet } from "../Services/connectersServices";



interface ConnectersState {
    loading: boolean;
    aiagentget: any;
    databaseget: any;
    itsmget: any;
    teamcofigget: any;
    usersget: any;
    error: string | null;
}

const initialState: ConnectersState = {
    loading: false,
    aiagentget: null,
    databaseget: null,
    itsmget: null,
    teamcofigget: null,
    usersget: null,
    error: null,
};

const ConnectersSlice = createSlice({
    name: "connecters",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // ai agent
            .addCase(AIConnectersGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(AIConnectersGet.fulfilled, (state, action) => {
                state.loading = false;
                state.aiagentget = action.payload;
            })

            .addCase(AIConnectersGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            // database connecters
            .addCase(DataBaseConnectersGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(DataBaseConnectersGet.fulfilled, (state, action) => {
                state.loading = false;
                state.databaseget = action.payload;
            })

            .addCase(DataBaseConnectersGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            // itsm 

            .addCase(ITSMConnectersGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ITSMConnectersGet.fulfilled, (state, action) => {
                state.loading = false;
                state.itsmget = action.payload;
            })

            .addCase(ITSMConnectersGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Teamsconfig

            .addCase(TeamsconfigGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(TeamsconfigGet.fulfilled, (state, action) => {
                state.loading = false;
                state.teamcofigget = action.payload;
            })

            .addCase(TeamsconfigGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            ///////////////////////////////////////////////////////////////////////////
            // usermanagment

            .addCase(UsersGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(UsersGet.fulfilled, (state, action) => {
                state.loading = false;
                state.usersget = action.payload;
            })

            .addCase(UsersGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});
export default ConnectersSlice.reducer;;

