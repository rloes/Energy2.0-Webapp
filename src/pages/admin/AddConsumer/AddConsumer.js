import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    TextField as MuiTextField,
} from "@mui/material";
import useForm from "../../../hooks/useForm";
import WidgetComponent from "../../../components/WidgetComponent";
import {useNavigate, useParams} from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";
import {roundToN} from "../../../helpers";
import _ from "lodash"

const initalValues = {
    name: "",
    user: {
        username: "",
        password: "",
    },
    email: "",
    phone: "",
    producer: "",
    sensor: {
        deviceId: "",
        type: "CM",
    },
    rates: [],
};
const TextField = (props) => {
    return <MuiTextField className={"!min-w-[500px]"} {...props} />;
};

const formatApiData = (data, method) => {
    // before sending it, array of selected array objects have to be converted to array of urls
    // we have to work on clonedData, otherwise values.rates will also change
    const clonedData = _.cloneDeep(data)
    const rates = clonedData.rates.map(rate => rate.url)
    clonedData.rates = rates
    if (method === "PATCH") {
        // User, Sensor and Producer can only be set on create
        delete clonedData['user']
        delete clonedData['sensor']
        delete clonedData['producer']
    }
    console.log(clonedData)
    return clonedData
};

/**
 *
 * @param producerId - if Consumer is added to a specific Producer this var stores the id of it
 * @param onClose - has to be set if producerId is set. is called to close the popup AddConsumer is rendered in
 * @returns {JSX.Element}
 * @constructor
 */
function AddConsumer({producerId, onClose}) {
    const {
        values,
        handleChange,
        setValues,
        handleNestedChange,
    } = useForm(initalValues);
    const navigate = useNavigate();
    const {consumerId} = useParams();
    const {apiRequest} = useApi();
    const setNotification = useNotificationStore(
        (state) => state.setNotification
    );

    /**
     * Handles changes to the autocomplete component.
     */
    function handleSelectChange(value, newValue) {
        setValues((prevState) => ({
            ...prevState,
            rates: newValue,
        }));
    }

    const handleSave = () => {
        const method = consumerId ? "PATCH" : "POST";
        const url = consumerId ? "consumers/" + consumerId + "/" : "consumers/";

        apiRequest({
            url: url,
            method: method,
            requestData: values,
            formatData: formatApiData,
        }).then((response) => {
            if (response.status === 201 || response.status === 200) {
                handleClose()
                setNotification({
                    message: "Kunde wurde " + (consumerId ? "gespeichert" : "angelegt"),
                    severity: "success",
                });
            }
        });
    };

    const handleClose = () => {
        if (!producerId) {
            navigate("/kunden");
        } else {
            onClose()
        }
    }

    /**
     * Fetches currently existing tariffs to be referenced in the multiselect list
     * below when to enter the tariffs the consumer has chosen.
     */
    const [rates, setRates] = useState([]);
    useEffect(() => {
        apiRequest({method: "get", url: "rates/"}).then((res) => {
            setRates(res.data);
        });
    }, []);

    /**
     * If a consumerId is defined => a existing consumer is being edited.
     * Therefore on component render, the current values for that consumer is fetched.
     */
    useEffect(() => {
        if (consumerId && rates) {
            apiRequest({
                method: "get",
                url: "consumers/" + consumerId + "/"
            })
                .then((res) => {
                    // rates have to be stored as objects in values.rates, for the autocomplete component
                    const _rates = []
                    rates.map((rate) => {
                        // rate objects are in rates and rate urls are in res.data.rates
                        if (res.data.rates.includes(rate.url)) {
                            // map over each rate url and store the fitting object in values.rates
                            _rates.push(rate)
                        }
                    })
                    const values = {
                        ...res.data, rates: _rates
                    }
                    setValues(values)
                })
                .catch((e) => console.log(e));
        }
    }, [consumerId, rates]);

    // if AddConsumer is opened as popup in AddProducer -> set producer url
    useEffect(() => {
        if (producerId) {
            handleChange({target: {name: "producer", value: "http://localhost:8000/producers/" + producerId + "/"}})
        }
    }, [producerId])
    return (
        <div>
            <h2 className={"page-title"}>
                Kunde {consumerId ? "bearbeiten" : "hinzufügen"}
            </h2>
            <WidgetComponent className={"w-max"}>
                <form className={"flex flex-col gap-4 px-4"}>
                    <TextField
                        name={"name"}
                        value={values.name}
                        onChange={handleChange}
                        placeholder={"Name"}
                        label={"Name"}
                    />
                    {!consumerId && // if editing an existing consumer, dont show these fields
                        <>
                            <TextField
                                name={"user.username"}
                                value={values.user.username}
                                onChange={handleNestedChange}
                                placeholder={"Benutzername"}
                                label={"Benutzername"}
                            />
                            <TextField
                                name={"user.password"}
                                value={values.user.password}
                                onChange={handleNestedChange}
                                placeholder={"Password"}
                                label={"Password"}
                                type={"password"}
                            />
                        </>}
                    <TextField
                        name={"email"}
                        value={values.email}
                        onChange={handleChange}
                        placeholder={"E-Mail"}
                        label={"E-Mail"}
                    />
                    <TextField
                        name={"phone"}
                        value={values.phone}
                        onChange={handleChange}
                        placeholder={"Telefonnummer"}
                        label={"Telefonnummer"}
                    />
                    {!consumerId &&
                        <>
                            {!producerId &&
                                <TextField
                                    name={"producer"}
                                    value={values.producer}
                                    onChange={handleChange}
                                    placeholder={"Produzent"}
                                    label={"Produzent"}
                                />}
                            <TextField
                                name={"sensor.deviceId"}
                                value={values.sensor.deviceId}
                                onChange={handleNestedChange}
                                placeholder={"Sensorzählernummer"}
                                label={"Sensorzählernummer"}
                            />
                        </>
                    }
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={rates}
                        value={values.rates}
                        getOptionLabel={(option) => option.name + " " +
                            roundToN(option.price, 0) + "ct/" + roundToN(option.reducedPrice, 0) + "ct"
                        }
                        filterSelectedOptions
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={handleSelectChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tarife"
                                placeholder="Tarife auswählen"
                            />
                        )}
                    />
                    <StyledButton
                        variant={"contained"}
                        color={"primary"}
                        onClick={handleSave}
                    >
                        {consumerId ? "Speichern" : "Anlegen"}
                    </StyledButton>
                    <StyledButton onClick={handleClose}>
                        Abbrechen
                    </StyledButton>
                </form>
            </WidgetComponent>
        </div>
    );
}

export default AddConsumer;
