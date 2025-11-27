import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import formRoutes from './routes/formRoutes.js'
import responseRoutes from './routes/responseRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'
import { connectDb } from './config/db.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());


app.use("/auth/airtable", authRoutes);
app.use("/forms", formRoutes);
app.use("/responses", responseRoutes);
app.use("/webhooks/airtable", webhookRoutes);


app.get("/", (req, res) => {
    res.send("Airtable MERN backend is running");
});

const PORT = process.env.PORT || 5000;

connectDb().then(() =>
    app.listen(PORT, () => console.log('Server running')))