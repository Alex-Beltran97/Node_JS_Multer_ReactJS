import express from 'express';
import { PORT } from './config.js';
import initialRoute from './routes/routes.js';
import cors from "cors";
import { join,dirname } from "path";
import { fileURLToPath } from "url";
// import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app =  express();

app.use(express.static(join(__dirname,"./dbimages")));
app.use(express.static(join(__dirname,"../client/dist")));

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(initialRoute);

app.listen(PORT,()=>{
  console.log("Connected in http://localhost:"+PORT);
});