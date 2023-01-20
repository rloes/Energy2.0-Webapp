import React from 'react';
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button, IconButton
} from "@mui/material";
import useQuery from "../../../hooks/useQuery";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {DeleteForever, Edit} from "@mui/icons-material";
import {Link, useNavigate} from 'react-router-dom'
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";

const tableColumns = ['id', 'name', 'contract', 'mail', 'phone']
const columnTitles = {
    id: "Kunden-ID",
    name: "Name",
    contract: "Vertrag",
    mail: "E-Mail",
    phone: "Telefonnumemr"
}


function ListConsumers(props) {

    const {data, error, loading, request} = useQuery({url: "consumers/", method: "get", requestOnLoad: true})
    const {apiRequest} = useApi()
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    const handleDelete = (id) => {
        apiRequest({
            url: 'consumers/'+id+"/",
            method: "DELETE"
        }).then(() => {
            request().then(() => setNotification({message: "Kunde "+id+" gelöscht", severity:"warning"}))

        })
    }

    if (error) {
        return (
            <div>error</div>
        )
    }

    return (
        <div>
            <h2 className={"page-title"}>Kundenverwaltung</h2>
            <WidgetComponent>
                <div className={"flex"}>
                    <h3 className={"text-lg font-bold px-4"}>
                        Kunden
                    </h3>
                    <Link to={"./erstellen"}>
                        <StyledButton>
                            Kunde hinzufügen
                        </StyledButton>
                    </Link>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableColumns.map((column) => (
                                    <TableCell>
                                        <h4 className={"font-semibold"}>
                                            {columnTitles[column]}
                                        </h4>
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <h4 className={"font-bold"}>
                                        Aktionen
                                    </h4>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading || error ?
                                <TableRow>
                                    <TableCell>
                                        <div>
                                            <CircularProgress/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                :
                                data.map((consumer) => (
                                    <TableRow>
                                        {tableColumns.map((column) => (
                                            <TableCell>
                                                {consumer[column]}{column === "peakPower" && " kWp"}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <StyledButton startIcon={<Edit/>} onClick={() => {
                                                navigate('./'+consumer.id+"/bearbeiten")
                                            }}>
                                                Bearbeiten
                                            </StyledButton>
                                            <IconButton onClick={() => handleDelete(consumer.id)}>
                                                <DeleteForever />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </WidgetComponent>
        </div>
    );
}

export default ListConsumers;