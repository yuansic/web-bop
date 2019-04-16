// 扩展脚本
import Vue from 'vue';
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(format) {
  var date = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length)
      );
    }
  }
  return format;
};

// 兼容写法 实现传统的四舍五入
Number.prototype.toFixedNew = function(len) {
  return Math.round(this * Math.pow(10, len)) / Math.pow(10, len).toFixed(len);
};

/** *********vue 过滤器拓展************/

/*
 * 千分位 过滤器
 * value 进参
 * precision  保留几位小数
 * separator分隔符    分隔符 默认为","
 */
Vue.filter('thousands', function(value, precision, separator) {
  // 判断是否为数字
  if (typeof value === 'number' && !isNaN(value)) {
    var num = Number(value);
    if (typeof precision === 'number' && !isNaN(precision)) {
      num = num.toFixedNew(precision).toString();
    } else {
      num = num.toString();
    }
    var parts = num.split('.');
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
    return parts.join('.');
  }
  return value;
});
/*
 * 数字 过滤器
 * value 进参
 * precision  保留几位小数
 */
Vue.filter('toFixed', function(value, precision) {
  // 判断是否为数字
  if (typeof value === 'number' && !isNaN(value)) {
    var num = Number(value);
    if (typeof precision === 'number' && !isNaN(precision)) {
      num = num.toFixedNew(precision);
    }
    return num.toString();
  }
  return value;
});

/*
 * 时间差转换 倒计时 过滤器
 * value 进参(相差的毫秒数)
 */
Vue.filter('timesdiff', function(value) {
  if (value == '' || value == 0) {
    return '00:00:00';
  }
  var hour = Math.floor(value / 3600);
  var minute = Math.floor((value - hour * 3600) / 60);
  var second = Math.floor(value - hour * 3600 - minute * 60);
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  return hour + ':' + minute + ':' + second;
});

/*
 * 时间截取 过滤器
 * value 进参
 * type 截取类型 默认为1
 * type 1：2007-07-15 12:00:00  转换为 2007-07-15
 * type 2：2007-07-15 12:00:00  转换为 2007-07-15 12:00
 * type 3：2007-07-15 12:00:00  转换为 12:00
 */
Vue.filter('timesplit', function(value, type) {
  type = type || 1;
  if (value && value != null && value != 'null') {
    var arr1 = value.split(' ');
    var arr2 = arr1[1].split(':');
    if (type == 2) {
      return arr1[0] + ' ' + arr2[0] + ':' + arr2[1];
    } else if (type == 3) {
      return arr2[0] + ':' + arr2[1];
    } else {
      return arr1[0];
    }
  } else {
    return '';
  }
});

/*
时间戳转普通日期
*/
Vue.filter('stamp2TextDate', function(value) {
  if (!value) return '';
  var date = new Date(value);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
});

/*
时间戳转普通日期(full)
*/
Vue.filter('stamp2TextDateFull', function(value) {
  if (!value) return '';
  var date = new Date(value);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  h = h < 10 ? '0' + h : h;
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;
  return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec;
});

/*
 * 银行卡4位分割 过滤器
 *  */
Vue.filter('banksplit', function(value) {
  if (!value) return '';
  if (/\S{5}/.test(value)) {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
  } else {
    return value;
  }
  // return value.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
});

/*
 * 银行卡截取后4位
 *  */
Vue.filter('banksubstr', function(value) {
  if (!value) return '';
  return value.substr(value.length - 4);
});

/*
 * 身份证隐藏
 * frontLen：前面保留位数
 * endLen：后面保留位数
 *  */
Vue.filter('idcard', function(value, frontLen, endLen) {
  frontLen = frontLen || 4;
  endLen = endLen || 4;
  if (value) {
    var len = value.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return value.substring(0, frontLen) + xing + value.substring(value.length - endLen);
  } else {
    return '';
  }
});

// 金额大写过滤器
Vue.filter('bigMoney', function(value) {
  if (value == '' || value == 0) {
    return '零元整';
  }
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  var head = value < 0 ? '欠' : '';
  value = Math.abs(value);
  var s = '';
  for (var m = 0; m < fraction.length; m++) {
    s += (digit[Math.floor(value * 10 * Math.pow(10, m)) % 10] + fraction[m]).replace(/零./, '');
  }
  s = s || '整';
  value = Math.floor(value);
  for (var i = 0; i < unit[0].length && value > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && value > 0; j++) {
      p = digit[value % 10] + unit[1][j] + p;
      value = Math.floor(value / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
});

/*
 * 判断IE浏览器版本
 */
function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion === 7) {
      return 7;
    } else if (fIEVersion === 8) {
      return 8;
    } else if (fIEVersion === 9) {
      return 9;
    } else if (fIEVersion === 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1; //不是ie浏览器
  }
}
const tag = IEVersion();
window.IEtag = tag;
if (tag !== -1 && tag !== 'edge') {
  console.log('IE' + tag);
  if (tag < 10) {
    window.location.href = './static/browser.html';
  }
}
