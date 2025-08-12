// config/index.js
import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables from .env file
dotenv.config();

// Define a validation schema for your environment variables
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().required().description('MongoDB connection URI is required'),
  JWT_SECRET: Joi.string().required().description('JWT secret is required for signing tokens'),
  JWT_EXPIRE: Joi.string().default('1d'),
  
  // Email configuration
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
  FROM_EMAIL: Joi.string().email().required(),
  FROM_NAME: Joi.string().required(),

  // Frontend URL for generating reset links
  FRONTEND_URL: Joi.string().uri().required(),
}).unknown(); // .unknown() allows for other environment variables not defined here

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

// Export the validated and typed configuration
export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRE,
  },
  email: {
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    auth: {
      user: envVars.EMAIL_USER,
      pass: envVars.EMAIL_PASS,
    },
    from: `"${envVars.FROM_NAME}" <${envVars.FROM_EMAIL}>`,
  },
  frontendUrl: envVars.FRONTEND_URL,
};