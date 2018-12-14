'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    API_ENDPOINT: '"http://bimsoats.bimz.cn:9999/bimsoa/rest"', // 测试环境
})
