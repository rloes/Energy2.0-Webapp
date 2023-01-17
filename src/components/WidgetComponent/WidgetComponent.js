import React from 'react';
import {Paper} from "@mui/material";

function WidgetComponent(props) {
    const classes = props.className? props.className : " "
    return (
        <Paper elevation={10} className={"p-4 !rounded-2xl "+classes}>
            {props.children}
        </Paper>
    );
}

export default WidgetComponent;