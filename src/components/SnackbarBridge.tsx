import { useEffect } from "react";
import { App } from "antd";
import { setSnackbarNotificationApi } from "../utils/snackbar";

// Captures antd's context-aware notification instance (from the <App>
// component this must be rendered inside) so showSnackbar - called from
// redux thunks, outside any component - can use it instead of the static
// antd import, which silently drops/delays notifications in that setup.
const SnackbarBridge = () => {
    const { notification } = App.useApp();

    useEffect(() => {
        setSnackbarNotificationApi(notification);
    }, [notification]);

    return null;
};

export default SnackbarBridge;
