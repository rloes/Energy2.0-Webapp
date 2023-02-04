import React from 'react';
import {CircularProgress, Skeleton} from "@mui/material";
import { roundToN } from '../../../helpers';
import useDashboard from '../hooks/useDashboard';


function PowerMixValues({data}) {
    return (
        <div className='text-sm whitespace-nowrap'>
                    <h3>{data.top.title}{data.top.value}</h3>
                    <h3>{data.bottom.title}{data.bottom.value}</h3>
        </div>
    );
}

export default PowerMixValues;