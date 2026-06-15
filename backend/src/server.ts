import dotenv from "dotenv";

import { createApp } from "./app";

dotenv.config();

const app = createApp();

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
