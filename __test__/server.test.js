const supertest = require("supertest");
const { app } = require("../src/server");
const handle404 = require("../src/error-handlers/404");
const errorHandler = require("../src/error-handlers/500");

describe("App", () => {
    describe("404 Error Handler", () => {
        it("should respond with a 404 status code and error message", () => {
            const req = {};
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res),
            };
            const next = jest.fn();

            handle404(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: "Page not Found!",
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("500 Error Handler", () => {
        it("should respond with a 500 status code and error message", () => {
            const error = new Error("Internal Server Error");
            const req = {};
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res),
            };
            const next = jest.fn();

            errorHandler(error, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: "Internal Server Error",
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("GET /", () => {
        it("should respond with a welcome message", async () => {
            const response = await supertest(app).get("/");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                code: 200,
                message: "WELCOME",
            });
        });
    });
});
