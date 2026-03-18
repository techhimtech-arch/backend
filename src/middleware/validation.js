const Joi = require('joi');

const auditRequestSchema = Joi.object({
  url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'URL must be a valid URI',
      'any.required': 'URL is required'
    })
});

const validateAuditRequest = (req, res, next) => {
  const { error } = auditRequestSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateAuditRequest
};
