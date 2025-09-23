import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import omnifaceEnvPlugin from "./app/omnicore/plugins/omniface-vite-plugin";
import dotenv from "dotenv";
import AutoImport from "unplugin-auto-import/vite";
import viteCompression from "vite-plugin-compression";
import strip from "@rollup/plugin-strip"; // Optional, for removing console/debug
import UnoCSS from 'unocss/vite'
import app from "./app/omnicore/config/app";

// Load custom env config
dotenv.config({ path: "./omniface.cfg" });

export default defineConfig({
  base: "/",

  publicDir: fileURLToPath(new URL("./storage", import.meta.url)),

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        // Optional: strip out large sourcemaps for performance
        // assetFileNames: assetInfo => {
        //   if (/\.css$/.test(assetInfo.name)) return 'assets/[name]-[hash].css';
        //   return 'assets/[name]-[hash].[ext]';
        // }
      },
      plugins:
        app.env === "production"
          ? [
              strip({
                include: ["**/*.js", "**/*.ts", "**/*.vue"],
                functions: ["console.*", "debug", "alert"],
              }),
               UnoCSS(), // 🔥 handles purge automatically
            ]
          : [],
    },
  },

  define: {
    "import.meta.env.VITE_SAFE_ROUTES": JSON.stringify(
      process.env.VITE_SAFE_ROUTES || ""
    ),
  },

  optimizeDeps: {
    include: [
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/vue-fontawesome",
    ],
  },

  plugins: [
    vue(),
    app.pwa.enabled ? VitePWA(app.pwa) : undefined,
    vueDevTools(),
    omnifaceEnvPlugin(),
    AutoImport({
      imports: [
        "vue",
        {
          from: "~/omnicore/helpers/useApi",
          imports: ["useApi"],
        },
      ],
    }),

    // 🔥 Enable GZIP compression of assets
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false, // keep original files too
    }),

    // 🧹 Purge unused CSS this wa too aggressive had to mute it
    // purgeCss({
    //   content: [
    //     "./index.html",
    //     "./src/**/*.{vue,js,ts,jsx,tsx}",
    //     "./app/**/*.{vue,js,ts}",
    //     "./modules/**/*.{vue,js,ts}",
    //   ],
    //   dryRun: true,
    // }),
  ],

  resolve: {
    extensions: [".js", ".jsx", ".vue", ".ts", ".tsx"],
    alias: {
      "@": fileURLToPath(new URL("./modules", import.meta.url)),
      "~": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },

  server: {
    host: true,
    proxy: {
      "/v1": {
        target: process.env.API_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    cors: false,
  },
});
