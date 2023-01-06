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
    const controllerRef = useRef(new AbortController());
    const {apiRequest} = useApi()


    /**
     * Cancels the API request
     */
    const cancel = () => {
        controllerRef.current.abort();
    };

    const request = async () => {
        setLoading(true)
        try {
            const response = await apiRequest(options)
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
    }, [])

    useEffect(() => {
        if (data || error) {
            setLoading(false)
            console.log(data, error)
        }
    }, [data, error])

    return {data, error, loading, request}
}

export default useQuery;