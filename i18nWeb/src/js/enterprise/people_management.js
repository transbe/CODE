/**
 * @Author: liangyuanyuan
 * @Date: 2017-4-7
 * @Last Modified by: lizhenzhen
 * @Last Modified time: 2017-4-26
 * @func人员管理的js
 * @操作部分:操作运营人员的功能
 */
//var appId = "90748268-321e-11e7-b075-001a4a1601c6";
var language = lsObj.getLocalStorage("i18nLanguage");
$(function() {
    changePageStyle("../..");
    firstLogin(); // 判断是否是第一次登陆，第一次展示向导

    var rolerjudge = judgePrivilege();
    if (rolerjudge == true) {
        $(".export-operate-en,.invite-user-operate").css("display", "none");
    }
    usermanager.init();
    if (language == "en") {
        $(".forgotPassword .title .logobg").css("background", "url(/src/images/logo/forget-logo_en.png) no-repeat 0 66px");
        $('.top img').attr('src', '/src/images/forget_img/1_en.png');
        // 加载手机区号
        $("#phoneInput").loadPhoneArea({
            language: "en",
            classArr: ["number"],
            inputId: "tel",
            placeholder: getLanguageValue("field.interphoenNumber")
        });
    } else {
        $('.peopleleft>div>span>i').css("letter-spacing", "20px");
        $('.peopleleft>div .position').css("letter-spacing", "20px");
        $('.peopleleft>div>span>i').eq(1).css("letter-spacing", "3px");
        $("#phoneInput").append('<input class="leftinputstyle number form-control" type="text" name="tel" id="tel"  placeholder="&nbsp;' + getLanguageValue("field.interphoenNumber") + '">');
    }
});
//此页面用到的企业ID， 经过checkUrlHasParams函数处理，可以判断当前是否是运营人员，若是，则使用运营人员所参带企业ID
var tmenpi = checkUrlHasParams(); //如果返回length=0，则使用lsObj.getLocalStorage('userBo')中企业ID，否则使用链接中ID
var _enterpriseIdTmenpi = tmenpi.length == 0 ? JSON.parse(lsObj.getLocalStorage('userBo')).enterpriseId : tmenpi;
var usermanager = {
    $addbut: $(".inviteuser"), //主页面绑定的邀请人员按钮
    $exportAll: $(".export-all"), //主页面绑定的导出当前台账的按钮
    $adduser: $("#addUser"), //编辑增加用户信息
    $editUser: $("#editUser"), //编辑用户信息
    $viewUser: $("#viewUser"), //用户页面的查看
    $updateuser: $(".updateuser"), //进行修改用户的监听
    $frozenuser: $(".frozenuser"), //用户的冻结
    $removeuser: $(".removeuser"), //移除
    $items: $('.top .item'), //搜索条件dom
    $searchInput: $("#searchInput"), //根据关键字进行搜索
    $searchreset: $(".search_reset"), //重置按钮的写法
    $btn_selectOrgan: $("#btn_selectOrgan"), //邀请页面部门的选择
    differenceInvite: "1", //用于区分组织机构模态框打开的是哪一个1表示邀请打开，2表示编辑打开
    edituserData: null, //进行编辑页面信息的存储
    activeObj: {
        "status": "0,-1,1"
    }, //用于高亮显示默认选中状态
    currentName: null, //用于存储当前页面的部门名称
    parentOrgId: null, //用于存储父部门Id
    currentId: null, //用于存储当前部门的Id
    chooseOrgId: null, //进行人员邀请的时候，进行部门的选择
    // editChooseOrgId: null, //进行编辑页面时候的选择
    operationhtml: null, //操作内容
    searchObj: {},
    $flag: true,
    defaultOptions: {
        tip: getLanguageValue("tip.freeze.tip"),
        name_title: getLanguageValue("btn.tip"),
        name_cancel: getLanguageValue("btn.cancle"),
        name_confirm: getLanguageValue("btn.ok"),
        isCancelBtnShow: true
    },
    querryObj: { //请求的搜索条件
        "pageNum": 1, //第几页
        "pageSize": 10, //每页记录数
        "status": "0,-1,1"
    },
    init: function() {
        this.chooseon(); //初始化显示被选中的
        this.requestOrganTree("init"); //表示初始化的时候请求
        this.bindEvent();
    },
    chooseon: function() {
        var that = this;
        var $parent = that.$items.parent('[data-class="status"]');
        $parent.find(".item").removeClass('active');
        $parent.find(".item[data-value='" + that.activeObj.status + "']").addClass('active');
    },
    requestOrganTree: function(desc) { //请求组织机构
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-core-framework/organization/getTree",
            contentType: "application/json",
            data: {
                token: lsObj.getLocalStorage('token'),
                enterpriseId: _enterpriseIdTmenpi
            },
            dataType: "json",
            success: function(data) {
                // console.log(data);
                if (data.success != 1) {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.net.error"));
                    return;
                }
                that.currentId = data.rows[0].id;
                that.currentName = data.rows[0].name;
                that.parentOrgId = data.rows[0].id;
                that.inittable(data.rows[0].id);
                if (desc == "init") {
                    that.renderOrganTree(data.rows);
                } else {
                    that.renderOrganTreeAndCheckbox(data.rows);
                }

            },
            statusCode: {
                404: function() {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.net.error"));
                }
            }
        });
    },
    renderOrganTree: function(data) { //遍历tree
        var that = this;
        var setting = {
            view: {
                showLine: false,
                showIcon: false,
                addDiyDom: function(treeId, treeNode) {
                    var spaceWidth = 0;
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                        icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);
                    if (treeNode.level > 1) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * (treeNode.level - 1)) + "px'></span>";
                        switchObj.before(spaceStr);
                    }
                }
            },
            data: {
                key: {
                    name: 'text'
                },
                simpleData: {
                    enable: true,
                    idKey: 'id',
                }
            },
            callback: {
                onClick: this.zTreeOnClick
            }
        };
        that.zTree = $.fn.zTree.init($("#organ_list"), setting, data);
        $(".ztree").find("a").eq(0).addClass("curSelectedNode");
        $(".ztree a").find("span").eq(0).remove();
        that.zTree.expandAll(true);
    },
    zTreeOnClick: function(event, treeId, treeNode) {
        $(".ztree").find("a").eq(0).removeClass("curSelectedNode");
        usermanager.currentName = treeNode.name;
        usermanager.currentId = treeNode.id;
        usermanager.refreshTable(treeNode.id);
    },
    inittable: function(currentId) { //初始化表格
        var that = this;

        // console.log(_enterpriseIdTmenpi);
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
            // pageSize: 10,
            // pageList: [10, 20, 50], //分页步进值
            queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
            // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: function(params) {
                that.searchObj.pageSize = params.pageSize;
                that.searchObj.pageNum = params.pageNumber;
                that.searchObj.status = "0,1,-1";
                that.searchObj.orgId = currentId;
                that.searchObj.enterpriseId = _enterpriseIdTmenpi;
                that.searchObj.appId = appId
                return that.searchObj;
            },
            responseHandler: function(res) {
                // console.log(res);
                return res;
            },
            //表格的列
            columns: [{
                    field: 'userName', //域值
                    title: getLanguageValue("field.name"),
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '15%',
                    editable: true,
                }, {
                    field: 'mobileNum', //域值
                    title: getLanguageValue("field.phoenNumber"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '11%',
                    editable: true,
                }, {
                    field: 'orgName', //域值
                    title: getLanguageValue("field.department"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '15%',
                    editable: true,
                }, {
                    field: 'roleNames', //域值
                    title: getLanguageValue("field.role"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '13%',
                }, {
                    field: 'position', //域值
                    title: getLanguageValue("field.position"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '15%',
                    editable: true,
                    formatter: function(value, row, index) {
                        if (value == null || value == "") {
                            return "";
                        } else {
                            return value;
                        }
                    }
                }, {
                    field: 'status', //域值
                    title: getLanguageValue("field.status"), //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '10%',
                    editable: true,
                    formatter: function(value, row, index) {
                        if (value == 1) {
                            return "<span class='join'>" + getLanguageValue("conditional.activated") + "</span>";
                        } else if (value == "0") {
                            return "<span class='nojoin'>" + getLanguageValue("conditional.inactive") + "</span>";
                        } else if (value == -1) {
                            return "<span class='frozen'>" + getLanguageValue("conditional.freeze") + "</span>";
                        }

                    }
                },
                {
                    field: 'operation',
                    title: getLanguageValue("field.operation"),
                    align: 'center',
                    events: operateEvents,
                    formatter: function(value, row, index) {
                        var s = '';
                        if (judgePrivilege() == true) {
                            s += '<a class="view"  href="javascript:void(0)" title="' + getLanguageValue("field.view") + '"><i></i></a>';
                        } else {
                            if (row.status == 0) {
                                s += '<a class="inviter"  href="javascript:void(0)" title="' + getLanguageValue("field.againinvit") + '"><i></i></a>';
                            } else if (that.activeObj.status == '0,-1,1') {
                                s += '<a style="display:inline-block;width:22px;height:16px;"><i></i></a>';
                            }
                            s += '<a class="view"  href="javascript:void(0)" title="' + getLanguageValue("field.view") + '"><i></i></a>' +
                                '<a class="edituser"  href="javascript:void(0)" title="' + getLanguageValue("field.edit") + '"><i></i></a>' +
                                '<a class="remove"  href="javascript:void(0)" title="' + getLanguageValue("field.remove") + '"><i></i></a>';
                        }
                        return [
                            s
                        ].join('');
                    }
                }
            ]
        });
    },
    refreshTable: function(currentId) { //根据条件进行筛选
        var that = this;
        that.querryObj.pageNum = '1';
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: +that.querryObj.pageNum,
            pageSize: +that.querryObj.pageSize,
            queryParams: function(params) {
                that.querryObj.pageSize = params.pageSize;
                that.querryObj.pageNum = params.pageNumber;
                that.querryObj.orgId = currentId;
                that.querryObj.enterpriseId = _enterpriseIdTmenpi;
                that.querryObj.appId = appId
                    // alert(JSON.stringify(that.querryObj));
                return that.querryObj;
            }
        });
    },
    bindEvent: function() { //绑定监听事件
        var that = this;
        that.$addbut.click(function() {
            //打开新增用户的模态框
            $("#departments").val(that.currentName);
            that.$adduser.modal();
        });
        $(".departments").click(function() {
            that.differenceInvite = "1";
            if (that.chooseOrgId != null && that.chooseOrgId != "") {
                departmentObj.getAllData("", that.chooseOrgId);
            } else {
                departmentObj.getAllData("", that.currentId);
            }
        });
        $(".invite").click(function() {
            that.inviteUser("invite"); //用于表示点击邀请
            // console.log("dd")
        });
        $(".againinvite").click(function() {
            that.inviteUser("againinvite"); //用于表示再次邀请
        });
        that.$exportAll.click(function() {
            that.exportAll();
        });
        $(".editdepartment").click(function() {
            that.differenceInvite = "2";
            // if (that.editChooseOrgId != null && that.editChooseOrgId != "") {
            //     departmentObj.getAllData("", that.editChooseOrgId);
            // } else {
            departmentObj.getAllData("", that.edituserData.orgId);
            // }
        });
        that.$updateuser.click(function() {
            that.updateuserSave();
        });
        that.$frozenuser.click(function() {
            that.frozenuser(); //用户的冻结
        });
        that.$removeuser.click(function() {
            that.defaultOptions.tip = getLanguageValue("tip.delete.confirm");
            that.defaultOptions.callBack = function() {
                that.removeUser(that.edituserData, "edit");
            };
            xxwsWindowObj.xxwsAlert(usermanager.defaultOptions);
        });
        /* 选择条件 */
        that.$items.click(function() {
            var key = $(this).parent().attr("data-class");
            var value = $(this).attr("data-value");
            that.querryObj.status = value;
            that.activeObj.status = value;
            that.refreshTable(that.currentId);
            that.chooseon();
        });
        $('#gf_Btn').click(function() {
            var s = $(this).parent().find('input').val();
            that.querryObj.keyword = s;
            that.refreshTable(that.currentId);
        });
        /* keyup事件 */
        that.$searchInput.bind('keyup', function(event) {

            if (event.keyCode == "8") { //监听backspace事件
                var s = $(this).parent().find('input').val();
                that.querryObj.keyword = s;
                console.log(that.querryObj);
                that.refreshTable(that.currentId);
            }
        });
        that.$searchInput.keypress(function(e) {

            if (e && e.keyCode === 13) { // enter 键
                var s = $(this).parent().find('input').val();
                that.querryObj.keyword = s;
                console.log(that.querryObj);
                that.refreshTable(that.currentId);
            }
        });
        /**重置搜索按钮 */
        that.$searchreset.click(function() {
            that.querryObj.status = "0,-1,1";
            that.querryObj.keyword = ""; //将搜索框里面的内容清空
            $("#searchInput").val(""); //将搜索框里面的内容清空
            that.activeObj.status = "0,-1,1";
            $(".ztree").find("a").removeClass("curSelectedNode");
            $(".ztree").find("a").eq(0).addClass("curSelectedNode");
            that.refreshTable(that.parentOrgId);
            that.chooseon();
        });
        /**关闭打开后的部门选择模态框 */
        that.$btn_selectOrgan.click(function() {
            var arr = departmentObj.getSelectDepart().value;
            console.log(arr[0])
            if (that.differenceInvite == "1") {
                $("#departments").val(arr[0].text);
                that.chooseOrgId = arr[0].id;
            } else {
                $("#editdepartment").val(arr[0].text);
                that.edituserData.orgId = arr[0].id;
                that.edituserData.orgName = arr[0].text;
            }
        });
    },
    exportAll: function() {
        var that = this;
        var _data = {
                //"enterpriseId": JSON.parse(lsObj.getLocalStorage("userBo")).enterpriseId, //企业ID 必填当前企业
                "orgId": that.currentId, // 所属部门
                "status": that.querryObj.status, //状态  1：加入  0：受邀  -1：冻结
                "token": lsObj.getLocalStorage("token"),
                "appId": appId
            }
            // console.log(_data);
        if (that.querryObj.keyword != null && that.querryObj.keyword != "" && that.querryObj.keyword != undefined) {
            _data.keyword = that.querryObj.keyword;
        }
        // alert(JSON.stringify(_data));
        var options = {
            "url": '/cloudlink-corrosionengineer/personnel/exportPersonnel',
            "data": _data,
            "method": 'GET'
        }
        that.downLoadFile(options);
        console.log();
    },
    downLoadFile: function(options) {
        var config = $.extend(true, {
            method: 'GET'
        }, options);
        var $iframe = $('<iframe id="down-file-iframe" />');
        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        }
        $iframe.append($form);
        $(document.body).append($iframe);
        $form[0].submit();
        $iframe.remove();
    },
    againinviteUser: function(data) { //再次进行人员的邀请操作
        var that = this;
        // 再次邀请时， 号码已经存在区号 不用单独加区号
        var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
        var _data = {
            "sceneType": "unregisted",
            "enterpriseId": userBo.enterpriseId,
            "invitedPhone": data.mobileNum,
            "signName": "阴保管家",
            "inviter": userBo.objectId
        }
        if(language=="en"&&phoneNo!="+86"){
            _data.signName="CPEngineer";
            _data.isIntl=true;
        }
        $.ajax({
            url: "/cloudlink-core-framework/invite/sendInviteMsm?token=" + lsObj.getLocalStorage("token"),
            async: false,
            contentType: "application/json",
            data: JSON.stringify(_data),
            type: "post",
            dataType: "json",
            success: function(data, status) {
                if (data.success == 1) {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.inveted.success"));
                } else if (data.code == "301") {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.inveted.repeat"));
                } else if (data.code == "302") {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.sms.error"));
                } else {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.service.error"));
                }
            }
        });
    },
    inviteUser: function(des) { //新增页面人员的邀请操作
        var that = this; 
        var phoneNo = $("#phoneNo").html();
        
         
        if (that.$flag == true) {
            that.$flag = false;
            var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
            var language = lsObj.getLocalStorage("i18nLanguage");
            var _data = {
                "inviteMode": "1",
                "inviter": userBo.objectId,
                "enterpriseId": userBo.enterpriseId

            }
            if (that.chooseOrgId != null && that.chooseOrgId != "") {
                _data.orgId = that.chooseOrgId;
            } else {
                _data.orgId = that.currentId;
            }
            if (that.addcheckInput()) {
                that.again();
                return;
            } else {
                var roleIds = $(".companyRole").val();
                var position = $("#addposition").val().trim();
                var userName = $("#addname").val().trim();
                var MobileNum = $("#tel").val().trim();
                _data.roleIds = roleIds;
                _data.userName = userName;
                _data.position = position;
                _data.mobileNum = MobileNum;
                _data.signName = "阴保管家";
                _data.appId = appId;
            }
            if(language == "en"  &&  phoneNo != "+86"){
                _data.signName = "CPEngineer";
                _data.isIntl = "true";
                _data.mobileNum =phoneNo+ MobileNum;
            }
            console.log(_data);
            $.ajax({
                url: "/cloudlink-core-framework/invite/inviteUser?token=" + lsObj.getLocalStorage("token"),
                async: false,
                contentType: "application/json",
                data: JSON.stringify(_data),
                type: "post",
                dataType: "json",
                success: function(data, status) {
                    // console.log(data);
                    if (data.success == 1) {
                        xxwsWindowObj.xxwsAlert(getLanguageValue("tip.inveted.success"), function() {
                            if (des == "invite") {
                                $("#tel").val(""); //数据的清除
                                $("#addname").val("");
                                $("#addposition").val("");
                                that.$adduser.modal('hide'); //模态框的关闭
                                that.refreshTable(that.currentId);
                            } else {
                                that.refreshTable(that.currentId);
                                //数据的清除
                                $("#tel").val("");
                                $("#addname").val("");
                            }
                        });
                    } else if (data.code == "R01") {
                        xxwsWindowObj.xxwsAlert(getLanguageValue("tip.user.exist"), function() {
                            $("#tel").val("");
                            $("#addname").val("");
                        });
                    } else if (data.code == "403") {
                        xxwsWindowObj.xxwsAlert(data.msg, function() {
                            $("#tel").val("");
                            $("#addname").val("");
                        });
                    } else if (data.code == "R01") {
                        xxwsWindowObj.xxwsAlert(getLanguageValue("tip.user.exist"), function() {
                            $("#tel").val("");
                            $("#addname").val("");
                        });
                    } else {
                        xxwsWindowObj.xxwsAlert(getLanguageValue("tip.service.error"), function() {
                            $("#tel").val("");
                            $("#addname").val("");
                        });
                    }
                    that.again();
                },
                error: function() {
                    that.again();
                }
            });
        }
    },
    addcheckInput: function() {
        if (!checkname()) {
            return true;
        } else if (!checktel()) {
            return true;
        } else if (!checkposition()) {
            return true;
        } else {
            return false;
        }
    },
    initClickUser: function() { //进行点击选中一行记录的时候，进行信息的编辑页面的赋值
        var inptRole = $("input[name='Role']");
        console.log(inptRole.length);
        for (var i = 0; i < inptRole.length; i++) {
            $('input[name=Role]').eq(i).attr("checked", false);
            // $(inptRole).eq(i).removeAttr("checked");
            // console.log($(inptRole).eq(i).attr("checked"));
        }

        var data = this.edituserData;
        if (data.userName != null && data.userName != "") {
            $("#editname").val(data.userName);
        }
        if (data.mobileNum != null && data.mobileNum != "") {
            $("#edittel").val(data.mobileNum);
        }
        if (data.sex != null && data.sex != "") {
            $(".editselectsex").val(data.sex);
        }
        if (data.roleIds != null && data.roleIds != "") { //角色的填写
            var arrayRole = data.roleIds;
            arrayRole = arrayRole.split(",");

            for (var i = 0; i < arrayRole.length; i++) {
                if (arrayRole[i] == "993132df-9972-40eb-83f0-47e0f470f912") {
                    $('input[name=Role]').eq(0).prop({ 'checked': true });
                }
                if (arrayRole[i] == "993132df-9972-40eb-83f0-47e0f470f992") {
                    $('input[name=Role]').eq(1).prop({ 'checked': true });
                }
            }
        }
        if (data.orgName != null && data.orgName != "") {
            $("#editdepartment").val(data.orgName);
        }
        if (data.position != null && data.position != "") {
            $("#editposition").val(data.position);
        }
        if (data.age != null && data.age != "") {
            $("#editage").val(data.age);
        }
        if (data.wechat != null && data.wechat != "") {
            $("#editwechat").val(data.wechat);
        }
        if (data.email != null && data.email != "") {
            $("#editemail").val(data.email);
        }
        if (data.qq != null && data.qq != "") {
            $("#editqq").val(data.qq);
        }

    },
    removeUser: function(data, desc) { //进行这一行人员删除  desc用于区分移除来自编辑页面还是外面的行数
        var that = this;
        var _data = {
            "userIds": data.objectId,
            "enterpriseId": data.enterpriseId,
            "appId": appId
        }
        $.ajax({
            url: "/cloudlink-core-framework/user/removeFromEnterprise?token=" + lsObj.getLocalStorage("token"),
            async: false,
            contentType: "application/json",
            data: JSON.stringify(_data),
            type: "post",
            dataType: "json",
            success: function(data, status) {
                if (data.success == 1) {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.remove.success"), function() {
                        if (desc != null && desc != "") {
                            that.$viewUser.modal('hide');
                        }
                        that.refreshTable(that.currentId); //删除成功之后，进行表格的刷新
                    });
                } else {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.service.error"));
                }
            }
        });
    },
    updateuserSave: function() { //进行信息的修改保存
        //获得多个角色ID的组合
        var that = this;
        var data = that.edituserData;
        var _deleteRoleIds = that.edituserData.roleIds;
        var _deleteRoleIdsNew = "";
        //如果包含了企业管理员角色 先从字符串移除，不删除企业管理员角色
        //console.log(_deleteRoleIds)
        // console.log(_deleteRoleIds != "")
        // console.log(_deleteRoleIds != null)
        if (_deleteRoleIds != null) {
            var arraydeleRole = _deleteRoleIds.split(',');
            for (var i = 0; i < arraydeleRole.length; i++) {
                if (arraydeleRole[i] == '7ee6a23a-c352-41c2-b2a4-93cb6a1a0e9b') {
                    arraydeleRole.splice(i, 1);
                }
            }
            // console.log(arraydeleRole.length+"移除完了后的")
            for (var i = 0; i < arraydeleRole.length; i++) {
                // console.log(arraydeleRole[i])
                _deleteRoleIdsNew += arraydeleRole[i] + ",";
            }
            // console.log(_deleteRoleIdsNew+"前去除分号")
            _deleteRoleIdsNew = _deleteRoleIdsNew.substring(0, _deleteRoleIdsNew.length - 1);
        }
        var _addRoleIds = "";

        $("input[name='Role']:checked").each(function() {
            _addRoleIds += $(this).val() + ",";
        });
        _addRoleIds = _addRoleIds.substring(0, _addRoleIds.length - 1);
        // console.log(_addRoleIds + "")
        var _data = {
                'enterpriseId': that.edituserData.enterpriseId,
                'objectId': that.edituserData.objectId,
                'deleteRoleIds': _deleteRoleIdsNew,
                'addRoleIds': _addRoleIds,
                'orgId': that.edituserData.orgId
            }
            // if (that.editChooseOrgId != null && that.editChooseOrgId != "") {
            //     _data.orgId = that.editChooseOrgId;
            // } else {
            // _data.orgId = that.edituserData.orgId;
            // }
        var editposition = $("#editposition").val().trim();
        if (editposition != "" && editposition != null) {
            if (checkposition(editposition)) {
                _data.position = editposition;
            } else {
                return;
            }
        } else {
            _data.position = "";
        }
        // console.log(_data);
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/user/update?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(_data),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.update.success"), function() {
                        $("#editposition").val("");
                        that.$editUser.modal('hide');
                        that.refreshTable(that.currentId);
                    });
                } else {
                    xxwsWindowObj.xxwsAlert(getLanguageValue("tip.service.error"));
                }
            }
        });
    },
    viewuserData: function(data) { //进行一行信息的查看
        if (judgePrivilege() == true) {
            $(".removeuser").css("display", "none");
            $(".frozenuser").css("display", "none");
        } else {
            if (data.objectId == JSON.parse(lsObj.getLocalStorage("userBo")).objectId) {
                $(".removeuser").css("display", "none");
                $(".frozenuser").css("display", "none");
            } else if (data.status == -1) {
                $(".removeuser").css("display", "inline-block");
                $(".frozenuser").css("display", "inline-block");
                $(".frozenuser").css("background", '#59b6fc');
                $(".frozenuser").text(getLanguageValue("tip.accout.unfrezz"));
            } else if (data.status == 0) {
                $(".removeuser").css("display", "inline-block");
                $(".frozenuser").css("display", "none");
            } else if (data.status == 1) {
                $(".removeuser").css("display", "inline-block");
                $(".frozenuser").css("display", "inline-block");
                $(".frozenuser").text(getLanguageValue("tip.accout.frezz"));
            }
        }

        if (data.userName != "" && data.userName != null) {
            $(".viewname").text(data.userName);
        } else {
            $(".viewname").text("");
        }
        if (data.roleNames != "" && data.roleNames != null) {
            $(".viewroleName").text(data.roleNames);
        } else {
            $(".viewroleName").text("");
        }
        if (data.mobileNum != "" && data.mobileNum != null) {
            $(".viewMobileNum").text(data.mobileNum);
        } else {
            $(".viewMobileNum").text("");
        }
        if (data.age != "" && data.age != null) {
            $(".editage").text(data.age);
        } else {
            $(".editage").text("");
        }
        if (data.wechat != "" && data.wechat != null) {
            $(".editwechat").text(data.wechat);
        } else {
            $(".editwechat").text("");
        }
        if (data.orgName != null && data.orgName != "") {
            $(".editorgName").text(data.orgName);
        } else {
            $(".editorgName").text("");
        }
        if (data.position != null && data.position != "") {
            $(".editposition").text(data.position);
        } else {
            $(".editposition").text("");
        }
        if (data.sex != null && data.sex != "") {
            $(".editsex").text(data.sex);
        } else {
            $(".editsex").text("");
        }
        if (data.qq != null && data.qq != null) {
            $(".editqq").text(data.qq);
        } else {
            $(".editqq").text("");
        }
        if (data.email != null && data.email != "") {
            $(".editemail").text(data.email);
        } else {
            $(".editemail").text("");
        }
    },
    frozenuser: function() { //信息查看页面里面的用户冻结
        var that = this;
        var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
        if (that.edituserData.status == -1) {
            that.defaultOptions.tip = getLanguageValue("tip.unfrezz.tip");
            that.defaultOptions.callBack = function() {
                $.ajax({
                    url: "/cloudlink-core-framework/user/unfreezeFromEnterpriseApp?token=" + lsObj.getLocalStorage('token'),
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify({
                        // 'enterpriseId': that.edituserData.enterpriseId,
                        'userIds': that.edituserData.objectId,
                        'enterpriseId': userBo.enterpriseId,
                        'appId': "90748268-321e-11e7-b075-001a4a1601c6"
                    }),
                    type: "post",
                    dataType: "json",
                    success: function(data, status) {
                        if (data.success == 1) {
                            that.$viewUser.modal('hide');
                            $(".frozenuser").text(getLanguageValue("tip.accout.frezz"));
                            that.refreshTable(that.currentId);
                            that.edituserData.status == 1;
                        } else {
                            xxwsWindowObj.xxwsAlert(getLanguageValue("tip.service.error"));
                        }
                    }
                });
            }
            xxwsWindowObj.xxwsAlert(that.defaultOptions);
        } else {
            that.defaultOptions.tip = getLanguageValue("tip.frezz.confirm");
            that.defaultOptions.callBack = function() {
                $.ajax({
                    url: "/cloudlink-core-framework/user/freezeFromEnterpriseApp?token=" + lsObj.getLocalStorage('token'),
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify({
                        // 'enterpriseId': that.edituserData.enterpriseId,
                        'userIds': that.edituserData.objectId,
                        'enterpriseId': userBo.enterpriseId,
                        'appId': "90748268-321e-11e7-b075-001a4a1601c6"
                    }),
                    type: "post",
                    dataType: "json",
                    success: function(data, status) {
                        if (data.success == 1) {
                            that.$viewUser.modal('hide');
                            $(".frozenuser").text(getLanguageValue("tip.accout.unfrezz"));
                            that.refreshTable(that.currentId);
                            that.edituserData.status == -1;
                        } else {
                            xxwsWindowObj.xxwsAlert(getLanguageValue("tip.service.error"));
                        }
                    }
                });
            }
            xxwsWindowObj.xxwsAlert(that.defaultOptions);
        };

    },
    again: function() {
        this.$flag = true;
    }
}

