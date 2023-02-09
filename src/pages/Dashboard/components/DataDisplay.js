import React from 'react';
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {CircularProgress, Skeleton} from "@mui/material";

function DataDisplay({titel, value, icon, loading, render = false, subtitle = false}) {
    return (
        <WidgetComponent className={"h-full"}>
            <div className={"relative flex flex-col justify-start h-full"}>
                <div className={"absolute top-0 right-0"}>
                    {icon}
                </div>
                <h3 className={"font-bold self-start"}>{titel}</h3>
                {render === false ?
                    <>
                        <div className={"text-3xl font-bold self-center my-auto"}>
                            {value && !loading ? value : <CircularProgress/>}
                        </div>
                        {(subtitle && !loading && value) &&
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
                }
            </div>
        </WidgetComponent>
    );
}

export default DataDisplay;