/**
 * @file 
 * @author zhangyi
 * @desc 报告中获取申请状态中文
 * @date 2017-05-25
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 17:15:49
 */

/**
 * @desc 获取申请状态中文
 * @param {string} applyStatus "0"/"1"/"2"/"3"/"4"/"5"
 * @returns {string} applyStatus 中文
 */
function convertApplyStatus(applyStatus) {
	var currentLangulage = lsObj.getLocalStorage("i18nLanguage");
	switch (applyStatus) {
		case '0':
			// applyStatus = '提交申请';
			applyStatus = (currentLangulage == "en" ? 'Submit Application':'提交申请');
			break;
		case '1':
			// applyStatus = '完善数据';
			applyStatus = (currentLangulage == "en" ? 'Review Data':'完善数据');
			break;
		case '2':
			// applyStatus = '关闭申请';
			applyStatus = (currentLangulage == "en" ? 'Close Application':'关闭申请');
			break;
		case '3':
			// applyStatus = '提交报告';
			applyStatus = (currentLangulage == "en" ? 'Report Submission':'提交报告');
			break;
		case '4':
			// applyStatus = '修订报告';
			applyStatus = (currentLangulage == "en" ? 'Edit Report':'修订报告');
			break;
		case '5':
			// applyStatus = '验收通过';
			applyStatus = (currentLangulage == "en" ? 'Report Reviewed':'验收通过');
			break;
	}
	return applyStatus;
}

/**
 * @desc 判断操作人员角色
 * @param {string} applyStatus 
 * @returns {string} roleName
 */
function getOperatorRole(applyStatus) {
	var roleName = "";
	if (applyStatus == "1" || applyStatus == "3") {
		roleName = "专家";
	} else {
		roleName = "工程师";
	}
	return roleName;
}
