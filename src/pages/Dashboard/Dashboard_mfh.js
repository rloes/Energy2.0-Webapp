import React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel, MenuItem,
    Select,
    Typography,
    useTheme
} from "@mui/material"
import StatBox from './components/StatBox'
import WidgetComponent from "../../components/WidgetComponent/WidgetComponent";
import {ThemeProvider, createTheme} from '@mui/system';
import Header from "./components/Header"
import {tokens} from "../../theme";
import ElevatedBox from "./components/ElevatedBox"
import BoltSharpIcon from '@mui/icons-material/BoltSharp';
import EuroSymbolSharpIcon from '@mui/icons-material/EuroSymbolSharp';
import ElectricalServicesSharpIcon from '@mui/icons-material/ElectricalServicesSharp';
import useDashboard from "./hooks/useDashboard";
import LineChart from "./components/LineChart";
import PowerMix from "./components/PowerMix";
import Umsaetze from "./components/Umsaetze"
import ListConsumers from "../admin/ListConsumers/ListConsumers";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

const theme = createTheme({
    palette: {
        background: {
            paper: '#fff',
        },
        text: {
            primary: '#173A5E',
            secondary: '#46505A',
        },
        action: {
            active: '#001E3C',
        },
        success: {
            dark: '#009688',
        },
    },
});

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

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${day}.${month}.${year} - ${hours}:${minutes}:${seconds} Uhr`;
      }

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

                <Header title="Anbietersicht -  Mehrfamilienhaus"/>
                <TimeframeSelect handleSelectChange={handleSelectChange} selectedTimeframe={selectedTimeframe} />
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"

            >
                {/* ROW 1 */}
                {/*VERBRAUCH AKTUELL*/}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
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
                        title="Verbrauch aktuell"
                        subtitle="hoeher als im letzten Monat"
                        increase="5%"
                        icon={
                            <BoltSharpIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                            />
                        }
                    />
                </Box>

                {/*EINSPARUNG MONAT */}
                <Box
                    gridColumn="span 3"
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
                        title={"Einsparung: " + transformedData.totalSavedData}
                        subtitle="hoeher als im Letzten Monat"
                        increase="+10%"
                        icon={
                            <EuroSymbolSharpIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>

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
                        <PowerMix data={exampleData} selectedTimeframe={selectedTimeframe} />
                    </Box>
                </Box>

                {/* ROW 2 */}
                {/*VERBRAUCH UND PRODUKTION */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex "
                        justifyContent="space-between"
                        alignItems="center"

                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.grey[100]}
                            >
                                Verbrauch und Produktion
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                            </Typography>
                        </Box>

                    </Box>
                    <div className={"flex h-[250px] mt-[-25px] justify-center items-center w-full"}>
                        {transformedData.lineChartData && !loading ?
                            <LineChart data={transformedData.lineChartData}
                                       selectedTimeframe={selectedTimeframe}/>
                            :
                            <CircularProgress/>}
                    </div>
                </Box>

                {/*WOHNEINHEITEN */}
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    overflow="auto"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        colors={colors.grey[100]}
                        p="15px"

                    >
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            Wohneinheiten
                        {/*6. Zu guter letzt  muessen wir das ja auch benutzen
                              also wird es hier  mit <Wohneinheiten/> angezeigt*/}
                        <ListConsumers producerId={producerId} withoutTitle/>
                        
                        </Typography>
                    </Box>
                
                </Box>

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
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={2} justify="flex-start">
                                    <Grid xs={4}>
                                        <Item><b>Bezeichnung </b>< br/> 
                                                {transformedData.producerData && transformedData.producerData.name}</Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Adresse </b>< br/> 
                                                {transformedData.producerData && transformedData.producerData.street} <br/>
                                                {transformedData.producerData && transformedData.producerData.zipCode} &nbsp;
                                                {transformedData.producerData && transformedData.producerData.city}
                                                </Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Installierte Leistung </b>< br/> {transformedData.producerData && transformedData.producerData.peakPower} kWh</Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Produktionszählernummer </b>< br/> {transformedData.producerData && transformedData.producerData.productionSensor.deviceId}</Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Netzzähler </b>< br/> {transformedData.producerData && transformedData.producerData.gridSensor.deviceId}</Item>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Item><b>Letzte Daten von </b>< br/> {transformedData.producerData && formatDateTime(transformedData.producerData.lastProductionReading)}</Item>
                                    </Grid>
                                    
                                    
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Box>

                {/*WIRTSCHAFTLICHE KPIS*/}
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    padding="30px"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: 300,
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="600"
                        sx={{marginBottom: "15px"}}
                    >
                        Wirtschaftliche KPIS
                        <p>Tagesumsatz</p>
                        <p>Monatsumsatz</p>
                        <p>Jahresumsatz</p>    
                        <Umsaetze/>    
                    </Typography>
                    <Box height="200px">
                        {/* <GeographyChart isDashboard={true} /> */}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard_mfh;