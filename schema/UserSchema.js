const mongoose = require('mongoose')

function validateEmail(elementValue) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}

function validateMob(e){
    let result = true
    if(e.length==10){
        for(var i=0;i<e.length;i++){
            if(Number(e[i])==e[i]){
                continue;
            }else{
                result = false;
                break
            }
        }
    }else{
        result = false
    }
    
    return result
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, validate: { validator: validateEmail, message: "Invalid email" } },
    mobile:{type:String,required:true, validate:{validator:validateMob, message:"Invalid number or check the number "}},
    password: { type: String, required: true },
    role: { type: String, default: 'Student' },
    status: { type: Boolean, default: true },
    createAt: { type: Date, default: Date.now() }
}, { versionKey: false })

let UserModel = mongoose.model("user", UserSchema)

module.exports = { UserModel }