import React from 'react';
import axios from "axios";
import snakeize from "snakeize";
import camelize from "camelize";
import useAuthStore from "../stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import useNotificationStore from "../stores/useNotificationStore";

export const BASE_URL = "http://127.0.0.1:8000/"

function useApi() {
    // Authorization Toke received and stored on login
    const token = useAuthStore(state => state.token)
    const navigate = useNavigate()
    const setNotification = useNotificationStore(state => state.setNotification)
    const logout = useAuthStore(state => state.logout)

    /**
     * Sends HTTP-Request to BASIS-URL(set in useApi) + given url.
     * @param method - HTTP Method (GET, POST, DELETE, ...)
     * @param url - should contain only the route/path. Base-Url/Domain is set in useApi
     * @param requestData - data that should added to request
     * @param formatData - function that is called before sending request - can be used to transform/format data
     * @param noAuthorization - set true if no Authorization Header should be set (e.g for login)
     * @param throwError - set true if errors that are not 401 or 403 should be thrown and not handled with a
     * general error notice. Throw if more specific error handleing is required
     * @param signal - AbortController().signal can be set here, e.g to cancel request
     * @see useQuery()
     */
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
            let data = requestData
            // if a function is passed via the formatData param, this function is called first
            if (formatData) {
                data = formatData(requestData, method)
            }
            // api request
            const response = await axios({
                method: method,
                baseURL: BASE_URL,
                url: url,
                headers: {
                    // only add token if one exist and noAuthorization is not set to true
                    ...(token && !noAuthorization) && {"Authorization": "Token " + token}
                },
                data: snakeize(data), //api uses snake_case
                signal: signal
            })
            response.data = camelize(response.data) //api sends snake_case but camelCase needed
            return response
        } catch (error) {
            // error handling that is the same on every request is handled here
            let errorHandled = false
            const status = error.response?.status || error.message
            // no authorization, no permission errors are handled
            if (status === 401 || status === 403) {
                // delete token
                logout()
                // send back to login
                navigate("/login")
                setNotification({
                    message: status === 401 ? "Sie m??ssen angemeldet sein" : "Sie haben keine Berechtigung daf??r",
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