import convict from 'convict';

const marketplaceConfig = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV'
  },
  mongo: {
    url: {
      doc: 'The Mongo connection URL',
      format: String,
      env: 'MONGO_URL',
      default: 'mongodb://localhost:27017/mooc-backend-dev'
    }
  }
});

marketplaceConfig.loadFile([__dirname + '/default.json', __dirname + '/' + marketplaceConfig.get('env') + '.json']);

export default marketplaceConfig;
