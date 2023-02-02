import React from 'react';
import {CircularProgress, Skeleton} from "@mui/material";


function PowerMixValues(props) {
    return (
        <div>
            <h3>{props.data.value}</h3>
        </div>
    );
}

export default PowerMixValues;