
const ip = require('ip').address();
const port = 3020;
module.exports = {
    build:{
        env:require('./prod.env'),
    },
    dev:{
        env:require('./dev.env'),
        port: port,
        proxyTable:{
            '/api':{
                target:`http://www.api.com`,
                changeOrigin: true, 
                pathRewrite:{
                    '^/api':'', 
                }
            }
        }
    }
};