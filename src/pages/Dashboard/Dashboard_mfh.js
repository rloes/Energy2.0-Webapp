import React from 'react';
import {
    Box, Button, Checkbox, Dialog,
    FormControl, FormControlLabel, FormGroup, IconButton,
    InputLabel, MenuItem,
    Select
} from "@mui/material"
import Header from "./components/Header"
import BoltSharpIcon from '@mui/icons-material/BoltSharp';
import BalanceIcon from '@mui/icons-material/Balance';
import useDashboard from "./hooks/useDashboard";
import LineChart from "./components/LineChart";
import PowerMix from "./components/PowerMix";
import PowerMixValues from './components/PowerMixValues';
import ListConsumers from "../admin/ListConsumers/ListConsumers";
import DataDisplay from "./components/DataDisplay";
import ListProducers from "../admin/ListProducers/ListProducers";
import {CalendarMonth, Euro, Savings, Timeline} from "@mui/icons-material";
import useAuthStore from "../../stores/useAuthStore";
import EditTimeframe from "./components/EditTimeframe";
import DetailDisplay from './components/DetailDisplay';

/**
 *
 * @param producerId -> können später genutzt werden um ANsicht zu unterscheiden
 * @param cosumerId -> können später genutzt werden um ANsicht zu unterscheiden
 * @returns {JSX.Element}
 * @constructor
 */
const Dashboard_mfh = ({producerId, consumerId}) => {
    const {
        transformedData,
        selectedTimeframe,
        handleSelectChange,
        loading,
        aggregateConsumption,
        setAggregateConsumption,
        TimeframeSelect,
        data,
        setOpenCustomTimeframe,
        openCustomTimeframe,
        handleSubmitCustomTimeframe,
        handleReductionChange,
        selectedReduction
    } = useDashboard(producerId, consumerId)

    const isAdmin = useAuthStore(state => state.isAdmin)
    return (
        <Box m="0px">
            {/* HEADER */}

            {/*UEBERSCHIFT*/}
            <Box display="flex"
                 justifyContent="space-between"
                 alignItems="center"
                 sx={{
                     fontSize: "30px",
                     fontWeight: "bold",
                     padding: "5px"
                 }}>

                <Header title={"Dashboard" + (producerId ? " - Mehrfamillienhaus " : consumerId ? " - Wohnung" : "")}/>
                <div className={"flex items-center"}>
                    <TimeframeSelect selectedTimeframe={selectedTimeframe} onChange={handleSelectChange}/>
                    <IconButton onClick={() => setOpenCustomTimeframe(true)}>
                        <CalendarMonth/>
                    </IconButton>
                </div>


                <Dialog open={openCustomTimeframe} onClose={() => setOpenCustomTimeframe(false)} keepMounted>
                    <EditTimeframe onSubmit={handleSubmitCustomTimeframe}
                                   onClose={() => setOpenCustomTimeframe(false)}/>
                </Dialog>
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"

            >
                <div className={"col-span-3 h-full"}>
                    <DataDisplay icon={<BoltSharpIcon/>} titel={"Verbrauch"}
                                 value={transformedData.consumptionData} unit={"kWh"} loading={loading}/>
                </div>
                <div className={"col-span-3"}>
                    <DataDisplay value={transformedData.totalSavedData} unit={"€"} titel={"Einsparungen"}
                                 icon={<Savings/>} loading={loading} subtitle={
                        <>
                            <span
                                className={"text-green-600 self-center"}>{transformedData.savedC02Data} kg </span>CO<sub>2</sub>
                            {" "}eingespart
                        </>

                    }/>
                </div>

                {/*STORMMIX MONAT */}
                <div className={"col-span-6 row-span-1"}>
                    <DataDisplay icon={<BalanceIcon/>}
                                 titel={"Strommix"}
                                 value={transformedData.pieChartData}
                                 render={
                                     <>

                                         <PowerMixValues data={transformedData.powerMixData}
                                                         selectedTimeframe={selectedTimeframe}/>
                                         <div className={"min-w-[350px] flex-grow ml-[-15%]"}>
                                             <PowerMix data={transformedData.pieChartData}
                                                       selectedTimeframe={selectedTimeframe}
                                                       centerValue={data?.selfUsagePercentage}/>
                                         </div>
                                     </>
                                 }
                                 loading={loading}/>
                </div>


                {/* ROW 2 */}
                {/*VERBRAUCH UND PRODUKTION */}
                <div className={"col-span-8 row-span-3"}>
                    <DataDisplay titel={"Verlauf"}
                                 value={transformedData.lineChartData}
                                 icon={<Timeline/>}
                                 render={
                                     <>
                                         {(producerId || selectedTimeframe === 3) &&
                                             <div className={"absolute top-0 flex !flex-row"}>
                                                 {producerId &&
                                                     <FormGroup>
                                                         <FormControlLabel control={
                                                             <Checkbox checked={aggregateConsumption}
                                                                       onChange={(e) =>
                                                                           setAggregateConsumption(e.target.checked)}/>
                                                         } label={"Verbräuche summieren"} className={""}
                                                         />
                                                     </FormGroup>}
                                                 {selectedTimeframe === 3 &&
                                                     <FormControl className={"w-[175px]"} size={"small"}>
                                                         <InputLabel id="reduction-select-label">Zeit</InputLabel>
                                                         <Select
                                                             labelId={"reduction-select-label"}
                                                             value={selectedReduction}
                                                             label="Zusammenfassen"
                                                             onChange={handleReductionChange}
                                                         >
                                                             <MenuItem value={"no"}>Genau</MenuItem>
                                                             <MenuItem value={"hour"}>Stündlich</MenuItem>
                                                             <MenuItem value={"day"}>Täglich</MenuItem>
                                                         </Select>
                                                     </FormControl>}
                                             </div>
                                         }
                                         <LineChart data={transformedData.lineChartData}
                                                    selectedReduction={selectedReduction}/>
                                     </>
                                 } loading={loading}/>
                </div>

                <div className={"col-span-4 row-span-3 relative"}>
                    {producerId ?
                        <ListConsumers producerId={producerId} withoutTitle/>
                        :
                        !consumerId &&
                        <ListProducers withoutTitle/>
                    }
                </div>
                {/* ROW 3 */}
                {/*ANLAGEDETAILS*/}

                <div className={"col-span-8 row-span-2"}>
                    <DataDisplay titel={producerId? "Anlagedetails": consumerId? "Kundendetails" : "Details"}
                                 value={(producerId || consumerId) ? transformedData.detailData : !loading}
                                 loading={loading}
                                 icon={<Timeline/>}
                                 render={
                                     < DetailDisplay detailData={transformedData.detailData}
                                                     producerId={producerId}
                                                     consumerId={consumerId}
                                     />
                                 }
                    />
                </div>


                {/*WIRTSCHAFTLICHE KPIS*/}
                <div className={"col-span-4 row-span-2"}>
                    <DataDisplay value={transformedData.totalRevenueData?.toFixed(2)}
                                 unit={"€"}
                                 titel={isAdmin ? "Einnahmen" : "Kosten"}
                                 loading={loading} icon={<Euro/>}/>
                </div>
            </Box>
        </Box>
    );
};

export default Dashboard_mfh;