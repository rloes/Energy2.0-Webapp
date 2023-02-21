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
    IconButton, TextField,
} from "@mui/material";
import useQuery from "../../hooks/useQuery";
import WidgetComponent from "../../components/WidgetComponent/WidgetComponent";
import {DeleteForever, Edit} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import useApi from "../../hooks/useApi";
import StyledButton from "../../components/StyledButton";
import {roundToN} from "../../helpers";
import useFilter from "../../hooks/useFilter";

function Imprint() {



    return(
        <div>
            <h2 className={"page-title"}>Impressum</h2>
            <WidgetComponent>
                <div>
                    &nbsp; <br/>
                    <p>
                 Stadtwerke Münster GmbH
                <br/>

                Hafenplatz 1
                <br/>
                48155 Münster
                <br/>
                Fon 0251 694-0
                <br/>
                Fax 0251 694-1111
                <br/>
                        <br/>

                www.stadtwerke-muenster.de
                <br/>
                info(at)stadtwerke-muenster.de
                <br/>
                        <br/>

                Vorsitzender des Aufsichtsrates:
                        <br/>
                Walter von Göwels
                        <br/>
                        <br/>
                        Geschäftsführung:
                        <br/>
                Sebastian Jurczyk (Vorsitzender der Geschäftsführung, Geschäftsführer Energie), Frank Gäfgen (Geschäftsführer Mobilität)
                        <br/>
                        <br/>
                Handelsregister Nr. B 343 des Amtsgerichtes Münster
                        <br/>
                USt-ID: DE126118285
                    </p>
                </div>


                <TableContainer>
                    <Table>

                        <TableHead>

                        </TableHead>

                    </Table>
                </TableContainer>
            </WidgetComponent>
        </div>
    );

}

export default Imprint;