/**
 * Converts megabytes to bytes.
 *
 * @param {number|string} mb - Size in megabytes.
 * @returns {number} - Size in bytes.
 */
exports.mbToBytes = (mb) => {
  return Number(mb) * 1024 * 1024;
}



/**
 * Extracts and returns file extensions from a comma-separated MIME types string.
 *
 * @param {string} types - Comma-separated MIME types (e.g., "image/jpeg,image/png").
 * @returns {string} - Comma-separated extensions (e.g., "jpeg, png").
 */
exports.formatedTypes = (types) => {
  return types
    .split(",")
    .map((type) => type.split("/").pop())
    .join(", ");
};
