import { initSocket } from "@config/socket";
import { createServer } from "http";

import { app } from "./app";

const port = Number(process.env.PORT) || 3001;

const server = createServer(app);

initSocket(server);

server.listen(port, "0.0.0.0", () => {
  console.log(`Documentación de la API: http://0.0.0.0:${port}/api/v1/docs`);
});
