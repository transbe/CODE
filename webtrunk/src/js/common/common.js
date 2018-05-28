/**
 * @file
 * @author  lizhenzhen
 * @desc 阴保公共js
 * @date  2017-03-21
 * @last modified by lizhenzhen
 * @last modified time 2017-06-14 14:06:47
 */

var MSG_DISPLAY_TIME = 2000; // 设置layer弹框的延迟时间
var NET_ERROR_MSG = "网络出错啦！"; // 设置ajax请求error回调函数的提示信息
var SELECT_ERROR_MSG = "下拉菜单数据加载出错！"; // 下拉菜单数据加载出错提示信息

var rootPath = getRootPath();

var appCode = "corrosionengineer"; //阴保管家appCode
var appId = "90748268-321e-11e7-b075-001a4a1601c6"; //阴保管家appId
var expertsOrgId = "428093b4-fadd-4f43-818e-f9bac3eb677d"; //专家所属组织机构ID
var ZYAXenterpriseId = "b909b469-f7e6-4c98-85a0-98e1c2b54a4e"; //中盈安信企业ID
var expertRoleId = "993132df-9972-40eb-83f0-47e0f470f123"; //阴保专家角色id
var operatorRoleId = "f80df071-cb48-4997-b1e3-32d8f6d42315"; //阴保管家运营人员角色id

var cpengineerId = "993132df-9972-40eb-83f0-47e0f470f912"; //阴保工程师ID
var detectionPersonnelId = "993132df-9972-40eb-83f0-47e0f470f992"; //阴保工程师ID

// var appCode = "xxws";
// var appId = "0c753fdd-5f54-4b24-bf50-491ea5eb1a84";

/**
 * @desc 获取url参数
 * @param {String} paramName  想要获取的参数名字
 * @param {String} url   访问地址，可以为空：为空时默认为当前url
 */
function getParameter(paramName, url) {
    var seachUrl = window.location.search.replace("?", "");
    if (url != null) {
        var index = url.indexOf('?');
        url = url.substr(index + 1);
        seachUrl = url;
    }
    var ss = seachUrl.split("&");
    var paramNameStr = "";
    var paramNameIndex = -1;
    for (var i = 0; i < ss.length; i++) {
        paramNameIndex = ss[i].indexOf("=");
        paramNameStr = ss[i].substring(0, paramNameIndex);
        if (paramNameStr == paramName) {
            var returnValue = ss[i].substring(paramNameIndex + 1, ss[i].length);
            if (typeof(returnValue) == "undefined") {
                returnValue = "";
            }
            return returnValue;
        }
    }
    return "";
}

/**
 * @desc 获取系统根路径
 */
function getRootPath() {
    // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    // 获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    // 获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
    //return (localhostPaht + projectName + "/");
    return (localhostPaht);
}


/**
 * @desc 根据传入的容器的id设置table的高度
 * @param {String} containerId  容器的id
 */
function setTableHeight(containerId) {
    $(window).bind("resize", function() {
        $("#" + containerId).bootstrapTable("resetView", { height: getTableHeight() });
    });

    setTimeout(function() {
        $("#" + containerId).bootstrapTable("resetView", { height: getTableHeight() });
    }, 17)
}


/**
 * @desc 功能描述：获取框架中table的高度，使其与页面自适应
 */
function getTableHeight() {
    var contentH;
    var winH = $(window).height(),
        bodyPaddingTop = parseInt($(".content-box").css("paddingTop")),
        bodyPaddingBottom = parseInt($(".content-box").css("paddingBottom"));
    var headH = $(".content-header").outerHeight();
    var headMarginTop = parseInt($(".content-header").css('marginTop')),
        headMarginBottom = parseInt($(".content-header").css('marginBottom')),
        contentPaddingTop = parseInt($(".content-body").css('paddingTop')),
        contentPaddingBottom = parseInt($(".content-body").css('paddingBottom'));

    contentH = winH - (bodyPaddingTop + bodyPaddingBottom) - (headH + headMarginTop + headMarginBottom) - (contentPaddingTop + contentPaddingBottom);

    return contentH;
}



