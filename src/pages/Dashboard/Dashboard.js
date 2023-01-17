import React, {useEffect} from 'react';
import useQuery from "../../hooks/useQuery";
import PieChart from "./components/PieChart";
import WidgetComponent from "../../components/WidgetComponent/WidgetComponent";

function roundToN(num, n){
    return Math.round((num + Number.EPSILON) * Math.pow(10,n)) / Math.pow(10,n)
}

function Dashboard(props) {
    const {data, loading, error} = useQuery({method: "GET", url: "/output/?producer_id=12", requestOnLoad: true})
    useEffect(() => {
        console.log(data)
    }, [data])
    return (data ?
            <WidgetComponent className={""}>
                <PieChart
                    data={[{id: "Eingespeist", label: "Produziert", value: roundToN(data.totalProduction - data.totalUsed, 3)}, {
                        id: "totalUsed",
                        label: "Davon Verbraucht",
                        value: roundToN(data.totalUsed, 3)
                    }]}/>
            </WidgetComponent>
            :
            <div>loading</div>
    );
}

export default Dashboard;