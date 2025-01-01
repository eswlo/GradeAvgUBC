"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const start = () => {
    if (process.env.NODE_ENV !== "production") {
        dotenv_1.default.config({ path: "../.env" });
    }
    try {
        console.log("Starting application...");
        const port = process.env.SERVER_PORT || 3000;
        const server = app_1.default.listen(port, () => {
            console.log(`app listening on port ${port}`);
        });
        return server;
    }
    catch (err) {
        console.error("Error starting the server:", err);
        process.exit(1);
    }
};
exports.start = start;
(0, exports.start)();
//# sourceMappingURL=server.js.map