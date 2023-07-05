const base64 = require("base-64");
const basicAuth = require("../middleware/basic");
const { users } = require("../models/index");

describe("Basic Authentication Middleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(() => res),
        };
        next = jest.fn();
    });

    describe("User authentication", () => {
        it("should call the next middleware when valid credentials are provided", async () => {
            const user = { userName: "testuser", password: "testpassword" };
            const basicAuthString = base64.encode(
                `${user.userName}:${user.password}`
            );
            req.headers.authorization = `Basic ${basicAuthString}`;

            users.model.authenticateBasic = jest.fn().mockResolvedValue(user);

            await basicAuth(req, res, next);

            expect(users.model.authenticateBasic).toHaveBeenCalledTimes(1);
            expect(users.model.authenticateBasic).toHaveBeenCalledWith(
                user.userName,
                user.password
            );
            expect(req.user).toEqual(user);
            expect(next).toHaveBeenCalled();
        });

        it("should return a 403 status and send 'Invalid Login' when invalid credentials are provided", async () => {
            const basicAuthString = base64.encode("testuser:invalidpassword");
            req.headers.authorization = `Basic ${basicAuthString}`;

            users.model.authenticateBasic = jest
                .fn()
                .mockRejectedValue(new Error("Invalid Login"));

            await basicAuth(req, res, next);

            expect(users.model.authenticateBasic).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith("Invalid Login");
            expect(next).not.toHaveBeenCalled();
        });

        it("should return a 403 status and send 'Invalid Login' when no authorization header is provided", async () => {
            await basicAuth(req, res, next);

            // expect(users.model.authenticateBasic).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith("Invalid Login");
            expect(next).not.toHaveBeenCalled();
        });
    });
});
