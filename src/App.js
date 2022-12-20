import './App.css';
import Login from "./Login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import AddProducer from "./pages/admin/AddProducer/AddProducer";
import ListProducers from "./pages/admin/ListProducers/ListProducers";

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
                    </Route>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
