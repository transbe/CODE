/**
 * @file
 * @author  gaohui
 * @desc 获取检测数据现场照片
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:22:41
 */
/**
 * @desc 获取照片url
 */
function getPhoto() {
    $("#viewPhoto").empty();
    $.ajax({
        url: '/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId=' + objectId + '&bizType=pic'+ "&token=" + token,
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                data = result.rows
                if(data.length >0){
                    for (var i = 0; i < data.length; i++) {
                        showPhoto(data[i].fileId, i);
                    }
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }

    })
}

/**
 * @desc 显示照片
 * @param {*String} fileId ,n
 */
function showPhoto(fileId, n) {
    var s = "<li class='event_pic_list' ><img src='" + rootPath + "\/cloudlink-core-file\/file\/getImageBySize?fileId=" + fileId + "&width=110&hight=110&viewModel=fill&token="+ lsObj.getLocalStorage("token")+"'  id='imagesPic" + n + "' data-original='" + rootPath + "\/cloudlink-core-file\/file\/downLoad?fileId=" + fileId + "&token="+ lsObj.getLocalStorage("token")+"'   onclick='previewPicture(this)' alt/></li>";
    document.getElementById("viewPhoto").innerHTML += s
}

/**
 * @desc 点击照片
 * @param {*String} fileId ,n
 */
function previewPicture(e) {
    viewPicObj.viewPic(e)
}