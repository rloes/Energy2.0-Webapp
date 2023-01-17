import React from 'react';
import {Box, Button, IconButton, Typography, useTheme} from "@mui/material"
import StatBox from '../../../components/Dashboard_mfh/StatBox'
import LineChart from '../../../components/Dashboard_mfh/LineChart';
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import {ThemeProvider, createTheme } from '@mui/system';
import Header from "../../../components/Dashboard_mfh/Header"
import { tokens } from "../../../theme";
import ElevatedBox from "../../../components/Dashboard_mfh/ElevatedBox"
//ICONS
import BoltSharpIcon from '@mui/icons-material/BoltSharp';
import EuroSymbolSharpIcon from '@mui/icons-material/EuroSymbolSharp';
import ElectricalServicesSharpIcon from '@mui/icons-material/ElectricalServicesSharp';

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

const Dashboard_mfh = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);

  return (
    <Box m="0px">
      {/* HEADER */}

      {/*UEBERSCHIFT*/}
      <Box  display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            sx = {{
                fontSize: "30px",
                fontWeight: "bold",
                padding: "5px"
            }}>
        
        <Header title = "Anbietersicht -  Mehrfamilienhaus"/>
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
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
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
            title="Einsparung Monat"
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
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
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
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
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
            </Typography>
          </Box>
           Hier ueber die Wohneinheiten mappen
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
            alignItems="center"
            mt="25px"
          >
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
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
            sx={{ marginBottom: "15px" }}
          >
            Wirtschaftliche KPIS
            <p>Tagesumsatz</p>
            <p>Monatsumsatz</p>
            <p>Jahresumsatz</p> 
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