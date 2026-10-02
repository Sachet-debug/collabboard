"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || "Server Error",
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};
exports.notFound = notFound;
//# sourceMappingURL=errorHandler.js.map