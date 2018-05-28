/**
 * @file
 * @author: gaohui
 * @desc:测试桩更改
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */

var objectId = getParameter("objectId"), //测试桩ID
	token = lsObj.getLocalStorage("token"), //token
	pipelineId = getParameter("pipelineId"); //管线ID

/**
 * @desc 初始化方法
 */
$(function () {
	changePageStyle("../..");
	loadData();
});

/**
 * @desc 回填数据
 */
function loadData() {
	$.ajax({
		url: '/cloudlink-corrosionengineer/marker/queryMarkerById?token=' + lsObj.getLocalStorage('token'),
		dataType: "json",
		data: {
			'objectId': objectId
		},
		success: function (result) {
			if (result.success == 1) {
				var data = result.markerInfo[0];

				$("#objectId").val(data.objectId);
				$("#pipelineId").val(data.pipelineId);
				$("#markerNumber").val(data.markerNumber);
				$("#pipelineName").val(data.pipelineName);
				$("#orderNumber").val(data.orderNumber);
				//判断该值是否为1，如果为1，则使复选框为选中的状态 
				if (data.isDrivepipe == 1) {
					$("#isDrivepipe").attr("checked", "checked");
					$('#isDrivepipe').val(1)
				} else {
					$('#isDrivepipe').val(0)
				}
				if (data.isCrossParallelArea == 1) {
					$("#isCrossParallelArea").attr("checked", "checked");
					$('#isCrossParallelArea').val(1)
				} else {
					$('#isCrossParallelArea').val(0)
				}
				if (data.isInsulatedJoint == 1) {
					$("#isInsulatedJoint").attr("checked", "checked");
					$('#isInsulatedJoint').val(1)

				} else {
					$('#isInsulatedJoint').val(0)
				}
				if (data.isDrainageAnode == 1) {
					$("#isDrainageAnode").attr("checked", true);
					$('#isDrainageAnode').val(1)
				} else {
					$('#isDrainageAnode').val(0)
				}
				if (data.isDirectionalDrilling == 1) {
					$("#isDirectionalDrilling").attr("checked", true);
					$('#isDirectionalDrilling').val(1)
				} else {
					$('#isDirectionalDrilling').val(0)
				}
				if (data.isRecitifierNearest == 1) {
					$("#isRecitifierNearest").attr("checked", true);
					$('#isRecitifierNearest').val(1)
				} else {
					$('#isRecitifierNearest').val(0)
				}
				$("#mileage").val(data.mileage);

				//$("#coordinatesystem").val(data.coordinatesystem);
				$("input[type=radio][name='coordinateSystem'][value=" + data.coordinateSystem + "]").attr("checked", 'checked');


				$("#x").val(data.x);
				$("#y").val(data.y);
				$("#remark").val(data.remark);
				$("#position").val(data.position);
			} else {
				layer.msg(result.msg, {
					time: MSG_DISPLAY_TIME,
					skin: "self-msg"
				});
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
}

/**
 * @desc 表单校验方法
 */
$('#updateForm').bootstrapValidator({
	fields: {
		markerNumber: {
			validators: {
				notEmpty: {
					message: getLanguageValue("tip"),
				},
				stringLength: {
					max: 50
				},
				remote: {
					url: "/cloudlink-corrosionengineer/marker/queryMarkerForNumber?pipelineId=" + pipelineId + "&token=" + token + "&objectId=" + objectId,
					message: getLanguageValue("tip_repeatName"),
					async: false
				}
			}
		},
		mileage: {
			validators: {
				numeric: {},
				remote: {
					url: "/cloudlink-corrosionengineer/marker/queryMarkerForMileage?pipelineId=" + pipelineId + "&token=" + token + "&objectId=" + objectId,
					message: getLanguageValue("tip_repeatMarker"),
					async: false
				}
			}
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
				},
			}
		},
		remark: {
			validators: {
				stringLength: {
					max: 500
				},
			}
		}
	}
});

/**
 * @desc 点击保存调用该方法
 */
function saveUpdateData() {
	var check = $('#updateForm').data('bootstrapValidator');
	check.validate();
	//保存数据
	if (check.isValid()) {
		var result = false;
		$.ajax({
			url: '/cloudlink-corrosionengineer/marker/updateMarker?token=' + lsObj.getLocalStorage('token'),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			method: "post",
			async: false,
			cache: false,
			data:  JSON.stringify($('#updateForm').serializeToJson()),
			success: function (res) {
				if (res.success == 1) {
					parent.layer.msg(getLanguageValue("saveSuccess"), {
						time: MSG_DISPLAY_TIME,
						skin: "self-msg"
					});
					result = true;

					try {
						if (zhugeSwitch == 1) {
							zhuge.track('修改测试桩', {
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
						if (zhugeSwitch == 1) {
							zhuge.track('修改测试桩', {
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