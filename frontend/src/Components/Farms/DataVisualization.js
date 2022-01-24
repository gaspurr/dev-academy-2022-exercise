import React, { useState, useEffect } from 'react'
import axios from "axios"
import "./DataVisualization.css"
import {
    Table,
    TableContainer,
    TableCell,
    Paper,
    TableBody,
    TableHead,
    TableRow, Grid,
    InputLabel,
    MenuItem,
    TablePagination,
    TextField,
    Alert
} from "@mui/material"
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import WaterDrop from "./waterDrop.png"
import RainFall from "./rainFall.png"
import Chart from "./Charts"
import { api } from "../../config";



function DataVisualization() {
    const [farm, setFarm] = useState([])
    const [menu, setMenu] = useState([])
    const [selection, setSelection] = useState(null)
    const [order, setOrder] = useState("ASC")
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)

    const classes = {
        table: {
            minWidth: 750,
            width: 1000,
        },
        tableContainer: {
            borderRadius: "15px",
            margin: "10px 15px",
            maxWidth: "1200px",
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

    const handleChangePage = ( newPage) => {
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
        await axios.get(`${api}/farms`)
            .then(res => {
                const result = res.data
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
        if (selection != null) {
            setLoading(true)
            await axios.get(`${api}/farms/${id}`)
                .then(res => {
                    setFarm([])
                    const results = res.data
                    results["data"].forEach(row => {
                        setFarm(prev => [...prev, row])
                    });
                }).catch(e => {
                    console.log({ message: e })
                })
        }
        setLoading(false)
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
                <TextField
                    value={selection}
                    select
                    label="Farm"
                    onChange={handleSelection}
                    sx={{ marginBottom: 5, minWidth: "50%" }}
                >
                    {menu.map((farm, index) => {
                        return (
                            <MenuItem key={index} value={farm.id}>{farm.farmName}</MenuItem>
                        )
                    })}

                </TextField>
            </div>
            <div className="content-container">
                <div>
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
                                    <TableCell>Value
                                        <ArrowDownwardOutlinedIcon />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!loading ? farm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                    )) : null}
                                    {loading ? <Alert severity="warning">There is so much data aaagh...</Alert> : null}
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

                <Chart farmData={farm} />
            </div>

        </div>
    )
}

export default DataVisualization
