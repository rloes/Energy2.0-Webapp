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
import BoltSharpIcon from '@mui/icons-material/BoltSharp';
import EuroSymbolSharpIcon from '@mui/icons-material/EuroSymbolSharp';
import ElectricalServicesSharpIcon from '@mui/icons-material/ElectricalServicesSharp';
import useDashboard from "./hooks/useDashboard";
import LineChart from "./components/LineChart";
import PowerMix from "./components/PowerMix";
import ListConsumers from "../admin/ListConsumers/ListConsumers";
import DataDisplay from "./components/DataDisplay";
import ListProducers from "../admin/ListProducers/ListProducers";
import {Insights, Timeline} from "@mui/icons-material";

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

                <Header title={"Dashboard" + (producerId? " - Mehrfamillienhaus " : consumerId ? " - Wohnung" : "")}/>
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
                                 icon={<EuroSymbolSharpIcon/>} loading={loading}/>
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
                                 icon={<Timeline />}
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
                        alignItems="center"
                        mt="25px"
                    >
                        <Typography
                            variant="h5"
                            color={colors.greenAccent[500]}
                            sx={{mt: "15px"}}
                        >
                            Hier Anlagedetails
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
                        <h1>Gesamte Einnahmen</h1>
                        <div className={"flex h-[250px] mt-[-25px] justify-center items-center w-full"}>
                        {transformedData.totalRevenueData} €
                        </div>
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