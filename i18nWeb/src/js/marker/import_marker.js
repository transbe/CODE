/**
 * @file
 * @author: gaohui
 * @desc:导入测试桩
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */

var pipeLineId = getParameter("pipeLineId"); //获取管线ID
var token = lsObj.getLocalStorage("token"); //获取token
var pipelinenameForTable = decodeURI(getParameter("pipelinenameForTable")); //获取管线名称

/**
 * @desc 初始化方法
 */
$(function () {
	changePageStyle("../..");
	$('#pipeline').html('"' + pipelinenameForTable + '"')
})

/**
 * @desc 导入测试桩数据
 */
function importData() {
	var result = false;
	var formData = new FormData($("#fileChooseForm")[0]);
	// alert($("input[type='file']").val())
	if ($("input[type='file']").val() == "") {
		layer.alert(getLanguageValue("error_emptyFolder"), {
			title: getLanguageValue("tip"),
			skin: 'self-alert',
		});
		return false;
	}
	$.ajax({
		url: '/cloudlink-corrosionengineer/marker/handleFormUpload?pipeLineId=' + pipeLineId + '&token=' + token,
		method: 'post',
		data: formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		success: function (res) {
			$('.modal-body').html('');
			$('.modal-body').html(res.msg);
			try {
				if (zhugeSwitch == 1) {
					zhuge.track('导入测试桩');
				}
			} catch (err) {
				//在此处理错误
			}
			result = true
		},
		error: function (res) {
			$('.modal-body').html('');
			$('.modal-body').html(res.msg);
		}
	});
	return result
}

/**
 * @desc 下载导入摸板
 */
function upload() {
	if (token == "" && token == undefined) {
		layer.alert('登录超时，请重新登录', {
			title: "提示",
			skin: 'self-alert'
		});
		return;
	}
	var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
	var url = '/cloudlink-corrosionengineer/marker/downloadTemplateExcel?templateName=testpostTemplate.xlsx&token=' + token+"&language="+language;
	$("#exportExcelIframe").attr("src", url);
}

function inputChange(obj){
	var str = $(obj)[0].value;
	var index = str.lastIndexOf("\\");
	$("#selectReslt").text(str.substring(index+1));
}