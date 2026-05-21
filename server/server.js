import 'dotenv/config'
import app from "./src/app.js";
import { connectDb } from './src/config/db.js';
import {invokeGeminiAi} from "./src/services/ai.service.js"


connectDb();

app.listen(3000, () => {
    console.log("Server started.")
})