var localStge = function() {
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
                // if(e.)
                return t.getItem(e).Clean() ;
            } catch(e) {
                t.clear()
                // parent.location.href = "/login.html"
            }
        },
        clearAll: function() {
            t.clear()
        }
    }
} ();