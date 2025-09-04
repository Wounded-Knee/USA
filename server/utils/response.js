// Standardized response utilities for v1 API

// Generate ETag for caching
const generateETag = (data) => {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `"${hash}"`;
};

// Standard success response
const success = (res, data, statusCode = 200, meta = {}) => {
  const response = {
    data,
    ...(Object.keys(meta).length > 0 && { meta }),
  };
  
  // Add ETag for GET requests
  if (res.req.method === 'GET') {
    const etag = generateETag(response);
    res.setHeader('ETag', etag);
    
    // Check If-None-Match header
    const ifNoneMatch = res.req.headers['if-none-match'];
    if (ifNoneMatch === etag) {
      return res.status(304).end();
    }
  }
  
  return res.status(statusCode).json(response);
};

// Standard error response following RFC 7807 Problem Details
const error = (res, errorData) => {
  const {
    type = `${process.env.NEXT_PUBLIC_API_URL}/errors/general`,
    title = 'An error occurred',
    status = 500,
    detail = 'Internal server error',
    instance = null,
    errors = null,
  } = errorData;
  
  const response = {
    type,
    title,
    status,
    detail,
    ...(instance && { instance }),
    ...(errors && { errors }),
  };
  
  return res.status(status).json(response);
};

// Pagination helper
const paginate = (query, page = 1, pageSize = 20) => {
  const skip = (page - 1) * pageSize;
  const limit = pageSize;
  
  return {
    query: query.skip(skip).limit(limit),
    pagination: {
      page,
      page_size: pageSize,
      skip,
      limit,
    },
  };
};

// Cursor pagination helper
const cursorPaginate = (query, cursor = null, limit = 50, sortField = '_id') => {
  let paginatedQuery = query.limit(limit);
  
  if (cursor) {
    paginatedQuery = paginatedQuery.where(sortField).gt(cursor);
  }
  
  return {
    query: paginatedQuery,
    pagination: {
      cursor,
      limit,
      sort_field: sortField,
    },
  };
};

// Build pagination metadata
const buildPaginationMeta = (items, total, pagination) => {
  const { page, page_size, cursor, limit } = pagination;
  
  const meta = {
    total,
  };
  
  if (page && page_size) {
    meta.page = page;
    meta.page_size = page_size;
    meta.pages = Math.ceil(total / page_size);
    meta.has_next = page < meta.pages;
    meta.has_prev = page > 1;
  }
  
  if (cursor && limit) {
    meta.cursor = cursor;
    meta.limit = limit;
    meta.has_next = items.length === limit;
    if (items.length > 0) {
      meta.next_cursor = items[items.length - 1]._id.toString();
    }
  }
  
  return meta;
};

// Field selection helper
const selectFields = (fields) => {
  if (!fields) return {};
  
  const fieldArray = fields.split(',');
  const projection = {};
  
  fieldArray.forEach(field => {
    const trimmedField = field.trim();
    if (trimmedField.startsWith('-')) {
      projection[trimmedField.substring(1)] = 0;
    } else {
      projection[trimmedField] = 1;
    }
  });
  
  return projection;
};

// Sort helper
const buildSort = (sort) => {
  if (!sort) return { createdAt: -1 };
  
  const sortObj = {};
  const sortFields = sort.split(',');
  
  sortFields.forEach(field => {
    const trimmedField = field.trim();
    if (trimmedField.startsWith('-')) {
      sortObj[trimmedField.substring(1)] = -1;
    } else {
      sortObj[trimmedField] = 1;
    }
  });
  
  return sortObj;
};

// Filter helper
const buildFilter = (filter) => {
  if (!filter) return {};
  
  const filterObj = {};
  
  Object.keys(filter).forEach(key => {
    const value = filter[key];
    
    // Handle special filter operators
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(operator => {
        const operatorValue = value[operator];
        
        switch (operator) {
          case 'in':
            filterObj[key] = { $in: Array.isArray(operatorValue) ? operatorValue : [operatorValue] };
            break;
          case 'nin':
            filterObj[key] = { $nin: Array.isArray(operatorValue) ? operatorValue : [operatorValue] };
            break;
          case 'gt':
            filterObj[key] = { $gt: operatorValue };
            break;
          case 'gte':
            filterObj[key] = { $gte: operatorValue };
            break;
          case 'lt':
            filterObj[key] = { $lt: operatorValue };
            break;
          case 'lte':
            filterObj[key] = { $lte: operatorValue };
            break;
          case 'regex':
            filterObj[key] = { $regex: operatorValue, $options: 'i' };
            break;
          default:
            filterObj[key] = operatorValue;
        }
      });
    } else {
      filterObj[key] = value;
    }
  });
  
  return filterObj;
};

// Conflict response for idempotent operations
const conflict = (res, detail, existingId = null) => {
  return error(res, {
    type: `${process.env.NEXT_PUBLIC_API_URL}/errors/conflict`,
    title: 'Resource conflict',
    status: 409,
    detail,
    ...(existingId && { existing_id: existingId }),
  });
};

// Not found response
const notFound = (res, resource = 'Resource') => {
  return error(res, {
    type: `${process.env.NEXT_PUBLIC_API_URL}/errors/not-found`,
    title: 'Not found',
    status: 404,
    detail: `${resource} not found`,
  });
};

// Validation error response
const validationError = (res, errors, instance = null) => {
  return error(res, {
    type: `${process.env.NEXT_PUBLIC_API_URL}/errors/validation`,
    title: 'Validation failed',
    status: 422,
    detail: 'Request validation failed',
    instance,
    errors,
  });
};

// Unauthorized response
const unauthorized = (res, detail = 'Authentication required') => {
  return error(res, {
    type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
    title: 'Unauthorized',
    status: 401,
    detail,
  });
};

// Forbidden response
const forbidden = (res, detail = 'Access denied') => {
  return error(res, {
    type: `${process.env.NEXT_PUBLIC_API_URL}/errors/forbidden`,
    title: 'Forbidden',
    status: 403,
    detail,
  });
};

module.exports = {
  success,
  error,
  paginate,
  cursorPaginate,
  buildPaginationMeta,
  selectFields,
  buildSort,
  buildFilter,
  conflict,
  notFound,
  validationError,
  unauthorized,
  forbidden,
  generateETag,
};

