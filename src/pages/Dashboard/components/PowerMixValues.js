import React from 'react';
import {CircularProgress, Skeleton} from "@mui/material";
import { roundToN } from '../../../helpers';
import useDashboard from '../hooks/useDashboard';


function PowerMixValues({data}) {
    console.log({data})
    return (
        <div className='text-md whitespace-nowrap self-start h-full flex flex-col justify-around'>
                    <h3>{data.top.title}{data.top.value} kWh</h3>
                    <h3>{data.bottom.title}{data.bottom.value} kWh</h3>
        </div>
    );
}

export default PowerMixValues;