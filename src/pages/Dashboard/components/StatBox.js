import { Box, Typography, useTheme } from '@mui/material'
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent"
import ElevatedBox from './ElevatedBox'

const StatBox = ({ title, subtitle, icon, increase, value }) => {


    return (

        // <ElevatedBox>

        <Box width="100%" m="0 20px" color="green">
            <Box display="flex" align-items="flex-start" color="blue">
                <Box>
                    {icon}
                    <Typography
                        variant="h8"
                        fontWeight="bold"
                    //sx={{ color: colors.grey[100] }}
                    >
                        {title}
                    </Typography>
                </Box>

            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h8"
                //sx={{ color: colors.greenAccent[500] }}
                >
                    {increase}
                </Typography>
                <Typography
                    variant="h5"
                    fontStyle="italic"
                    fontSize="15px"
                //sx={{ color: colors.greenAccent[600] }}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Box>
        // </ElevatedBox>

    )
}

export default StatBox;
