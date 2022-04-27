module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/model": {
        target: "http://localhost:5000/",
      },
    },
  },
};
