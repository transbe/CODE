var objectIds = lsObj.getLocalStorage("objectIds");
$(function () {
    $(".suspension").css("top",$(window).height()/2);
    var objectArr = objectIds.split(",");
    var objectInodes = createNodes(objectArr);
    var currentNode = objectInodes[objectId];
    $(".suspension").click(function () {
        if($(this).hasClass("suspension-left")){
            if(currentNode.preNode!=null&&currentNode.preNode!=""){
                objectId = currentNode.preNode;
                currentNode = objectInodes[currentNode.preNode];
                getPhoto();
                loadData(); //加载数据
            }
        }else{
            if(currentNode.nextNode!=null&&currentNode.nextNode!=""){
                objectId = currentNode.nextNode;
                currentNode = objectInodes[currentNode.nextNode];
                getPhoto();
                loadData();
            }
        }
    });
});

function createNodes(dataSource){
    var nodes = {}; 
    var len = dataSource.length;
    if(len>0){
        if(len>1){
            for(var i = 0;i < len;i++){
                nodes[dataSource[i]] = {};
                if(i==0){
                    nodes[dataSource[i]].preNode = null;
                    nodes[dataSource[i]].nextNode= dataSource[i+1];
                }else if(i==len-1){
                    nodes[dataSource[i]].preNode= dataSource[i-1];
                    nodes[dataSource[i]].nextNode = null;
                }else{
                    nodes[dataSource[i]].preNode= dataSource[i-1];
                    nodes[dataSource[i]].nextNode= dataSource[i+1];
                }
            }
        }else{
            nodes[dataSource[0]] = {};
            nodes[dataSource[0]].preNode = null;
            nodes[dataSource[0]].nextNode = null;
        }
    }
    return nodes;
}