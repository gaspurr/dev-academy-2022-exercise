import React, { useState, useEffect } from 'react'
import axios from "axios"
import "./DataVisualization.css"
import { Table, TableContainer, TableCell, Paper, TableBody, TableHead, TableRow, Grid, Select, Input, InputLabel, MenuItem, TablePagination } from "@mui/material"
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import WaterDrop from "./waterDrop.png"
import RainFall from "./rainFall.png"



function DataVisualization() {
    const [farm, setFarm] = useState([])
    const [menu, setMenu] = useState([])
    const [selection, setSelection] = useState('')
    const [order, setOrder] = useState("ASC")
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const classes = {
        table: {
            minWidth: 650,
            width: 1000,
        },
        tableContainer: {
            borderRadius: "15px",
            margin: "10px 15px",
            maxWidth: "1200px"
        },
        tableHeaderCell: {
            fontWeight: "bold",
            backgroundColor: "orange"
        },
        tableCell: {
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            display: "flex",
            cursor: "pointer"
        },
        arrowDownIcon: {
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleSelection = (e) => {
        e.preventDefault()

        setSelection(e.target.value)
    }

    const getAllFarms = async () => {
        setMenu([])
        await axios.get(`http://localhost:8081/farms`)
            .then(res => {

                const result = res.data
                console.log("all farms: " + JSON.stringify(result))

                //extract names for the selection
                for (var i in result) {
                    const farmName = result[i]["farmName"]
                    const foo = {
                        farmName: farmName,
                        id: result[i]["_id"]
                    }

                    setMenu(prev => [...prev, foo])
                }

            }).catch(e => {
                console.log({ message: e })
            })
    }

    const sorting = (param) => {
        if (order === "ASC") {
            const sorted = farm.sort((a, b) =>
                a[param].toLowerCase() > b[param].toLowerCase() ? 1 : -1
            )
            setFarm(sorted)
            setOrder("DSC")
        }
        if (order === "DSC") {
            const sorted = [...farm].sort((a, b) =>
                a[param].toLowerCase() < b[param].toLowerCase() ? 1 : -1
            )
            setFarm(sorted)
            setOrder("ASC")
        }
    }

    //fetch a farm and it's data
    const fetchFarm = async (id) => {
        await axios.get(`http://localhost:8081/farms/${id}`)
            .then(res => {
                setFarm([])
                const results = res.data
                console.log(results)
                results["data"].forEach(row => {
                    setFarm(prev => [...prev, row])
                });
            }).catch(e => {
                console.log({ message: e })
            })

    }

    useEffect(() => {
        getAllFarms()
        fetchFarm(selection)



    }, [selection])

    return (
        <div className="container">
            <h2>Data visualization</h2>
            <div>
                <InputLabel htmlFor="selector">Select a farm</InputLabel>
                <Select
                    label="Farms"
                    variant="outlined"
                    input={<Input />}
                    id="selector"
                    fullWidth
                    value={selection}
                    onChange={handleSelection}
                    sx={{ background: "#e3e3e3", marginBottom: 5 }}
                >
                    {menu.map((farm, index) => {
                        return (
                            <MenuItem key={index} value={farm.id}>{farm.farmName}</MenuItem>
                        )
                    })}

                </Select>
            </div>
            <TableContainer component={Paper} sx={classes.tableContainer}>
                <Table className={classes.table} aria-label="sticky table">
                    <TableHead sx={classes.tableHeaderCell}>
                        <TableRow >
                            <TableCell className={classes.tableCell} onClick={() => sorting("datetime")}>
                                Date
                                <ArrowDownwardOutlinedIcon />
                            </TableCell>
                            <TableCell onClick={() => sorting("sensorType")}>Sensor type
                                <ArrowDownwardOutlinedIcon />
                            </TableCell>
                            <TableCell onClick={() => sorting("value")}>Value
                                <ArrowDownwardOutlinedIcon />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {farm.length > 0 ? farm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.datetime}</TableCell>
                                    <TableCell>{
                                        row.sensorType === "rainFall" ? "Rainfall"
                                            : row.sensorType === "pH" ? "PH"
                                                : "Temperature"}
                                    </TableCell>
                                    <TableCell>
                                        <Grid container>
                                            <Grid item sm={6}>
                                                {row.value}
                                            </Grid>
                                            <Grid item sm={2}>
                                                {row.sensorType === "rainFall" ? <img src={RainFall} alt="Rainfall logo" style={{ width: "20px" }} />
                                                    : row.sensorType === "pH" ? <img src={WaterDrop} alt="Ph logo" style={{ width: "20px" }} />
                                                        : <ThermostatIcon sx={{ width: "20px" }} />}
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )) : <h1>Loading...</h1>}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={farm.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default DataVisualization
