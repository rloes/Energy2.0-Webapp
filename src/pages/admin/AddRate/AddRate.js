import React, {useEffect} from 'react';
import {Button, InputAdornment, TextField as MuiTextField} from "@mui/material";
import useForm from "../../../hooks/useForm";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {useNavigate, useParams} from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";

const initalValues = {
    "name": "Tarif 1",
    "price": 10.50,
    "reduced_price": 1,
    "flexible": false,
    "start_time": new Date("2023-01-01"),
    "end_time": new Date("2023-12-31"),
    "start_date": new Date("2023-01-01"),
    "end_date": new Date("2023-12-31")
}

const TextField = (props) => {
    return (
        <MuiTextField className={"!min-w-[500px]"} {...props}/>
    )
}

const formatApiData = (data) => {
    data.peakPower = Number(data.peakPower)
    return data
}

