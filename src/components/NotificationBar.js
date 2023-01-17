import React from 'react';
import {Alert, Snackbar} from "@mui/material";
import useNotificationStore from "../stores/useNotificationStore";

function NotificationBar(props) {
    const message = useNotificationStore(state => state.message)
    const severity = useNotificationStore(state => state.severity)
    const setNotification = useNotificationStore(state => state.setNotification)


    const open = message && severity ? true : false
    const handleClose = () => {
        setNotification({message: "", severity: ""})
    }
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                  anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default NotificationBar;