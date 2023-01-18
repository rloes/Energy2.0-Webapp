import React from 'react';
import axios from "axios";
import snakeize from "snakeize";
import camelize from "camelize";
import useAuthStore from "../stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import useNotificationStore from "../stores/useNotificationStore";

function useApi(props) {
    // Authorization Toke received and stored on login
    const token = localStorage.getItem('token');
    const setAuthStore = useAuthStore(state => state.setState)
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)

    async function apiRequest({
                                  method,
                                  url,
                                  requestData,
                                  formatData,
                                  noAuthorization,
                                  throwError = false,
                                  signal = undefined
                              }) {
        try {
            // if a function is passed via the formatData param, this function is called first
            if (formatData) {
                formatData(requestData)
            }
            // api request
            const response = await axios({
                method: method,
                baseURL: "http://127.0.0.1:8000/",
                url: url,
                headers: {
                    // only add token if one exist and noAuthorization is not set to true
                    ...(token && !noAuthorization) && {"Authorization": "Token " + token}
                },
                data: snakeize(requestData), //api uses snake_case
                signal: signal
            })
            response.data = camelize(response.data) //api sends snake_case but camelCase needed
            return response
        } catch (error) {
            // error handling that is the same on every request is handled here
            let errorHandled = false
            console.log(error)
            const status = error.response?.status || error.message
            console.log(status)
            // no authorization, no permission errors are handled
            if (status === 401 || status === 403) {
                // delete token
                setAuthStore('token', '')
                // send back to login
                navigate("/login")
                setNotification({
                    message: status === 401 ? "Sie müssen angemeldet sein" : "Sie haben keine Berechtigung dafür",
                    severity: "error"
                })
                errorHandled = true
            }
            // if additional error handling is needed the error is passed on when throwError is true and error was not handled yet.
            if (throwError && !errorHandled) {
                throw error
            } else {
                // if not and error was not handled yet, a general error notification is sent
                if (!errorHandled && status !== "canceled") {
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