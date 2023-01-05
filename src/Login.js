import React, {useState} from 'react';
import {Button, TextField} from "@mui/material";
import useForm from "./hooks/useForm";
import useApi from "./hooks/useApi";
import WidgetComponent from "./components/WidgetComponent/WidgetComponent";
import StyledButton from "./components/StyledButton";
import useAuthStore from "./stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import useNotificationStore from "./stores/useNotificationStore";

function Login(props) {

    const {values, handleChange} = useForm({
        username: "",
        password: ""
    })
    const setAuthStore = useAuthStore(state => state.setState)
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    const handleLogin = () => {
        apiRequest({
            method: 'post', url: '/login/', requestData: values, noAuthorization:true, throwError:true
        })
            .then(res => {
                setAuthStore('token', res.data.token)
                navigate('/solaranlagen')
                setNotification({message:"Angemeldet", severity:"success"})
            }, error => {
                console.log(error.response.status)
                if(error.response.status === 400){
                    setNotification({message: "Anmeldung fehlgeschlagen", severity:"error"})
                }else {
                    setNotification({message:error.message || "Ein Fehler ist aufgetreten", severity:"error"})
                }
            })
    }

    const {apiRequest} = useApi()

    return (
        <div className={"w-screen h-screen flex justify-center items-center"}
             style={{backgroundImage: 'url(/bg-img.jpg)', backgroundSize: 'cover'}}>
            <WidgetComponent className={"flex flex-col items-center gap-4 max-w-[300px]"}>
                <h2 className={"font-bold text-lg"}>
                    Anmelden
                </h2>
                <TextField value={values.username} onChange={handleChange} name={"username"} label={"Benutzername"}/>
                <TextField value={values.password} onChange={handleChange} name={"password"} label={"Password"}
                type={"password"}/>
                <StyledButton onClick={handleLogin}>
                    Anmelden
                </StyledButton>
            </WidgetComponent>
        </div>
    );
}

export default Login;