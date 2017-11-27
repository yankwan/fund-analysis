const request = require('superagent');
const cheerio = require('cheerio');
const sha256 = require('crypto').createHash('sha256');

/**
 * Compute Header field x-sign Value
 * @param {*} len 
 */
function getXSign(len = 32) {
    let curtime = new Date().getTime();
    let target = ((curtime * 1.01) + '').slice(0, 13);
    let digestTarget = sha256.update(target).digest('hex').toLocaleUpperCase();
    return curtime + digestTarget.slice(0, len);
}

/**
 * Fetch Eda fund List in Plan
 * @param {*} url 
 */
function getEdaFundList(url) {
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

// 异步请求回结果
(async () => {
    let funds = await getEdaFundList('https://qieman.com/pmdj/v2/long-win/plan');
    console.log(funds);
})();


// getEdaFundList('https://qieman.com/pmdj/v2/long-win/plan').then(result => {
//     console.log(result);
// })


/**
 * 获取指定基金的当前估值信息
 * @param {*} fundid 
 */
function getCurrentNetValueFrom(fundid) {
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

    header['Referer'] = 'http://fund.eastmoney.com/' + fundid + '.html';

    let url= 'http://fundgz.1234567.com.cn/js/' + fundid + '.js?rt=1511781761156';
    console.log(url);
    request.get(url)
        .set(header)
        .buffer(true)
        .end((err, res) => {
            console.log(typeof res.text);
            let jsonStr = res.text.match(/\{.*\}/g);
            let jsonObj = JSON.parse(jsonStr[0]);
            console.log(jsonObj);
        })
}

// getCurrentNetValueFrom("001064");

function getEdaFundDetail(fundId) {
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
    request.get(url)
        .set(header)
        .end((err, res) => {
            let jsonObj = JSON.parse(res.text);
            console.log(jsonObj);
        })
}

// getEdaFundDetail("003376");



