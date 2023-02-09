import React from 'react';
import {
    Box, Button, Checkbox, Dialog,
    FormControl, FormControlLabel, FormGroup, IconButton,
    InputLabel, MenuItem,
    Select,
    Typography,
    useTheme
} from "@mui/material"
import Header from "./components/Header"
import {tokens} from "../../theme";
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
import Grid from '@mui/material/Unstable_Grid2';
import Item from './components/Item'
import {formatDateTime} from "../../helpers";
import useAuthStore from "../../stores/useAuthStore";
import EditTimeframe from "./components/EditTimeframe";

/**
 *
 * @param producerId -> können später genutzt werden um ANsicht zu unterscheiden
 * @param cosumerId
 * @returns {JSX.Element}
 * @constructor
 */
const Dashboard_mfh = ({producerId, consumerId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
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
                                 value={transformedData.consumptionData + " kWh"} loading={loading}/>
                </div>
                <div className={"col-span-3"}>
                    <DataDisplay value={transformedData.totalSavedData + " €"} titel={"Einsparungen"}
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
                <div className={"col-span-8 row-span-2"}>
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

                <div className={"col-span-4 row-span-2 relative"}>
                    {producerId ?
                        <ListConsumers producerId={producerId} withoutTitle/>
                        :
                        !consumerId &&
                        <ListProducers withoutTitle/>
                    }
                </div>
                {/* ROW 3 */}
                {/*ANLAGEDETAILS*/}
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    p="30px"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                >
                    <Typography variant="h5" fontWeight="600">
                        Anlagedetails
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        mt="25px"
                    >
                        <Typography
                            variant="h5"
                            color={colors.greenAccent[500]}
                            sx={{mt: "15px"}}
                        >
                            <Box sx={{flexGrow: 1}}>
                                <Grid container spacing={2} justify="flex-start">
                                    <Grid xs={4}>
                                        <Item><b>Bezeichnung </b>< br/>
                                            {transformedData.producerData && transformedData.producerData.name}
                                        </Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Adresse </b>< br/>
                                            {transformedData.producerData && transformedData.producerData.street} <br/>
                                            {transformedData.producerData && transformedData.producerData.zipCode} &nbsp;
                                            {transformedData.producerData && transformedData.producerData.city}
                                        </Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Installierte
                                            Leistung </b>< br/> {transformedData.producerData && transformedData.producerData.peakPower} kWh</Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Produktionszählernummer </b>< br/> {transformedData.producerData && transformedData.producerData.productionSensor.deviceId}
                                        </Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Netzzähler </b>< br/> {transformedData.producerData && transformedData.producerData.gridSensor.deviceId}
                                        </Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Letzte Daten
                                            von </b>< br/> {transformedData.producerData && formatDateTime(transformedData.producerData.lastProductionReading)}
                                        </Item>
                                    </Grid>


                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Box>

                {/*WIRTSCHAFTLICHE KPIS*/}
                <div className={"col-span-4 row-span-2"}>
                    <DataDisplay value={transformedData.totalRevenueData?.toFixed(2) + " €"}
                                 titel={isAdmin ? "Einnahmen" : "Kosten"}
                                 loading={loading} icon={<Euro/>}/>
                </div>
            </Box>
        </Box>
    );
};

export default Dashboard_mfh;