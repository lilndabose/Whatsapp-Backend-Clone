import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs'
import dotenv from 'dotenv-flow'
import { config } from './src/config/db.config.js';
dotenv.config({ path: 'local.env' });


import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import emailRoutes from './src/routes/email.routes.js'

// dotenv.config();
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH","PUT"]
    }
});

app.use(cors("*"))

app.use(express.json());
//connecting app to db
const url= process.env.MONGODB_URI ||  `mongodb://${config.dbhost}:${config.dbport}/${config.dbname}`;
mongoose.connect(url,{useNewUrlParser: true});
const con = mongoose.connection;

app.get("/",(req,res)=>{
    res.send("<center><h1 style='margin-top: 20%;color:#25D366;'>WELCOME TO WhatsappClone Backend</h1><h2 style='color:#0d7dd6;'>BACKEND API</h2></center>")
})

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/send-email",emailRoutes)

app.get('*', function(req, res){
    res.status(404).json({message:`Route ${req.path} not found`})
})



server.listen(process.env.PORT,(err)=>{
    console.log("Server running on port",process.env.PORT)
})

export default app;