// server/index.ts
import express, { Application } from "express";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app: Application = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});