! function (e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("../../xterm")) : "function" == typeof define ? define(["../../xterm"], e) : e(window.Terminal)
}(function (e) {
    var t = {};
    return t.toggleFullScreen = function (e, t) {
        var n;
        n = void 0 === t ? e.element.classList.contains("fullscreen") ? "remove" : "add" : t ? "add" : "remove", e.element.classList[n]("fullscreen")
    }, e.prototype.toggleFullscreen = function (e) {
        t.toggleFullScreen(this, e)
    }, t
});


var jQuery;
var wssh = {};


jQuery(function($){
  /*jslint browser:true */

  var status = $('#status'),
      btn = $('.btn-primary'),
      style = {};


  function parse_xterm_style() {
    var text = $('.xterm-helpers style').text();
    var arr = text.split('xterm-normal-char{width:');
    style.width = parseFloat(arr[1]);
    arr = text.split('div{height:');
    style.height = parseFloat(arr[1]);
  }


  function current_geometry() {
    if (!style.width || !style.height) {
      parse_xterm_style();
    }

    var cols = parseInt(window.innerWidth / style.width, 10) - 1;
    var rows = parseInt(window.innerHeight / style.height, 10);
    return {'cols': cols, 'rows': rows};
  }


  function resize_term(term, sock) {
    var geometry = current_geometry(),
        cols = geometry.cols,
        rows = geometry.rows;
    // console.log([cols, rows]);
    // console.log(term.geometry);

    if (cols !== term.geometry[0] || rows !== term.geometry[1]) {
      console.log('resizing term');
      term.resize(cols, rows);
      sock.send(JSON.stringify({'resize': [cols, rows]}));
    }
  }


  function callback(msg) {
    // console.log(msg);
    if (msg.status) {
      status.text(msg.status);
      setTimeout(function(){
        btn.prop('disabled', false);
      }, 3000);
      return;
    }

    var ws_url = window.location.href.replace('http', 'ws'),
        join = (ws_url[ws_url.length-1] === '/' ? '' : '/'),
        url = ws_url + join + 'ws?id=' + msg.id,
        sock = new window.WebSocket(url),
        encoding = msg.encoding,
        terminal = document.getElementById('#terminal'),
        term = new window.Terminal({
          cursorBlink: true,
        });

    console.log(url);
    console.log(encoding);
    wssh.sock = sock;
    wssh.term = term;

    term.on('data', function(data) {
      // console.log(data);
      sock.send(JSON.stringify({'data': data}));
    });

    sock.onopen = function() {
      $('.container').hide();
      term.open(terminal, true);
      term.toggleFullscreen(true);
    };

    sock.onmessage = function(msg) {
      var reader = new window.FileReader();

      reader.onloadend = function(){
        var decoder = new window.TextDecoder(encoding);
        var text = decoder.decode(reader.result);
        // console.log(text);
        term.write(text);
        if (!term.resized) {
          resize_term(term, sock);
          term.resized = true;
        }
      };

      reader.readAsArrayBuffer(msg.data);
    };

    sock.onerror = function(e) {
      console.log(e);
    };

    sock.onclose = function(e) {
      console.log(e);
      term.destroy();
      wssh.term = undefined;
      wssh.sock = undefined;
      $('.container').show();
      status.text(e.reason);
      btn.prop('disabled', false);
    };
  }


  $('form#connect').submit(function(event) {
      event.preventDefault();

      var form = $(this),
          url = form.attr('action'),
          type = form.attr('type'),
          data = new FormData(this);

      if (!data.get('hostname') || !data.get('port') || !data.get('username')) {
        status.text('Hostname, port and username are required.');
        return;
      }

      var pk = data.get('privatekey');
      if (pk && pk.size > 16384) {
        status.text('Key size exceeds maximum value.');
        return;
      }

      status.text('');
      btn.prop('disabled', true);

      $.ajax({
          url: url,
          type: type,
          data: data,
          success: callback,
          cache: false,
          contentType: false,
          processData: false
      });

  });


  $(window).resize(function(){
    if (wssh.term && wssh.sock) {
      resize_term(wssh.term, wssh.sock);
    }
  });

});



