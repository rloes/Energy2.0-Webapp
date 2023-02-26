import React from 'react';
import {Box} from '@mui/system';
import {Typography, colors} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Item from './Item';
import {formatDateTime} from '../../../helpers';
import {SolarPower} from "@mui/icons-material";


const producerTitels = {
    name: "Bezeichnung",
    street: "Adresse",
    peakPower: "Installierte Leistung",
    lastProductionReading: "Letzte Daten",
    productionMeterReading: "Produktionszählerstand",
    gridMeterReading: "Einspeisezählerstand"
}
const consumerTitels = {
    name: "Name",
    email: "Email",
    phone: "Telefonnummer",
    lastReading: "Letzte Daten",
    meterReading: "Zählerstand"
}


function DetailDisplay({data, producerId, consumerId}) {

    const titels = consumerId ? consumerTitels : producerId ? producerTitels : false
    return (

        titels ?

            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                mt="25px"
            >
                <Typography
                    variant="h5"
                    sx={{mt: "15px"}}
                >
                    <Box sx={{flexGrow: 1}}>
                        <Grid container spacing={2} justify="flex-start">

                            {Object.keys(titels).map((titelKey) => {
                                if (titelKey === "street") {
                                    return (
                                        <Grid xs={4}>
                                            <Item><b>Adresse </b>< br/>
                                                {data.street} <br/> {data.zipCode}&nbsp;{data.city}
                                            </Item>
                                        </Grid>
                                    )
                                }
                                if (titelKey === "peakPower" || titelKey.toLowerCase().includes("meterreading")) {
                                    return (
                                        <Grid xs={4}>
                                            <Item><b>{titels[titelKey]} </b>
                                                < br/> {data[titelKey] + (titelKey === "peakPower" ? " kWp" : " kWh")}
                                            </Item>
                                        </Grid>
                                    )
                                }
                                if (titelKey === "lastProductionReading") {
                                    return (
                                        <Grid xs={4}>
                                            <Item><b>Letzte Daten </b>
                                                < br/> {formatDateTime(data.lastProductionReading)}
                                            </Item>
                                        </Grid>
                                    )
                                }
                                return (
                                    <Grid xs={4}>
                                        <Item><b>{titels[titelKey]} </b>< br/>
                                            {data[titelKey]}
                                        </Item>
                                    </Grid>
                                )
                            })
                            }


                        </Grid>
                    </Box>
                </Typography>
            </Box>

            :
            <div className={"flex flex-col justify-center items-center text-gray-400 text-xl max-w-[50%] text-center"}>
                <SolarPower className={"text-[5rem]"}/>
                <h5>Bitte wählen Sie eine Anlage oder einen Kunden aus, um Informationen anzuzeigen</h5>
            </div>


    )

}

export default DetailDisplay;