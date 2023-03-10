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
import _ from "lodash"


const initalValues = {
    name: "",
    street: "",
    zipCode: "",
    city: "",
    peakPower: "",

    productionSensor: {
        deviceId: "",
        type: "PM"
    },

    gridSensor: {
        deviceId: "",
        type: "GM"
    }
}
const TextField = (props) => {
    return (
        <MuiTextField className={"!min-w-[500px]"} {...props}/>
    )
}

const formatApiData = (data, method) => {
    const clonedData = _.cloneDeep(data)
    clonedData.peakPower = Number(data.peakPower)
    if (method === "PATCH") {
        // User, Sensor and Producer can only be set on create
        delete clonedData['productionSensor']
        delete clonedData['gridSensor']
    }
    return clonedData
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
                    method: "get", url: "/output/?start_date=1950-01-01&producer_id=" + producerId
                }).then((res) => {
                    if (res.status === 204) {
                        setInitializable(true)
                    }
                })
            }
        }, [producerId])

    const handleSave = (continueEditing = false) => {
        const method = producerId ? "PATCH" : "POST"
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
            })
        }
    }, [producerId])

    return (
        <div>
            <h2 className={"page-title"}>Solaranlage {producerId ? "bearbeiten" : "hinzuf??gen"}</h2>
            <WidgetComponent className={"w-max"}>
                <form className={"flex flex-col gap-4 px-4"}>
                    <TextField name={"name"} value={values.name} onChange={handleChange} placeholder={"Name"}
                               label={"Name"}/>
                    <TextField name={"street"} value={values.street} onChange={handleChange}
                               placeholder={"Stra??e & Hausnummer"} label={"Stra??e & Hausnummer"}/>
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
                                       onChange={handleNestedChange} placeholder={"Produktionsz??hler"}
                                       label={"Produktionsz??hlernummer"}/>
                            <TextField name={"gridSensor.deviceId"} value={values.gridSensor.deviceId}
                                       onChange={handleNestedChange}
                                       placeholder={"Netzz??hler"} label={"Netzz??hler"}/>
                        </>
                    }
                    {!producerId &&
                        <StyledButton onClick={() => handleSave(true)}>
                            Anlegen und Kunden hinzuf??gen
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