/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */
(function (e, t) {
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define(t) : e.Popper = t()
})(this, function () {
    'use strict';

    function e(e) {
        return e && '[object Function]' === {}.toString.call(e)
    }

    function t(e, t) {
        if (1 !== e.nodeType) return [];
        var o = getComputedStyle(e, null);
        return t ? o[t] : o
    }

    function o(e) {
        return 'HTML' === e.nodeName ? e : e.parentNode || e.host
    }

    function n(e) {
        if (!e) return document.body;
        switch (e.nodeName) {
        case 'HTML':
        case 'BODY':
            return e.ownerDocument.body;
        case '#document':
            return e.body;
        }
        var i = t(e),
            r = i.overflow,
            p = i.overflowX,
            s = i.overflowY;
        return /(auto|scroll)/.test(r + s + p) ? e : n(o(e))
    }

    function r(e) {
        var o = e && e.offsetParent,
            i = o && o.nodeName;
        return i && 'BODY' !== i && 'HTML' !== i ? -1 !== ['TD', 'TABLE'].indexOf(o.nodeName) && 'static' === t(o, 'position') ? r(o) : o : e ? e.ownerDocument.documentElement : document.documentElement
    }

    function p(e) {
        var t = e.nodeName;
        return 'BODY' !== t && ('HTML' === t || r(e.firstElementChild) === e)
    }

    function s(e) {
        return null === e.parentNode ? e : s(e.parentNode)
    }

    function d(e, t) {
        if (!e || !e.nodeType || !t || !t.nodeType) return document.documentElement;
        var o = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
            i = o ? e : t,
            n = o ? t : e,
            a = document.createRange();
        a.setStart(i, 0), a.setEnd(n, 0);
        var l = a.commonAncestorContainer;
        if (e !== l && t !== l || i.contains(n)) return p(l) ? l : r(l);
        var f = s(e);
        return f.host ? d(f.host, t) : d(e, s(t).host)
    }

    function a(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 'top',
            o = 'top' === t ? 'scrollTop' : 'scrollLeft',
            i = e.nodeName;
        if ('BODY' === i || 'HTML' === i) {
            var n = e.ownerDocument.documentElement,
                r = e.ownerDocument.scrollingElement || n;
            return r[o]
        }
        return e[o]
    }

    function l(e, t) {
        var o = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
            i = a(t, 'top'),
            n = a(t, 'left'),
            r = o ? -1 : 1;
        return e.top += i * r, e.bottom += i * r, e.left += n * r, e.right += n * r, e
    }

    function f(e, t) {
        var o = 'x' === t ? 'Left' : 'Top',
            i = 'Left' == o ? 'Right' : 'Bottom';
        return parseFloat(e['border' + o + 'Width'], 10) + parseFloat(e['border' + i + 'Width'], 10)
    }

    function m(e, t, o, i) {
        return J(t['offset' + e], t['scroll' + e], o['client' + e], o['offset' + e], o['scroll' + e], ie() ? o['offset' + e] + i['margin' + ('Height' === e ? 'Top' : 'Left')] + i['margin' + ('Height' === e ? 'Bottom' : 'Right')] : 0)
    }

    function h() {
        var e = document.body,
            t = document.documentElement,
            o = ie() && getComputedStyle(t);
        return {
            height: m('Height', e, t, o),
            width: m('Width', e, t, o)
        }
    }

    function c(e) {
        return se({}, e, {
            right: e.left + e.width,
            bottom: e.top + e.height
        })
    }

    function g(e) {
        var o = {};
        if (ie()) try {
            o = e.getBoundingClientRect();
            var i = a(e, 'top'),
                n = a(e, 'left');
            o.top += i, o.left += n, o.bottom += i, o.right += n
        } catch (e) {} else o = e.getBoundingClientRect();
        var r = {
                left: o.left,
                top: o.top,
                width: o.right - o.left,
                height: o.bottom - o.top
            },
            p = 'HTML' === e.nodeName ? h() : {},
            s = p.width || e.clientWidth || r.right - r.left,
            d = p.height || e.clientHeight || r.bottom - r.top,
            l = e.offsetWidth - s,
            m = e.offsetHeight - d;
        if (l || m) {
            var g = t(e);
            l -= f(g, 'x'), m -= f(g, 'y'), r.width -= l, r.height -= m
        }
        return c(r)
    }

    function u(e, o) {
        var i = ie(),
            r = 'HTML' === o.nodeName,
            p = g(e),
            s = g(o),
            d = n(e),
            a = t(o),
            f = parseFloat(a.borderTopWidth, 10),
            m = parseFloat(a.borderLeftWidth, 10),
            h = c({
                top: p.top - s.top - f,
                left: p.left - s.left - m,
                width: p.width,
                height: p.height
            });
        if (h.marginTop = 0, h.marginLeft = 0, !i && r) {
            var u = parseFloat(a.marginTop, 10),
                b = parseFloat(a.marginLeft, 10);
            h.top -= f - u, h.bottom -= f - u, h.left -= m - b, h.right -= m - b, h.marginTop = u, h.marginLeft = b
        }
        return (i ? o.contains(d) : o === d && 'BODY' !== d.nodeName) && (h = l(h, o)), h
    }

    function b(e) {
        var t = e.ownerDocument.documentElement,
            o = u(e, t),
            i = J(t.clientWidth, window.innerWidth || 0),
            n = J(t.clientHeight, window.innerHeight || 0),
            r = a(t),
            p = a(t, 'left'),
            s = {
                top: r - o.top + o.marginTop,
                left: p - o.left + o.marginLeft,
                width: i,
                height: n
            };
        return c(s)
    }

    function w(e) {
        var i = e.nodeName;
        return 'BODY' === i || 'HTML' === i ? !1 : 'fixed' === t(e, 'position') || w(o(e))
    }

    function y(e, t, i, r) {
        var p = {
                top: 0,
                left: 0
            },
            s = d(e, t);
        if ('viewport' === r) p = b(s);
        else {
            var a;
            'scrollParent' === r ? (a = n(o(t)), 'BODY' === a.nodeName && (a = e.ownerDocument.documentElement)) : 'window' === r ? a = e.ownerDocument.documentElement : a = r;
            var l = u(a, s);
            if ('HTML' === a.nodeName && !w(s)) {
                var f = h(),
                    m = f.height,
                    c = f.width;
                p.top += l.top - l.marginTop, p.bottom = m + l.top, p.left += l.left - l.marginLeft, p.right = c + l.left
            } else p = l
        }
        return p.left += i, p.top += i, p.right -= i, p.bottom -= i, p
    }

    function E(e) {
        var t = e.width,
            o = e.height;
        return t * o
    }

    function v(e, t, o, i, n) {
        var r = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
        if (-1 === e.indexOf('auto')) return e;
        var p = y(o, i, r, n),
            s = {
                top: {
                    width: p.width,
                    height: t.top - p.top
                },
                right: {
                    width: p.right - t.right,
                    height: p.height
                },
                bottom: {
                    width: p.width,
                    height: p.bottom - t.bottom
                },
                left: {
                    width: t.left - p.left,
                    height: p.height
                }
            },
            d = Object.keys(s).map(function (e) {
                return se({
                    key: e
                }, s[e], {
                    area: E(s[e])
                })
            }).sort(function (e, t) {
                return t.area - e.area
            }),
            a = d.filter(function (e) {
                var t = e.width,
                    i = e.height;
                return t >= o.clientWidth && i >= o.clientHeight
            }),
            l = 0 < a.length ? a[0].key : d[0].key,
            f = e.split('-')[1];
        return l + (f ? '-' + f : '')
    }

    function O(e, t, o) {
        var i = d(t, o);
        return u(o, i)
    }

    function L(e) {
        var t = getComputedStyle(e),
            o = parseFloat(t.marginTop) + parseFloat(t.marginBottom),
            i = parseFloat(t.marginLeft) + parseFloat(t.marginRight),
            n = {
                width: e.offsetWidth + i,
                height: e.offsetHeight + o
            };
        return n
    }

    function x(e) {
        var t = {
            left: 'right',
            right: 'left',
            bottom: 'top',
            top: 'bottom'
        };
        return e.replace(/left|right|bottom|top/g, function (e) {
            return t[e]
        })
    }

    function S(e, t, o) {
        o = o.split('-')[0];
        var i = L(e),
            n = {
                width: i.width,
                height: i.height
            },
            r = -1 !== ['right', 'left'].indexOf(o),
            p = r ? 'top' : 'left',
            s = r ? 'left' : 'top',
            d = r ? 'height' : 'width',
            a = r ? 'width' : 'height';
        return n[p] = t[p] + t[d] / 2 - i[d] / 2, n[s] = o === s ? t[s] - i[a] : t[x(s)], n
    }

    function T(e, t) {
        return Array.prototype.find ? e.find(t) : e.filter(t)[0]
    }

    function D(e, t, o) {
        if (Array.prototype.findIndex) return e.findIndex(function (e) {
            return e[t] === o
        });
        var i = T(e, function (e) {
            return e[t] === o
        });
        return e.indexOf(i)
    }

    function C(t, o, i) {
        var n = void 0 === i ? t : t.slice(0, D(t, 'name', i));
        return n.forEach(function (t) {
            t['function'] && console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
            var i = t['function'] || t.fn;
            t.enabled && e(i) && (o.offsets.popper = c(o.offsets.popper), o.offsets.reference = c(o.offsets.reference), o = i(o, t))
        }), o
    }

    function N() {
        if (!this.state.isDestroyed) {
            var e = {
                instance: this,
                styles: {},
                arrowStyles: {},
                attributes: {},
                flipped: !1,
                offsets: {}
            };
            e.offsets.reference = O(this.state, this.popper, this.reference), e.placement = v(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.offsets.popper = S(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = 'absolute', e = C(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e))
        }
    }

    function k(e, t) {
        return e.some(function (e) {
            var o = e.name,
                i = e.enabled;
            return i && o === t
        })
    }

    function W(e) {
        for (var t = [!1, 'ms', 'Webkit', 'Moz', 'O'], o = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < t.length - 1; n++) {
            var i = t[n],
                r = i ? '' + i + o : e;
            if ('undefined' != typeof document.body.style[r]) return r
        }
        return null
    }

    function P() {
        return this.state.isDestroyed = !0, k(this.modifiers, 'applyStyle') && (this.popper.removeAttribute('x-placement'), this.popper.style.left = '', this.popper.style.position = '', this.popper.style.top = '', this.popper.style[W('transform')] = ''), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
    }

    function B(e) {
        var t = e.ownerDocument;
        return t ? t.defaultView : window
    }

    function H(e, t, o, i) {
        var r = 'BODY' === e.nodeName,
            p = r ? e.ownerDocument.defaultView : e;
        p.addEventListener(t, o, {
            passive: !0
        }), r || H(n(p.parentNode), t, o, i), i.push(p)
    }

    function A(e, t, o, i) {
        o.updateBound = i, B(e).addEventListener('resize', o.updateBound, {
            passive: !0
        });
        var r = n(e);
        return H(r, 'scroll', o.updateBound, o.scrollParents), o.scrollElement = r, o.eventsEnabled = !0, o
    }

    function I() {
        this.state.eventsEnabled || (this.state = A(this.reference, this.options, this.state, this.scheduleUpdate))
    }

    function M(e, t) {
        return B(e).removeEventListener('resize', t.updateBound), t.scrollParents.forEach(function (e) {
            e.removeEventListener('scroll', t.updateBound)
        }), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t
    }

    function R() {
        this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = M(this.reference, this.state))
    }

    function U(e) {
        return '' !== e && !isNaN(parseFloat(e)) && isFinite(e)
    }

    function Y(e, t) {
        Object.keys(t).forEach(function (o) {
            var i = ''; - 1 !== ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(o) && U(t[o]) && (i = 'px'), e.style[o] = t[o] + i
        })
    }

    function j(e, t) {
        Object.keys(t).forEach(function (o) {
            var i = t[o];
            !1 === i ? e.removeAttribute(o) : e.setAttribute(o, t[o])
        })
    }

    function F(e, t, o) {
        var i = T(e, function (e) {
                var o = e.name;
                return o === t
            }),
            n = !!i && e.some(function (e) {
                return e.name === o && e.enabled && e.order < i.order
            });
        if (!n) {
            var r = '`' + t + '`';
            console.warn('`' + o + '`' + ' modifier is required by ' + r + ' modifier in order to work, be sure to include it before ' + r + '!')
        }
        return n
    }

    function K(e) {
        return 'end' === e ? 'start' : 'start' === e ? 'end' : e
    }

    function q(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
            o = ae.indexOf(e),
            i = ae.slice(o + 1).concat(ae.slice(0, o));
        return t ? i.reverse() : i
    }

    function V(e, t, o, i) {
        var n = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
            r = +n[1],
            p = n[2];
        if (!r) return e;
        if (0 === p.indexOf('%')) {
            var s;
            switch (p) {
            case '%p':
                s = o;
                break;
            case '%':
            case '%r':
            default:
                s = i;
            }
            var d = c(s);
            return d[t] / 100 * r
        }
        if ('vh' === p || 'vw' === p) {
            var a;
            return a = 'vh' === p ? J(document.documentElement.clientHeight, window.innerHeight || 0) : J(document.documentElement.clientWidth, window.innerWidth || 0), a / 100 * r
        }
        return r
    }

    function z(e, t, o, i) {
        var n = [0, 0],
            r = -1 !== ['right', 'left'].indexOf(i),
            p = e.split(/(\+|\-)/).map(function (e) {
                return e.trim()
            }),
            s = p.indexOf(T(p, function (e) {
                return -1 !== e.search(/,|\s/)
            }));
        p[s] && -1 === p[s].indexOf(',') && console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
        var d = /\s*,\s*|\s+/,
            a = -1 === s ? [p] : [p.slice(0, s).concat([p[s].split(d)[0]]), [p[s].split(d)[1]].concat(p.slice(s + 1))];
        return a = a.map(function (e, i) {
            var n = (1 === i ? !r : r) ? 'height' : 'width',
                p = !1;
            return e.reduce(function (e, t) {
                return '' === e[e.length - 1] && -1 !== ['+', '-'].indexOf(t) ? (e[e.length - 1] = t, p = !0, e) : p ? (e[e.length - 1] += t, p = !1, e) : e.concat(t)
            }, []).map(function (e) {
                return V(e, n, t, o)
            })
        }), a.forEach(function (e, t) {
            e.forEach(function (o, i) {
                U(o) && (n[t] += o * ('-' === e[i - 1] ? -1 : 1))
            })
        }), n
    }

    function G(e, t) {
        var o, i = t.offset,
            n = e.placement,
            r = e.offsets,
            p = r.popper,
            s = r.reference,
            d = n.split('-')[0];
        return o = U(+i) ? [+i, 0] : z(i, p, s, d), 'left' === d ? (p.top += o[0], p.left -= o[1]) : 'right' === d ? (p.top += o[0], p.left += o[1]) : 'top' === d ? (p.left += o[0], p.top -= o[1]) : 'bottom' === d && (p.left += o[0], p.top += o[1]), e.popper = p, e
    }
    for (var _ = Math.min, X = Math.floor, J = Math.max, Q = 'undefined' != typeof window && 'undefined' != typeof document, Z = ['Edge', 'Trident', 'Firefox'], $ = 0, ee = 0; ee < Z.length; ee += 1)
        if (Q && 0 <= navigator.userAgent.indexOf(Z[ee])) {
            $ = 1;
            break
        }
    var i, te = Q && window.Promise,
        oe = te ? function (e) {
            var t = !1;
            return function () {
                t || (t = !0, window.Promise.resolve().then(function () {
                    t = !1, e()
                }))
            }
        } : function (e) {
            var t = !1;
            return function () {
                t || (t = !0, setTimeout(function () {
                    t = !1, e()
                }, $))
            }
        },
        ie = function () {
            return void 0 == i && (i = -1 !== navigator.appVersion.indexOf('MSIE 10')), i
        },
        ne = function (e, t) {
            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
        },
        re = function () {
            function e(e, t) {
                for (var o, n = 0; n < t.length; n++) o = t[n], o.enumerable = o.enumerable || !1, o.configurable = !0, 'value' in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
            return function (t, o, i) {
                return o && e(t.prototype, o), i && e(t, i), t
            }
        }(),
        pe = function (e, t, o) {
            return t in e ? Object.defineProperty(e, t, {
                value: o,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = o, e
        },
        se = Object.assign || function (e) {
            for (var t, o = 1; o < arguments.length; o++)
                for (var i in t = arguments[o], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            return e
        },
        de = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'],
        ae = de.slice(3),
        le = {
            FLIP: 'flip',
            CLOCKWISE: 'clockwise',
            COUNTERCLOCKWISE: 'counterclockwise'
        },
        fe = function () {
            function t(o, i) {
                var n = this,
                    r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                ne(this, t), this.scheduleUpdate = function () {
                    return requestAnimationFrame(n.update)
                }, this.update = oe(this.update.bind(this)), this.options = se({}, t.Defaults, r), this.state = {
                    isDestroyed: !1,
                    isCreated: !1,
                    scrollParents: []
                }, this.reference = o && o.jquery ? o[0] : o, this.popper = i && i.jquery ? i[0] : i, this.options.modifiers = {}, Object.keys(se({}, t.Defaults.modifiers, r.modifiers)).forEach(function (e) {
                    n.options.modifiers[e] = se({}, t.Defaults.modifiers[e] || {}, r.modifiers ? r.modifiers[e] : {})
                }), this.modifiers = Object.keys(this.options.modifiers).map(function (e) {
                    return se({
                        name: e
                    }, n.options.modifiers[e])
                }).sort(function (e, t) {
                    return e.order - t.order
                }), this.modifiers.forEach(function (t) {
                    t.enabled && e(t.onLoad) && t.onLoad(n.reference, n.popper, n.options, t, n.state)
                }), this.update();
                var p = this.options.eventsEnabled;
                p && this.enableEventListeners(), this.state.eventsEnabled = p
            }
            return re(t, [{
                key: 'update',
                value: function () {
                    return N.call(this)
                }
            }, {
                key: 'destroy',
                value: function () {
                    return P.call(this)
                }
            }, {
                key: 'enableEventListeners',
                value: function () {
                    return I.call(this)
                }
            }, {
                key: 'disableEventListeners',
                value: function () {
                    return R.call(this)
                }
            }]), t
        }();
    return fe.Utils = ('undefined' == typeof window ? global : window).PopperUtils, fe.placements = de, fe.Defaults = {
        placement: 'bottom',
        eventsEnabled: !0,
        removeOnDestroy: !1,
        onCreate: function () {}, onUpdate: function () {}, modifiers: {
            shift: {
                order: 100,
                enabled: !0,
                fn: function (e) {
                    var t = e.placement,
                        o = t.split('-')[0],
                        i = t.split('-')[1];
                    if (i) {
                        var n = e.offsets,
                            r = n.reference,
                            p = n.popper,
                            s = -1 !== ['bottom', 'top'].indexOf(o),
                            d = s ? 'left' : 'top',
                            a = s ? 'width' : 'height',
                            l = {
                                start: pe({}, d, r[d]),
                                end: pe({}, d, r[d] + r[a] - p[a])
                            };
                        e.offsets.popper = se({}, p, l[i])
                    }
                    return e
                }
            },
            offset: {
                order: 200,
                enabled: !0,
                fn: G,
                offset: 0
            },
            preventOverflow: {
                order: 300,
                enabled: !0,
                fn: function (e, t) {
                    var o = t.boundariesElement || r(e.instance.popper);
                    e.instance.reference === o && (o = r(o));
                    var i = y(e.instance.popper, e.instance.reference, t.padding, o);
                    t.boundaries = i;
                    var n = t.priority,
                        p = e.offsets.popper,
                        s = {
                            primary: function (e) {
                                var o = p[e];
                                return p[e] < i[e] && !t.escapeWithReference && (o = J(p[e], i[e])), pe({}, e, o)
                            }, secondary: function (e) {
                                var o = 'right' === e ? 'left' : 'top',
                                    n = p[o];
                                return p[e] > i[e] && !t.escapeWithReference && (n = _(p[o], i[e] - ('right' === e ? p.width : p.height))), pe({}, o, n)
                            }
                        };
                    return n.forEach(function (e) {
                        var t = -1 === ['left', 'top'].indexOf(e) ? 'secondary' : 'primary';
                        p = se({}, p, s[t](e))
                    }), e.offsets.popper = p, e
                }, priority: ['left', 'right', 'top', 'bottom'],
                padding: 5,
                boundariesElement: 'scrollParent'
            },
            keepTogether: {
                order: 400,
                enabled: !0,
                fn: function (e) {
                    var t = e.offsets,
                        o = t.popper,
                        i = t.reference,
                        n = e.placement.split('-')[0],
                        r = X,
                        p = -1 !== ['top', 'bottom'].indexOf(n),
                        s = p ? 'right' : 'bottom',
                        d = p ? 'left' : 'top',
                        a = p ? 'width' : 'height';
                    return o[s] < r(i[d]) && (e.offsets.popper[d] = r(i[d]) - o[a]), o[d] > r(i[s]) && (e.offsets.popper[d] = r(i[s])), e
                }
            },
            arrow: {
                order: 500,
                enabled: !0,
                fn: function (e, o) {
                    var i;
                    if (!F(e.instance.modifiers, 'arrow', 'keepTogether')) return e;
                    var n = o.element;
                    if ('string' == typeof n) {
                        if (n = e.instance.popper.querySelector(n), !n) return e;
                    } else if (!e.instance.popper.contains(n)) return console.warn('WARNING: `arrow.element` must be child of its popper element!'), e;
                    var r = e.placement.split('-')[0],
                        p = e.offsets,
                        s = p.popper,
                        d = p.reference,
                        a = -1 !== ['left', 'right'].indexOf(r),
                        l = a ? 'height' : 'width',
                        f = a ? 'Top' : 'Left',
                        m = f.toLowerCase(),
                        h = a ? 'left' : 'top',
                        g = a ? 'bottom' : 'right',
                        u = L(n)[l];
                    d[g] - u < s[m] && (e.offsets.popper[m] -= s[m] - (d[g] - u)), d[m] + u > s[g] && (e.offsets.popper[m] += d[m] + u - s[g]), e.offsets.popper = c(e.offsets.popper);
                    var b = d[m] + d[l] / 2 - u / 2,
                        w = t(e.instance.popper),
                        y = parseFloat(w['margin' + f], 10),
                        E = parseFloat(w['border' + f + 'Width'], 10),
                        v = b - e.offsets.popper[m] - y - E;
                    return v = J(_(s[l] - u, v), 0), e.arrowElement = n, e.offsets.arrow = (i = {}, pe(i, m, Math.round(v)), pe(i, h, ''), i), e
                }, element: '[x-arrow]'
            },
            flip: {
                order: 600,
                enabled: !0,
                fn: function (e, t) {
                    if (k(e.instance.modifiers, 'inner')) return e;
                    if (e.flipped && e.placement === e.originalPlacement) return e;
                    var o = y(e.instance.popper, e.instance.reference, t.padding, t.boundariesElement),
                        i = e.placement.split('-')[0],
                        n = x(i),
                        r = e.placement.split('-')[1] || '',
                        p = [];
                    switch (t.behavior) {
                    case le.FLIP:
                        p = [i, n];
                        break;
                    case le.CLOCKWISE:
                        p = q(i);
                        break;
                    case le.COUNTERCLOCKWISE:
                        p = q(i, !0);
                        break;
                    default:
                        p = t.behavior;
                    }
                    return p.forEach(function (s, d) {
                        if (i !== s || p.length === d + 1) return e;
                        i = e.placement.split('-')[0], n = x(i);
                        var a = e.offsets.popper,
                            l = e.offsets.reference,
                            f = X,
                            m = 'left' === i && f(a.right) > f(l.left) || 'right' === i && f(a.left) < f(l.right) || 'top' === i && f(a.bottom) > f(l.top) || 'bottom' === i && f(a.top) < f(l.bottom),
                            h = f(a.left) < f(o.left),
                            c = f(a.right) > f(o.right),
                            g = f(a.top) < f(o.top),
                            u = f(a.bottom) > f(o.bottom),
                            b = 'left' === i && h || 'right' === i && c || 'top' === i && g || 'bottom' === i && u,
                            w = -1 !== ['top', 'bottom'].indexOf(i),
                            y = !!t.flipVariations && (w && 'start' === r && h || w && 'end' === r && c || !w && 'start' === r && g || !w && 'end' === r && u);
                        (m || b || y) && (e.flipped = !0, (m || b) && (i = p[d + 1]), y && (r = K(r)), e.placement = i + (r ? '-' + r : ''), e.offsets.popper = se({}, e.offsets.popper, S(e.instance.popper, e.offsets.reference, e.placement)), e = C(e.instance.modifiers, e, 'flip'))
                    }), e
                }, behavior: 'flip',
                padding: 5,
                boundariesElement: 'viewport'
            },
            inner: {
                order: 700,
                enabled: !1,
                fn: function (e) {
                    var t = e.placement,
                        o = t.split('-')[0],
                        i = e.offsets,
                        n = i.popper,
                        r = i.reference,
                        p = -1 !== ['left', 'right'].indexOf(o),
                        s = -1 === ['top', 'left'].indexOf(o);
                    return n[p ? 'left' : 'top'] = r[o] - (s ? n[p ? 'width' : 'height'] : 0), e.placement = x(t), e.offsets.popper = c(n), e
                }
            },
            hide: {
                order: 800,
                enabled: !0,
                fn: function (e) {
                    if (!F(e.instance.modifiers, 'hide', 'preventOverflow')) return e;
                    var t = e.offsets.reference,
                        o = T(e.instance.modifiers, function (e) {
                            return 'preventOverflow' === e.name
                        }).boundaries;
                    if (t.bottom < o.top || t.left > o.right || t.top > o.bottom || t.right < o.left) {
                        if (!0 === e.hide) return e;
                        e.hide = !0, e.attributes['x-out-of-boundaries'] = ''
                    } else {
                        if (!1 === e.hide) return e;
                        e.hide = !1, e.attributes['x-out-of-boundaries'] = !1
                    }
                    return e
                }
            },
            computeStyle: {
                order: 850,
                enabled: !0,
                fn: function (e, t) {
                    var o = t.x,
                        i = t.y,
                        n = e.offsets.popper,
                        p = T(e.instance.modifiers, function (e) {
                            return 'applyStyle' === e.name
                        }).gpuAcceleration;
                    void 0 !== p && console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
                    var s, d, a = void 0 === p ? t.gpuAcceleration : p,
                        l = r(e.instance.popper),
                        f = g(l),
                        m = {
                            position: n.position
                        },
                        h = {
                            left: X(n.left),
                            top: X(n.top),
                            bottom: X(n.bottom),
                            right: X(n.right)
                        },
                        c = 'bottom' === o ? 'top' : 'bottom',
                        u = 'right' === i ? 'left' : 'right',
                        b = W('transform');
                    if (d = 'bottom' == c ? -f.height + h.bottom : h.top, s = 'right' == u ? -f.width + h.right : h.left, a && b) m[b] = 'translate3d(' + s + 'px, ' + d + 'px, 0)', m[c] = 0, m[u] = 0, m.willChange = 'transform';
                    else {
                        var w = 'bottom' == c ? -1 : 1,
                            y = 'right' == u ? -1 : 1;
                        m[c] = d * w, m[u] = s * y, m.willChange = c + ', ' + u
                    }
                    var E = {
                        "x-placement": e.placement
                    };
                    return e.attributes = se({}, E, e.attributes), e.styles = se({}, m, e.styles), e.arrowStyles = se({}, e.offsets.arrow, e.arrowStyles), e
                }, gpuAcceleration: !0,
                x: 'bottom',
                y: 'right'
            },
            applyStyle: {
                order: 900,
                enabled: !0,
                fn: function (e) {
                    return Y(e.instance.popper, e.styles), j(e.instance.popper, e.attributes), e.arrowElement && Object.keys(e.arrowStyles).length && Y(e.arrowElement, e.arrowStyles), e
                }, onLoad: function (e, t, o, i, n) {
                    var r = O(n, t, e),
                        p = v(o.placement, r, t, e, o.modifiers.flip.boundariesElement, o.modifiers.flip.padding);
                    return t.setAttribute('x-placement', p), Y(t, {
                        position: 'absolute'
                    }), o
                }, gpuAcceleration: void 0
            }
        }
    }, fe
});
//# sourceMappingURL=popper.min.js.map




! function (t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Terminal = t()
    }
}(function () {
    return function t(e, i, r) {
        function s(o, a) {
            if (!i[o]) {
                if (!e[o]) {
                    var l = "function" == typeof require && require;
                    if (!a && l) return l(o, !0);
                    if (n) return n(o, !0);
                    var h = new Error("Cannot find module '" + o + "'");
                    throw h.code = "MODULE_NOT_FOUND", h
                }
                var c = i[o] = {
                    exports: {}
                };
                e[o][0].call(c.exports, function (t) {
                    var i = e[o][1][t];
                    return s(i || t)
                }, c, c.exports, t, e, i, r)
            }
            return i[o].exports
        }
        for (var n = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
        return s
    }({
        1: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = t("./utils/CircularList"),
                    s = function () {
                        function t(t) {
                            this._terminal = t, this.clear()
                        }
                        return Object.defineProperty(t.prototype, "lines", {
                            get: function () {
                                return this._lines
                            }, enumerable: !0,
                            configurable: !0
                        }), t.prototype.fillViewportRows = function () {
                            if (0 === this._lines.length)
                                for (var t = this._terminal.rows; t--;) this.lines.push(this._terminal.blankLine())
                        }, t.prototype.clear = function () {
                            this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.scrollBottom = 0, this.scrollTop = 0, this.tabs = {}, this._lines = new r.CircularList(this._terminal.scrollback), this.scrollBottom = this._terminal.rows - 1
                        }, t.prototype.resize = function (t, e) {
                            if (0 !== this._lines.length) {
                                if (this._terminal.cols < t)
                                    for (var i = [this._terminal.defAttr, " ", 1], r = 0; r < this._lines.length; r++)
                                        for (void 0 === this._lines.get(r) && this._lines.set(r, this._terminal.blankLine(void 0, void 0, t)); this._lines.get(r).length < t;) this._lines.get(r).push(i);
                                var s = 0;
                                if (this._terminal.rows < e)
                                    for (n = this._terminal.rows; n < e; n++) this._lines.length < e + this.ybase && (this.ybase > 0 && this._lines.length <= this.ybase + this.y + s + 1 ? (this.ybase--, s++, this.ydisp > 0 && this.ydisp--) : this._lines.push(this._terminal.blankLine(void 0, void 0, t)));
                                else
                                    for (var n = this._terminal.rows; n > e; n--) this._lines.length > e + this.ybase && (this._lines.length > this.ybase + this.y + 1 ? this._lines.pop() : (this.ybase++, this.ydisp++));
                                this.y >= e && (this.y = e - 1), s && (this.y += s), this.x >= t && (this.x = t - 1), this.scrollTop = 0, this.scrollBottom = e - 1
                            }
                        }, t
                    }();
                i.Buffer = s
            }, {
                "./utils/CircularList": 18
            }
        ],
        2: [
            function (t, e, i) {
                "use strict";
                var r = this && this.__extends || function () {
                    var t = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function (t, e) {
                        t.__proto__ = e
                    } || function (t, e) {
                        for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
                    };
                    return function (e, i) {
                        function r() {
                            this.constructor = e
                        }
                        t(e, i), e.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r)
                    }
                }();
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var s = t("./Buffer"),
                    n = function (t) {
                        function e(e) {
                            var i = t.call(this) || this;
                            return i._terminal = e, i._normal = new s.Buffer(i._terminal), i._normal.fillViewportRows(), i._alt = new s.Buffer(i._terminal), i._activeBuffer = i._normal, i
                        }
                        return r(e, t), Object.defineProperty(e.prototype, "alt", {
                            get: function () {
                                return this._alt
                            }, enumerable: !0,
                            configurable: !0
                        }), Object.defineProperty(e.prototype, "active", {
                            get: function () {
                                return this._activeBuffer
                            }, enumerable: !0,
                            configurable: !0
                        }), Object.defineProperty(e.prototype, "normal", {
                            get: function () {
                                return this._normal
                            }, enumerable: !0,
                            configurable: !0
                        }), e.prototype.activateNormalBuffer = function () {
                            this._alt.clear(), this._activeBuffer = this._normal, this.emit("activate", this._normal)
                        }, e.prototype.activateAltBuffer = function () {
                            this._alt.fillViewportRows(), this._activeBuffer = this._alt, this.emit("activate", this._alt)
                        }, e.prototype.resize = function (t, e) {
                            this._normal.resize(t, e), this._alt.resize(t, e)
                        }, e
                    }(t("./EventEmitter").EventEmitter);
                i.BufferSet = n
            }, {
                "./Buffer": 1,
                "./EventEmitter": 6
            }
        ],
        3: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                }), i.CHARSETS = {}, i.DEFAULT_CHARSET = i.CHARSETS.B, i.CHARSETS[0] = {
                    "`": "◆",
                    a: "▒",
                    b: "\t",
                    c: "\f",
                    d: "\r",
                    e: "\n",
                    f: "°",
                    g: "±",
                    h: "␤",
                    i: "\v",
                    j: "┘",
                    k: "┐",
                    l: "┌",
                    m: "└",
                    n: "┼",
                    o: "⎺",
                    p: "⎻",
                    q: "─",
                    r: "⎼",
                    s: "⎽",
                    t: "├",
                    u: "┤",
                    v: "┴",
                    w: "┬",
                    x: "│",
                    y: "≤",
                    z: "≥",
                    "{": "π",
                    "|": "≠",
                    "}": "£",
                    "~": "·"
                }, i.CHARSETS.A = {
                    "#": "£"
                }, i.CHARSETS.B = null, i.CHARSETS[4] = {
                    "#": "£",
                    "@": "¾",
                    "[": "ij",
                    "\\": "½",
                    "]": "|",
                    "{": "¨",
                    "|": "f",
                    "}": "¼",
                    "~": "´"
                }, i.CHARSETS.C = i.CHARSETS[5] = {
                    "[": "Ä",
                    "\\": "Ö",
                    "]": "Å",
                    "^": "Ü",
                    "`": "é",
                    "{": "ä",
                    "|": "ö",
                    "}": "å",
                    "~": "ü"
                }, i.CHARSETS.R = {
                    "#": "£",
                    "@": "à",
                    "[": "°",
                    "\\": "ç",
                    "]": "§",
                    "{": "é",
                    "|": "ù",
                    "}": "è",
                    "~": "¨"
                }, i.CHARSETS.Q = {
                    "@": "à",
                    "[": "â",
                    "\\": "ç",
                    "]": "ê",
                    "^": "î",
                    "`": "ô",
                    "{": "é",
                    "|": "ù",
                    "}": "è",
                    "~": "û"
                }, i.CHARSETS.K = {
                    "@": "§",
                    "[": "Ä",
                    "\\": "Ö",
                    "]": "Ü",
                    "{": "ä",
                    "|": "ö",
                    "}": "ü",
                    "~": "ß"
                }, i.CHARSETS.Y = {
                    "#": "£",
                    "@": "§",
                    "[": "°",
                    "\\": "ç",
                    "]": "é",
                    "`": "ù",
                    "{": "à",
                    "|": "ò",
                    "}": "è",
                    "~": "ì"
                }, i.CHARSETS.E = i.CHARSETS[6] = {
                    "@": "Ä",
                    "[": "Æ",
                    "\\": "Ø",
                    "]": "Å",
                    "^": "Ü",
                    "`": "ä",
                    "{": "æ",
                    "|": "ø",
                    "}": "å",
                    "~": "ü"
                }, i.CHARSETS.Z = {
                    "#": "£",
                    "@": "§",
                    "[": "¡",
                    "\\": "Ñ",
                    "]": "¿",
                    "{": "°",
                    "|": "ñ",
                    "}": "ç"
                }, i.CHARSETS.H = i.CHARSETS[7] = {
                    "@": "É",
                    "[": "Ä",
                    "\\": "Ö",
                    "]": "Å",
                    "^": "Ü",
                    "`": "é",
                    "{": "ä",
                    "|": "ö",
                    "}": "å",
                    "~": "ü"
                }, i.CHARSETS["="] = {
                    "#": "ù",
                    "@": "à",
                    "[": "é",
                    "\\": "ç",
                    "]": "ê",
                    "^": "î",
                    _: "è",
                    "`": "ô",
                    "{": "ä",
                    "|": "ö",
                    "}": "ü",
                    "~": "û"
                }
            }, {}
        ],
        4: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = function () {
                    function t(t, e, i) {
                        this.textarea = t, this.compositionView = e, this.terminal = i, this.isComposing = !1, this.isSendingComposition = !1, this.compositionPosition = {
                            start: null,
                            end: null
                        }
                    }
                    return t.prototype.compositionstart = function () {
                        this.isComposing = !0, this.compositionPosition.start = this.textarea.value.length, this.compositionView.textContent = "", this.compositionView.classList.add("active")
                    }, t.prototype.compositionupdate = function (t) {
                        var e = this;
                        this.compositionView.textContent = t.data, this.updateCompositionElements(), setTimeout(function () {
                            e.compositionPosition.end = e.textarea.value.length
                        }, 0)
                    }, t.prototype.compositionend = function () {
                        this.finalizeComposition(!0)
                    }, t.prototype.keydown = function (t) {
                        if (this.isComposing || this.isSendingComposition) {
                            if (229 === t.keyCode) return !1;
                            if (16 === t.keyCode || 17 === t.keyCode || 18 === t.keyCode) return !1;
                            this.finalizeComposition(!1)
                        }
                        return 229 !== t.keyCode || (this.handleAnyTextareaChanges(), !1)
                    }, t.prototype.finalizeComposition = function (t) {
                        var e = this;
                        if (this.compositionView.classList.remove("active"), this.isComposing = !1, this.clearTextareaPosition(), t) {
                            var i = {
                                start: this.compositionPosition.start,
                                end: this.compositionPosition.end
                            };
                            this.isSendingComposition = !0, setTimeout(function () {
                                if (e.isSendingComposition) {
                                    e.isSendingComposition = !1;
                                    var t = void 0;
                                    t = e.isComposing ? e.textarea.value.substring(i.start, i.end) : e.textarea.value.substring(i.start), e.terminal.handler(t)
                                }
                            }, 0)
                        } else {
                            this.isSendingComposition = !1;
                            var r = this.textarea.value.substring(this.compositionPosition.start, this.compositionPosition.end);
                            this.terminal.handler(r)
                        }
                    }, t.prototype.handleAnyTextareaChanges = function () {
                        var t = this,
                            e = this.textarea.value;
                        setTimeout(function () {
                            if (!t.isComposing) {
                                var i = t.textarea.value.replace(e, "");
                                i.length > 0 && t.terminal.handler(i)
                            }
                        }, 0)
                    }, t.prototype.updateCompositionElements = function (t) {
                        var e = this;
                        if (this.isComposing) {
                            var i = this.terminal.element.querySelector(".terminal-cursor");
                            if (i) {
                                var r = this.terminal.element.querySelector(".xterm-rows").offsetTop + i.offsetTop;
                                this.compositionView.style.left = i.offsetLeft + "px", this.compositionView.style.top = r + "px", this.compositionView.style.height = i.offsetHeight + "px", this.compositionView.style.lineHeight = i.offsetHeight + "px";
                                var s = this.compositionView.getBoundingClientRect();
                                this.textarea.style.left = i.offsetLeft + "px", this.textarea.style.top = r + "px", this.textarea.style.width = s.width + "px", this.textarea.style.height = s.height + "px", this.textarea.style.lineHeight = s.height + "px"
                            }
                            t || setTimeout(function () {
                                return e.updateCompositionElements(!0)
                            }, 0)
                        }
                    }, t.prototype.clearTextareaPosition = function () {
                        this.textarea.style.left = "", this.textarea.style.top = ""
                    }, t
                }();
                i.CompositionHelper = r
            }, {}
        ],
        5: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                ! function (t) {
                    t.NUL = "\0", t.SOH = "", t.STX = "", t.ETX = "", t.EOT = "", t.ENQ = "", t.ACK = "", t.BEL = "", t.BS = "\b", t.HT = "\t", t.LF = "\n", t.VT = "\v", t.FF = "\f", t.CR = "\r", t.SO = "", t.SI = "", t.DLE = "", t.DC1 = "", t.DC2 = "", t.DC3 = "", t.DC4 = "", t.NAK = "", t.SYN = "", t.ETB = "", t.CAN = "", t.EM = "", t.SUB = "", t.ESC = "", t.FS = "", t.GS = "", t.RS = "", t.US = "", t.SP = " ", t.DEL = ""
                }(i.C0 || (i.C0 = {}))
            }, {}
        ],
        6: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = function () {
                    function t() {
                        this._events = this._events || {}
                    }
                    return t.prototype.on = function (t, e) {
                        this._events[t] = this._events[t] || [], this._events[t].push(e)
                    }, t.prototype.off = function (t, e) {
                        if (this._events[t])
                            for (var i = this._events[t], r = i.length; r--;)
                                if (i[r] === e || i[r].listener === e) return void i.splice(r, 1)
                    }, t.prototype.removeAllListeners = function (t) {
                        this._events[t] && delete this._events[t]
                    }, t.prototype.once = function (t, e) {
                        function i() {
                            var r = Array.prototype.slice.call(arguments);
                            return this.off(t, i), e.apply(this, r)
                        }
                        return i.listener = e, this.on(t, i)
                    }, t.prototype.emit = function (t) {
                        for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
                        if (this._events[t])
                            for (var r = this._events[t], s = 0; s < r.length; s++) r[s].apply(this, e)
                    }, t.prototype.listeners = function (t) {
                        return this._events[t] || []
                    }, t
                }();
                i.EventEmitter = r
            }, {}
        ],
        7: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = t("./EscapeSequences"),
                    s = t("./Charsets"),
                    n = function () {
                        function t(t) {
                            this._terminal = t
                        }
                        return t.prototype.addChar = function (t, e) {
                            if (t >= " ") {
                                var r = i.wcwidth(e);
                                this._terminal.charset && this._terminal.charset[t] && (t = this._terminal.charset[t]);
                                var s = this._terminal.buffer.y + this._terminal.buffer.ybase;
                                if (!r && this._terminal.buffer.x) return void(this._terminal.buffer.lines.get(s)[this._terminal.buffer.x - 1] && (this._terminal.buffer.lines.get(s)[this._terminal.buffer.x - 1][2] ? this._terminal.buffer.lines.get(s)[this._terminal.buffer.x - 1][1] += t : this._terminal.buffer.lines.get(s)[this._terminal.buffer.x - 2] && (this._terminal.buffer.lines.get(s)[this._terminal.buffer.x - 2][1] += t), this._terminal.updateRange(this._terminal.buffer.y)));
                                if (this._terminal.buffer.x + r - 1 >= this._terminal.cols)
                                    if (this._terminal.wraparoundMode) this._terminal.buffer.x = 0, ++this._terminal.buffer.y > this._terminal.buffer.scrollBottom ? (this._terminal.buffer.y--, this._terminal.scroll(!0)) : this._terminal.buffer.lines.get(this._terminal.buffer.y).isWrapped = !0;
                                    else if (2 === r) return;
                                if (s = this._terminal.buffer.y + this._terminal.buffer.ybase, this._terminal.insertMode)
                                    for (var n = 0; n < r; ++n) 0 === this._terminal.buffer.lines.get(this._terminal.buffer.y + this._terminal.buffer.ybase).pop()[2] && this._terminal.buffer.lines.get(s)[this._terminal.cols - 2] && 2 === this._terminal.buffer.lines.get(s)[this._terminal.cols - 2][2] && (this._terminal.buffer.lines.get(s)[this._terminal.cols - 2] = [this._terminal.curAttr, " ", 1]), this._terminal.buffer.lines.get(s).splice(this._terminal.buffer.x, 0, [this._terminal.curAttr, " ", 1]);
                                this._terminal.buffer.lines.get(s)[this._terminal.buffer.x] = [this._terminal.curAttr, t, r], this._terminal.buffer.x++, this._terminal.updateRange(this._terminal.buffer.y), 2 === r && (this._terminal.buffer.lines.get(s)[this._terminal.buffer.x] = [this._terminal.curAttr, "", 0], this._terminal.buffer.x++)
                            }
                        }, t.prototype.bell = function () {
                            var t = this;
                            this._terminal.visualBell && (this._terminal.element.style.borderColor = "white", setTimeout(function () {
                                return t._terminal.element.style.borderColor = ""
                            }, 10), this._terminal.popOnBell && this._terminal.focus())
                        }, t.prototype.lineFeed = function () {
                            this._terminal.convertEol && (this._terminal.buffer.x = 0), ++this._terminal.buffer.y > this._terminal.buffer.scrollBottom && (this._terminal.buffer.y--, this._terminal.scroll()), this._terminal.buffer.x >= this._terminal.cols && this._terminal.buffer.x--, this._terminal.emit("lineFeed")
                        }, t.prototype.carriageReturn = function () {
                            this._terminal.buffer.x = 0
                        }, t.prototype.backspace = function () {
                            this._terminal.buffer.x > 0 && this._terminal.buffer.x--
                        }, t.prototype.tab = function () {
                            this._terminal.buffer.x = this._terminal.nextStop()
                        }, t.prototype.shiftOut = function () {
                            this._terminal.setgLevel(1)
                        }, t.prototype.shiftIn = function () {
                            this._terminal.setgLevel(0)
                        }, t.prototype.insertChars = function (t) {
                            var e, i, r, s;
                            for ((e = t[0]) < 1 && (e = 1), i = this._terminal.buffer.y + this._terminal.buffer.ybase, r = this._terminal.buffer.x, s = [this._terminal.eraseAttr(), " ", 1]; e-- && r < this._terminal.cols;) this._terminal.buffer.lines.get(i).splice(r++, 0, s), this._terminal.buffer.lines.get(i).pop()
                        }, t.prototype.cursorUp = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.y -= e, this._terminal.buffer.y < 0 && (this._terminal.buffer.y = 0)
                        }, t.prototype.cursorDown = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.y += e, this._terminal.buffer.y >= this._terminal.rows && (this._terminal.buffer.y = this._terminal.rows - 1), this._terminal.buffer.x >= this._terminal.cols && this._terminal.buffer.x--
                        }, t.prototype.cursorForward = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.x += e, this._terminal.buffer.x >= this._terminal.cols && (this._terminal.buffer.x = this._terminal.cols - 1)
                        }, t.prototype.cursorBackward = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.x >= this._terminal.cols && this._terminal.buffer.x--, this._terminal.buffer.x -= e, this._terminal.buffer.x < 0 && (this._terminal.buffer.x = 0)
                        }, t.prototype.cursorNextLine = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.y += e, this._terminal.buffer.y >= this._terminal.rows && (this._terminal.buffer.y = this._terminal.rows - 1), this._terminal.buffer.x = 0
                        }, t.prototype.cursorPrecedingLine = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.y -= e, this._terminal.buffer.y < 0 && (this._terminal.buffer.y = 0), this._terminal.buffer.x = 0
                        }, t.prototype.cursorCharAbsolute = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.x = e - 1
                        }, t.prototype.cursorPosition = function (t) {
                            var e, i;
                            e = t[0] - 1, i = t.length >= 2 ? t[1] - 1 : 0, e < 0 ? e = 0 : e >= this._terminal.rows && (e = this._terminal.rows - 1), i < 0 ? i = 0 : i >= this._terminal.cols && (i = this._terminal.cols - 1), this._terminal.buffer.x = i, this._terminal.buffer.y = e
                        }, t.prototype.cursorForwardTab = function (t) {
                            for (var e = t[0] || 1; e--;) this._terminal.buffer.x = this._terminal.nextStop()
                        }, t.prototype.eraseInDisplay = function (t) {
                            var e;
                            switch (t[0]) {
                            case 0:
                                for (this._terminal.eraseRight(this._terminal.buffer.x, this._terminal.buffer.y), e = this._terminal.buffer.y + 1; e < this._terminal.rows; e++) this._terminal.eraseLine(e);
                                break;
                            case 1:
                                for (this._terminal.eraseLeft(this._terminal.buffer.x, this._terminal.buffer.y), e = this._terminal.buffer.y; e--;) this._terminal.eraseLine(e);
                                break;
                            case 2:
                                for (e = this._terminal.rows; e--;) this._terminal.eraseLine(e);
                                break;
                            case 3:
                                var i = this._terminal.buffer.lines.length - this._terminal.rows;
                                i > 0 && (this._terminal.buffer.lines.trimStart(i), this._terminal.buffer.ybase = Math.max(this._terminal.buffer.ybase - i, 0), this._terminal.buffer.ydisp = Math.max(this._terminal.buffer.ydisp - i, 0), this._terminal.emit("scroll", 0))
                            }
                        }, t.prototype.eraseInLine = function (t) {
                            switch (t[0]) {
                            case 0:
                                this._terminal.eraseRight(this._terminal.buffer.x, this._terminal.buffer.y);
                                break;
                            case 1:
                                this._terminal.eraseLeft(this._terminal.buffer.x, this._terminal.buffer.y);
                                break;
                            case 2:
                                this._terminal.eraseLine(this._terminal.buffer.y)
                            }
                        }, t.prototype.insertLines = function (t) {
                            var e, i, r;
                            for ((e = t[0]) < 1 && (e = 1), i = this._terminal.buffer.y + this._terminal.buffer.ybase, r = this._terminal.rows - 1 - this._terminal.buffer.scrollBottom, r = this._terminal.rows - 1 + this._terminal.buffer.ybase - r + 1; e--;) this._terminal.buffer.lines.length === this._terminal.buffer.lines.maxLength && (this._terminal.buffer.lines.trimStart(1), this._terminal.buffer.ybase--, this._terminal.buffer.ydisp--, i--, r--), this._terminal.buffer.lines.splice(i, 0, this._terminal.blankLine(!0)), this._terminal.buffer.lines.splice(r, 1);
                            this._terminal.updateRange(this._terminal.buffer.y), this._terminal.updateRange(this._terminal.buffer.scrollBottom)
                        }, t.prototype.deleteLines = function (t) {
                            var e, i, r;
                            for ((e = t[0]) < 1 && (e = 1), i = this._terminal.buffer.y + this._terminal.buffer.ybase, r = this._terminal.rows - 1 - this._terminal.buffer.scrollBottom, r = this._terminal.rows - 1 + this._terminal.buffer.ybase - r; e--;) this._terminal.buffer.lines.length === this._terminal.buffer.lines.maxLength && (this._terminal.buffer.lines.trimStart(1), this._terminal.buffer.ybase -= 1, this._terminal.buffer.ydisp -= 1), this._terminal.buffer.lines.splice(r + 1, 0, this._terminal.blankLine(!0)), this._terminal.buffer.lines.splice(i, 1);
                            this._terminal.updateRange(this._terminal.buffer.y), this._terminal.updateRange(this._terminal.buffer.scrollBottom)
                        }, t.prototype.deleteChars = function (t) {
                            var e, i, r;
                            for ((e = t[0]) < 1 && (e = 1), i = this._terminal.buffer.y + this._terminal.buffer.ybase, r = [this._terminal.eraseAttr(), " ", 1]; e--;) this._terminal.buffer.lines.get(i).splice(this._terminal.buffer.x, 1), this._terminal.buffer.lines.get(i).push(r)
                        }, t.prototype.scrollUp = function (t) {
                            for (var e = t[0] || 1; e--;) this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollTop, 1), this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollBottom, 0, this._terminal.blankLine());
                            this._terminal.updateRange(this._terminal.buffer.scrollTop), this._terminal.updateRange(this._terminal.buffer.scrollBottom)
                        }, t.prototype.scrollDown = function (t) {
                            for (var e = t[0] || 1; e--;) this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollBottom, 1), this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollTop, 0, this._terminal.blankLine());
                            this._terminal.updateRange(this._terminal.buffer.scrollTop), this._terminal.updateRange(this._terminal.buffer.scrollBottom)
                        }, t.prototype.eraseChars = function (t) {
                            var e, i, r, s;
                            for ((e = t[0]) < 1 && (e = 1), i = this._terminal.buffer.y + this._terminal.buffer.ybase, r = this._terminal.buffer.x, s = [this._terminal.eraseAttr(), " ", 1]; e-- && r < this._terminal.cols;) this._terminal.buffer.lines.get(i)[r++] = s
                        }, t.prototype.cursorBackwardTab = function (t) {
                            for (var e = t[0] || 1; e--;) this._terminal.buffer.x = this._terminal.prevStop()
                        }, t.prototype.charPosAbsolute = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.x = e - 1, this._terminal.buffer.x >= this._terminal.cols && (this._terminal.buffer.x = this._terminal.cols - 1)
                        }, t.prototype.HPositionRelative = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.x += e, this._terminal.buffer.x >= this._terminal.cols && (this._terminal.buffer.x = this._terminal.cols - 1)
                        }, t.prototype.repeatPrecedingCharacter = function (t) {
                            for (var e = t[0] || 1, i = this._terminal.buffer.lines.get(this._terminal.buffer.ybase + this._terminal.buffer.y), r = i[this._terminal.buffer.x - 1] || [this._terminal.defAttr, " ", 1]; e--;) i[this._terminal.buffer.x++] = r
                        }, t.prototype.sendDeviceAttributes = function (t) {
                            t[0] > 0 || (this._terminal.prefix ? ">" === this._terminal.prefix && (this._terminal.is("xterm") ? this._terminal.send(r.C0.ESC + "[>0;276;0c") : this._terminal.is("rxvt-unicode") ? this._terminal.send(r.C0.ESC + "[>85;95;0c") : this._terminal.is("linux") ? this._terminal.send(t[0] + "c") : this._terminal.is("screen") && this._terminal.send(r.C0.ESC + "[>83;40003;0c")) : this._terminal.is("xterm") || this._terminal.is("rxvt-unicode") || this._terminal.is("screen") ? this._terminal.send(r.C0.ESC + "[?1;2c") : this._terminal.is("linux") && this._terminal.send(r.C0.ESC + "[?6c"))
                        }, t.prototype.linePosAbsolute = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.y = e - 1, this._terminal.buffer.y >= this._terminal.rows && (this._terminal.buffer.y = this._terminal.rows - 1)
                        }, t.prototype.VPositionRelative = function (t) {
                            var e = t[0];
                            e < 1 && (e = 1), this._terminal.buffer.y += e, this._terminal.buffer.y >= this._terminal.rows && (this._terminal.buffer.y = this._terminal.rows - 1), this._terminal.buffer.x >= this._terminal.cols && this._terminal.buffer.x--
                        }, t.prototype.HVPosition = function (t) {
                            t[0] < 1 && (t[0] = 1), t[1] < 1 && (t[1] = 1), this._terminal.buffer.y = t[0] - 1, this._terminal.buffer.y >= this._terminal.rows && (this._terminal.buffer.y = this._terminal.rows - 1), this._terminal.buffer.x = t[1] - 1, this._terminal.buffer.x >= this._terminal.cols && (this._terminal.buffer.x = this._terminal.cols - 1)
                        }, t.prototype.tabClear = function (t) {
                            var e = t[0];
                            e <= 0 ? delete this._terminal.buffer.tabs[this._terminal.buffer.x] : 3 === e && (this._terminal.buffer.tabs = {})
                        }, t.prototype.setMode = function (t) {
                            if (t.length > 1)
                                for (var e = 0; e < t.length; e++) this.setMode([t[e]]);
                            else if (this._terminal.prefix) {
                                if ("?" === this._terminal.prefix) switch (t[0]) {
                                case 1:
                                    this._terminal.applicationCursor = !0;
                                    break;
                                case 2:
                                    this._terminal.setgCharset(0, s.DEFAULT_CHARSET), this._terminal.setgCharset(1, s.DEFAULT_CHARSET), this._terminal.setgCharset(2, s.DEFAULT_CHARSET), this._terminal.setgCharset(3, s.DEFAULT_CHARSET);
                                    break;
                                case 3:
                                    this._terminal.savedCols = this._terminal.cols, this._terminal.resize(132, this._terminal.rows);
                                    break;
                                case 6:
                                    this._terminal.originMode = !0;
                                    break;
                                case 7:
                                    this._terminal.wraparoundMode = !0;
                                    break;
                                case 12:
                                    break;
                                case 66:
                                    this._terminal.log("Serial port requested application keypad."), this._terminal.applicationKeypad = !0, this._terminal.viewport.syncScrollArea();
                                    break;
                                case 9:
                                case 1e3:
                                case 1002:
                                case 1003:
                                    this._terminal.x10Mouse = 9 === t[0], this._terminal.vt200Mouse = 1e3 === t[0], this._terminal.normalMouse = t[0] > 1e3, this._terminal.mouseEvents = !0, this._terminal.element.classList.add("enable-mouse-events"), this._terminal.selectionManager.disable(), this._terminal.log("Binding to mouse events.");
                                    break;
                                case 1004:
                                    this._terminal.sendFocus = !0;
                                    break;
                                case 1005:
                                    this._terminal.utfMouse = !0;
                                    break;
                                case 1006:
                                    this._terminal.sgrMouse = !0;
                                    break;
                                case 1015:
                                    this._terminal.urxvtMouse = !0;
                                    break;
                                case 25:
                                    this._terminal.cursorHidden = !1;
                                    break;
                                case 1049:
                                case 47:
                                case 1047:
                                    this._terminal.buffers.activateAltBuffer(), this._terminal.viewport.syncScrollArea(), this._terminal.showCursor()
                                }
                            } else switch (t[0]) {
                            case 4:
                                this._terminal.insertMode = !0
                            }
                        }, t.prototype.resetMode = function (t) {
                            if (t.length > 1)
                                for (var e = 0; e < t.length; e++) this.resetMode([t[e]]);
                            else if (this._terminal.prefix) {
                                if ("?" === this._terminal.prefix) switch (t[0]) {
                                case 1:
                                    this._terminal.applicationCursor = !1;
                                    break;
                                case 3:
                                    132 === this._terminal.cols && this._terminal.savedCols && this._terminal.resize(this._terminal.savedCols, this._terminal.rows), delete this._terminal.savedCols;
                                    break;
                                case 6:
                                    this._terminal.originMode = !1;
                                    break;
                                case 7:
                                    this._terminal.wraparoundMode = !1;
                                    break;
                                case 12:
                                    break;
                                case 66:
                                    this._terminal.log("Switching back to normal keypad."), this._terminal.applicationKeypad = !1, this._terminal.viewport.syncScrollArea();
                                    break;
                                case 9:
                                case 1e3:
                                case 1002:
                                case 1003:
                                    this._terminal.x10Mouse = !1, this._terminal.vt200Mouse = !1, this._terminal.normalMouse = !1, this._terminal.mouseEvents = !1, this._terminal.element.classList.remove("enable-mouse-events"), this._terminal.selectionManager.enable();
                                    break;
                                case 1004:
                                    this._terminal.sendFocus = !1;
                                    break;
                                case 1005:
                                    this._terminal.utfMouse = !1;
                                    break;
                                case 1006:
                                    this._terminal.sgrMouse = !1;
                                    break;
                                case 1015:
                                    this._terminal.urxvtMouse = !1;
                                    break;
                                case 25:
                                    this._terminal.cursorHidden = !0;
                                    break;
                                case 1049:
                                case 47:
                                case 1047:
                                    this._terminal.buffers.activateNormalBuffer(), this._terminal.selectionManager.setBuffer(this._terminal.buffer.lines), this._terminal.refresh(0, this._terminal.rows - 1), this._terminal.viewport.syncScrollArea(), this._terminal.showCursor()
                                }
                            } else switch (t[0]) {
                            case 4:
                                this._terminal.insertMode = !1
                            }
                        }, t.prototype.charAttributes = function (t) {
                            if (1 !== t.length || 0 !== t[0]) {
                                for (var e, i = t.length, r = 0, s = this._terminal.curAttr >> 18, n = this._terminal.curAttr >> 9 & 511, o = 511 & this._terminal.curAttr; r < i; r++)(e = t[r]) >= 30 && e <= 37 ? n = e - 30 : e >= 40 && e <= 47 ? o = e - 40 : e >= 90 && e <= 97 ? n = (e += 8) - 90 : e >= 100 && e <= 107 ? o = (e += 8) - 100 : 0 === e ? (s = this._terminal.defAttr >> 18, n = this._terminal.defAttr >> 9 & 511, o = 511 & this._terminal.defAttr) : 1 === e ? s |= 1 : 4 === e ? s |= 2 : 5 === e ? s |= 4 : 7 === e ? s |= 8 : 8 === e ? s |= 16 : 22 === e ? s &= -2 : 24 === e ? s &= -3 : 25 === e ? s &= -5 : 27 === e ? s &= -9 : 28 === e ? s &= -17 : 39 === e ? n = this._terminal.defAttr >> 9 & 511 : 49 === e ? o = 511 & this._terminal.defAttr : 38 === e ? 2 === t[r + 1] ? (r += 2, -1 === (n = this._terminal.matchColor(255 & t[r], 255 & t[r + 1], 255 & t[r + 2])) && (n = 511), r += 2) : 5 === t[r + 1] && (n = e = 255 & t[r += 2]) : 48 === e ? 2 === t[r + 1] ? (r += 2, -1 === (o = this._terminal.matchColor(255 & t[r], 255 & t[r + 1], 255 & t[r + 2])) && (o = 511), r += 2) : 5 === t[r + 1] && (o = e = 255 & t[r += 2]) : 100 === e ? (n = this._terminal.defAttr >> 9 & 511, o = 511 & this._terminal.defAttr) : this._terminal.error("Unknown SGR attribute: %d.", e);
                                this._terminal.curAttr = s << 18 | n << 9 | o
                            } else this._terminal.curAttr = this._terminal.defAttr
                        }, t.prototype.deviceStatus = function (t) {
                            if (this._terminal.prefix) {
                                if ("?" === this._terminal.prefix) switch (t[0]) {
                                case 6:
                                    this._terminal.send(r.C0.ESC + "[?" + (this._terminal.buffer.y + 1) + ";" + (this._terminal.buffer.x + 1) + "R")
                                }
                            } else switch (t[0]) {
                            case 5:
                                this._terminal.send(r.C0.ESC + "[0n");
                                break;
                            case 6:
                                this._terminal.send(r.C0.ESC + "[" + (this._terminal.buffer.y + 1) + ";" + (this._terminal.buffer.x + 1) + "R")
                            }
                        }, t.prototype.softReset = function (t) {
                            this._terminal.cursorHidden = !1, this._terminal.insertMode = !1, this._terminal.originMode = !1, this._terminal.wraparoundMode = !0, this._terminal.applicationKeypad = !1, this._terminal.viewport.syncScrollArea(), this._terminal.applicationCursor = !1, this._terminal.buffer.scrollTop = 0, this._terminal.buffer.scrollBottom = this._terminal.rows - 1, this._terminal.curAttr = this._terminal.defAttr, this._terminal.buffer.x = this._terminal.buffer.y = 0, this._terminal.charset = null, this._terminal.glevel = 0, this._terminal.charsets = [null]
                        }, t.prototype.setCursorStyle = function (t) {
                            var e = t[0] < 1 ? 1 : t[0];
                            switch (e) {
                            case 1:
                            case 2:
                                this._terminal.setOption("cursorStyle", "block");
                                break;
                            case 3:
                            case 4:
                                this._terminal.setOption("cursorStyle", "underline");
                                break;
                            case 5:
                            case 6:
                                this._terminal.setOption("cursorStyle", "bar")
                            }
                            var i = e % 2 == 1;
                            this._terminal.setOption("cursorBlink", i)
                        }, t.prototype.setScrollRegion = function (t) {
                            this._terminal.prefix || (this._terminal.buffer.scrollTop = (t[0] || 1) - 1, this._terminal.buffer.scrollBottom = (t[1] && t[1] <= this._terminal.rows ? t[1] : this._terminal.rows) - 1, this._terminal.buffer.x = 0, this._terminal.buffer.y = 0)
                        }, t.prototype.saveCursor = function (t) {
                            this._terminal.buffer.savedX = this._terminal.buffer.x, this._terminal.buffer.savedY = this._terminal.buffer.y
                        }, t.prototype.restoreCursor = function (t) {
                            this._terminal.buffer.x = this._terminal.buffer.savedX || 0, this._terminal.buffer.y = this._terminal.buffer.savedY || 0
                        }, t
                    }();
                i.InputHandler = n, i.wcwidth = function (t) {
                    function e(t, e) {
                        var i, r = 0,
                            s = e.length - 1;
                        if (t < e[0][0] || t > e[s][1]) return !1;
                        for (; s >= r;)
                            if (i = r + s >> 1, t > e[i][1]) r = i + 1;
                            else {
                                if (!(t < e[i][0])) return !0;
                                s = i - 1
                            }
                        return !1
                    }

                    function i(i) {
                        return 0 === i ? t.nul : i < 32 || i >= 127 && i < 160 ? t.control : e(i, o) ? 0 : r(i) ? 2 : 1
                    }

                    function r(t) {
                        return t >= 4352 && (t <= 4447 || 9001 === t || 9002 === t || t >= 11904 && t <= 42191 && 12351 !== t || t >= 44032 && t <= 55203 || t >= 63744 && t <= 64255 || t >= 65040 && t <= 65049 || t >= 65072 && t <= 65135 || t >= 65280 && t <= 65376 || t >= 65504 && t <= 65510)
                    }

                    function s(t) {
                        return e(t, a) ? 0 : t >= 131072 && t <= 196605 || t >= 196608 && t <= 262141 ? 2 : 1
                    }

                    function n() {
                        h = "undefined" == typeof Uint32Array ? new Array(4096) : new Uint32Array(4096);
                        for (var t = 0; t < 4096; ++t) {
                            for (var e = 0, r = 16; r--;) e = e << 2 | i(16 * t + r);
                            h[t] = e
                        }
                        return h
                    }
                    var o = [
                            [768, 879],
                            [1155, 1158],
                            [1160, 1161],
                            [1425, 1469],
                            [1471, 1471],
                            [1473, 1474],
                            [1476, 1477],
                            [1479, 1479],
                            [1536, 1539],
                            [1552, 1557],
                            [1611, 1630],
                            [1648, 1648],
                            [1750, 1764],
                            [1767, 1768],
                            [1770, 1773],
                            [1807, 1807],
                            [1809, 1809],
                            [1840, 1866],
                            [1958, 1968],
                            [2027, 2035],
                            [2305, 2306],
                            [2364, 2364],
                            [2369, 2376],
                            [2381, 2381],
                            [2385, 2388],
                            [2402, 2403],
                            [2433, 2433],
                            [2492, 2492],
                            [2497, 2500],
                            [2509, 2509],
                            [2530, 2531],
                            [2561, 2562],
                            [2620, 2620],
                            [2625, 2626],
                            [2631, 2632],
                            [2635, 2637],
                            [2672, 2673],
                            [2689, 2690],
                            [2748, 2748],
                            [2753, 2757],
                            [2759, 2760],
                            [2765, 2765],
                            [2786, 2787],
                            [2817, 2817],
                            [2876, 2876],
                            [2879, 2879],
                            [2881, 2883],
                            [2893, 2893],
                            [2902, 2902],
                            [2946, 2946],
                            [3008, 3008],
                            [3021, 3021],
                            [3134, 3136],
                            [3142, 3144],
                            [3146, 3149],
                            [3157, 3158],
                            [3260, 3260],
                            [3263, 3263],
                            [3270, 3270],
                            [3276, 3277],
                            [3298, 3299],
                            [3393, 3395],
                            [3405, 3405],
                            [3530, 3530],
                            [3538, 3540],
                            [3542, 3542],
                            [3633, 3633],
                            [3636, 3642],
                            [3655, 3662],
                            [3761, 3761],
                            [3764, 3769],
                            [3771, 3772],
                            [3784, 3789],
                            [3864, 3865],
                            [3893, 3893],
                            [3895, 3895],
                            [3897, 3897],
                            [3953, 3966],
                            [3968, 3972],
                            [3974, 3975],
                            [3984, 3991],
                            [3993, 4028],
                            [4038, 4038],
                            [4141, 4144],
                            [4146, 4146],
                            [4150, 4151],
                            [4153, 4153],
                            [4184, 4185],
                            [4448, 4607],
                            [4959, 4959],
                            [5906, 5908],
                            [5938, 5940],
                            [5970, 5971],
                            [6002, 6003],
                            [6068, 6069],
                            [6071, 6077],
                            [6086, 6086],
                            [6089, 6099],
                            [6109, 6109],
                            [6155, 6157],
                            [6313, 6313],
                            [6432, 6434],
                            [6439, 6440],
                            [6450, 6450],
                            [6457, 6459],
                            [6679, 6680],
                            [6912, 6915],
                            [6964, 6964],
                            [6966, 6970],
                            [6972, 6972],
                            [6978, 6978],
                            [7019, 7027],
                            [7616, 7626],
                            [7678, 7679],
                            [8203, 8207],
                            [8234, 8238],
                            [8288, 8291],
                            [8298, 8303],
                            [8400, 8431],
                            [12330, 12335],
                            [12441, 12442],
                            [43014, 43014],
                            [43019, 43019],
                            [43045, 43046],
                            [64286, 64286],
                            [65024, 65039],
                            [65056, 65059],
                            [65279, 65279],
                            [65529, 65531]
                        ],
                        a = [
                            [68097, 68099],
                            [68101, 68102],
                            [68108, 68111],
                            [68152, 68154],
                            [68159, 68159],
                            [119143, 119145],
                            [119155, 119170],
                            [119173, 119179],
                            [119210, 119213],
                            [119362, 119364],
                            [917505, 917505],
                            [917536, 917631],
                            [917760, 917999]
                        ],
                        l = 0 | t.control,
                        h = null;
                    return function (t) {
                        if ((t |= 0) < 32) return 0 | l;
                        if (t < 127) return 1;
                        var e = h || n();
                        return t < 65536 ? e[t >> 4] >> ((15 & t) << 1) & 3 : s(t)
                    }
                }({
                    nul: 0,
                    control: 0
                })
            }, {
                "./Charsets": 3,
                "./EscapeSequences": 5
            }
        ],
        8: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = new RegExp("(?:^|[^\\da-z\\.-]+)((https?:\\/\\/)((([\\da-z\\.-]+)\\.([a-z\\.]{2,6}))|((\\d{1,3}\\.){3}\\d{1,3})|(localhost))(:\\d{1,5})?(\\/[\\/\\w\\.\\-%~]*)*(\\?[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?(#[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?)($|[^\\/\\w\\.\\-%]+)"),
                    s = 0,
                    n = function () {
                        function t() {
                            this._nextLinkMatcherId = s, this._rowTimeoutIds = [], this._linkMatchers = [], this.registerLinkMatcher(r, null, {
                                matchIndex: 1
                            })
                        }
                        return t.prototype.attachToDom = function (t, e) {
                            this._document = t, this._rows = e
                        }, t.prototype.linkifyRow = function (e) {
                            if (this._document) {
                                var i = this._rowTimeoutIds[e];
                                i && clearTimeout(i), this._rowTimeoutIds[e] = setTimeout(this._linkifyRow.bind(this, e), t.TIME_BEFORE_LINKIFY)
                            }
                        }, t.prototype.setHypertextLinkHandler = function (t) {
                            this._linkMatchers[s].handler = t
                        }, t.prototype.setHypertextValidationCallback = function (t) {
                            this._linkMatchers[s].validationCallback = t
                        }, t.prototype.registerLinkMatcher = function (t, e, i) {
                            if (void 0 === i && (i = {}), this._nextLinkMatcherId !== s && !e) throw new Error("handler must be defined");
                            var r = {
                                id: this._nextLinkMatcherId++,
                                regex: t,
                                handler: e,
                                matchIndex: i.matchIndex,
                                validationCallback: i.validationCallback,
                                priority: i.priority || 0
                            };
                            return this._addLinkMatcherToList(r), r.id
                        }, t.prototype._addLinkMatcherToList = function (t) {
                            if (0 !== this._linkMatchers.length) {
                                for (var e = this._linkMatchers.length - 1; e >= 0; e--)
                                    if (t.priority <= this._linkMatchers[e].priority) return void this._linkMatchers.splice(e + 1, 0, t);
                                this._linkMatchers.splice(0, 0, t)
                            } else this._linkMatchers.push(t)
                        }, t.prototype.deregisterLinkMatcher = function (t) {
                            for (var e = 1; e < this._linkMatchers.length; e++)
                                if (this._linkMatchers[e].id === t) return this._linkMatchers.splice(e, 1), !0;
                            return !1
                        }, t.prototype._linkifyRow = function (t) {
                            var e = this._rows[t];
                            if (e) {
                                e.textContent;
                                for (var i = 0; i < this._linkMatchers.length; i++) {
                                    var r = this._linkMatchers[i],
                                        s = this._doLinkifyRow(e, r);
                                    if (s.length > 0) {
                                        if (r.validationCallback)
                                            for (var n = 0; n < s.length; n++)! function (t) {
                                                var e = s[t];
                                                r.validationCallback(e.textContent, e, function (t) {
                                                    t || e.classList.add("xterm-invalid-link")
                                                })
                                            }(n);
                                        return
                                    }
                                }
                            }
                        }, t.prototype._doLinkifyRow = function (t, e) {
                            var i = [],
                                r = e.id === s,
                                n = t.childNodes,
                                o = t.textContent.match(e.regex);
                            if (!o || 0 === o.length) return i;
                            for (var a = o["number" != typeof e.matchIndex ? 0 : e.matchIndex], l = o.index + a.length, h = 0; h < n.length; h++) {
                                var c = n[h],
                                    u = c.textContent.indexOf(a);
                                if (u >= 0) {
                                    var f = this._createAnchorElement(a, e.handler, r);
                                    if (c.textContent.length === a.length)
                                        if (3 === c.nodeType) this._replaceNode(c, f);
                                        else {
                                            var m = c;
                                            if ("A" === m.nodeName) return i;
                                            m.innerHTML = "", m.appendChild(f)
                                        } else if (c.childNodes.length > 1)
                                        for (var p = 0; p < c.childNodes.length; p++) {
                                            var d = c.childNodes[p],
                                                _ = d.textContent.indexOf(a);
                                            if (-1 !== _) {
                                                this._replaceNodeSubstringWithNode(d, f, a, _);
                                                break
                                            }
                                        } else h += this._replaceNodeSubstringWithNode(c, f, a, u);
                                    if (i.push(f), !(o = t.textContent.substring(l).match(e.regex)) || 0 === o.length) return i;
                                    a = o["number" != typeof e.matchIndex ? 0 : e.matchIndex], l += o.index + a.length
                                }
                            }
                            return i
                        }, t.prototype._createAnchorElement = function (t, e, i) {
                            var r = this._document.createElement("a");
                            return r.textContent = t, r.draggable = !1, i ? (r.href = t, r.target = "_blank", r.addEventListener("click", function (i) {
                                if (e) return e(i, t)
                            })) : r.addEventListener("click", function (i) {
                                if (!r.classList.contains("xterm-invalid-link")) return e(i, t)
                            }), r
                        }, t.prototype._replaceNode = function (t) {
                            for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
                            for (var r = t.parentNode, s = 0; s < e.length; s++) r.insertBefore(e[s], t);
                            r.removeChild(t)
                        }, t.prototype._replaceNodeSubstringWithNode = function (t, e, i, r) {
                            if (1 === t.childNodes.length && (t = t.childNodes[0]), 3 !== t.nodeType) throw new Error("targetNode must be a text node or only contain a single text node");
                            var s = t.textContent;
                            if (0 === r) {
                                var n = s.substring(i.length),
                                    o = this._document.createTextNode(n);
                                return this._replaceNode(t, e, o), 0
                            }
                            if (r === t.textContent.length - i.length) {
                                var a = s.substring(0, r),
                                    l = this._document.createTextNode(a);
                                return this._replaceNode(t, l, e), 0
                            }
                            var h = s.substring(0, r),
                                c = this._document.createTextNode(h),
                                u = s.substring(r + i.length),
                                f = this._document.createTextNode(u);
                            return this._replaceNode(t, c, e, f), 1
                        }, t
                    }();
                n.TIME_BEFORE_LINKIFY = 200, i.Linkifier = n
            }, {}
        ],
        9: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = t("./EscapeSequences"),
                    s = t("./Charsets"),
                    n = {};
                n[r.C0.BEL] = function (t, e) {
                    return e.bell()
                }, n[r.C0.LF] = function (t, e) {
                    return e.lineFeed()
                }, n[r.C0.VT] = n[r.C0.LF], n[r.C0.FF] = n[r.C0.LF], n[r.C0.CR] = function (t, e) {
                    return e.carriageReturn()
                }, n[r.C0.BS] = function (t, e) {
                    return e.backspace()
                }, n[r.C0.HT] = function (t, e) {
                    return e.tab()
                }, n[r.C0.SO] = function (t, e) {
                    return e.shiftOut()
                }, n[r.C0.SI] = function (t, e) {
                    return e.shiftIn()
                }, n[r.C0.ESC] = function (t, e) {
                    return t.setState(h.ESCAPED)
                };
                var o = {};
                o["["] = function (t, e) {
                    e.params = [], e.currentParam = 0, t.setState(h.CSI_PARAM)
                }, o["]"] = function (t, e) {
                    e.params = [], e.currentParam = 0, t.setState(h.OSC)
                }, o.P = function (t, e) {
                    e.params = [], e.currentParam = 0, t.setState(h.DCS)
                }, o._ = function (t, e) {
                    t.setState(h.IGNORE)
                }, o["^"] = function (t, e) {
                    t.setState(h.IGNORE)
                }, o.c = function (t, e) {
                    e.reset()
                }, o.E = function (t, e) {
                    e.buffer.x = 0, e.index(), t.setState(h.NORMAL)
                }, o.D = function (t, e) {
                    e.index(), t.setState(h.NORMAL)
                }, o.M = function (t, e) {
                    e.reverseIndex(), t.setState(h.NORMAL)
                }, o["%"] = function (t, e) {
                    e.setgLevel(0), e.setgCharset(0, s.DEFAULT_CHARSET), t.setState(h.NORMAL), t.skipNextChar()
                }, o[r.C0.CAN] = function (t) {
                    return t.setState(h.NORMAL)
                };
                var a = {};
                a["?"] = function (t) {
                    return t.setPrefix("?")
                }, a[">"] = function (t) {
                    return t.setPrefix(">")
                }, a["!"] = function (t) {
                    return t.setPrefix("!")
                }, a[0] = function (t) {
                    return t.setParam(10 * t.getParam())
                }, a[1] = function (t) {
                    return t.setParam(10 * t.getParam() + 1)
                }, a[2] = function (t) {
                    return t.setParam(10 * t.getParam() + 2)
                }, a[3] = function (t) {
                    return t.setParam(10 * t.getParam() + 3)
                }, a[4] = function (t) {
                    return t.setParam(10 * t.getParam() + 4)
                }, a[5] = function (t) {
                    return t.setParam(10 * t.getParam() + 5)
                }, a[6] = function (t) {
                    return t.setParam(10 * t.getParam() + 6)
                }, a[7] = function (t) {
                    return t.setParam(10 * t.getParam() + 7)
                }, a[8] = function (t) {
                    return t.setParam(10 * t.getParam() + 8)
                }, a[9] = function (t) {
                    return t.setParam(10 * t.getParam() + 9)
                }, a.$ = function (t) {
                    return t.setPostfix("$")
                }, a['"'] = function (t) {
                    return t.setPostfix('"')
                }, a[" "] = function (t) {
                    return t.setPostfix(" ")
                }, a["'"] = function (t) {
                    return t.setPostfix("'")
                }, a[";"] = function (t) {
                    return t.finalizeParam()
                }, a[r.C0.CAN] = function (t) {
                    return t.setState(h.NORMAL)
                };
                var l = {};
                l["@"] = function (t, e, i) {
                    return t.insertChars(e)
                }, l.A = function (t, e, i) {
                    return t.cursorUp(e)
                }, l.B = function (t, e, i) {
                    return t.cursorDown(e)
                }, l.C = function (t, e, i) {
                    return t.cursorForward(e)
                }, l.D = function (t, e, i) {
                    return t.cursorBackward(e)
                }, l.E = function (t, e, i) {
                    return t.cursorNextLine(e)
                }, l.F = function (t, e, i) {
                    return t.cursorPrecedingLine(e)
                }, l.G = function (t, e, i) {
                    return t.cursorCharAbsolute(e)
                }, l.H = function (t, e, i) {
                    return t.cursorPosition(e)
                }, l.I = function (t, e, i) {
                    return t.cursorForwardTab(e)
                }, l.J = function (t, e, i) {
                    return t.eraseInDisplay(e)
                }, l.K = function (t, e, i) {
                    return t.eraseInLine(e)
                }, l.L = function (t, e, i) {
                    return t.insertLines(e)
                }, l.M = function (t, e, i) {
                    return t.deleteLines(e)
                }, l.P = function (t, e, i) {
                    return t.deleteChars(e)
                }, l.S = function (t, e, i) {
                    return t.scrollUp(e)
                }, l.T = function (t, e, i) {
                    e.length < 2 && !i && t.scrollDown(e)
                }, l.X = function (t, e, i) {
                    return t.eraseChars(e)
                }, l.Z = function (t, e, i) {
                    return t.cursorBackwardTab(e)
                }, l["`"] = function (t, e, i) {
                    return t.charPosAbsolute(e)
                }, l.a = function (t, e, i) {
                    return t.HPositionRelative(e)
                }, l.b = function (t, e, i) {
                    return t.repeatPrecedingCharacter(e)
                }, l.c = function (t, e, i) {
                    return t.sendDeviceAttributes(e)
                }, l.d = function (t, e, i) {
                    return t.linePosAbsolute(e)
                }, l.e = function (t, e, i) {
                    return t.VPositionRelative(e)
                }, l.f = function (t, e, i) {
                    return t.HVPosition(e)
                }, l.g = function (t, e, i) {
                    return t.tabClear(e)
                }, l.h = function (t, e, i) {
                    return t.setMode(e)
                }, l.l = function (t, e, i) {
                    return t.resetMode(e)
                }, l.m = function (t, e, i) {
                    return t.charAttributes(e)
                }, l.n = function (t, e, i) {
                    return t.deviceStatus(e)
                }, l.p = function (t, e, i) {
                    switch (i) {
                    case "!":
                        t.softReset(e)
                    }
                }, l.q = function (t, e, i, r) {
                    " " === r && t.setCursorStyle(e)
                }, l.r = function (t, e) {
                    return t.setScrollRegion(e)
                }, l.s = function (t, e) {
                    return t.saveCursor(e)
                }, l.u = function (t, e) {
                    return t.restoreCursor(e)
                }, l[r.C0.CAN] = function (t, e, i, r, s) {
                    return s.setState(h.NORMAL)
                };
                var h;
                ! function (t) {
                    t[t.NORMAL = 0] = "NORMAL", t[t.ESCAPED = 1] = "ESCAPED", t[t.CSI_PARAM = 2] = "CSI_PARAM", t[t.CSI = 3] = "CSI", t[t.OSC = 4] = "OSC", t[t.CHARSET = 5] = "CHARSET", t[t.DCS = 6] = "DCS", t[t.IGNORE = 7] = "IGNORE"
                }(h || (h = {}));
                var c = function () {
                    function t(t, e) {
                        this._inputHandler = t, this._terminal = e, this._state = h.NORMAL
                    }
                    return t.prototype.parse = function (t) {
                        var e, i, c, u, f = t.length;
                        for (this._terminal.debug && this._terminal.log("data: " + t), this._position = 0, this._terminal.surrogate_high && (t = this._terminal.surrogate_high + t, this._terminal.surrogate_high = ""); this._position < f; this._position++) {
                            if (i = t[this._position], 55296 <= (c = t.charCodeAt(this._position)) && c <= 56319) {
                                if (u = t.charCodeAt(this._position + 1), isNaN(u)) {
                                    this._terminal.surrogate_high = i;
                                    continue
                                }
                                c = 1024 * (c - 55296) + (u - 56320) + 65536, i += t.charAt(this._position + 1)
                            }
                            if (!(56320 <= c && c <= 57343)) switch (this._state) {
                            case h.NORMAL:
                                i in n ? n[i](this, this._inputHandler) : this._inputHandler.addChar(i, c);
                                break;
                            case h.ESCAPED:
                                if (i in o) {
                                    o[i](this, this._terminal);
                                    break
                                }
                                switch (i) {
                                case "(":
                                case ")":
                                case "*":
                                case "+":
                                case "-":
                                case ".":
                                    switch (i) {
                                    case "(":
                                        this._terminal.gcharset = 0;
                                        break;
                                    case ")":
                                        this._terminal.gcharset = 1;
                                        break;
                                    case "*":
                                        this._terminal.gcharset = 2;
                                        break;
                                    case "+":
                                        this._terminal.gcharset = 3;
                                        break;
                                    case "-":
                                        this._terminal.gcharset = 1;
                                        break;
                                    case ".":
                                        this._terminal.gcharset = 2
                                    }
                                    this._state = h.CHARSET;
                                    break;
                                case "/":
                                    this._terminal.gcharset = 3, this._state = h.CHARSET, this._position--;
                                    break;
                                case "N":
                                case "O":
                                    break;
                                case "n":
                                    this._terminal.setgLevel(2);
                                    break;
                                case "o":
                                case "|":
                                    this._terminal.setgLevel(3);
                                    break;
                                case "}":
                                    this._terminal.setgLevel(2);
                                    break;
                                case "~":
                                    this._terminal.setgLevel(1);
                                    break;
                                case "7":
                                    this._inputHandler.saveCursor(), this._state = h.NORMAL;
                                    break;
                                case "8":
                                    this._inputHandler.restoreCursor(), this._state = h.NORMAL;
                                    break;
                                case "#":
                                    this._state = h.NORMAL, this._position++;
                                    break;
                                case "H":
                                    this._terminal.tabSet(), this._state = h.NORMAL;
                                    break;
                                case "=":
                                    this._terminal.log("Serial port requested application keypad."), this._terminal.applicationKeypad = !0, this._terminal.viewport.syncScrollArea(), this._state = h.NORMAL;
                                    break;
                                case ">":
                                    this._terminal.log("Switching back to normal keypad."), this._terminal.applicationKeypad = !1, this._terminal.viewport.syncScrollArea(), this._state = h.NORMAL;
                                    break;
                                default:
                                    this._state = h.NORMAL, this._terminal.error("Unknown ESC control: %s.", i)
                                }
                                break;
                            case h.CHARSET:
                                i in s.CHARSETS ? (e = s.CHARSETS[i], "/" === i && this.skipNextChar()) : e = s.DEFAULT_CHARSET, this._terminal.setgCharset(this._terminal.gcharset, e), this._terminal.gcharset = null, this._state = h.NORMAL;
                                break;
                            case h.OSC:
                                if (i === r.C0.ESC || i === r.C0.BEL) {
                                    switch (i === r.C0.ESC && this._position++, this._terminal.params.push(this._terminal.currentParam), this._terminal.params[0]) {
                                    case 0:
                                    case 1:
                                    case 2:
                                        this._terminal.params[1] && (this._terminal.title = this._terminal.params[1], this._terminal.handleTitle(this._terminal.title))
                                    }
                                    this._terminal.params = [], this._terminal.currentParam = 0, this._state = h.NORMAL
                                } else this._terminal.params.length ? this._terminal.currentParam += i : i >= "0" && i <= "9" ? this._terminal.currentParam = 10 * this._terminal.currentParam + i.charCodeAt(0) - 48 : ";" === i && (this._terminal.params.push(this._terminal.currentParam), this._terminal.currentParam = "");
                                break;
                            case h.CSI_PARAM:
                                if (i in a) {
                                    a[i](this);
                                    break
                                }
                                this.finalizeParam(), this._state = h.CSI;
                            case h.CSI:
                                i in l ? (this._terminal.debug && this._terminal.log("CSI " + (this._terminal.prefix ? this._terminal.prefix : "") + " " + (this._terminal.params ? this._terminal.params.join(";") : "") + " " + (this._terminal.postfix ? this._terminal.postfix : "") + " " + i), l[i](this._inputHandler, this._terminal.params, this._terminal.prefix, this._terminal.postfix, this)) : this._terminal.error("Unknown CSI code: %s.", i), this._state = h.NORMAL, this._terminal.prefix = "", this._terminal.postfix = "";
                                break;
                            case h.DCS:
                                if (i === r.C0.ESC || i === r.C0.BEL) {
                                    i === r.C0.ESC && this._position++;
                                    var m = void 0,
                                        p = void 0;
                                    switch (this._terminal.prefix) {
                                    case "":
                                        break;
                                    case "$q":
                                        switch (m = this._terminal.currentParam, p = !1, m) {
                                        case '"q':
                                            m = '0"q';
                                            break;
                                        case '"p':
                                            m = '61"p';
                                            break;
                                        case "r":
                                            m = this._terminal.buffer.scrollTop + 1 + ";" + (this._terminal.buffer.scrollBottom + 1) + "r";
                                            break;
                                        case "m":
                                            m = "0m";
                                            break;
                                        default:
                                            this._terminal.error("Unknown DCS Pt: %s.", m), m = ""
                                        }
                                        this._terminal.send(r.C0.ESC + "P" + +p + "$r" + m + r.C0.ESC + "\\");
                                        break;
                                    case "+p":
                                        break;
                                    case "+q":
                                        m = this._terminal.currentParam, p = !1, this._terminal.send(r.C0.ESC + "P" + +p + "+r" + m + r.C0.ESC + "\\");
                                        break;
                                    default:
                                        this._terminal.error("Unknown DCS prefix: %s.", this._terminal.prefix)
                                    }
                                    this._terminal.currentParam = 0, this._terminal.prefix = "", this._state = h.NORMAL
                                } else this._terminal.currentParam ? this._terminal.currentParam += i : this._terminal.prefix || "$" === i || "+" === i ? 2 === this._terminal.prefix.length ? this._terminal.currentParam = i : this._terminal.prefix += i : this._terminal.currentParam = i;
                                break;
                            case h.IGNORE:
                                i !== r.C0.ESC && i !== r.C0.BEL || (i === r.C0.ESC && this._position++, this._state = h.NORMAL)
                            }
                        }
                        return this._state
                    }, t.prototype.setState = function (t) {
                        this._state = t
                    }, t.prototype.setPrefix = function (t) {
                        this._terminal.prefix = t
                    }, t.prototype.setPostfix = function (t) {
                        this._terminal.postfix = t
                    }, t.prototype.setParam = function (t) {
                        this._terminal.currentParam = t
                    }, t.prototype.getParam = function () {
                        return this._terminal.currentParam
                    }, t.prototype.finalizeParam = function () {
                        this._terminal.params.push(this._terminal.currentParam), this._terminal.currentParam = 0
                    }, t.prototype.skipNextChar = function () {
                        this._position++
                    }, t
                }();
                i.Parser = c
            }, {
                "./Charsets": 3,
                "./EscapeSequences": 5
            }
        ],
        10: [
            function (t, e, i) {
                "use strict";

                function r(t) {
                    var e = t.ownerDocument.createElement("span");
                    e.innerHTML = "hello world", t.appendChild(e);
                    var i = e.offsetWidth,
                        r = e.offsetHeight;
                    e.style.fontWeight = "bold";
                    var s = e.offsetWidth,
                        n = e.offsetHeight;
                    return t.removeChild(e), i !== s || r !== n
                }
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var s, n = t("./utils/DomElementObjectPool");
                ! function (t) {
                    t[t.BOLD = 1] = "BOLD", t[t.UNDERLINE = 2] = "UNDERLINE", t[t.BLINK = 4] = "BLINK", t[t.INVERSE = 8] = "INVERSE", t[t.INVISIBLE = 16] = "INVISIBLE"
                }(s || (s = {}));
                var o = null,
                    a = function () {
                        function t(t) {
                            this._terminal = t, this._refreshRowsQueue = [], this._refreshFramesSkipped = 0, this._refreshAnimationFrame = null, this._spanElementObjectPool = new n.DomElementObjectPool("span"), null === o && (o = r(this._terminal.element)), this._spanElementObjectPool = new n.DomElementObjectPool("span")
                        }
                        return t.prototype.queueRefresh = function (t, e) {
                            this._refreshRowsQueue.push({
                                start: t,
                                end: e
                            }), this._refreshAnimationFrame || (this._refreshAnimationFrame = window.requestAnimationFrame(this._refreshLoop.bind(this)))
                        }, t.prototype._refreshLoop = function () {
                            if (this._terminal.writeBuffer.length > 0 && this._refreshFramesSkipped++ <= 5) this._refreshAnimationFrame = window.requestAnimationFrame(this._refreshLoop.bind(this));
                            else {
                                this._refreshFramesSkipped = 0;
                                var t, e;
                                if (this._refreshRowsQueue.length > 4) t = 0, e = this._terminal.rows - 1;
                                else {
                                    t = this._refreshRowsQueue[0].start, e = this._refreshRowsQueue[0].end;
                                    for (var i = 1; i < this._refreshRowsQueue.length; i++) this._refreshRowsQueue[i].start < t && (t = this._refreshRowsQueue[i].start), this._refreshRowsQueue[i].end > e && (e = this._refreshRowsQueue[i].end)
                                }
                                this._refreshRowsQueue = [], this._refreshAnimationFrame = null, this._refresh(t, e)
                            }
                        }, t.prototype._refresh = function (t, e) {
                            var i;
                            e - t >= this._terminal.rows / 2 && (i = this._terminal.element.parentNode) && this._terminal.element.removeChild(this._terminal.rowContainer);
                            var r = this._terminal.cols,
                                n = t;
                            for (e >= this._terminal.rows && (this._terminal.log("`end` is too large. Most likely a bad CSR."), e = this._terminal.rows - 1); n <= e; n++) {
                                var a = n + this._terminal.buffer.ydisp,
                                    l = this._terminal.buffer.lines.get(a),
                                    h = void 0;
                                h = this._terminal.buffer.y === n - (this._terminal.buffer.ybase - this._terminal.buffer.ydisp) && this._terminal.cursorState && !this._terminal.cursorHidden ? this._terminal.buffer.x : -1;
                                for (var c = this._terminal.defAttr, u = document.createDocumentFragment(), f = "", m = void 0; this._terminal.children[n].children.length;) {
                                    var p = this._terminal.children[n].children[0];
                                    this._terminal.children[n].removeChild(p), this._spanElementObjectPool.release(p)
                                }
                                for (var d = 0; d < r; d++) {
                                    var _ = l[d][0],
                                        y = l[d][1],
                                        b = l[d][2],
                                        C = d === h;
                                    if (b) {
                                        if ((_ !== c || C) && (c === this._terminal.defAttr || C || (f && (m.innerHTML = f, f = ""), u.appendChild(m), m = null), _ !== this._terminal.defAttr || C)) {
                                            f && !m && (m = this._spanElementObjectPool.acquire()), m && (f && (m.innerHTML = f, f = ""), u.appendChild(m)), m = this._spanElementObjectPool.acquire();
                                            var g = 511 & _,
                                                v = _ >> 9 & 511,
                                                S = _ >> 18;
                                            if (C && (m.classList.add("reverse-video"), m.classList.add("terminal-cursor")), S & s.BOLD && (o || m.classList.add("xterm-bold"), v < 8 && (v += 8)), S & s.UNDERLINE && m.classList.add("xterm-underline"), S & s.BLINK && m.classList.add("xterm-blink"), S & s.INVERSE) {
                                                var w = g;
                                                g = v, v = w, 1 & S && v < 8 && (v += 8)
                                            }
                                            S & s.INVISIBLE && !C && m.classList.add("xterm-hidden"), S & s.INVERSE && (257 === g && (g = 15), 256 === v && (v = 0)), g < 256 && m.classList.add("xterm-bg-color-" + g), v < 256 && m.classList.add("xterm-color-" + v)
                                        }
                                        if (2 === b) f += '<span class="xterm-wide-char">' + y + "</span>";
                                        else if (y.charCodeAt(0) > 255) f += '<span class="xterm-normal-char">' + y + "</span>";
                                        else switch (y) {
                                        case "&":
                                            f += "&amp;";
                                            break;
                                        case "<":
                                            f += "&lt;";
                                            break;
                                        case ">":
                                            f += "&gt;";
                                            break;
                                        default:
                                            f += y <= " " ? "&nbsp;" : y
                                        }
                                        c = C ? -1 : _
                                    }
                                }
                                f && !m && (m = this._spanElementObjectPool.acquire()), m && (f && (m.innerHTML = f, f = ""), u.appendChild(m), m = null), this._terminal.children[n].appendChild(u)
                            }
                            i && this._terminal.element.appendChild(this._terminal.rowContainer), this._terminal.emit("refresh", {
                                element: this._terminal.element,
                                start: t,
                                end: e
                            })
                        }, t.prototype.refreshSelection = function (t, e) {
                            for (; this._terminal.selectionContainer.children.length;) this._terminal.selectionContainer.removeChild(this._terminal.selectionContainer.children[0]);
                            if (t && e) {
                                var i = t[1] - this._terminal.buffer.ydisp,
                                    r = e[1] - this._terminal.buffer.ydisp,
                                    s = Math.max(i, 0),
                                    n = Math.min(r, this._terminal.rows - 1);
                                if (!(s >= this._terminal.rows || n < 0)) {
                                    var o = document.createDocumentFragment(),
                                        a = i === s ? t[0] : 0,
                                        l = s === n ? e[0] : this._terminal.cols;
                                    o.appendChild(this._createSelectionElement(s, a, l));
                                    var h = n - s - 1;
                                    if (o.appendChild(this._createSelectionElement(s + 1, 0, this._terminal.cols, h)), s !== n) {
                                        var c = r === n ? e[0] : this._terminal.cols;
                                        o.appendChild(this._createSelectionElement(n, 0, c))
                                    }
                                    this._terminal.selectionContainer.appendChild(o)
                                }
                            }
                        }, t.prototype._createSelectionElement = function (t, e, i, r) {
                            void 0 === r && (r = 1);
                            var s = document.createElement("div");
                            return s.style.height = r * this._terminal.charMeasure.height + "px", s.style.top = t * this._terminal.charMeasure.height + "px", s.style.left = e * this._terminal.charMeasure.width + "px", s.style.width = this._terminal.charMeasure.width * (i - e) + "px", s
                        }, t
                    }();
                i.Renderer = a
            }, {
                "./utils/DomElementObjectPool": 19
            }
        ],
        11: [
            function (t, e, i) {
                "use strict";
                var r = this && this.__extends || function () {
                    var t = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function (t, e) {
                        t.__proto__ = e
                    } || function (t, e) {
                        for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
                    };
                    return function (e, i) {
                        function r() {
                            this.constructor = e
                        }
                        t(e, i), e.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r)
                    }
                }();
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var s, n = t("./utils/Mouse"),
                    o = t("./utils/Browser"),
                    a = t("./EventEmitter"),
                    l = t("./SelectionModel"),
                    h = t("./utils/BufferLine"),
                    c = String.fromCharCode(160),
                    u = new RegExp(c, "g");
                ! function (t) {
                    t[t.NORMAL = 0] = "NORMAL", t[t.WORD = 1] = "WORD", t[t.LINE = 2] = "LINE"
                }(s || (s = {}));
                var f = function (t) {
                    function e(e, i, r, n) {
                        var o = t.call(this) || this;
                        return o._terminal = e, o._buffer = i, o._rowContainer = r, o._charMeasure = n, o._enabled = !0, o._initListeners(), o.enable(), o._model = new l.SelectionModel(e), o._activeSelectionMode = s.NORMAL, o
                    }
                    return r(e, t), e.prototype._initListeners = function () {
                        var t = this;
                        this._mouseMoveListener = function (e) {
                            return t._onMouseMove(e)
                        }, this._mouseUpListener = function (e) {
                            return t._onMouseUp(e)
                        }, this._rowContainer.addEventListener("mousedown", function (e) {
                            return t._onMouseDown(e)
                        }), this._buffer.on("trim", function (e) {
                            return t._onTrim(e)
                        })
                    }, e.prototype.disable = function () {
                        this.clearSelection(), this._enabled = !1
                    }, e.prototype.enable = function () {
                        this._enabled = !0
                    }, e.prototype.setBuffer = function (t) {
                        this._buffer = t, this.clearSelection()
                    }, Object.defineProperty(e.prototype, "selectionStart", {
                        get: function () {
                            return this._model.finalSelectionStart
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "selectionEnd", {
                        get: function () {
                            return this._model.finalSelectionEnd
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "hasSelection", {
                        get: function () {
                            var t = this._model.finalSelectionStart,
                                e = this._model.finalSelectionEnd;
                            return !(!t || !e) && (t[0] !== e[0] || t[1] !== e[1])
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "selectionText", {
                        get: function () {
                            var t = this._model.finalSelectionStart,
                                e = this._model.finalSelectionEnd;
                            if (!t || !e) return "";
                            var i = t[1] === e[1] ? e[0] : null,
                                r = [];
                            r.push(h.translateBufferLineToString(this._buffer.get(t[1]), !0, t[0], i));
                            for (var s = t[1] + 1; s <= e[1] - 1; s++) {
                                var n = this._buffer.get(s),
                                    a = h.translateBufferLineToString(n, !0);
                                n.isWrapped ? r[r.length - 1] += a : r.push(a)
                            }
                            if (t[1] !== e[1]) {
                                var n = this._buffer.get(e[1]),
                                    a = h.translateBufferLineToString(n, !0, 0, e[0]);
                                n.isWrapped ? r[r.length - 1] += a : r.push(a)
                            }
                            return r.map(function (t) {
                                return t.replace(u, " ")
                            }).join(o.isMSWindows ? "\r\n" : "\n")
                        }, enumerable: !0,
                        configurable: !0
                    }), e.prototype.clearSelection = function () {
                        this._model.clearSelection(), this._removeMouseDownListeners(), this.refresh()
                    }, e.prototype.refresh = function (t) {
                        var e = this;
                        this._refreshAnimationFrame || (this._refreshAnimationFrame = window.requestAnimationFrame(function () {
                            return e._refresh()
                        })), o.isLinux && t && this.selectionText.length && this.emit("newselection", this.selectionText)
                    }, e.prototype._refresh = function () {
                        this._refreshAnimationFrame = null, this.emit("refresh", {
                            start: this._model.finalSelectionStart,
                            end: this._model.finalSelectionEnd
                        })
                    }, e.prototype.selectAll = function () {
                        this._model.isSelectAllActive = !0, this.refresh()
                    }, e.prototype._onTrim = function (t) {
                        this._model.onTrim(t) && this.refresh()
                    }, e.prototype._getMouseBufferCoords = function (t) {
                        var e = n.getCoords(t, this._rowContainer, this._charMeasure, this._terminal.cols, this._terminal.rows, !0);
                        return e ? (e[0]--, e[1]--, e[1] += this._terminal.buffer.ydisp, e) : null
                    }, e.prototype._getMouseEventScrollAmount = function (t) {
                        var e = n.getCoordsRelativeToElement(t, this._rowContainer)[1],
                            i = this._terminal.rows * this._charMeasure.height;
                        return e >= 0 && e <= i ? 0 : (e > i && (e -= i), e = Math.min(Math.max(e, -50), 50), (e /= 50) / Math.abs(e) + Math.round(14 * e))
                    }, e.prototype._onMouseDown = function (t) {
                        if (2 === t.button && this.hasSelection) t.stopPropagation();
                        else if (0 === t.button) {
                            if (!this._enabled) {
                                if (!(o.isMac && t.altKey)) return;
                                t.stopPropagation()
                            }
                            t.preventDefault(), this._dragScrollAmount = 0, this._enabled && t.shiftKey ? this._onIncrementalClick(t) : 1 === t.detail ? this._onSingleClick(t) : 2 === t.detail ? this._onDoubleClick(t) : 3 === t.detail && this._onTripleClick(t), this._addMouseDownListeners(), this.refresh(!0)
                        }
                    }, e.prototype._addMouseDownListeners = function () {
                        var t = this;
                        this._rowContainer.ownerDocument.addEventListener("mousemove", this._mouseMoveListener), this._rowContainer.ownerDocument.addEventListener("mouseup", this._mouseUpListener), this._dragScrollIntervalTimer = setInterval(function () {
                            return t._dragScroll()
                        }, 50)
                    }, e.prototype._removeMouseDownListeners = function () {
                        this._rowContainer.ownerDocument.removeEventListener("mousemove", this._mouseMoveListener), this._rowContainer.ownerDocument.removeEventListener("mouseup", this._mouseUpListener), clearInterval(this._dragScrollIntervalTimer), this._dragScrollIntervalTimer = null
                    }, e.prototype._onIncrementalClick = function (t) {
                        this._model.selectionStart && (this._model.selectionEnd = this._getMouseBufferCoords(t))
                    }, e.prototype._onSingleClick = function (t) {
                        if (this._model.selectionStartLength = 0, this._model.isSelectAllActive = !1, this._activeSelectionMode = s.NORMAL, this._model.selectionStart = this._getMouseBufferCoords(t), this._model.selectionStart) {
                            this._model.selectionEnd = null;
                            var e = this._buffer.get(this._model.selectionStart[1]);
                            e && 0 === e[this._model.selectionStart[0]][2] && this._model.selectionStart[0]++
                        }
                    }, e.prototype._onDoubleClick = function (t) {
                        var e = this._getMouseBufferCoords(t);
                        e && (this._activeSelectionMode = s.WORD, this._selectWordAt(e))
                    }, e.prototype._onTripleClick = function (t) {
                        var e = this._getMouseBufferCoords(t);
                        e && (this._activeSelectionMode = s.LINE, this._selectLineAt(e[1]))
                    }, e.prototype._onMouseMove = function (t) {
                        var e = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
                        if (this._model.selectionEnd = this._getMouseBufferCoords(t), this._model.selectionEnd) {
                            if (this._activeSelectionMode === s.LINE ? this._model.selectionEnd[1] < this._model.selectionStart[1] ? this._model.selectionEnd[0] = 0 : this._model.selectionEnd[0] = this._terminal.cols : this._activeSelectionMode === s.WORD && this._selectToWordAt(this._model.selectionEnd), this._dragScrollAmount = this._getMouseEventScrollAmount(t), this._dragScrollAmount > 0 ? this._model.selectionEnd[0] = this._terminal.cols - 1 : this._dragScrollAmount < 0 && (this._model.selectionEnd[0] = 0), this._model.selectionEnd[1] < this._buffer.length) {
                                var i = this._buffer.get(this._model.selectionEnd[1])[this._model.selectionEnd[0]];
                                i && 0 === i[2] && this._model.selectionEnd[0]++
                            }
                            e && e[0] === this._model.selectionEnd[0] && e[1] === this._model.selectionEnd[1] || this.refresh(!0)
                        } else this.refresh(!0)
                    }, e.prototype._dragScroll = function () {
                        this._dragScrollAmount && (this._terminal.scrollDisp(this._dragScrollAmount, !1), this._dragScrollAmount > 0 ? this._model.selectionEnd = [this._terminal.cols - 1, this._terminal.buffer.ydisp + this._terminal.rows] : this._model.selectionEnd = [0, this._terminal.buffer.ydisp], this.refresh())
                    }, e.prototype._onMouseUp = function (t) {
                        this._removeMouseDownListeners()
                    }, e.prototype._convertViewportColToCharacterIndex = function (t, e) {
                        for (var i = e[0], r = 0; e[0] >= r; r++) 0 === t[r][2] && i--;
                        return i
                    }, e.prototype.setSelection = function (t, e, i) {
                        this._model.clearSelection(), this._removeMouseDownListeners(), this._model.selectionStart = [t, e], this._model.selectionStartLength = i, this.refresh()
                    }, e.prototype._getWordAt = function (t) {
                        var e = this._buffer.get(t[1]);
                        if (!e) return null;
                        var i = h.translateBufferLineToString(e, !1),
                            r = this._convertViewportColToCharacterIndex(e, t),
                            s = r,
                            n = t[0] - s,
                            o = 0,
                            a = 0;
                        if (" " === i.charAt(s)) {
                            for (; s > 0 && " " === i.charAt(s - 1);) s--;
                            for (; r < i.length && " " === i.charAt(r + 1);) r++
                        } else {
                            var l = t[0],
                                c = t[0];
                            for (0 === e[l][2] && (o++, l--), 2 === e[c][2] && (a++, c++); s > 0 && !this._isCharWordSeparator(i.charAt(s - 1));) 0 === e[l - 1][2] && (o++, l--), s--, l--;
                            for (; r + 1 < i.length && !this._isCharWordSeparator(i.charAt(r + 1));) 2 === e[c + 1][2] && (a++, c++), r++, c++
                        }
                        return {
                            start: s + n - o,
                            length: Math.min(r - s + o + a + 1, this._terminal.cols)
                        }
                    }, e.prototype._selectWordAt = function (t) {
                        var e = this._getWordAt(t);
                        e && (this._model.selectionStart = [e.start, t[1]], this._model.selectionStartLength = e.length)
                    }, e.prototype._selectToWordAt = function (t) {
                        var e = this._getWordAt(t);
                        e && (this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? e.start : e.start + e.length, t[1]])
                    }, e.prototype._isCharWordSeparator = function (t) {
                        return " ()[]{}'\"".indexOf(t) >= 0
                    }, e.prototype._selectLineAt = function (t) {
                        this._model.selectionStart = [0, t], this._model.selectionStartLength = this._terminal.cols
                    }, e
                }(a.EventEmitter);
                i.SelectionManager = f
            }, {
                "./EventEmitter": 6,
                "./SelectionModel": 12,
                "./utils/Browser": 15,
                "./utils/BufferLine": 16,
                "./utils/Mouse": 21
            }
        ],
        12: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = function () {
                    function t(t) {
                        this._terminal = t, this.clearSelection()
                    }
                    return t.prototype.clearSelection = function () {
                        this.selectionStart = null, this.selectionEnd = null, this.isSelectAllActive = !1, this.selectionStartLength = 0
                    }, Object.defineProperty(t.prototype, "finalSelectionStart", {
                        get: function () {
                            return this.isSelectAllActive ? [0, 0] : this.selectionEnd && this.selectionStart && this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(t.prototype, "finalSelectionEnd", {
                        get: function () {
                            return this.isSelectAllActive ? [this._terminal.cols, this._terminal.buffer.ybase + this._terminal.rows - 1] : this.selectionStart ? !this.selectionEnd || this.areSelectionValuesReversed() ? [this.selectionStart[0] + this.selectionStartLength, this.selectionStart[1]] : this.selectionStartLength && this.selectionEnd[1] === this.selectionStart[1] ? [Math.max(this.selectionStart[0] + this.selectionStartLength, this.selectionEnd[0]), this.selectionEnd[1]] : this.selectionEnd : null
                        }, enumerable: !0,
                        configurable: !0
                    }), t.prototype.areSelectionValuesReversed = function () {
                        var t = this.selectionStart,
                            e = this.selectionEnd;
                        return t[1] > e[1] || t[1] === e[1] && t[0] > e[0]
                    }, t.prototype.onTrim = function (t) {
                        return this.selectionStart && (this.selectionStart[1] -= t), this.selectionEnd && (this.selectionEnd[1] -= t), this.selectionEnd && this.selectionEnd[1] < 0 ? (this.clearSelection(), !0) : (this.selectionStart && this.selectionStart[1] < 0 && (this.selectionStart[1] = 0), !1)
                    }, t
                }();
                i.SelectionModel = r
            }, {}
        ],
        13: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = function () {
                    function t(t, e, i, r) {
                        var s = this;
                        this.terminal = t, this.viewportElement = e, this.scrollArea = i, this.charMeasure = r, this.currentRowHeight = 0, this.lastRecordedBufferLength = 0, this.lastRecordedViewportHeight = 0, this.terminal.on("scroll", this.syncScrollArea.bind(this)), this.terminal.on("resize", this.syncScrollArea.bind(this)), this.viewportElement.addEventListener("scroll", this.onScroll.bind(this)), setTimeout(function () {
                            return s.syncScrollArea()
                        }, 0)
                    }
                    return t.prototype.refresh = function () {
                        if (this.charMeasure.height > 0) {
                            var t = this.charMeasure.height !== this.currentRowHeight;
                            t && (this.currentRowHeight = this.charMeasure.height, this.viewportElement.style.lineHeight = this.charMeasure.height + "px", this.terminal.rowContainer.style.lineHeight = this.charMeasure.height + "px");
                            var e = this.lastRecordedViewportHeight !== this.terminal.rows;
                            (t || e) && (this.lastRecordedViewportHeight = this.terminal.rows, this.viewportElement.style.height = this.charMeasure.height * this.terminal.rows + "px", this.terminal.selectionContainer.style.height = this.viewportElement.style.height), this.scrollArea.style.height = this.charMeasure.height * this.lastRecordedBufferLength + "px"
                        }
                    }, t.prototype.syncScrollArea = function () {
                        this.lastRecordedBufferLength !== this.terminal.buffer.lines.length ? (this.lastRecordedBufferLength = this.terminal.buffer.lines.length, this.refresh()) : this.lastRecordedViewportHeight !== this.terminal.rows ? this.refresh() : this.charMeasure.height !== this.currentRowHeight && this.refresh();
                        var t = this.terminal.buffer.ydisp * this.currentRowHeight;
                        this.viewportElement.scrollTop !== t && (this.viewportElement.scrollTop = t)
                    }, t.prototype.onScroll = function (t) {
                        var e = Math.round(this.viewportElement.scrollTop / this.currentRowHeight) - this.terminal.buffer.ydisp;
                        this.terminal.scrollDisp(e, !0)
                    }, t.prototype.onWheel = function (t) {
                        if (0 !== t.deltaY) {
                            var e = 1;
                            t.deltaMode === WheelEvent.DOM_DELTA_LINE ? e = this.currentRowHeight : t.deltaMode === WheelEvent.DOM_DELTA_PAGE && (e = this.currentRowHeight * this.terminal.rows), this.viewportElement.scrollTop += t.deltaY * e, t.preventDefault()
                        }
                    }, t.prototype.onTouchStart = function (t) {
                        this.lastTouchY = t.touches[0].pageY
                    }, t.prototype.onTouchMove = function (t) {
                        var e = this.lastTouchY - t.touches[0].pageY;
                        this.lastTouchY = t.touches[0].pageY, 0 !== e && (this.viewportElement.scrollTop += e, t.preventDefault())
                    }, t
                }();
                i.Viewport = r
            }, {}
        ],
        14: [
            function (t, e, i) {
                "use strict";

                function r(t, e) {
                    return e ? t.replace(/\r?\n/g, "\r") : t
                }

                function s(t, e) {
                    e.style.position = "fixed", e.style.width = "20px", e.style.height = "20px", e.style.left = t.clientX - 10 + "px", e.style.top = t.clientY - 10 + "px", e.style.zIndex = "1000", e.focus(), setTimeout(function () {
                        e.style.position = null, e.style.width = null, e.style.height = null, e.style.left = null, e.style.top = null, e.style.zIndex = null
                    }, 4)
                }
                Object.defineProperty(i, "__esModule", {
                    value: !0
                }), i.prepareTextForTerminal = r, i.copyHandler = function (t, e, i) {
                    e.browser.isMSIE ? window.clipboardData.setData("Text", i.selectionText) : t.clipboardData.setData("text/plain", i.selectionText), t.preventDefault()
                }, i.pasteHandler = function (t, e) {
                    t.stopPropagation();
                    var i = function (i) {
                        return i = r(i, e.browser.isMSWindows), e.handler(i), e.textarea.value = "", e.emit("paste", i), e.cancel(t)
                    };
                    e.browser.isMSIE ? window.clipboardData && i(window.clipboardData.getData("Text")) : t.clipboardData && i(t.clipboardData.getData("text/plain"))
                }, i.moveTextAreaUnderMouseCursor = s, i.rightClickHandler = function (t, e, i) {
                    s(t, e), e.value = i.selectionText, e.select()
                }
            }, {}
        ],
        15: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = t("./Generic"),
                    s = "undefined" == typeof navigator,
                    n = s ? "node" : navigator.userAgent,
                    o = s ? "node" : navigator.platform;
                i.isFirefox = !!~n.indexOf("Firefox"), i.isMSIE = !!~n.indexOf("MSIE") || !!~n.indexOf("Trident"), i.isMac = r.contains(["Macintosh", "MacIntel", "MacPPC", "Mac68K"], o), i.isIpad = "iPad" === o, i.isIphone = "iPhone" === o, i.isMSWindows = r.contains(["Windows", "Win16", "Win32", "WinCE"], o), i.isLinux = o.indexOf("Linux") >= 0
            }, {
                "./Generic": 20
            }
        ],
        16: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = 1,
                    s = 2;
                i.translateBufferLineToString = function (t, e, i, n) {
                    void 0 === i && (i = 0), void 0 === n && (n = null);
                    for (var o = "", a = i, l = n, h = 0; h < t.length; h++) {
                        var c = t[h];
                        o += c[r], 0 === c[s] && (i >= h && a--, n >= h && l--)
                    }
                    var u = l || t.length;
                    if (e) {
                        var f = o.search(/\s+$/);
                        if (-1 !== f && (u = Math.min(u, f)), u <= a) return ""
                    }
                    return o.substring(a, u)
                }
            }, {}
        ],
        17: [
            function (t, e, i) {
                "use strict";
                var r = this && this.__extends || function () {
                    var t = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function (t, e) {
                        t.__proto__ = e
                    } || function (t, e) {
                        for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
                    };
                    return function (e, i) {
                        function r() {
                            this.constructor = e
                        }
                        t(e, i), e.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r)
                    }
                }();
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var s = function (t) {
                    function e(e, i) {
                        var r = t.call(this) || this;
                        return r._document = e, r._parentElement = i, r
                    }
                    return r(e, t), Object.defineProperty(e.prototype, "width", {
                        get: function () {
                            return this._width
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "height", {
                        get: function () {
                            return this._height
                        }, enumerable: !0,
                        configurable: !0
                    }), e.prototype.measure = function () {
                        var t = this;
                        this._measureElement ? this._doMeasure() : (this._measureElement = this._document.createElement("span"), this._measureElement.style.position = "absolute", this._measureElement.style.top = "0", this._measureElement.style.left = "-9999em", this._measureElement.textContent = "W", this._measureElement.setAttribute("aria-hidden", "true"), this._parentElement.appendChild(this._measureElement), setTimeout(function () {
                            return t._doMeasure()
                        }, 0))
                    }, e.prototype._doMeasure = function () {
                        var t = this._measureElement.getBoundingClientRect();
                        0 !== t.width && 0 !== t.height && (this._width === t.width && this._height === t.height || (this._width = t.width, this._height = t.height, this.emit("charsizechanged")))
                    }, e
                }(t("../EventEmitter.js").EventEmitter);
                i.CharMeasure = s
            }, {
                "../EventEmitter.js": 6
            }
        ],
        18: [
            function (t, e, i) {
                "use strict";
                var r = this && this.__extends || function () {
                    var t = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function (t, e) {
                        t.__proto__ = e
                    } || function (t, e) {
                        for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
                    };
                    return function (e, i) {
                        function r() {
                            this.constructor = e
                        }
                        t(e, i), e.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r)
                    }
                }();
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var s = function (t) {
                    function e(e) {
                        var i = t.call(this) || this;
                        return i._array = new Array(e), i._startIndex = 0, i._length = 0, i
                    }
                    return r(e, t), Object.defineProperty(e.prototype, "maxLength", {
                        get: function () {
                            return this._array.length
                        }, set: function (t) {
                            for (var e = new Array(t), i = 0; i < Math.min(t, this.length); i++) e[i] = this._array[this._getCyclicIndex(i)];
                            this._array = e, this._startIndex = 0
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "length", {
                        get: function () {
                            return this._length
                        }, set: function (t) {
                            if (t > this._length)
                                for (var e = this._length; e < t; e++) this._array[e] = void 0;
                            this._length = t
                        }, enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "forEach", {
                        get: function () {
                            var t = this;
                            return function (e) {
                                for (var i = t.length, r = 0; r < i; r++) e(t.get(r), r)
                            }
                        }, enumerable: !0,
                        configurable: !0
                    }), e.prototype.get = function (t) {
                        return this._array[this._getCyclicIndex(t)]
                    }, e.prototype.set = function (t, e) {
                        this._array[this._getCyclicIndex(t)] = e
                    }, e.prototype.push = function (t) {
                        this._array[this._getCyclicIndex(this._length)] = t, this._length === this.maxLength ? (++this._startIndex === this.maxLength && (this._startIndex = 0), this.emit("trim", 1)) : this._length++
                    }, e.prototype.pop = function () {
                        return this._array[this._getCyclicIndex(this._length---1)]
                    }, e.prototype.splice = function (t, e) {
                        for (var i = [], r = 2; r < arguments.length; r++) i[r - 2] = arguments[r];
                        if (e) {
                            for (s = t; s < this._length - e; s++) this._array[this._getCyclicIndex(s)] = this._array[this._getCyclicIndex(s + e)];
                            this._length -= e
                        }
                        if (i && i.length) {
                            for (s = this._length - 1; s >= t; s--) this._array[this._getCyclicIndex(s + i.length)] = this._array[this._getCyclicIndex(s)];
                            for (var s = 0; s < i.length; s++) this._array[this._getCyclicIndex(t + s)] = i[s];
                            if (this._length + i.length > this.maxLength) {
                                var n = this._length + i.length - this.maxLength;
                                this._startIndex += n, this._length = this.maxLength, this.emit("trim", n)
                            } else this._length += i.length
                        }
                    }, e.prototype.trimStart = function (t) {
                        t > this._length && (t = this._length), this._startIndex += t, this._length -= t, this.emit("trim", t)
                    }, e.prototype.shiftElements = function (t, e, i) {
                        if (!(e <= 0)) {
                            if (t < 0 || t >= this._length) throw new Error("start argument out of range");
                            if (t + i < 0) throw new Error("Cannot shift elements in list beyond index 0");
                            if (i > 0) {
                                for (s = e - 1; s >= 0; s--) this.set(t + s + i, this.get(t + s));
                                var r = t + e + i - this._length;
                                if (r > 0)
                                    for (this._length += r; this._length > this.maxLength;) this._length--, this._startIndex++, this.emit("trim", 1)
                            } else
                                for (var s = 0; s < e; s++) this.set(t + s + i, this.get(t + s))
                        }
                    }, e.prototype._getCyclicIndex = function (t) {
                        return (this._startIndex + t) % this.maxLength
                    }, e
                }(t("../EventEmitter").EventEmitter);
                i.CircularList = s
            }, {
                "../EventEmitter": 6
            }
        ],
        19: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var r = function () {
                    function t(t) {
                        this.type = t, this._type = t, this._pool = [], this._inUse = {}
                    }
                    return t.prototype.acquire = function () {
                        var e;
                        return e = 0 === this._pool.length ? this._createNew() : this._pool.pop(), this._inUse[e.getAttribute(t.OBJECT_ID_ATTRIBUTE)] = e, e
                    }, t.prototype.release = function (e) {
                        if (!this._inUse[e.getAttribute(t.OBJECT_ID_ATTRIBUTE)]) throw new Error("Could not release an element not yet acquired");
                        delete this._inUse[e.getAttribute(t.OBJECT_ID_ATTRIBUTE)], this._cleanElement(e), this._pool.push(e)
                    }, t.prototype._createNew = function () {
                        var e = document.createElement(this._type),
                            i = t._objectCount++;
                        return e.setAttribute(t.OBJECT_ID_ATTRIBUTE, i.toString(10)), e
                    }, t.prototype._cleanElement = function (t) {
                        t.className = "", t.innerHTML = ""
                    }, t
                }();
                r.OBJECT_ID_ATTRIBUTE = "data-obj-id", r._objectCount = 0, i.DomElementObjectPool = r
            }, {}
        ],
        20: [
            function (t, e, i) {
                "use strict";
                Object.defineProperty(i, "__esModule", {
                    value: !0
                }), i.contains = function (t, e) {
                    return t.indexOf(e) >= 0
                }
            }, {}
        ],
        21: [
            function (t, e, i) {
                "use strict";

                function r(t, e) {
                    if (null == t.pageX) return null;
                    for (var i = t.pageX, r = t.pageY; e && e !== self.document.documentElement;) i -= e.offsetLeft, r -= e.offsetTop, e = "offsetParent" in e ? e.offsetParent : e.parentElement;
                    return [i, r]
                }

                function s(t, e, i, s, n, o) {
                    if (!i.width || !i.height) return null;
                    var a = r(t, e);
                    return a ? (a[0] = Math.ceil((a[0] + (o ? i.width / 2 : 0)) / i.width), a[1] = Math.ceil(a[1] / i.height), a[0] = Math.min(Math.max(a[0], 1), s + 1), a[1] = Math.min(Math.max(a[1], 1), n + 1), a) : null
                }
                Object.defineProperty(i, "__esModule", {
                    value: !0
                }), i.getCoordsRelativeToElement = r, i.getCoords = s, i.getRawByteCoords = function (t, e, i, r, n) {
                    var o = s(t, e, i, r, n),
                        a = o[0],
                        l = o[1];
                    return a += 32, l += 32, {
                        x: a,
                        y: l
                    }
                }
            }, {}
        ],
        22: [
            function (t, e, i) {
                "use strict";

                function r(t) {
                    var e = this;
                    if (!(this instanceof r)) return new r(arguments[0], arguments[1], arguments[2]);
                    e.browser = S, e.cancel = r.cancel, f.EventEmitter.call(this), "number" == typeof t && (t = {
                        cols: arguments[0],
                        rows: arguments[1],
                        handler: arguments[2]
                    }), t = t || {}, Object.keys(r.defaults).forEach(function (i) {
                        null == t[i] && (t[i] = r.options[i], r[i] !== r.defaults[i] && (t[i] = r[i])), e[i] = t[i]
                    }), 8 === t.colors.length ? t.colors = t.colors.concat(r._colors.slice(8)) : 16 === t.colors.length ? t.colors = t.colors.concat(r._colors.slice(16)) : 10 === t.colors.length ? t.colors = t.colors.slice(0, -2).concat(r._colors.slice(8, -2), t.colors.slice(-2)) : 18 === t.colors.length && (t.colors = t.colors.concat(r._colors.slice(16, -2), t.colors.slice(-2))), this.colors = t.colors, this.options = t, this.parent = t.body || t.parent || (x ? x.getElementsByTagName("body")[0] : null), this.cols = t.cols || t.geometry[0], this.rows = t.rows || t.geometry[1], this.geometry = [this.cols, this.rows], t.handler && this.on("data", t.handler), this.cursorState = 0, this.cursorHidden = !1, this.convertEol, this.queue = "", this.customKeyEventHandler = null, this.cursorBlinkInterval = null, this.applicationKeypad = !1, this.applicationCursor = !1, this.originMode = !1, this.insertMode = !1, this.wraparoundMode = !0, this.charset = null, this.gcharset = null, this.glevel = 0, this.charsets = [null], this.decLocator, this.x10Mouse, this.vt200Mouse, this.vt300Mouse, this.normalMouse, this.mouseEvents, this.sendFocus, this.utfMouse, this.sgrMouse, this.urxvtMouse, this.element, this.children, this.refreshStart, this.refreshEnd, this.savedX, this.savedY, this.savedCols, this.readable = !0, this.writable = !0, this.defAttr = 131840, this.curAttr = this.defAttr, this.params = [], this.currentParam = 0, this.prefix = "", this.postfix = "", this.inputHandler = new _.InputHandler(this), this.parser = new y.Parser(this.inputHandler, this), this.renderer = this.renderer || null, this.selectionManager = this.selectionManager || null, this.linkifier = this.linkifier || new C.Linkifier, this.writeBuffer = [], this.writeInProgress = !1, this.xoffSentToCatchUp = !1, this.writeStopped = !1, this.surrogate_high = "", this.buffers = new c.BufferSet(this), this.buffer = this.buffers.active, this.buffers.on("activate", function (t) {
                        this._terminal.buffer = t
                    }), this.selectionManager && this.selectionManager.setBuffer(this.buffer.lines), this.setupStops(), this.userScrolling = !1
                }

                function s(t, e, i, r) {
                    Array.isArray(t) || (t = [t]), t.forEach(function (t) {
                        t.addEventListener(e, i, r || !1)
                    })
                }

                function n(t, e, i, r) {
                    t.removeEventListener(e, i, r || !1)
                }

                function o(t, e) {
                    function i() {
                        this.constructor = t
                    }
                    i.prototype = e.prototype, t.prototype = new i
                }

                function a(t, e) {
                    var i = t.browser.isMac && e.altKey && !e.ctrlKey && !e.metaKey || t.browser.isMSWindows && e.altKey && e.ctrlKey && !e.metaKey;
                    return "keypress" == e.type ? i : i && (!e.keyCode || e.keyCode > 47)
                }

                function l(t, e, i) {
                    var s = t << 16 | e << 8 | i;
                    if (null != l._cache[s]) return l._cache[s];
                    for (var n, o, a, h, c, u = 1 / 0, f = -1, m = 0; m < r.vcolors.length; m++) {
                        if (n = r.vcolors[m], o = n[0], a = n[1], h = n[2], 0 === (c = l.distance(t, e, i, o, a, h))) {
                            f = m;
                            break
                        }
                        c < u && (u = c, f = m)
                    }
                    return l._cache[s] = f
                }

                function h(t) {
                    return 16 === t.keyCode || 17 === t.keyCode || 18 === t.keyCode
                }
                Object.defineProperty(i, "__esModule", {
                    value: !0
                });
                var c = t("./BufferSet"),
                    u = t("./CompositionHelper"),
                    f = t("./EventEmitter"),
                    m = t("./Viewport"),
                    p = t("./handlers/Clipboard"),
                    d = t("./EscapeSequences"),
                    _ = t("./InputHandler"),
                    y = t("./Parser"),
                    b = t("./Renderer"),
                    C = t("./Linkifier"),
                    g = t("./SelectionManager"),
                    v = t("./utils/CharMeasure"),
                    S = t("./utils/Browser"),
                    w = t("./utils/Mouse"),
                    E = t("./utils/BufferLine"),
                    x = "undefined" != typeof window ? window.document : null;
                o(r, f.EventEmitter), r.prototype.eraseAttr = function () {
                        return -512 & this.defAttr | 511 & this.curAttr
                    }, r.tangoColors = ["#2e3436", "#cc0000", "#4e9a06", "#c4a000", "#3465a4", "#75507b", "#06989a", "#d3d7cf", "#555753", "#ef2929", "#8ae234", "#fce94f", "#729fcf", "#ad7fa8", "#34e2e2", "#eeeeec"], r.colors = function () {
                        function t(t, i, r) {
                            s.push("#" + e(t) + e(i) + e(r))
                        }

                        function e(t) {
                            return (t = t.toString(16)).length < 2 ? "0" + t : t
                        }
                        var i, s = r.tangoColors.slice(),
                            n = [0, 95, 135, 175, 215, 255];
                        for (i = 0; i < 216; i++) t(n[i / 36 % 6 | 0], n[i / 6 % 6 | 0], n[i % 6]);
                        for (i = 0; i < 24; i++) t(n = 8 + 10 * i, n, n);
                        return s
                    }(), r._colors = r.colors.slice(), r.vcolors = function () {
                        for (var t, e = [], i = r.colors, s = 0; s < 256; s++) t = parseInt(i[s].substring(1), 16), e.push([t >> 16 & 255, t >> 8 & 255, 255 & t]);
                        return e
                    }(), r.defaults = {
                        colors: r.colors,
                        theme: "default",
                        convertEol: !1,
                        termName: "xterm",
                        geometry: [80, 24],
                        cursorBlink: !1,
                        cursorStyle: "block",
                        visualBell: !1,
                        popOnBell: !1,
                        scrollback: 1e3,
                        screenKeys: !1,
                        debug: !1,
                        cancelEvents: !1,
                        disableStdin: !1,
                        useFlowControl: !1,
                        tabStopWidth: 8
                    }, r.options = {}, r.focus = null,
                    function (t, e, i) {
                        if (t.forEach) return t.forEach(e, i);
                        for (var r = 0; r < t.length; r++) e.call(i, t[r], r, t)
                    }(function (t) {
                        if (Object.keys) return Object.keys(t);
                        var e, i = [];
                        for (e in t) Object.prototype.hasOwnProperty.call(t, e) && i.push(e);
                        return i
                    }(r.defaults), function (t) {
                        r[t] = r.defaults[t], r.options[t] = r.defaults[t]
                    }), r.prototype.focus = function () {
                        return this.textarea.focus()
                    }, r.prototype.getOption = function (t) {
                        if (!(t in r.defaults)) throw new Error('No option with key "' + t + '"');
                        return void 0 !== this.options[t] ? this.options[t] : this[t]
                    }, r.prototype.setOption = function (t, e) {
                        if (!(t in r.defaults)) throw new Error('No option with key "' + t + '"');
                        switch (t) {
                        case "scrollback":
                            if (e < this.rows) {
                                var i = "Setting the scrollback value less than the number of rows ";
                                return i += "(" + this.rows + ") is not allowed.", console.warn(i), !1
                            }
                            if (this.options[t] !== e) {
                                if (this.buffer.lines.length > e) {
                                    var s = this.buffer.lines.length - e,
                                        n = this.buffer.ydisp - s < 0;
                                    this.buffer.lines.trimStart(s), this.buffer.ybase = Math.max(this.buffer.ybase - s, 0), this.buffer.ydisp = Math.max(this.buffer.ydisp - s, 0), n && this.refresh(0, this.rows - 1)
                                }
                                this.buffer.lines.maxLength = e, this.viewport.syncScrollArea()
                            }
                        }
                        switch (this[t] = e, this.options[t] = e, t) {
                        case "cursorBlink":
                            this.setCursorBlinking(e);
                            break;
                        case "cursorStyle":
                            this.element.classList.toggle("xterm-cursor-style-block", "block" === e), this.element.classList.toggle("xterm-cursor-style-underline", "underline" === e), this.element.classList.toggle("xterm-cursor-style-bar", "bar" === e);
                            break;
                        case "tabStopWidth":
                            this.setupStops()
                        }
                    }, r.prototype.restartCursorBlinking = function () {
                        this.setCursorBlinking(this.options.cursorBlink)
                    }, r.prototype.setCursorBlinking = function (t) {
                        if (this.element.classList.toggle("xterm-cursor-blink", t), this.clearCursorBlinkingInterval(), t) {
                            var e = this;
                            this.cursorBlinkInterval = setInterval(function () {
                                e.element.classList.toggle("xterm-cursor-blink-on")
                            }, 600)
                        }
                    }, r.prototype.clearCursorBlinkingInterval = function () {
                        this.element.classList.remove("xterm-cursor-blink-on"), this.cursorBlinkInterval && (clearInterval(this.cursorBlinkInterval), this.cursorBlinkInterval = null)
                    }, r.bindFocus = function (t) {
                        s(t.textarea, "focus", function (e) {
                            t.sendFocus && t.send(d.C0.ESC + "[I"), t.element.classList.add("focus"), t.showCursor(), t.restartCursorBlinking.apply(t), r.focus = t, t.emit("focus", {
                                terminal: t
                            })
                        })
                    }, r.prototype.blur = function () {
                        return this.textarea.blur()
                    }, r.bindBlur = function (t) {
                        s(t.textarea, "blur", function (e) {
                            t.refresh(t.buffer.y, t.buffer.y), t.sendFocus && t.send(d.C0.ESC + "[O"), t.element.classList.remove("focus"), t.clearCursorBlinkingInterval.apply(t), r.focus = null, t.emit("blur", {
                                terminal: t
                            })
                        })
                    }, r.prototype.initGlobal = function () {
                        var t = this,
                            e = this;
                        r.bindKeys(this), r.bindFocus(this), r.bindBlur(this), s(this.element, "copy", function (i) {
                            e.hasSelection() && p.copyHandler(i, e, t.selectionManager)
                        });
                        var i = function (t) {
                            return p.pasteHandler(t, e)
                        };
                        s(this.textarea, "paste", i), s(this.element, "paste", i), e.browser.isFirefox ? s(this.element, "mousedown", function (e) {
                            2 == e.button && p.rightClickHandler(e, t.textarea, t.selectionManager)
                        }) : s(this.element, "contextmenu", function (e) {
                            p.rightClickHandler(e, t.textarea, t.selectionManager)
                        }), e.browser.isLinux && s(this.element, "auxclick", function (e) {
                            1 === e.button && p.moveTextAreaUnderMouseCursor(e, t.textarea, t.selectionManager)
                        })
                    }, r.bindKeys = function (t) {
                        s(t.element, "keydown", function (e) {
                            x.activeElement == this && t.keyDown(e)
                        }, !0), s(t.element, "keypress", function (e) {
                            x.activeElement == this && t.keyPress(e)
                        }, !0), s(t.element, "keyup", function (e) {
                            h(e) || t.focus(t)
                        }, !0), s(t.textarea, "keydown", function (e) {
                            t.keyDown(e)
                        }, !0), s(t.textarea, "keypress", function (e) {
                            t.keyPress(e), this.value = ""
                        }, !0), s(t.textarea, "compositionstart", t.compositionHelper.compositionstart.bind(t.compositionHelper)), s(t.textarea, "compositionupdate", t.compositionHelper.compositionupdate.bind(t.compositionHelper)), s(t.textarea, "compositionend", t.compositionHelper.compositionend.bind(t.compositionHelper)), t.on("refresh", t.compositionHelper.updateCompositionElements.bind(t.compositionHelper)), t.on("refresh", function (e) {
                            t.queueLinkification(e.start, e.end)
                        })
                    }, r.prototype.insertRow = function (t) {
                        return "object" != typeof t && (t = x.createElement("div")), this.rowContainer.appendChild(t), this.children.push(t), t
                    }, r.prototype.open = function (t, e) {
                        var i = this,
                            r = this,
                            s = 0;
                        if (this.parent = t || this.parent, !this.parent) throw new Error("Terminal requires a parent element.");
                        for (this.context = this.parent.ownerDocument.defaultView, this.document = this.parent.ownerDocument, this.body = this.document.getElementsByTagName("body")[0], this.element = this.document.createElement("div"), this.element.classList.add("terminal"), this.element.classList.add("xterm"), this.element.classList.add("xterm-theme-" + this.theme), this.element.classList.add("xterm-cursor-style-" + this.options.cursorStyle), this.setCursorBlinking(this.options.cursorBlink), this.element.setAttribute("tabindex", 0), this.viewportElement = x.createElement("div"), this.viewportElement.classList.add("xterm-viewport"), this.element.appendChild(this.viewportElement), this.viewportScrollArea = x.createElement("div"), this.viewportScrollArea.classList.add("xterm-scroll-area"), this.viewportElement.appendChild(this.viewportScrollArea), this.selectionContainer = x.createElement("div"), this.selectionContainer.classList.add("xterm-selection"), this.element.appendChild(this.selectionContainer), this.rowContainer = x.createElement("div"), this.rowContainer.classList.add("xterm-rows"), this.element.appendChild(this.rowContainer), this.children = [], this.linkifier.attachToDom(x, this.children), this.helperContainer = x.createElement("div"), this.helperContainer.classList.add("xterm-helpers"), this.element.appendChild(this.helperContainer), this.textarea = x.createElement("textarea"), this.textarea.classList.add("xterm-helper-textarea"), this.textarea.setAttribute("autocorrect", "off"), this.textarea.setAttribute("autocapitalize", "off"), this.textarea.setAttribute("spellcheck", "false"), this.textarea.tabIndex = 0, this.textarea.addEventListener("focus", function () {
                            r.emit("focus", {
                                terminal: r
                            })
                        }), this.textarea.addEventListener("blur", function () {
                            r.emit("blur", {
                                terminal: r
                            })
                        }), this.helperContainer.appendChild(this.textarea), this.compositionView = x.createElement("div"), this.compositionView.classList.add("composition-view"), this.compositionHelper = new u.CompositionHelper(this.textarea, this.compositionView, this), this.helperContainer.appendChild(this.compositionView), this.charSizeStyleElement = x.createElement("style"), this.helperContainer.appendChild(this.charSizeStyleElement); s < this.rows; s++) this.insertRow();
                        if (this.parent.appendChild(this.element), this.charMeasure = new v.CharMeasure(x, this.helperContainer), this.charMeasure.on("charsizechanged", function () {
                            r.updateCharSizeStyles()
                        }), this.charMeasure.measure(), this.viewport = new m.Viewport(this, this.viewportElement, this.viewportScrollArea, this.charMeasure), this.renderer = new b.Renderer(this), this.selectionManager = new g.SelectionManager(this, this.buffer.lines, this.rowContainer, this.charMeasure), this.selectionManager.on("refresh", function (t) {
                            i.renderer.refreshSelection(t.start, t.end)
                        }), this.selectionManager.on("newselection", function (t) {
                            i.textarea.value = t, i.textarea.focus(), i.textarea.select()
                        }), this.on("scroll", function () {
                            return i.selectionManager.refresh()
                        }), this.viewportElement.addEventListener("scroll", function () {
                            return i.selectionManager.refresh()
                        }), this.refresh(0, this.rows - 1), this.initGlobal(), void 0 === e) {
                            var n = "You did not pass the `focus` argument in `Terminal.prototype.open()`.\n";
                            n += "The `focus` argument now defaults to `true` but starting with xterm.js 3.0 ", n += "it will default to `false`.", console.warn(n), e = !0
                        }
                        e && this.focus(), this.bindMouse(), this.emit("open")
                    }, r.loadAddon = function (r, s) {
                        return "object" == typeof i && "object" == typeof e ? t("./addons/" + r + "/" + r) : (console.error("Cannot load a module without a CommonJS or RequireJS environment."), !1)
                    }, r.prototype.updateCharSizeStyles = function () {
                        this.charSizeStyleElement.textContent = ".xterm-wide-char{width:" + 2 * this.charMeasure.width + "px;}.xterm-normal-char{width:" + this.charMeasure.width + "px;}.xterm-rows > div{height:" + this.charMeasure.height + "px;}"
                    }, r.prototype.bindMouse = function () {
                        function t(t) {
                            var e, i;
                            if (e = o(t), i = w.getRawByteCoords(t, l.rowContainer, l.charMeasure, l.cols, l.rows)) switch (r(e, i), t.overrideType || t.type) {
                            case "mousedown":
                                h = e;
                                break;
                            case "mouseup":
                                h = 32
                            }
                        }

                        function e(t) {
                            var e, i = h;
                            (e = w.getRawByteCoords(t, l.rowContainer, l.charMeasure, l.cols, l.rows)) && r(i += 32, e)
                        }

                        function i(t, e) {
                            if (l.utfMouse) {
                                if (2047 === e) return t.push(0);
                                e < 127 ? t.push(e) : (e > 2047 && (e = 2047), t.push(192 | e >> 6), t.push(128 | 63 & e))
                            } else {
                                if (255 === e) return t.push(0);
                                e > 127 && (e = 127), t.push(e)
                            }
                        }

                        function r(t, e) {
                            if (l.vt300Mouse) {
                                t &= 3, e.x -= 32, e.y -= 32;
                                var r = d.C0.ESC + "[24";
                                if (0 === t) r += "1";
                                else if (1 === t) r += "3";
                                else if (2 === t) r += "5";
                                else {
                                    if (3 === t) return;
                                    r += "0"
                                }
                                return r += "~[" + e.x + "," + e.y + "]\r", void l.send(r)
                            }
                            return l.decLocator ? (t &= 3, e.x -= 32, e.y -= 32, 0 === t ? t = 2 : 1 === t ? t = 4 : 2 === t ? t = 6 : 3 === t && (t = 3), void l.send(d.C0.ESC + "[" + t + ";" + (3 === t ? 4 : 0) + ";" + e.y + ";" + e.x + ";" + (e.page || 0) + "&w")) : l.urxvtMouse ? (e.x -= 32, e.y -= 32, e.x++, e.y++, void l.send(d.C0.ESC + "[" + t + ";" + e.x + ";" + e.y + "M")) : l.sgrMouse ? (e.x -= 32, e.y -= 32, void l.send(d.C0.ESC + "[<" + ((3 == (3 & t) ? -4 & t : t) - 32) + ";" + e.x + ";" + e.y + (3 == (3 & t) ? "m" : "M"))) : (i(r = [], t), i(r, e.x), i(r, e.y), void l.send(d.C0.ESC + "[M" + String.fromCharCode.apply(String, r)))
                        }

                        function o(t) {
                            var e, i, r, s, n;
                            switch (t.overrideType || t.type) {
                            case "mousedown":
                                e = null != t.button ? +t.button : null != t.which ? t.which - 1 : null, l.browser.isMSIE && (e = 1 === e ? 0 : 4 === e ? 1 : e);
                                break;
                            case "mouseup":
                                e = 3;
                                break;
                            case "DOMMouseScroll":
                                e = t.detail < 0 ? 64 : 65;
                                break;
                            case "wheel":
                                e = t.wheelDeltaY > 0 ? 64 : 65
                            }
                            return i = t.shiftKey ? 4 : 0, r = t.metaKey ? 8 : 0, s = t.ctrlKey ? 16 : 0, n = i | r | s, l.vt200Mouse ? n &= s : l.normalMouse || (n = 0), e = 32 + (n << 2) + e
                        }
                        var a = this.element,
                            l = this,
                            h = 32;
                        s(a, "mousedown", function (i) {
                            if (i.preventDefault(), l.focus(), l.mouseEvents) return t(i), l.vt200Mouse ? (i.overrideType = "mouseup", t(i), l.cancel(i)) : (l.normalMouse && s(l.document, "mousemove", e), l.x10Mouse || s(l.document, "mouseup", function i(r) {
                                return t(r), l.normalMouse && n(l.document, "mousemove", e), n(l.document, "mouseup", i), l.cancel(r)
                            }), l.cancel(i))
                        }), s(a, "wheel", function (e) {
                            if (l.mouseEvents && !(l.x10Mouse || l.vt300Mouse || l.decLocator)) return t(e), l.cancel(e)
                        }), s(a, "wheel", function (t) {
                            if (!l.mouseEvents) return l.viewport.onWheel(t), l.cancel(t)
                        }), s(a, "touchstart", function (t) {
                            if (!l.mouseEvents) return l.viewport.onTouchStart(t), l.cancel(t)
                        }), s(a, "touchmove", function (t) {
                            if (!l.mouseEvents) return l.viewport.onTouchMove(t), l.cancel(t)
                        })
                    }, r.prototype.destroy = function () {
                        this.readable = !1, this.writable = !1, this._events = {}, this.handler = function () {}, this.write = function () {}, this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element)
                    }, r.prototype.refresh = function (t, e) {
                        this.renderer && this.renderer.queueRefresh(t, e)
                    }, r.prototype.queueLinkification = function (t, e) {
                        if (this.linkifier)
                            for (var i = t; i <= e; i++) this.linkifier.linkifyRow(i)
                    }, r.prototype.showCursor = function () {
                        this.cursorState || (this.cursorState = 1, this.refresh(this.buffer.y, this.buffer.y))
                    }, r.prototype.scroll = function (t) {
                        var e;
                        this.buffer.lines.length === this.buffer.lines.maxLength && (this.buffer.lines.trimStart(1), this.buffer.ybase--, 0 !== this.buffer.ydisp && this.buffer.ydisp--), this.buffer.ybase++, this.userScrolling || (this.buffer.ydisp = this.buffer.ybase), e = this.buffer.ybase + this.rows - 1, (e -= this.rows - 1 - this.buffer.scrollBottom) === this.buffer.lines.length ? this.buffer.lines.push(this.blankLine(void 0, t)) : this.buffer.lines.splice(e, 0, this.blankLine(void 0, t)), 0 !== this.buffer.scrollTop && (0 !== this.buffer.ybase && (this.buffer.ybase--, this.userScrolling || (this.buffer.ydisp = this.buffer.ybase)), this.buffer.lines.splice(this.buffer.ybase + this.buffer.scrollTop, 1)), this.updateRange(this.buffer.scrollTop), this.updateRange(this.buffer.scrollBottom), this.emit("scroll", this.buffer.ydisp)
                    }, r.prototype.scrollDisp = function (t, e) {
                        if (t < 0) {
                            if (0 === this.buffer.ydisp) return;
                            this.userScrolling = !0
                        } else t + this.buffer.ydisp >= this.buffer.ybase && (this.userScrolling = !1);
                        var i = this.buffer.ydisp;
                        this.buffer.ydisp = Math.max(Math.min(this.buffer.ydisp + t, this.buffer.ybase), 0), i !== this.buffer.ydisp && (e || this.emit("scroll", this.buffer.ydisp), this.refresh(0, this.rows - 1))
                    }, r.prototype.scrollPages = function (t) {
                        this.scrollDisp(t * (this.rows - 1))
                    }, r.prototype.scrollToTop = function () {
                        this.scrollDisp(-this.buffer.ydisp)
                    }, r.prototype.scrollToBottom = function () {
                        this.scrollDisp(this.buffer.ybase - this.buffer.ydisp)
                    }, r.prototype.write = function (t) {
                        if (this.writeBuffer.push(t), this.options.useFlowControl && !this.xoffSentToCatchUp && this.writeBuffer.length >= 5 && (this.send(d.C0.DC3), this.xoffSentToCatchUp = !0), !this.writeInProgress && this.writeBuffer.length > 0) {
                            this.writeInProgress = !0;
                            var e = this;
                            setTimeout(function () {
                                e.innerWrite()
                            })
                        }
                    }, r.prototype.innerWrite = function () {
                        for (var t = this.writeBuffer.splice(0, 300); t.length > 0;) {
                            var e = t.shift();
                            e.length;
                            this.xoffSentToCatchUp && 0 === t.length && 0 === this.writeBuffer.length && (this.send(d.C0.DC1), this.xoffSentToCatchUp = !1), this.refreshStart = this.buffer.y, this.refreshEnd = this.buffer.y;
                            var i = this.parser.parse(e);
                            this.parser.setState(i), this.updateRange(this.buffer.y), this.refresh(this.refreshStart, this.refreshEnd)
                        }
                        if (this.writeBuffer.length > 0) {
                            var r = this;
                            setTimeout(function () {
                                r.innerWrite()
                            }, 0)
                        } else this.writeInProgress = !1
                    }, r.prototype.writeln = function (t) {
                        this.write(t + "\r\n")
                    }, r.prototype.attachCustomKeydownHandler = function (t) {
                        console.warn("attachCustomKeydownHandler() is DEPRECATED and will be removed soon. Please use attachCustomKeyEventHandler() instead."), this.attachCustomKeyEventHandler(t)
                    }, r.prototype.attachCustomKeyEventHandler = function (t) {
                        this.customKeyEventHandler = t
                    }, r.prototype.setHypertextLinkHandler = function (t) {
                        if (!this.linkifier) throw new Error("Cannot attach a hypertext link handler before Terminal.open is called");
                        this.linkifier.setHypertextLinkHandler(t), this.refresh(0, this.rows - 1)
                    }, r.prototype.setHypertextValidationCallback = function (t) {
                        if (!this.linkifier) throw new Error("Cannot attach a hypertext validation callback before Terminal.open is called");
                        this.linkifier.setHypertextValidationCallback(t), this.refresh(0, this.rows - 1)
                    }, r.prototype.registerLinkMatcher = function (t, e, i) {
                        if (this.linkifier) {
                            var r = this.linkifier.registerLinkMatcher(t, e, i);
                            return this.refresh(0, this.rows - 1), r
                        }
                    }, r.prototype.deregisterLinkMatcher = function (t) {
                        this.linkifier && this.linkifier.deregisterLinkMatcher(t) && this.refresh(0, this.rows - 1)
                    }, r.prototype.hasSelection = function () {
                        return !!this.selectionManager && this.selectionManager.hasSelection
                    }, r.prototype.getSelection = function () {
                        return this.selectionManager ? this.selectionManager.selectionText : ""
                    }, r.prototype.clearSelection = function () {
                        this.selectionManager && this.selectionManager.clearSelection()
                    }, r.prototype.selectAll = function () {
                        this.selectionManager && this.selectionManager.selectAll()
                    }, r.prototype.keyDown = function (t) {
                        if (this.customKeyEventHandler && !1 === this.customKeyEventHandler(t)) return !1;
                        if (this.restartCursorBlinking(), !this.compositionHelper.keydown.bind(this.compositionHelper)(t)) return this.buffer.ybase !== this.buffer.ydisp && this.scrollToBottom(), !1;
                        var e = this.evaluateKeyEscapeSequence(t);
                        return e.key === d.C0.DC3 ? this.writeStopped = !0 : e.key === d.C0.DC1 && (this.writeStopped = !1), e.scrollDisp ? (this.scrollDisp(e.scrollDisp), this.cancel(t, !0)) : !!a(this, t) || (e.cancel && this.cancel(t, !0), !e.key || (this.emit("keydown", t), this.emit("key", e.key, t), this.showCursor(), this.handler(e.key), this.cancel(t, !0)))
                    }, r.prototype.evaluateKeyEscapeSequence = function (t) {
                        var e = {
                                cancel: !1,
                                key: void 0,
                                scrollDisp: void 0
                            },
                            i = t.shiftKey << 0 | t.altKey << 1 | t.ctrlKey << 2 | t.metaKey << 3;
                        switch (t.keyCode) {
                        case 8:
                            if (t.shiftKey) {
                                e.key = d.C0.BS;
                                break
                            }
                            e.key = d.C0.DEL;
                            break;
                        case 9:
                            if (t.shiftKey) {
                                e.key = d.C0.ESC + "[Z";
                                break
                            }
                            e.key = d.C0.HT, e.cancel = !0;
                            break;
                        case 13:
                            e.key = d.C0.CR, e.cancel = !0;
                            break;
                        case 27:
                            e.key = d.C0.ESC, e.cancel = !0;
                            break;
                        case 37:
                            i ? (e.key = d.C0.ESC + "[1;" + (i + 1) + "D", e.key == d.C0.ESC + "[1;3D" && (e.key = this.browser.isMac ? d.C0.ESC + "b" : d.C0.ESC + "[1;5D")) : this.applicationCursor ? e.key = d.C0.ESC + "OD" : e.key = d.C0.ESC + "[D";
                            break;
                        case 39:
                            i ? (e.key = d.C0.ESC + "[1;" + (i + 1) + "C", e.key == d.C0.ESC + "[1;3C" && (e.key = this.browser.isMac ? d.C0.ESC + "f" : d.C0.ESC + "[1;5C")) : this.applicationCursor ? e.key = d.C0.ESC + "OC" : e.key = d.C0.ESC + "[C";
                            break;
                        case 38:
                            i ? (e.key = d.C0.ESC + "[1;" + (i + 1) + "A", e.key == d.C0.ESC + "[1;3A" && (e.key = d.C0.ESC + "[1;5A")) : this.applicationCursor ? e.key = d.C0.ESC + "OA" : e.key = d.C0.ESC + "[A";
                            break;
                        case 40:
                            i ? (e.key = d.C0.ESC + "[1;" + (i + 1) + "B", e.key == d.C0.ESC + "[1;3B" && (e.key = d.C0.ESC + "[1;5B")) : this.applicationCursor ? e.key = d.C0.ESC + "OB" : e.key = d.C0.ESC + "[B";
                            break;
                        case 45:
                            t.shiftKey || t.ctrlKey || (e.key = d.C0.ESC + "[2~");
                            break;
                        case 46:
                            e.key = i ? d.C0.ESC + "[3;" + (i + 1) + "~" : d.C0.ESC + "[3~";
                            break;
                        case 36:
                            i ? e.key = d.C0.ESC + "[1;" + (i + 1) + "H" : this.applicationCursor ? e.key = d.C0.ESC + "OH" : e.key = d.C0.ESC + "[H";
                            break;
                        case 35:
                            i ? e.key = d.C0.ESC + "[1;" + (i + 1) + "F" : this.applicationCursor ? e.key = d.C0.ESC + "OF" : e.key = d.C0.ESC + "[F";
                            break;
                        case 33:
                            t.shiftKey ? e.scrollDisp = -(this.rows - 1) : e.key = d.C0.ESC + "[5~";
                            break;
                        case 34:
                            t.shiftKey ? e.scrollDisp = this.rows - 1 : e.key = d.C0.ESC + "[6~";
                            break;
                        case 112:
                            e.key = i ? d.C0.ESC + "[1;" + (i + 1) + "P" : d.C0.ESC + "OP";
                            break;
                        case 113:
                            e.key = i ? d.C0.ESC + "[1;" + (i + 1) + "Q" : d.C0.ESC + "OQ";
                            break;
                        case 114:
                            e.key = i ? d.C0.ESC + "[1;" + (i + 1) + "R" : d.C0.ESC + "OR";
                            break;
                        case 115:
                            e.key = i ? d.C0.ESC + "[1;" + (i + 1) + "S" : d.C0.ESC + "OS";
                            break;
                        case 116:
                            e.key = i ? d.C0.ESC + "[15;" + (i + 1) + "~" : d.C0.ESC + "[15~";
                            break;
                        case 117:
                            e.key = i ? d.C0.ESC + "[17;" + (i + 1) + "~" : d.C0.ESC + "[17~";
                            break;
                        case 118:
                            e.key = i ? d.C0.ESC + "[18;" + (i + 1) + "~" : d.C0.ESC + "[18~";
                            break;
                        case 119:
                            e.key = i ? d.C0.ESC + "[19;" + (i + 1) + "~" : d.C0.ESC + "[19~";
                            break;
                        case 120:
                            e.key = i ? d.C0.ESC + "[20;" + (i + 1) + "~" : d.C0.ESC + "[20~";
                            break;
                        case 121:
                            e.key = i ? d.C0.ESC + "[21;" + (i + 1) + "~" : d.C0.ESC + "[21~";
                            break;
                        case 122:
                            e.key = i ? d.C0.ESC + "[23;" + (i + 1) + "~" : d.C0.ESC + "[23~";
                            break;
                        case 123:
                            e.key = i ? d.C0.ESC + "[24;" + (i + 1) + "~" : d.C0.ESC + "[24~";
                            break;
                        default:
                            !t.ctrlKey || t.shiftKey || t.altKey || t.metaKey ? this.browser.isMac || !t.altKey || t.ctrlKey || t.metaKey ? this.browser.isMac && !t.altKey && !t.ctrlKey && t.metaKey && 65 === t.keyCode && this.selectAll() : t.keyCode >= 65 && t.keyCode <= 90 ? e.key = d.C0.ESC + String.fromCharCode(t.keyCode + 32) : 192 === t.keyCode ? e.key = d.C0.ESC + "`" : t.keyCode >= 48 && t.keyCode <= 57 && (e.key = d.C0.ESC + (t.keyCode - 48)) : t.keyCode >= 65 && t.keyCode <= 90 ? e.key = String.fromCharCode(t.keyCode - 64) : 32 === t.keyCode ? e.key = String.fromCharCode(0) : t.keyCode >= 51 && t.keyCode <= 55 ? e.key = String.fromCharCode(t.keyCode - 51 + 27) : 56 === t.keyCode ? e.key = String.fromCharCode(127) : 219 === t.keyCode ? e.key = String.fromCharCode(27) : 220 === t.keyCode ? e.key = String.fromCharCode(28) : 221 === t.keyCode && (e.key = String.fromCharCode(29))
                        }
                        return e
                    }, r.prototype.setgLevel = function (t) {
                        this.glevel = t, this.charset = this.charsets[t]
                    }, r.prototype.setgCharset = function (t, e) {
                        this.charsets[t] = e, this.glevel === t && (this.charset = e)
                    }, r.prototype.keyPress = function (t) {
                        var e;
                        if (this.customKeyEventHandler && !1 === this.customKeyEventHandler(t)) return !1;
                        if (this.cancel(t), t.charCode) e = t.charCode;
                        else if (null == t.which) e = t.keyCode;
                        else {
                            if (0 === t.which || 0 === t.charCode) return !1;
                            e = t.which
                        }
                        return !(!e || (t.altKey || t.ctrlKey || t.metaKey) && !a(this, t)) && (e = String.fromCharCode(e), this.emit("keypress", e, t), this.emit("key", e, t), this.showCursor(), this.handler(e), !0)
                    }, r.prototype.send = function (t) {
                        var e = this;
                        this.queue || setTimeout(function () {
                            e.handler(e.queue), e.queue = ""
                        }, 1), this.queue += t
                    }, r.prototype.bell = function () {
                        if (this.visualBell) {
                            var t = this;
                            this.element.style.borderColor = "white", setTimeout(function () {
                                t.element.style.borderColor = ""
                            }, 10), this.popOnBell && this.focus()
                        }
                    }, r.prototype.log = function () {
                        if (this.debug && this.context.console && this.context.console.log) {
                            var t = Array.prototype.slice.call(arguments);
                            this.context.console.log.apply(this.context.console, t)
                        }
                    }, r.prototype.error = function () {
                        if (this.debug && this.context.console && this.context.console.error) {
                            var t = Array.prototype.slice.call(arguments);
                            this.context.console.error.apply(this.context.console, t)
                        }
                    }, r.prototype.resize = function (t, e) {
                        if (!isNaN(t) && !isNaN(e)) {
                            e > this.getOption("scrollback") && this.setOption("scrollback", e);
                            var i;
                            if (t !== this.cols || e !== this.rows) {
                                for (t < 1 && (t = 1), e < 1 && (e = 1), this.buffers.resize(t, e); this.children.length < e;) this.insertRow();
                                for (; this.children.length > e;)(i = this.children.shift()) && i.parentNode.removeChild(i);
                                this.cols = t, this.rows = e, this.setupStops(this.cols), this.charMeasure.measure(), this.refresh(0, this.rows - 1), this.geometry = [this.cols, this.rows], this.emit("resize", {
                                    terminal: this,
                                    cols: t,
                                    rows: e
                                })
                            } else this.charMeasure.width && this.charMeasure.height || this.charMeasure.measure()
                        }
                    }, r.prototype.updateRange = function (t) {
                        t < this.refreshStart && (this.refreshStart = t), t > this.refreshEnd && (this.refreshEnd = t)
                    }, r.prototype.maxRange = function () {
                        this.refreshStart = 0, this.refreshEnd = this.rows - 1
                    }, r.prototype.setupStops = function (t) {
                        for (null != t ? this.buffer.tabs[t] || (t = this.prevStop(t)) : (this.buffer.tabs = {}, t = 0); t < this.cols; t += this.getOption("tabStopWidth")) this.buffer.tabs[t] = !0
                    }, r.prototype.prevStop = function (t) {
                        for (null == t && (t = this.buffer.x); !this.buffer.tabs[--t] && t > 0;);
                        return t >= this.cols ? this.cols - 1 : t < 0 ? 0 : t
                    }, r.prototype.nextStop = function (t) {
                        for (null == t && (t = this.buffer.x); !this.buffer.tabs[++t] && t < this.cols;);
                        return t >= this.cols ? this.cols - 1 : t < 0 ? 0 : t
                    }, r.prototype.eraseRight = function (t, e) {
                        var i = this.buffer.lines.get(this.buffer.ybase + e);
                        if (i) {
                            for (var r = [this.eraseAttr(), " ", 1]; t < this.cols; t++) i[t] = r;
                            this.updateRange(e)
                        }
                    }, r.prototype.eraseLeft = function (t, e) {
                        var i = this.buffer.lines.get(this.buffer.ybase + e);
                        if (i) {
                            var r = [this.eraseAttr(), " ", 1];
                            for (t++; t--;) i[t] = r;
                            this.updateRange(e)
                        }
                    }, r.prototype.clear = function () {
                        if (0 !== this.buffer.ybase || 0 !== this.buffer.y) {
                            this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y)), this.buffer.lines.length = 1, this.buffer.ydisp = 0, this.buffer.ybase = 0, this.buffer.y = 0;
                            for (var t = 1; t < this.rows; t++) this.buffer.lines.push(this.blankLine());
                            this.refresh(0, this.rows - 1), this.emit("scroll", this.buffer.ydisp)
                        }
                    }, r.prototype.eraseLine = function (t) {
                        this.eraseRight(0, t)
                    }, r.prototype.blankLine = function (t, e, i) {
                        var r = [t ? this.eraseAttr() : this.defAttr, " ", 1],
                            s = [],
                            n = 0;
                        for (e && (s.isWrapped = e), i = i || this.cols; n < i; n++) s[n] = r;
                        return s
                    }, r.prototype.ch = function (t) {
                        return t ? [this.eraseAttr(), " ", 1] : [this.defAttr, " ", 1]
                    }, r.prototype.is = function (t) {
                        return 0 === (this.termName + "").indexOf(t)
                    }, r.prototype.handler = function (t) {
                        this.options.disableStdin || (this.selectionManager && this.selectionManager.hasSelection && this.selectionManager.clearSelection(), this.buffer.ybase !== this.buffer.ydisp && this.scrollToBottom(), this.emit("data", t))
                    }, r.prototype.handleTitle = function (t) {
                        this.emit("title", t)
                    }, r.prototype.index = function () {
                        ++this.buffer.y > this.buffer.scrollBottom && (this.buffer.y--, this.scroll()), this.buffer.x >= this.cols && this.buffer.x--
                    }, r.prototype.reverseIndex = function () {
                        this.buffer.y === this.buffer.scrollTop ? (this.buffer.lines.shiftElements(this.buffer.y + this.buffer.ybase, this.rows - 1, 1), this.buffer.lines.set(this.buffer.y + this.buffer.ybase, this.blankLine(!0)), this.updateRange(this.buffer.scrollTop), this.updateRange(this.buffer.scrollBottom)) : this.buffer.y--
                    }, r.prototype.reset = function () {
                        this.options.rows = this.rows, this.options.cols = this.cols;
                        var t = this.customKeyEventHandler,
                            e = this.cursorBlinkInterval,
                            i = this.inputHandler;
                        r.call(this, this.options), this.customKeyEventHandler = t, this.cursorBlinkInterval = e, this.inputHandler = i, this.refresh(0, this.rows - 1), this.viewport.syncScrollArea()
                    }, r.prototype.tabSet = function () {
                        this.buffer.tabs[this.buffer.x] = !0
                    }, r.prototype.matchColor = l, l._cache = {}, l.distance = function (t, e, i, r, s, n) {
                        return Math.pow(30 * (t - r), 2) + Math.pow(59 * (e - s), 2) + Math.pow(11 * (i - n), 2)
                    }, r.translateBufferLineToString = E.translateBufferLineToString, r.EventEmitter = f.EventEmitter, r.inherits = o, r.on = s, r.off = n, r.cancel = function (t, e) {
                        if (this.cancelEvents || e) return t.preventDefault(), t.stopPropagation(), !1
                    }, e.exports = r
            }, {
                "./BufferSet": 2,
                "./CompositionHelper": 4,
                "./EscapeSequences": 5,
                "./EventEmitter": 6,
                "./InputHandler": 7,
                "./Linkifier": 8,
                "./Parser": 9,
                "./Renderer": 10,
                "./SelectionManager": 11,
                "./Viewport": 13,
                "./handlers/Clipboard": 14,
                "./utils/Browser": 15,
                "./utils/BufferLine": 16,
                "./utils/CharMeasure": 17,
                "./utils/Mouse": 21
            }
        ]
    }, {}, [22])(22)
});