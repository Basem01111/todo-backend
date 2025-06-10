const usersModel = require('../src/shared/models/users.model');
const rolesModel = require('../src/features/admin/roles/roles.model');
const bcrypt = require("bcrypt");

async function migration() {
    const role = await rolesModel.findOne({name:'admin'});

    const password = await bcrypt.hash("123456", 10);

    const create = [
        {
                name: "admin",
                email: "admin@admin.com",
                phone: "11111111",
                password: password,
                role: role._id,
        }
    ];

    for (const item of create) {
      const existingRole = await usersModel.findOne({ email: item.email });
      if (!existingRole) {
        const newRole = new usersModel(item);
        await newRole.save();
        console.log(`Created Admin: ${item.email}`);
      } else {
        console.log(`Admin already exists: ${item.email}`);
      }
    }
}

module.exports = migration;