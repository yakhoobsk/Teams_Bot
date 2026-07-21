import { createSlice } from "@reduxjs/toolkit";
import { AIConnectersGet, ChannelsUser, DataBaseConnectersGet, GroupsGet, IndividualUser, ITSMConnectersGet, RestApiConnectersGet, TeamsconfigDashboardGet, TeamsconfigGet, TeamsconfigrationGet, UsersGet, UserswithoutpagnationGet } from "../Services/connectersServices";



interface ConnectersState {
    loading: boolean;
    aiagentget: any;
    databaseget: any;
    itsmget: any;
    teamcofigget: any;
    usersget: any;
    teamdashboardget: any;
    restapiconnectersget: any;
    GroupsGets: any;
    error: string | null;
    Userswithoutpagnation: any;
    TeamsconfigrationGets: any;
    IndividualUsers: any;
    ChannelsUsers: any;
}

const initialState: ConnectersState = {
    loading: false,
    aiagentget: null,
    databaseget: null,
    itsmget: null,
    teamcofigget: null,
    usersget: null,
    teamdashboardget: null,
    restapiconnectersget: null,
    GroupsGets: null,
    error: null,
    Userswithoutpagnation: null,
    TeamsconfigrationGets: null,
    IndividualUsers: null,
    ChannelsUsers: null,
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
            .addCase(TeamsconfigDashboardGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(TeamsconfigDashboardGet.fulfilled, (state, action) => {
                state.loading = false;
                state.teamdashboardget = action.payload;
            })

            .addCase(TeamsconfigDashboardGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(RestApiConnectersGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(RestApiConnectersGet.fulfilled, (state, action) => {
                state.loading = false;
                state.restapiconnectersget = action.payload;
            })

            .addCase(RestApiConnectersGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(GroupsGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(GroupsGet.fulfilled, (state, action) => {
                state.loading = false;
                state.GroupsGets = action.payload;
            })

            .addCase(GroupsGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(TeamsconfigrationGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(TeamsconfigrationGet.fulfilled, (state, action) => {
                state.loading = false;
                state.TeamsconfigrationGets = action.payload;
            })

            .addCase(TeamsconfigrationGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(IndividualUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(IndividualUser.fulfilled, (state, action) => {
                state.loading = false;
                state.IndividualUsers = action.payload;
            })

            .addCase(IndividualUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ChannelsUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ChannelsUser.fulfilled, (state, action) => {
                state.loading = false;
                state.ChannelsUsers = action.payload;
            })

            .addCase(ChannelsUser.rejected, (state, action: any) => {
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

            .addCase(UserswithoutpagnationGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(UserswithoutpagnationGet.fulfilled, (state, action) => {
                state.loading = false;
                state.Userswithoutpagnation = action.payload;
            })

            .addCase(UserswithoutpagnationGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});
export default ConnectersSlice.reducer;;

