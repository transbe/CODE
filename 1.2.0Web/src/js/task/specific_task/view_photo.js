/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:获取检测数据现场照片
 */
// var carrousel = $( ".carrousel");

/**
 * @desc 获取照片url
 * @method getPhoto
 */
function getPhoto() {
    $.ajax({
        url: '/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId=' + objectId + '&bizType=pic',
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {

                data = result.rows
                for (var i = 0; i < data.length; i++) {
                    showPhoto(data[i].fileId, i);
                }
            }
        }

    })
}

/**
 * @desc 显示照片
 * @method showPhoto
 * @param {*String} fileId ,n
 */
function showPhoto(fileId, n) {
    var s = "<li class='event_pic_list' ><img src='" + rootPath + "\/cloudlink-core-file\/file\/getImageBySize?fileId=" + fileId + "&width=110&hight=110&viewModel=fill' id='imagesPic" + n + "' data-original='" + rootPath + "\/cloudlink-core-file\/file\/downLoad?fileId=" + fileId + "'   onclick='previewPicture(this)' alt/></li>";
    document.getElementById("viewPhoto").innerHTML += s
}

function previewPicture(e) {
    viewPicObj.viewPic(e)
}