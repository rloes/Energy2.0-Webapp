import './App.css';
import Login from "./Login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import AddProducer from "./pages/admin/AddProducer/AddProducer";
import ListProducers from "./pages/admin/ListProducers/ListProducers";
import AddRate from './pages/admin/AddRate/AddRate';
import {Alert, Snackbar} from "@mui/material";
import NotificationBar from "./components/NotificationBar";
import AddConsumer from "./pages/admin/AddConsumer/AddConsumer";
import Dashboard from "./pages/Dashboard/Dashboard";
import ListRates from "./pages/admin/ListRates/ListRates";
import Dashboard_mfh from "./pages/Dashboard/Dashboard_mfh"
import ListConsumers from "./pages/admin/ListConsumers/ListConsumers";
import DashboardWrapper from "./pages/Dashboard/DashboardWrapper";

function App() {

    return (
        <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<DashboardWrapper  />}/>
                        <Route path={"dashboard"} element={<Dashboard />} />
                        <Route path={"solaranlagen"}>
                            <Route index element={<ListProducers/>} />
                            <Route path={"erstellen"} element={<AddProducer/>}/>
                            <Route path={":producerId/bearbeiten"} element={<AddProducer/>} />
                            <Route path={":producerId"} element={<DashboardWrapper />}/>
                        </Route>
                        <Route path={"kunden"}>
                            <Route index element={<ListConsumers />} />
                            <Route path={"erstellen"} element={<AddConsumer />}/>
                            <Route path={":consumerId/bearbeiten"} element={<AddConsumer />}/>
                            <Route path={":consumerId"} element={<DashboardWrapper />}/>
                        </Route>
                        <Route path={"tarife"}>
                            <Route index element={<ListRates />} />
                            <Route path={"erstellen"} element={<AddRate />} />
                            <Route path={":rateId/bearbeiten"} element={<AddRate />} />
                        </Route>
                    </Route>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
            <NotificationBar/>
        </BrowserRouter>
    );
}

export default App;
