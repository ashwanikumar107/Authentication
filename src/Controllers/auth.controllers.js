import user from "../models/user.js";
import crypto from "crypto";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";

export async function register(req, res) {
    const {username,email,password} = req.body;

    const isAlreadyregistered = await user.findOne({
        $or : [
            {email},
            {username}
        ]
    })

    if(isAlreadyregistered){
        return res.status(409).json({
            message: "User is already registered"
        })
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const newUser = await user.create({
        username,
        email,
        password: passwordHash,
    })

    const refreshToken = jwt.sign({
        id: newUser._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    const session = await sessionModel.create({
        user: newUser._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: newUser._id,
        session: session._id,
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
        message: "User is registered successfully",
        user: {
            username: newUser.username,
            email: newUser.email
        },
        refreshToken
    })
}

export async function getMe(req, res){
    const token  = req.headers.authorization?.split(" ")[ 1 ];

    if(!token){
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const foundUser  = await user.findById(decoded.id);

    res.status(201).json({
        message: "User Fetch Successfully",
        user : {
            username: foundUser.username,
            email: foundUser.email
        }
    })

}

export async function login(req, res){
    const {email, password} = req.body;

    const userfind = await user.findOne({email});

    if(!userfind){
        return res.status(409).json({
            message: "email or password Invalid"
        })
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const checkpassword = passwordHash === userfind.password;

    if(!checkpassword){
        return res.status(409).json({
            message: "Email or password Invalid"
        })
    }

    const refreshToken = jwt.sign({
        id: userfind._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: userfind._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: userfind._id,
        session: session._id
    },config.JWT_SECRET, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "User Logged In Successfully",
        user : {
            username: userfind.username,
            email: userfind.email
        },
        accessToken
    })
}

export async function logout(req, res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(409).json({
            message: "Invalid refresh Token"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if(!session){
        return res.status(409).json({
            message: "Invalid refresh Token"
        })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "User is Logout Successfully"
    })
}