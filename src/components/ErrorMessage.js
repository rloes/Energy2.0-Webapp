import React from 'react';
import {Error} from "@mui/icons-material";

function ErrorMessage(props) {
    return (
        <div className={"flex flex-col justify-center items-center font-normal"}>
            <Error color={"error"}/>
            <div className={"text-[1rem]"}>Ein Fehler is aufgetreten</div>
        </div>
    );
}

export default ErrorMessage;