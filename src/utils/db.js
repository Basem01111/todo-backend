const isUnique = async (model, field, value, id) => {
    const query = {[field]: value};
    if (id) {
        query._id = { $ne: id };
    }
  const exists = await model.findOne(query);
  return !exists;
};

module.exports = {isUnique};