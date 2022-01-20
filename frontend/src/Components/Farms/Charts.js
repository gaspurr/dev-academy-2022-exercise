import React, { useState, useEffect } from 'react'
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Charts(props) {
    const [labels, setLabels] = useState([])
    const [pH, setPh] = useState([])
    const [rainfall, setRainfall] = useState([])
    const [temp, setTemp] = useState([])

    const farm = props.farmData
    const getLabels = async(farm) => {
        setLabels([])
        setPh([])
        setRainfall([])
        setTemp([])

        try {
            await farm.forEach(row => {
                setLabels(prev => [...prev, row.datetime])
                const type = row.sensorType
                const value = parseFloat(row.value)
                console.log(value)
                if (type === "pH") {
                    setPh(prev => [...prev, value])
                    console.log("d")
                }
                if (type === "rainFall") {
                    setRainfall(prev => [...prev, value])
                }
                if (type === "temperature") {
                    setTemp(prev => [...prev, value])
                }
            });
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        getLabels(farm)
        console.log(temp, pH, rainfall)
    }, [])

    const data = {
        labels: labels,
        datasets: [{
            label: "Rainfall",
            data: rainfall,
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: '#0071bd',
        }, {
            label: "Ph",
            data: pH,
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: 'lightblue',
        }, {
            label: "Temperature",
            data: temp,
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: 'red',
        }]
    }

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    }

    return (
        <div className="content-container-chart">
            <Line data={data} options={options} />
        </div>
    )
}

export default Charts
