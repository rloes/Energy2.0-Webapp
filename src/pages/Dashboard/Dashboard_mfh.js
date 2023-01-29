import React from 'react';
import {
    Box,
    FormControl,
    InputLabel, MenuItem,
    Select,
    Typography,
    useTheme
} from "@mui/material"
import StatBox from './components/StatBox'
import Header from "./components/Header"
import {tokens} from "../../theme";
import BoltSharpIcon from '@mui/icons-material/BoltSharp';
import ElectricalServicesSharpIcon from '@mui/icons-material/ElectricalServicesSharp';
import useDashboard from "./hooks/useDashboard";
import LineChart from "./components/LineChart";
import PowerMix from "./components/PowerMix";
import ListConsumers from "../admin/ListConsumers/ListConsumers";
import DataDisplay from "./components/DataDisplay";
import ListProducers from "../admin/ListProducers/ListProducers";
import {Euro, Savings, Timeline} from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';
import Item from './components/Item'
import {formatDateTime} from "../../helpers";

const TimeframeSelect = ({selectedTimeframe, handleSelectChange}) => (
    <FormControl className={"w-[175px]"} size={"small"}>
        <InputLabel id="demo-simple-select-label">Zeit</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            value={selectedTimeframe}
            label="Zeit"
            onChange={handleSelectChange}
        >
            <MenuItem value={0}>30 Tage</MenuItem>
            <MenuItem value={1}>Heute</MenuItem>
            <MenuItem value={2}>Aktuelle Woche</MenuItem>
        </Select>
    </FormControl>
)

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
    const {transformedData, selectedTimeframe, handleSelectChange, loading} = useDashboard(producerId, consumerId)

    const exampleData = [
        {
            "id": "Netz",
            "label": "netz",
            "value": 89,
            "color": "hsl(325, 70%, 50%)"
        },
        {
            "id": "PV",
            "label": "pv",
            "value": 25,
            "color": "hsl(290, 70%, 50%)"
        }
    ];

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
                <TimeframeSelect handleSelectChange={handleSelectChange} selectedTimeframe={selectedTimeframe}/>
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
                        <span className={"text-green-600 self-center"}>{transformedData.savedC02Data} kg </span>CO<sub>2</sub>
                        {" "}eingespart
                        </>

                    }/>
                </div>

                {/*STORMMIX MONAT */}
                <Box
                    gridColumn="span 6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                >
                    <StatBox
                        title="Strommix Monat"
                        subtitle="New Clients"
                        increase="+5%"
                        icon={
                            <ElectricalServicesSharpIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                            />
                        }
                    />
                    <Box height="90px" width="250px" m="-20px 0 0 0">
                        <PowerMix data={exampleData} selectedTimeframe={selectedTimeframe}/>
                    </Box>
                </Box>

                {/* ROW 2 */}
                {/*VERBRAUCH UND PRODUKTION */}
                <div className={"col-span-8 row-span-2"}>
                    <DataDisplay titel={"Verlauf"}
                                 value={transformedData.lineChartData}
                                 icon={<Timeline/>}
                                 render={
                                     <LineChart data={transformedData.lineChartData}
                                                selectedTimeframe={selectedTimeframe}/>
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
                    <DataDisplay value={transformedData.totalRevenueData + " €"} titel={"Einnahmen"} loading={loading}
                                 icon={<Euro/>}/>
                </div>
            </Box>
        </Box>
    );
};

export default Dashboard_mfh;