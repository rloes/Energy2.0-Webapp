import React from 'react';
import {useParams} from "react-router-dom";
import Dashboard_mfh from "./Dashboard_mfh";

function DashboardWrapper(props) {
    const {producerId, consumerId} = useParams()

    return (
        <Dashboard_mfh producerId={producerId} consumerId={consumerId} />
    );
}

export default DashboardWrapper;