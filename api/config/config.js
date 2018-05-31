require('dotenv').config();

const CONFIG = {};

CONFIG.app = process.env.APP || 'development';
CONFIG.port = process.env.APP_PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongo';
CONFIG.db_host = process.env.DB_HOST || 'localhost'; // or default service
CONFIG.db_port = process.env.DB_PORT || '27017';
CONFIG.db_name = process.env.MONGODB_APPLICATION_DATABASE || 'name';
CONFIG.db_user = process.env.MONGODB_APPLICATION_USER || 'root';
CONFIG.db_password = process.env.MONGODB_APPLICATION_PASS || 'db-password';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_change_this';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';
