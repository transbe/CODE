/**  
 * @file
 * @author: gaohui
 * @desc: 时间间隔方法
 * @date: 2017-05-04
 * @last modified by: gaohui 
 * @last modified time: 2017-06-12 09:26:17
 */

/**
 * @desc 
 * @param {*String} dtstr,n 开始日期/增加月份
 * @return {*String} date 增加指定月份的日期
 */
function  addmulMonth(dtstr,n){   // n个月后 
	var s=dtstr.split("-");
	var yy=parseInt(s[0]); 
	var mm=parseInt(s[1]-1);
	var dd=parseInt(s[2]);
	var dt=new Date(yy,mm,dd);
	
	dt.setMonth(dt.getMonth()+n);
	var year = dt.getFullYear();
	var month = dt.getMonth()+1+"";
	var days = dt.getDate()+"";
	if(month.length == 1){
       month = "0"+month
   	}
    if(days.length == 1){
       days = "0"+days
   	}
	var date = year+"-"+month+"-"+days;
	return date;
} 

/**
 * @desc 计算是时长
 * @param {*String} beginTime,endTime 开始日期/结束日期
 * @return {*String} duration 
 */
function setDuration(beginTime,endTime) {
	beginTime = beginTime.split("-");
	endTime = endTime.split("-");

	var year = 0;
	var month = 0;
	var day = 0;
	var oneMonthDay = 30;

	var beginYear = parseInt(beginTime[0]);	//开始日期的年份
	var endYear = parseInt(endTime[0]);	//结束日期的年份
	var beginMonth = parseInt(beginTime[1]);	//开始日期的月份
	var endMonth = parseInt(endTime[1]);	//结束日期的月份
	var beginDay = parseInt(beginTime[2]);	//开始日期的日
	var endDay = parseInt(endTime[2]);	//结束日期的日

	if (endMonth == 2 || endMonth == 4 || endMonth == 6 || endMonth == 8
			|| endMonth == 9 || endMonth == 11 || endMonth == 1) {	//判断结束月份是否为2,4,6,8,9,11,1其中之一
		if (endMonth == 2) {	//月份为2
			if ((endYear % 4 != 0 && endDay == 28 && beginDay >= endDay)
					|| (endYear % 4 == 0 && endDay == 29 && beginDay >= endDay)) {	//判断开始日期日大于等于结束日
				endDay = beginDay;	//开始日期赋值给结束日期
			}
		} else if (endMonth == 4 || endMonth == 6 || endMonth == 9
				|| endMonth == 11) {	//月份为4,6,9,11其中之一
			if (endDay == 30 && beginDay >= endDay) {	//开始日期大于等于结束日期且结束日期为30日
				endDay = beginDay;		//开始日期赋值给结束日期
			}
		}
		oneMonthDay = 31;	//一个月有31天
	} else if (endMonth == 3) {	//结束月份是3月
		oneMonthDay = 28;	//一个月28天
		if (endYear % 4 == 0) {	//闰年
			oneMonthDay = 29;	//一个月29天
		}
	}

	if (endDay < beginDay) {	//结束天小于开始天
		day = endDay + oneMonthDay - beginDay;	//相差的天数
		endMonth -= 1;	//结束月减一
	} else {
		day = endDay - beginDay;
	}

	if (endMonth < beginMonth) {	//结束月小于开始月
		month = endMonth + 12 - beginMonth;	//相差的月
		endYear -= 1;	//结束年减一
	} else {
		month = endMonth - beginMonth;
	}

	if (endYear < beginYear) {	//结束年小于开始年
		alert("到期时间不能早于注册时间！！！");
		return false;
	} else {
		year = endYear - beginYear;
	}
	var duration = (year > 0 ? year + "年" : "")
			+ (month > 0 ? month + "个月" : "") + (day > 0 ? day + "天" : "")
	return duration;

}

/**
 * @desc 获取增加或者减少指定天数的日期
 * @param {*String} date,days 开始日期/天数
 * @return {*String} val 
 */
function addDate(date,days){ 
	days = parseInt(days)
	var d=new Date(date); 
	d.setDate(d.getDate()+days); 
	var month=d.getMonth()+1; 
	var day = d.getDate(); 
	if(month<10){ 
		month = "0"+month; 
	} 
	if(day<10){ 
		day = "0"+day; 
	} 
	var val = d.getFullYear()+"-"+month+"-"+day; 
	return val; 
}