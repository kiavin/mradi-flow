import dotenv from 'dotenv';
import fs from 'fs';

//Load .env only if it exists
if (fs.existsSync('omniface.cfg')) {
    dotenv.config();
} else {
    console.warn('⚠️ Warning: config file not found! Using default settings.');
}

export const config = {
    API_BASE_URL: process.env.API_BASE_URL,
    CLI_NAME: process.env.CLI_NAME || 'Voyage CLI',
    VERSION: process.env.VERSION || '1.0.0',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ENABLE_INQUIRY: process.env.ENABLE_INQUIRY === 'true',
    FEATURE_FLAGS: {
        ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
        DEBUG_MODE: process.env.DEBUG_MODE === 'true',
        
    }
};
