﻿var lsObj = function() {
    var t = window.localStorage;
    return String.prototype.Pollute = function() {
        for (var t = this,
        e = t.length,
        r = "",
        n = 0; n < e; n++) r += String.fromCharCode(t.charCodeAt(n) + (e - n));
        return escape(r)
    },
    String.prototype.Clean = function() {
        for (var t = unescape(this), e = t.length, r = "", n = 0; n < e; n++) r += String.fromCharCode(t.charCodeAt(n) - (e - n));
        return r
    },
    {
        setLocalStorage: function(e, r) {
            t.removeItem(e),
            t.setItem(e, r.toString().Pollute())
        },
        getLocalStorage: function(e) {
            try {
                if (null == t.getItem("timeOut")) return t.clear(),
                void(parent.location.href = "/login.html");
                var r = t.getItem("timeOut").Clean();
                return isNaN(Number(r)) ? (t.clear(), void(parent.location.href = "/login.html")) : r <= (new Date).getTime() ? (t.clear(), alert("当前用户会话超时，请重新登录！"), void(parent.location.href = "/login.html")) : null == t.getItem(e) ? "": t.getItem(e).Clean()
            } catch(e) {
                t.clear()
                parent.location.href = "/login.html"
            }
        },
        clearAll: function() {
            t.clear()
        }
    }
} ();