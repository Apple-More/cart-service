import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const API_GATEWAY_URL = process.env.API_GATEWAY_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
