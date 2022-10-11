`${esm ? "import bcrypt from 'bcrypt';" : "const bcrypt = require('bcrypt')"};

// it can go to a different file
// if extra authentication features are provided
const generatePasswordHash = password => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
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
          }
        },
        isEmail: {
          msg: 'It is not a valid email'
        }
      },
      unique: {
        args: true,
        msg: 'The email is already in use'
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
        provider: {
          where: {
            userType: 'provider'
          }
        },
        customer: {
          where: {
            userType: 'customer'
          }
        },
        operator: {
          where: {
            userType: 'operator'
          }
        }
      }
    }
  );

  User.beforeValidate(async data => {
    Object.keys(dataValues).forEach(key => {
      if (data[key] === '') {
        Object.assign(data, { [key]: null });
      }
    });
  });

  User.beforeCreate(async data => {
    const password = await generatePasswordHash(data.password);
    const lastLogin = new Date();
    Object.assign(data, { password, lastLogin });
  });

  User.beforeUpdate(async data => {
    if (data.password && data.changed('password')) {
      const password = await generatePasswordHash(data.password);
      Object.assign(data, { password });
    }
  });

  User.associate = models => {
    // you can create associations with other models here
    // See https://sequelize.org/docs/v6/core-concepts/assocs/
  };

  return User;
};

${esm ? 'export default user;' : 'module.exports = user'};
`;
