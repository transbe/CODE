/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:获取检测数据现场照片
 */
var carrousel = $( ".carrousel" );

//获取照片
function  getPhoto(){
    //var objectId=getParameter("objectId");
    $.ajax({
        url:'/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId='+objectId+'&bizType=pic',
        method:'get',
        dataType: 'json',
        success:function(result){
            if(result.success == 1){
                
                data = result.rows
                for(var i = 0;i < data.length;i++){
                    showPhoto(data[i].fileId);
                }
               // alert(JSON.stringify(data[0].fileId))
            }
        }

    })
}

function showPhoto(fileId){

var s = "<li class='portrait' style= 'display:inline;padding-right:1% ' ><img class='pic' src='"+rootPath+"\/cloudlink-core-file\/file\/downLoad?fileId="+fileId+ "' width='120' height='120' data-src-wide='"+rootPath+"\/cloudlink-core-file\/file\/downLoad?fileId="+fileId+ "' width='120' height='120'  alt='BINGOO'/></li>";
document.getElementById("viewPhoto").innerHTML += s
var imageView = "<img id= 'bigPicture' src='"+rootPath+"\/cloudlink-core-file\/file\/downLoad?fileId="+fileId+ "' alt='BINGOO' />"
document.getElementById("imageView").innerHTML += imageView
// $('head').append('<link href="../../../css/task/view-image.css" rel="stylesheet" type="text/css" />')

$( ".portrait" ).click( function(e){
var src = $(this).find(".pic").attr( "data-src-wide" );
carrousel.find("img").attr( "src", src );
carrousel.fadeIn( 200 );
     parent.window.fdshowdatapage();
});

carrousel.find( ".close" ).click( function(e){
carrousel.find( "img" ).attr( "src", '' );
carrousel.fadeOut( 200 );
} );
}

//   //窗口大小改变时设置备注宽度
//    window.onresize = function(){
//        var imageViewSize = document.getElementById('imageView');
//        var bigPictureSize = document.getElementById('bigPicture');
//         imageViewSize.style.width = window.innerWidth*0.5+"px";
//         imageViewSize.style.height = window.innerHeight*0.9+"px";
//     //    $('div#imageView.wrapper').style.width = window.innerWidth*0.5+"px";
//        bigPictureSize.style.width = window.innerWidth*0.5+"px"
//        bigPictureSize.style.height = window.innerHeight*0.9+"px"
        
//     }
//     //刷新窗口页面时设置备注宽度
//     window.onload = function() { 
//         // var w=$(".history-task-style").width();
//          var zright=$(".pickListResult").width();
//          var bcenter=$(".pickListButtons").width();
//          var scenter=$(".pickData").width();
//          var zleft=$(".ztree").width();
//         // alert(zright+26)
//         // alert(bcenter+33)
//         //  alert(zright+scenter+bcenter+zleft+157)
//          var w = zright+scenter+bcenter+zleft+157;
//         var rwidth = document.getElementById('remark');
//         rwidth.style.width = w-60+"px";
//     }; 

