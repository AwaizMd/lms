const Sequelize = require("sequelize").Sequelize;
const env = require("../config/env").db;
const bcrypt = require("bcrypt");

let sequelize;

module.exports = () => {
  connect = () => {
    let seq = new Sequelize(env.name, env.cred.username, env.cred.password, {
      dialect: env.dialect,
      dialectOptions: {
        supportBigNumbers: true,
      },
      logging: env.logging,
      host: env.host,
      port: env.port,
      define: {
        timestamps: false,
        charset: env.define.charset,
        collate: env.define.collate,
        hooks: {
          beforeBulkCreate(rec, opts) {
            let creationTime = new Date().getTime();
            for (let i in rec) {
              rec[i].createdAt = creationTime;
              rec[i].updatedAt = creationTime;
            }
          },
          beforeCreate(rec, opts) {
            console.table(rec.dataValues);
            rec.dataValues.createdAt = new Date().getTime();
            rec.dataValues.updatedAt = rec.dataValues.createdAt;
          },
          beforeUpdate: function (rec, options) {
            console.log(rec);
            rec.dataValues.updatedAt = new Date().getTime();
          },
          beforeBulkUpdate: function (rec, options) {
            console.log(rec);
            rec.attributes.updatedAt = new Date().getTime();
            rec.fields.push("updatedAt");
          },
        },
        freezeTableName: true,
      },
      pool: {
        acquire: env.pool.acquire,
        idle: env.pool.idle,
        max: env.pool.max,
        min: env.pool.min,
      },
    });
    sequelize = seq;
    return sequelize;
  };

  connection = () => connect();
  sequel = () => sequelize;

  opts = () => {
    let passwordHooks = {
      hooks: {
        beforeCreate(rec, opt) {
          rec.dataValues.createdAt = new Date().getTime();
          rec.dataValues.updatedAt = rec.dataValues.createdAt;
          let password = rec.dataValues.password;
          if (password) rec.dataValues.password = bcrypt.hashSync(password, 0);
        },
        beforeUpdate: function (rec, options) {
          rec.dataValues.updatedAt = new Date().getTime();
          let password = rec.dataValues.password;
          let prevPassword = rec._previousDataValues.password;

          if (password !== prevPassword) {
            rec.dataValues.password = bcrypt.hashSync(password, 0);
          }
        },
        beforeBulkUpdate: function (rec, options) {
          rec.attributes.updatedAt = new Date().getTime();
          let password = rec.attributes.password;

          if (password != null) {
            rec.attributes.password = bcrypt.hashSync(password, 0);
            rec.fields.push("password");
          }

          rec.fields.push("updatedAt");
        },
      },
      timestamps: false,
      freezeTableName: true,
    };

    // If there are different hooks required, need to recreate them.

    const Sequelize = require("sequelize");

    const stamps = {
      createdAt: {
        type: Sequelize.DATE,
      },

      updatedAt: {
        type: Sequelize.DATE,
      },
    };

    return {
      sequelize,
      passwordHooks,
      stamps,
    };
  };

  return {
    connection,
    connect,
    sequel,
    opts,
  };
};
