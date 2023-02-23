import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import Dashboard from "./Dashboard";
import useAuthStore from "../../stores/useAuthStore";

function DashboardWrapper(props) {
    const {producerId, consumerId: consumerIdParam} = useParams()
    const consumerIdLogin = useAuthStore(state => state.consumerId)
    const consumerId = consumerIdLogin? consumerIdLogin : consumerIdParam

    return (
        <Dashboard producerId={producerId} consumerId={consumerId} />
    );
}

export default DashboardWrapper;