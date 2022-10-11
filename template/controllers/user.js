`${opts.esm ? "import {models} from '../database/connect'" : "const { models } = require('../database/connect')"};

const { User } = models;

const getAllUsers = () => User.findAll();
const getUser = id => User.findByPK(id);
const createUser = body => User.create(body);
const updateUser = (id, body) => User.update(body, { where: { id } });
const deleteUser = id => User.destroy({ where: { id } });

${
  opts.esm
    ? 'module.exports = { getUser, getAllUsers, createUser, updateUser, deleteUser };'
    : 'export default  { getUser, getAllUsers, createUser, updateUser, deleteUser };'
}`;
