const { z } = require('zod');

// Common validation schemas
const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

const filterSchema = z.object({
  filter: z.record(z.any()).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
});

// User validation schemas
const userCreateSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
});

// Auth validation schemas
const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const registerSchema = userCreateSchema;

// Petition validation schemas
const petitionCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  category: z.string().min(1), // This will be mapped to categoryId
  jurisdictionId: z.string().min(1),
  governingBodyId: z.string().optional(),
  legislationId: z.string().optional(),
});

const petitionUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  category: z.string().min(1).optional(), // This will be mapped to categoryId
});

// Vote validation schemas
const voteCreateSchema = z.object({});

// Vigor validation schemas
const vigorCreateSchema = z.object({
  type: z.string().min(1),
  amount: z.number().min(1),
  activityData: z.record(z.any()).optional(),
  signingStatement: z.string().max(500).optional(),
});

// Media validation schemas
const mediaCreateSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  description: z.string().max(500).optional(),
  isPrimary: z.boolean().default(false),
});

// Role validation schemas
const roleAssignmentSchema = z.object({
  role: z.string().min(1),
});

const roleUpdateSchema = z.object({
  roles: z.array(z.string().min(1)),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      
      // Replace request data with validated data
      req.body = { ...req.body, ...validatedData };
      req.query = { ...req.query, ...validatedData };
      req.params = { ...req.params, ...validatedData };
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          type: 'https://api.example.com/errors/validation',
          title: 'Validation failed',
          status: 422,
          detail: 'Request validation failed',
          instance: req.originalUrl,
          errors: error.errors.reduce((acc, err) => {
            const field = err.path.join('.');
            if (!acc[field]) acc[field] = [];
            acc[field].push(err.message);
            return acc;
          }, {}),
        });
      }
      next(error);
    }
  };
};

// Export validation middleware and schemas
module.exports = {
  validate,
  schemas: {
    pagination: paginationSchema,
    filter: filterSchema,
    userCreate: userCreateSchema,
    userUpdate: userUpdateSchema,
    login: loginSchema,
    register: registerSchema,
    petitionCreate: petitionCreateSchema,
    petitionUpdate: petitionUpdateSchema,
    voteCreate: voteCreateSchema,
    vigorCreate: vigorCreateSchema,
    mediaCreate: mediaCreateSchema,
    roleAssignment: roleAssignmentSchema,
    roleUpdate: roleUpdateSchema,
  },
};

