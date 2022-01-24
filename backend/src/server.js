const cors = require("cors")
const express = require("express")
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const userRoutes = require("./routes/users")
const farmRoutes = require("./routes/farms")
const bodyParser = require("body-parser")
const path = require("path")

const PORT = process.env.PORT || 8000;
const app = express()
app.use(cors())
app.use(express.json())


app.use(bodyParser.json({ limit: "2mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }))

app.use('/', userRoutes);
app.use('/farms', farmRoutes)

app.get("*", (req, res) => {
    res.send("This route doesn't exist!")
})


mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Succesfully connected to MongoDB")
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })

// Step 1:
if (process.env.NODE_ENV === "production") {
    // Serve static files from the React frontend app
    app.use(express.static(path.join(__dirname, '../../frontend/build')))

    // AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
    })
}