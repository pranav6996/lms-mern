const crypto = require('crypto');

/**
 * Generate a random token for password reset
 */
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  return { resetToken, hashedToken };
};

/**
 * Build pagination result
 */
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

/**
 * Build pagination meta
 */
const paginationMeta = (total, page, limit) => {
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / limit),
  };
};

module.exports = { generateResetToken, paginate, paginationMeta };
