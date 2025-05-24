import { prismaClient } from "db/client"
import express from 'express'
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors())

const authRoutes = require('./authRoutes.ts')

app.use('/auth', authRoutes)


