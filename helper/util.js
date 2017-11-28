// const sha256 = require('crypto').createHash('sha256');

const _ = require('underscore');
const statusCd = require('./config').statusCd;

/**
 * 封装async/await error handle
 */
const wrap = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};

/**
 * 获取Header头部x-sign字段值
 */
const getXSign = (len = 32) => {
    let curtime = new Date().getTime();
    let target = ((curtime * 1.01) + '').slice(0, 13);
    let digestTarget = require('crypto').createHash('sha256').update(target).digest('hex').toLocaleUpperCase();
    return curtime + digestTarget.slice(0, len);
};

/**
 * 处理错误请求值
 */
const resErrorHandle = (res, result, errorMessage = "Error") => {
    if (_.isNull(result) || _.isUndefined(result)) {
        res.json({
            status: statusCd.failure,
            message: errorMessage
        });
    }
}

module.exports.getXSign = getXSign;
module.exports.wrap = wrap;
module.exports.resErrorHandle = resErrorHandle;