import './App.css';
import Login from "./Login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import AddProducer from "./pages/admin/AddProducer/AddProducer";
import ListProducers from "./pages/admin/ListProducers/ListProducers";
import AddRate from './pages/admin/AddRate/AddRate';
import {Alert, Backdrop, CircularProgress, Snackbar} from "@mui/material";
import NotificationBar from "./components/NotificationBar";
import AddConsumer from "./pages/admin/AddConsumer/AddConsumer";
import Dashboard from "./pages/Dashboard/Dashboard";
import ListRates from "./pages/admin/ListRates/ListRates";
import Dashboard_mfh from "./pages/Dashboard/Dashboard_mfh"
import ListConsumers from "./pages/admin/ListConsumers/ListConsumers";
import DashboardWrapper from "./pages/Dashboard/DashboardWrapper";
import {useEffect, useState} from "react";
import useAuthStore from "./stores/useAuthStore";
import Imprint from "./pages/admin/Imprint/Imprint";
import Contact from "./pages/admin/Contact/Contact";

function App() {
    const setAuthStore = useAuthStore(state => state.setState)
    const token = useAuthStore(state => state.token)
    const consumerId = useAuthStore(state => state.consumerId)
    const [loading, setLoading] = useState(true)
    /**
     * on initial render check whether authentication info is stored in localStorage
     * if yes put it in to global store
     */
    useEffect(() => {
        setLoading(true) // so that Route is only rendered after this check is done
        const token = localStorage.getItem('token');
        if (token) setAuthStore('token', token)
        const username = localStorage.getItem('username');
        if (username) setAuthStore('username', username)
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin) setAuthStore('isAdmin', isAdmin)
        const consumerId = localStorage.getItem('consumerID');
        if(consumerId) {
            setAuthStore('consumerId', consumerId)
        }else{
            setAuthStore('consumerId', "")
        }
        if(!token) setLoading(false) // check is done but useEffect below won't work

    }, [])

    /**
     * Routes cannot be rendered before check is done or authenticated non-admins will be logged out on refresh
     * thats why loading is only set true if both token and consumerId was set
     */
    useEffect(() => {
        if (token && (consumerId || consumerId === "")) setLoading(false)
    }, [token, consumerId])
    return (!loading ?
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route index element={<DashboardWrapper/>}/>
                        <Route path={"dashboard"} element={<Dashboard/>}/>
                        <Route path={"solaranlagen"}>
                            <Route index element={<ListProducers/>}/>
                            <Route path={"erstellen"} element={<AddProducer/>}/>
                            <Route path={":producerId/bearbeiten"} element={<AddProducer/>}/>
                            <Route path={":producerId"} element={<DashboardWrapper/>}/>
                        </Route>
                        <Route path={"kunden"}>
                            <Route index element={<ListConsumers/>}/>
                            <Route path={"erstellen"} element={<AddConsumer/>}/>
                            <Route path={":consumerId/bearbeiten"} element={<AddConsumer/>}/>
                            <Route path={":consumerId"} element={<DashboardWrapper/>}/>
                        </Route>
                        <Route path={"tarife"}>
                            <Route index element={<ListRates/>}/>
                            <Route path={"erstellen"} element={<AddRate/>}/>
                            <Route path={":rateId/bearbeiten"} element={<AddRate/>}/>
                        </Route>
                        <Route path={"impressum"} element={<Imprint/>} />
                        <Route path={"kontakt"} element={<Contact/>} />
                    </Route>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
                <NotificationBar/>
            </BrowserRouter>
            :
            <Backdrop open={true}>
                <CircularProgress/>
            </Backdrop>
    );
}

export default App;
