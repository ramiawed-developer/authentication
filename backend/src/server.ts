import dotenv from "dotenv";
dotenv.config();

const { createApp } = await import("./app.js");
const { env } = await import("./config/env.js");

const app = createApp();

const port = env.port;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
