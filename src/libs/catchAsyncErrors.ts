import { Response, Request, NextFunction } from "express"
import catchMongooseErrors from "./catchDBError"


export default (fn: Function)=>{
    return async(req: Request, res: Response, next: NextFunction)=>{
        try{
            return await fn(req, res, next)
        }catch(err: any){
            
            if(err.details){
                const errors = err.details.map((d: any)=>({message: d.message, field: d.path[0]}))
                return res.status(422).json({errors})
            }
            if(err.data){

            }
            return res.status(500).json({message: "internal server error"})
        }
    }
}