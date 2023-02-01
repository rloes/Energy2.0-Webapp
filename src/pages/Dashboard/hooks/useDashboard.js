import React, {useEffect, useState} from 'react';
import useQuery from "../../../hooks/useQuery";
import {FormControl, InputLabel, Select} from "@mui/material";
import {getMonday, getISODateWithDelta, roundToN} from "../../../helpers";
import useApi from "../../../hooks/useApi";

function useDashboard(producerId, consumerId) {

    // transformed data for charts ares stored here after transformation
    const [transformedData, setTransformedData] = useState({})
    const [url, setUrl] = useState("")
    const [selectedTimeframe, setSelectedTimeframe] = useState(0)
    const {apiRequest} = useApi()

    const {data, loading, error, request, setLoading, cancel} = useQuery({
        method: "GET",
        url: "output/?" + (producerId ? "producer_id=" + producerId + "&" : consumerId ? "consumer_id=" + consumerId + "&" : "")
            + url,
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
        0: () => "",
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
        if (data) setTransformedData((prev) => ({
            ...prev,
            "lineChartData": lineChartData(),
            "totalSavedData": totalSavedData(),
            "totalRevenueData": totalRevenueData(),
            "consumptionData": consumptionData(),
            "savedC02Data": savedCO2()
        }))
    }, [data])

    useEffect(() => {
        getDetails()
    }, [])


    const [aggregateConsumption, setAggregateConsumption] = useState(false)
    useEffect(() => {
        setTransformedData((prev) => ({
            ...prev, 'lineChartData': lineChartData()
        }))
    }, [aggregateConsumption])
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
        if (producers[0].productions) {
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
        let consumers = data.consumers ? Object.values(data.consumers) : [{'consumptions': data.consumptions}]
        if (data.consumptions && aggregateConsumption) {
            consumers = [{'consumptions': data.consumptions}]
        }
        if (consumers[0].consumptions) {
            for (let j = 0; j < consumers.length; j++) {
                // for each consumer
                const consumer = consumers[j]
                const consumptions = {"id": data.consumers && !(data.consumptions && aggregateConsumption) ?
                        Object.keys(data.consumers)[j] : "Verbrauch", 'data': []}
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

    const getDetails = () => {
        if (producerId) {
            apiRequest({
                method: "GET",
                url: "/producers/" + producerId + "/"
            }).then((res) => {
                console.log(res)
                setTransformedData((prev) => ({
                    ...prev, producerData: res.data
                }))
            })
        }
    }

    /**
     * Fetches total_saved from backend /output/ so that it is usable in box "Einsparung"
     */
    const totalSavedData = () => {
        let total_saved = 0;
        if (data) {
            if (data.producersTotalSaved) {
                total_saved = data.producersTotalSaved;
            } else if (data.consumersTotalSaved) {
                total_saved = data.consumersTotalSaved;
            } else if (data.totalSaved) {
                total_saved = data.totalSaved;
            }
        }
        total_saved = Number(total_saved) / 100
        return roundToN(total_saved, 2);
    }
    /**
     * Fetches total_revenue from backend /output/ so that it is usable in box "Wirtschaftliche KPIs"
     * @returns total_revenue
     */
    const totalRevenueData = () => {
        let totalRevenue = 0
        if (data) {
            if (data.producersTotalRevenue) {
                totalRevenue = data.producersTotalRevenue
            } else if (data.consumersTotalRevenue) {
                totalRevenue = data.consumersTotalRevenue
            } else if (data.totalPrice) {
                totalRevenue = data.totalPrice
                let totalGridPrice = data.totalGridPrice
            }
            totalRevenue = totalRevenue / 100
        }
        return roundToN(totalRevenue, 2)
    }

    const consumptionData = () => {
        let totalConsumption = 0;
        if (data) {
            if (data.consumersTotalConsumption) {
                totalConsumption = data.consumersTotalConsumption;
            } else if (data.totalConsumption) {
                totalConsumption = data.totalConsumption;
            } else if (data.producersTotalConsumption
            ) {
                totalConsumption = data.producersTotalConsumption
                ;
            }
        }

        return roundToN(totalConsumption, 2);
    }

    const savedCO2 = () => {
        const savingPerKwh = 0.35 // 400g/kWh deutscher Strom und Solaranlage ca. 50g/kWh -> 350g = 0.35kg
        let usedSelfProduction = 0
        if (data.producersTotalUsed) {
            usedSelfProduction = data.producersTotalUsed
        } else if (data.totalUsed) {
            usedSelfProduction = data.totalUsed
        } else if (data.totalSelfConsumption) {
            usedSelfProduction = data.totalSelfConsumption
        }

        return roundToN(savingPerKwh * usedSelfProduction, 1)
    }


    return {
        lineChartData,
        transformedData,
        selectedTimeframe,
        handleSelectChange,
        loading,
        data,
        aggregateConsumption,
        setAggregateConsumption
    };
}

export default useDashboard;