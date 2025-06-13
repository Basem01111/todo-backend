const { link } = require("../app");

/**
 * Paginate Mongoose query results with optional filtering, sorting, projection, and population.
 *
 * @async
 * @function paginate
 * @param {Object} options - The pagination configuration object.
 * @param {Object} options.req - The Express request object (used to extract URL and query params).
 * @param {mongoose.Model} options.model - The Mongoose model to query.
 * @param {Object} [options.filter={}] - Optional MongoDB filter object.
 * @param {Object} [options.sort={}] - Optional sorting object.
 * @param {Object|null} [options.projection=null] - Optional fields to return (projection).
 * @param {string|Object|null} [options.populate=null] - Optional populate configuration.
 *
 * @returns {Promise<Object>} An object containing paginated data and pagination metadata.
**/
async function paginate({
    req,
    model,
    filter = {},
    sort = { createdAt: -1 },
    projection = null,
    populate = null,
}) {
    const baseUrl = req.protocol + "://" + req.get("host") + req.baseUrl + req.path;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const maxButtons = parseInt(req.query.maxButtons) || 5;

    const skip = (page - 1) * limit;

    const query = model
        .find(filter, projection)
        .skip(skip)
        .limit(limit)
        .sort(sort);

    if (populate) query.populate(populate);

    const [data, total] = await Promise.all([
        query.lean(),
        model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pages = getPages(baseUrl, page, totalPages, limit, maxButtons);

    const links = {
        first: buildLink(baseUrl, 1, limit),
        prev: page > 1 ? buildLink(baseUrl, page - 1, limit) : null,
        next: page < totalPages ? buildLink(baseUrl, page + 1, limit) : null,
        last: buildLink(baseUrl, totalPages, limit),
    };

    return {
        data,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            pages,
            links,
        },
    };
}

function buildLink(baseUrl, page, limit) {
    return `${baseUrl}?page=${page}&limit=${limit}`;
}

function getPages(baseUrl, current, total, limit, maxButtons) {
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
        start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(
            {
                link: buildLink(baseUrl, i, limit),
                isActive: current === i,
            }
        );
    }
    return pages;
}

module.exports = paginate;
