module.exports = {
  async rewrites() {
    return [
      // Do not rewrite API routes
      {
        source: '/game/:any*',
        destination: '/game/',
      },
    ];
  },
};
