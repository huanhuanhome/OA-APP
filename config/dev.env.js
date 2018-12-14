'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_ENDPOINT: '"http://bimsoa.bimz.cn:9999/bimsoa/rest"', // 开发环境

})
