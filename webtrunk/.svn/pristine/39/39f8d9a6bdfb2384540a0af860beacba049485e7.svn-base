/**  
 * @file
 * @author: lizhenzhen
 * @desc: 专家资质信息新增或修改
 * @date: 2017-03-02
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:26:17
 */

var appCode = "corrosionengineer";
var token = "";
//专家id
var expertId = "";
$(function () {
    changePageStyle("../..");
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    token = lsObj.getLocalStorage("token")
    expertId = userBo.objectId;
    getNewUserBo(); //进行服务获取最新的userBo
    //加载资质信息table
    loadExpertCertificationTable();
});

var personalImg_fileId = null; //进行存储头像的文件ID
var upload_fileId = null;

/*初始化个人资料基本信息 */
function initUser() {
    var user = JSON.parse(lsObj.getLocalStorage('userBo'));
    if (user.userName != "" && user.userName != null) {
        $("#name").val(user.userName);
    }
    if (user.age != "" && user.age != null) {
        $("#age").val(user.age);
    }
    if (user.sex != "" && user.sex != null) {
        $(".selectsex").val(user.sex);
    }
    if (user.orgName != "" && user.orgName != null) {
        $("#dept").text(user.orgName);
    }
    if (user.position != "" && user.position != null) {
        $("#position").text(user.position);
    }
    if (user.mobileNum != "" && user.mobileNum != null) {
        $("#tel").text(user.mobileNum);
    }
    if (user.qq != "" && user.qq != null) {
        $("#qq").val(user.qq);
    }
    if (user.wechat != "" && user.wechat != null) {
        $("#weixin").val(user.wechat);
    }
    if (user.email != "" && user.email != null) {
        $("#email").val(user.email);
    }
    // console.log(user);
    // console.log(user.profilePhoto);
    // /*初始化图像 */
    if (user.profilePhoto != "" && user.profilePhoto != null) {
        personalImg_fileId = user.profilePhoto;
        var path = "/cloudlink-core-file/file/getImageBySize?fileId=" + personalImg_fileId + "&viewModel=fill&width=500&hight=500"+ "&token="+ lsObj.getLocalStorage("token");
        //console.log(path);
        //页面初始时存在图片的情况
        $('#userImg').attr('src', path);
        $('#userImg').attr('alt', '预览');
        // console.log("0000");
        // console.log($('#userImg').attr('src'));
    } else {
        // console.log("0000000");
        var path;
        if (user.sex == "女") {
            path = "/src/images/main/girl.png"
        } else {
            path = "/src/images/main/photo.png"
        }
        // var path = "/src/images/event/upload.png";
        $('#userImg').attr('src', path);
        $('#userImg').attr('alt', '');
    }

    $('#uploadfile').change(function () {
        //console.log(this.value);
        var index = this.value.lastIndexOf('.');
        var file = this.files[0];
        //console.log(file);
        var path;
        //console.log(window.URL);
        if (window.URL) {
            path = window.URL.createObjectURL(file); //创建一个object URL，并不是你的本地路径
            // console.log(path);
        }
        var img = new Image();
        img.src = path;
        // console.log(path);
        img.onload = function (e) {
            $('#userImg').attr('src', path);
            $('#userImg').removeAttr('alt');
            window.URL.revokeObjectURL(this.src); //图片加载后，释放object URL
            // console.log(this.src);
        };
    });
}