window.operateEvents = {
    'click .view': function(e, value, row, index) {
        usermanager.$viewUser.modal();
        usermanager.edituserData = row; //编辑和查看用户信息
        usermanager.viewuserData(row);
    },
    'click .inviter': function(e, value, row, index) {
        usermanager.againinviteUser(row);
    },
    'click .remove': function(e, value, row, index) {
        if (row.objectId == JSON.parse(lsObj.getLocalStorage("userBo")).objectId) {
            xxwsWindowObj.xxwsAlert(getLanguageValue("tip.admin.delete"));
        } else {
            usermanager.defaultOptions.tip = getLanguageValue("tip.delete.confirm");
            usermanager.defaultOptions.callBack = function() {

                usermanager.removeUser(row);
            };
            xxwsWindowObj.xxwsAlert(usermanager.defaultOptions);
        }
    },
    'click .edituser': function(e, value, row, index) {
        // $("#table").find("tr").removeClass("tablebg");
        // $("#table").find("tr").eq(parseInt(index) + 1).addClass("tablebg");
        usermanager.$editUser.modal() //编辑和查看用户信息
        usermanager.edituserData = row;
        usermanager.initClickUser();
    }
};

//input输入框的验证操作
/************** 姓名正则**************/
$('#addname').blur(function() {
    checkname();
});

