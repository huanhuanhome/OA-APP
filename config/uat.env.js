'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    API_ENDPOINT: '"https://bimsoauat.bimz.cn/bimsoa/rest"', // uat环境
})
