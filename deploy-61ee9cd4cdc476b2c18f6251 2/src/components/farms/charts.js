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
    const [beginning, setBeginning] = useState(0)
    const [end, setEnd] = useState(20)

    const farm = props.farmData

    const getLabels = async (farm) => {

        setLabels([])
        setPh([])
        setRainfall([])
        setTemp([])

        try {
            await farm.forEach(row => {
                setLabels(prev => [...prev, row.datetime.slice(0, 16)])
                const type = row.sensorType
                const value = parseFloat(row.value)
                if (type === "pH") {
                    setPh(prev => [...prev, value])
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

    const nextButton = async(e) => {
        e.preventDefault()

        const newBeginning = beginning + 10
        const newEnding = end + 10
        setEnd(newEnding)
        setBeginning(newBeginning)

        console.log(beginning)
    }
    const prevButton = async(e) => {
        e.preventDefault()

        const newBeginning = beginning - 10
        const newEnding = end - 10
        setEnd(newEnding)
        setBeginning(newBeginning)
        console.log(end)
    }

    useEffect(() => {
        getLabels(farm)
    }, [props.farmData])

    const data = {
        labels: labels.slice(beginning, end),
        datasets: [{
            label: "Rainfall",
            data: rainfall.slice(beginning, end),
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: '#0071bd',
        }, {
            label: "Ph",
            data: pH.slice(beginning, end),
            fill: false,
            backgroundColor: '#0071bd',
            borderColor: 'lightblue',
        }, {
            label: "Temperature",
            data: temp.slice(beginning, end),
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
            <div>
                <button onClick={prevButton}>Left</button>
                <button onClick={nextButton}>Right</button>
            </div>

            <Line data={data} options={options} />
        </div>
    )
}

export default Charts
