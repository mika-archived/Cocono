import express, { static as s } from "express";
import serverless from "serverless-http";

const app = express();
app.use(s("./docs"));

export const handler = serverless(app);