/**
 * @desc 取消toobar点击按钮后选中状态
 * @param {String} buttonID  按钮的id
 */
function uncheck(buttonID) {
    $("#" + buttonID).blur(function() {})
    $("#" + buttonID).mouseleave(function() {
        $("#" + buttonID).trigger("blur")
    })
}

/**
 * @desc 判断是否非空
 * @param {String} param 
 */
function isNull(param) {
    if (param == "" || param == null || param == undefined) {
        return true;
    } else {
        return false;
    }
}


/**
 * @namespace  定义一个全局的mCustomScrollbar滚动条配置
 */
var mCustomScrollbarOptions = {
    theme: "3d-dark", // 选用3d-dark
    scrollButtons: {
        enable: true, //设置是否显示按钮
    }
};

/**
 * @desc 修改bootstrapDatetimepicker插件的默认语言设置
 */
(function($) {
    if ($.fn.datetimepicker) {
        $.fn.datetimepicker.defaults = {
            language: 'zh-CN',
        };
    }
}(jQuery));

/**
 * @desc 修改bootstrapValidator插件的默认字体图标的设置
 */
(function($) {
    if ($.fn.bootstrapValidator) {
        $.fn.bootstrapValidator.DEFAULT_OPTIONS.feedbackIcons.invalid = "glyphicon glyphicon-remove";
        $.fn.bootstrapValidator.DEFAULT_OPTIONS.feedbackIcons.valid = "glyphicon glyphicon-ok";
        $.fn.bootstrapValidator.DEFAULT_OPTIONS.feedbackIcons.validating = "glyphicon glyphicon-refresh";
    }
}(jQuery));


/**
 * @desc 定义bootstrapTable插件项目的通用配置
 */
(function($) {
    if ($.fn.bootstrapTable) {
        // 更改表格默认设置
        $.fn.bootstrapTable.defaults.striped = true; // 表格条纹，斑马线
        $.fn.bootstrapTable.defaults.pagination = true; // 底部显示分页工具栏
        // $.fn.bootstrapTable.defaults.toolbar = "#toolbar"; // 表头工具栏
        $.fn.bootstrapTable.defaults.sidePagination = "server"; // 后台分页
        $.fn.bootstrapTable.defaults.clickToSelect = true; // 点击选中行
        $.fn.bootstrapTable.defaults.showRefresh = true; // 显示刷新按钮
        $.fn.bootstrapTable.defaults.cache = false; // table清除缓存，解决ie不刷新的问题
        // 更改表格列的默认设置
        $.fn.bootstrapTable.columnDefaults.align = "center";
        $.fn.bootstrapTable.columnDefaults.valign = "middle";
    }
}(jQuery));


/**
 * @desc 修改bootstrapSelect插件的默认显示条数设置
 */
// (function($) {
//     if ($.fn.selectpicker) {
//         $.fn.selectpicker.defaults.size = "10"
//     }
// }(jQuery));


// 控制鼠标按钮点击事件的样式
$(".clear-btn").bind("mouseenter", function() {
    $(this).css({ background: "#f4b836", borderColor: "#f4b836" });
}).bind("click", function() {
    $(this).css({ background: "#f4b836", borderColor: "#f4b836" });
});
$(".search-btn").bind("mouseenter", function() {
    $(this).css({ background: "#2e8ded", borderColor: "#2e8ded" });
}).bind("click", function() {
    $(this).css({ background: "#2e8ded", borderColor: "#2e8ded" });
});

// 取消点击bootstrapTabel刷新按钮后的状态
setTimeout(function() {
    $(".pull-right.columns-right button[name='refresh']").blur(function() {});
    $(".pull-right.columns-right button[name='refresh']").mouseleave(function() {
        $(this).trigger("blur")
    });
}, 200);


//取消ajax请求的缓存
$.ajaxSetup({ cache: false });

/**
 * @desc 跳转系统URL方法
 * @author zhangyi
 * @method openWindowURL
 * @param {String} enterpriseId 企业ID
 */
