const bearerAuth = require("../middleware/bearer");
const { users } = require("../models/index");

describe("Bearer Authentication Middleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {};
        next = jest.fn();
    });

    describe("User authentication", () => {
        it("should call the next middleware when a valid token is provided", async () => {
            const user = { username: "testuser", token: "validtoken" };
            req.headers.authorization = `Bearer ${user.token}`;

            users.model.authenticateToken = jest.fn().mockResolvedValue(user);

            await bearerAuth(req, res, next);

            expect(users.model.authenticateToken).toHaveBeenCalledTimes(1);
            expect(users.model.authenticateToken).toHaveBeenCalledWith(
                user.token
            );
            expect(req.user).toEqual(user);
            expect(req.token).toEqual(user.token);
            expect(next).toHaveBeenCalled();
        });

        it("should call the next middleware with 'Invalid Login' when an invalid token is provided", async () => {
            req.headers.authorization = "Bearer invalidtoken";

            users.model.authenticateToken = jest
                .fn()
                .mockRejectedValue(new Error("Invalid Login"));

            await bearerAuth(req, res, next);

            expect(users.model.authenticateToken).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith("Invalid Login");
        });

        it("should call the next middleware with 'Invalid Login' when no authorization header is provided", async () => {
            await bearerAuth(req, res, next);

            //  expect(users.model.authenticateToken).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith("Invalid Login");
        });
    });
});
