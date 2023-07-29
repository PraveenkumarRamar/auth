
// const jwt = require('jsonwebtoken')
// const bcrypt = require("bcryptjs")

// let hashPassword = async(password) => {
//     let salt = await bcrypt.genSalt(10)
//     let hashedPassword = await bcrypt.hash(password,salt)
//     return hashedPassword
// }

// let comparePassword = async(password,hashedPassword) => {
//     return bcrypt.compare(password,hashedPassword)
// }

// const createToken = async({email,role,name})=>{
//     let token = await jwt.sign(
//         {email,name,role},
//         process.env.JWT_SK,
//         {expiresIn:process.env.JWT_EXPIRE}
//     )
//     return token
// }

// const decodedToken = async(token) => { // decode the jwt
//     return jwt.decode(token)
// }

// const validate = async(req,res,next) => {               //validate
//     let token = req?.headers?.authorization?.split(" ")[1]
//     if(token){
//         let {exp} = await decodedToken(token)
//             if((Math.round((+new Date()/1000)))<exp){
//                 next()
//             }else{
//                 res
//                 .status(404)
//                 .send({
//                     message:"Invalid token"
//                 })
//             }
//     }else{
//         res
//         .status(404)
//         .send({
//             message:'Token not found'
//         })
//     }
// }

// const adminGuard = async(req,res,next) => {  // only admin only access
//     let token = req?.headers?.authorization?.split(" ")[1]
//     if(token){
//         let {role} = await decodedToken(token)
//         if(role==="Admin"){
//             next()
//         }else{
//             res
//             .status(404)
//             .send({
//                 message:"only admins allow to access"
//             })
//         }
//     }else{
//         res
//         .status(404)
//         .send({
//             message:"Token not found"
//         })
//     }

// }

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { genSalt } = require('bcrypt')

const hashPassword = async(password)=>{
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

const comparePassword = async(password,hashedPassword) =>{
    return bcrypt.compare(password,hashedPassword)
}



let createToken = async({email,role,name})=>{ // sign in
    let token = await jwt.sign(
        {email,role,name},
        process.env.JWT_SK,
        {expiresIn:process.env.JWT_EXPIRE}
        )
        return token
}

let decodedToken = async(token) => {
    return jwt.decode(token)
}

let validate = async(req,res,next) => {
    let token = req?.headers?.authorization?.split(" ")[1]
    if(token){
        let {exp} = await decodedToken(token)
        // console.log(exp)
        // console.log((Math.round((+new Date()/1000))))
        if(((Math.round((+new Date()/1000))))<exp){
            next();
        }else{
            res
            .status(401)
            .send({
                message:"Token has been expired"
            })
        }
    }else{
        res
        .status(401)
        .send({
            message:"Token not found"
        })
    }
}

let adminGuard = async(req,res,next) => {
    let token = req?.headers?.authorization?.split(" ")[1]
    if(token){
        let {role} = await decodedToken(token)
        if(role==="Admin"){
            next()
        }else{
            res
            .status(401)
            .send({
                message:"Only Admins allow to access"
            })
        }
    }else{
        res
        .status(401)
        .send({
            message:"Token not found"
        })
    }
}

module.exports={createToken,validate,adminGuard,comparePassword,hashPassword};