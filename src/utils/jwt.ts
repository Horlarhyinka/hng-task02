import jwt from "jsonwebtoken"
import config from "../config/config"

export async function createJWT(id: string){
    return jwt.sign({ id}, config.app.secret!, {expiresIn: "2d"})
}

export async function verifyJWT(token: string){
    return jwt.verify(token, config.app.secret!)
}