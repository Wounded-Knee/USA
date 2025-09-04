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
  birthdate: z.string().datetime().optional(),
  race: z.string().max(100).optional(),
  gender: z.string().max(50).optional(),
  income: z.enum(['under_25k', '25k_50k', '50k_75k', '75k_100k', '100k_150k', '150k_200k', 'over_200k', 'prefer_not_to_say']).optional(),
  religion: z.string().max(100).optional(),
  politicalPriorities: z.array(z.string().max(200)).optional(),
});

const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  birthdate: z.string().datetime().optional(),
  race: z.string().max(100).optional(),
  gender: z.string().max(50).optional(),
  income: z.enum(['under_25k', '25k_50k', '50k_75k', '75k_100k', '100k_150k', '150k_200k', 'over_200k', 'prefer_not_to_say']).optional(),
  religion: z.string().max(100).optional(),
  politicalPriorities: z.array(z.string().max(200)).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
});

// Political identity validation schemas
const politicalIdentityCreateSchema = z.object({
  identityId: z.number().int().positive(),
  rank: z.number().int().min(1),
});

const politicalIdentityUpdateSchema = z.object({
  identityId: z.number().int().positive().optional(),
  rank: z.number().int().min(1).optional(),
});

const politicalIdentitiesUpdateSchema = z.object({
  identities: z.array(z.object({
    identityId: z.number().int().positive(),
    rank: z.number().int().min(1),
  })).min(1),
});

// Auth validation schemas
const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const registerSchema = userCreateSchema;

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
          type: `${process.env.NEXT_PUBLIC_API_URL}/errors/validation`,
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
    politicalIdentityCreate: politicalIdentityCreateSchema,
    politicalIdentityUpdate: politicalIdentityUpdateSchema,
    politicalIdentitiesUpdate: politicalIdentitiesUpdateSchema,
    login: loginSchema,
    register: registerSchema,
    mediaCreate: mediaCreateSchema,
    roleAssignment: roleAssignmentSchema,
    roleUpdate: roleUpdateSchema,
  },
};

