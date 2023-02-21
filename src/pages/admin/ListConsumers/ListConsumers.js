import React, {useState} from 'react';
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button, IconButton, Dialog, TextField
} from "@mui/material";
import useQuery from "../../../hooks/useQuery";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {DeleteForever, Edit} from "@mui/icons-material";
import {Link, useNavigate} from 'react-router-dom'
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";
import AddConsumer from "../AddConsumer/AddConsumer";
import useFilter from "../../../hooks/useFilter";

const columnTitles = {
    id: "Kunden-ID",
    name: "Name",
    email: "E-Mail",
    phone: "Telefonnummer"
}

/**
 *
 * @param producerId - is set when List is rendered under AddProducer
 * @returns {JSX.Element}
 */
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

    const {value: filteredData, setQuery, query} = useFilter({
        params:
            {name: true},
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

    if (error) {
        return (
            <div>error</div>
        )
    }

    const consumers = query === "" ? data : filteredData
    return (
        <div className={withoutTitle ? "max-h-full relative h-full":""}>
            {!withoutTitle &&
                <h2 className={"page-title"}>{withoutTitle ? "Enthaltene Wohnungen" : "Kundenverwaltung"}</h2>
            }
            <WidgetComponent className={withoutTitle ? "flex flex-col max-h-full h-full":"w-max"}>
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
                    {!withoutTitle &&
                        <TextField value={query} onChange={(e) => setQuery(e.target.value)}
                                   size={"small"} className={"!ml-auto"} placeholder={"Suchen...."}/>
                    }
                </div>
                <TableContainer className={withoutTitle ? "flex overflow-y-auto":""}>
                    <Table>
                        <TableHead className={withoutTitle ? "sticky top-0 bg-white z-10":""}>
                            <TableRow>
                                {tableColumns.map((column) => (
                                    <TableCell key={column}>
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
                                consumers.map((consumer) => (
                                    <TableRow onClick={() => navigate("/kunden/" + consumer.id)}
                                              className={"hover:bg-gray-100 cursor-pointer"} key={consumer.id}>
                                        {tableColumns.map((column) => (
                                            <TableCell key={column}>
                                                {consumer[column]}{column === "peakPower" && " kWp"}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <StyledButton startIcon={<Edit/>} onClick={(e) => {
                                                e.stopPropagation()
                                                navigate('/kunden/' + consumer.id + "/bearbeiten")
                                            }}>
                                                {!withoutTitle && "Bearbeiten"}
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