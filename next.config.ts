import type { NextConfig } from "next";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
  // Use webpack for builds — CesiumJS requires webpack plugins to copy static assets
  // (Turbopack doesn't support webpack plugins)
  turbopack: {},

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Copy Cesium static assets to public/cesium
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.join(
                __dirname,
                "node_modules/cesium/Build/Cesium/Workers"
              ),
              to: path.join(__dirname, "public/cesium/Workers"),
            },
            {
              from: path.join(
                __dirname,
                "node_modules/cesium/Build/Cesium/ThirdParty"
              ),
              to: path.join(__dirname, "public/cesium/ThirdParty"),
            },
            {
              from: path.join(
                __dirname,
                "node_modules/cesium/Build/Cesium/Assets"
              ),
              to: path.join(__dirname, "public/cesium/Assets"),
            },
            {
              from: path.join(
                __dirname,
                "node_modules/cesium/Build/Cesium/Widgets"
              ),
              to: path.join(__dirname, "public/cesium/Widgets"),
            },
          ],
        })
      );

      // Define CESIUM_BASE_URL for Cesium's worker loading
      const webpack = require("webpack");
      config.plugins.push(
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify("/cesium"),
        })
      );
    }

    return config;
  },
};

export default nextConfig;
