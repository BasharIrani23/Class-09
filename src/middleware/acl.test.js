const aclMiddleware = require("../middleware/acl");

describe("ACL Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: { capabilities: [] } };
        res = {};
        next = jest.fn();
    });

    it("should call next when the user has the required capability", () => {
        const capability = "delete";
        req.user.capabilities.push(capability);

        aclMiddleware(capability)(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next with "Access Denied" when the user does not have the required capability', () => {
        const capability = "delete";

        aclMiddleware(capability)(req, res, next);

        expect(next).toHaveBeenCalledWith("Access Denied");
    });

    it('should call next with "Invalid Login" when the user object is invalid', () => {
        const capability = "delete";
        req.user = null;

        aclMiddleware(capability)(req, res, next);

        expect(next).toHaveBeenCalledWith("Invalid Login");
    });
});
