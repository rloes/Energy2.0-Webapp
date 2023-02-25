import React from 'react';

function PowerMixValues({data}) {
    return (
        <div className='text-md h-full flex flex-col justify-center gap-2 z-10'>
            <div className='flex flew-row'>
                {data.top.title} {data.top.value}{" kWh"}
            </div>
            <div className='flex flew-row'>
                {data.bottom.title} {data.bottom.value}{" kWh"}
            </div>
        </div>
    );
}

export default PowerMixValues;