function checkname() {
    var nameVal = $('#addname').val().trim();
    var nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,15}$/;
    if (nameVal == "" || nameVal == null) {
        $('.addnameReg').text("请输入您的姓名");
        return false;
    } else if (!nameReg.test(nameVal)) {
        $('.addnameReg').text("您输入的姓名格式有误");
        return false;
    } else {
        $('.addnameReg').text("");
        return true;
    }
}
/**************手机正则**************/
$('#tel').blur(function() {
    // checktel(); 不进行手机号码验证
});

function checktel() {
    var language = lsObj.getLocalStorage("i18nLanguage");
    if (language == "en") {
        return true;
    }
    var numberVal = $('#tel').val().trim();
    var numberReg = /^1\d{10}$/;
    if (numberVal == "" || numberVal == null) {
        $('.numberREG').text("请输入您的手机号");
        return false;
    } else if (!numberReg.test(numberVal)) {
        $('.numberREG').text("您输入的手机号有误");
        return false;
    } else {
        $('.numberREG').text("");
        return true;
    }
}
/**************职位正则**************/
$('#addposition').blur(function() {
    var emailVal = $('#addposition').val().trim();
    checkposition(emailVal);
});
$('#editposition').blur(function() {
    var emailVal = $('#editposition').val().trim();
    checkposition(emailVal);
});