/*获取新的userBo */
function getNewUserBo() {
    var _olduser = JSON.parse(lsObj.getLocalStorage("userBo"));
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-framework/user/getById?objectId=" + _olduser.objectId + "&token=" + lsObj.getLocalStorage('token') + "&enterpriseId=" + _olduser.enterpriseId + "&appCode=" + appCode,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            // console.log(data);
            if (data.success == 1) {
                // console.log(data.rows[0]);
                /*此处针对BO进行重新存储*/
                lsObj.setLocalStorage("userBo", JSON.stringify(data.rows[0]));
                initUser();
                parent.getUserImage();
                //调用父级方法，进行主页内容的修改
            } else {
                initUser();
                parent.getUserImage();
                //调用父级方法，进行主页内容的修改
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

/*上传图片*/
$(".uploadpicture").click(function () {
    $("#uploadfile").trigger("click");
});

$('#fat-btn').click(function () {
    //console.log(1111);
    var view_alt = $("#userImg").attr("alt"); //图像
    // console.log(view_alt);
    var filesrc = $("#userImg").attr("src");
    //console.log(filesrc);
    // console.log(filesrc.indexOf("upload.png"));
    // console.log(personalImg_fileId);

    if (filesrc.indexOf("upload.png") > 1 || view_alt == '预览') {
        //初始化的时候，只是预览没有进行图片的更改
        // console.log("eeeeee");
        base_personal();
    } else if (personalImg_fileId == null || personalImg_fileId == "") {
        //初始化时网络加载没有图片的情况
        // console.log("gggggg");
        upload_Img();
    } else {
        // console.log("vvvvvv");
        deleteAnduploadImg();
    }

});

/*先进行个人头像的上传 */
function upload_Img() {
    var user = JSON.parse(lsObj.getLocalStorage("userBo"));
    var fileId = $('input[type="file"]').attr('id');
    // console.log(user);
    // console.log(baseUrl);
    // console.log(user.objectId);
    $.ajaxFileUpload({
        url: "/cloudlink-core-file/attachment/web/v1/save?businessId=" + user.objectId + "&bizType=pic&token=" + lsObj.getLocalStorage('token'),
        secureuri: false,
        fileElementId: fileId, //上传input的id
        dataType: "json",
        type: "POST",
        async: false,
        success: function (data, status) {
            var result = data.success;
            if (result == 1) {
                //console.log(4566677);
                updateUserBoImg();
            } else {
                layer.alert("服务异常，请稍候重试", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        }
    });
}

/*个人基本信息的上传 */
function base_personal() {

    var _updateUserBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    nameVal = $("#name").val().trim(); //姓名

    _updateUserBo.userName = nameVal;
    sexVal = $(".selectsex").val(); //性别
    // console.log(sexVal);
    _updateUserBo.sex = sexVal;
    var _data = {
        "objectId": _updateUserBo.objectId,
        "userName": nameVal,
        "sex": sexVal
    };
    ageVal = $("#age").val().trim(); //年龄
    _updateUserBo.age = ageVal;
    if (ageVal != "" && ageVal != null) {
        _data.age = ageVal;
        if (!checkage()) {
            return;
        }
    } else {
        _data.age = null;
    }
    qqVal = $("#qq").val().trim(); //qq号
    _data.qq = qqVal;
    _updateUserBo.qq = qqVal;
    if (qqVal != "" && qqVal != null) {
        if (!checkQQ()) {
            return;
        }
    }
    weixinVal = $("#weixin").val().trim(); //微信
    _updateUserBo.wechat = weixinVal;
    _data.wechat = weixinVal;
    emailVal = $("#email").val().trim(); //邮箱
    _data.email = emailVal;
    _updateUserBo.email = emailVal;
    if (emailVal != "" && emailVal != null) {
        if (!checkemail()) {
            return;
        }
    }
    if (upload_fileId != null && upload_fileId != "") {
        _updateUserBo.profilePhoto = upload_fileId;
        _data.profile_photo = upload_fileId;
    }
    /*点击进行个人资料信息的验证 */
    var falg = vialidForm();
    var that = this;
    if (falg) {
        console.log(_data);
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/user/update?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(_data),
            dataType: "json",
            success: function (data) {
                // console.log(data);
                if (data.success == 1) {
                    /*此处针对BO进行重新存储*/
                    lsObj.setLocalStorage("userBo", JSON.stringify(_updateUserBo));
                    layer.confirm("修改成功！", {
                        title: "提示",
                        btn: ['确定'], //按钮
                        skin: "self"
                    }, function (index) {
                        // location.reload();
                        try {
                            if (tjSwitch == 1) {
                                tjSdk.track('个人资料设置', {
                                    '结果': '成功'
                                });
                            }
                        } catch (e) {

                        }

                        parent.getUserImage(); //调用父级方法，进行主页内容的修改
                        layer.close(index);
                    });
                } else {
                    layer.alert("服务异常，请稍候重试", {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
    }
}

/*进行文件的删除*/
function deleteAnduploadImg() {
    var user = JSON.parse(lsObj.getLocalStorage("userBo"));
    var fileId = $('input[type="file"]').attr('id');
    $.ajaxFileUpload({
        url: "/cloudlink-core-file/attachment/update?businessId=" + user.objectId + "&bizType=pic&token=" + lsObj.getLocalStorage('token') + "&fileId=" + personalImg_fileId,
        secureuri: false,
        fileElementId: fileId, //上传input的id
        dataType: "json",
        type: "POST",
        async: false,
        success: function (data) {
            if (data.success == 1) {
                upload_fileId = data.rows[0].fileId; //返回来的fileid
                base_personal();
            }
        }
    });
}

/*上传成功之后，调用方法进行userbo的修改 */
function updateUserBoImg() {
    var _data = {
        "businessId": JSON.parse(lsObj.getLocalStorage('userBo')).objectId,
        "bizType": "pic"
    }
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?&token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: _data,
        dataType: "json",
        success: function (data) {
            if (data.success == 1) {

                if (data.rows.length > 0) {
                    upload_fileId = data.rows[0].fileId; //返回来的fileid
                }
                base_personal();
            } else {
                layer.alert("服务异常，请稍候重试", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

function vialidForm() {
    var filesrc = $("#userImg").attr("src"); //图像
    if (!checkName()) {
        return false;
    } else if (filesrc.indexOf("upload.png") > 1) {
        $("#Imgnote").text("请上传个人头像");
        return false;
    } else {
        return true;
    }
}

/*姓名验证 */
$('#name').blur(function () {
    checkName();
});

function checkName() {
    var name = $("#name").val().trim(); //姓名
    var reg = /^[a-zA-Z\u4e00-\u9fa5]/g;
    if (name == null || name == "") {
        $("#namenote").text("请输入姓名");
        return false;
    } else if (name.length >= 16) {
        $("#namenote").text('姓名不能超过15个字');
        return false;
    } else if (1 < name.length < 16) {
        if (!reg.test(name)) {
            $("#namenote").text('您输入格式不对');
            return false;
        } else {
            $("#namenote").text('');
            return true;
        }
    } else {
        return false;
    }
}

/*年龄验证 */
$('#age').blur(function () {
    checkage();
});

function checkage() {
    var ageVal = $("#age").val().trim(); //年龄
    var reg = /^[0-9]*$/;
    if (ageVal == null || ageVal == "") {
        $("#agenote").text("");
        return true;
    } else if (!reg.test(ageVal)) {
        $("#agenote").text('您输入格式不对');
        return false;
    } else if (parseInt(ageVal) > 100) {
        $("#agenote").text('您输入年龄不对');
        return false;
    } else {
        $("#agenote").text('');
        return true;
    }
}

/* 手机号码验证*/
$('#tel').blur(function () {
    checktel();
});

function checktel() {
    var telVal = $("#tel").val().trim(); //手机号码
    var reg = /^(((17[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (telVal == null || telVal == "") {
        $("#telnote").text("请输入手机号");
        return false;
    } else if (!reg.test(telVal)) {
        $("#telnote").text('您输入的电话号码有错误');
        return false;
    } else {
        $("#telnote").text('');
        return true;
    }
}

/*qq验证 */
$('#qq').blur(function () {
    checkQQ();
});

function checkQQ() {
    var qqVal = $('#qq').val().trim();
    var reg = /^[1-9][0-9]{4,9}$/;
    if (qqVal == null || qqVal == "") {
        $("#qqnote").text('');
        return true;
    } else if (!reg.test(qqVal)) {
        $("#qqnote").text('您输入的 QQ号码有误');
        return false;
    } else {
        $("#qqnote").text('');
        return true;
    }
}

/*微信验证 */
// $('#weixin').blur(function() {
//     checkweiixn();
// });

// function checkweiixn() {
//     weixinVal = $("#weixin").val().trim(); //微信
//     if (weixinVal == null || weixinVal == "") {
//         $("#weixinnote").text("请输入微信");
//         return false;
//     } else {
//         $("#weixinnote").text("");
//         return true;
//     }
// }

/*邮箱验证 */
$('#email').blur(function () {
    checkemail();
});

function checkemail() {
    var emailVal = $("#email").val().trim(); //邮箱
    // var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;

    var reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;



    if (emailVal == null || emailVal == "") {
        $("#emailnote").text('');
        return true;
    } else if (!reg.test(emailVal)) {
        $("#emailnote").text('您输入的邮箱地址有误');
        return false;
    } else {
        $("#emailnote").text('');
        return true;
    }
}


/**
 * @author lujingrui
 * @file 专家资质相关方法
 */

/**
 * @desc 加载专家信息table
 */
function loadExpertCertificationTable() {
    $("#expertCertification").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryQualification?token=' + token + '&expertId=' + expertId, //请求后台的URL（*）
        // url:"data.json",
        method: "get", //请求方式（*）
        sidePagination: "client",
        queryParams: function (params) {
            // params.sortName = this.sortName, //排序字段
            // params.sortOrder = this.sortOrder //排序方式
            return params;
        },
        toolbar: "#toolbar",
        columns: [{
            checkbox: true,
        }, {
            field: 'sequence',
            title: '序号',
            align: 'center',
        }, {
            field: 'qualificationName',
            title: '资质名称',
            sortable: true,
            align: 'center',
            width:"30%"
        }, {
            field: 'qualificationGrade',
            title: '资质等级',
            sortable: true,
            align: 'center',
            width:"30%"
        }, {
            field: 'certificateNum',
            title: '证书编号',
            sortable: true,
            align: 'center',
            width:"30%"
        }, {
            field: 'operation',
            title: '操作',
            align: 'center',
            width:"10%",
            formatter: function (value, row, index) {
                // var e = '<a href="#" mce_href="#" title="查看申请" onclick="view(\'' + row.objectId +'\',\'' + row.reportType + '\')"><span class="glyphicon glyphicon-eye-open"></span></a> ';
                var e = '<a href="#" mce_href="#" title="修改" onclick="editCertification(\'' + row.objectId + '\',\'' + row.qualificationName + '\',\'' + row.qualificationGrade + '\',\'' + row.certificateNum + '\')"><span class="glyphicon glyphicon-pencil"></span></a> ';
                var f = '<a href="#" mce_href="#" title="移除" onclick="deleteCertification(\'' + row.objectId + '\')"><span class="glyphicon glyphicon-minus"></span></a> ';
                return e + f;
            }
        }],
        //加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。 
        responseHandler: function (res) {
            if (res.success == 1) {
                var data = res.qualificationList;
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].sequence = i + 1;
                    }
                } else {
                    data = [];
                }
                return data;
            } else {
                layer.alert("加载数据出错", {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        },
        onLoadSuccess: function (res) {}
    });
}

/**
 * @desc 添加专家资质
 */
function addCertification() {
    $("#addCertification").attr('disabled', true);
    // $("#addDatacollection").disabled='disabled';
    var index = parent.layer.open({
        type: 2,
        title: '添加资质',
        area: ['800px', '360px'],
        btn: ['提交', '关闭'],
        skin: 'self-iframe',
        yes: function (index, layero) {
            var home = layero.find('iframe')[0].contentWindow;
            var flag = home.add();
            if (flag) {
                layer.msg("保存成功", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                $("#expertCertification").bootstrapTable('refresh', true);
                parent.layer.close(index);
            } else {
                return false;
            }

        },

        btn2: function (index, layero) {
            // parent.layer.close(index);
            // console.log(index, layero);
        },
        end: function () {
            $("#addCertification").attr('disabled', false);
        },
        content: rootPath + "/src/html/expert_person_settings/add_expert_certification.html?operateType=add" //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
    });
}

/**
 * @desc 修改专家资质
 * @param {string} objectId 资质id
 * @param {string} qualificationName 资质名称
 * @param {string} qualificationGrade 资质等级
 * @param {string} certificateNum 资质编号
 */
function editCertification(objectId, qualificationName, qualificationGrade, certificateNum) {
    var index = parent.layer.open({
        type: 2,
        title: '添加资质',
        area: ['800px', '360px'],
        btn: ['提交', '关闭'],
        skin: 'self-iframe',
        yes: function (index, layero) {
            var home = layero.find('iframe')[0].contentWindow;
            var flag = home.edit();
            if (flag) {
                layer.msg("修改成功", {
                    time: MSG_DISPLAY_TIME,
                    skin: "self-msg"
                });
                $("#expertCertification").bootstrapTable('refresh', true);
                parent.layer.close(index);
            } else {
                return false;
            }
        },
        btn2: function (index, layero) {},
        content: rootPath + "/src/html/expert_person_settings/add_expert_certification.html?operateType=edit&qualificationName=" + encodeURI(qualificationName) + "&qualificationGrade=" + encodeURI(qualificationGrade) + "&certificateNum=" + encodeURI(certificateNum) + "&objectId=" + objectId //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
    });
}

/**
 * @desc 删除专家资质
 * @param {string} objectId 资质id
 */
function deleteCertification(objectId) {
    layer.confirm("确认删除改资质", {
        title: "提示",
        skin: 'self'
    }, function () {
        $.ajax({
            method: "post",
            url: "/cloudlink-corrosionengineer/expert/deleteQualification?token=" + token,
            contentType: "application/json",
            data: JSON.stringify({
                "expertId": expertId,
                "objectId": objectId
            }),
            dataType: "json",
            success: function (result) {
                if (result.success == 1) {
                    layer.msg("删除成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    $("#expertCertification").bootstrapTable('refresh', true);
                } else {
                    layer.alert("删除失败", {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
    });
}
