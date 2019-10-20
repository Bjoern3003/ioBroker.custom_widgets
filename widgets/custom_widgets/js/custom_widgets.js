
'use strict';

vis.binds.custom_widgets = {
    version: "1.0.0",
    contextEnabled: true,
    zindex: [],
    preventDefault: function (e) {
        e.preventDefault();
    },
	showVersion: function () {
        if (vis.binds.custom_widgets.version) {
            console.log('Version custom_widgets: ' + vis.binds.custom_widgets.version);
            vis.binds.custom_widgets.version = null;
        }
    },
    setSvgColor: function (el, color) {
        setTimeout(function () {
            var $that = el;
            var imgURL = $that.data('src');
            $.get(imgURL, function (data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                $svg = $svg.attr('width',  '100%');
                $svg = $svg.attr('height', '100%');
                $svg.find('*').each(function () {
                    var style = $(this).attr('style');
                    if (style) {
                        style = style.replace(/#FFFFFF/g, color);
                        $(this).attr('style', style);
                    }
                });

                // Replace image with new SVG
                $that.html($svg);
                //$that.replaceWith($svg);
            }, 'xml');
        }, 0);
    },
    calcColor: function(el, t) {
        var color1 = 'c0c0c0';
        var color2 = $(el).css('color');

        color2 = vis.binds.custom_widgets.getHexColor(color2);

        var str = vis.states.attr(t.data.oid + '.val');

        if(typeof str == 'boolean')
        {
            if(str) middle = color2; else middle = color1;
        }
        else if(typeof str == 'number')
        {
            var val = parseFloat(str);
            var ratio = val / t.data.attr('max');
            var hex = function(x) {
                x = x.toString(16);
                return (x.length == 1) ? '0' + x : x;
            };

            var r = Math.ceil(parseInt(color2.substring(0,2), 16) * ratio + parseInt(color1.substring(0,2), 16) * (1-ratio));
            var g = Math.ceil(parseInt(color2.substring(2,4), 16) * ratio + parseInt(color1.substring(2,4), 16) * (1-ratio));
            var b = Math.ceil(parseInt(color2.substring(4,6), 16) * ratio + parseInt(color1.substring(4,6), 16) * (1-ratio));

            var middle = hex(r) + hex(g) + hex(b);
        }

        vis.binds.custom_widgets.showVersion();
        vis.binds.custom_widgets.setSvgColor(el, '#'+middle);
    },
    getHexColor: function(rgb)
    {
        if (  rgb.search("rgb") == -1 ) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    },
    beldimmer: {
        init: function (el, t) {
            console.log(el);
            console.log(t);
            //control.states.find(state => state.name === 'SET' && state.id);
            setTimeout(function () {
                vis.binds.custom_widgets.calcColor(el, t);
            }, 100);

            function onChange(elm, newVal, oldVal) {
                vis.binds.custom_widgets.calcColor(el, t);
            }

            vis.states.bind(t.data.oid + '.val', onChange);
        }
    },
    belbool: {
        init: function (el, t) {
            setTimeout(function () {
                vis.binds.custom_widgets.calcColor(el, t);
            }, 100);

            function onChange(elm, newVal, oldVal) {
                vis.binds.custom_widgets.calcColor(el, t);
            }

            vis.states.bind(t.data.oid + '.val', onChange);
        }
    }
};
