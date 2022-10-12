module.exports = {
  db: {
    cred: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    host: process.env.DB_HOST,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
    dialect: "mysql",
    ssl: "Amazon RDS",
    pool: {
      max: 5,
      min: 0,
      acquire: 300000,
      idle: 10000,
    },
    logging: console.log,
    port: 3306,
  },
  server: {
    url: "http://13.232.218.102:7068",
    notify_microService: process.env.NOTIFY_MICROSERVICE_URL,
  },
  passport: {
    jwt: {
      secretOrKey: "VeryStrongKey",
    },
  },
  jwt: {
    key: "Secret",
  },
  log: {
    secret_key: "654nkjseu743nfdg2bf",
  },
  twilio: {
    accountSid: process.env.accountSid,
    authToken: process.env.authToken,
    twilioNumber: process.env.number,
  },
  sms: {
    company_name: "LMS",
  },
  AWS: {
    BUCKET_NAME: process.env.BUCKET_NAME || '',
    REGION: process.env.REGION || '',
    MAX_KEY_LIMIT: process.env.MAX_KEY_LIMIT || '',
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
    S3_SECRET_KEY: process.env.S3_SECRET_KEY || '',
  },
};
