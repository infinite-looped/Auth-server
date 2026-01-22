/**
 * Generic Zod validation middleware
 * @param {import("zod").ZodSchema} schema
 */

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      // Zod validation error
      const error = new Error(
        err.errors?.[0]?.message || "Invalid request data"
      );
      error.statusCode = 400;
      next(error);
    }
  };
};

module.exports = validate;