const generalMiddleware = require("../middleware/generalModels");
const genralModels = require("../models/index");

describe("General Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {} };
        res = {};
        next = jest.fn();
    });

    it("should set req.model and call next when a valid model name is provided", () => {
        const modelName = "user";
        req.params.model = modelName;
        const expectedModel = genralModels[modelName];

        generalMiddleware(req, res, next);

        expect(req.model).toBe(expectedModel);
        expect(next).toHaveBeenCalled();
    });

    it('should call next with "Invalid Model" when an invalid model name is provided', () => {
        const invalidModelName = "invalid";
        req.params.model = invalidModelName;

        generalMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith("Invalid Model");
    });
});
