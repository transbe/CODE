/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-03-02 17:47:33
 * @file: 新增测试桩
 */

var pipelineId = getParameter("pipelineId"); //获取选中的管线ID
var pipelineName = decodeURI(getParameter("pipelinenameForTable"));  //获取选中的管线名称
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id
$(document).ready(function() {
    $('#pipelineName').val(pipelineName)
    loadSelectData();
});

/**
 * @desc 表单校验
 */
$('#addForm').bootstrapValidator({
    fields: {
        markerNumber:{
            validators:{
                notEmpty:{
                },
                stringLength: {
                    max: 50
                },
                remote:{
                    url:"/cloudlink-corrosionengineer/marker/queryMarkerForNumber?pipelineId="+pipelineId+"&token="+token,
                    message:'不得与已有的测试桩号重复',
                    async:false
                }
            }
        },
        // sortMarkerNumber:{
        //     validators:{
        //         notEmpty:{
        //         },
        //     }
        // },
        mileage:{
            validators:{
                numeric: {
                },
                remote:{
        			url:"/cloudlink-corrosionengineer/marker/queryMarkerForMileage?pipelineId="+pipelineId+"&token="+token,
        			message:'不得与已有的测试桩里程重复',
                    async:false
        		}
            },
        },
        x: {
            validators: {
                coordinates: {
                }
            }
        },
        y: {
            validators: {
                coordinates: {
                }
            }
        },
        position:{
            validators: {
                stringLength: {
                    max: 500
                }
            }
        },
        remark:{
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
 * @method loadSelectData
 */
function loadSelectData() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/marker/selectMarkerForOrder?pipelineId=' + pipelineId + '&token=' + token),
        dataType: "json",
        method: 'get',
        success: function(result) {
            if (result.success == 1) {
                var data = result.markerList;
                var options = "<option value=''>请选择</option>";
                for (var i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i].objectId + "'>" + data[i].markerNumber + "</option>"
                }
                $("#sortMarkerNumber").html(options);
                $('#sortMarkerNumber').selectpicker('refresh');
            }
        }
    });
}

/**
 * @desc 保存数据
 * @method saveData
 */
function saveData() {
    var isValidForm = $('#addForm').data('bootstrapValidator');
    isValidForm.validate();
    if (isValidForm.isValid()) {
        var result = false;//返回是否添加成功
        $.ajax({
            url: '/cloudlink-corrosionengineer/marker/addMarker?pipelineId=' + pipelineId + '&token=' + lsObj.getLocalStorage('token'),
            dataType: "json",
            method: 'post',
            async: false,
            data: $('#addForm').serialize(),
            success: function(res) {
                if (res.success == 1) {
                    parent.layer.msg("保存成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-success"
                    });
                    result = true;
                    try { 
                        if (zhugeSwitch == 1) {
                            zhuge.track('新增测试桩', { '结果': '成功' });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                } else {
                    parent.layer.confirm(res.msg, {
                        title: "提示",
                        btn: ['确定'], //按钮
                        skin: 'self'
                    });
                    result = false;
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新增测试桩', { '结果': '失败' });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                } 
            }
        });
        return result;
    } else {
        // parent.layer.confirm("表单验证失败", {  title: "提示",btn: ['确定'], skin: 'self' });
        return false
    }
}

/**
 * @desc 坐标label中显示内容
 * @method changeCoordinateName
 */
function changeCoordinateName() {
    var csName = $("input[name='coordinateSystem']:checked").val()
    if (csName != 'WGS84') {
        $('#coordinateName-x').html('X：')
        $('#coordinateName-y').html('Y：')
    } else {
        $('#coordinateName-x').html('经度：')
        $('#coordinateName-y').html('纬度：')
    }
}