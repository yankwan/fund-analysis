/**
 * 获取天天基金相关信息路由
 */
const express = require('express');
const request = require('superagent');

const wrap = require('../helper/util').wrap;
const resErrorHandle = require('../helper/util').resErrorHandle;
const statusCd = require('../helper/config').statusCd;

// Init Router
const router = express.Router();

router.get('/currentNetValue/:fundId', wrap(async (req, res) => {
    const data = await getCurrentNetValueFrom(req.params.fundId);
    resErrorHandle(res, data, "can't get the current fund net value");
    res.json({
        status: statusCd.success,
        message: 'success',
        data: data
    });
}))


/**************************************************/
/***************** Private Function ***************/
/**************************************************/

/**
 * 获取指定基金的当前估值信息
 * @param {*} fundId 
 */
function getCurrentNetValueFrom(fundId) {
    const header = {
        "Accept" : "*/*", 
        "Accept-Encoding" : "gzip, deflate",
        "Accept-Language" : "zh-CN,zh;q=0.9",
        "Cache-Control" : "no-cache",
        "Connection" : "keep-alive",
        "Host" : "fundgz.1234567.com.cn",
        "Pragma" : "no-cache",
        "Referer" : "",
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }

    header['Referer'] = 'http://fund.eastmoney.com/' + fundId + '.html';

    let url= 'http://fundgz.1234567.com.cn/js/' + fundId + '.js?rt=' + new Date().getTime();

    return new Promise((resolve, reject) => {
        request.get(url)
            .set(header)
            .buffer(true)
            .end((err, res) => {
                if (err) reject("Error: get current net value by fund id: " + fundId);
                let jsonStr = res.text.match(/\{.*\}/g);
                let jsonObj = JSON.parse(jsonStr[0]);
                resolve(jsonObj);
            })
    })
}


module.exports = router;