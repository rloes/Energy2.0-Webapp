import {ResponsiveLine, ResponsiveLineCanvas} from '@nivo/line'

function LineChart(props) {
    const tickValues = {
        0: "every 2 days",
        1: "every 2 hours",
        2: "every 12 hours"
    }
    const tickFormat = {
        0: "%d.%m",
        1: "%H",
        2: "%d.%m %H:%M",
    }

    /**
     * For smaller datasets a svg linechart can be used which is interactiv. For larger datasets a canvas is rendered
     * @param lineProps
     * @returns {JSX.Element}
     */
    const Line = (lineProps) => (
        props.selectedTimeframe !== false? <ResponsiveLine {...lineProps} /> : <ResponsiveLineCanvas {...lineProps} />
    )
    return (
        <Line
            data={props.data}
            margin={{top: 50, right: 110, bottom: 50, left: 60}}
            xScale={{ type: 'time', format: "%Y-%m-%dT%H:%M:%S", precision: "second",}}
            enablePoints={false}
            // xFormat={"time:%Y-%m-%dT%H:%M:%S"}
            curve={"monotoneX"}
            yScale={{ type: 'linear', min:0}}
            yFormat=" >-.2f"
            axisBottom={{
                tickValues: props.selectedTimeframe? tickValues[props.selectedTimeframe] : "every 2 days",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: props.selectedTimeframe? tickFormat[props.selectedTimeframe] : "%d.%m",
                legend: "Time",
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