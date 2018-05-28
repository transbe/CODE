/**
 * @file
 * @author: lizhenzhen
 * @desc:导入测试桩
 * @date: 2017-03-02
 * @last modified by: zhangyi
 * @last modified time: 2017-11-03 09:15:31
 */

var taskId = getParameter("taskId"); //获取任务ID
var token = lsObj.getLocalStorage("token"); //获取token
var templateId = getParameter("templateId"); //获取任务模板ID
var langulage = lsObj.getLocalStorage("i18nLanguage")	// 语言类型

/**
 * @desc 初始化方法
 */
$(function () {
	changePageStyle("../../..");
})

/**
 * @desc 导入测试桩数据
 */
function importData() {
	var result = false;
	var formData = new FormData($("#fileChooseForm")[0]);
	if ($("input[type='file']").val() == "") {
		layer.alert(getLanguageValue("error_emptyFolder"), {
			title: getLanguageValue("tip"),
			skin: 'self-alert',
		});
		return false;
	}
	$.ajax({
		url: '/cloudlink-corrosionengineer/task/uploadHistoryData?taskId=' + taskId + '&token=' + token+"&templateId="+templateId,
		method: 'post',
		data: formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		success: function (res) {
			if(res.success==1){
				$('.modal-body').html('');
				var $domObj = $('.modal-body');
				var importNum =  getLanguageValue("importNum");
				var repeatMess =  getLanguageValue("repeatMess");
				var validateMess =  getLanguageValue("validateMess");
				$domObj.append(importNum+ res.importRowNum);
				if(res.validateMess){
					$domObj.append('<br/>');
					$domObj.append(validateMess+ res.validateMess);
				}
				if(res.repeateMess){
					$domObj.append('<br/>');
					$domObj.append(repeatMess);
					$.each(res.repeateMess.split("！"), function(index,value){
						if(value){
							$domObj.append('<li>'+value+"！"+'</li>');
							$domObj.append('<br/>');
						}
					});
				}
			}else if(res.error==-1){
				$('.modal-body').html('');
				$('.modal-body').html(res.msg);
			}else{
				$('.modal-body').html('');
				$('.modal-body').html(res.validateMess);
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
		layer.alert(getLanguageValue("loginAgain"), {
			title: getLanguageValue("tip"),
			skin: 'self-alert'
		});
		return;
	}
	var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
	var url = '/cloudlink-corrosionengineer/template/templateDownload?taskId='+ taskId +"&token=" + token + "&templateId="+ templateId ;
	$("#exportExcelIframe").attr("src", url);
}

function inputChange(obj){
	var str = $(obj)[0].value;
	var index = str.lastIndexOf("\\");
	$("#selectReslt").text(str.substring(index+1));
}