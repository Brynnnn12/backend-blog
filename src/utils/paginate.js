/**
 * Generate pagination for Sequelize models
 * @param {Object} options - Pagination options
 * @param {Model} options.model - Sequelize model to query
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Items per page
 * @param {Array} options.order - Sorting order
 * @param {Object} options.where - Where conditions
 * @param {Array} options.include - Relations to include
 * @param {Array} options.attributes - Fields to select
 * @returns {Object} Pagination result
 */
exports.paginate = async ({
  model,
  page = 1,
  limit = 10,
  order = [["createdAt", "DESC"]],
  where = {},
  include = [],
  attributes = null,
}) => {
  const options = {
    where,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order,
    include,
  };

  if (attributes) {
    options.attributes = attributes;
  }

  const { rows, count } = await model.findAndCountAll(options);

  return {
    data: rows,
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / parseInt(limit)),
  };
};
