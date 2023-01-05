import React from 'react';
import axios from "axios";
import snakeize from "snakeize";
import camelize from "camelize";
import useAuthStore from "../stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import useNotificationStore from "../stores/useNotificationStore";

function useApi(props) {
    const token = useAuthStore((state => state.token))
    const setAuthStore = useAuthStore(state => state.setState)
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    async function apiRequest({method, url, requestData, formatData, noAuthorization, throwError=false}) {
        try {
            if (formatData) {
                formatData(requestData)
            }
            const response = await axios({
                method: method,
                baseURL: "http://127.0.0.1:8000/",
                url: url,
                headers: {
                    ...(token && !noAuthorization) && {"Authorization": "Token " + token}
                },
                data: snakeize(requestData) //api uses snake_case
            })
            response.data = camelize(response.data) //api sends snake_case but camelCase needed
            return response
        } catch (error) {
            let errorHandled = false
            console.log(error)
            const status = error.response?.status || error.message
            console.log(status)
            if (status === 401 || status === 403) {
                setAuthStore('token', '')
                navigate("/login")
                setNotification({
                    message: status === 401 ? "Sie müssen angemeldet sein" : "Sie haben keine Berechtigung dafür",
                    severity: "error"
                })
                errorHandled = true
            }
            if(throwError) {
                throw error
            }else{
                if(!errorHandled) {
                    setNotification({
                        message: error.message,
                        severity: "error"
                    })
                }
            }
        }
    }

    return {apiRequest};
}

export default useApi;