/**
 * 获取Eda相关信息路由
 */
const express = require('express');
const request = require('superagent');
const _ = require("underscore");
const getXSign = require('../helper/util').getXSign;
const wrap = require('../helper/util').wrap;
const resErrorHandle = require('../helper/util').resErrorHandle;
const statusCd = require('../helper/config').statusCd;

// Init Router
const router = express.Router();

// Get Eda Fund List
router.get('/fundList', wrap(async (req, res, next) => {
    const url = 'https://qieman.com/pmdj/v2/long-win/plan';
    const fundList = await getEdaFundList(url);
    
    resErrorHandle(res, fundList, "can't get the fund list data");
    res.json({
        status: statusCd.success,
        message: 'success',
        data: fundList
    });
}));

// Get Eda Specify Fund Detail
router.get('/fundDetail/:fundId', wrap(async (req, res, next) => {
    const fundDetail = await getEdaFundDetail(req.params.fundId);

    resErrorHandle(res, fundDetail, "can't get the fund detail! fund code: " + req.params.fundId);
    res.json({
        status: statusCd.success,
        message: 'success',
        data: fundDetail
    });
}));

/**************************************************/
/***************** Private Function ***************/
/**************************************************/

/**
 * 获取Eda计划内基金列表
 */
const getEdaFundList = (url) => {
    const header = {
        "Accept" : "application/json",
        "Accept-Encoding" : "gzip, deflate, br",
        "Accept-Language" : "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
        "Connection" : "keep-alive",
        "Host" : "qieman.com",
        "Referer" : "https://qieman.com/longwin/index",
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36",
        "x-sign" : ""
    }
    // 设置x-sign值
    header['x-sign'] = getXSign();

    const funds = []; // 存储计划内基金代码
    let cash = null; // 存储现金部分

    // 请求Eda计划基金列表
    return new Promise((resolve, reject) => {
        request.get(url)
        .set(header)
        .end((err, res) => {
            if (err) reject("Error: Get Eda Fund List");
            // 计划基金部分
            const composition = JSON.parse(res.text).composition;
            for (let obj of composition) {
                if (obj.fund) funds.push(obj.fund.fundCode);
                else cash = obj;
            }
            // console.log(funds);
            resolve(funds);
        })
    })
}

/**
 * 获取Eda计划内指定基金的详细信息
 */
const getEdaFundDetail = (fundId) => {
    const header = {
        "Accept" : "application/json",
        "Accept-Encoding" : "gzip, deflate, br",
        "Accept-Language" : "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
        "Connection" : "keep-alive",
        "Host" : "qieman.com",
        "Referer" : "",
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36",
        "x-sign" : ""
    }

    header["Referer"] = "https://qieman.com/longwin/funds/" + fundId;
    header["x-sign"] = getXSign();

    let url = 'https://qieman.com/pmdj/v2/long-win/plan/history?fundCode=' + fundId;
    return new Promise((resolve, reject) => {
        request.get(url)
            .set(header)
            .end((err, res) => {
                if (err) reject("Error: Get Eda Fund Detail by FundId: " + fundId);
                let jsonObj = JSON.parse(res.text);
                resolve(jsonObj);
            })
    })
}


module.exports = router;