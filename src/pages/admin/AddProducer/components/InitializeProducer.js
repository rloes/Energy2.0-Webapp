import React, {useState} from 'react';
import WidgetComponent from "../../../../components/WidgetComponent";
import {TextField} from "@mui/material";
import StyledButton from "../../../../components/StyledButton";
import useApi from "../../../../hooks/useApi";
import useNotificationStore from "../../../../stores/useNotificationStore";
import {getISODatetime} from "../../../../helpers";

function InitializeProducer({producerId, onClose, afterInitialize}) {
    const [timestamp, setTimestamp] = useState(() => getISODatetime().slice(0, -3))
    const {apiRequest} = useApi()
    const setNotification = useNotificationStore(state => state.setNotification)
    const handleChange = (e) => {
        setTimestamp(e.target.value)
    }


    const initializeProducer = () => {
        apiRequest({
            method: "POST", url: "setup/",
            requestData: {
                'producerId': producerId, 'timestamp': timestamp + ":00"
            }
        }).then((res) => {
            if (res.status === 208) {
                setNotification(
                    {message: "Initialisierung nicht mehr möglich. Daten sind bereits vorhanden", severity: "warning"})
            }else{
                setNotification({message: "Initialisiert um " + timestamp, severity:"success"})
                afterInitialize&& afterInitialize()
            }
            onClose&& onClose()
        }).catch((e) => setNotification({message: e.message, severity: "error"}))
    }

    return (
        <WidgetComponent className={"flex flex-col gap-8"}>
            <h3 className={"font-bold text-lg"}>Initalisieren</h3>
            <p>
                Damit mit der Datenverarbeitung und Verrechnung begonnen werden kann, braucht es einen ersten
                Referenzpunkt. Mit KLick auf Initialisieren wird ein Produktions- und ein Verbrauchsdatenpunkt für
                alle Verbraucher erstellt. Dieser setzt alle Zählerwerte zum eingestellten Zeitpunkt auf 0.
            </p>
            <form className={"flex flex-col"}>
                <TextField name={"timestamp"} label={"Zeitpunkt"} value={timestamp} onChange={handleChange}
                           type={"datetime-local"} InputLabelProps={{shrink: true}}/>
                <StyledButton onClick={initializeProducer}>
                    Initialisieren
                </StyledButton>
            </form>
        </WidgetComponent>
    );
}

export default InitializeProducer;