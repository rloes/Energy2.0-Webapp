import React, {useState} from 'react';
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button, IconButton, Dialog
} from "@mui/material";
import useQuery from "../../../hooks/useQuery";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {DeleteForever, Edit} from "@mui/icons-material";
import {Link, useNavigate} from 'react-router-dom'
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";
import AddConsumer from "../AddConsumer/AddConsumer";

const columnTitles = {
    id: "Kunden-ID",
    name: "Name",
    contract: "Vertrag",
    mail: "E-Mail",
    phone: "Telefonnumemr"
}

/**
 *
 * @param producerId - is set when List is rendered under AddProducer
 * @returns {JSX.Element}
 */
function ListConsumers({producerId, withoutTitle=false}) {
    const tableColumns = !producerId? ['id', 'name', 'contract', 'mail', 'phone'] : ['name']
    const [openDialog, setOpenDialog] = useState(false)

    const {data, error, loading, request} = useQuery({
        url: "consumers/" + String(producerId ? "?producer_id=" + String(producerId) : ""),
        method: "get",
        requestOnLoad: true
    })
    const {apiRequest} = useApi()
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    const handleDelete = (id) => {
        apiRequest({
            url: 'consumers/' + id + "/",
            method: "DELETE"
        }).then(() => {
            request().then(() => setNotification({message: "Kunde " + id + " gelöscht", severity: "warning"}))

        })
    }

    if (error) {
        return (
            <div>error</div>
        )
    }

    return (
        <div>
            {!withoutTitle &&
                <h2 className={"page-title"}>{producerId ? "Enthaltene Wohnungen" : "Kundenverwaltung"}</h2>
            }
            <WidgetComponent>
                <div className={"flex"}>
                    <h3 className={"text-lg font-bold px-4"}>
                        Kunden
                    </h3>
                    {!producerId ?
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
                        </StyledButton>
                    }

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
                                    <TableRow onClick={() => navigate("/kunden/"+consumer.id)}
                                    className={"hover:bg-gray-100 cursor-pointer"}>
                                        {tableColumns.map((column) => (
                                            <TableCell>
                                                {consumer[column]}{column === "peakPower" && " kWp"}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <StyledButton startIcon={<Edit/>} onClick={(e) => {
                                                e.stopPropagation()
                                                navigate('/kunden/' + consumer.id + "/bearbeiten")
                                            }}>
                                                Bearbeiten
                                            </StyledButton>
                                            <IconButton onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(consumer.id)
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
            {producerId &&
                <Dialog open={openDialog}>
                    <AddConsumer producerId={producerId} onClose={() => {
                        setOpenDialog(false)
                        request()
                    }}/>
                </Dialog>
            }
        </div>
    )
        ;
}

export default ListConsumers;