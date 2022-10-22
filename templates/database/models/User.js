`${opts.esm ? "import bcrypt from 'bcrypt';" : "const bcrypt = require('bcrypt');"}

// it can go to a different file
// if extra authentication features are provided
const generatePasswordHash = password => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

const User = (sequelize, DataTypes) => {
  const _User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('email', value.toLocaleString());
        },
        validate: {
          notNull: {
            msg: 'Email not provided'
          },
          isEmail: {
            msg: 'It is not a valid email'
          }
        },
        unique: {
          args: true,
          msg: 'The email is already in use'
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return null;
        },
        validate: {
          notEmpty: true,
          len: {
            args: [8, 255],
            msg: 'Invalid password length'
          }
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      paranoid: true,
      defaultScope: {
        returning: true
      },
      scopes: {
        deleted: {
          where: {
            deleted: true
          }
        },
        activeUsers: {
          where: {
            status: 'active'
          }
        }
      }
    }
  );

  _User.beforeValidate(async data => {
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        Object.assign(data, { [key]: null });
      }
    });
  });

  _User.beforeCreate(async data => {
    const password = await generatePasswordHash(data.password);
    const lastLogin = new Date();
    Object.assign(data, { password, lastLogin });
  });

  _User.beforeUpdate(async data => {
    if (data.password && data.changed('password')) {
      const password = await generatePasswordHash(data.password);
      Object.assign(data, { password });
    }
  });

  _User.associate = models => {
    // you can create associations with other models here
    // See https://sequelize.org/docs/v6/core-concepts/assocs/
  };

  return _User;
};

${opts.esm ? 'export default User' : 'module.exports = User'};`;
