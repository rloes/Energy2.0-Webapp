import React, {useEffect, useRef, useState} from 'react';
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
            // latest url is stored in useRef.current -> data is only set if it comes from latest request
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
        if (requestOnLoad) {
            request()
        } else {
            setLoading(false)
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