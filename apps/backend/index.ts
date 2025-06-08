import express from 'express'
import cors from "cors"
import authRoutes from "./authRoutes.ts"
import blogRoutes from "./blogRoutes.ts"
import awsRoutes from "./awsRoutes.ts"
import llmRoutes from "./llmRoutes.ts"
import userRoutes from "./userRoutes.ts"
import connectionRoutes from "./connectionRoutes.ts"

const app = express();

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/blog', blogRoutes)
app.use('/aws', awsRoutes)
app.use('/llm', llmRoutes)
app.use('/user', userRoutes)
app.use('/connections', connectionRoutes)

app.listen(9090, () => {
    console.log("Server running on port 9090");
})
