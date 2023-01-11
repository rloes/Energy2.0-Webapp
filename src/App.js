import './App.css';
import Login from "./Login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import AddProducer from "./pages/admin/AddProducer/AddProducer";
import ListProducers from "./pages/admin/ListProducers/ListProducers";
import {Alert, Snackbar} from "@mui/material";
import NotificationBar from "./components/NotificationBar";
import AddConsumer from "./pages/admin/AddConsumer/AddConsumer";

function App() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<div />}/>
                        <Route path={"solaranlagen"}>
                            <Route index element={<ListProducers/>} />
                            <Route path={"erstellen"} element={<AddProducer/>}/>
                            <Route path={":producerId/bearbeiten"} element={<AddProducer/>} />
                        </Route>
                        <Route path={"kunden"}>
                            <Route path={"erstellen"} element={<AddConsumer />}/>
                        </Route>
                    </Route>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
            <NotificationBar/>
        </BrowserRouter>
    );
}

export default App;
