const { database } = require('./config');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  database.database,
  database.login, 
  database.password, 
  {
    dialect: database.type,
    host: database.address
  }
);

// sequelize.sync({ force: true })
sequelize.sync()
  .then((result)=>{
    //console.log(result);
  })
  .catch((err)=> {
    console.log('sequelize error', err)
  });

module.exports = sequelize;