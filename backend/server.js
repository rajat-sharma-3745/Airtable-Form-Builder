import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import formRoutes from './routes/formRoutes.js'
import responseRoutes from './routes/responseRoutes.js'
import { connectDb } from './config/db.js';
import { errorMiddleware } from './middlewares/error.js'
import { webhookHanlder } from './controllers/webhookController.js'

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))


app.use(cookieParser());
app.post("/webhooks/airtable", express.raw({ type: "application/json" }),webhookHanlder);

app.use(express.json());
app.use(express.urlencoded());


app.use("/auth/airtable", authRoutes);
app.use("/forms", formRoutes);
app.use("/responses", responseRoutes);



app.get("/", (req, res) => {
    res.send("Airtable MERN backend is running");
});

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000;

connectDb().then(() =>
    app.listen(PORT, () => console.log('Server running')))