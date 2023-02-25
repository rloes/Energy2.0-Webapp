import React, {useEffect, useState} from 'react';
import {Button, Dialog, InputAdornment, TextField as MuiTextField} from "@mui/material";
import useForm from "../../../hooks/useForm";
import WidgetComponent from "../../../components/WidgetComponent";
import {useNavigate, useParams} from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";
import ListConsumers from "../ListConsumers/ListConsumers";
import InitializeProducer from "./components/InitializeProducer";

const initalValues = {
    name: "Testanlage",
    street: "Hafenplatz 1",
    zipCode: "48155",
    city: "Münster",
    peakPower: "5",

    productionSensor: {
        deviceId: "15235",
        type: "PM"
    },

    gridSensor: {
        deviceId: "16540",
        type: "GM"
    }
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

function AddProducer(props) {

    const {values, handleChange, setValues, handleNestedChange} = useForm(initalValues)
    const navigate = useNavigate()
    const {producerId} = useParams()
    const {apiRequest} = useApi()
    const setNotification = useNotificationStore(state => state.setNotification)

    const [initializable, setInitializable] = useState(false)
    const [openInit, setOpenInit] = useState(false)

    useEffect(
        /**
         * Check whether a producer can be initialized. This is the case, if he has no data(production, consumption) yet,
         * therefore send an output request and if the answer is 204(No Content) -> allow initialization
         */
        function checkIfInitializable() {
            if (producerId || producerId == 0) {
                apiRequest({
                    method: "get", url: "/output/?producer_id=" + producerId
                }).then((res) => {
                    if (res.status === 204) {
                        setInitializable(true)
                    }
                })
            }
        }, [producerId])

    const handleSave = (continueEditing = false) => {
        const method = producerId ? "PUT" : "POST"
        const url = producerId ? "producers/" + producerId + "/" : "producers/"

        apiRequest({
            url: url, method: method, requestData: values, formatData: formatApiData
        }).then((response) => {
            if (response.status === 201 || response.status === 200) {
                if (!continueEditing) {
                    navigate('/solaranlagen')
                } else {
                    navigate("/solaranlagen/" + response.data.id + "/bearbeiten")
                }
                setNotification({
                    message: "Solaranlage wurde " + producerId ? "gespeichert" : "angelegt",
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
        if (producerId) {
            apiRequest({method: "get", url: "producers/" + producerId + "/"}).then(res => {
                setValues(res.data)
            }).catch((e) => console.log(e))
        }
    }, [producerId])

    return (
        <div>
            <h2 className={"page-title"}>Solaranlage {producerId ? "bearbeiten" : "hinzufügen"}</h2>
            <WidgetComponent className={"w-max"}>
                <form className={"flex flex-col gap-4 px-4"}>
                    <TextField name={"name"} value={values.name} onChange={handleChange} placeholder={"Name"}
                               label={"Name"}/>
                    <TextField name={"street"} value={values.street} onChange={handleChange}
                               placeholder={"Straße & Hausnummer"} label={"Straße & Hausnummer"}/>
                    <TextField name={"zipCode"} value={values.zipCode} onChange={handleChange}
                               placeholder={"Postleitzahl"} label={"Postleitzahl"}/>
                    <TextField name={"city"} value={values.city} onChange={handleChange}
                               placeholder={"Stadt"} label={"Stadt"}/>
                    <TextField name={"peakPower"} label={"Installierte Leistung"} onChange={handleChange}
                               value={values.peakPower} placeholder={"Installierte Leistung"}
                               InputProps={{
                                   endAdornment: <InputAdornment position="end"
                                                                 className={"!font-semibold text-black"}>kWp</InputAdornment>,
                               }}/>
                    {!producerId &&
                        <>
                            <TextField name={"productionSensor.deviceId"} value={values.productionSensor.deviceId}
                                       onChange={handleNestedChange} placeholder={"Produktionszähler"}
                                       label={"Produktionszählernummer"}/>
                            <TextField name={"gridSensor.deviceId"} value={values.gridSensor.deviceId}
                                       onChange={handleNestedChange}
                                       placeholder={"Netzzähler"} label={"Netzzähler"}/>
                        </>
                    }
                    {!producerId &&
                        <StyledButton onClick={() => handleSave(true)}>
                            Anlegen und Kunden hinzufügen
                        </StyledButton>
                    }
                    <StyledButton onClick={() => handleSave(false)}>
                        {producerId ? "Speichern" : "Anlegen"}
                    </StyledButton>
                    {initializable &&
                        <StyledButton onClick={() => setOpenInit(true)}>
                            Initialisieren
                        </StyledButton>
                    }
                    <StyledButton onClick={() => navigate("/solaranlagen")}>
                        Abbrechen
                    </StyledButton>
                </form>
            </WidgetComponent>
            {producerId &&
                <ListConsumers producerId={producerId}/>
            }
            <Dialog open={openInit} onClose={() => setOpenInit(false)}>
                <InitializeProducer producerId={producerId} onClose={() => setOpenInit(false)}
                                    afterInitialize={() => setInitializable(false)}/>
            </Dialog>
        </div>
    );
}

export default AddProducer;