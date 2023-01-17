import React, {useEffect} from 'react';
import {Button, InputAdornment, Switch, TextField as MuiTextField} from "@mui/material";
import useForm from "../../../hooks/useForm";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {useNavigate, useParams} from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";
import { TimePicker, DatePicker } from '@mui/x-date-pickers';

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


function AddRate(props) {

    const {values, handleChange, setValues, handleNestedChange} = useForm(initalValues)
    const navigate = useNavigate()
    const {rateId} = useParams()
    const {apiRequest} = useApi()
    const setNotification = useNotificationStore(state => state.setNotification)

    const handleSave = () => {
        const method = rateId ? "PUT" : "POST"
        const url = rateId ? "rates/" + rateId + "/" : "rates/"

        apiRequest({
            url: url, method: method, requestData: values, formatData: formatApiData
        }).then((response) => {
            if (response.status === 201 || response.status === 200) {
                navigate('/tarife')
                setNotification({
                    message: "Tarif wurde " + rateId ? "gespeichert" : "angelegt",
                    severity: "success"
                })
            }
        })
    }

    /**
     * If a producerId is defined => a existing producer is being edited.
     * Therefore on component render, the current values for that producer is fetched.
     */
    useEffect(() => {
        if (rateId) {
            apiRequest({method: "get", url: "rates/" + rateId + "/"}).then(res => {
                setValues(res.data)
            }).catch((e) => console.log(e))
        }
    }, [rateId])

    return (
        <div>
            <h2 className={"page-title"}>Tarif {rateId ? "bearbeiten" : "hinzufügen"}</h2>
            <WidgetComponent>
                <form className={"flex flex-col gap-4 px-4"}>
                    <TextField name={"name"} value={values.name} onChange={handleChange} placeholder={"Name"}
                               label={"Name"}/>
                    <TextField name={"price"} value={values.price} onChange={handleChange}
                               placeholder={"Preis"} label={"Preis"}/>
                    <TextField name={"reduced_price"} value={values.reduced_price} onChange={handleChange}
                               placeholder={"Reduzierter Preis"} label={"Reduzierter Preis"}/>
                    <TextField name={"flexible"} value={values.flexible} onChange={handleChange}
                               placeholder={"Flexibel"} label={"Flexibel"}/>
                    <TextField type="time" name={"start_time"} value={values.start_time} onChange={handleChange}
                               placeholder={"Startzeit"} label={"Startzeit"}/>
                    <TextField type="time" name={"end_time"} value={values.end_time} onChange={handleChange}
                               placeholder={"Endzeit"} label={"Endzeit"}/>
                    <TextField type="date" name={"start_date"} value={values.start_date} onChange={handleChange}
                               placeholder={"Startdatum"} label={"Startdatum"}/>
                    <TextField type="date" name={"end_date"} value={values.end_date} onChange={handleChange}
                               placeholder={"Enddatum"} label={"Enddatum"}/>
                    <StyledButton onClick={handleSave}>
                        {rateId ? "Speichern" : "Anlegen"}
                    </StyledButton>
                </form>
            </WidgetComponent>
        </div>
    );
}

export default AddRate;