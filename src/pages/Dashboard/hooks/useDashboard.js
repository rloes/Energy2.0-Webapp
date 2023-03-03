import React, {useEffect, useState} from 'react';
import useQuery from "../../../hooks/useQuery";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getMonday, getISODateWithDelta, roundToN} from "../../../helpers";
import useApi from "../../../hooks/useApi";
import {flushSync} from "react-dom";

const TimeframeSelect = ({selectedTimeframe, onChange}) => {
    return (
        <FormControl className={"w-[175px]"} size={"small"}>
            <InputLabel id="timeframe-select-label">Zeit</InputLabel>
            <Select
                labelId={"timeframe-select-label"}
                value={selectedTimeframe}
                label="Zeit"
                onChange={onChange}
            >
                <MenuItem value={0}>30 Tage</MenuItem>
                <MenuItem value={1}>Heute</MenuItem>
                <MenuItem value={2}>Aktuelle Woche</MenuItem>
                <MenuItem value={3}>Benutzerdefiniert</MenuItem>
            </Select>
        </FormControl>
    )
}

const reductions = {
    day: (date, nextDate) => date.getDate() !== nextDate.getDate(),
    hour: (date, nextDate) => date.getHours() !== nextDate.getHours(),
}
const transformTime = {
    day: (timeStr) => timeStr.split("T")[0] + "T00:00:00",
    hour: (timeStr) => timeStr.split(":")[0] + ":00:00"
}

