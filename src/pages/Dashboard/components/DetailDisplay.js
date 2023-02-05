import React from 'react';
import { Box } from '@mui/system';
import { Typography, colors } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Item from './Item';
import { formatDateTime } from '../../../helpers';



const producerTitels = {name: "Bezeichnung", 
                        street: "Adresse", 
                        peakPower: "Installierte Leistung", 
                        lastProductionReading: "Letzte Daten"}
const consumerTitels = {name: "Name", 
                        email: "Email", 
                        phone: "Telefonnummer", 
                        lastReading: "Letzte Daten"}



function DetailDisplay({detailData, producerId, consumerId}) {

    const titels =  consumerId? consumerTitels : producerId? producerTitels : false


    return (

        titels?

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
                        
                        {Object.keys(titels).map((titelKey)=>{
                            if (titelKey === "street"){
                                return (
                                    <Grid xs={4}>
                                    <Item><b>Adresse </b>< br/>
                                        {detailData.street} <br/> {detailData.zipCode}&nbsp;{detailData.city}
                                    </Item>
                                </Grid>
                                )
                            }
                            if (titelKey === "peakPower"){
                                return (
                                    <Grid xs={4}>
                                    <Item><b>Installierte Leistung </b> < br/> {detailData.peakPower} kWh
                                    </Item>
                                </Grid>
                                )
                            }
                            if (titelKey === "lastProductionReading"){
                                return (
                                    <Grid xs={4}>
                                    <Item><b>Letzte Daten </b> < br/> {formatDateTime(detailData.lastProductionReading)}
                                    </Item>
                                </Grid>
                                )
                            }
                            return (
                            <Grid xs={4}>
                            <Item><b>{titels[titelKey]} </b>< br/>
                                {detailData[titelKey]}
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
        <div>
        Nichts Ausgewählt
        </div>
    

    )

}

export default DetailDisplay;