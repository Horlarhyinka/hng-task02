import bcrypt from "bcrypt"

export default async function hashPassword(plain: string){
    if(!plain)return plain
    const salt = await bcrypt.genSalt(12)
    const hashed = await bcrypt.hash(plain, salt);
    return hashed
  }