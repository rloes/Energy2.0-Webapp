import React, {useState} from 'react';
import ListEntityTable from "../../../components/ListEntityTable";
import useQuery from "../../../hooks/useQuery";
import useApi from "../../../hooks/useApi";
import {Link, useNavigate} from "react-router-dom";
import useNotificationStore from "../../../stores/useNotificationStore";
import useFilter from "../../../hooks/useFilter";
import StyledButton from "../../../components/StyledButton";
import {DeleteForever, Edit} from "@mui/icons-material";
import {Dialog, IconButton} from "@mui/material";
import AddConsumer from "../AddConsumer/AddConsumer";

const columnTitles = {
    id: "Kunden-ID",
    name: "Name",
    email: "E-Mail",
    phone: "Telefonnummer"
}

function ListConsumers({producerId, withoutTitle = false}) {
    const tableColumns = !producerId ? ['id', 'name', 'email', 'phone'] : ['name']
    const [openDialog, setOpenDialog] = useState(false)

    const {data, error, loading, request} = useQuery({
        url: "consumers/" + String(producerId ? "?producer_id=" + String(producerId) : ""),
        method: "get",
        requestOnLoad: true
    })
    const {apiRequest} = useApi()
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    const {value: filteredData, query, handleQueryChange} = useFilter({
        params:
            {name: true, email: true, phone: true, id: true},
        data: data
    })

    const handleDelete = (id) => {
        apiRequest({
            url: 'consumers/' + id + "/",
            method: "DELETE"
        }).then(() => {
            request().then(() => setNotification({message: "Kunde " + id + " gelöscht", severity: "warning"}))

        })
    }

    return (
        <>
            <ListEntityTable data={filteredData} error={error} loading={loading} searchQuery={query}
                             onQueryChange={handleQueryChange} columns={tableColumns} columnTitles={columnTitles}
                             pageTitle={"Kundenverwaltung"} title={"Kunden"} withoutTitle={withoutTitle} editMode={producerId}
                             onRowClick={(consumer) => navigate("/kunden/" + consumer.id)}
                             AddEntityButton={!producerId ?
                                 <Link to={"/kunden/erstellen"}>
                                     <StyledButton>
                                         Kunde hinzufügen
                                     </StyledButton>
                                 </Link>
                                 :
                                 <StyledButton onClick={() => {
                                     setOpenDialog((prev) => (!prev))
                                 }
                                 }>
                                     Kunde hinzufügen
                                 </StyledButton>}
                             renderActions={(entity) => (
                                 <>
                                     <StyledButton startIcon={<Edit/>} onClick={(e) => {
                                         e.stopPropagation()
                                         navigate('/kunden/' + entity.id + "/bearbeiten")
                                     }}>
                                         {!withoutTitle && "Bearbeiten"}
                                     </StyledButton>
                                     <IconButton onClick={(e) => {
                                         e.stopPropagation()
                                         handleDelete(entity.id)
                                     }}>
                                         <DeleteForever/>
                                     </IconButton>
                                 </>)
                             }
            />
            {producerId &&
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <AddConsumer producerId={producerId} onClose={() => {
                        setOpenDialog(false)
                        request()
                    }}/>
                </Dialog>
            }
        </>
    );
}

export default ListConsumers;