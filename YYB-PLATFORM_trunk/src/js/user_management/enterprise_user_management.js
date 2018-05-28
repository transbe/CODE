/**  
 * @file
 * @author: liangyuanyuan
 * @desc: 企业用户管理
 * @date: 2017-05-04
 * @last modified by: gaohui 
 * @last modified time: 2017-06-12 09:26:17
 */
var dateToday = "" //定义一个全局的日期变量
var currentPageNumber = "" //定义当前页码变量
var currentPageSize = "" //定义当前页面大小变量
var token = lsObj.getLocalStorage('token'); //获取token
$(function () {
    var date = new Date() //获取系统日期
    var year = date.getFullYear(); //获取年份
    var month = date.getMonth() + 1 + ""; //获取月
    var days = date.getDate() + ""; //获取日
    month = month.length == 1 ? "0" + month : month;
    days = days.length == 1 ? "0" + days : days;
    dateToday = year + "-" + month + "-" + days;
    // 时间插件
    $("#beginTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });
    $("#endTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });

    //获取从主页面跳转过来的参数
    var queryType = getParameter("type");
    if (queryType == "register") { //注册企业
        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
    } else if (queryType == "auth") { //认证企业
        //已认证
        items.authenticateStatus = "1";
        $('.auth-type .item').removeClass('active');
        $($('.auth-type .item')[3]).addClass('active');

        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
    } else if (queryType == "unauth") { //非认证企业
        //非认证
        items.authenticateStatus = "0,2,-1";
        $('.auth-type .item').addClass('active');
        $($('.auth-type .item')[3]).removeClass('active');
        $($('.auth-type .item')[0]).removeClass('active');
        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
    } else if (queryType == "agreement") { //协议用户
        //协议
        items.useType = "1";
        $('.user-type .item').removeClass('active');
        $('.user-type .item:last-child').addClass('active');
        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
    } else if (queryType == "test") { //试用用户
        items.useType = "0";
        $('.user-type .item').removeClass('active');
        $($('.user-type .item')[1]).addClass('active');
        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
    } else if (queryType == "allTask") { //待审核
        items.authenticateStatus = "2";
        $('.auth-type .item').removeClass('active');
        $($('.auth-type .item')[2]).addClass('active');
        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
    } else if (queryType == "todayTask") { //今日待审核
        items.authenticateStatus = "2";
        $('.auth-type .item').removeClass('active');
        $($('.auth-type .item')[2]).addClass('active');
        //测试 正式
        items.enterpriseType = "1,0";
        $('.enterprise-type .item').removeClass('active');
        $($('.enterprise-type .item')[0]).addClass('active');
        //设置日期为 新增 日
        $('.date-type .item').removeClass('active');
        $($('.date-type .item')[1]).addClass('active');
        $(".add li").removeClass('active');
        $(".add li:first-child").addClass('active');
        items.useAppTimeBegin = dateToday;
        items.useAppTimeEnd = dateToday;
    }

    loadTable(); // 初始化表格

    clickSearch(); //点击按钮查询

    setTableHeight('table'); //设置表格高度

    $('.dropdown-menu').css({
        'min-width': $('.dropdown-toggle').width() + 24
    }); //设置新增，到期，逾期下拉框的最小宽度
});

//窗口改变时设置新增，到期，逾期下拉框的最小宽度
window.onresize = function () {
    $('.dropdown-menu').css({
        'min-width': $('.dropdown-toggle').width() + 24
    });
}

//定义网格化传入参数的值
var items = {
    "useType": '0,1', //1协议、0试用用户
    "enterpriseType": '1', //1正式用户 0测试用户
    "authenticateStatus": "0,2,1,-1", //企业认证状态
    // "status": "0,1",
    "useAppTimeBegin": "", //试用、协议新增开始
    "useAppTimeEnd": "", //试用、协议新增结束
    "overdueTimeBegin": "", //试用、协议逾期开始
    "overdueTimeEnd": "", //试用、协议逾期结束
    "expireTimeBegin": "", //试用到期开始
    "expireTimeEnd": "", //试用到期结束
    "signDateBegin": "", //协议到期开始
    "signDateEnd": "" //协议到期结束
}

/**
 * @desc 获取复选框的值
 * @method getCheckVal
 * @param {*String} name 传入ID
 * @return {*String} checkVal
 */
function getCheckVal(name) {
    var checkVal = "";
    if ($('.font-change').html() == "简单搜索") {
        $("input[name=\'" + name + "\']:checked").each(function () {
            checkVal += $(this).val() + ",";
        });
    }
    return checkVal;
}


/**
 * @desc 表格初始化
 * @method loadTable
 */
function loadTable() {
    $('#table').bootstrapTable({
        url: '/cloudlink-core-framework/enterprise/getListByApp?token=' + token,
        method: 'get', //请求方式（*）
        toolbar: '#toolbar',
        queryParams: function (params) {
            currentPageNumber = this.pageNumber; //将当前页码赋值给全局变量
            currentPageSize = params.limit; //将当前页面大小赋值给全局变量
            params.pageNum = this.pageNumber; //当前页码
            params.pageSize = params.limit; //页面大小
            params.appId = appId;
            params.enterpriseName = $("#enterpriseName").val(); //企业名称
            params.createTimeBegin = $("#beginTime").val(); //企业注册时间段的开始时间
            params.createTimeEnd = $("#endTime").val(); //企业注册时间段的结束时间
            params.enterpriseScale = getCheckVal("enterpriseScale"); //企业规模 
            params.authenticateStatus = items.authenticateStatus; //企业认证状态
            params.enterpriseType = items.enterpriseType; //1正式用户 0测试用户
            params.enpAppUseType = items.useType; //1协议、0试用用户   

            params.useAppTimeBegin = items.useAppTimeBegin; //试用、协议新增开始
            params.useAppTimeEnd = items.useAppTimeEnd; //试用、协议新增结束
            params.overdueTimeBegin = items.overdueTimeBegin; //试用、协议逾期开始
            params.overdueTimeEnd = items.overdueTimeEnd; //试用、协议逾期结束
            params.expireTimeBegin = items.expireTimeBegin; //试用到期开始
            params.expireTimeEnd = items.expireTimeEnd; //试用到期结束
            params.signDateBegin = items.signDateBegin; //协议到期开始
            params.signDateEnd = items.signDateEnd; //协议到期结束
            if (this.sortName != undefined) {
                params.orderBy = this.sortName + " " + this.sortOrder
            } else {
                params.orderBy = "create_time desc"
            }
            // params.status = items.status;

            return params;
        },
        clickToSelect: true, //点击行即可选中单选/复选框  
        columns: [{
                checkbox: true,
            }, {
                field: 'index',
                title: '序号',
                formatter: function (value, row, index) {
                    return currentPageSize * (currentPageNumber - 1) + index + 1
                }
            }, {
                title: '标记',
                width: "10%",
                formatter: function (value, row) {
                    var createTime = ""
                    //获取注册日期
                    if (!isNull(row.createTime)) {
                        createTime = row.createTime.split(" ")[0]
                    }
                    if (row.enterpriseType == 0) {
                        return '<span class="test">内测</span>'
                    }
                    //判断当前日期是否与注册日期相同
                    else if (dateToday == createTime) {
                        return '<span class="added">新增</span>'
                    } else if (row.authenticateStatus == 1) { //1为认证成功，2为待认证
                        return '<span class="certification">认证</span>';
                    } else if (row.expireTime <= addmulMonth(dateToday, 1) && row.expireTime >= dateToday) {
                        return '<span class="maturity">即将到期</span>';
                    } else if (dateToday >= row.expireTime) {
                        return '<span class="overdue">逾期</span>';
                    }

                }
            },
            {
                field: 'enterpriseName',
                title: '企业名称',
                width: "15%"
            }, {
                field: 'useType',
                title: '用户类型',
                sortable: true,
                sortName: 'use_type',
                width: "10%",
                formatter: function (value) {
                    if (value == 1) {
                        return "协议用户"
                    } else if (value == 0) {
                        return "试用用户"
                    }
                }
            }, {
                field: 'createTime',
                title: '注册时间',
                sortable: true,
                sortName: 'create_time',
                order: 'desc',
                class: "td-nowrap",
                width: "10%",
                formatter: function (value) {
                    return value
                }
            },
            {
                field: 'expireTime',
                title: '到期时间',
                sortable: true,
                sortName: 'expire_time',
                class: "td-nowrap",
                width: "10%",
                formatter: function (value) {
                    return value;
                }
            },
            {
                field: 'authenticateStatus',
                title: '认证状态',
                sortable: true,
                sortName: 'authenticate_status',
                width: "10%",
                formatter: function (value, row, index) {
                    if (value == "0") {
                        return "<span>未认证</span>";
                    } else if (value == '2') {
                        return "<span class=''>待审核</span>";
                    } else if (value == '1') {
                        return "<span class=''>已认证</span>";
                    } else if (value == '-1') {
                        return "<span class=''>驳回</span>";
                    }

                }
            },
            {
                field: 'telephoneNum',
                title: '系统管理员及联系方式',
                width: "15%",
                formatter: function (value, row, index) {
                    if (!isNull(value)) {
                        return row.enpAdminName + "/" + value
                    } else {
                        return row.enpAdminName
                    }
                }
            },
            // {
            //     field: 'enterpriseScale',
            //     title: '企业规模',
            //     formatter: function (value) {
            //         if (value == "1") {
            //             return "<span>50人以下</span>";
            //         } else if (value == '2') {
            //             return "<span class=''>50-100人</span>";
            //         } else if (value == '3') {
            //             return "<span class=''>100-200人</span>";
            //         } else if (value == '4') {
            //             return "<span class=''>200-500人</span>";
            //         } else if (value == '5') {
            //             return "<span class=''>500人以上</span>";
            //         }
            //     }
            // },


            {
                field: 'operation',
                title: '操作',
                width: "20%",
                class: "td-nowrap",
                formatter: function (value, row, index) {
                    var res = "<a href='#'><i class='glyphicon glyphicon-eye-open' title='查看企业信息' onclick=\"view('" + row.objectId + "','" + row.authenticateStatus + "','" + row.useType + "','" + row.enterpriseType + "')\"></i></a>";

                    res += "<a href='#'><i class='glyphicon glyphicon-eye-open'  title='查看企业数据' onclick=\"openWindowURL('" + row.objectId + "')\"></i></a>";

                    res += "<a href='#'><i class='fa fa-hand-o-up'  title='指派专家服务' onclick=\"editExpert('" + row.objectId + "','" + row.enterpriseName + "')\"></i></a>";

                    if (row.authenticateStatus == 2) {
                        res += "<a href='#'><i class='fa fa-legal'  title='企业认证审核' onclick=\"certificateEnterprise('" + row.objectId + "','" + row.authenticateStatus + "','" + row.useType + "','" + row.enterpriseType + "')\"></i></a>";
                    } else {
                        res += "<a href='#'><i class='fa fa-legal'  title='企业认证审核' style = 'color:#ccc' onclick=\"certificateEnterprise('" + row.objectId + "','" + row.authenticateStatus + "','" + row.useType + "','" + row.enterpriseType + "')\"></i></a>";
                    }
                    if (row.useType == 0) {
                        res += "<a href= '#'><i class='fa fa-address-card-o'  title='签约' onclick=\"userSettings('" + row.objectId + "','" + row.enterpriseName + "','" + row.useType + "')\"></i></a>";
                    } else {
                        res += "<a href= '#'><i class='fa fa-address-card-o' style = 'color:#ccc' title='签约' onclick=\"userSettings('" + row.objectId + "','" + row.authenticateStatus + "','" + row.useType + "')\"></i></a>";
                    }
                    if (row.useType == 0) {
                        res += "<a href= '#'><i class='fa fa-calendar'  title='试用期设置' onclick=\"settings('" + row.objectId + "','" + row.enterpriseName + "','" + row.useType + "','" + row.enterpriseType + "','" + row.enpAdminName + "','" + row.createTime + "')\"></i></a>";
                    } else {
                        res += "<a href= '#'><i class='fa fa-calendar' style = 'color:#ccc' title='试用期设置' onclick=\"settings('" + row.objectId + "','" + row.enterpriseName + "','" + row.useType + "')\"></i></a>";
                    }
                    if (row.useType == 1) {
                        res += "<a href= '#'><i class='fa fa-file-text-o'  title='续约' onclick=\"signing('" + row.objectId + "','" + row.enterpriseName + "','" + row.useType + "','" + "')\"></i></a>";
                    } else {
                        res += "<a href= '#'><i class='fa fa-file-text-o' style = 'color:#ccc'  title='续约' onclick=\"signing('" + row.objectId + "','" + row.enterpriseName + "','" + row.useType + "','" + "')\"></i></a>";
                    }
                    var titleName = row.enterpriseType==1?"设置内测用户":"设置正式用户";
                    if (row.useType == 0) {
                        
                        res += "<a href= '#'><i class='fa fa-cog'  title='"+titleName+"' onclick=\"setTestUser('" + row.objectId + "','" + row.useType + "','" + row.enterpriseType + "')\"></i></a>";
                    } else {
                        res += "<a href= '#'><i class='fa fa-cog'  title='"+titleName+"' style = 'color:#ccc' onclick=\"setTestUser('" + row.objectId + "','" + row.useType + "','" + row.enterpriseType + "')\"></i></a>";
                    }
                    return res;
                }
            }

        ],
        onDblClickRow: function (row) {
            view(row.objectId, row.authenticateStatus, row.useType, row.enterpriseType);
        },
        responseHandler: function (res) { //设置边框底部页码
            if (res.success == 1) {
                var data = res.rows.result;
                return {
                    "rows": res.rows,
                    "total": res.totalElements
                }
            } else {
                layer.msg("加载数据出错", {
                    skin: "self-msg"
                });
            }
        }
    });
}

/**
 * @desc 点击按钮查询
 */
function clickSearch() {
    //点击试用用户、协议用户的时候刷新页面
    $('.user-type .item').click(function () {
        var num = items.useType; //获取上一次的用户类型
        var $parent = $('.user-type');
        $parent.find(".item").removeClass('active'); //移除所有的active
        $(this).addClass('active'); //将点击按钮设置点击状态
        items.useType = $(this).attr("data-value"); //获取点击按钮的值
        if (num == 1) { //对协议的期时间和试用到期时间进行复制
            items.expireTimeBegin = items.signDateBegin
            items.expireTimeEnd = items.signDateEnd
        } else if (num == 0) {
            items.signDateBegin = items.expireTimeBegin
            items.signDateEnd = items.expireTimeEnd
        }
        if (items.useType == 1) { //切换试用、协议时先清空其他的到期时间
            items.expireTimeBegin = ""
            items.expireTimeEnd = ""
        } else if (items.useType == 0) {
            items.signDateBegin = ""
            items.signDateEnd = ""
        } else {
            if (num == 1) { //刷新完页面在还原到期时间
                items.expireTimeBegin = items.signDateBegin
                items.expireTimeEnd = items.signDateEnd
            } else {
                items.signDateBegin = items.expireTimeBegin
                items.signDateEnd = items.expireTimeEnd
            }
        }
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页

    });

    //点击测试、非测试的时候刷新页面
    $('.enterprise-type .item').click(function () {
        var $parent = $('.enterprise-type');
        $parent.find(".item").removeClass('active'); //移除.enterprise-type 下所有.item的选中状态
        $(this).addClass('active'); //将点击按钮设置为选中状态
        items.enterpriseType = $(this).attr("data-value"); //获取选中的值
        // $('#table').bootstrapTable('refresh', true);
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1
        }); //刷新页面并跳转到第一页
    });

    //点击企业认证的的时候刷新页面
    $('.auth-type .item').click(function () {
        var $parent = $('.auth-type');
        $parent.find(".item").removeClass('active'); //移除.auth-type 下所有.item的选中状态
        $(this).addClass('active'); //将点击按钮设置为选中状态
        items.authenticateStatus = $(this).attr("data-value"); //获取选中的值

        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1
        }); //刷新页面并跳转到第一页
    });

    //点击全部的时候刷新页面
    $('.date-type .item').click(function () {
        var $parent = $('.date-type');
        $parent.children(".dropdown").find(".item").removeClass('active'); //移除.date-type 下所有.item的选中状态
        $(this).addClass('active'); //将点击按钮设置为选中状态
        if ($($('.date-type .item')[0]).hasClass('active')) { //判断全部按钮是否被选中
            setDays(); //清空新增、到期、逾期时间
            $('.date-type').find("li").removeClass('active'); //移除所有新增、到期、逾期下拉框选中值
            $('#table').bootstrapTable('refreshOptions', {
                pageNumber: 1
            }); //刷新页面并跳转到第一页
        };
    });

    //点击新增的时候刷新页面
    $('.add li').click(function () {
        var day = getSelectValue(this); //获取选中的值
        // console.log(day);
        if (day == 1) { //对选中的值为1天时进行处理
            items.useAppTimeBegin = dateToday;
            items.useAppTimeEnd = dateToday;
        } else {
            items.useAppTimeBegin = addDate(dateToday, -day);
            items.useAppTimeEnd = dateToday;
        }
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1
        }); //刷新页面并跳转到第一页
    });

    //点击到期的时候刷新页面
    $('.expire li').click(function () {
        var day = getSelectValue(this); //获取选中的值
        if (items.useType == 1) { //协议用户
            if (day == 1) { //对选中的值为1天时进行处理
                items.signDateBegin = dateToday;
                items.signDateEnd = dateToday;
            } else { //对选中的值为1天时进行处理
                items.signDateBegin = dateToday;
                items.signDateEnd = addDate(dateToday, day);
            }
        } else if (items.useType == 0) { //试用用户
            if (day == 1) { //对选中的值为1天时进行处理
                items.expireTimeBegin = dateToday;
                items.expireTimeEnd = dateToday;
            } else {
                items.expireTimeBegin = dateToday;
                items.expireTimeEnd = addDate(dateToday, day);
            }
        } else {
            if (day == 1) { //对选中的值为1天时进行处理
                items.expireTimeBegin = dateToday;
                items.expireTimeEnd = dateToday;
                items.signDateBegin = dateToday;
                items.signDateEnd = dateToday;
            } else {

                items.expireTimeBegin = dateToday;
                items.expireTimeEnd = addDate(dateToday, day);
                items.signDateBegin = dateToday;
                items.signDateEnd = addDate(dateToday, day);
            }
        }

        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1
        }); //刷新页面并跳转到第一页
    });

    //点击逾期的时候刷新页面
    $('.due-time li').click(function () {
        var day = getSelectValue(this); //获取选中的值
        if (day == 1) { //对选中的值为1天时进行处理
            items.overdueTimeBegin = addDate(dateToday, -day - 1);
            items.overdueTimeEnd = addDate(dateToday, day - 1);
        } else if (day == 0) {
            items.overdueTimeBegin = "2017-01-01";
            items.overdueTimeEnd = dateToday;
        } else {
            items.overdueTimeBegin = addDate(dateToday, -day);
            items.overdueTimeEnd = dateToday;
        }
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1
        }); //刷新页面并跳转到第一页

    });
}

