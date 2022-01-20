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
    OutlinedInput } from "@mui/material"
import {Chart} from "react-chartjs-2"

function Farm() {

    const [selection, setSelection] = useState('')
    const [menu, setMenu] = useState([])
    const [farm, setFarm] = useState([])

    const handleChange = (e) => {
        e.preventDefault()

        setSelection(e.target.value)
        console.log(selection)
    }

    const appendData = async (data, id) => {
        await axios.post(`http://localhost:8081/farms/add-data/${id}`, data)
            .then(res => {
                console.log(res.data)
            }).catch(e => {
                console.log({ message: e })
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

                /*console.log(filteredData)
                const sensor = filteredData.sensorType
                const value = filteredData.value*/
                filteredData.forEach((data) => {
                    let sensor = data.sensorType
                    let value = data.value

                    if (sensor === "rainFall" && value >= 0 && value <= 500) {
                        farm.push(data)
                    } else if (sensor === "pH" && value >= 0 && value <= 14) {
                        farm.push(data)
                    } else if (sensor === "temperature" && value >= -50 && value <= 100) {
                        farm.push(data)
                    }
                })
                appendData(farm, selection)
            })


        console.log(farm)
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
                    <InputLabel htmlFor="selector">Farm</InputLabel>
                    <Select
                        label="Farms"
                        variant="outlined"
                        id="selector"
                        input={<OutlinedInput name="Farm" />}
                        defaultValue=""
                        fullWidth
                        onChange={handleChange}

                        sx={{ background: "#e3e3e3", marginBottom: 5 }}
                    >
                        {menu.map(farm => {
                            return (
                                <MenuItem key={farm.id} value={farm.id} onChange={handleChange}>{farm.farmName}</MenuItem>
                            )
                        })}

                    </Select>
                    <TextField
                        label="Drop it here"
                        variant="outlined"
                        fullWidth
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                            e.preventDefault()
                        }}
                        sx={{ background: "#e3e3e3" }}
                    />
                </Box>
                <Box>
                    {farm > 0 ? farm.map((farm) => (
                        <li key={farm}>
                            <ul>
                                <strong>{farm.location}</strong>
                                <p>{farm.datetime}</p>
                                <p>{farm.sensorType}</p>
                                <p>{farm.value}</p>
                            </ul>
                        </li>
                    )) : null}
                </Box>
            </Container>
        </div>
    )
}

export default Farm
