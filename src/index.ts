import express, {Request, Response} from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import http from "http"
import config from "./config/config"

import authRouter from "./routes/auth"
import orgRouter from "./routes/organization"


import "reflect-metadata"

const app = express()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	legacyHeaders: false,
})

app.use(limiter)
app.use(cors({ origin: "*"}))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/auth", authRouter)
app.use("/api/organisations", orgRouter)

function start(){
    const server = http.createServer(app)
    server.listen(config.app.port, ()=>{
        console.log(`server running ${config.app.env} mode on port ${(server.address() as {port: number}).port}...`)
    })
    return server
}

const server = start()

export default server