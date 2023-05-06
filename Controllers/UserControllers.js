const User = require('../models/Users')
const Role = require('../models/Roles')

exports.getAll = async (req, res) => {
  try {
    await User.findAll({raw:true})
      .then(users=>{
        res.send(users)
      })
      .catch(err=>{
        res.status(500).json(err);
      });
  } catch(e) {
    res.status(500).json(e);
  }
};
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id) {
      res.status(400).json({'message': 'Id is not find, please add id.'})
    }
    await User.findOne({ where: { id: id } })
      .then(user=>{
        res.send(user)
      })
      .catch(err=>{
        res.status(500).json(err);
      });
  } catch(e) {
    res.status(500).json(e);
  }
};
exports.create = async (req, res) => {
  if(!req.body) return res.sendStatus(400).json({message: 'User info required'});
  try{
    const { login, password, role } = req.body;

    const tempUser = await User.findOne({ where: { login: login } });
    if(tempUser) {
      res.status(400).json({ message: 'User login already exists', login: login});
    }

    const userRole = await Role.findOne({ where: { name: { [Op.eq]: role } } });

    if(!userRole){
      res.status(400).json({ message: 'Role not found', role: role});
    }

    User.create({ login: login, role: userRole.id, password: password})
    .then((result)=>{
      res.json({message: 'User added successfully', response: result });
    })
    .catch(err=>console.log(err));

  } catch(e) {
    res.status(500).json(e);
  }
};
exports.delete = async (req, res) => {
  if(!req.params) return res.sendStatus(400).json({message: 'User info required'});
  try {
    const { id } = req.params;
    if(!id) {
      res.status(400).json({'message': 'Id is not find, please add id.'})
    }
    await User.destroy({where: {id: id} }).then((result) => {
      res.status(200).json({id: id, 'message': 'User Successfuly deleted', response: result})
    }).catch(err=>console.log(err));
  } catch(e) {
    res.status(500).json(e);
  }
};
exports.setRole = async (req, res) => {
  try {
    const { login, role } = req.body;
    if(!login || !role) {
      res.status(400).json({message: 'Login or role is not indicated.'})
    }
    const user = await User.findOne({ where: { login: login } });
    if (!user) {      
      res.status(400).json({message: `User ${login}, not found`})
    }
    const roleObj = await Role.findOne({ where: { name: role } });
    if (!roleObj) {      
      res.status(400).json({message: `Role ${login}, not found`})
    }

    user.role_id = roleObj.id;
    const response = await user.save();

    res.status(200).json({message: `Role for ${login} updated`, response: response});
  } catch(e) {
    res.status(500).json(e);
  }
};