/**
 * 覆盖默认的webpack配置，将ant-mobile变成按需引入的方式
 */
const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: 'css',
    }),
);