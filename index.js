require('dotenv').config()
const express = require("express");
const userModel = require("./database/user");
const taxModel = require("./database/tax")

const app = express();
app.use(express.json());
const cors = require("cors");
app.options('*', cors())

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const mongoose = require("mongoose");       

var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB , { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESTABLISHED")).catch(err => console.log(err));

// opening of page
app.get("/" , (req, res) => {
    return res.json({"Welcome" : `to the backend software for the Login Form`});
});

// POST REQUEST for Register Page
app.post("/register", async(req, res) => {
    console.log(req.body);
    
    const newUser = await userModel.create(req.body);
    console.log(newUser);
    const token = newUser.generateJwtToken();
    return res.json({
        userAdded: newUser,
        tokens : token,
        message : "Registration Successful!!!"
    });
   
})

// POST REQUEST for Login Page
app.post('/login',async(req,res)=>{
    try{
       const check= await userModel.findByEmailAndPassword(req.body);

        if(check==1){
            return res.status(200).json({message:"Incorrect Password",icon:"warning"})
        }
        else if(check==0){
            return res.status(200).json({message:"Account not found, Kindly Sign Up",icon:"warning"})
        }
        else{
            const token=check.generateJwtToken();
            return res.status(200).json({token,status:"success",message:"Successfully Logged In!",icon:"success",userDetails:check})
        }
    }
    catch(err){
        return res.status(500).json({error : err})
    }
})

// POST REQUEST for Tax Page
app.post("/tax" , async(req, res) => {
    // console.log(req.body)
    const userDetails = await taxModel.create(req.body)
    console.log(userDetails)
    
    const taxArray = []
    if(req.body.City=="Metro City")
    {
        let val1 = 0.5 * Number(req.body.Bas)
        let val2 = Number(req.body.Rent) - 0.1 * Number(req.body.Bas)
        let val3 = Number(req.body.HRA)

        taxArray.push(val1)
        taxArray.push(val2)
        taxArray.push(val3)

        var AppHRA = Math.min( ...taxArray )
        console.log(AppHRA)

    }
    else
    {
        let val1 = 0.4 * Number(req.body.Bas)
        let val2 =  Number(req.body.Rent) - 0.1 * Number(req.body.Bas)
        let val3 = Number(req.body.HRA)

        taxArray.push(val1)
        taxArray.push(val2)
        taxArray.push(val3)

        var AppHRA = Math.min( ...taxArray )
        console.log(AppHRA)
    }

    const TaxInc = (Number(req.body.Bas)+Number(req.body.LTA)+Number(req.body.HRA)+Number(req.body.FA))-AppHRA-Number(req.body.Inv)- Number(req.body.Med)
    console.log(TaxInc)
    return res.json({
        taxDetals:userDetails,
        AppHRA:AppHRA,
        TaxInc : TaxInc
    })
})

app.listen(process.env.PORT || 5000,()=>{
    console.log("MY EXPRESS APP IS RUNNING")
})