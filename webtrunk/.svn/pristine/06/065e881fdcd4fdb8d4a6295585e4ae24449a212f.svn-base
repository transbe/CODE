/**
 * @file
 * @author: gaohui
 * @desc:新增测试桩
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */

var pipelineId = getParameter("pipelineId"); //获取选中的管线ID
var pipelineName = decodeURI(getParameter("pipelinenameForTable")); //获取选中的管线名称
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id
$(document).ready(function () {
    changePageStyle("../..");
    $('#pipelineName').val(pipelineName)
    loadSelectData();
    changeCoordinateName(); // 初始化坐标方式
});

/**
 * @desc 表单校验
 */
$('#addForm').bootstrapValidator({
    fields: {
        markerNumber: {
            validators: {
                notEmpty: {},
                stringLength: {
                    max: 50
                },
                remote: {
                    url: "/cloudlink-corrosionengineer/marker/queryMarkerForNumber?pipelineId=" + pipelineId + "&token=" + token,
                    message: getLanguageValue("tip_repeatMarker_Num"),
                    async: false
                }
            }
        },
        // sortMarkerNumber:{
        //     validators:{
        //         notEmpty:{
        //         },
        //     }
        // },
        mileage: {
            validators: {
                numeric: {},
                remote: {
                    url: "/cloudlink-corrosionengineer/marker/queryMarkerForMileage?pipelineId=" + pipelineId + "&token=" + token,
                    message: getLanguageValue("tip_repeatMarker"),
                    async: false
                }
            },
        },
        x: {
            validators: {
                coordinates: {}
            }
        },
        y: {
            validators: {
                coordinates: {}
            }
        },
        position: {
            validators: {
                stringLength: {
                    max: 500
                }
            }
        },
        remark: {
            validators: {
                stringLength: {
                    max: 500
                }
            }
        }
    }
});

/**
 * @desc 获取测试桩编号下拉选内容
 */
function loadSelectData() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/marker/selectMarkerForOrder?pipelineId=' + pipelineId + '&token=' + token),
        dataType: "json",
        method: 'get',
        success: function (result) {
            if (result.success == 1) {
                var data = result.markerList;
                var options = "<option value=''>"+getLanguageValue("pleaseSelect")+"</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].objectId + "'>" + data[i].markerNumber + "</option>"
                }
                $("#sortMarkerNumber").html(options);
                $('#sortMarkerNumber').selectpicker('refresh');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
            // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
            layer.alert(SELECT_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 保存数据
 */
function saveData() {
    var isValidForm = $('#addForm').data('bootstrapValidator');
    isValidForm.validate();
    if (isValidForm.isValid()) {
        var result = false; //返回是否添加成功
        $.ajax({
            url: '/cloudlink-corrosionengineer/marker/addMarker?pipelineId=' + pipelineId + '&token=' + lsObj.getLocalStorage('token'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            method: 'post',
            async: false,
            data:JSON.stringify($('#addForm').serializeToJson()),
            success: function (res) {
                if (res.success == 1) {
                    parent.layer.msg(getLanguageValue("saveSuccess"), {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    result = true;
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('新增测试桩', {
                                '结果': '成功'
                            });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                } else {
                    parent.layer.alert(res.msg, {
                        title: getLanguageValue("tip"),
                        skin: 'self-alert'
                    });
                    result = false;
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('新增测试桩', {
                                '结果': '失败'
                            });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        });
        return result;
    } else {
        return false
    }
}

/**
 * @desc 坐标label中显示内容
 */
function changeCoordinateName() {
    var csName = $("input[name='coordinateSystem']:checked").val();
    if (csName != 'WGS84') {
        $('#coordinateName-x').html('X：')
        $('#coordinateName-y').html('Y：')
    } else {
        $('#coordinateName-x').html(getLanguageValue("Longitude"))
        $('#coordinateName-y').html(getLanguageValue("Latitude"))
    }
}
