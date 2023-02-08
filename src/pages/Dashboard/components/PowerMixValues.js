import React from 'react';

function PowerMixValues({data}) {
    return (
        <div className='text-sm grid grid-col content-center'>
            <div className='flex flew-row'>
                <div>{data.top.title}</div> 
                <div>{data.top.value}</div>
                <div>{" kWh"}</div>
            </div>
            <div className='flex flew-row'>
                <div>{data.bottom.title}</div> 
                <div>{data.bottom.value}</div>
                <div>{" kWh"}</div>
            </div>
        </div>
    );
}

export default PowerMixValues;