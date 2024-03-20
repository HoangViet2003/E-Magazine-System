const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const facultyJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    marketingCoordinatorId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/) 
});

const contributionJoiSchema = Joi.object({
    facultyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    studentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    title: Joi.string().min(3).max(265).required(),
    status: Joi.string().valid('open', 'close').required()
});

const userJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().lowercase().required(), 
    password: Joi.string().min(3).max(10).required(), 
    role: Joi.string().min(3).max(200)
});

module.exports = {
    validateFaculty: validator(facultyJoiSchema),
    validateContribution: validator(contributionJoiSchema),
    validateUser: validator(userJoiSchema),
};