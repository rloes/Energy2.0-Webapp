import React, {useEffect, useState} from 'react';
import useQuery from "../../../hooks/useQuery";
import {FormControl, InputLabel, Select} from "@mui/material";
import {getMonday, getISODateWithDelta} from "../../../helpers";


function useDashboard() {

    // transformed data for charts ares stored here after transformation
    const [transformedData, setTransformedData] = useState({})
    const [url, setUrl] = useState("")
    const [selectedTimeframe, setSelectedTimeframe] = useState(0)

    const {data, loading, error, request, setLoading, cancel} = useQuery({
        method: "GET",
        url: "/output/?producer_id=12&" + url,
        // url: "/output/?consumer_id=3&" + url,
        requestOnLoad: true
    })

    const handleSelectChange = (e) => {
        setSelectedTimeframe(e.target.value)
        // Cancel all open requests
        cancel()
    }

    // functions to set the url params after a different timeframe is selected
    const timeFrames = {
        0: () => "start_date=" + getISODateWithDelta(-30),
        1: () => "start_date=" + getISODateWithDelta(0) + "&end_date=" + getISODateWithDelta(1),
        2: () => "start_date=" + getMonday()
    }
    // if selectedTimeFrame changes -> new URL -> new request
    useEffect(() => {
        setUrl(timeFrames[selectedTimeframe])
        setLoading(true)
    }, [selectedTimeframe])


    // if data is set -> transform
    useEffect(() => {
        if (data) setTransformedData({"lineChartData": lineChartData(data)})
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
        const producers = data.producers ? Object.values(data.producers) : [{'productions': data.productions}]
        if (producers) {
            for (let j = 0; j < producers.length; j++) {
                const producer = producers[j]
                const productions = {
                    "id": data.producers ? "Produktion " + Object.keys(data.producers)[j] : "Produktion",
                    'data': []
                }
                let production_sum = 0
                for (let i = 0; i < producer.productions.length; i++) {
                    // map through all productions -> set x = datetime and y = produced
                    const production = producer.productions[i]
                    if (selectedTimeframe === 0 || selectedTimeframe === 2) {
                        // if timeframe = 30 days -> reduced to sum per day
                        // if timeframe = 1 week -> reduce to sum per hour
                        const add = (val) => production_sum += val
                        const push = (val) => productions['data'].push(val)
                        reduceData(production, producer.productions, production_sum, add, push, i, 'produced')
                    } else {
                        productions['data'].push({
                            "x": production.time,
                            "y": production.produced
                        })
                    }
                }
                _transformedData.push(productions)
            }
        }

        // depending on view(consumer, producer, overall) -> consumers in different objects
        const consumers = data.consumers ? Object.values(data.consumers) : [{'consumptions': data.consumptions}]
        if(consumers[0].consumptions) {
            for (let j = 0; j < consumers.length; j++) {
                // for each consumer
                const consumer = consumers[j]
                const consumptions = {"id": data.consumers ? Object.keys(data.consumers)[j] : "Verbrauch", 'data': []}
                let consumption_sum = 0
                for (let i = 0; i < consumer.consumptions.length; i++) {
                    // map through all consumptions -> set x = datetime and y = consumption
                    const consumption = consumer.consumptions[i]
                    if (selectedTimeframe === 0 || selectedTimeframe === 2) {
                        // if timeframe = 30 days -> reduced to sum per day
                        // if timeframe = 1 week -> reduce to sum per hour
                        const add = (val) => consumption_sum += val
                        const push = (val) => consumptions['data'].push(val)
                        reduceData(consumption, consumer.consumptions, consumption_sum, add, push, i, 'consumption')
                    } else {
                        consumptions.data.push({
                            "x": consumption.time,
                            "y": consumption.consumption
                        })
                    }
                }
                _transformedData.push(consumptions)
            }
        }
        return _transformedData
    }

    const reductions = {
        0: (date, nextDate) => date.getDate() !== nextDate.getDate(),
        2: (date, nextDate) => date.getHours() !== nextDate.getHours()
    }
    const transformTime = {
        0: (timeStr) => timeStr.split("T")[0] + "T00:00:00",
        2: (timeStr) => timeStr.split(":")[0] + ":00:00",
    }

    /**
     * reduces the number of points in dataset by taking the sum of a certain timerange and adding it as a single point
     * This function gets a single point from a transformation function(e.g. lineChartData) and decides given on date,
     * and index if it should only be added to the sum or pushed to the dataset and reset the sum
     *
     * @param point - current point
     * @param points - dataset
     * @param sum - current_sum
     * @param add(val) - function to call when only adding to sum
     * @param push(val) - function to c all when pushing to dataset
     * @param index - index of point in points
     * @param valueKey - the value that should be added is stored in point[valueKey]
     */
    function reduceData(point, points, sum, add, push, index, valueKey) {
        const date = new Date(point.time)
        // if point is not the last in points -> only push if...
        if (index < points.length - 1) {
            const nextDate = new Date(points[index + 1].time)
            // ... next date is in a different reduction timeframe -> push
            if (reductions[selectedTimeframe](date, nextDate)) {
                push({
                    "x": transformTime[selectedTimeframe](point.time),
                    "y": sum + Number(point[valueKey])
                })
                // reset sum to 0
                add(-sum)
            } else {
                add(Number(point[valueKey]))
            }

        } else { // if point is last in points -> push
            push({
                "x": transformTime[selectedTimeframe](point.time),
                "y": sum + Number(point[valueKey])
            })
            add(-sum)
        }
    }

    return {lineChartData, transformedData, selectedTimeframe, handleSelectChange, loading, data};
}

export default useDashboard;