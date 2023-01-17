import React from "react";
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
} from "@mui/material";
import useQuery from "../../../hooks/useQuery";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {DeleteForever, Edit} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";

const tableColumns = ["name", "reducedPrice", "price", "flexible"];
const columnTitles = {
    name: "Bezeichnung",
    reducedPrice: "PV-Preis (ct/kWh)",
    price: "Netzpreis (ct/kWh)",
    flexible: "Flexibler Tarif",
};

function ListRates(props) {
    const {data, error, loading, request} = useQuery({
        url: "rates/",
        method: "get",
        requestOnLoad: true,
    });
    const {apiRequest} = useApi();
    const navigate = useNavigate();

    const handleDelete = (id) => {
        apiRequest({
            url: "rates/" + id + "/",
            method: "DELETE",
        }).then(request);
    };

    if (error) {
        return <div>error</div>;
    }

    return (
        <div>
            <h2 className={"page-title"}>Tarifverwaltung</h2>
            <WidgetComponent>
                <div className={"flex"}>
                    <h3 className={"text-lg font-bold px-4"}>Tarife</h3>
                    <Link to={"./erstellen"}>
                        <StyledButton>Tarif hinzufügen</StyledButton>
                    </Link>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableColumns.map((column) => (
                                    <TableCell>
                                        <h4 className={"font-semibold"}>{columnTitles[column]}</h4>
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <h4 className={"font-bold"}>Aktionen</h4>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading || error ? (
                                <TableRow>
                                    <TableCell>
                                        <div>
                                            <CircularProgress/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((rate) => (
                                    <TableRow>
                                        {tableColumns.map((column) => (
                                            <TableCell>{column !== "flexible" ? rate[column] :
                                                rate[column] ? "ja" : "nein"}</TableCell>

                                        ))}
                                        <TableCell>
                                            <StyledButton
                                                startIcon={<Edit/>}
                                                onClick={() => {
                                                    navigate("./" + rate.id + "/bearbeiten");
                                                }}
                                            >
                                                Bearbeiten
                                            </StyledButton>
                                            <IconButton onClick={() => handleDelete(rate.id)}>
                                                <DeleteForever/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </WidgetComponent>
        </div>
    );
}

export default ListRates;
