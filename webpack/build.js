const getConfig = require('./config.js');
const webpack = require('webpack');
const start = new Date().getTime();
webpack(getConfig({ env: 'production' }), (err, stats) => {
  if (err) {
    throw err;
  }
  let totalSize = 0;
  const distFiles = [];
  const end = new Date().getTime();
  if (!stats.hasErrors()) {
    const { assets, warnings, errors } = stats.toJson();
    // 输出编译汇报，如：
    assets.forEach(asset => {
      const size = Number((asset.size / 1000).toFixed(2));
      if (
        /\.(js|json|md|html|css|png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/.test(
          asset.name
        )) {
        totalSize = asset.size + totalSize;
        console.log(
          `/dist/${asset.name}`,
          `（${size}kb）`
        );
        distFiles.push({
          name: asset.name,
          size: size
        });
      }
    });
    console.log('\n');
    console.log(
      '✔ 编译产物大小：',
      `${Number((totalSize / 1000 / 1000).toFixed(2))}M`,
    );
  }

  const { errors } = stats.toJson();
  if (stats.hasErrors()) {
    console.log(errors.map(err => err.message));
  }

  console.log(
    "✔ 编译所用时长：",
    `${Number(((end - start) / 1000).toFixed(2))}s`,
  );
});
