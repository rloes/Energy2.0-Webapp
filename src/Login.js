import React, {useRef, useState} from 'react';
import {Button, TextField} from "@mui/material";
import useForm from "./hooks/useForm";
import useApi from "./hooks/useApi";
import WidgetComponent from "./components/WidgetComponent";
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

    const loginButton = useRef(null)
    function handlePressEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            loginButton.current.click()
        }
    }

    const handleLogin = () => {
        apiRequest({
            method: 'post', url: '/login/', requestData: values, noAuthorization: true, throwError: true
        }).then(res => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', values.username);
                localStorage.setItem('isAdmin', res.data.isAdmin);
                setAuthStore('token', res.data.token)
                setAuthStore('isAdmin', res.data.isAdmin)
                setAuthStore('username', values.username)
                if (!res.data.isAdmin) {
                    setAuthStore('consumerId', res.data.consumerId)
                    localStorage.setItem('consumerID', res.data.consumerId);
                }
                navigate('/')
                setNotification({message: "Angemeldet", severity: "success"})

            }, error => {
                if (error.response.status === 400) {
                    setNotification({message: "Anmeldung fehlgeschlagen", severity: "error"})
                } else {
                    setNotification({message: error.message || "Ein Fehler ist aufgetreten", severity: "error"})
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
                <form onKeyDown={handlePressEnter} className={"flex flex-col items-center gap-4 max-w-[300px] wr"}>
                    <TextField value={values.username} onChange={handleChange} name={"username"}
                               label={"Benutzername"}/>
                    <TextField value={values.password} onChange={handleChange} name={"password"} label={"Passwort"}
                               type={"password"}/>
                    <Button onClick={handleLogin} ref={loginButton}>
                        Anmelden
                    </Button>
                </form>
            </WidgetComponent>
        </div>
    );
}

export default Login;
