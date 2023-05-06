const User = require('../models/Users')
const Role = require('../models/Roles')
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config');
const { validationResult } = require('express-validator');

const generateToken = async (user_id, role_id) => {
  const info = {
    user_id,
    role: await Role.findOne({ where: { id: role_id } })
  }

  return jwt.sign(info, jwtKey, { expiresIn: '24h' });
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // check for existed login
    const user = await User.findOne({ where: { login: login } })
      .catch(err=>console.log(err)); 

    if(!user) {
      res.status(400).json({ message: `User ${login} not exist`, login: login});
    }

    const validPass = bcrypt.compareSync(password, user.password);
    if(!validPass) {
      res.status(400).json({ message: 'Password is incorrect' });
    }

    const role = await Role.findOne({ where: { id: user.role_id } })

    const token = await generateToken(user.id, user.role_id);

    return res.status(200).json({token: token, user: user, role: role});

  } catch(e) {
    res.status(500).json({ message: 'Registration error', error: e });
  }
};

exports.registration = async (req, res) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ message: 'Registartion validation error', errors: errors });
    }

    const { login, password } = req.body;

    // check for existed login
    const tempUser = await User.findOne({ where: { login: login } })
      .catch(err=>console.log(err)); 

    if(tempUser) {
      res.status(400).json({ message: 'User login already exists', login: login});
    }

    //get hash password
    const hashPass = bcrypt.hashSync(password, 5);
    //get role - USER
    const userRole = await Role.findOne({ where: { name: { [Op.eq]: 'ADMIN' } } });

    //create User
    const newUser = await User.create({ login: login, role_id: userRole.id, password: hashPass})
      .catch((err)=>{
        res.status(500).json({message: 'User creating error', error: err});
      });

    // successfull response
    return res.json({message: 'User added successfully', user: newUser });
  } catch(e) {
    console.log(e);
    res.status(500).json({message: 'Registration error', error: e});
  }
};
