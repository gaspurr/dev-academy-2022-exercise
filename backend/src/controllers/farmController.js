const { Farm, validate } = require("../models/farm")

exports.createFarm = async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.message })
    }

    const {
        farmName,
        data

    } = req.body;

    try {
        //check if a input data is not repeated since time can never be a duplicate value
        let farm = await Farm.findOne({
            farmName: farmName,
        })

        if (farm) {
            return res.status(400).send({ message: 'This farm already exists!' })
        } else {
            const newFarm = new Farm({
                farmName: farmName,
                data: data
            })

            const saveFarm = await newFarm.save()
            if (!saveFarm) throw Error("Error saving a new farm :(")

            return res.status(201).send({
                message: "Farm data created successfully"
            })
        }
    } catch (error) {
        return res.status(409).send({ message: "Critical error: " + error.message })
    }
}

exports.getAllData = async (req, res) => {
    const farms = await Farm.find();

    if (!farms) {
        res.status(400).send({ message: "No farms to display" })
    }
    return res.status(200).send(farms)

}

exports.getFarmsData = async (req, res) => {
    const {
        id
    } = req.params
    const farm = await Farm.find({ _id: id });

    if (!farm) {
        res.status(400).send({ message: "No farms to display" })
    }
    return res.status(200).send(farm)

}

//Append data to db
exports.appendFarmData = async (req, res) => {
    const { id } = req.params


    const body = req.body
    const array = []

    await body.forEach(data => {
        const sensor = data.sensorType
        const value = data.metricValue

        switch (data) {
            case sensor === "rainFall":
                if (value >= 0 && value <= 500) {
                    array.push(data)
                }
            case sensor === "pH":
                if (value >= 0 && value <= 14) {
                    array.push(data)
                }
            case sensor === "temperature":
                if (value >= -50 && value <= 100) {
                    array.push(data)
                }
            default:
                res.send({message: "Data not valid"})
        }
    })

    const farm = await Farm.findOneAndUpdate({
        _id: id
    }, {
        $push: {
            data: array
        }
    })



    if (!farm) {
        res.status(400).send({ message: "There is no such farm in our database " })
    } else {
        res.status(200).send({ message: `A whole bunch of data got added` })
    }


}