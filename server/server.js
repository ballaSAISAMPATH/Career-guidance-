import express from 'express';
import cors from 'cors';
import {ChatGroq} from "@langchain/groq"
import { HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT_NUMBER, () => {
    console.log(`Server started on port ${process.env.PORT_NUMBER}`);
});

const chat = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
});
app.post('/api/chat', async (req, res) => {
    const {message} = req.body;
    console.log("Received message:", message);
    
    const response = await chat.invoke([new HumanMessage(message)]);
    res.json({reply: response.content});
});