import React, {useState, useEffect} from 'react';
import {Button, InputAdornment, Switch, TextField as MuiTextField} from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import useForm from "../../../hooks/useForm";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {useNavigate, useParams} from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";

const initalValues = {
    "name": "Tarif 1",
    "price": 10.50,
    "reducedPrice": 1,
    "startTime": "",
    "endTime": "",
    "startDate": "",
    "endDate": ""
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


    // Handle state of flexible switch button 
    const [switchChecked, setStateChecked] = useState(false);

    function handleSwitchChange() {
        setStateChecked(!switchChecked);
    }


    return (
        <div>
            <h2 className={"page-title"}>Tarif {rateId ? "bearbeiten" : "hinzufügen"}</h2>
            <WidgetComponent>
                <form className={"flex flex-col gap-4 px-4"}>
                    <TextField name={"name"} value={values.name} onChange={handleChange} placeholder={"Name"}
                               label={"Name"}/>
                    <TextField name={"price"} value={values.price} onChange={handleChange}
                               placeholder={"Preis"} label={"Preis"}/>
                    <TextField name={"reducedPrice"} value={values.reducedPrice} onChange={handleChange}
                               placeholder={"Reduzierter Preis"} label={"Reduzierter Preis"}/>
                    <FormGroup>
                        <FormControlLabel 
                            control={<Switch checked={switchChecked} onChange={handleSwitchChange}/>} 
                            label="Flexibel"
                        />
                    </FormGroup>
                    {switchChecked ? (
                        <>
                            <TextField name={"startTime"} value={values.startTime} onChange={handleChange}
                                    placeholder={"Startzeit"} label={"Startzeit"} type={"time"} InputLabelProps={{
                                shrink: true,
                            }}/>
                            <TextField name={"endTime"} value={values.endTime} onChange={handleChange} placeholder={"Endzeit"}
                                    label={"Endzeit"} type="time" InputLabelProps={{shrink: true}}/>
                            <TextField name={"startDate"} value={values.startDate} onChange={handleChange}
                                    placeholder={"Startdatum"} label={"Startdatum"} type={"date"} InputLabelProps={{
                                shrink: true
                            }}/>
                            <TextField name={"endDate"} value={values.endDate} onChange={handleChange}
                                    placeholder={"Endzeit"} label={"Endzeit"} type={"date"} InputLabelProps={{
                                shrink: true
                            }}/>
                        </>) 
                        :(
                            null
                        )
                    }
                    <StyledButton onClick={handleSave}>
                        {rateId ? "Speichern" : "Anlegen"}
                    </StyledButton>
                </form>
            </WidgetComponent>
        </div>
    );
}

export default AddRate;