import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export async function registerUserController(req,res) {  
    
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide all the required fields."
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if (isUserAlreadyExists) {

        return res.status(400).json({
            message : "User already exists with this email address or username"
        })

    }

    const hashPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        password : hashPassword
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token);

    res.status(201).json({
        message : "User created successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        },
    })

}

export async function loginUserController(req,res){

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide all the required fields."
        })
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign(
        {id : user._id, username : user.username},
        process.env.JWT_SECRET,
        { expiresIn: "1d"},
    )

    res.cookie("token", token);

    res.status(200).json({
        message : "User Logn successfully",
        user : {
            id : user._id,
            username: user.username,
            email : user.email
        }
    })

}

