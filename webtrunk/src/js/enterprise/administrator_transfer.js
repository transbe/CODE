/**
 * @file 
 * @author: liangyuanyuan
 * @desc: 忘记密码页面的js
 * @Date: 2017-04-7 09:40:41
 * @Last Modified by: liangyuanyuan
 * @Last Modified time: 2017-06-13 13:53:10
 */


//var appId = "90748268-321e-11e7-b075-001a4a1601c6";
$(function() {
    changePageStyle("../..");
    usermanager.init();
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    // console.log(userBo);
    // console.log(userBo.isSysadmin);
});
var usermanager = {
    $searchInput: $("#searchInput"), //根据关键字进行搜索
    querryObj: { //请求的搜索条件
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    searchObj: {},
    init: function() {
        this.inittable();
        this.bindEvent();
    },
    inittable: function() { //初始化表格
        var that = this;
        $('#table').bootstrapTable({
            url: "/cloudlink-core-framework/user/queryListByKeyword?token=" + lsObj.getLocalStorage('token'), //请求数据url
            method: 'GET',
            toolbar: "#toolbar",
            toolbarAlign: "left",
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            showHeader: true,
            showRefresh: true,
            striped: true, //出现渐变色
            pagination: true, //分页
            sidePagination: 'server', //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 50], //分页步进值
            queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
            // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: function(params) {
                that.searchObj.pageSize = params.pageSize;
                that.searchObj.pageNum = params.pageNumber;
                that.searchObj.status = "1";
                that.searchObj.enterpriseId = JSON.parse(lsObj.getLocalStorage("userBo")).enterpriseId;
                that.searchObj.appId = appId
                return that.searchObj;
            },
            responseHandler: function(res) {
                console.log(res);
                return res;
            },
            //表格的列
            columns: [{
                    field: 'userName', //域值
                    title: getLanguageValue("field.name"),
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                }, {
                    field: 'mobileNum', //域值
                    title: getLanguageValue("field.phoenNumber"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                }, {
                    field: 'orgName', //域值
                    title: getLanguageValue("field.department"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                }, {
                    field: 'roleNames', //域值
                    title: getLanguageValue("field.role"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    valign: "middle"
                }, {
                    field: 'position', //域值
                    title: getLanguageValue("field.position"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle",
                    formatter: function(value, row, index) {
                        if (value == null || value == "") {
                            return "";
                        } else {
                            return value;
                        }
                    }
                },
                {
                    field: 'operation',
                    title: getLanguageValue("field.status"), //内容
                    align: 'center',
                    events: operateEvents,
                    formatter: function(value, row, index) {
                        var s = "";

                        if (judgePrivilege() == true) {

                            s = '<button class="disabledremove"  href="javascript:void(0)" title="'+getLanguageValue("field.handover")+'" disabled>'+getLanguageValue("field.handover")+'</button>';
                        } else {
                            if (row.objectId == JSON.parse(lsObj.getLocalStorage("userBo")).objectId) {
                                s = '<button class="disabledremove"  href="javascript:void(0)" title="'+getLanguageValue("field.handover")+'" disabled>'+getLanguageValue("field.handover")+'</button>';
                            } else {
                                s = '<button class="remove"  href="javascript:void(0)" title="'+getLanguageValue("field.handover")+'">'+getLanguageValue("field.handover")+'</button>';
                            }
                        }

                        return [
                            s
                        ].join('');
                    }
                }
            ]
        });
    },
    bindEvent: function() { //绑定监听事件
        var that = this;
        $('#gf_Btn').click(function() {
            var s = $(this).parent().find('input').val();
            that.querryObj.keyword = s;
            that.refreshTable();
        });
        /* keyup事件 */
        that.$searchInput.keypress(function(e) {
            if (e && e.keyCode === 13) { // enter 键
                var s = $(this).parent().find('input').val();
                that.querryObj.keyword = s;
                that.refreshTable();
            }
        });
        $("#searchInput").bind('keyup', function(event) {
            if (event.keyCode == "8") {
                that.querryObj.keyword = ""; //将搜索框里面的内容清空
                that.refreshTable();
            }
        });
    },
    refreshTable: function() { //根据条件进行筛选
        var that = this;
        that.querryObj.pageNum = '1';
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: +that.querryObj.pageNum,
            pageSize: +that.querryObj.pageSize,
            queryParams: function(params) {
                that.querryObj.pageSize = params.pageSize;
                that.querryObj.pageNum = params.pageNumber;
                that.querryObj.enterpriseId = JSON.parse(lsObj.getLocalStorage("userBo")).enterpriseId;
                that.querryObj.status = "1";
                that.querryObj.appId = appId
                return that.querryObj;
            }
        });
    },
}
window.operateEvents = {
    'click .remove': function(e, value, row, index) {
        var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
        var language=lsObj.getLocalStorage("i18nLanguage");
        var _data = {
            'enterpriseId': row.enterpriseId,
            'from': userBo.objectId,
            'to': row.objectId,
            'functionNames': "管理员移交",
            'signName': "阴保管家",
            "appId": appId

            // 'fromUserName': userBo.userName,
            // 'enterpriseName': userBo.enterpriseName,
        };
        if(language=="en"){
            _data = {
                'enterpriseId': row.enterpriseId,
                'from': userBo.objectId,
                'to': row.objectId,
                'functionNames': "admin transfer",
                // 'signName': "CPManager",
                'signName': "CPEngineer",
                "appId": appId,
                "isIntl":true
            };
        }
       
        var defaultOptions = {
            tip: getValueHasArgs("tip.admin.content",[row.userName ,row.mobileNum]),
            name_title: getLanguageValue("tip.admin.handover"),
            name_cancel: getLanguageValue("tip.cancle"),
            name_confirm: getLanguageValue("tip.ok"),
            isCancelBtnShow: true,
            callBack: function() {
                console.log(_data);
                $.ajax({
                    url: "/cloudlink-core-framework/user/transferEnpAppAdminAndSendMsm?token=" + lsObj.getLocalStorage('token'),
                    type: "post",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(_data),
                    dataType: "json",
                    success: function(data, status) {
                        // console.log(_data);
                        // alert(JSON.stringify(_data))

                        console.log(data);
                        if (data.success == 1) {
                            var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
                            lsObj.clearAll();
                            lsObj.setLocalStorage('i18nLanguage', language);
                            lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
                            window.open("../../../login.html");
                        } else {
                            xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        };
        xxwsWindowObj.xxwsAlert(defaultOptions);
    },

};