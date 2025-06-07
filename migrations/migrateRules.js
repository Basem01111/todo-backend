const rolesModel = require('../src/features/admin/roles/roles.model');

async function migration() {
    const create = ['admin', 'user'];

    for (const item of create) {
      const existingRole = await rolesModel.findOne({ name: item });
      if (!existingRole) {
        const newRole = new rolesModel({ name: item });
        await newRole.save();
        console.log(`Created role: ${item}`);
      } else {
        console.log(`Role already exists: ${item}`);
      }
    }
}

module.exports = migration;