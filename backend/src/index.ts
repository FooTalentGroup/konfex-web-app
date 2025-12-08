import { initSocket } from "@config/socket";
import { createServer } from "http";

import { app } from "./app";

const PORT = process.env.PORT ?? 3001;

const server = createServer(app);

initSocket(server);

server.listen(PORT);
