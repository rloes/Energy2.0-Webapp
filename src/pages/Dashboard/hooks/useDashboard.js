import React, {useEffect, useState} from 'react';
import useQuery from "../../../hooks/useQuery";
import {FormControl, InputLabel, Select} from "@mui/material";
import {getMonday, getISODateWithDelta,} from "../../../helpers";


function useDashboard() {

    // transformed data for charts ares stored here after transformation
    const [transformedData, setTransformedData] = useState({})
    const [url, setUrl] = useState("")
    const [selectedTimeframe, setSelectedTimeframe] = useState(0)
    // functions to set the url params after a different timeframe is selected
    const timeFrames = {
        0 : () => "start_date="+getISODateWithDelta(-30),
        1 : () => "start_date="+getISODateWithDelta(0)+"&end_date="+getISODateWithDelta(1),
        2 : () => "start_date="+getMonday()
    }
    const {data, loading, error, request, setLoading, cancel} = useQuery({
        method: "GET",
        url: "/output/?producer_id=12&" + url,
        // url: "/output/?producer_id=12",
        requestOnLoad: true
    })

    const handleSelectChange = (e) => {
        setSelectedTimeframe(e.target.value)
        // Cancel all open requests
        cancel()
    }

    // if selectedTimeFrame changes -> new URL -> new request
    useEffect(() => {
        setUrl(timeFrames[selectedTimeframe])
        setLoading(true)
    }, [selectedTimeframe])


    // if data is set -> transform
    useEffect(() => {
        if(data) setTransformedData({"lineChartData": lineChartData(data)})
    }, [data])


    /**
     * Transforms data from backend /output/ to array that is usable by @nivo's LineChart
     * @returns {*[] || undefined}
     */
    const lineChartData = () => {
        const _transformedData = []
        if (!data) {
            return
        }
        if (data?.productions) {
            const productions = {"id": "Produktion", 'data': []}
            for (let i = 0; i < data.productions.length; i++) {
                // map through all productions -> set x = datetime and y = produced
                const production = data.productions[i]
                productions['data'].push({
                    "x": production.time,
                    "y": production.produced
                })
            }
            _transformedData.push(productions)
        }

        // depending on view(consumer, producer, overall) -> consumers in different objects
        const consumers = Object.values(data?.consumers) || [{'consumptions': data?.consumptions}]
        for (let j = 0; j < consumers.length; j++) {
            // for each consumer
            const consumer = consumers[j]
            const consumptions = {"id": Object.keys(data.consumers)[j] || "Verbrauch", 'data': []}
            for (let i = 0; i < consumer.consumptions.length; i++) {
                // map through all productions -> set x = datetime and y = consumption
                const consumption = consumer.consumptions[i]
                consumptions.data.push({
                    "x": consumption.time,
                    "y": consumption.consumption
                })
            }
            _transformedData.push(consumptions)
        }

        return _transformedData
    }

    return {lineChartData, transformedData, selectedTimeframe, handleSelectChange, loading, data};
}

export default useDashboard;