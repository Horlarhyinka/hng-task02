import bcrypt from "bcrypt"

export default (plain: string, hash: string)=>bcrypt.compare(plain, hash)