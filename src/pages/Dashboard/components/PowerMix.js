import {ResponsivePie} from '@nivo/pie'
import {roundToN} from '../../../helpers';

/**Function to display value in middle of pie chart */
const CenteredMetric = ({dataWithArc, centerX, centerY}) => {
    const powerValues = [];
    dataWithArc.forEach(datum => {
        powerValues.push(datum.value)
    })
    let percentage = 0
    if (dataWithArc[0].id !== "Netz") {
        percentage = roundToN(powerValues[0] / (powerValues[0] + powerValues[1]) * 100, 2);
    } else {
        percentage = roundToN(powerValues[1] / (powerValues[0] + powerValues[1]) * 100, 2);
    }

    return (
        <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="top"
            style={{
                fontSize: '12px',
                fontWeight: 600,
            }}
        >
            {percentage + "%"}
        </text>
    )
}


function PowerMix(props) {
    return (
        <ResponsivePie
            data={props.data}
            margin={{top: 12, right: 0, bottom: 0, left: 0}}
            startAngle={90}
            endAngle={-90}
            innerRadius={0.5}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        '0.2'
                    ]
                ]
            }}
            fit={true}
            enableArcLinkLabels={false}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{from: 'color'}}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: -70,
                    translateY: 0,
                    itemWidth: 20,
                    itemHeight: 20,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
            layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
        />
    )
}

export default PowerMix;