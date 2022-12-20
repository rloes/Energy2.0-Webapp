import React from 'react';
import axios from "axios";
import snakeize from "snakeize";
import camelize from "camelize";

function useApi(props) {
    async function apiRequest({method, url, requestData, formatData}){
        try {
            if(formatData){
                formatData(requestData)
            }
            const response = await axios({
                method: method,
                baseURL: "http://127.0.0.1:8000/",
                url: url,
                headers: {
                    "Authorization": "Token d53453f8bf804d4ac7a955c3de800f824cc47b73"
                },
                data: snakeize(requestData) //api uses snake_case
            })
            response.data = camelize(response.data) //api sends snake_case but camelCase needed
            return response
        } catch (error) {
            throw error
        }
    }

    return {apiRequest};
}

export default useApi;