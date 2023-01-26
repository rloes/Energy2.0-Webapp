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

const columnTitles = {
    name: "Bezeichnung",
    peakPower: "Installierte Leistung"
}

function ListProducers({withoutTitle}) {

    const {data, error, loading, request} = useQuery({url: "producers/", method: "get", requestOnLoad: true})
    const {apiRequest} = useApi()
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    const tableColumns = !withoutTitle? ['name', 'peakPower'] : ["name"]

    const handleDelete = (id) => {
        apiRequest({
            url: 'producers/' + id + "/",
            method: "DELETE"
        }).then(() => {
            request().then(() => setNotification({message: "Produzent " + id + " gelöscht", severity: "warning"}))

        })
    }

    if (error) {
        return (
            <div>error</div>
        )
    }

    return (
        <div className={withoutTitle && "max-h-full relative h-full"}>
            {!withoutTitle &&
                <h2 className={"page-title"}>Solaranlagenverwaltung</h2>
            }
            <WidgetComponent className={withoutTitle &&"flex flex-col max-h-full"}>
                <div className={"flex"}>
                    <h3 className={"text-lg font-bold px-4"}>
                        Solaranlagen
                    </h3>
                    <Link to={"/solaranlagen/erstellen"}>
                        <StyledButton>
                            Solaranlage hinzufügen
                        </StyledButton>
                    </Link>
                </div>
                <TableContainer className={"flex"}>
                    <Table>
                        <TableHead className={withoutTitle && "sticky top-0 bg-white z-10"}>
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
                                data.map((producer) => (
                                    <TableRow onClick={() => (navigate("/solaranlagen/"+String(producer.id)))}
                                              className={"cursor-pointer hover:bg-gray-100"} href={String(producer.id)}
                                    >
                                        {tableColumns.map((column) => (
                                            <TableCell>
                                                {producer[column]}{column === "peakPower" && " kWp"}
                                            </TableCell>
                                        ))}
                                        <TableCell>
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

export default ListProducers;