import dotenv from "dotenv"

dotenv.config()

const app = {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
    secret: process.env.APP_SECRET
}

const db = {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        url: process.env.DB_URL,
}


export default {app, db}