/**
 * @desc 获取选中的下拉框的值
 * @param {*String} _this 点击选中的当前this
 * @return {*String} day 选中状态下的value值
 */
function getSelectValue(_this) {
    $(".dropdown-menu li").removeClass('active'); //移除所有新增、到期、逾期下拉框选中值
    $(_this).addClass('active'); //将点击按钮设置为选中状态
    var day = $(_this).find('a').attr('value'); //获取选中的值
    setDays(); //清空新增、到期、逾期时间
    return day;
}

// 点击确定的时候实现搜索
$('#searchBtn').click(function () {
    // $('#table').bootstrapTable('refresh', true);
    $('#table').bootstrapTable('refreshOptions', {
        pageNumber: 1
    }); //刷新表格并且把页面设置

});

//重置按钮       
$("#resetBtn").click(function () {
    $("#enterpriseName").val(""); //清空企业名称
    $("#beginTime").val(''); //开始时间设置为空
    $("#endTime").val(''); //结束时间设置为空
    // 重置认证按钮及items认证值
    $('.auth-type').find(".item").removeClass('active');
    $($('.auth-type .item')[0]).addClass('active');
    items.authenticateStatus = "0,2,1,-1";
    //重置试用、协议按钮
    $('.user-type').find(".item").removeClass('active');
    $($('.user-type .item')[0]).addClass('active');
    items.useType = '0,1', //1协议、0试用用户
        //重置新增、到期、逾期按钮及items值
        $('.date-type').find("li").removeClass('active');
    $('.date-type').find(".item").removeClass('active');
    $($('.date-type .item')[0]).addClass('active');
    setDays();

    //重置测试、非测试按钮及items值
    $(".enterprise-type").find(".item").removeClass('active');
    $($('.enterprise-type .item')[1]).addClass('active');
    items.enterpriseType = '1', //1正式用户 0测试用户
        // 对 传值重置
        // items.status = "0,1";

        $("#enterpriseName").val(""); // 企业名称重置
    $("input[name='enterpriseScale']")
        .removeAttr('checked'); // 企业规模重置
    // $('#table').bootstrapTable('refresh', true);
    $('#table').bootstrapTable('refreshOptions', {
        pageNumber: 1,
        sortName: "create_time",
        sortOrder: "desc"
    });

});

