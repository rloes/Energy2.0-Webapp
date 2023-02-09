import React, {useEffect, useState} from 'react';
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {Button, TextField} from "@mui/material";

function EditTimeframe({onSubmit, onClose}) {
    const [value, setValue] = useState({
        startDate: "",
        endDate: ""
    })
    const handleChange = (e) => {
        const {name, value} = e.target
        setValue((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = () => {
        let url = "";
        if (value.startDate) url += "start_date=" + value.startDate + "&"
        if (value.endDate) url += "end_date=" + value.endDate
        onSubmit(url)
        onClose()
    }

    return (
        <WidgetComponent>
            <form className={"flex flex-col gap-4"}>
                <TextField name={"startDate"} label={"Startdatum"} value={value.startDate} onChange={handleChange}
                           type={"date"} InputLabelProps={{
                    shrink: true,
                }}/>
                <TextField name={"endDate"} label={"Enddatum"} value={value.endDate} onChange={handleChange}
                           type={"date"} InputLabelProps={{
                    shrink: true,
                }}/>
                <div>
                    <Button onClick={handleSubmit}>
                        Speichern
                    </Button>
                    <Button onClick={onClose}>
                        Abbrechen
                    </Button>
                </div>
            </form>
        </WidgetComponent>
    );
}

export default EditTimeframe;