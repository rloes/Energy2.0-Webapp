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
        requestOnLoad = false, // set true, if request should be performed immediately on render
        formatData,
        throwError = false,
        onResponse // if set: function is called right after response comes. response object is passed to function
    } = options
    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const controllerRef = new AbortController();
    const requestURL = useRef(url)
    const {apiRequest} = useApi()

    /**
     * performs the query to set url
     */
    const request = async () => {
        setLoading(true)
        try {
            const response = await apiRequest({
                ...options, signal: controllerRef.signal
            })
            if (onResponse) onResponse(response)
            // latest url is stored in requestUrl.current -> data is only set if it comes from latest request
            if (BASE_URL + requestURL.current === response.request.responseURL) {
                setData(response.data)
            }
            return response
        } catch (error) {
            setError(error)
        }
    }

    /**
     * Cancels the API request
     */
    const cancel = () => {
        controllerRef.abort();
    };

    // perform request when url changes and requestOnLoad is set.
    useEffect(() => {
        requestURL.current = url
        if (requestOnLoad) {
            request()
        } else {
            setLoading(false)
        }
    }, [url])

    // cancel Loading state if either data is received or error was raised
    useEffect(() => {
        if (data || error) {
            setLoading(false)
        }
    }, [data, error])

    return {data, error, loading, request, setLoading, cancel, setData}
}

export default useQuery;