/**
 * @desc 清空日期
 */
function setDays() {
    items.useAppTimeBegin = ""
    items.useAppTimeEnd = ""
    items.signDateBegin = ""
    items.signDateEnd = ""
    items.overdueTimeBegin = ""
    items.overdueTimeEnd = ""
    items.expireTimeBegin = ""
    items.expireTimeEnd = ""
}

/**
 * @desc 查看企业信息
 * @param {*String} objectId,authenticateStatus,useType,enterpriseType
 */
function view(objectId, authenticateStatus, useType, enterpriseType) {
    uncheck("view");
    var rows = $("#table").bootstrapTable('getSelections');
    if (!isNull(objectId)) {

    } else if (rows.length == 1) {
        objectId = rows[0].objectId;
        authenticateStatus = rows[0].authenticateStatus;
        useType = rows[0].useType;
        enterpriseType = rows[0].enterpriseType;
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    var index = parent.layer.open({
        type: 2,
        title: '查看企业信息',
        area: ['950px', '600px'],
        btn: ["关闭"],
        content: 'src/html/user_management/view_enterprise.html?objectId=' + objectId + '&authenticateStatus=' + authenticateStatus + '&useType=' + useType + '&enterpriseType=' + enterpriseType
    });
}

/**
 * @desc 指派/变更服务专家
 * @param objectId,enterpriseName
 */
function editExpert(objectId, enterpriseName) {
    uncheck("editExpert");
    var rows = $("#table").bootstrapTable('getSelections');
    if (!isNull(objectId)) {

    } else if (rows.length == 1) {
        objectId = rows[0].objectId;
        enterpriseName = rows[0].enterpriseName;
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    parent.layer.open({
        type: 2,
        title: '指派/变更服务专家',
        btn: ['关闭'],
        area: ['800px', '600px'],
        maxmin: false,
        yes: function (index, layero) {
            parent.layer.close(index);
        },
        content: 'src/html/user_management/edit_expert.html?objectId=' + objectId + '&enterpriseName=' + encodeURI(enterpriseName)
    });
}

/**
 * @desc 企业认证审核
 * @param p_objecId, p_authenticateStatu
 */
function certificateEnterprise(objectId, authenticateStatus) {
    uncheck("certificateEnterprise");
    if (!isNull(objectId)) {

    } else {
        var rows = $('#table').bootstrapTable('getSelections');
        if (rows.length != 1) {
            layer.alert("请选中一条记录", {
                title: '提示',
                skin: 'self-alert'
            });
            return;
        } else {
            objectId = rows[0].objectId;
            authenticateStatus = rows[0].authenticateStatus;
        }
    }

    //authenticateStatus 认证状态:0未认证,1已认证,-1驳回,2待审核
    if (authenticateStatus == 0) {
        layer.alert("该企业未提交认证申请", {
            title: '提示',
            skin: 'self-alert'
        });
        return;

    } else if (authenticateStatus == 1) {
        layer.alert("该企业已认证", {
            title: '提示',
            skin: 'self-alert'
        });
        return;
    } else if (authenticateStatus == -1) {
        layer.alert("该企业申请已驳回", {
            title: '提示',
            skin: 'self-alert'
        });
        return;
    } else if (authenticateStatus == 2) {
        var index = parent.layer.open({
            type: 2,
            // skin: 'self',
            title: '企业认证审核',
            area: ['950px', '600px'],
            btn: ['通过', '驳回', '取消'],
            yes: function (index, layero) {
                var viewObj = layero.find('iframe')[0].contentWindow;
                var flag = viewObj.updateStatus('1');
                if (flag == 1) {
                    $("#table").bootstrapTable('refresh');
                    layer.msg("审核成功!", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    parent.layer.close(index);
                } else if (flag == 0) {
                    parent.layer.alert("审核失败", {
                        title: '提示',
                        skin: 'self-alert'
                    });
                } else if (flag == 2) {
                    parent.layer.alert("请填写审核意见", {
                        title: '提示',
                        skin: 'self-alert'
                    });
                }
            },
            btn2: function (index, layero) {
                var viewObj = layero.find('iframe')[0].contentWindow;
                var flag = viewObj.updateStatus('-1');
                if (flag == 1) {
                    $("#table").bootstrapTable('refresh');
                    layer.msg("驳回成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    parent.layer.close(index);
                } else if (flag == 0) {
                    parent.layer.alert("驳回失败", {
                        title: '提示',
                        skin: 'self-alert'
                    });
                    parent.layer.close(index);
                } else if (flag == 2) {
                    parent.layer.alert("请填写审核意见", {
                        title: '提示',
                        skin: 'self-alert'
                    });
                    return false;
                }
            },
            btn3: function (index, layero) {},
            content: rootPath + "/src/html/user_management/enterprise_certification.html?objectId=" + objectId
        });
    }

}

/**
 * @desc 企业数据查看
 */
function viewData() {
    uncheck("viewData");
    var rows = $("#table").bootstrapTable('getSelections');
    if (rows.length == 1) {
        openWindowURL(rows[0].objectId);
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }

}

/**
 * @desc 协议用户设置
 * @param objectId,enterpriseName,useType
 */
function userSettings(objectId, enterpriseName, useType) {
    uncheck("userSettings");
    var rows = $("#table").bootstrapTable('getSelections');
    if (!isNull(objectId)) {
        if (useType != 0) { //判断是否是试用用户
            return;
        }
    } else if (rows.length == 1) {
        objectId = rows[0].objectId;
        enterpriseName = rows[0].enterpriseName;
        useType = rows[0].useType;
        if (useType != 0) { //判断是否是试用用户
            return;
        }
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    parent.layer.open({
        type: 2,
        title: '协议用户设置',
        btn: ['提交', '取消'],
        area: ['600px', '600px'],
        maxmin: false,
        yes: function (index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            var flag = viewObj.save();
            if (flag == true) {
                parent.layer.close(index);
                $("#table").bootstrapTable('refresh', true);
            }
        },
        content: 'src/html/user_management/user_settings.html?objectId=' + objectId + '&enterpriseName=' + encodeURI(enterpriseName)
    });
}

/**
 * @desc 设置
 * @param objectId,enterpriseName,useType,enterpriseType,enpAdminName,createTime
 */
function settings(objectId, enterpriseName, useType, enterpriseType, enpAdminName, createTime) {
    uncheck("settings");
    var rows = $("#table").bootstrapTable('getSelections');
    if (!isNull(objectId)) {
        if (useType != 0) {
            return;
        }
    } else if (rows.length == 1) {
        objectId = rows[0].objectId
        enterpriseName = rows[0].enterpriseName;
        enterpriseType = rows[0].enterpriseType;
        useType = rows[0].useType;
        enpAdminName = rows[0].enpAdminName;
        createTime = rows[0].createTime;
        if (useType != 0) {
            layer.alert("企业不是正式试用用户", {
                title: "提示",
                skin: 'self-alert'
            });
            return;
        }
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    parent.layer.open({
        type: 2,
        title: '设置',
        btn: ['提交', '取消'],
        area: ['500px', '600px'],
        maxmin: false,
        yes: function (index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            var flag = viewObj.save();
            if (flag == true) {
                parent.layer.close(index);
                $("#table").bootstrapTable('refresh', true);
            }
        },
        content: 'src/html/user_management/settings.html?objectId=' + objectId + '&enterpriseName=' + encodeURI(enterpriseName) + '&enterpriseType=' + enterpriseType + '&enpAdminName=' + encodeURI(enpAdminName) + '&createTime=' + createTime
    });
}

/**
 * @desc 签约
 * @param objectId,enterpriseName,useType
 */
function signing(objectId, enterpriseName, useType) {
    var rows = $("#table").bootstrapTable('getSelections');
    if (!isNull(objectId)) {
        if (useType != 1) {
            return;
        }
    } else if (rows.length == 1) {
        objectId = rows[0].objectId;
        enterpriseName = rows[0].enterpriseName;
        userType = rows[0].useType;
        if (userType != 1) {
            layer.alert("不是协议用户", {
                title: "提示",
                skin: 'self'
            });
            return;
        }
    } else {
        layer.alert("请选择一条数据", {
            title: "提示",
            skin: 'self-alert'
        });
        return;
    }
    parent.layer.open({
        type: 2,
        title: '协议用户续约',
        btn: ['提交', '取消'],
        area: ['600px', '600px'],
        maxmin: false,
        yes: function (index, layero) {
            var viewObj = layero.find('iframe')[0].contentWindow;
            var flag = viewObj.save();
            if (flag == true) {
                parent.layer.close(index);
                $("#table").bootstrapTable('refresh', true);
            }
        },
        content: 'src/html/user_management/signing.html?objectId=' + objectId + '&enterpriseName=' + encodeURI(enterpriseName)
    });
}

//回车查询
$(".form-horizontal").keydown(function () {
    if (event.keyCode == "13") { //keyCode=13是回车键
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: 1,
            sortName: "",
            sortOrder: ""
        }); //刷新页面并跳转到第一页
    }
});

/**
 * @desc 设置内测用户
 * @param objectId,enterpriseName,useType
 */
function setTestUser(objectId, useType, enterpriseType) {
    if (useType != 0) {
        return;
    }
    var str_msg=enterpriseType==1?"测试用户":"正式用户";
    var alert_msg="您确认要设置该企业为"+str_msg+"吗？"
    //询问用户是否操作，确认窗口
    layer.confirm(alert_msg, {
        title: "提示",
        btn: ['确定', "取消"], //按钮
        skin: "self"
    }, function (index) {
        enterpriseType = enterpriseType == 1 ? 0 : 1; //1是正式用户，0是测试用户
        var parameter = {
            "enterpriseType": enterpriseType,
            "objectId": objectId
        };
        layer.close(index);
        $.ajax({
            url: '/cloudlink-core-framework/enterprise/update?token=' + token,
            method: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: JSON.stringify(parameter),
            success: function (res) {
                if (res.success == 1) {
                    parent.layer.msg("设置成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                     layer.close(index);
                    $("#table").bootstrapTable('refresh', true);
                } else {
                    parent.layer.alert(res.msg, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        })
    });
}