import React, { useState, useEffect } from 'react'
import { parse } from "papaparse"
import axios from "axios"
import {
    Container,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    OutlinedInput,
    Stack,
    Alert
} from "@mui/material"

function Farm() {

    const [selection, setSelection] = useState('')
    const [menu, setMenu] = useState([])
    const [farm, setFarm] = useState([])
    const [errors, setErrors] = useState(null)

    const handleChange = (e) => {
        e.preventDefault()
        setSelection(e.target.value)
    }

    const appendData = async (data, id) => {
        await axios.post(`http://localhost:8081/farms/add-data/${id}`, data)
            .then(res => {
                console.log(res.data)
                setErrors(null)
            }).catch(e => {
                console.log({ message: e })
                setErrors("Something critical happened")
            }
            )
    }

    //parse CSV and append to the destination farm
    const handleDrop = async (e) => {
        e.preventDefault()
        setFarm([])

        //TO-DO validate filetype
        Array.from(e.dataTransfer.files)
            .filter(file => file.type === "text/csv")
            .forEach(async (file) => {
                const data = await file.text()
                const result = parse(data, { header: true })
                const filteredData = result.data

                //I changed the body parses size to be 2000kb in the node_modules/body_parser
                //Original was 100kb
                filteredData.forEach((data) => {
                    let sensor = data.sensorType
                    let value = data.value
                    setErrors("Appending to database...")

                    if (sensor === "rainFall" && value >= 0 && value <= 500) {
                        farm.push(data)
                    } else if (sensor === "pH" && value >= 0 && value <= 14) {
                        farm.push(data)
                    } else if (sensor === "temperature" && value >= -50 && value <= 100) {
                        farm.push(data)
                    }
                    console.log("appending")
                })
                appendData(farm, selection)
                console.log("not appending")
            })
        setErrors(null)
    }

    //get all of the farms
    const farmFetch = async () => {
        await axios.get("http://localhost:8081/farms")
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



    useEffect(() => {
        farmFetch()
    }, [])

    return (
        <div>
            <Container maxWidth="sm">
                <Box>
                    <Typography component="h1"
                        variant="h5"
                        sx={{ textAlign: "center", margin: 3 }}
                    >
                        Input a farm's CSV file
                    </Typography>
                        <TextField
                            value={selection}
                            select
                            label="Farm"
                            fullWidth
                            renderValue={(p) => p}
                            onChange={handleChange}
                            sx={{ marginBottom: 5 }}
                        >
                            {menu.map((farm, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={farm.id}
                                    >
                                        {farm.farmName}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                    <TextField
                        label="Drop it here"
                        variant="outlined"
                        fullWidth
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                            e.preventDefault()
                        }}
                        sx={{ background: "#e3e3e3" }}
                        disabled
                    />
                    {errors != null ? (
                        <Stack sx={{ width: "100%" }} spacing={2}>
                            <Alert severity="error" onClick={() => setErrors(null)}>
                                {errors}
                            </Alert>
                        </Stack>
                    ) : (null)}
                </Box>
            </Container>
        </div>
    )
}

export default Farm
