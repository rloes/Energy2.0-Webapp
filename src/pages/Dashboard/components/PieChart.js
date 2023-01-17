import React from 'react';
import {Pie, ResponsivePie} from '@nivo/pie'

function PieChart(props) {
    const {data} = props
    console.log("hallo", data)
    return (
        <div className={"max-h-[500px] h-full h-[200px] relative max-w-[500px] w-full w-[500px]"}>
            <ResponsivePie         data={data}
                                   startAngle={-90}
                                   endAngle={90}
                                   margin={{ top: 0, right: 80, bottom: 0, left: 80 }}
                                   innerRadius={0.5}
                                   // padAngle={0.7}
                                   // cornerRadius={3}
                                   // activeOuterRadiusOffset={8}
                                   // borderWidth={1}
                                   // borderColor={{
                                   //     from: 'color',
                                   //     modifiers: [
                                   //         [
                                   //             'darker',
                                   //             0.2
                                   //         ]
                                   //     ]
                                   // }}
                                   // arcLinkLabelsSkipAngle={10}
                                   // arcLinkLabelsTextColor="#333333"
                                   // arcLinkLabelsThickness={2}
                                   // arcLinkLabelsColor={{ from: 'color' }}
                                   // arcLabelsSkipAngle={10}
                                   // arcLabelsTextColor={{
                                   //     from: 'color',
                                   //     modifiers: [
                                   //         [
                                   //             'darker',
                                   //             2
                                   //         ]
                                   //     ]
                                   // }}
                                   // defs={[
                                   //     {
                                   //         id: 'dots',
                                   //         type: 'patternDots',
                                   //         background: 'inherit',
                                   //         color: 'rgba(255, 255, 255, 0.3)',
                                   //         size: 4,
                                   //         padding: 1,
                                   //         stagger: true
                                   //     },
                                   //     {
                                   //         id: 'lines',
                                   //         type: 'patternLines',
                                   //         background: 'inherit',
                                   //         color: 'rgba(255, 255, 255, 0.3)',
                                   //         rotation: -45,
                                   //         lineWidth: 6,
                                   //         spacing: 10
                                   //     }
                                   // ]}
                                   // legends={[]}
            />
        </div>);
}

export default PieChart;