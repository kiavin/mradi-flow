// vite-plugin-omniface-env.js
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export default function omnifaceEnvPlugin() {
  return {
    name: 'vite-plugin-omniface-env',
    config(config, { mode }) {
      const envPath = path.resolve(process.cwd(), 'omniface.cfg');

      if (fs.existsSync(envPath)) {
        const env = dotenv.parse(fs.readFileSync(envPath));

        const viteEnv = {};
        for (const key in env) {
          if (key.startsWith('VITE_')) {
            viteEnv[key] = JSON.stringify(env[key]);
          }
        }

        config.define = {
          ...config.define,
          ...viteEnv,
        };
      }
    },
  };
}