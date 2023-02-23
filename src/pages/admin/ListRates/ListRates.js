import React from 'react';
import ListEntityTable from "../../../components/ListEntityTable";
import useQuery from "../../../hooks/useQuery";
import useApi from "../../../hooks/useApi";
import {Link, useNavigate} from "react-router-dom";
import useFilter from "../../../hooks/useFilter";
import {roundToN} from "../../../helpers";
import StyledButton from "../../../components/StyledButton";
import {DeleteForever, Edit} from "@mui/icons-material";
import {IconButton} from "@mui/material";

const tableColumns = ["name", "reducedPrice", "price", "flexible"];
const columnTitles = {
    name: "Bezeichnung",
    reducedPrice: "PV-Preis (ct/kWh)",
    price: "Netzpreis (ct/kWh)",
    flexible: "Flexibler Tarif",
};

function ListRates({withoutTitle = false}) {
    const {data, error, loading, request} = useQuery({
        url: "rates/",
        method: "get",
        requestOnLoad: true,
    });
    const {apiRequest} = useApi();
    const navigate = useNavigate();

    const {value: filteredData, setQuery, query, handleQueryChange} = useFilter({
        params:
            {name: true},
        data: data
    })

    const handleDelete = (id) => {
        apiRequest({
            url: "rates/" + id + "/",
            method: "DELETE",
        }).then(request);
    };

    return (
        <ListEntityTable data={filteredData} error={error} loading={loading} searchQuery={query}
                         onQueryChange={handleQueryChange} columns={tableColumns} columnTitles={columnTitles}
                         title={"Tarife"} pageTitle={"Tarifverwaltung"} withoutTitle={withoutTitle}
                         renderColumn={(rate, column) => (column !== "flexible" ?
                             column === "price" || column === "reducedPrice" ?
                                 roundToN(Number(rate[column]), 0) + "ct" : rate[column]
                             :
                             rate[column] ? "ja" : "nein")}
                         AddEntityButton={
                             <Link to={"./erstellen"}>
                                 <StyledButton>Tarif hinzufügen</StyledButton>
                             </Link>}
                         renderActions={(rate) => (
                             <>
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
                             </>
                         )}

        />
    );
}

export default ListRates;