function checkposition(emailVal) {
    var emailReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,15}$/;
    if (emailVal == "" || emailVal == null) {
        $('.positionReg').text("")
        return true;
    } else if (!emailReg.test(emailVal)) {
        $('.positionReg').text("您输入的职位格式有误")
        return false;
    } else {
        $('.positionReg').text("")
        return true;
    }
}
/************** 年龄正则**************/
$('.age').blur(function() {
    var ageVal = $('.age').val().trim();
    if (ageVal == "" || ageVal == null) {
        $('.ageReg').text("请输入您的年龄");
        return false;
    } else {
        $('.ageReg').text("");
        return true;
    }
});

/**************微信**************/
$('.wechart').blur(function() {
    var wechartVal = $('.wechart').val().trim();
    if (wechartVal == "" || wechartVal == null) {
        $('.wechartReg').text("请输入您的微信号码");
        return false;
    } else {
        $('.wechartReg').text("");
        return true;
    }
});
/**************QQ**************/
$('.qq').blur(function() {
    var qqVal = $('.qq').val().trim();
    var qqReg = /^[1-9][0-9]{4,9}$/;
    if (qqVal == "" || qqVal == null) {
        $('.qqReg').text("请输入您的QQ号码");
        return false;
    } else if (!qqReg.test(qqVal)) {
        $('.qqReg').text("您输入的QQ号码有误");
        return false;
    } else {
        $('.qqReg').text("");
        return true;
    }
});
/**************邮箱**************/
$('.email').blur(function() {
    var emailVal = $('.email').val().trim();
    var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (emailVal == "" || emailVal == null) {
        $('.emailReg').text("请输入您的邮箱");
        return false;
    } else if (!emailReg.test(emailVal)) {
        $('.emailReg').text("您输入的邮箱格式有误")
        return false;
    } else {
        $('.emailReg').text("")
        return true;
    }
});


//通过该方法来为每次弹出的模态框设置最新的zIndex值，从而使最新的modal显示在最前面
$(document).on('show.bs.modal', '.modal', function(event) {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});
$(document).on('hidden.bs.modal', '.modal', function(event) {
    if ($('.modal:visible').length > 0) {
        $("body").addClass("modal-open");
    }
});