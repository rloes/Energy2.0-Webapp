
import React, {useEffect, useState} from 'react';
import useQuery from "../../../hooks/useQuery";
import {FormControl, InputLabel, Select} from "@mui/material";
import {getMonday, getISODateWithDelta} from "../../../helpers";


function Umsaetze() {

    const [umsaetze, setUmsaetze] = useState('')

    useEffect(() => {
        getData()
    }, [])


    const getData = async () => {
        const umsaetzeResponse = await fetch('/output/?producer_id=12&')
        const umsaetzeData = await umsaetzeResponse.json()
        setUmsaetze(umsaetzeData)
    }

// useEffect(() => {
//     getDetails()
// }, [])
// <div>
//     {transformedData.producerData && transformedData.producerData.name}
// </div>

// // functions to set the url params after a different timeframe is selected
// const timeFrames = {
//     0: () => "",
//     1: () => "start_date=" + getISODateWithDelta(0) + "&end_date=" + getISODateWithDelta(1),
//     2: () => "start_date=" + getMonday()
// }
// // if selectedTimeFrame changes -> new URL -> new request
// // useEffect(() => {
// //     setUrl(timeFrames[selectedTimeframe])
// //     setLoading(true)
// // }, [selectedTimeframe])

    

    return (
        // console.log(umsaetze)
       
 
          <div>
            {umsaetze.consumers_total_revenue}
          </div>
       
       
    )
}

export default Umsaetze



