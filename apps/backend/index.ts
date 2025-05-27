import express from 'express'
import cors from "cors"
import authRoutes from "./authRoutes.ts"

const app = express();

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
// app.use('/user', userRoutes)

app.listen(9090, () => {
    console.log("Server running on port 9090");
})
