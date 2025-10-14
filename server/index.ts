import express from "express";
import cors from "cors";
import { createServer } from "http";
import router from "./routes";
import { setupVite } from "./vite";

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

if (process.env.NODE_ENV !== "production") {
  await setupVite(app, server);
} else {
  const staticPath = "./dist/public";
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile("index.html", { root: staticPath });
  });
}

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
