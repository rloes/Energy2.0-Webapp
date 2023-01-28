import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import useApi, {BASE_URL} from "./useApi";


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
    const requestURL = useRef(url)
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
            console.log(response.request.responseURL, BASE_URL+requestURL.current, BASE_URL+requestURL.current === response.request.responseURL)
            if (BASE_URL+requestURL.current === response.request.responseURL) {
                setData(response.data)
            }
            return response
        } catch (error) {
            console.log(error)
            setError(error)
        }
    }

    useEffect(() => {
        requestURL.current = url
        let subscribe = true
        if (requestOnLoad) {
            if (subscribe) request()
        } else {
            setLoading(false)
        }
        return () => {
            subscribe = false
        }
    }, [url])

    useEffect(() => {
        if (data || error) {
            setLoading(false)
        }
    }, [data, error])

    return {data, error, loading, request, setLoading, cancel}
}

export default useQuery;