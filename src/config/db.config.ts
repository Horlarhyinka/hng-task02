import { DataSource } from "typeorm"
import { User } from "../models/user"
import config from "./config"
import { Organization } from "../models/organization"


export const AppDataSource = new DataSource({
        type: "postgres",
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.database,
        synchronize: true,
        logging: true,
        entities: [User, Organization],
        subscribers: [],
        migrations: [],
        url: config.db.url,
        logger: "file"
    })
    
AppDataSource.initialize()
        .then((res) => {
            console.log("db initialized...")
        })
        .catch((error) => console.log(error))

