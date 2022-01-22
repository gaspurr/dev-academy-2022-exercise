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

//get all farms
exports.getAllData = async (req, res) => {
    const farms = await Farm.find();

    if (!farms) {
        res.status(400).send({ message: "No farms to display" })
    }
    return res.status(200).send(farms)
}

//fetch one farm's data
exports.getFarmsData = async (req, res) => {
    const {
        id
    } = req.params
    const farm = await Farm.findOne({ _id: id });

    if (!farm) {
        res.status(400).send({ message: "No farms to display" })
    }
    return res.status(200).send(farm)

}

//Append data to db
exports.appendFarmData = async (req, res) => {
    const { id } = req.params


    const body = req.body

    const farm = await Farm.findOneAndUpdate({
        _id: id
    }, {
        $push: {
            data: body
        }
    })

    if (body.length <= 0) {
        return res.status(400).send({ message: "The request body is empty " })
    } else if (!farm) {
        return res.status(400).send({ message: "Couldn't find the specified farm" })
    } else {
        return res.status(200).send({ message: "Successfuly appended the data!" })
    }


}

//Fetch average rainfall amount
exports.getBySensorType = async (req, res) => {

    const { id } = req.params

    try {
        const search = await Farm.aggregate([
            {
                $unwind: "$data"
            },
            {
                $group: {
                    _id: "$data.sensorType",
                    avgValue: {
                        $avg: "$data.value"
                    }
                }
            }])

        res.status(200).json(search)

    } catch (e) {
        return res.status(400).send({ message: "Couldn't find any data" + e })
    }
}

//set farm's data to be zero
exports.deleteAllDataFromFarm = async (req, res) => {
    const { id } = req.params

    try {
        const body = await Farm.updateOne({
            _id: id
        }, {
            $set: {
                "data": []
            }
        })

        res.status(200).send({ message: `Farm's ${id} data has been erased` })
    } catch (e) {
        console.log(e)
    }
}

//Fetch farms by month
