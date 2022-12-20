import React from 'react';
import {Paper} from "@mui/material";

function WidgetComponent(props) {
    return (
        <Paper elevation={10} className={"p-4 !rounded-2xl"}>
            {props.children}
        </Paper>
    );
}

export default WidgetComponent;