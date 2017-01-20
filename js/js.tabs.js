var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property]
    }
    return destination
};

function getElementsByClassName(className, element) {
    var children = (element || document).getElementsByTagName('*');
    var elements = [];
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var classNames = child.className.split(' ');
        for (var j = 0; j < classNames.length; j++) {
            if (classNames[j] == className) {
                elements.push(child);
                break
            }
        }
    }
    return elements
}

function addEventSimple(obj, evt, fn) {
    if (obj.addEventListener)
        obj.addEventListener(evt, fn, false);
    else if (obj.attachEvent)
        obj.attachEvent("on" + evt, fn)
}

var tabs = function(id, cls, options) {
    this.container = document.getElementById(id);
    this.trigger = document.getElementById(id).getElementsByTagName("ul")[0].getElementsByTagName("li");
    this.count = this.trigger.length;
    this.panel = getElementsByClassName(cls, this.container);
    this.slider = getElementsByClassName("bd", this.container)[0];
    this.t = null ;
    this.index = 0;
    this.setOptions(options);
    this.onStart = this.options.onStart;
    this.event = this.options.event;
    this.timeout = this.options.timeout;
    this.onFinish = this.options.onFinish;
    this.init()
};

tabs.prototype = {
    init: function() {
        this.trigger[0].className += " " + this.options.currCls;
        this.panel[0].className += " " + this.options.disCls;
        for (var i = 0; i < this.count; i++) {
            (function(index, that) {
                addEventSimple(that.trigger[index], that.options.event, function() {
                    that.t = setTimeout(function() {
                        that.switchTo(index)
                    }
                    , that.timeout)
                }
                );
                if (that.options.event == "mouseover") {
                    addEventSimple(that.trigger[index], "mouseout", function() {
                        that.ct(that.t)
                    }
                    )
                }
            }
            )(i, this)
        }
    },
    setOptions: function(options) {
        this.options = {
            timeout: 60,
            currCls: "on",
            disCls: "dis",
            event: "mouseover",
            onFinish: function() {},
            animation: null 
        };
        Extend(this.options, options || {})
    },
    switchTo: function(n) {
        if (this.index == n) {
            return
        } else {
            this.trigger[this.index].className = this.trigger[this.index].className.replace(this.options.currCls, "");
            this.panel[this.index].className = this.panel[this.index].className.replace(this.options.disCls, "")
        }
        ;this.trigger[n].className += " " + this.options.currCls;
        if (this.options.animation) {
            this.options.animation(n, this.slider)
        } else {
            this.panel[n].className += " " + this.options.disCls
        }
        this.onFinish(this.index, n, this.panel[n]);
        this.index = n
    },
    ct: function() {
        clearTimeout(this.t)
    }
};