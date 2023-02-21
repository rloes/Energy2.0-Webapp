import React from "react";
import {
    Button,
    TextField,
    Grid, Card, CardContent, Typography
} from "@mui/material";

function Contact() {

    return (
        <div className="App">
            <Typography gutterBottom variant="h3" align="center">
                Support
            </Typography>
            <Grid>
                <Card style={{maxWidth: 450, padding: "20px 5px", margin: "0 auto"}}>
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            Kontaktformular
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                            Füllen Sie das Formular aus. Die Verarbeitung ihrer Anfrage kann bis zu 24 Stunden
                            beanspruchen.
                        </Typography>
                        <form>
                            <Grid container spacing={1}>
                                <Grid xs={12} sm={6} item>
                                    <TextField placeholder="Vorname" label="Vorname" variant="outlined" fullWidth
                                               required/>
                                </Grid>
                                <Grid xs={12} sm={6} item>
                                    <TextField placeholder="Nachname" label="Nachname" variant="outlined" fullWidth
                                               required/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField type="email" placeholder="Email-Adresse" label="Email" variant="outlined"
                                               fullWidth required/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField type="phone" placeholder="Telefonnummer" label="Telefon"
                                               variant="outlined" fullWidth required/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Nachricht" multiline rows={4} placeholder="Anliegen"
                                               variant="outlined" fullWidth required type={"text"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="Senden" variant="contained" color="primary" fullWidth>Senden</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );

}

export default Contact;