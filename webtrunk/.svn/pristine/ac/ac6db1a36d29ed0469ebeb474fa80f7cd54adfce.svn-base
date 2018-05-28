/**
 * @file
 * @author  gaohui
 * @desc 加载下拉框
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:24:11
 */

/**
 * @desc 初始化下拉选（检测单位（人员）） （审核人员）
 */

function loadDetectUserName(detectUserName,nameType) {
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    $.ajax({
        url: "/cloudlink-core-framework/user/getListByEnterpriseApp?token=" + token + "&enterpriseId=" + userBo.enterpriseId + "&appCode=" + appCode + "&pageNum=-1",
        dataType: "json",
        method: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows;
                var options = "<option value=''>&nbsp&nbsp&nbsp&nbsp"+ getLanguageValue("select")+"</option>";
                for (var i = 0; i < data.length; i++) {
                    if(!isNull(nameType) && nameType=="name"){
                        if (data[i].userType == '1') {
                            options += "<option data-icon='fa fa-user' value='" + data[i].objectId + "'>" + data[i].userName  + "</option>"
                        } else {
                            options += "<option value='" + data[i].objectId + "'>&nbsp&nbsp&nbsp&nbsp" + data[i].userName + "</option>"
                        }
                    }else{
                        if (data[i].userType == '1') {
                            options += "<option data-icon='fa fa-user' value='" + data[i].objectId + "'>" + data[i].userName + "-" + data[i].mobileNum + "</option>"
                        } else {
                            options += "<option value='" + data[i].objectId + "'>&nbsp&nbsp&nbsp&nbsp" + data[i].userName + "-" + data[i].mobileNum + "</option>"
                        }
                    }
                }
                var myobj = document.getElementById(detectUserName);
                if (myobj.options.length == 0) {
                    $("#" + detectUserName).html(options);
                    $("#" + detectUserName).selectpicker('refresh');
                }
            } else {
                parent.layer.alert(getLanguageValue("drop_menu_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(SELECT_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 获取管线下拉框
 */
function getPipeline(pipeName, detectMethod) {
    var url = handleURL("/cloudlink-corrosionengineer/task/getPipeline?token=" + token + "&detectMethod=" + detectMethod);    //对URL进行权限处理 
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.dataList;
                var options = '<option value="">'+getLanguageValue("select")+'</option>';
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].id + '">' + data[i].text + '</option>';
                }
                var mySelectId = document.getElementById(pipeName);
                if (mySelectId.options.length == 0) {
                    $("#" + pipeName).html(options);
                    $("#" + pipeName).selectpicker('refresh');
                }
            } else {
                layer.alert(getLanguageValue("drop_menu_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(SELECT_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}


/**
 * @desc 获取复选框参数
 * @param {*String} checkedkId
 * @returns {*String} getCheckedkVal
 */
function getCheckedkVal(checkedkId) {
    var checkedkVal = document.getElementsByName(checkedkId);
    var getCheckedkVal = "";
    for (var i = 0; i < checkedkVal.length; i++) {   //取到对象数组后，循环检测它是不是被选中 
        if (checkedkVal[i].checked) {
            getCheckedkVal += checkedkVal[i].value + ','; //如果选中，将value添加到变量getCheckedkVal中 
        }
    }
    getCheckedkVal = getCheckedkVal.substring(0, getCheckedkVal.length - 1);
    return getCheckedkVal;
}


/**
 * @desc 初始化下拉选（曲线图所属管线）;
 */
function loadPipelineSelect() {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryPipeCheck?taskId=" + objectId+ "&token=" + token,
        dataType: "json",
        method: "get",
        async: false,
        success: function (result) {
            if (result.success == 1) {
                var data = result.pipeList;
                var options = "<option value=''>"+getLanguageValue("select")+"</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                var myobj = document.getElementById('pipeName');
                if (myobj.options.length == 0) {
                    $("#pipeName").html(options);
                    $("#pipeName").selectpicker('refresh');
                }
            } else {
                parent.layer.alert(getLanguageValue("drop_menu_error"), {
                   title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(SELECT_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 初始化起始桩下拉框的值
 * @param {*String} pipelineId
 */
function getMarkList(pipelineId) {
    $.ajax({
        url: "/cloudlink-corrosionengineer/task/queryMarkList?flag=check&pipelineId=" + pipelineId + "&taskId=" + objectId + '&token=' + token,
        dataType: "json",
        type: "get",
        dataType: "json",
        success: function (result) {
            if (result.success == 1) {
                var data = result.markList;
                var options = "<option value=''>"+getLanguageValue("select")+"</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].id + "'>" + data[i].text + "</option>"
                }
                $("#pipeendNumberName").html(options);
                $("#pipeendNumberName").selectpicker('refresh');
                $("#pipestartNumberName").html(options);
                $("#pipestartNumberName").selectpicker('refresh');
            }else{
                parent.layer.alert(getLanguageValue("drop_menu_error"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(SELECT_ERROR_MSG, {
               title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}