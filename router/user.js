const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { dburl} = require('../configuration/dbConfig')
const { UserModel } = require('../schema/UserSchema')
const {createToken,validate,adminGuard,comparePassword,hashPassword} = require("../auth")
mongoose.connect(dburl)




router.get('/all',validate, adminGuard, async (req, res) => {
    try {
        let users = await UserModel.find();
        res
            .status(200)
            .send({
                message: "Data fetched Successfully",
                users
            })
    } catch (error) {
        res
            .status(400)
            .send({
                message: "Internal server error"
            })
    }
})

router.get('/:id',validate,adminGuard, async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.id);
        res
            .status(200)
            .send({
                message: "Data finded Successfully",
                user
            })
    } catch (error) {
        res
            .status(400)
            .send({
                message: "Internal server error"
            })
    }
})


router.post("/signup", async (req, res) => {
    try {
        let user = await UserModel.findOne({email: req.body.email })
        if (!user) {
            req.body.password = await hashPassword(req.body.password)
            let newUser = await UserModel.create(req.body)
                res
                .status(200)
                .send({
                    message: "Data added successfully"
                })
        }else{
            res
            .status(404)
            .send({
                message:`User with ${req.body.email} already enrolled`
            })
        }

    } catch (error) {
        res
            .status(504)
            .send({
                message:error?.message
            })
    }
})

router.post("/signin", async (req, res) => {
    try {
        let user = await UserModel.findOne({email: req.body.email })
        if (user) {
            if(await comparePassword(req.body.password,user.password))
            {
                let token = await createToken(user)
                res
                .status(200)
                .send({
                    message:"Login Successful",
                    token
                })
            }
            else
            {  
                res
                .status(404)
                .send({
                    message:"Invalid Credentials"
                })
            }
        }else{
            res
            .status(404)
            .send({
                message:`User with ${req.body.email} doesn't exists`
            })
        }
    } catch (error) {
        console.log(error)
        res
            .status(504)
            .send({
                message:error?.message
            })
    }
})

router.post("/change-password/:id",validate, async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.id)
        if (user) {
            if(await comparePassword(req.body.current_password,user.password))
            {
                user.password = await hashPassword(req.body.new_password)
                user.save()
                res
                .status(200)
                .send({
                    message:"Password changed successful"
                })
            }
            else
            {  
                res
                .status(404)
                .send({
                    message:"Invalid Credentials"
                })
            }
        }else{
            res
            .status(404)
            .send({
                message:`User  doesn't exists`
            })
        }

    } catch (error) {
        res
            .status(504)
            .send({
                message:error?.message
            })
    }
})

module.exports = router