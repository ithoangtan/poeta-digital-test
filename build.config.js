module.exports = {
  apps: [
    {
      name: 'poeta-digital-test',
      script: 'server.js',
      max_memory_restart: '256M',
      ignore_watch: ['node_modules'],
      watch_options: {
        followSymlinks: false
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    }
  ]
};
