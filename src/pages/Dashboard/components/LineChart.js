// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
    
const MyResponsiveLine = (da) => (
    <ResponsiveLine
        data={[
          // DUMMY DATA
          {
            "id": "japan",
            "color": "hsl(320, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 299
              },
              {
                "x": "helicopter",
                "y": 225
              },
              {
                "x": "boat",
                "y": 27
              },
              {
                "x": "train",
                "y": 61
              },
              {
                "x": "subway",
                "y": 124
              },
              {
                "x": "bus",
                "y": 179
              },
              {
                "x": "car",
                "y": 156
              },
              {
                "x": "moto",
                "y": 200
              },
              {
                "x": "bicycle",
                "y": 178
              },
              {
                "x": "horse",
                "y": 59
              },
              {
                "x": "skateboard",
                "y": 138
              },
              {
                "x": "others",
                "y": 224
              }
            ]
          },
          {
            "id": "france",
            "color": "hsl(201, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 172
              },
              {
                "x": "helicopter",
                "y": 233
              },
              {
                "x": "boat",
                "y": 269
              },
              {
                "x": "train",
                "y": 58
              },
              {
                "x": "subway",
                "y": 146
              },
              {
                "x": "bus",
                "y": 295
              },
              {
                "x": "car",
                "y": 93
              },
              {
                "x": "moto",
                "y": 67
              },
              {
                "x": "bicycle",
                "y": 277
              },
              {
                "x": "horse",
                "y": 96
              },
              {
                "x": "skateboard",
                "y": 60
              },
              {
                "x": "others",
                "y": 72
              }
            ]
          }     
        ]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
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
    />
)

export default MyResponsiveLine;