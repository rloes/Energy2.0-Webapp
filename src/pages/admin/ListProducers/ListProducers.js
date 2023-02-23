import React from 'react';
import ListEntityTable from "../../../components/ListEntityTable";
import useQuery from "../../../hooks/useQuery";
import useApi from "../../../hooks/useApi";
import {Link, useNavigate} from "react-router-dom";
import useNotificationStore from "../../../stores/useNotificationStore";
import useFilter from "../../../hooks/useFilter";
import StyledButton from "../../../components/StyledButton";
import {DeleteForever, Edit} from "@mui/icons-material";
import {IconButton} from "@mui/material";

const columnTitles = {
    name: "Bezeichnung", peakPower: "Installierte Leistung"
}

function ListProducers({withoutTitle}) {
    const {data, error, loading, request} = useQuery({url: "producers/", method: "get", requestOnLoad: true})
    const {apiRequest} = useApi()
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    const {value: filteredData, query, handleQueryChange} = useFilter({
        params: {name: true, street: true, zipCode: true, city: true},
        data: data
    })

    const tableColumns = !withoutTitle ? ['name', 'peakPower'] : ["name"]

    const handleDelete = (id) => {
        apiRequest({
            url: 'producers/' + id + "/", method: "DELETE"
        }).then(() => {
            request().then(() => setNotification({message: "Produzent " + id + " gelöscht", severity: "warning"}))

        })
    }
    //const producers = query === "" ? data : filteredData
    return (
        <ListEntityTable data={filteredData} error={error} loading={loading} searchQuery={query}
                         onQueryChange={handleQueryChange} columns={tableColumns} columnTitles={columnTitles}
                         pageTitle={"Solaranlagenverwaltung"} title={"Solaranlagen"} withoutTitle={withoutTitle}
                         onRowClick={(producer) => (navigate("/solaranlagen/" + String(producer.id)))}
                         renderColumn={(producer, column) => producer[column] + (column === "peakPower" ? " kWp" : "")}
                         AddEntityButton={
                             <Link to={"/solaranlagen/erstellen"}>
                                 <StyledButton>
                                     Solaranlage hinzufügen
                                 </StyledButton>
                             </Link>}
                         renderActions={(producer) => (
                             <>
                                 <StyledButton startIcon={<Edit/>} onClick={(e) => {
                                     e.stopPropagation()
                                     navigate('/solaranlagen/' + producer.id + "/bearbeiten")
                                 }}>
                                     {!withoutTitle && "Bearbeiten"}
                                 </StyledButton>
                                 <IconButton onClick={(e) => {
                                     e.stopPropagation()
                                     handleDelete(producer.id)
                                 }}>
                                     <DeleteForever/>
                                 </IconButton>
                             </>
                         )}
        />
    );
}

export default ListProducers;