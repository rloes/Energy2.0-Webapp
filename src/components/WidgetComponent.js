import React from 'react';
import {Paper} from "@mui/material";

function WidgetComponent(props) {
    const classes = props.className? props.className : " "
    return (
        <Paper elevation={1} className={"p-4 !rounded-xl "+classes}>
            {props.children}
        </Paper>
    );
}

export default WidgetComponent;