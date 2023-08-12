import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { merge } from 'webpack-merge';
import { Configuration as WebpackConfig } from 'webpack';
import { Configuration as WebpackDevServerConfig } from 'webpack-dev-server';
import Dotenv from 'dotenv-webpack';

import common from './webpack.common.config';

type Configuration = WebpackConfig & {
  devServer?: WebpackDevServerConfig;
};

const devConfig: Configuration = {
  mode: 'development',
  plugins: [new Dotenv({
    path: './.env.development.local'
  }), new ReactRefreshWebpackPlugin()].filter(Boolean),
  devtool: 'inline-source-map', // eval-source-map
  devServer: {
    static: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    port: 3000,
    hot: true,
    open: true,
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
  },
};
const config = merge<Configuration>(common, devConfig);
export default config;