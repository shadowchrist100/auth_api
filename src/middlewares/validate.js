import { ValidationException } from "../lib/exceptions.js";

export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new ValidationException(result.error.flatten().fieldErrors);
        }

        req.body = result.data;
        next();
    };
}
