const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
name: { type: String, unique: true }
}
);

module.exports = mongoose.model('Roles', rolesSchema);
