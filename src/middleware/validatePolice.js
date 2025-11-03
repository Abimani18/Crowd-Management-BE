const Joi = require("joi");

// ✅ Define validation rules
const policeSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
  }),

  policeId: Joi.string().trim().required().messages({
    "string.empty": "Police ID is required",
  }),

  stationName: Joi.string().trim().required().messages({
    "string.empty": "Station name is required",
  }),

  location: Joi.string().trim().required().messages({
    "string.empty": "Location is required",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
});

// ✅ Middleware function
const validatePolice = (req, res, next) => {
  const { error } = policeSchema.validate(req.body, { abortEarly: false }); // shows all errors at once
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: "Validation failed", errors: messages });
  }
  next();
};

module.exports = validatePolice;