function openWindowURL(enterpriseId) {
    //var url = "http://192.168.100.63/index.html"; //63跳转
    var url = "http://localhost/index.html"; //本地跳转
    //var url = "http://192.168.30.240:80/index.html";//64跳转
    //var url = "https://www.x-pipeline.com/index.html";//阿里跳转
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    var token = lsObj.getLocalStorage('token');
    // console.log(user.objectId+"===")
    url += "?token=" + token + "&tmenpi=" + enterpriseId;
    window.open(url);
}

// var links = document.getElementsByTagName("link"); //得到所有的link标签
// var csslink = links[links.length - 1]; //然后找到你需要修改的那个link标签
// console.log(links);
// console.log(csslink);
// var href = csslink.getAttribute("href");
// console.log(href);

/**
 * @desc CSS换肤 
 */
function changePageStyle(url) {
    var currentTheme = lsObj.getLocalStorage('currentTheme');
    // console.log(currentTheme);
    switch (currentTheme) {
        case "0":
            url += ("/css/theme/default/skin.css");
            changeStyleSheet(url);
            break;
        case "1":
            url += ("/css/theme/blue/skin.css");
            changeStyleSheet(url);
            break;
        case "2":
            url += ("/css/theme/bgpic/skin.css");
            changeStyleSheet(url);
            break;
        case "3":
            url += ("/css/theme/lightness/skin.css");
            changeStyleSheet(url);
            break;
        default:
            url += ("/css/theme/default/skin.css");
            changeStyleSheet(url);
            break;
    }
}

function changeStyleSheet(url) {
    // console.log(url);
    var mylinks = document.getElementsByTagName("link");
    for (var i = 0; i < mylinks.length; i++) {
        if (mylinks[i].className == "theme") {
            mylinks[i].href = url;
        }
    }
}



/**
 * @desc 向导
 */
function firstLogin() {
    var loginNum = parseInt(lsObj.getLocalStorage('loginNum'));
    // console.log(loginNum);
    // loginNum = 0;
    if (loginNum == 0) {
        setTimeout(function() {
            bootstro.start();
        }, 50)
    }
};

$(".guide-box").click(function() {
    bootstro.start();
});

/**
 * @desc 针对表单提交时，表单中数据字段过多，将from表单的字段与属性转化成json
 * @ 转化成json后，按照正常post数据提交。
 * @autor yangyuanzhu
 * @date 2017年7月28日 17:20:26
 */
$.fn.serializeToJson = function () {  
    var o = {};  
    var a = this.serializeArray();  
    $.each(a, function () {  
        if (o[this.name]) {  
            if (!o[this.name].push) {  
                o[this.name] = [o[this.name]];  
            }  
            o[this.name].push(this.value || '');  
        } else {  
            o[this.name] = this.value || '';  
        }  
    });  
    return o;  
};  




/**
 * @desc 获取单位
 * @param fileName 要查询单位字段的名字
 */
function getUnit(fileName){
    // console.log(fileName);
    // var defaultUnitArr = JSON.parse(lsObj.getLocalStorage("defaultUnitArr"));
    // for(var tempItems in defaultUnitArr){
    //     // console.log(defaultUnitArr[tempItems]);
    //     // console.log(defaultUnitArr[tempItems].fieldName);
    //     if(defaultUnitArr[tempItems].fieldName == fileName){
    //         return "("+defaultUnitArr[tempItems].defaultUnit+")"
    //     }
    // }

    var jsonData = JSON.parse(lsObj.getLocalStorage("defaultUnitArr")); 
    var arrRes = Enumerable.From(jsonData).Where("x=>x.fieldName=='" + fileName + "'").ToArray(); //使用linq查询返回json中的value，只需要第一个
    if(arrRes == undefined || arrRes.length == 0){
        return "";
    }
    var viewUnit = arrRes[0].defaultUnit;
    if (!isNull(viewUnit)) {
        return "("+viewUnit+")";
    }else{
        return "";
    }
}


/**
 * @desc 在字符串指定位置插入
 * @param str表示原字符串变量，flg表示要插入的字符串，sn表示要插入的位置
 */

function insert_flg(str,flg,sn){
    var newstr="";
    var tmp1=str.substring(0, sn);
    var tmp2=str.substring(sn, str.length);
    newstr = tmp1 + flg + tmp2;
    return newstr;
}
