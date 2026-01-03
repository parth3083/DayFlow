import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.send("Server status OK");
});

export default app;
