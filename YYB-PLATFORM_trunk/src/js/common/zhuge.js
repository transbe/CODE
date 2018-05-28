 var zhugeSwitch = 0; //1:开启诸葛 0：关闭诸葛
 window.zhuge = window.zhuge || [];
 window.zhuge.methods = "_init debug identify track trackLink trackForm page".split(" ");
 window.zhuge.factory = function (b) {
     return function () {
         var a = Array.prototype.slice.call(arguments);
         a.unshift(b);
         window.zhuge.push(a);
         return window.zhuge;
     }
 };
 for (var i = 0; i < window.zhuge.methods.length; i++) {
     var key = window.zhuge.methods[i];
     window.zhuge[key] = window.zhuge.factory(key);
 }
 window.zhuge.load = function (b, x) {
     if (!document.getElementById("zhuge-js")) {
         var a = document.createElement("script");
         var verDate = new Date();
         var verStr = verDate.getFullYear().toString() +
             verDate.getMonth().toString() + verDate.getDate().toString();

         a.type = "text/javascript";
         a.id = "zhuge-js";
         a.async = !0;
         a.src = (location.protocol == 'http:' ? "http://sdk.zhugeio.com/zhuge.min.js?v=" : 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
         a.onerror = function () {
             window.zhuge.identify = window.zhuge.track = function (ename, props, callback) {
                 if (callback && Object.prototype.toString.call(callback) === '[object Function]') callback();
             };
         };
         var c = document.getElementsByTagName("script")[0];
         c.parentNode.insertBefore(a, c);
         window.zhuge._init(b, x)
     }
 };
 //window.zhuge.load('a9aac4178db640aea1d22b00192e2905');//阴保专家web KEY
 window.zhuge.load('433a73b7c0f54209878d15b6f2d07cce');//阴保管家测试Key
 //window.zhuge.load('a9aac4178db640aea1d22b00192e2905', {debug:true});//阴保专家web KEY debug
