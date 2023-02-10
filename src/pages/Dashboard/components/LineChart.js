import {ResponsiveLine, ResponsiveLineCanvas} from '@nivo/line'
import {Paper} from "@mui/material";
import {diffInHours, formatDateTime, roundToN} from "../../../helpers";
import {useEffect, useState} from "react";
const LineTooltip = (props) => {
    const {x, yFormatted: y} = props.point.data
    const {color} = props.point
    return(
        <Paper className={"flex p-4 justify-between items-center gap-4"}>
            <div className={"w-4 h-4 rounded-full"} style={{backgroundColor: color}}/>
            {formatDateTime(x, false) + " - " + y+" kWh"}
        </Paper>
    )
}
/**
 * For smaller datasets a svg linechart can be used which is interactiv. For larger datasets a canvas is rendered
 * @param lineProps
 * @returns {JSX.Element}
 */
const Line = (props) => {
    return(
        props.selectedReduction !== false? <ResponsiveLine {...props}/> : <ResponsiveLineCanvas {...props} />
    )}

const tickValues = {
    no: "every 2 hours",
    day: "every 2 days",
    hour: "every 12 hours",
}
const tickFormats = {
    no: "%H",
    day: "%d.%m",
    hour: "%d.%m %H:%M",
}

function LineChart({selectedReduction, data}) {
    const [tickValue, setTickValue] = useState("every 2 days")
    const [tickFormat, setTickFormat] = useState("%d.%m")

    /**
     * Find the right value and format for given timespan.
     * If timespan is greater than one week,
     * than ticks are calculated so that about 15 ticks are visible on the chart
     */
    const calculateTick = () => {
        const firstDate = new Date(data[0].data[0].x)
        const lastDate = new Date(data[0].data[data[0].data.length - 1].x)
        const diff = diffInHours(lastDate, firstDate)
        if(diff <= 24){
            setTickValue("every 2 hours")
            setTickFormat("%H")
        }else if(diff <= 24*7){
            setTickValue("every 12 hours")
            setTickFormat("%d.%m %H:%M")
        }else{
            setTickFormat("%d.%m")
            const intervall = roundToN((diff/24)/15, 0)
            setTickValue("every "+intervall+" days")
        }
    }

    useEffect(() => {
        // each time, data changes -> run calculateTick
        calculateTick()
    }, [data])

    return (
        <Line
            selectedTimeframe={selectedReduction}
            tooltip={LineTooltip}
            data={data}
            margin={{top: 50, right: 110, bottom: 50, left: 60}}
            xScale={{ type: 'time', format: "%Y-%m-%dT%H:%M:%S", precision: "minute", useUTC: false}}
            enablePoints={false}
            // xFormat={"time:%Y-%m-%dT%H:%M:%S"}
            curve={"monotoneX"}
            yScale={{ type: 'linear', min:0}}
            yFormat=" >-.2f"
            axisBottom={{
                tickValues: tickValue? tickValue : "every 2 days",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: tickFormat? tickFormat : "%d.%m",
                legendOffset: 36,
                legendPosition: "middle"
            }}
            useMesh={true}
            isInteractive={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />)
}

export default LineChart;