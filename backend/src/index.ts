import { initSocket } from "@config/socket";
import { createServer } from "http";

import { app } from "./app";

const port = Number(process.env.PORT) || 3001;

const server = createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`Health en http://localhost:${port}/api/v1/health`);
  console.log(`Documentación de la API: http://localhost:${port}/api/v1/docs`);
});
