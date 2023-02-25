import React from 'react';
import WidgetComponent from "./WidgetComponent";
import {Link} from "react-router-dom";
import StyledButton from "./StyledButton";
import {
    CircularProgress, Dialog, IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {DeleteForever, Edit} from "@mui/icons-material";
import AddConsumer from "../pages/admin/AddConsumer/AddConsumer";
import ErrorMessage from "./ErrorMessage";

function ListEntityTable({
                             editMode,
                             title,
                             pageTitle,
                             AddEntityButton,
                             searchQuery,
                             onQueryChange,
                             columns,
                             columnTitles,
                             loading,
                             error,
                             data,
                             renderColumn,
                             onRowClick,
                             renderActions,
                             withoutTitle
                         }) {
    return (
        <div className={withoutTitle ? "max-h-full relative h-full" : ""}>
            {!withoutTitle &&
                <h2 className={"page-title"}>{pageTitle}</h2>
            }
            <WidgetComponent className={withoutTitle ? "flex flex-col max-h-full h-full" : "w-max"}>
                <div className={"flex"}>
                    <h3 className={"text-lg font-bold px-4"}>
                        {title}
                    </h3>
                    {AddEntityButton}
                    {!withoutTitle &&
                        <TextField value={searchQuery} onChange={(e) => onQueryChange(e)}
                                   size={"small"} className={"!ml-auto"} placeholder={"Suchen...."}/>
                    }
                </div>
                <TableContainer className={withoutTitle ? "flex overflow-y-auto" : ""}>
                    <Table>
                        <TableHead className={withoutTitle ? "sticky top-0 bg-white z-10" : ""}>
                            <TableRow>
                                {columns.map((column) => (
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
                                    <TableCell colSpan={(Object.keys(columnTitles).length + 1)}>
                                        {loading ?
                                            <div className={"flex justify-center items-center"}>
                                                <CircularProgress/>
                                            </div>
                                            :
                                            <ErrorMessage/>
                                        }
                                    </TableCell>
                                </TableRow>
                                :
                                data.map((entitiy) => (
                                    <TableRow onClick={() => onRowClick(entitiy)}
                                              className={"hover:bg-gray-100 cursor-pointer"} key={entitiy.id}>
                                        {columns.map((column) => (
                                            <TableCell key={column}>
                                                {!renderColumn ? entitiy[column] : renderColumn(entitiy, column)}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            {renderActions(entitiy)}
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

export default ListEntityTable;