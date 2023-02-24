import React from 'react';
import WidgetComponent from "../../../components/WidgetComponent";
import {CircularProgress} from "@mui/material";
import ErrorMessage from "../../../components/ErrorMessage";

function DataDisplay({
                         titel,
                         value,
                         unit = "",
                         icon,
                         loading,
                         renderOnError = false,
                         render = false,
                         subtitle = false
                     }) {
    return (
        <WidgetComponent className={"h-full"}>
            <div className={"relative flex flex-col justify-start h-full"}>
                <div className={"absolute top-0 right-0"}>
                    {icon}
                </div>
                <h3 className={"font-bold self-start"}>{titel}</h3>
                {value || loading || value === 0?
                    render === false ?
                        <>
                            <div className={"text-3xl font-bold self-center my-auto"}>
                                {(value || value === 0) && !loading ? value + (unit && " " + unit) : <CircularProgress/>}
                            </div>
                            {(subtitle && !loading && (value || value === 0)) &&
                                <div className={"self-center"}>
                                    {subtitle}
                                </div>
                            }
                        </>
                        :
                        <div className={"w-full h-full flex justify-center"}>
                            {/*{value && !loading ? render : <Skeleton variant={"rounded"} width={"50%"} height={"50%"} />}*/}
                            {value && !loading ? render : <CircularProgress className={"self-center"}/>}
                        </div>
                    :
                    <div className={"text-3xl font-bold self-center my-auto"}>
                        {renderOnError ? renderOnError
                            :
                            <ErrorMessage />
                        }
                    </div>
                }
            </div>
        </WidgetComponent>
    );
}

export default DataDisplay;