function useDashboard(producerId, consumerId) {

    // transformed data for charts ares stored here after transformation
    const [transformedData, setTransformedData] = useState({})
    // part of the url, that defines start_date and end_date
    const [url, setUrl] = useState("")
    const {apiRequest} = useApi()

    /**
     * output data from current url is stored in data,
     * refetches each time url changes
     */
    const {data, loading, error, setLoading, cancel, setData: setQueryData} = useQuery({
        method: "GET",
        // if producerId or consumerId is set -> add to url
        url: "output/?" + (producerId ? "producer_id=" + producerId + "&" :
            consumerId ? "consumer_id=" + consumerId + "&" : "") + url,
        requestOnLoad: true,
        onResponse: (response) => {
            // if status is 204 -> no content was found, which isnt directly an error, but on the dashboard it should
            // be displayed as an 404 Not found, otherwise loading state would never stop
            if (response.status === 204) {
                throw 404
            }
        }
    })

    /**
     * if timeframe = 30 days -> reduced to sum per day
     * if timeframe = 1 week -> reduce to sum per hour
     */
    const [selectedReduction, setSelectedReduction] = useState("no")
    const handleReductionChange = (e) => {
        const value = e.target.value
        setSelectedReduction(value)
    }

    /**
     * stores selected Value of TimeframeSelect
     * @see TimeframeSelect
     */
    const [selectedTimeframe, setSelectedTimeframe] = useState(2)
    // either choose predefined timeframe from select or open popup and choose custom
    const [openCustomTimeframe, setOpenCustomTimeframe] = useState(false)
    const handleSelectChange = (e) => {
        const value = e.target.value
        if (value !== 3) {
            setSelectedTimeframe(value)
            // Cancel all open requests
            cancel()
        } else {
            setOpenCustomTimeframe(true)
        }
    }

    const handleSubmitCustomTimeframe = (newUrl) => {
        if (newUrl !== url) {
            setSelectedTimeframe(3)
            setUrl(newUrl)
        }
    }

    // functions to set the url params after a different timeframe is selected
    const defaultTimeFrames = {
        0: () => "",
        1: () => "start_date=" + getISODateWithDelta(0) + "&end_date=" + getISODateWithDelta(1),
        2: () => "start_date=" + getMonday()
    }
    const defaultReductions = {
        0: "day",
        1: "no",
        2: "hour"
    }
    /**
     *  if selectedTimeFrame changes -> new URL -> new request
     */
    useEffect(() => {
        if (selectedTimeframe !== 3) {
            setUrl(defaultTimeFrames[selectedTimeframe])
            // if default for selectedTimeframe exist
            if (Object.keys(defaultReductions).includes(String(selectedTimeframe))) {
                setSelectedReduction(defaultReductions[selectedTimeframe])
            }
        } else {
            setSelectedReduction(defaultReductions[2])
        }
        setLoading(true)
    }, [selectedTimeframe])

    const [detailData, setDetailData] = useState(null)
    useEffect(() => {
        getDetails()
    }, [consumerId, producerId])
    /**
     * get details about producer or consumer depending on which id set
     */
    const getDetails = () => {
        let url = false;
        if (consumerId) {
            url = "/consumers/" + consumerId + "/";
        } else if (producerId) {
            url = "/producers/" + producerId + "/";
        }

        if (url) {
            apiRequest({
                method: "GET",
                url: url
            }).then((res) => {
                setDetailData(res.data)
            }).catch(() => setDetailData('error'))
        }
    }

    // is true when data is fetched but not transformed yet
    const [transforming, setTransforming] = useState(false)
    // if transformedData is set
    useEffect(() => {
        // as all data is set at once, it doesnt matter which transformedData value is checked here
        // if data is transformed -> set to false
        if (transformedData.lineChartData) setTransforming(false)
    }, [transformedData])

    // Placed in useEffect hook below where the transformedData is set,setTransforming would run at the same time as
    // setTransformedData, making it useless.
    // Therefore setTranforming is set if loading is true, but has to be set false, if error loading is set false and
    // error occurs, because in that case the useEffect above won't run
    useEffect(() => {
        if (loading) {
            setTransforming(true)
        } else if (error) {
            setTransforming(false)
        }


    }, [loading, error])
    // if data is set -> transform
    useEffect(() => {
        if (data) {
            // in producer-view: show meter_readings for production and consumption meter
            if (producerId && data.productions && data.productions.length > 0) {
                setDetailData((prev) => ({
                    ...prev,
                    gridMeterReading: roundToN(data.productions[data.productions.length - 1].gridMeterReading, 4),
                    productionMeterReading:
                        roundToN(data.productions[data.productions.length - 1].productionMeterReading, 4)
                }))
            }
            // in consumer-view: show consumption meter reading
            else if (consumerId && data.consumptions && data.consumptions.length > 0) {
                setDetailData((prev) => ({
                    ...prev,
                    meterReading: roundToN(data.consumptions[data.consumptions.length - 1].meterReading, 4),
                }))
            }
            setTransformedData((prev) => ({
                ...prev,
                "lineChartData": lineChartData(),
                "totalSavedData": totalSavedData(),
                "totalRevenueData": totalRevenueData(),
                "consumptionData": consumptionData(),
                "savedC02Data": savedCO2(),
                "pieChartData": pieChartData(),
                "powerMixData": powerMixData()
            }))
        }
    }, [data])

    // if new data is fetched, delete old
    useEffect(() => {
        setQueryData(null)
        setTransformedData({})
    }, [url])

    // if you view data of one producer you can select whether consumptions should be plotted aggregated as just one line
    const [aggregateConsumption, setAggregateConsumption] = useState(false)
    // If aggregate changes -> recalculate lineChartData
    useEffect(() => {
        if (!loading) {
            setTransformedData((prev) => ({
                ...prev, 'lineChartData': lineChartData()
            }))
        }
    }, [aggregateConsumption, selectedReduction])
    /**
     * Transforms data from backend /output/ to array that is usable by @nivo's LineChart
     * @returns {*[] || undefined}
     */
    const lineChartData = () => {
        const _transformedData = []
        if (!data) {
            return
        }
        // if data.producers exists -> show multiple production lines, else only one producer with data.productions
        const producers = data.producers ? Object.values(data.producers) : [{'productions': data.productions}]
        if (producers[0]?.productions) { // if no productions exists -> smth worng dont loop
            for (let j = 0; j < producers.length; j++) {
                const producer = producers[j]
                // this object will represent one line in the chart
                const productions = {
                    "id": data.producers ? "Produktion " + Object.keys(data.producers)[j] : "Produktion",
                    'data': []
                }
                let production_sum = 0
                for (let i = 0; i < producer.productions.length; i++) {
                    // map through all productions -> set x = datetime and y = produced
                    const production = producer.productions[i]
                    if (selectedReduction !== "no") {
                        // if (Object.keys(reductions).includes(String(selectedTimeframe))) {
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
                const consumptions = {
                    "id": data.consumers && !(data.consumptions && aggregateConsumption) ?
                        Object.keys(data.consumers)[j] : "Verbrauch", 'data': []
                }
                let consumption_sum = 0
                for (let i = 0; i < consumer.consumptions.length; i++) {
                    // map through all consumptions -> set x = datetime and y = consumption
                    const consumption = consumer.consumptions[i]
                    if (selectedReduction !== "no") {
                        // if (Object.keys(reductions).includes(String(selectedTimeframe))) {
                        // if (selectedTimeframe === 0 || selectedTimeframe === 2) {
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
            if (reductions[selectedReduction](date, nextDate)) {
                push({
                    "x": transformTime[selectedReduction](point.time),
                    "y": sum + Number(point[valueKey])
                })
                // reset sum to 0
                add(-sum)
            } else {
                add(Number(point[valueKey]))
            }

        } else { // if point is last in points -> push
            push({
                "x": transformTime[selectedReduction](point.time),
                "y": sum + Number(point[valueKey])
            })
            add(-sum)
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

    const pieChartData = () => {
        const pieChartData = [];
        if (data.totalProduction) { //Haussicht
            pieChartData.push({"id": "Verbraucht", "label": "Verbraucht", "value": roundToN(data.totalUsed, 2)});
            pieChartData.push({
                "id": "Eingespeist",
                "label": "Eingespeist",
                "value": roundToN(data.totalProduction - data.totalUsed, 2)
            });
        } else if (data.producersTotalProduction) { //Gesamtansicht
            pieChartData.push({
                "id": "Verbraucht",
                "label": "Verbraucht",
                "value": roundToN(data.producersTotalUsed, 2)
            });
            pieChartData.push({
                "id": "Eingespeist",
                "label": "Eingespeist",
                "value": roundToN(data.producersTotalProduction - data.producersTotalUsed, 2)
            });
        } else if (data.totalSelfConsumption) { //Consumersicht
            pieChartData.push({"id": "Netz", "label": "Netzenergie", "value": roundToN(data.totalGridConsumption, 2)});
            pieChartData.push({
                "id": "Solar",
                "label": "Solarenergie",
                "value": roundToN(data.totalSelfConsumption, 2)
            });
        }
        return pieChartData;
    }

    const powerMixData = () => {
        const powerMixData = {};
        if (data.totalProduction || data.totalProduction === 0) { //Haussicht
            powerMixData.top = {
                title: "Produktion: ",
                value: roundToN(data.totalProduction, 2)
            };
            powerMixData.bottom = {
                title: "Davon genutzt: ",
                value: roundToN(data.totalUsed, 2)
            };
        } else if (data.producersTotalProduction || data.producersTotalProduction === 0) { //Gesamtansicht
            powerMixData.top = {
                title: "Produktion: ",
                value: roundToN(data.producersTotalProduction, 2)
            };
            powerMixData.bottom = {
                title: "Davon genutzt: ",
                value: roundToN(data.producersTotalUsed, 2)
            };
        } else if (data.totalSelfConsumption || data.totalSelfConsumption === 0) { //Consumersicht
            powerMixData.top = {
                title: "Solarstromverbrauch: ",
                value: roundToN(data.totalSelfConsumption, 2)
            };
            powerMixData.bottom = {
                title: "Zusätzlicher Verbrauch: ",
                value: roundToN(data.totalGridConsumption, 2)
            };
        }
        return powerMixData;
    }

    return {
        transformedData,
        selectedTimeframe,
        handleSelectChange,
        loading: (loading || transforming),
        data,
        aggregateConsumption,
        setAggregateConsumption,
        TimeframeSelect,
        openCustomTimeframe,
        setOpenCustomTimeframe,
        handleSubmitCustomTimeframe,
        handleReductionChange,
        selectedReduction,
        detailData
    }
}


export default useDashboard;