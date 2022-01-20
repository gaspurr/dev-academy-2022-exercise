import React from "react"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import Login from "./Components/Login/Login"
import NoPage from "./Components/NoPage/NoPage"
import Signup from "./Components/Signup/Signup"
import Farms from "./Components/Farms/Farm"
import Navbar from "./Components/Navbar/Navbar"
import DataVisualization from "./Components/Farms/DataVisualization"
import Charts from "./Components/Farms/Charts"

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route exact path="/" component={Login} element={<Login />} />
                    <Route exact path="/farms/append" element={<Farms />} />
                    <Route exact path="/signup" element={<Signup />} />
                    <Route path="*" element={<NoPage />} />
                    <Route exact path="/farms" element={<DataVisualization />} />
                    <Route exact path="/farms/chart" element={<Charts />} />
                </Routes>
            </BrowserRouter >
        </>
    )
}

export default App