import { merge } from 'webpack-merge';
import { Configuration as WebpackConfig } from 'webpack';
import common from './webpack.common.config';

const prodConfig: WebpackConfig = {
  mode: 'production',
  output: {
    filename: '[name].[fullhash:8].bundle.js', // '[name].bundle.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: './',
  },
};

const config = merge<WebpackConfig>(common, prodConfig);

export default config;
