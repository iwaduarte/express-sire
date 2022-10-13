`${
  opts.esm
    ? "import SequelizeObject from '../database/connect.js'"
    : "const SequelizeObject = require('../database/connect')"
};

const { models } = SequelizeObject;
const { User } = models;

const getAllUsers = () => User.findAll();
const getUser = id => User.findByPK(id);
const createUser = body => User.create(body);
const updateUser = (id, body) => User.update(body, { where: { id } });
const deleteUser = id => User.destroy({ where: { id } });

${
  opts.esm
    ? 'export default  { getUser, getAllUsers, createUser, updateUser, deleteUser };'
    : 'module.exports = { getUser, getAllUsers, createUser, updateUser, deleteUser };'
}`;
