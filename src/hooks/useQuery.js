import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import useApi from "./useApi";


/**
 * can be used for get request, to generalize refresh requests and deletions from lists (eg. ListProducer, ListConsumer etc)
 */
function useQuery(options) {
    const {
        url,
        method = "GET",
        requestData = {},
        requestOnLoad = false,
        formatData,
    } = options
    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const controllerRef = new AbortController();
    const {apiRequest} = useApi()


    /**
     * Cancels the API request
     */
    const cancel = () => {
        controllerRef.abort();
    };

    const request = async () => {
        setLoading(true)
        try {
            const response = await apiRequest({
                ...options, signal: controllerRef.signal
            })
            setData(response.data)
            return response
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }

    useEffect(() => {
        if (requestOnLoad) {
            request()
        } else {
            setLoading(false)
        }
    }, [url])

    useEffect(() => {
        if (data || error) {
            setLoading(false)
            console.log(data, error)
        }
    }, [data, error])

    return {data, error, loading, request, setLoading, cancel}
}

export default useQuery;