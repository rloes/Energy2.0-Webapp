import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import Dashboard_mfh from "./Dashboard_mfh";
import useAuthStore from "../../stores/useAuthStore";

function DashboardWrapper(props) {
    const {producerId, consumerId: consumerIdParam} = useParams()
    const consumerIdLogin = useAuthStore(state => state.consumerId)
    const consumerId = consumerIdLogin? consumerIdLogin : consumerIdParam

    return (
        <Dashboard_mfh producerId={producerId} consumerId={consumerId} />
    );
}

export default DashboardWrapper;