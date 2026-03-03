import { writable as re, get as Y, readable as Zo, derived as hr, fromStore as Jo } from "svelte/store";
import * as r from "svelte/internal/client";
import { onDestroy as Ne, getContext as I, afterUpdate as yr, onMount as _e, tick as we, setContext as Ee, beforeUpdate as Qo, untrack as $o } from "svelte";
const ea = 1 / 60 * 1e3, es = typeof performance < "u" ? () => performance.now() : () => Date.now(), ta = typeof window < "u" ? (e) => window.requestAnimationFrame(e) : (e) => setTimeout(() => e(es()), ea);
function ts(e) {
  let t = [], n = [], a = 0, o = !1, i = !1;
  const s = /* @__PURE__ */ new WeakSet(), u = {
    schedule: (c, l = !1, f = !1) => {
      const d = f && o, p = d ? t : n;
      return l && s.add(c), p.indexOf(c) === -1 && (p.push(c), d && o && (a = t.length)), c;
    },
    cancel: (c) => {
      const l = n.indexOf(c);
      l !== -1 && n.splice(l, 1), s.delete(c);
    },
    process: (c) => {
      if (o) {
        i = !0;
        return;
      }
      if (o = !0, [t, n] = [n, t], n.length = 0, a = t.length, a)
        for (let l = 0; l < a; l++) {
          const f = t[l];
          f(c), s.has(f) && (u.schedule(f), e());
        }
      o = !1, i && (i = !1, u.process(c));
    }
  };
  return u;
}
const rs = 40;
let Yt = !0, Xe = !1, Wt = !1;
const Re = {
  delta: 0,
  timestamp: 0
}, at = [
  "read",
  "update",
  "preRender",
  "render",
  "postRender"
], Ot = at.reduce((e, t) => (e[t] = ts(() => Xe = !0), e), {}), oe = at.reduce((e, t) => {
  const n = Ot[t];
  return e[t] = (a, o = !1, i = !1) => (Xe || as(), n.schedule(a, o, i)), e;
}, {}), qe = at.reduce((e, t) => (e[t] = Ot[t].cancel, e), {}), De = at.reduce((e, t) => (e[t] = () => Ot[t].process(Re), e), {}), ns = (e) => Ot[e].process(Re), ra = (e) => {
  Xe = !1, Re.delta = Yt ? ea : Math.max(Math.min(e - Re.timestamp, rs), 1), Re.timestamp = e, Wt = !0, at.forEach(ns), Wt = !1, Xe && (Yt = !1, ta(ra));
}, as = () => {
  Xe = !0, Yt = !0, Wt || ta(ra);
}, Te = () => Re;
function _r(e) {
  return e;
}
function na({ top: e, left: t, right: n, bottom: a }) {
  return {
    x: { min: t, max: n },
    y: { min: e, max: a }
  };
}
function os({ x: e, y: t }) {
  return {
    top: t.min,
    bottom: t.max,
    left: e.min,
    right: e.max
  };
}
function ss({ top: e, left: t, bottom: n, right: a }, o) {
  o === void 0 && (o = _r);
  var i = o({ x: t, y: e }), s = o({ x: a, y: n });
  return {
    top: i.y,
    left: i.x,
    bottom: s.y,
    right: s.x
  };
}
function Se() {
  return { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } };
}
function is(e) {
  return {
    x: Object.assign({}, e.x),
    y: Object.assign({}, e.y)
  };
}
var Yr = {
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
};
function Wr() {
  return {
    x: Object.assign({}, Yr),
    y: Object.assign({}, Yr)
  };
}
var br = function(e, t) {
  return e.depth - t.depth;
};
function aa(e) {
  var t = e.projection.isEnabled;
  return t || e.shouldResetTransform();
}
function St(e, t) {
  t === void 0 && (t = []);
  var n = e.parent;
  return n && St(n, t), aa(e) && t.push(e), t;
}
function us(e) {
  var t = [], n = (a) => {
    aa(a) && t.push(a), a.children.forEach(n);
  };
  return e.children.forEach(n), t.sort(br);
}
function ht(e) {
  if (!e.shouldResetTransform()) {
    var t = e.getLayoutState();
    e.notifyBeforeLayoutMeasure(t.layout), t.isHydrated = !0, t.layout = e.measureViewportBox(), t.layoutCorrected = is(t.layout), e.notifyLayoutMeasure(t.layout, e.prevViewportBox || t.layout), oe.update(() => e.rebaseProjectionTarget());
  }
}
function oa(e, t) {
  e.shouldResetTransform() || (t || (e.prevViewportBox = e.measureViewportBox(!1)), e.rebaseProjectionTarget(!1, e.prevViewportBox));
}
var Ge = /* @__PURE__ */ new Set();
function Xr(e, t, n) {
  e[n] || (e[n] = []), e[n].push(t);
}
function Xt(e) {
  return Ge.add(e), function() {
    return Ge.delete(e);
  };
}
function Zt() {
  if (Ge.size) {
    var e = 0, t = [[]], n = [], a = function(u) {
      return Xr(t, u, e);
    }, o = function(u) {
      Xr(n, u, e), e++;
    };
    Ge.forEach(function(u) {
      u(a, o), e = 0;
    }), Ge.clear(), oe.postRender(function() {
      setTimeout(function() {
        return !1;
      }, 10);
    });
    for (var i = n.length, s = 0; s <= i; s++)
      t[s] && t[s].forEach(Zr), n[s] && n[s].forEach(Zr);
  }
}
var Zr = function(e) {
  return e();
}, J = /* @__PURE__ */ ((e) => (e[e.Entering = 0] = "Entering", e[e.Present = 1] = "Present", e[e.Exiting = 2] = "Exiting", e))(J || {}), ls = {
  layoutReady: (e) => e.notifyLayoutReady()
};
function xr() {
  var e = /* @__PURE__ */ new Set();
  return {
    add: (t) => e.add(t),
    flush: (t) => {
      var n = t === void 0 ? ls : t, a = n.layoutReady, o = n.parent;
      Xt((i, s) => {
        var u = Array.from(e).sort(br), c = o ? St(o) : [];
        s(() => {
          var l = [...c, ...u];
          l.forEach((f) => f.resetTransform());
        }), i(() => {
          u.forEach(ht);
        }), s(() => {
          c.forEach((l) => l.restoreTransform()), u.forEach(a);
        }), i(() => {
          u.forEach((l) => {
            l.isPresent && (l.presence = J.Present);
          });
        }), s(() => {
          De.preRender(), De.render();
        }), i(() => {
          oe.postRender(() => u.forEach(cs)), e.clear();
        });
      }), Zt();
    }
  };
}
function cs(e) {
  e.prevViewportBox = e.projection.target;
}
const Me = (e, t) => {
  if (!t || !window)
    return;
  let n = t;
  for (; n = n.parentNode; )
    if (n.motionDomContext && n.motionDomContext.has(e))
      return n.motionDomContext.get(e);
}, He = (e, t, n) => {
  t && window && (t.motionDomContext || (t.motionDomContext = /* @__PURE__ */ new Map()), t.motionDomContext.set(e, n));
};
function Ze(e) {
  return Me("SharedLayout", e) || re(xr());
}
var Jr = (e) => re(xr());
function Ce(e) {
  return "forceUpdate" in e;
}
function Jt(e, t) {
  r.push(t, !0);
  let n = r.prop(t, "handler", 3, void 0), a = r.prop(t, "options", 3, void 0), o = () => {
  };
  const i = (c, l, f, d) => {
    if (o(), !c)
      return () => {
      };
    const p = c.current;
    return f && p ? Ae(p, l, f, d) : () => {
    };
  };
  r.user_effect(() => {
    o = i(t.ref, t.eventName, n(), a());
  }), Ne(o);
  var s = r.comment(), u = r.first_child(s);
  r.snippet(u, () => t.children ?? r.noop), r.append(e, s), r.pop();
}
function Ae(e, t, n, a) {
  return e.addEventListener(t, n, a), function() {
    return e.removeEventListener(t, n, a);
  };
}
var U = /* @__PURE__ */ ((e) => (e.Animate = "animate", e.Hover = "whileHover", e.Tap = "whileTap", e.Drag = "whileDrag", e.Focus = "whileFocus", e.Exit = "exit", e))(U || {});
function sa(e, t) {
  r.push(t, !1);
  const n = r.mutable_source();
  let a = r.prop(t, "props", 8), o = r.prop(t, "visualElement", 8);
  const i = () => {
    o().animationState?.setActive(U.Focus, !0);
  }, s = () => {
    o().animationState?.setActive(U.Focus, !1);
  };
  r.legacy_pre_effect(() => (r.get(n), r.deep_read_state(a())), () => {
    ((u) => {
      r.set(n, u.whileFocus);
    })(a());
  }), r.legacy_pre_effect_reset(), r.init();
  {
    let u = r.derived_safe_equal(() => r.get(n) ? i : void 0);
    Jt(e, {
      get ref() {
        return o();
      },
      eventName: "focus",
      get handler() {
        return r.get(u);
      },
      children: (c, l) => {
        {
          let f = r.derived_safe_equal(() => r.get(n) ? s : void 0);
          Jt(c, {
            get ref() {
              return o();
            },
            eventName: "blur",
            get handler() {
              return r.get(f);
            },
            children: (d, p) => {
              var g = r.comment(), v = r.first_child(g);
              r.slot(v, t, "default", {}, null), r.append(d, g);
            },
            $$slots: { default: !0 }
          });
        }
      },
      $$slots: { default: !0 }
    });
  }
  r.pop();
}
function ia(e) {
  var t = null;
  return function() {
    var n = function() {
      t = null;
    };
    return t === null ? (t = e, n) : !1;
  };
}
var Qr = ia("dragHorizontal"), $r = ia("dragVertical");
function ua(e) {
  var t = !1;
  if (e === "y")
    t = $r();
  else if (e === "x")
    t = Qr();
  else {
    var n = Qr(), a = $r();
    n && a ? t = function() {
      n(), a();
    } : (n && n(), a && a());
  }
  return t;
}
function la() {
  var e = ua(!0);
  return e ? (e(), !1) : !0;
}
function ca(e) {
  return typeof PointerEvent < "u" && e instanceof PointerEvent ? e.pointerType === "mouse" : e instanceof MouseEvent;
}
function fa(e) {
  var t = !!e.touches;
  return t;
}
function fs(e) {
  return function(t) {
    var n = t instanceof MouseEvent, a = !n || n && t.button === 0;
    a && e(t);
  };
}
var ds = { pageX: 0, pageY: 0 };
function ps(e, t) {
  t === void 0 && (t = "page");
  var n = e.touches[0] || e.changedTouches[0], a = n || ds;
  return {
    x: a[t + "X"],
    y: a[t + "Y"]
  };
}
function gs(e, t) {
  return t === void 0 && (t = "page"), {
    x: e[t + "X"],
    y: e[t + "Y"]
  };
}
function Sr(e, t) {
  return t === void 0 && (t = "page"), {
    point: fa(e) ? ps(e, t) : gs(e, t)
  };
}
function vs(e) {
  return Sr(e, "client");
}
var Qt = function(e, t) {
  t === void 0 && (t = !1);
  var n = function(a) {
    return e(a, Sr(a));
  };
  return t ? fs(n) : n;
}, Pr = typeof window < "u", ms = function() {
  return Pr && window.onpointerdown === null;
}, hs = function() {
  return Pr && window.ontouchstart === null;
}, ys = function() {
  return Pr && window.onmousedown === null;
};
function Pt(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "ref", 8), a = r.prop(t, "eventName", 8), o = r.prop(t, "handler", 8, void 0), i = r.prop(t, "options", 8, void 0);
  r.init();
  {
    let s = r.derived_safe_equal(() => (r.deep_read_state($t), r.deep_read_state(a()), r.untrack(() => $t(a())))), u = r.derived_safe_equal(() => (r.deep_read_state(o()), r.deep_read_state(Qt), r.deep_read_state(a()), r.untrack(() => o() && Qt(o(), a() === "pointerdown"))));
    Jt(e, {
      get ref() {
        return n();
      },
      get eventName() {
        return r.get(s);
      },
      get handler() {
        return r.get(u);
      },
      get options() {
        return i();
      },
      children: (c, l) => {
        var f = r.comment(), d = r.first_child(f);
        r.slot(d, t, "default", {}, null), r.append(c, f);
      },
      $$slots: { default: !0 }
    });
  }
  r.pop();
}
const _s = {
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointercancel: "mousecancel",
  pointerover: "mouseover",
  pointerout: "mouseout",
  pointerenter: "mouseenter",
  pointerleave: "mouseleave"
}, bs = {
  pointerdown: "touchstart",
  pointermove: "touchmove",
  pointerup: "touchend",
  pointercancel: "touchcancel"
};
function $t(e) {
  return ms() ? e : hs() ? bs[e] : ys() ? _s[e] : e;
}
function Ie(e, t, n, a) {
  return Ae(
    e,
    $t(t),
    Qt(n, t === "pointerdown"),
    a
  );
}
function en(e, t, n) {
  return (a, o) => {
    !ca(a) || la() || (n?.(a, o), e.animationState?.setActive(U.Hover, t));
  };
}
var xs = r.from_html("<!> <!> <!>", 1);
function da(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "props", 8), a = r.prop(t, "visualElement", 8), o = n(), i = r.mutable_source(o.onHoverStart), s = r.mutable_source(o.onHoverEnd), u = r.mutable_source(o.whileHover);
  r.legacy_pre_effect(
    () => (r.get(i), r.get(s), r.get(u), r.deep_read_state(n())),
    () => {
      ((p) => {
        r.set(i, p.onHoverStart), r.set(s, p.onHoverEnd), r.set(u, p.whileHover);
      })(n());
    }
  ), r.legacy_pre_effect_reset(), r.init();
  var c = xs(), l = r.first_child(c);
  {
    let p = r.derived_safe_equal(() => (r.get(i), r.get(u), r.deep_read_state(a()), r.untrack(() => r.get(i) || r.get(u) ? en(a(), !0, r.get(i)) : void 0)));
    Pt(l, {
      get ref() {
        return a();
      },
      eventName: "pointerenter",
      get handler() {
        return r.get(p);
      }
    });
  }
  var f = r.sibling(l, 2);
  {
    let p = r.derived_safe_equal(() => (r.get(s), r.get(u), r.deep_read_state(a()), r.untrack(() => r.get(s) || r.get(u) ? en(a(), !1, r.get(s)) : void 0)));
    Pt(f, {
      get ref() {
        return a();
      },
      eventName: "pointerleave",
      get handler() {
        return r.get(p);
      }
    });
  }
  var d = r.sibling(f, 2);
  r.slot(d, t, "default", {}, null), r.append(e, c), r.pop();
}
var Q = (e) => Me("MotionConfig", e) || re({
  transformPagePoint: function(t) {
    return t;
  },
  isStatic: !1
});
function pa(e, t) {
  var n = {};
  for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0 && (n[a] = e[a]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, a = Object.getOwnPropertySymbols(e); o < a.length; o++)
      t.indexOf(a[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[o]) && (n[a[o]] = e[a[o]]);
  return n;
}
var Cr = function() {
}, Je = function() {
};
process.env.NODE_ENV !== "production" && (Cr = function(e, t) {
  !e && typeof console < "u" && console.warn(t);
}, Je = function(e, t) {
  if (!e)
    throw new Error(t);
});
const Ct = (e, t, n) => Math.min(Math.max(n, e), t), Ut = 1e-3, Ss = 0.01, tn = 10, Ps = 0.05, Cs = 1;
function Vs({ duration: e = 800, bounce: t = 0.25, velocity: n = 0, mass: a = 1 }) {
  let o, i;
  Cr(e <= tn * 1e3, "Spring duration must be 10 seconds or less");
  let s = 1 - t;
  s = Ct(Ps, Cs, s), e = Ct(Ss, tn, e / 1e3), s < 1 ? (o = (l) => {
    const f = l * s, d = f * e, p = f - n, g = er(l, s), v = Math.exp(-d);
    return Ut - p / g * v;
  }, i = (l) => {
    const d = l * s * e, p = d * n + n, g = Math.pow(s, 2) * Math.pow(l, 2) * e, v = Math.exp(-d), h = er(Math.pow(l, 2), s);
    return (-o(l) + Ut > 0 ? -1 : 1) * ((p - g) * v) / h;
  }) : (o = (l) => {
    const f = Math.exp(-l * e), d = (l - n) * e + 1;
    return -Ut + f * d;
  }, i = (l) => {
    const f = Math.exp(-l * e), d = (n - l) * (e * e);
    return f * d;
  });
  const u = 5 / e, c = ws(o, i, u);
  if (e = e * 1e3, isNaN(c))
    return {
      stiffness: 100,
      damping: 10,
      duration: e
    };
  {
    const l = Math.pow(c, 2) * a;
    return {
      stiffness: l,
      damping: s * 2 * Math.sqrt(a * l),
      duration: e
    };
  }
}
const Ts = 12;
function ws(e, t, n) {
  let a = n;
  for (let o = 1; o < Ts; o++)
    a = a - e(a) / t(a);
  return a;
}
function er(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const Es = ["duration", "bounce"], As = ["stiffness", "damping", "mass"];
function rn(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function Ms(e) {
  let t = Object.assign({ velocity: 0, stiffness: 100, damping: 10, mass: 1, isResolvedFromDuration: !1 }, e);
  if (!rn(e, As) && rn(e, Es)) {
    const n = Vs(e);
    t = Object.assign(Object.assign(Object.assign({}, t), n), { velocity: 0, mass: 1 }), t.isResolvedFromDuration = !0;
  }
  return t;
}
function Vr(e) {
  var { from: t = 0, to: n = 1, restSpeed: a = 2, restDelta: o } = e, i = pa(e, ["from", "to", "restSpeed", "restDelta"]);
  const s = { done: !1, value: t };
  let { stiffness: u, damping: c, mass: l, velocity: f, duration: d, isResolvedFromDuration: p } = Ms(i), g = nn, v = nn;
  function h() {
    const y = f ? -(f / 1e3) : 0, m = n - t, _ = c / (2 * Math.sqrt(u * l)), C = Math.sqrt(u / l) / 1e3;
    if (o === void 0 && (o = Math.min(Math.abs(n - t) / 100, 0.4)), _ < 1) {
      const S = er(C, _);
      g = (T) => {
        const P = Math.exp(-_ * C * T);
        return n - P * ((y + _ * C * m) / S * Math.sin(S * T) + m * Math.cos(S * T));
      }, v = (T) => {
        const P = Math.exp(-_ * C * T);
        return _ * C * P * (Math.sin(S * T) * (y + _ * C * m) / S + m * Math.cos(S * T)) - P * (Math.cos(S * T) * (y + _ * C * m) - S * m * Math.sin(S * T));
      };
    } else if (_ === 1)
      g = (S) => n - Math.exp(-C * S) * (m + (y + C * m) * S);
    else {
      const S = C * Math.sqrt(_ * _ - 1);
      g = (T) => {
        const P = Math.exp(-_ * C * T), x = Math.min(S * T, 300);
        return n - P * ((y + _ * C * m) * Math.sinh(x) + S * m * Math.cosh(x)) / S;
      };
    }
  }
  return h(), {
    next: (y) => {
      const m = g(y);
      if (p)
        s.done = y >= d;
      else {
        const _ = v(y) * 1e3, C = Math.abs(_) <= a, S = Math.abs(n - m) <= o;
        s.done = C && S;
      }
      return s.value = s.done ? n : m, s;
    },
    flipTarget: () => {
      f = -f, [t, n] = [n, t], h();
    }
  };
}
Vr.needsInterpolation = (e, t) => typeof e == "string" || typeof t == "string";
const nn = (e) => 0, Ue = (e, t, n) => {
  const a = t - e;
  return a === 0 ? 1 : (n - e) / a;
}, z = (e, t, n) => -n * e + n * t + e, ga = (e, t) => (n) => Math.max(Math.min(n, t), e), Ke = (e) => e % 1 ? Number(e.toFixed(5)) : e, Qe = /(-)?([\d]*\.?[\d])+/g, tr = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi, Ls = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function ot(e) {
  return typeof e == "string";
}
const Le = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, ke = Object.assign(Object.assign({}, Le), { transform: ga(0, 1) }), ft = Object.assign(Object.assign({}, Le), { default: 1 }), st = (e) => ({
  test: (t) => ot(t) && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), be = st("deg"), Be = st("%"), A = st("px"), Os = st("vh"), Ds = st("vw"), an = Object.assign(Object.assign({}, Be), { parse: (e) => Be.parse(e) / 100, transform: (e) => Be.transform(e * 100) }), Tr = (e, t) => (n) => !!(ot(n) && Ls.test(n) && n.startsWith(e) || t && Object.prototype.hasOwnProperty.call(n, t)), va = (e, t, n) => (a) => {
  if (!ot(a))
    return a;
  const [o, i, s, u] = a.match(Qe);
  return {
    [e]: parseFloat(o),
    [t]: parseFloat(i),
    [n]: parseFloat(s),
    alpha: u !== void 0 ? parseFloat(u) : 1
  };
}, Ve = {
  test: Tr("hsl", "hue"),
  parse: va("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: n, alpha: a = 1 }) => "hsla(" + Math.round(e) + ", " + Be.transform(Ke(t)) + ", " + Be.transform(Ke(n)) + ", " + Ke(ke.transform(a)) + ")"
}, js = ga(0, 255), Nt = Object.assign(Object.assign({}, Le), { transform: (e) => Math.round(js(e)) }), xe = {
  test: Tr("rgb", "red"),
  parse: va("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: n, alpha: a = 1 }) => "rgba(" + Nt.transform(e) + ", " + Nt.transform(t) + ", " + Nt.transform(n) + ", " + Ke(ke.transform(a)) + ")"
};
function Rs(e) {
  let t = "", n = "", a = "", o = "";
  return e.length > 5 ? (t = e.substr(1, 2), n = e.substr(3, 2), a = e.substr(5, 2), o = e.substr(7, 2)) : (t = e.substr(1, 1), n = e.substr(2, 1), a = e.substr(3, 1), o = e.substr(4, 1), t += t, n += n, a += a, o += o), {
    red: parseInt(t, 16),
    green: parseInt(n, 16),
    blue: parseInt(a, 16),
    alpha: o ? parseInt(o, 16) / 255 : 1
  };
}
const rr = {
  test: Tr("#"),
  parse: Rs,
  transform: xe.transform
}, Z = {
  test: (e) => xe.test(e) || rr.test(e) || Ve.test(e),
  parse: (e) => xe.test(e) ? xe.parse(e) : Ve.test(e) ? Ve.parse(e) : rr.parse(e),
  transform: (e) => ot(e) ? e : e.hasOwnProperty("red") ? xe.transform(e) : Ve.transform(e)
}, ma = "${c}", ha = "${n}";
function Is(e) {
  var t, n, a, o;
  return isNaN(e) && ot(e) && ((n = (t = e.match(Qe)) === null || t === void 0 ? void 0 : t.length) !== null && n !== void 0 ? n : 0) + ((o = (a = e.match(tr)) === null || a === void 0 ? void 0 : a.length) !== null && o !== void 0 ? o : 0) > 0;
}
function ya(e) {
  typeof e == "number" && (e = `${e}`);
  const t = [];
  let n = 0;
  const a = e.match(tr);
  a && (n = a.length, e = e.replace(tr, ma), t.push(...a.map(Z.parse)));
  const o = e.match(Qe);
  return o && (e = e.replace(Qe, ha), t.push(...o.map(Le.parse))), { values: t, numColors: n, tokenised: e };
}
function _a(e) {
  return ya(e).values;
}
function ba(e) {
  const { values: t, numColors: n, tokenised: a } = ya(e), o = t.length;
  return (i) => {
    let s = a;
    for (let u = 0; u < o; u++)
      s = s.replace(u < n ? ma : ha, u < n ? Z.transform(i[u]) : Ke(i[u]));
    return s;
  };
}
const Bs = (e) => typeof e == "number" ? 0 : e;
function Fs(e) {
  const t = _a(e);
  return ba(e)(t.map(Bs));
}
const he = { test: Is, parse: _a, createTransformer: ba, getAnimatableNone: Fs }, Us = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Ns(e) {
  let [t, n] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [a] = n.match(Qe) || [];
  if (!a)
    return e;
  const o = n.replace(a, "");
  let i = Us.has(t) ? 1 : 0;
  return a !== n && (i *= 100), t + "(" + i + o + ")";
}
const Hs = /([a-z-]*)\(.*?\)/g, nr = Object.assign(Object.assign({}, he), { getAnimatableNone: (e) => {
  const t = e.match(Hs);
  return t ? t.map(Ns).join(" ") : e;
} });
function Ht(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function on({ hue: e, saturation: t, lightness: n, alpha: a }) {
  e /= 360, t /= 100, n /= 100;
  let o = 0, i = 0, s = 0;
  if (!t)
    o = i = s = n;
  else {
    const u = n < 0.5 ? n * (1 + t) : n + t - n * t, c = 2 * n - u;
    o = Ht(c, u, e + 1 / 3), i = Ht(c, u, e), s = Ht(c, u, e - 1 / 3);
  }
  return {
    red: Math.round(o * 255),
    green: Math.round(i * 255),
    blue: Math.round(s * 255),
    alpha: a
  };
}
const zs = (e, t, n) => {
  const a = e * e, o = t * t;
  return Math.sqrt(Math.max(0, n * (o - a) + a));
}, qs = [rr, xe, Ve], sn = (e) => qs.find((t) => t.test(e)), un = (e) => `'${e}' is not an animatable color. Use the equivalent color code instead.`, wr = (e, t) => {
  let n = sn(e), a = sn(t);
  Je(!!n, un(e)), Je(!!a, un(t));
  let o = n.parse(e), i = a.parse(t);
  n === Ve && (o = on(o), n = xe), a === Ve && (i = on(i), a = xe);
  const s = Object.assign({}, o);
  return (u) => {
    for (const c in s)
      c !== "alpha" && (s[c] = zs(o[c], i[c], u));
    return s.alpha = z(o.alpha, i.alpha, u), n.transform(s);
  };
}, ar = (e) => typeof e == "number", Gs = (e, t) => (n) => t(e(n)), it = (...e) => e.reduce(Gs);
function xa(e, t) {
  return ar(e) ? (n) => z(e, t, n) : Z.test(e) ? wr(e, t) : Pa(e, t);
}
const Sa = (e, t) => {
  const n = [...e], a = n.length, o = e.map((i, s) => xa(i, t[s]));
  return (i) => {
    for (let s = 0; s < a; s++)
      n[s] = o[s](i);
    return n;
  };
}, Ks = (e, t) => {
  const n = Object.assign(Object.assign({}, e), t), a = {};
  for (const o in n)
    e[o] !== void 0 && t[o] !== void 0 && (a[o] = xa(e[o], t[o]));
  return (o) => {
    for (const i in a)
      n[i] = a[i](o);
    return n;
  };
};
function ln(e) {
  const t = he.parse(e), n = t.length;
  let a = 0, o = 0, i = 0;
  for (let s = 0; s < n; s++)
    a || typeof t[s] == "number" ? a++ : t[s].hue !== void 0 ? i++ : o++;
  return { parsed: t, numNumbers: a, numRGB: o, numHSL: i };
}
const Pa = (e, t) => {
  const n = he.createTransformer(t), a = ln(e), o = ln(t);
  return a.numHSL === o.numHSL && a.numRGB === o.numRGB && a.numNumbers >= o.numNumbers ? it(Sa(a.parsed, o.parsed), n) : (Cr(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), (s) => `${s > 0 ? t : e}`);
}, ks = (e, t) => (n) => z(e, t, n);
function Ys(e) {
  if (typeof e == "number")
    return ks;
  if (typeof e == "string")
    return Z.test(e) ? wr : Pa;
  if (Array.isArray(e))
    return Sa;
  if (typeof e == "object")
    return Ks;
}
function Ws(e, t, n) {
  const a = [], o = n || Ys(e[0]), i = e.length - 1;
  for (let s = 0; s < i; s++) {
    let u = o(e[s], e[s + 1]);
    if (t) {
      const c = Array.isArray(t) ? t[s] : t;
      u = it(c, u);
    }
    a.push(u);
  }
  return a;
}
function Xs([e, t], [n]) {
  return (a) => n(Ue(e, t, a));
}
function Zs(e, t) {
  const n = e.length, a = n - 1;
  return (o) => {
    let i = 0, s = !1;
    if (o <= e[0] ? s = !0 : o >= e[a] && (i = a - 1, s = !0), !s) {
      let c = 1;
      for (; c < n && !(e[c] > o || c === a); c++)
        ;
      i = c - 1;
    }
    const u = Ue(e[i], e[i + 1], o);
    return t[i](u);
  };
}
function Er(e, t, { clamp: n = !0, ease: a, mixer: o } = {}) {
  const i = e.length;
  Je(i === t.length, "Both input and output ranges must be the same length"), Je(!a || !Array.isArray(a) || a.length === i - 1, "Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."), e[0] > e[i - 1] && (e = [].concat(e), t = [].concat(t), e.reverse(), t.reverse());
  const s = Ws(t, a, o), u = i === 2 ? Xs(e, s) : Zs(e, s);
  return n ? (c) => u(Ct(e[0], e[i - 1], c)) : u;
}
const Dt = (e) => (t) => 1 - e(1 - t), Ar = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Js = (e) => (t) => Math.pow(t, e), Ca = (e) => (t) => t * t * ((e + 1) * t - e), Qs = (e) => {
  const t = Ca(e);
  return (n) => (n *= 2) < 1 ? 0.5 * t(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1)));
}, Va = 1.525, $s = 4 / 11, ei = 8 / 11, ti = 9 / 10, Mr = (e) => e, Lr = Js(2), ri = Dt(Lr), Ta = Ar(Lr), wa = (e) => 1 - Math.sin(Math.acos(e)), Or = Dt(wa), ni = Ar(Or), Dr = Ca(Va), ai = Dt(Dr), oi = Ar(Dr), si = Qs(Va), ii = 4356 / 361, ui = 35442 / 1805, li = 16061 / 1805, Vt = (e) => {
  if (e === 1 || e === 0)
    return e;
  const t = e * e;
  return e < $s ? 7.5625 * t : e < ei ? 9.075 * t - 9.9 * e + 3.4 : e < ti ? ii * t - ui * e + li : 10.8 * e * e - 20.52 * e + 10.72;
}, ci = Dt(Vt), fi = (e) => e < 0.5 ? 0.5 * (1 - Vt(1 - e * 2)) : 0.5 * Vt(e * 2 - 1) + 0.5;
function di(e, t) {
  return e.map(() => t || Ta).splice(0, e.length - 1);
}
function pi(e) {
  const t = e.length;
  return e.map((n, a) => a !== 0 ? a / (t - 1) : 0);
}
function gi(e, t) {
  return e.map((n) => n * t);
}
function yt({ from: e = 0, to: t = 1, ease: n, offset: a, duration: o = 300 }) {
  const i = { done: !1, value: e }, s = Array.isArray(t) ? t : [e, t], u = gi(a && a.length === s.length ? a : pi(s), o);
  function c() {
    return Er(u, s, {
      ease: Array.isArray(n) ? n : di(s, n)
    });
  }
  let l = c();
  return {
    next: (f) => (i.value = l(f), i.done = f >= o, i),
    flipTarget: () => {
      s.reverse(), l = c();
    }
  };
}
function vi({ velocity: e = 0, from: t = 0, power: n = 0.8, timeConstant: a = 350, restDelta: o = 0.5, modifyTarget: i }) {
  const s = { done: !1, value: t };
  let u = n * e;
  const c = t + u, l = i === void 0 ? c : i(c);
  return l !== c && (u = l - t), {
    next: (f) => {
      const d = -u * Math.exp(-f / a);
      return s.done = !(d > o || d < -o), s.value = s.done ? l : l + d, s;
    },
    flipTarget: () => {
    }
  };
}
const cn = { keyframes: yt, spring: Vr, decay: vi };
function mi(e) {
  if (Array.isArray(e.to))
    return yt;
  if (cn[e.type])
    return cn[e.type];
  const t = new Set(Object.keys(e));
  return t.has("ease") || t.has("duration") && !t.has("dampingRatio") ? yt : t.has("dampingRatio") || t.has("stiffness") || t.has("mass") || t.has("damping") || t.has("restSpeed") || t.has("restDelta") ? Vr : yt;
}
function Ea(e, t, n = 0) {
  return e - t - n;
}
function hi(e, t, n = 0, a = !0) {
  return a ? Ea(t + -e, t, n) : t - (e - t) + n;
}
function yi(e, t, n, a) {
  return a ? e >= t + n : e <= -n;
}
const _i = (e) => {
  const t = ({ delta: n }) => e(n);
  return {
    start: () => oe.update(t, !0),
    stop: () => qe.update(t)
  };
};
function jr(e) {
  var t, n, { from: a, autoplay: o = !0, driver: i = _i, elapsed: s = 0, repeat: u = 0, repeatType: c = "loop", repeatDelay: l = 0, onPlay: f, onStop: d, onComplete: p, onRepeat: g, onUpdate: v } = e, h = pa(e, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
  let { to: y } = h, m, _ = 0, C = h.duration, S, T = !1, P = !0, x;
  const E = mi(h);
  !((n = (t = E).needsInterpolation) === null || n === void 0) && n.call(t, a, y) && (x = Er([0, 100], [a, y], {
    clamp: !1
  }), a = 0, y = 100);
  const O = E(Object.assign(Object.assign({}, h), { from: a, to: y }));
  function M() {
    _++, c === "reverse" ? (P = _ % 2 === 0, s = hi(s, C, l, P)) : (s = Ea(s, C, l), c === "mirror" && O.flipTarget()), T = !1, g && g();
  }
  function L() {
    m.stop(), p && p();
  }
  function B(R) {
    if (P || (R = -R), s += R, !T) {
      const q = O.next(Math.max(0, s));
      S = q.value, x && (S = x(S)), T = P ? q.done : s <= 0;
    }
    v?.(S), T && (_ === 0 && (C ?? (C = s)), _ < u ? yi(s, C, l, P) && M() : L());
  }
  function D() {
    f?.(), m = i(B), m.start();
  }
  return o && D(), {
    stop: () => {
      d?.(), m.stop();
    }
  };
}
function Aa(e, t) {
  return t ? e * (1e3 / t) : 0;
}
function bi({ from: e = 0, velocity: t = 0, min: n, max: a, power: o = 0.8, timeConstant: i = 750, bounceStiffness: s = 500, bounceDamping: u = 10, restDelta: c = 1, modifyTarget: l, driver: f, onUpdate: d, onComplete: p, onStop: g }) {
  let v;
  function h(C) {
    return n !== void 0 && C < n || a !== void 0 && C > a;
  }
  function y(C) {
    return n === void 0 ? a : a === void 0 || Math.abs(n - C) < Math.abs(a - C) ? n : a;
  }
  function m(C) {
    v?.stop(), v = jr(Object.assign(Object.assign({}, C), {
      driver: f,
      onUpdate: (S) => {
        var T;
        d?.(S), (T = C.onUpdate) === null || T === void 0 || T.call(C, S);
      },
      onComplete: p,
      onStop: g
    }));
  }
  function _(C) {
    m(Object.assign({ type: "spring", stiffness: s, damping: u, restDelta: c }, C));
  }
  if (h(e))
    _({ from: e, velocity: t, to: y(e) });
  else {
    let C = o * t + e;
    typeof l < "u" && (C = l(C));
    const S = y(C), T = S === n ? -1 : 1;
    let P, x;
    const E = (O) => {
      P = x, x = O, t = Aa(O - P, Te().delta), (T === 1 && O > S || T === -1 && O < S) && _({ from: O, to: S, velocity: t });
    };
    m({
      type: "decay",
      from: e,
      velocity: t,
      timeConstant: i,
      power: o,
      restDelta: c,
      modifyTarget: l,
      onUpdate: h(C) ? E : void 0
    });
  }
  return {
    stop: () => v?.stop()
  };
}
const or = (e) => e.hasOwnProperty("x") && e.hasOwnProperty("y"), fn = (e) => or(e) && e.hasOwnProperty("z"), dt = (e, t) => Math.abs(e - t);
function Ma(e, t) {
  if (ar(e) && ar(t))
    return dt(e, t);
  if (or(e) && or(t)) {
    const n = dt(e.x, t.x), a = dt(e.y, t.y), o = fn(e) && fn(t) ? dt(e.z, t.z) : 0;
    return Math.sqrt(Math.pow(n, 2) + Math.pow(a, 2) + Math.pow(o, 2));
  }
}
const xi = (e, t, n) => {
  const a = t - e;
  return ((n - e) % a + a) % a + e;
}, La = (e, t) => 1 - 3 * t + 3 * e, Oa = (e, t) => 3 * t - 6 * e, Da = (e) => 3 * e, Tt = (e, t, n) => ((La(t, n) * e + Oa(t, n)) * e + Da(t)) * e, ja = (e, t, n) => 3 * La(t, n) * e * e + 2 * Oa(t, n) * e + Da(t), Si = 1e-7, Pi = 10;
function Ci(e, t, n, a, o) {
  let i, s, u = 0;
  do
    s = t + (n - t) / 2, i = Tt(s, a, o) - e, i > 0 ? n = s : t = s;
  while (Math.abs(i) > Si && ++u < Pi);
  return s;
}
const Vi = 8, Ti = 1e-3;
function wi(e, t, n, a) {
  for (let o = 0; o < Vi; ++o) {
    const i = ja(t, n, a);
    if (i === 0)
      return t;
    const s = Tt(t, n, a) - e;
    t -= s / i;
  }
  return t;
}
const _t = 11, pt = 1 / (_t - 1);
function Ei(e, t, n, a) {
  if (e === t && n === a)
    return Mr;
  const o = new Float32Array(_t);
  for (let s = 0; s < _t; ++s)
    o[s] = Tt(s * pt, e, n);
  function i(s) {
    let u = 0, c = 1;
    const l = _t - 1;
    for (; c !== l && o[c] <= s; ++c)
      u += pt;
    --c;
    const f = (s - o[c]) / (o[c + 1] - o[c]), d = u + f * pt, p = ja(d, e, n);
    return p >= Ti ? wi(s, d, e, n) : p === 0 ? d : Ci(s, u, u + pt, e, n);
  }
  return (s) => s === 0 || s === 1 ? s : Tt(i(s), t, a);
}
var wt = function(e) {
  return e * 1e3;
};
class Ra {
  /**
   * @internal
   */
  history;
  /**
   * @internal
   */
  startEvent = null;
  /**
   * @internal
   */
  lastMoveEvent = null;
  /**
   * @internal
   */
  lastMoveEventInfo = null;
  /**
   * @internal
   */
  transformPagePoint;
  /**
   * @internal
   */
  handlers = {};
  /**
   * @internal
   */
  removeListeners;
  // TODO: future implementation of newer features
  // /**
  //  * For determining if an animation should resume after it is interupted
  //  *
  //  * @internal
  //  */
  // private dragSnapToOrigin: boolean
  // /**
  //  * @internal
  //  */
  // private contextWindow: PanSessionOptions["contextWindow"] = window
  constructor(t, n, { transformPagePoint: a } = {}) {
    if (!(fa(t) && t.touches.length > 1)) {
      this.handlers = n, this.transformPagePoint = a;
      var o = Sr(t), i = zt(o, this.transformPagePoint), s = i.point, u = Te().timestamp;
      this.history = [{ ...s, timestamp: u }];
      var c = n.onSessionStart;
      c && c(t, qt(i, this.history)), this.removeListeners = it(
        Ie(window, "pointermove", this.handlePointerMove),
        Ie(window, "pointerup", this.handlePointerUp),
        Ie(window, "pointercancel", this.handlePointerUp)
      );
    }
  }
  updatePoint = () => {
    if (this.lastMoveEvent && this.lastMoveEventInfo) {
      var t = qt(this.lastMoveEventInfo, this.history), n = this.startEvent !== null, a = Ma(t.offset, { x: 0, y: 0 }) >= 3;
      if (!(!n && !a)) {
        var o = t.point, i = Te().timestamp;
        this.history.push(Object.assign(Object.assign({}, o), { timestamp: i }));
        var s = this.handlers, u = s.onStart, c = s.onMove;
        n || (u && u(this.lastMoveEvent, t), this.startEvent = this.lastMoveEvent), c && c(this.lastMoveEvent, t);
      }
    }
  };
  handlePointerMove = (t, n) => {
    if (this.lastMoveEvent = t, this.lastMoveEventInfo = zt(n, this.transformPagePoint), ca(t) && t.buttons === 0) {
      this.handlePointerUp(t, n);
      return;
    }
    oe.update(this.updatePoint, !0);
  };
  handlePointerUp = (t, n) => {
    this.end();
    var a = this.handlers, o = a.onEnd, i = a.onSessionEnd, s = qt(zt(n, this.transformPagePoint), this.history);
    this.startEvent && o && o(t, s), i && i(t, s);
  };
  updateHandlers = (t) => {
    this.handlers = t;
  };
  end = () => {
    this.removeListeners?.(), qe.update(this.updatePoint);
  };
}
function zt(e, t) {
  return t ? { point: t(e.point) } : e;
}
function dn(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function qt(e, t) {
  var n = e.point;
  return {
    point: n,
    delta: dn(n, Ia(t)),
    offset: dn(n, Ai(t)),
    velocity: Mi(t, 0.1)
  };
}
function Ai(e) {
  return e[0];
}
function Ia(e) {
  return e[e.length - 1];
}
function Mi(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  for (var n = e.length - 1, a = null, o = Ia(e); n >= 0 && (a = e[n], !(o.timestamp - a.timestamp > wt(t))); )
    n--;
  if (!a)
    return { x: 0, y: 0 };
  var i = (o.timestamp - a.timestamp) / 1e3;
  if (i === 0)
    return { x: 0, y: 0 };
  var s = {
    x: (o.x - a.x) / i,
    y: (o.y - a.y) / i
  };
  return s.x === Number.POSITIVE_INFINITY && (s.x = 0), s.y === Number.POSITIVE_INFINITY && (s.y = 0), s;
}
function Ba(e, t) {
  r.push(t, !1);
  const n = r.mutable_source(), a = r.mutable_source();
  let o = r.prop(t, "props", 8), i = r.prop(t, "visualElement", 8), s = r.prop(t, "isCustom", 8, !1), u = o(), c = r.mutable_source(u.onPan), l = r.mutable_source(u.onPanStart), f = r.mutable_source(u.onPanEnd), d = r.mutable_source(u.onPanSessionStart), p = r.mutable_source(null);
  const g = I(Q) || Q(s());
  let v = r.mutable_source({
    onSessionStart: r.get(d),
    onStart: r.get(l),
    onMove: r.get(c),
    onEnd: (y, m) => {
      r.set(p, null), r.get(f) && r.get(f)(y, m);
    }
  });
  function h(y) {
    r.set(p, new Ra(y, r.get(v), { transformPagePoint: r.get(a) }));
  }
  yr(() => {
    r.get(p) !== null && r.get(p).updateHandlers(r.get(v));
  }), Ne(() => r.get(p) && r.get(p).end()), r.legacy_pre_effect(
    () => (r.get(c), r.get(l), r.get(f), r.get(d), r.deep_read_state(o())),
    () => {
      ((y) => {
        r.set(c, y.onPan), r.set(l, y.onPanStart), r.set(f, y.onPanEnd), r.set(d, y.onPanSessionStart);
      })(o());
    }
  ), r.legacy_pre_effect(
    () => (r.get(c), r.get(l), r.get(f), r.get(d)),
    () => {
      r.set(n, r.get(c) || r.get(l) || r.get(f) || r.get(d));
    }
  ), r.legacy_pre_effect(() => (r.get(a), Y), () => {
    ((y) => {
      r.set(a, y.transformPagePoint);
    })(Y(g));
  }), r.legacy_pre_effect(
    () => (r.get(d), r.get(l), r.get(c), r.get(f)),
    () => {
      r.set(v, {
        onSessionStart: r.get(d),
        onStart: r.get(l),
        onMove: r.get(c),
        onEnd: (y, m) => {
          r.set(p, null), r.get(f) && r.get(f)(y, m);
        }
      });
    }
  ), r.legacy_pre_effect_reset(), r.init();
  {
    let y = r.derived_safe_equal(() => r.get(n) && h);
    Pt(e, {
      get ref() {
        return i();
      },
      eventName: "pointerdown",
      get handler() {
        return r.get(y);
      },
      children: (m, _) => {
        var C = r.comment(), S = r.first_child(C);
        r.slot(S, t, "default", {}, null), r.append(m, C);
      },
      $$slots: { default: !0 }
    });
  }
  r.pop();
}
var Fa = function(e, t) {
  return t ? e === t ? !0 : Fa(e, t.parentElement) : !1;
};
function Ua(e, t) {
  r.push(t, !1);
  const n = r.mutable_source(), a = r.mutable_source(), o = r.mutable_source(), i = r.mutable_source(), s = r.mutable_source();
  let u = r.prop(t, "props", 8), c = r.prop(t, "visualElement", 8), l = !1, f = null;
  function d() {
    f?.(), f = null;
  }
  function p() {
    return d(), l = !1, c().animationState?.setActive(U.Tap, !1), !la();
  }
  function g(y, m) {
    p() && (Fa(c().getInstance(), y.target) ? r.get(n)?.(y, m) : r.get(o)?.(y, m));
  }
  function v(y, m) {
    p() && r.get(o)?.(y, m);
  }
  function h(y, m) {
    l || (d(), l = !0, f = it(
      // @ts-expect-error
      Ie(window, "pointerup", g),
      Ie(window, "pointercancel", v)
    ), r.get(a)?.(y, m), c().animationState?.setActive(U.Tap, !0));
  }
  Ne(d), r.legacy_pre_effect(
    () => (r.get(n), r.get(a), r.get(o), r.get(i), r.deep_read_state(u())),
    () => {
      ((y) => {
        r.set(n, y.onTap), r.set(a, y.onTapStart), r.set(o, y.onTapCancel), r.set(i, y.whileTap);
      })(u());
    }
  ), r.legacy_pre_effect(
    () => (r.get(n), r.get(a), r.get(o), r.get(i)),
    () => {
      r.set(s, r.get(n) || r.get(a) || r.get(o) || r.get(i));
    }
  ), r.legacy_pre_effect_reset(), r.init();
  {
    let y = r.derived_safe_equal(() => r.get(s) ? h : void 0);
    Pt(e, {
      get ref() {
        return c();
      },
      eventName: "pointerdown",
      get handler() {
        return r.get(y);
      },
      children: (m, _) => {
        var C = r.comment(), S = r.first_child(C);
        r.slot(S, t, "default", {}, null), r.append(m, C);
      },
      $$slots: { default: !0 }
    });
  }
  r.pop();
}
var Li = r.from_html("<!> <!> <!> <!> <!>", 1);
function bc(e, t) {
  let n = r.prop(t, "props", 8), a = r.prop(t, "visualElement", 8);
  var o = Li(), i = r.first_child(o);
  Ba(i, {
    get props() {
      return n();
    },
    get visualElement() {
      return a();
    }
  });
  var s = r.sibling(i, 2);
  Ua(s, {
    get props() {
      return n();
    },
    get visualElement() {
      return a();
    }
  });
  var u = r.sibling(s, 2);
  da(u, {
    get props() {
      return n();
    },
    get visualElement() {
      return a();
    }
  });
  var c = r.sibling(u, 2);
  sa(c, {
    get props() {
      return n();
    },
    get visualElement() {
      return a();
    }
  });
  var l = r.sibling(c, 2);
  r.slot(l, t, "default", {}, null), r.append(e, o);
}
const le = (e) => Me("Presence", e) || re(null);
let Oi = 0;
const Di = () => Oi++;
function pn(e) {
  return e === null ? !0 : e.isPresent;
}
const xc = (e = !1) => {
  let t = I(le) || le(e);
  return hr(t, (n) => n === null ? !0 : n.isPresent);
}, Na = (e = !1) => {
  const t = I(le) || le(e), n = Y(t) === null ? void 0 : Di();
  return _e(() => {
    Y(t) !== null && Y(t).register(n);
  }), Y(t) === null ? Zo([!0, null]) : hr(
    t,
    (a) => !a.isPresent && a.onExitComplete ? [!1, () => a.onExitComplete?.(n)] : [!0]
  );
}, gn = (e) => Me("LayoutGroup", e) || re(null), sr = (e) => Me("Lazy", e) || re({ strict: !1 }), ye = (e) => Me("Motion", e) || re({});
function Ha(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(m, "$mc", u), a = () => r.store_get(C, "$layoutGroupId", u), o = () => r.store_get(y, "$lazyContext", u), i = () => r.store_get(h, "$presenceContext", u), s = () => r.store_get(v, "$config", u), [u, c] = r.setup_stores();
  let l = r.prop(t, "createVisualElement", 12, void 0), f = r.prop(t, "props", 8), d = r.prop(t, "Component", 8), p = r.prop(t, "visualState", 8), g = r.prop(t, "isCustom", 8);
  const v = I(Q) || Q(g()), h = I(le) || le(g()), y = I(sr) || sr(g()), m = I(ye) || ye(g());
  let _ = r.mutable_source(Y(m).visualElement);
  const C = I(gn) || gn(g());
  let S = r.mutable_source(a() && f().layoutId !== void 0 ? a() + "-" + f().layoutId : f().layoutId), T = r.mutable_source(), P = r.mutable_source(void 0);
  l() || l(o().renderer);
  let x = r.mutable_source(r.get(P));
  yr(() => {
    we().then(() => {
      r.get(x)?.animationState?.animateChanges();
    });
  }), Ne(() => {
    r.get(T)?.(), r.get(x)?.notifyUnmount();
  }), r.legacy_pre_effect(() => n(), () => {
    r.set(_, n().visualElement);
  }), r.legacy_pre_effect(() => (a(), r.deep_read_state(f())), () => {
    r.set(S, a() && f().layoutId !== void 0 ? a() + "-" + f().layoutId : f().layoutId);
  }), r.legacy_pre_effect(
    () => (r.get(P), r.deep_read_state(l()), r.deep_read_state(d()), r.deep_read_state(p()), r.get(_), r.deep_read_state(f()), r.get(S), i()),
    () => {
      !r.get(P) && l() && r.set(P, l()(d(), {
        visualState: p(),
        parent: r.get(_),
        props: { ...f(), layoutId: r.get(S) },
        presenceId: i()?.id,
        blockInitialAnimation: i()?.initial === !1
      }));
    }
  ), r.legacy_pre_effect(() => r.get(P), () => {
    r.set(x, r.get(P));
  }), r.legacy_pre_effect(
    () => (r.get(x), s(), r.deep_read_state(f()), r.get(S), i(), r.get(_), r.get(T)),
    () => {
      r.get(x) && (r.get(x).setProps({ ...s(), ...f(), layoutId: r.get(S) }), r.mutate(x, r.get(x).isPresent = pn(i())), r.mutate(x, r.get(x).isPresenceRoot = !r.get(_) || r.get(_).presenceId !== i()?.id), r.get(x).syncRender(), r.get(T) || r.set(T, h.subscribe((M) => {
        r.get(x) && (r.mutate(x, r.get(x).isPresent = pn(M)), r.mutate(x, r.get(x).isPresenceRoot = !r.get(_) || r.get(_).presenceId !== M?.id));
      })));
    }
  ), r.legacy_pre_effect_reset(), r.init();
  var E = r.comment(), O = r.first_child(E);
  r.slot(
    O,
    t,
    "default",
    {
      get visualElement() {
        return r.get(x);
      }
    },
    null
  ), r.append(e, E), r.pop(), c();
}
var me = function(e) {
  return {
    isEnabled: function(t) {
      return e.some(function(n) {
        return !!t[n];
      });
    }
  };
}, ir = {
  measureLayout: me(["layout", "layoutId", "drag"]),
  animation: me([
    "animate",
    "exit",
    "variants",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileDrag"
  ]),
  exit: me(["exit"]),
  drag: me(["drag", "dragControls"]),
  focus: me(["whileFocus"]),
  hover: me(["whileHover", "onHoverStart", "onHoverEnd"]),
  tap: me(["whileTap", "onTap", "onTapStart", "onTapCancel"]),
  pan: me([
    "onPan",
    "onPanStart",
    "onPanSessionStart",
    "onPanEnd"
  ]),
  layoutAnimation: me(["layout", "layoutId"])
};
function Fe(e) {
  for (var t in e) {
    var n = e[t];
    n !== null && (ir[t].Component = n);
  }
}
function za(e, t) {
  r.push(t, !1);
  const n = Object.keys(ir), a = n.length;
  let o = r.prop(t, "visualElement", 8), i = r.prop(t, "props", 8), s = r.mutable_source([]);
  r.legacy_pre_effect(
    () => (r.get(s), r.deep_read_state(i()), r.deep_read_state(o())),
    () => {
      r.set(s, []);
      for (let f = 0; f < a; f++) {
        const d = n[f], { isEnabled: p, Component: g } = ir[d];
        p(i()) && g && r.get(s).push({
          Component: g,
          key: d,
          props: i(),
          visualElement: o()
        });
      }
    }
  ), r.legacy_pre_effect_reset(), r.init();
  var u = r.comment(), c = r.first_child(u);
  {
    var l = (f) => {
      var d = r.comment(), p = r.first_child(d);
      r.slot(
        p,
        t,
        "default",
        {
          get features() {
            return r.get(s);
          }
        },
        null
      ), r.append(f, d);
    };
    r.if(c, (f) => {
      o() && f(l);
    });
  }
  r.append(e, u), r.pop();
}
function qa(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "value", 8), a = r.prop(t, "isCustom", 8), o = re(n());
  Ee(ye, o), He("Motion", a(), o), Ne(() => {
    n()?.visualElement?.unmount();
  }), r.legacy_pre_effect(() => r.deep_read_state(n()), () => {
    o.set(n());
  }), r.legacy_pre_effect_reset(), r.init();
  var i = r.comment(), s = r.first_child(i);
  r.slot(s, t, "default", {}, null), r.append(e, i), r.pop();
}
const ji = () => {
  try {
    return process.env || (process.env = {}), !0;
  } catch {
  }
  return !window || window.process && window.process.env ? !1 : (window.process || (window.process = {}), window.process.env = {}, !0);
};
ji();
function ur(e) {
  return typeof e == "string" && e.startsWith("var(--");
}
var Ga = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
function Ri(e) {
  var t = Ga.exec(e);
  if (!t) return [,];
  var [n, a, o] = t;
  return [a, o];
}
function lr(e, t, n) {
  var [a, o] = Ri(e);
  if (a) {
    var i = window.getComputedStyle(t).getPropertyValue(a);
    return i ? i.trim() : ur(o) ? lr(o, t) : o;
  }
}
function Ii(e, { ...t }, n) {
  var a = e.getInstance();
  if (!(a instanceof HTMLElement)) return { target: t, transitionEnd: n };
  n && (n = Object.assign({}, n)), e.forEachValue((u) => {
    var c = u.get();
    if (ur(c)) {
      var l = lr(c, a);
      l && u.set(l);
    }
  });
  for (var o in t) {
    var i = t[o];
    if (ur(i)) {
      var s = lr(i, a);
      s && (t[o] = s, n && ((_b = n[o]) !== null && _b !== void 0 ? _b : n[o] = i));
    }
  }
  return { target: t, transitionEnd: n };
}
function vn(e, t) {
  return e / (t.max - t.min) * 100;
}
function Bi(e, t, { target: n }) {
  if (typeof e == "string")
    if (A.test(e))
      e = Number.parseFloat(e);
    else
      return e;
  var a = vn(e, n.x), o = vn(e, n.y);
  return a + "% " + o + "%";
}
var mn = "_$css";
function Fi(e, { delta: t, treeScale: n }) {
  var a = e, o = e.includes("var("), i = [];
  o && (e = e.replace(Ga, (v) => (i.push(v), mn)));
  var s = he.parse(e);
  if (s.length > 5) return a;
  var u = he.createTransformer(e), c = typeof s[0] != "number" ? 1 : 0, l = t.x.scale * n.x, f = t.y.scale * n.y;
  s[0 + c] /= l, s[1 + c] /= f;
  var d = z(l, f, 0.5);
  typeof s[2 + c] == "number" && (s[2 + c] /= d), typeof s[3 + c] == "number" && (s[3 + c] /= d);
  var p = u(s);
  if (o) {
    var g = 0;
    p = p.replace(mn, () => {
      var v = i[g];
      return g++, v;
    });
  }
  return p;
}
var ze = {
  process: Bi
}, Ka = {
  borderRadius: Object.assign(Object.assign({}, ze), {
    applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
  }),
  borderTopLeftRadius: ze,
  borderTopRightRadius: ze,
  borderBottomLeftRadius: ze,
  borderBottomRightRadius: ze,
  boxShadow: {
    process: Fi
  }
}, Ye = Ka;
function Ui(e) {
  for (var t in e)
    Ye[t] = e[t];
}
var cr = ["", "X", "Y", "Z"], Ni = ["translate", "scale", "rotate", "skew"], $e = ["transformPerspective", "x", "y", "z"];
Ni.forEach(function(e) {
  return cr.forEach(function(t) {
    return $e.push(e + t);
  });
});
function Hi(e, t) {
  return $e.indexOf(e) - $e.indexOf(t);
}
var zi = new Set($e);
function jt(e) {
  return zi.has(e);
}
var qi = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
function ka(e) {
  return qi.has(e);
}
function Ya(e, t) {
  var n = t.layout, a = t.layoutId;
  return jt(e) || ka(e) || (n || a !== void 0) && !!Ye[e];
}
var pe = function(e) {
  return e !== null && typeof e == "object" && e.getVelocity;
}, Gi = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
function Ki({ transform: e, transformKeys: t }, { enableHardwareAcceleration: n, allowTransformNone: a }, o, i) {
  var s = "";
  t.sort(Hi);
  for (var u = !1, c = t.length, l = 0; l < c; l++) {
    var f = t[l];
    s += (Gi[f] || f) + "(" + e[f] + ") ", f === "z" && (u = !0);
  }
  return !u && n ? s += "translateZ(0)" : s = s.trim(), i ? s = i(e, o ? "" : s) : a && o && (s = "none"), s;
}
function ki({ originX: e = "50%", originY: t = "50%", originZ: n = 0 }) {
  return e + " " + t + " " + n;
}
function Wa(e) {
  return e.startsWith("--");
}
var Yi = function(e, t) {
  return t && typeof e == "number" ? t.transform(e) : e;
}, hn = Object.assign(Object.assign({}, Le), { transform: Math.round }), Xa = {
  // Border props
  borderWidth: A,
  borderTopWidth: A,
  borderRightWidth: A,
  borderBottomWidth: A,
  borderLeftWidth: A,
  borderRadius: A,
  radius: A,
  borderTopLeftRadius: A,
  borderTopRightRadius: A,
  borderBottomRightRadius: A,
  borderBottomLeftRadius: A,
  // Positioning props
  width: A,
  maxWidth: A,
  height: A,
  maxHeight: A,
  size: A,
  top: A,
  right: A,
  bottom: A,
  left: A,
  // Spacing props
  padding: A,
  paddingTop: A,
  paddingRight: A,
  paddingBottom: A,
  paddingLeft: A,
  margin: A,
  marginTop: A,
  marginRight: A,
  marginBottom: A,
  marginLeft: A,
  // Transform props
  rotate: be,
  rotateX: be,
  rotateY: be,
  rotateZ: be,
  scale: ft,
  scaleX: ft,
  scaleY: ft,
  scaleZ: ft,
  skew: be,
  skewX: be,
  skewY: be,
  distance: A,
  translateX: A,
  translateY: A,
  translateZ: A,
  x: A,
  y: A,
  z: A,
  perspective: A,
  transformPerspective: A,
  opacity: ke,
  originX: an,
  originY: an,
  originZ: A,
  // Misc
  zIndex: hn,
  // SVG
  fillOpacity: ke,
  strokeOpacity: ke,
  numOctaves: hn
};
function Rr(e, t, n, a, o, i, s, u) {
  var c, l = e.style, f = e.vars, d = e.transform, p = e.transformKeys, g = e.transformOrigin;
  p.length = 0;
  var v = !1, h = !1, y = !0;
  for (var m in t) {
    var _ = t[m];
    if (Wa(m)) {
      f[m] = _;
      continue;
    }
    var C = Xa[m], S = Yi(_, C);
    if (jt(m)) {
      if (v = !0, d[m] = S, p.push(m), !y)
        continue;
      _ !== ((c = C.default) !== null && c !== void 0 ? c : 0) && (y = !1);
    } else if (ka(m))
      g[m] = S, h = !0;
    else if (a && n && a.isHydrated && Ye[m]) {
      var T = Ye[m].process(_, a, n), P = Ye[m].applyTo;
      if (P)
        for (var x = P.length, E = 0; E < x; E++)
          l[P[E]] = T;
      else
        l[m] = T;
    } else
      l[m] = S;
  }
  a && n && s && u ? (l.transform = s(a.deltaFinal, a.treeScale, v ? d : void 0), i && (l.transform = i(d, l.transform)), l.transformOrigin = u(a)) : (v && (l.transform = Ki(e, o, y, i)), h && (l.transformOrigin = ki(g)));
}
var Ir = function() {
  return {
    style: {},
    transform: {},
    transformKeys: [],
    transformOrigin: {},
    vars: {}
  };
};
function Wi(e, t) {
  r.push(t, !0);
  const n = (s) => {
    let u = Ir();
    Rr(u, t.visualState, void 0, void 0, { enableHardwareAcceleration: !t.isStatic }, t.props.transformTemplate);
    const { vars: c, style: l } = u;
    return { ...c, ...l };
  }, a = r.derived(() => n(t.visualState));
  var o = r.comment(), i = r.first_child(o);
  r.snippet(i, () => t.children, () => r.get(a)), r.append(e, o), r.pop();
}
function Xi(e, t) {
  r.push(t, !1);
  const n = r.mutable_source();
  let a = r.prop(t, "visualState", 8), o = r.prop(t, "props", 8), i = r.prop(t, "isStatic", 8), s = r.mutable_source({});
  const u = Za, c = (l) => (Object.assign(r.get(s), l), o().transformValues && r.set(s, o().transformValues(r.get(s))), r.get(s));
  r.legacy_pre_effect(() => r.deep_read_state(o()), () => {
    r.set(n, o().style || {});
  }), r.legacy_pre_effect(() => (r.get(s), r.get(n), r.deep_read_state(o())), () => {
    u(r.get(s), r.get(n), o());
  }), r.legacy_pre_effect_reset(), r.init(), Wi(e, {
    get props() {
      return o();
    },
    get visualState() {
      return a();
    },
    get isStatic() {
      return i();
    },
    children: (f, d = r.noop) => {
      var p = r.comment(), g = r.first_child(p);
      {
        let v = r.derived_safe_equal(() => (d(), r.deep_read_state(o()), r.get(s), r.untrack(() => c({ s1: d(), props: o(), style: r.get(s) }))));
        r.slot(
          g,
          t,
          "default",
          {
            get styles() {
              return r.get(v);
            }
          },
          null
        );
      }
      r.append(f, p);
    },
    $$slots: { default: !0 }
  }), r.pop();
}
function Zi(e, t) {
  let n = r.prop(t, "props", 8), a = r.prop(t, "visualState", 8), o = r.prop(t, "isStatic", 8);
  const i = (s, u) => {
    let c = {
      draggable: !1,
      style: {
        userSelect: void 0,
        WebkitUserSelect: void 0,
        WebkitTouchCallout: void 0,
        touchAction: void 0
      }
    };
    return u.drag && (c.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = u.drag === !0 ? "none" : `pan-${u.drag === "x" ? "y" : "x"}`), c.style = s, c;
  };
  Xi(e, {
    get visualState() {
      return a();
    },
    get props() {
      return n();
    },
    get isStatic() {
      return o();
    },
    children: r.invalid_default_snippet,
    $$slots: {
      default: (s, u) => {
        const c = r.derived_safe_equal(() => u.styles);
        var l = r.comment(), f = r.first_child(l);
        {
          let d = r.derived_safe_equal(() => (r.deep_read_state(r.get(c)), r.deep_read_state(n()), r.untrack(() => i(r.get(c), n()))));
          r.slot(
            f,
            t,
            "default",
            {
              get visualProps() {
                return r.get(d);
              }
            },
            null
          );
        }
        r.append(s, l);
      }
    }
  });
}
const Ji = Zi;
function Za(e, t, n) {
  for (const a in t)
    !pe(t[a]) && !Ya(a, n) && (e[a] = t[a]);
}
function yn(e, t, n) {
  return typeof e == "string" ? e : A.transform?.(t + n * e);
}
function Qi(e, t, n) {
  var a = yn(t, e.x, e.width), o = yn(n, e.y, e.height);
  return a + " " + o;
}
var Gt = function(e, t) {
  return A.transform?.(e * t);
}, $i = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function eu(e, t, n, a, o, i) {
  a === void 0 && (a = 1), o === void 0 && (o = 0);
  var s = $i;
  e[s.offset] = Gt(-o, t);
  var u = Gt(n, t), c = Gt(a, t);
  e[s.array] = u + " " + c;
}
function Br(e, { attrX: t, attrY: n, originX: a, originY: o, pathLength: i, pathSpacing: s, pathOffset: u, ...c }, l, f, d, p, g, v) {
  Rr(
    e,
    c,
    l,
    f,
    d,
    p,
    g,
    v
  ), e.attrs = e.style, e.style = {};
  var h = e.attrs, y = e.style, m = e.dimensions, _ = e.totalPathLength;
  h.transform && (m && (y.transform = h.transform), delete h.transform), m && (a !== void 0 || o !== void 0 || y.transform) && (y.transformOrigin = Qi(
    m,
    // @ts-expect-error
    a !== void 0 ? a : 0.5,
    o !== void 0 ? o : 0.5
  )), t !== void 0 && (h.x = t), n !== void 0 && (h.y = n), _ !== void 0 && i !== void 0 && eu(h, _, i, s, u);
}
var Ja = () => Object.assign(Object.assign({}, Ir()), { attrs: {} });
function tu(e, t) {
  r.push(t, !0);
  let n = (s) => {
    const u = Ja();
    return Br(u, t.visualState, void 0, void 0, { enableHardwareAcceleration: !1 }, t.props.transformTemplate), { ...u.attrs, style: { ...u.style } };
  };
  const a = r.derived(() => n(t.visualState));
  r.user_effect(() => {
    if (t.props.style) {
      const s = {};
      Za(s, t.props.style, t.props), r.get(a).style = { ...s, ...r.get(a).style };
    }
  });
  var o = r.comment(), i = r.first_child(o);
  r.snippet(i, () => t.children ?? r.noop, () => r.get(a)), r.append(e, o), r.pop();
}
var ru = /* @__PURE__ */ new Set([
  "initial",
  "animate",
  "exit",
  "style",
  "variants",
  "transition",
  "transformTemplate",
  "transformValues",
  "custom",
  "inherit",
  "layout",
  "layoutId",
  "onLayoutAnimationComplete",
  "onViewportBoxUpdate",
  "onLayoutMeasure",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "drag",
  "dragControls",
  "dragListener",
  "dragConstraints",
  "dragDirectionLock",
  "_dragX",
  "_dragY",
  "dragElastic",
  "dragMomentum",
  "dragPropagation",
  "dragTransition",
  "whileDrag",
  "onPan",
  "onPanStart",
  "onPanEnd",
  "onPanSessionStart",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onHoverStart",
  "onHoverEnd",
  "whileFocus",
  "whileTap",
  "whileHover"
]);
function Et(e) {
  return ru.has(e);
}
var Qa = function(e) {
  return !Et(e);
};
try {
  var nu = require("@emotion/is-prop-valid").default;
  Qa = function(e) {
    return e.startsWith("on") ? !Et(e) : nu(e);
  };
} catch {
}
function au(e, t, n) {
  var a = {};
  for (var o in e)
    (Qa(o) || n === !0 && Et(o) || !t && !Et(o)) && (a[o] = e[o]);
  return a;
}
function $a(e, t) {
  r.push(t, !1);
  const n = r.mutable_source();
  let a = r.prop(t, "props", 8), o = r.prop(t, "visualState", 8), i = r.prop(t, "Component", 8), s = r.prop(t, "forwardMotionProps", 8, !1), u = r.prop(t, "isStatic", 8), c = r.prop(t, "ref", 8), l = r.prop(t, "targetEl", 8, void 0);
  const f = (g) => {
    c()(g);
  };
  r.legacy_pre_effect(
    () => (r.deep_read_state(a()), r.deep_read_state(i()), r.deep_read_state(s())),
    () => {
      r.set(n, au(a(), typeof i() == "string", s()));
    }
  ), r.legacy_pre_effect(() => r.deep_read_state(l()), () => {
    l() && f(l());
  }), r.legacy_pre_effect_reset(), r.init();
  var d = r.comment(), p = r.first_child(d);
  {
    const g = (v, h = r.noop) => {
      var y = r.comment(), m = r.first_child(y);
      {
        let _ = r.derived_safe_equal(() => (r.get(n), h(), r.untrack(() => ({ ...r.get(n), ...h() }))));
        r.slot(
          m,
          t,
          "default",
          {
            motion: f,
            get props() {
              return r.get(_);
            }
          },
          null
        );
      }
      r.append(v, y);
    };
    r.component(p, () => i() === "SVG" ? tu : Ji, (v, h) => {
      h(v, {
        get visualState() {
          return o();
        },
        get isStatic() {
          return u();
        },
        get props() {
          return a();
        },
        children: g,
        $$slots: { default: !0 }
      });
    });
  }
  r.append(e, d), r.pop();
}
function eo(e, t) {
  var n = e.getBoundingClientRect();
  return na(ss(n, t));
}
const et = (e) => Array.isArray(e);
var to = function(e) {
  return function(t) {
    return t.test(e);
  };
}, ou = {
  test: function(e) {
    return e === "auto";
  },
  parse: function(e) {
    return e;
  }
}, ro = [Le, A, Be, be, Ds, Os, ou], Kt = function(e) {
  return ro.find(to(e));
}, su = /* @__PURE__ */ new Set(["width", "height", "top", "left", "right", "bottom", "x", "y"]), no = (e) => su.has(e), iu = (e) => Object.keys(e).some(no), ao = (e, t) => {
  e.set(t, !1), e.set(t);
}, _n = (e) => e === Le || e === A, bn = (e, t) => Number.parseFloat(e.split(", ")[t]), xn = (e, t) => (n, a) => {
  if (varm = a.transform, transform === "none" || !transform) return 0;
  var o = transform.match(/^matrix3d\((.+)\)$/);
  if (o)
    return bn(o[1], t);
  var i = transform.match(/^matrix\((.+)\)$/);
  return i ? bn(i[1], e) : 0;
}, uu = /* @__PURE__ */ new Set(["x", "y", "z"]), lu = $e.filter((e) => !uu.has(e));
function cu(e) {
  var t = [];
  return lu.forEach((n) => {
    var a = e.getValue(n);
    a !== void 0 && (t.push([n, a.get()]), a.set(n.startsWith("scale") ? 1 : 0));
  }), t.length && e.syncRender(), t;
}
var Sn = {
  // Dimensions
  width: (e) => {
    var t = e.x;
    return t.max - t.min;
  },
  height: (e) => {
    var t = e.y;
    return t.max - t.min;
  },
  top: (e, t) => {
    var n = t.top;
    return n;
  },
  left: (e, t) => {
    var n = t.left;
    return n;
  },
  bottom: (e, t) => {
    var n = e.y, a = t.top;
    return a + (n.max - n.min);
  },
  right: (e, t) => {
    var n = e.x, a = t.left;
    return a + (n.max - n.min);
  },
  // Transform
  x: xn(4, 13),
  y: xn(5, 14)
}, fu = (e, t, n) => {
  var a = t.measureViewportBox(), o = t.getInstance(), i = getComputedStyle(o), s = i.display, u = i.top, c = i.left, l = i.bottom, f = i.right, d = i.transform, p = { top: u, left: c, bottom: l, right: f, transform: d };
  s === "none" && t.setStaticValue("display", e.display || "block"), t.syncRender();
  var g = t.measureViewportBox();
  return n.forEach((v) => {
    var h = t.getValue(v);
    ao(h, Sn[v](a, p)), e[v] = Sn[v](g, i);
  }), e;
}, du = (e, t, n, a) => {
  n === void 0 && (n = {}), a === void 0 && (a = {}), t = Object.assign({}, t), a = Object.assign({}, a);
  var o = Object.keys(t).filter(no), i = [], s = !1, u = [];
  if (o.forEach((l) => {
    var f = e.getValue(l);
    if (e.hasValue(l)) {
      var d = n[l], p = t[l], g = Kt(d), v;
      if (et(p))
        for (var h = p.length, y = p[0] === null ? 1 : 0; y < h; y++)
          v || (v = Kt(p[y]));
      else
        v = Kt(p);
      if (g !== v)
        if (_n(g) && _n(v)) {
          var m = f?.get();
          typeof m == "string" && f?.set(Number.parseFloat(m)), typeof p == "string" ? t[l] = Number.parseFloat(p) : Array.isArray(p) && v === A && (t[l] = p.map(Number.parseFloat));
        } else g?.transform && v?.transform && (d === 0 || p === 0) ? d === 0 ? f?.set(v?.transform(d)) : t[l] = g?.transform(p) : (s || (i = cu(e), s = !0), u.push(l), a[l] = a[l] !== void 0 ? a[l] : t[l], ao(f, p));
    }
  }), u.length) {
    var c = fu(t, e, u);
    return i.length && i.forEach((l) => {
      var [f, d] = l;
      e.getValue(f).set(d);
    }), e.syncRender(), { target: c, transitionEnd: a };
  } else
    return { target: t, transitionEnd: a };
};
function pu(e, t, n, a) {
  return iu(t) ? du(e, t, n, a) : { target: t, transitionEnd: a };
}
var gu = function(e, t, n, a) {
  var o = Ii(e, t, a);
  return t = o.target, a = o.transitionEnd, pu(e, t, n, a);
}, vu = Object.assign(Object.assign({}, Xa), {
  // Color props
  color: Z,
  backgroundColor: Z,
  outlineColor: Z,
  fill: Z,
  stroke: Z,
  // Border props
  borderColor: Z,
  borderTopColor: Z,
  borderRightColor: Z,
  borderBottomColor: Z,
  borderLeftColor: Z,
  filter: nr,
  WebkitFilter: nr
}), Fr = (e) => vu[e];
function te(e) {
  return [e("x"), e("y")];
}
function oo(e) {
  var t = e.getProps(), n = t.drag, a = t._dragX;
  return n && !a;
}
function Pn(e, t) {
  e.min = t.min, e.max = t.max;
}
function mu(e, t) {
  Pn(e.x, t.x), Pn(e.y, t.y);
}
function At(e, t, n) {
  var a = e - n, o = t * a;
  return n + o;
}
function Cn(e, t, n, a, o) {
  return o !== void 0 && (e = At(e, o, a)), At(e, n, a) + t;
}
function fr(e, t, n, a, o) {
  t === void 0 && (t = 0), n === void 0 && (n = 1), e.min = Cn(e.min, t, n, a, o), e.max = Cn(e.max, t, n, a, o);
}
function hu(e, { x: t, y: n }) {
  fr(e.x, t.translate, t.scale, t.originPoint), fr(e.y, n.translate, n.scale, n.originPoint);
}
function Vn(e, t, n, [a, o, i]) {
  e.min = t.min, e.max = t.max;
  var s = n[i] !== void 0 ? n[i] : 0.5, u = z(t.min, t.max, s);
  fr(e, n[a], n[o], u, n.scale);
}
var so = ["x", "scaleX", "originX"], io = ["y", "scaleY", "originY"];
function dr(e, t, n) {
  Vn(e.x, t.x, n, so), Vn(e.y, t.y, n, io);
}
function Tn(e, t, n, a, o) {
  return e -= t, e = At(e, 1 / n, a), o !== void 0 && (e = At(e, 1 / o, a)), e;
}
function yu(e, t, n, a, o) {
  t === void 0 && (t = 0), n === void 0 && (n = 1), a === void 0 && (a = 0.5);
  var i = z(e.min, e.max, a) - t;
  e.min = Tn(e.min, t, n, i, o), e.max = Tn(e.max, t, n, i, o);
}
function wn(e, t, [n, a, o]) {
  yu(e, t[n], t[a], t[o], t.scale);
}
function uo(e, t) {
  wn(e.x, t, so), wn(e.y, t, io);
}
function _u(e, t, n) {
  var a = n.length;
  if (a) {
    t.x = t.y = 1;
    for (var o, i, s = 0; s < a; s++)
      o = n[s], i = o.getLayoutState().delta, t.x *= i.x.scale, t.y *= i.y.scale, hu(e, i), oo(o) && dr(e, e, o.getLatestValues());
  }
}
var bu = function(e) {
  return Ct(0, 1, e);
};
function En(e, t, n) {
  return t === void 0 && (t = 0), n === void 0 && (n = 0.01), Ma(e, t) < n;
}
function tt(e) {
  return e.max - e.min;
}
function xu(e, t) {
  var n = 0.5, a = tt(e), o = tt(t);
  return o > a ? n = Ue(t.min, t.max - a, e.min) : a > o && (n = Ue(e.min, e.max - o, t.min)), bu(n);
}
function An(e, t, n, a) {
  a === void 0 && (a = 0.5), e.origin = a, e.originPoint = z(t.min, t.max, e.origin), e.scale = tt(n) / tt(t), En(e.scale, 1, 1e-4) && (e.scale = 1), e.translate = z(n.min, n.max, e.origin) - e.originPoint, En(e.translate) && (e.translate = 0);
}
function lo(e, t, n, a) {
  An(e.x, t.x, n.x, Mn(a.originX)), An(e.y, t.y, n.y, Mn(a.originY));
}
function Mn(e) {
  return typeof e == "number" ? e : 0.5;
}
function Ln(e, t, n) {
  e.min = n.min + t.min, e.max = e.min + tt(t);
}
function Su(e, t) {
  Ln(e.target.x, e.relativeTarget.x, t.target.x), Ln(e.target.y, e.relativeTarget.y, t.target.y);
}
function co(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function fo(e, t) {
  var n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
class bt {
  subscriptions = [];
  add = (t) => (co(this.subscriptions, t), () => fo(this.subscriptions, t));
  notify = (...[t, n, a]) => {
    var o = this.subscriptions.length;
    if (o)
      if (o === 1)
        this.subscriptions[0](t, n, a);
      else
        for (var i = 0; i < o; i++) {
          var s = this.subscriptions[i];
          s && s(t, n, a);
        }
  };
  getSize = () => this.subscriptions.length;
  clear = () => {
    this.subscriptions.length = 0;
  };
}
class Pu {
  /**
   * Subscribe method to make MotionValue compatible with Svelte store. Returns a unsubscribe function.
   * Same as onChange.
   *
   * @public
   */
  subscribe(t) {
    return this.onChange(t);
  }
  /**
   * Update method to make MotionValue compatible with Svelte writable store
   *
   * @public
   */
  update = (t) => {
    this.set(t(this.get()));
  };
  /**
   * The current state of the `MotionValue`.
   *
   * @internal
   */
  current;
  /**
   * The previous state of the `MotionValue`.
   *
   * @internal
   */
  prev;
  /**
   * Duration, in milliseconds, since last updating frame.
   *
   * @internal
   */
  timeDelta = 0;
  /**
   * Timestamp of the last time this `MotionValue` was updated.
   *
   * @internal
   */
  lastUpdated = 0;
  /**
   * Functions to notify when the `MotionValue` updates.
   *
   * @internal
   */
  updateSubscribers = new bt();
  /**
   * Functions to notify when the velocity updates.
   *
   * @internal
   */
  velocityUpdateSubscribers = new bt();
  /**
   * Functions to notify when the `MotionValue` updates and `render` is set to `true`.
   *
   * @internal
   */
  renderSubscribers = new bt();
  /**
   * Add a passive effect to this `MotionValue`.
   *
   * A passive effect intercepts calls to `set`. For instance, `useSpring` adds
   * a passive effect that attaches a `spring` to the latest
   * set value. Hypothetically there could be a `useSmooth` that attaches an input smoothing effect.
   *
   * @internal
   */
  passiveEffect;
  /**
   * A reference to the currently-controlling Popmotion animation
   *
   * @internal
   */
  stopAnimation;
  /**
   * Tracks whether this value can output a velocity. Currently this is only true
   * if the value is numerical, but we might be able to widen the scope here and support
   * other value types.
   *
   * @internal
   */
  canTrackVelocity = !1;
  onSubscription = () => {
  };
  onUnsubscription = () => {
  };
  /**
   * @param init - The initiating value
   * @param startStopNotifier - a function that is called, once the first subscriber is added to this motion value.
   *                            The return function is called, when the last subscriber unsubscribes.
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(t, n) {
    this.prev = this.current = t, this.canTrackVelocity = Cu(this.current), n && (this.onSubscription = () => {
      if (this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0) {
        const a = n();
        this.onUnsubscription = () => {
        }, a && (this.onUnsubscription = () => {
          this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0 && a();
        });
      }
    });
  }
  /**
      * Adds a function that will be notified when the `MotionValue` is updated.
      *
      * It returns a function that, when called, will cancel the subscription.
      *
      * When calling `onChange` inside a React component, it should be wrapped with the
      * `useEffect` hook. As it returns an unsubscribe function, this should be returned
      * from the `useEffect` function to ensure you don't add duplicate subscribers..
      *
      
      * @motion
      *
      * ```jsx
      * <script>
      *   import { useMotionValue } from 'svelte-motion'
      * 
      *   const x = useMotionValue(0)
      *   const y = useMotionValue(0)
      *   const opacity = useMotionValue(1)
      *
      *   
      *   function updateOpacity() {
      *       const maxXY = Math.max(x.get(), y.get())
      *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
      *       opacity.set(newOpacity)
      *   }
      *   
      *   // framer-motion style:
      *   const unsubscribeX = x.onChange(updateOpacity)
      *   onDestroy(()=>{
      *       unsubscribeX()
      *   })
      *   // equivalent Svelte style. Subscription and un-subscription is automatically handled:
      *   $: updateOpacity($y)
      * <\/script>
      * 
      * <Motion let:motion style={{ x }}><div use:motion/></Motion>
      * ```
      *
      * @param subscriber - A function that receives the latest value.
      * @returns A function that, when called, will cancel this subscription.
      *
      * @public
      */
  onChange = (t) => {
    this.onSubscription();
    const n = this.updateSubscribers.add(t);
    return () => {
      n(), this.onUnsubscription();
    };
  };
  clearListeners = () => {
    this.updateSubscribers.clear(), this.onUnsubscription();
  };
  /**
   * Adds a function that will be notified when the `MotionValue` requests a render.
   *
   * @param subscriber - A function that's provided the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @internal
   */
  onRenderRequest = (t) => {
    this.onSubscription(), t(this.get());
    const n = this.renderSubscribers.add(t);
    return () => {
      n(), this.onUnsubscription();
    };
  };
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach = (t) => {
    this.passiveEffect = t;
  };
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set = (t, n) => {
    n === void 0 && (n = !0), !n || !this.passiveEffect ? this.updateAndNotify(t, n) : this.passiveEffect(t, this.updateAndNotify);
  };
  updateAndNotify = (t, n) => {
    n === void 0 && (n = !0), this.prev = this.current, this.current = t;
    var a = Te(), o = a.delta, i = a.timestamp;
    this.lastUpdated !== i && (this.timeDelta = o, this.lastUpdated = i, oe.postRender(this.scheduleVelocityCheck)), this.prev !== this.current && this.updateSubscribers.notify(this.current), this.velocityUpdateSubscribers.getSize() && this.velocityUpdateSubscribers.notify(this.getVelocity()), n && this.renderSubscribers.notify(this.current);
  };
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get = () => {
    this.onSubscription();
    const t = this.current;
    return this.onUnsubscription(), t;
  };
  /**
   * @public
   */
  getPrevious = () => this.prev;
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity = () => {
    this.onSubscription();
    const t = this.canTrackVelocity ? (
      // These casts could be avoided if parseFloat would be typed better
      Aa(
        Number.parseFloat(String(this.current)) - Number.parseFloat(String(this.prev)),
        this.timeDelta
      )
    ) : 0;
    return this.onUnsubscription(), t;
  };
  /**
   * Schedule a velocity check for the next frame.
   *
   * This is an instanced and bound function to prevent generating a new
   * function once per frame.
   *
   * @internal
   */
  scheduleVelocityCheck = () => oe.postRender(this.velocityCheck);
  /**
   * Updates `prev` with `current` if the value hasn't been updated this frame.
   * This ensures velocity calculations return `0`.
   *
   * This is an instanced and bound function to prevent generating a new
   * function once per frame.
   *
   * @internal
   */
  velocityCheck = (t) => {
    var n = t.timestamp;
    n !== this.lastUpdated && (this.prev = this.current, this.velocityUpdateSubscribers.notify(this.getVelocity()));
  };
  hasAnimated = !1;
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start = (t) => (this.stop(), new Promise((n) => {
    this.hasAnimated = !0, this.stopAnimation = t(n);
  }).then(() => this.clearAnimation()));
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop = () => {
    this.stopAnimation && this.stopAnimation(), this.clearAnimation();
  };
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating = () => !!this.stopAnimation;
  clearAnimation = () => {
    this.stopAnimation = null;
  };
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy = () => {
    this.updateSubscribers.clear(), this.renderSubscribers.clear(), this.stop(), this.onUnsubscription();
  };
}
var Cu = (e) => !isNaN(Number.parseFloat(e));
function W(e, t) {
  return new Pu(e, t);
}
function Vu(e, t, n, a) {
  e.min = z(t.min, n.min, a), e.max = z(t.max, n.max, a);
}
function On(e, t) {
  return {
    min: t.min - e.min,
    max: t.max - e.min
  };
}
function Mt(e, t) {
  return {
    x: On(e.x, t.x),
    y: On(e.y, t.y)
  };
}
const Sc = {
  track: (e) => e
};
function Tu(e) {
  var t = e.getProjectionParent();
  if (!t) {
    e.rebaseProjectionTarget();
    return;
  }
  var n = Mt(t.getLayoutState().layout, e.getLayoutState().layout);
  te(function(a) {
    e.setProjectionTargetAxis(a, n[a].min, n[a].max, !0);
  });
}
var wu = function() {
  return {
    isEnabled: !1,
    isTargetLocked: !1,
    target: Se(),
    targetFinal: Se()
  };
};
function po() {
  return {
    isHydrated: !1,
    layout: Se(),
    layoutCorrected: Se(),
    treeScale: { x: 1, y: 1 },
    delta: Wr(),
    deltaFinal: Wr(),
    deltaTransform: ""
  };
}
var Dn = po();
function Rt({ x: e, y: t }, n, a) {
  var o = e.translate / n.x, i = t.translate / n.y, s = "translate3d(" + o + "px, " + i + "px, 0) ";
  if (a) {
    var u = a.rotate, c = a.rotateX, l = a.rotateY;
    u && (s += "rotate(" + u + ") "), c && (s += "rotateX(" + c + ") "), l && (s += "rotateY(" + l + ") ");
  }
  return s += "scale(" + e.scale + ", " + t.scale + ")", !a && s === Eu ? "" : s;
}
function go({ deltaFinal: e }) {
  return e.x.origin * 100 + "% " + e.y.origin * 100 + "% 0";
}
var Eu = Rt(Dn.delta, Dn.treeScale, {});
const Ur = (e) => typeof e == "object" && typeof e?.start == "function";
function vo(e, t) {
  if (!Array.isArray(t))
    return !1;
  var n = t.length;
  if (n !== e.length)
    return !1;
  for (var a = 0; a < n; a++)
    if (t[a] !== e[a])
      return !1;
  return !0;
}
function Nr(e, t) {
  var n, a = Fr(e);
  return a !== nr && (a = he), (n = a.getAnimatableNone) === null || n === void 0 ? void 0 : n.call(a, t);
}
let Hr = _r, mo = _r;
process.env.NODE_ENV !== "production" && (Hr = (e, t) => {
  !e && typeof console < "u" && console.warn(t);
}, mo = (e, t) => {
  if (!e)
    throw new Error(t);
});
var Pe = () => ({
  type: "spring",
  stiffness: 500,
  damping: 25,
  restDelta: 0.5,
  restSpeed: 10
}), gt = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restDelta: 0.01,
  restSpeed: 10
}), kt = () => ({
  type: "keyframes",
  ease: "linear",
  duration: 0.3
}), Au = (e) => ({
  type: "keyframes",
  duration: 0.8,
  values: e
}), jn = {
  x: Pe,
  y: Pe,
  z: Pe,
  rotate: Pe,
  rotateX: Pe,
  rotateY: Pe,
  rotateZ: Pe,
  scaleX: gt,
  scaleY: gt,
  scale: gt,
  opacity: kt,
  backgroundColor: kt,
  color: kt,
  default: gt
}, Mu = (e, t) => {
  var n;
  return et(t) ? n = Au : n = jn[e] || jn.default, Object.assign({ to: t }, n(t));
}, Lu = {
  linear: Mr,
  easeIn: Lr,
  easeInOut: Ta,
  easeOut: ri,
  circIn: wa,
  circInOut: ni,
  circOut: Or,
  backIn: Dr,
  backInOut: oi,
  backOut: ai,
  anticipate: si,
  bounceIn: ci,
  bounceInOut: fi,
  bounceOut: Vt
}, Rn = (e) => {
  if (Array.isArray(e)) {
    var [t, n, a, o] = e;
    return Ei(t, n, a, o);
  } else if (typeof e == "string")
    return Lu[e];
  return e;
};
const Ou = (e) => Array.isArray(e) && typeof e[0] != "number";
var In = function(e, t) {
  return e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
  he.test(t) && // And it contains numbers and/or colors
  !t.startsWith("url("));
};
function Du(e) {
  var {
    delay: t,
    when: n,
    delayChildren: a,
    staggerChildren: o,
    staggerDirection: i,
    repeat: s,
    repeatType: u,
    repeatDelay: c,
    from: l,
    ...f
  } = e;
  return !!Object.keys(f).length;
}
var Bn = !1;
function ju(e) {
  var { ease: t, times: n, yoyo: a, flip: o, loop: i, ...s } = e, u = Object.assign({}, s);
  return n && (u.offset = n), s.duration && (u.duration = wt(s.duration)), s.repeatDelay && (u.repeatDelay = wt(s.repeatDelay)), t && (u.ease = Ou(t) ? t.map(Rn) : Rn(t)), s.type === "tween" && (u.type = "keyframes"), (a || i || o) && (Hr(
    !Bn,
    "yoyo, loop and flip have been removed from the API. Replace with repeat and repeatType options."
  ), Bn = !0, a ? u.repeatType = "reverse" : i ? u.repeatType = "loop" : o && (u.repeatType = "mirror"), u.repeat = i || a || o || s.repeat), s.type !== "spring" && (u.type = "keyframes"), u;
}
function Ru(e, t) {
  var n, a = It(e, t) || {};
  return (n = a.delay) !== null && n !== void 0 ? n : 0;
}
function Iu(e) {
  return Array.isArray(e.to) && e.to[0] === null && (e.to = [...e.to], e.to[0] = e.from), e;
}
function Bu(e, t, n) {
  var a;
  return Array.isArray(t.to) && ((a = e.duration) !== null && a !== void 0 || (e.duration = 0.8)), Iu(t), Du(e) || (e = Object.assign(Object.assign({}, e), Mu(n, t.to))), Object.assign(Object.assign({}, t), ju(e));
}
function Fu(e, t, n, a, o) {
  var i, s = It(a, e), u = (i = s.from) !== null && i !== void 0 ? i : t.get(), c = In(e, n);
  u === "none" && c && typeof n == "string" ? u = Nr(e, n) : Fn(u) && typeof n == "string" ? u = Un(n) : !Array.isArray(n) && Fn(n) && typeof u == "string" && (n = Un(u));
  var l = In(e, u);
  Hr(
    l === c,
    "You are trying to animate " + e + ' from "' + u + '" to "' + n + '". ' + u + " is not an animatable value - to enable this animation set " + u + " to a value animatable to " + n + " via the `style` property."
  );
  function f() {
    var p = {
      from: u,
      to: n,
      velocity: t.getVelocity(),
      onComplete: o,
      onUpdate: (g) => t.set(g)
    };
    return s.type === "inertia" || s.type === "decay" ? bi(Object.assign(Object.assign({}, p), s)) : jr(
      Object.assign(Object.assign({}, Bu(s, p, e)), {
        onUpdate: (g) => {
          var v;
          p.onUpdate(g), (v = s.onUpdate) === null || v === void 0 || v.call(s, g);
        },
        onComplete: () => {
          var g;
          p.onComplete(), (g = s.onComplete) === null || g === void 0 || g.call(s);
        }
      })
    );
  }
  function d() {
    var p;
    return t.set(n), o(), (p = s?.onComplete) === null || p === void 0 || p.call(s), { stop: () => {
    } };
  }
  return !l || !c || s.type === !1 ? d : f;
}
function Fn(e) {
  return e === 0 || typeof e == "string" && Number.parseFloat(e) === 0 && e.indexOf(" ") === -1;
}
function Un(e) {
  return typeof e == "number" ? 0 : Nr("", e);
}
function It(e, t) {
  const n = e;
  return n[t] || n.default || n;
}
function rt(e, t, n, a) {
  return a === void 0 && (a = {}), t.start((o) => {
    var i, s, u = Fu(e, t, n, a, o), c = Ru(a, e), l = () => s = u();
    return c ? i = setTimeout(l, wt(c)) : l(), () => {
      clearTimeout(i), s?.stop();
    };
  });
}
var Uu = function(e) {
  return /^\-?\d*\.?\d+$/.test(e);
}, Nu = function(e) {
  return !!(e && typeof e == "object" && e.mix && e.toValue);
}, Hu = function(e) {
  return et(e) ? e[e.length - 1] || 0 : e;
}, zu = [...ro, Z, he], qu = (e) => zu.find(to(e));
function ho(e) {
  return Array.isArray(e);
}
function de(e) {
  return typeof e == "string" || ho(e);
}
function Gu(e) {
  var t = {};
  return e.forEachValue(function(n, a) {
    return t[a] = n.get();
  }), t;
}
function Ku(e) {
  var t = {};
  return e.forEachValue(function(n, a) {
    return t[a] = n.getVelocity();
  }), t;
}
function yo(e, t, n, a, o) {
  var i;
  return a === void 0 && (a = {}), o === void 0 && (o = {}), typeof t == "string" && (t = (i = e.variants) === null || i === void 0 ? void 0 : i[t]), typeof t == "function" ? t(n ?? e.custom, a, o) : t;
}
function Bt(e, t, n) {
  var a = e.getProps();
  return yo(a, t, n ?? a.custom, Gu(e), Ku(e));
}
function Ft(e) {
  var t;
  return typeof ((t = e.animate) === null || t === void 0 ? void 0 : t.start) == "function" || de(e.initial) || de(e.animate) || de(e.whileHover) || de(e.whileDrag) || de(e.whileTap) || de(e.whileFocus) || de(e.exit);
}
function _o(e) {
  return !!(Ft(e) || e.variants);
}
function ku(e, t, n) {
  e.hasValue(t) ? e.getValue(t)?.set(n) : e.addValue(t, W(n));
}
function zr(e, t) {
  var n = Bt(e, t), a = n ? e.makeTargetAnimatable(n, !1) : {}, o = a.transitionEnd, { transition: i, transitionEnd: s = o === void 0 ? {} : o, ...u } = a;
  u = Object.assign(Object.assign({}, u), s);
  for (var c in u) {
    var l = Hu(u[c]);
    ku(e, c, l);
  }
}
function pr(e, t) {
  var n = [...t].reverse();
  n.forEach((a) => {
    var o, i = e.getVariant(a);
    i && zr(e, i), (o = e.variantChildren) === null || o === void 0 || o.forEach((s) => {
      pr(s, t);
    });
  });
}
function Yu(e, t) {
  if (Array.isArray(t))
    return pr(e, t);
  if (typeof t == "string")
    return pr(e, [t]);
  zr(e, t);
}
function Wu(e, t, n) {
  var a, o, i, s, u = Object.keys(t).filter((g) => !e.hasValue(g)), c = u.length;
  if (c)
    for (var l = 0; l < c; l++) {
      var f = u[l], d = t[f], p = null;
      Array.isArray(d) && (p = d[0]), p === null && (p = (o = (a = n[f]) !== null && a !== void 0 ? a : e.readValue(f)) !== null && o !== void 0 ? o : t[f]), p != null && (typeof p == "string" && Uu(p) ? p = Number.parseFloat(p) : !qu(p) && he.test(d) && (p = Nr(f, d)), e.addValue(f, W(p)), (i = (s = n)[f]) !== null && i !== void 0 || (s[f] = p), e.setBaseTarget(f, p));
    }
}
function Xu(e, t) {
  if (t) {
    var n = t[e] || t.default || t;
    return n.from;
  }
}
function Zu(e, t, n) {
  var a, o, i = {};
  for (var s in e)
    i[s] = (a = Xu(s, t)) !== null && a !== void 0 ? a : (o = n.getValue(s)) === null || o === void 0 ? void 0 : o.get();
  return i;
}
function bo(e, t, n = {}) {
  e.notifyAnimationStart();
  var a;
  if (Array.isArray(t)) {
    var o = t.map((s) => gr(e, s, n));
    a = Promise.all(o);
  } else if (typeof t == "string")
    a = gr(e, t, n);
  else {
    var i = typeof t == "function" ? Bt(e, t, n.custom) : t;
    a = xo(e, i, n);
  }
  return a.then(() => e.notifyAnimationComplete(t));
}
function gr(e, t, n = {}) {
  var a;
  n === void 0 && (n = {});
  var o = Bt(e, t, n.custom), i = (o || {}).transition, s = i === void 0 ? e.getDefaultTransition() || {} : i;
  n.transitionOverride && (s = n.transitionOverride);
  var u = o ? () => xo(e, o, n) : () => Promise.resolve(), c = !((a = e.variantChildren) === null || a === void 0) && a.size ? (p) => {
    p === void 0 && (p = 0);
    var g = s.delayChildren, v = g === void 0 ? 0 : g, h = s.staggerChildren, y = s.staggerDirection;
    return Ju(
      e,
      t,
      v + p,
      h,
      y,
      n
    );
  } : () => Promise.resolve(), l = s.when;
  if (l) {
    var [f, d] = l === "beforeChildren" ? [u, c] : [c, u];
    return f().then(d);
  }
  return Promise.all([u(), c(n.delay)]);
}
function xo(e, t, n) {
  var a, o = n === void 0 ? {} : n, i = o.delay, s = i === void 0 ? 0 : i, u = o.transitionOverride, c = o.type, l = e.makeTargetAnimatable(t), { transition: f = e.getDefaultTransition(), transitionEnd: d, ...p } = l;
  u && (f = u);
  var g = [], v = c && ((a = e.animationState) === null || a === void 0 ? void 0 : a.getState()[c]);
  for (var h in p) {
    var y = e.getValue(h), m = p[h];
    if (!(!y || m === void 0 || v && el(v, h))) {
      var _ = rt(h, y, m, Object.assign({ delay: s }, f));
      g.push(_);
    }
  }
  return Promise.all(g).then(() => {
    d && zr(e, d);
  });
}
function Ju(e, t, n, a, o, i) {
  n === void 0 && (n = 0), a === void 0 && (a = 0), o === void 0 && (o = 1);
  var s = [], u = (e.variantChildren.size - 1) * a, c = o === 1 ? (l) => (l === void 0 && (l = 0), l * a) : (l) => (l === void 0 && (l = 0), u - l * a);
  return Array.from(e.variantChildren).sort($u).forEach((l, f) => {
    s.push(
      gr(
        l,
        t,
        Object.assign(Object.assign({}, i), { delay: n + c(f) })
      ).then(() => l.notifyAnimationComplete(t))
    );
  }), Promise.all(s);
}
function Qu(e) {
  e.forEachValue((t) => t.stop());
}
function $u(e, t) {
  return e.sortNodePosition(t);
}
function el(e, t) {
  var n = e.protectedKeys, a = e.needsAnimating, o = n.hasOwnProperty(t) && a[t] !== !0;
  return a[t] = !1, o;
}
var qr = [
  U.Animate,
  U.Hover,
  U.Tap,
  U.Drag,
  U.Focus,
  U.Exit
], tl = [...qr].reverse(), rl = qr.length;
function nl(e) {
  return (t) => Promise.all(
    t.map((n) => {
      var a = n.animation, o = n.options;
      return bo(e, a, o);
    })
  );
}
function Nn(e) {
  var t = nl(e), n = ol(), a = {}, o = !0, i = (f, d) => {
    var p = Bt(e, d);
    if (p) {
      var { transition: g, transitionEnd: v, ...h } = p;
      f = Object.assign(Object.assign(Object.assign({}, f), h), v);
    }
    return f;
  };
  function s(f) {
    return a[f] !== void 0;
  }
  function u(f) {
    t = f(e);
  }
  function c(f, d) {
    for (var p, g = e.getProps(), v = e.getVariantContext(!0) || {}, h = [], y = /* @__PURE__ */ new Set(), m = {}, _ = Number.POSITIVE_INFINITY, C = (x) => {
      var E = tl[x], O = n[E], M = (p = g[E]) !== null && p !== void 0 ? p : v[E], L = de(M), B = E === d ? O.isActive : null;
      B === !1 && (_ = x);
      var D = M === v[E] && M !== g[E] && L;
      if (D && o && e.manuallyAnimateOnMount && (D = !1), O.protectedKeys = Object.assign({}, m), // If it isn't active and hasn't *just* been set as inactive
      !O.isActive && B === null || // If we didn't and don't have any defined prop for this animation type
      !M && !O.prevProp || // Or if the prop doesn't define an animation
      Ur(M) || typeof M == "boolean")
        return "continue";
      var R = al(O.prevProp, M) || // If we're making this variant active, we want to always make it active
      E === d && O.isActive && !D && L || // If we removed a higher-priority variant (i is in reverse order)
      x > _ && L, q = Array.isArray(M) ? M : [M], G = q.reduce(i, {});
      B === !1 && (G = {});
      var X = O.prevResolvedValues, ce = X === void 0 ? {} : X, se = Object.assign(Object.assign({}, ce), G), ne = ($) => {
        R = !0, y.delete($), O.needsAnimating[$] = !0;
      };
      for (var K in se) {
        var ie = G[K], k = ce[K];
        m.hasOwnProperty(K) || (ie !== k ? et(ie) && et(k) ? vo(ie, k) ? O.protectedKeys[K] = !0 : ne(K) : ie !== void 0 ? ne(K) : y.add(K) : ie !== void 0 && y.has(K) ? ne(K) : O.protectedKeys[K] = !0);
      }
      O.prevProp = M, O.prevResolvedValues = G, O.isActive && (m = Object.assign(Object.assign({}, m), G)), o && e.blockInitialAnimation && (R = !1), R && !D && h.push.apply(h, [
        ...q.map(($) => ({
          animation: $,
          options: Object.assign({ type: E }, f)
        }))
      ]);
    }, S = 0; S < rl; S++)
      C(S);
    if (a = Object.assign({}, m), y.size) {
      var T = {};
      y.forEach((x) => {
        var E = e.getBaseTarget(x);
        E !== void 0 && (T[x] = E);
      }), h.push({ animation: T });
    }
    var P = !!h.length;
    return o && g.initial === !1 && !e.manuallyAnimateOnMount && (P = !1), o = !1, P ? t(h) : Promise.resolve();
  }
  function l(f, d, p) {
    var g;
    return n[f].isActive === d ? Promise.resolve() : ((g = e.variantChildren) === null || g === void 0 || g.forEach((v) => {
      var h;
      return (h = v.animationState) === null || h === void 0 ? void 0 : h.setActive(f, d);
    }), n[f].isActive = d, c(p, f));
  }
  return {
    isAnimated: s,
    animateChanges: c,
    setActive: l,
    setAnimateFunction: u,
    getState: () => n
  };
}
function al(e, t) {
  return typeof t == "string" ? t !== e : ho(t) ? !vo(t, e) : !1;
}
function Oe(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ol() {
  var e;
  return e = {}, e[U.Animate] = Oe(!0), e[U.Hover] = Oe(), e[U.Tap] = Oe(), e[U.Drag] = Oe(), e[U.Focus] = Oe(), e[U.Exit] = Oe(), e;
}
class sl {
  children = [];
  isDirty = !1;
  add = (t) => {
    co(this.children, t), this.isDirty = !0;
  };
  remove = (t) => {
    fo(this.children, t), this.isDirty = !0;
  };
  forEach = (t) => {
    this.isDirty && this.children.sort(br);
    for (var n = this.children.length, a = 0; a < n; a++)
      t(this.children[a]);
  };
}
var vt = [
  "LayoutMeasure",
  "BeforeLayoutMeasure",
  "LayoutUpdate",
  "ViewportBoxUpdate",
  "Update",
  "Render",
  "AnimationComplete",
  "LayoutAnimationComplete",
  "AnimationStart",
  "SetAxisTarget",
  "Unmount"
];
function il() {
  var e = vt.map(() => new bt()), t = {}, n = {
    clearAllListeners: () => e.forEach((a) => a.clear()),
    updatePropListeners: (a) => vt.forEach((o) => {
      var i;
      (i = t[o]) === null || i === void 0 || i.call(t);
      var s = "on" + o, u = a[s];
      u && (t[o] = n[s](u));
    })
  };
  return e.forEach((a, o) => {
    n["on" + vt[o]] = (i) => a.add(i), n["notify" + vt[o]] = (...i) => a.notify.apply(a, i);
  }), n;
}
function ul(e, t, n) {
  var a;
  for (var o in t) {
    var i = t[o], s = n[o];
    if (pe(i))
      e.addValue(o, i);
    else if (pe(s))
      e.addValue(o, W(i));
    else if (s !== i)
      if (e.hasValue(o)) {
        var u = e.getValue(o);
        u?.hasAnimated && u.set(i);
      } else
        e.addValue(o, W((a = e.getStaticValue(o)) !== null && a !== void 0 ? a : i));
  }
  for (var o in n)
    t[o] === void 0 && e.removeValue(o);
  return t;
}
function ll({ delta: e, layout: t, layoutCorrected: n, treeScale: a }, { target: o }, i, s) {
  mu(n, t), _u(n, a, i), lo(e, n, o, s);
}
var So = function({
  treeType: e,
  build: t,
  getBaseTarget: n,
  makeTargetAnimatable: a,
  measureViewportBox: o,
  render: i,
  readValueFromInstance: s,
  resetTransform: u,
  restoreTransform: c,
  removeValueFromRenderState: l,
  sortNodePosition: f,
  scrapeMotionValuesFromProps: d
}) {
  return function({ parent: p, props: g, presenceId: v, blockInitialAnimation: h, visualState: y }, m) {
    m === void 0 && (m = {});
    var _ = y.latestValues, C = y.renderState, S, T = il(), P = wu(), x, E = P, O = _, M, L = po(), B, D = !1, R = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), G = {}, X, ce = Object.assign({}, _), se;
    function ne() {
      S && (w.isProjectionReady() && (dr(E.targetFinal, E.target, O), lo(L.deltaFinal, L.layoutCorrected, E.targetFinal, _)), K(), i(S, C));
    }
    function K() {
      var b = _;
      if (B && B.isActive()) {
        var V = B.getCrossfadeState(w);
        V && (b = V);
      }
      t(w, C, b, E, L, m, g);
    }
    function ie() {
      T.notifyUpdate(_);
    }
    function k() {
      if (w.isProjectionReady()) {
        var b = L.delta, V = L.treeScale, j = V.x, F = V.y, H = L.deltaTransform;
        ll(L, E, w.path, _), D && w.notifyViewportBoxUpdate(E.target, b), D = !1;
        var ue = Rt(b, V);
        (ue !== H || // Also compare calculated treeScale, for values that rely on this only for scale correction
        j !== V.x || F !== V.y) && w.scheduleRender(), L.deltaTransform = ue;
      }
    }
    function $() {
      w.layoutTree.forEach(fl);
    }
    function ve(b, V) {
      var j = V.onChange(function(H) {
        _[b] = H, g.onUpdate && oe.update(ie, !1, !0);
      }), F = V.onRenderRequest(w.scheduleRender);
      q.set(b, function() {
        j(), F();
      });
    }
    var ee = d(g);
    for (var N in ee) {
      var fe = ee[N];
      _[N] !== void 0 && pe(fe) && fe.set(_[N], !1);
    }
    var ge = Ft(g), ae = _o(g), w = Object.assign(
      Object.assign(
        {
          treeType: e,
          /**
           * This is a mirror of the internal instance prop, which keeps
           * VisualElement type-compatible with React's RefObject.
           */
          current: null,
          /**
           * The depth of this visual element within the visual element tree.
           */
          depth: p ? p.depth + 1 : 0,
          parent: p,
          children: /* @__PURE__ */ new Set(),
          /**
           * An ancestor path back to the root visual element. This is used
           * by layout projection to quickly recurse back up the tree.
           */
          path: p ? [...p.path, p] : [],
          layoutTree: p ? p.layoutTree : new sl(),
          /**
           *
           */
          presenceId: v,
          projection: P,
          /**
           * If this component is part of the variant tree, it should track
           * any children that are also part of the tree. This is essentially
           * a shadow tree to simplify logic around how to stagger over children.
           */
          variantChildren: ae ? /* @__PURE__ */ new Set() : void 0,
          /**
           * Whether this instance is visible. This can be changed imperatively
           * by AnimateSharedLayout, is analogous to CSS's visibility in that
           * hidden elements should take up layout, and needs enacting by the configured
           * render function.
           */
          isVisible: void 0,
          /**
           * Normally, if a component is controlled by a parent's variants, it can
           * rely on that ancestor to trigger animations further down the tree.
           * However, if a component is created after its parent is mounted, the parent
           * won't trigger that mount animation so the child needs to.
           *
           * TODO: This might be better replaced with a method isParentMounted
           */
          manuallyAnimateOnMount: !!p?.isMounted(),
          /**
           * This can be set by AnimatePresence to force components that mount
           * at the same time as it to mount as if they have initial={false} set.
           */
          blockInitialAnimation: h,
          /**
           * Determine whether this component has mounted yet. This is mostly used
           * by variant children to determine whether they need to trigger their
           * own animations on mount.
           */
          isMounted: function() {
            return !!S;
          },
          mount: function(b) {
            S = w.current = b, w.pointTo(w), ae && p && !ge && (se = p?.addVariantChild(w)), p?.children.add(w);
          },
          /**
           *
           */
          unmount: function() {
            qe.update(ie), qe.render(ne), qe.preRender(w.updateLayoutProjection), q.forEach(function(b) {
              return b();
            }), w.stopLayoutAnimation(), w.layoutTree.remove(w), se?.(), p?.children.delete(w), M?.(), T.clearAllListeners();
          },
          /**
           * Add a child visual element to our set of children.
           */
          addVariantChild: function(b) {
            var V, j = w.getClosestVariantNode();
            if (j)
              return (V = j.variantChildren) === null || V === void 0 || V.add(b), function() {
                return j?.variantChildren?.delete(b);
              };
          },
          sortNodePosition: function(b) {
            return !f || e !== b.treeType ? 0 : f(w.getInstance(), b.getInstance());
          },
          /**
           * Returns the closest variant node in the tree starting from
           * this visual element.
           */
          getClosestVariantNode: function() {
            return ae ? w : p?.getClosestVariantNode();
          },
          /**
           * A method that schedules an update to layout projections throughout
           * the tree. We inherit from the parent so there's only ever one
           * job scheduled on the next frame - that of the root visual element.
           */
          scheduleUpdateLayoutProjection: p ? p.scheduleUpdateLayoutProjection : function() {
            return oe.preRender(w.updateTreeLayoutProjection, !1, !0);
          },
          /**
           * Expose the latest layoutId prop.
           */
          getLayoutId: function() {
            return g.layoutId;
          },
          /**
           * Returns the current instance.
           */
          getInstance: function() {
            return S;
          },
          /**
           * Get/set the latest static values.
           */
          getStaticValue: function(b) {
            return _[b];
          },
          setStaticValue: function(b, V) {
            return _[b] = V;
          },
          /**
           * Returns the latest motion value state. Currently only used to take
           * a snapshot of the visual element - perhaps this can return the whole
           * visual state
           */
          getLatestValues: function() {
            return _;
          },
          /**
           * Set the visiblity of the visual element. If it's changed, schedule
           * a render to reflect these changes.
           */
          setVisibility: function(b) {
            w.isVisible !== b && (w.isVisible = b, w.scheduleRender());
          },
          /**
           * Make a target animatable by Popmotion. For instance, if we're
           * trying to animate width from 100px to 100vw we need to measure 100vw
           * in pixels to determine what we really need to animate to. This is also
           * pluggable to support Framer's custom value types like Color,
           * and CSS variables.
           */
          makeTargetAnimatable: function(b, V) {
            return V === void 0 && (V = !0), a(w, b, g, V);
          },
          // Motion values ========================
          /**
           * Add a motion value and bind it to this visual element.
           */
          addValue: function(b, V) {
            w.hasValue(b) && w.removeValue(b), R.set(b, V), _[b] = V.get(), ve(b, V);
          },
          /**
           * Remove a motion value and unbind any active subscriptions.
           */
          removeValue: function(b) {
            var V;
            R.delete(b), (V = q.get(b)) === null || V === void 0 || V(), q.delete(b), delete _[b], l(b, C);
          },
          /**
           * Check whether we have a motion value for this key
           */
          hasValue: function(b) {
            return R.has(b);
          },
          /**
           * Get a motion value for this key. If called with a default
           * value, we'll create one if none exists.
           */
          getValue: function(b, V) {
            var j = R.get(b);
            return j === void 0 && V !== void 0 && (j = W(V), w.addValue(b, j)), j;
          },
          /**
           * Iterate over our motion values.
           */
          forEachValue: function(b) {
            return R.forEach(b);
          },
          /**
           * If we're trying to animate to a previously unencountered value,
           * we need to check for it in our state and as a last resort read it
           * directly from the instance (which might have performance implications).
           */
          readValue: function(b) {
            var V;
            return (V = _[b]) !== null && V !== void 0 ? V : s(S, b, m);
          },
          /**
           * Set the base target to later animate back to. This is currently
           * only hydrated on creation and when we first read a value.
           */
          setBaseTarget: function(b, V) {
            ce[b] = V;
          },
          /**
           * Find the base target for a value thats been removed from all animation
           * props.
           */
          getBaseTarget: function(b) {
            if (n) {
              var V = n(g, b);
              if (V !== void 0 && !pe(V)) return V;
            }
            return ce[b];
          }
        },
        T
      ),
      {
        /**
         * Build the renderer state based on the latest visual state.
         */
        build: function() {
          return K(), C;
        },
        /**
         * Schedule a render on the next animation frame.
         */
        scheduleRender: function() {
          oe.render(ne, !1, !0);
        },
        /**
         * Synchronously fire render. It's prefered that we batch renders but
         * in many circumstances, like layout measurement, we need to run this
         * synchronously. However in those instances other measures should be taken
         * to batch reads/writes.
         */
        syncRender: ne,
        /**
         * Update the provided props. Ensure any newly-added motion values are
         * added to our map, old ones removed, and listeners updated.
         */
        setProps: function(b) {
          g = b, T.updatePropListeners(b), G = ul(w, d(g), G);
        },
        getProps: function() {
          return g;
        },
        // Variants ==============================
        /**
         * Returns the variant definition with a given name.
         */
        getVariant: function(b) {
          var V;
          return (V = g.variants) === null || V === void 0 ? void 0 : V[b];
        },
        /**
         * Returns the defined default transition on this component.
         */
        getDefaultTransition: function() {
          return g.transition;
        },
        /**
         * Used by child variant nodes to get the closest ancestor variant props.
         */
        getVariantContext: function(b) {
          if (b === void 0 && (b = !1), b) return p?.getVariantContext();
          if (!ge) {
            var V = p?.getVariantContext() || {};
            return g.initial !== void 0 && (V.initial = g.initial), V;
          }
          for (var j = {}, F = 0; F < dl; F++) {
            var H = Po[F], ue = g[H];
            (de(ue) || ue === !1) && (j[H] = ue);
          }
          return j;
        },
        // Layout projection ==============================
        /**
         * Enable layout projection for this visual element. Won't actually
         * occur until we also have hydrated layout measurements.
         */
        enableLayoutProjection: function() {
          P.isEnabled = !0, w.layoutTree.add(w);
        },
        /**
         * Lock the projection target, for instance when dragging, so
         * nothing else can try and animate it.
         */
        lockProjectionTarget: function() {
          P.isTargetLocked = !0;
        },
        unlockProjectionTarget: function() {
          w.stopLayoutAnimation(), P.isTargetLocked = !1;
        },
        getLayoutState: function() {
          return L;
        },
        setCrossfader: function(b) {
          B = b;
        },
        isProjectionReady: function() {
          return P.isEnabled && P.isHydrated && L.isHydrated;
        },
        /**
         * Start a layout animation on a given axis.
         */
        startLayoutAnimation: function(b, V, j) {
          j === void 0 && (j = !1);
          var F = w.getProjectionAnimationProgress()[b], H = j ? P.relativeTarget[b] : P.target[b], ue = H.min, ut = H.max, lt = ut - ue;
          return F.clearListeners(), F.set(ue), F.set(ue), F.onChange(function(ct) {
            w.setProjectionTargetAxis(b, ct, ct + lt, j);
          }), w.animateMotionValue(b, F, 0, V);
        },
        /**
         * Stop layout animations.
         */
        stopLayoutAnimation: function() {
          te(function(b) {
            return w.getProjectionAnimationProgress()[b].stop();
          });
        },
        /**
         * Measure the current viewport box with or without transforms.
         * Only measures axis-aligned boxes, rotate and skew must be manually
         * removed with a re-render to work.
         */
        measureViewportBox: function(b) {
          b === void 0 && (b = !0);
          var V = o(S, m);
          return b || uo(V, _), V;
        },
        /**
         * Get the motion values tracking the layout animations on each
         * axis. Lazy init if not already created.
         */
        getProjectionAnimationProgress: function() {
          return X || (X = {
            x: W(0),
            y: W(0)
          }), X;
        },
        /**
         * Update the projection of a single axis. Schedule an update to
         * the tree layout projection.
         */
        setProjectionTargetAxis: function(b, V, j, F) {
          F === void 0 && (F = !1);
          var H;
          F ? (P.relativeTarget || (P.relativeTarget = Se()), H = P.relativeTarget[b]) : (P.relativeTarget = void 0, H = P.target[b]), P.isHydrated = !0, H.min = V, H.max = j, D = !0, T.notifySetAxisTarget();
        },
        /**
         * Rebase the projection target on top of the provided viewport box
         * or the measured layout. This ensures that non-animating elements
         * don't fall out of sync differences in measurements vs projections
         * after a page scroll or other relayout.
         */
        rebaseProjectionTarget: function(b, V) {
          V === void 0 && (V = L.layout);
          var j = w.getProjectionAnimationProgress(), F = j.x, H = j.y, ue = !P.relativeTarget && !P.isTargetLocked && !F.isAnimating() && !H.isAnimating();
          (b || ue) && te(function(ut) {
            var lt = V[ut], ct = lt.min, Xo = lt.max;
            w.setProjectionTargetAxis(ut, ct, Xo);
          });
        },
        /**
         * Notify the visual element that its layout is up-to-date.
         * Currently Animate.tsx uses this to check whether a layout animation
         * needs to be performed.
         */
        notifyLayoutReady: function(b) {
          Tu(w), w.notifyLayoutUpdate(L.layout, w.prevViewportBox || L.layout, b);
        },
        /**
         * Temporarily reset the transform of the instance.
         */
        resetTransform: function() {
          return u(w, S, g);
        },
        restoreTransform: function() {
          return c(S, C);
        },
        updateLayoutProjection: k,
        updateTreeLayoutProjection: function() {
          w.layoutTree.forEach(cl), oe.preRender($, !1, !0);
        },
        getProjectionParent: function() {
          if (x === void 0) {
            for (var b = !1, V = w.path.length - 1; V >= 0; V--) {
              var j = w.path[V];
              if (j.projection.isEnabled) {
                b = j;
                break;
              }
            }
            x = b;
          }
          return x;
        },
        resolveRelativeTargetBox: function() {
          var b = w.getProjectionParent();
          if (!(!P.relativeTarget || !b) && (Su(P, b.projection), oo(b))) {
            var V = P.target;
            dr(V, V, b.getLatestValues());
          }
        },
        shouldResetTransform: function() {
          return !!g._layoutResetTransform;
        },
        /**
         *
         */
        pointTo: function(b) {
          E = b.projection, O = b.getLatestValues(), M?.(), M = it(
            b.onSetAxisTarget(w.scheduleUpdateLayoutProjection),
            b.onLayoutAnimationComplete(function() {
              var V;
              w.isPresent ? w.presence = J.Present : (V = w.layoutSafeToRemove) === null || V === void 0 || V.call(w);
            })
          );
        },
        // TODO: Clean this up
        isPresent: !0,
        presence: J.Entering
      }
    );
    return w;
  };
};
function cl(e) {
  e.resolveRelativeTargetBox();
}
function fl(e) {
  e.updateLayoutProjection();
}
var Po = ["initial", ...qr], dl = Po.length;
function Co(e, { style: t, vars: n }) {
  Object.assign(e.style, t);
  for (var a in n)
    e.style.setProperty(a, n[a]);
}
function Gr(e) {
  var t = e.style, n = {};
  for (var a in t)
    (pe(t[a]) || Ya(a, e)) && (n[a] = t[a]);
  return n;
}
function pl(e) {
  return window.getComputedStyle(e);
}
var Vo = {
  treeType: "dom",
  readValueFromInstance: (e, t) => {
    if (jt(t)) {
      var n = Fr(t);
      return n && n.default || 0;
    } else {
      var a = pl(e);
      return (Wa(t) ? a.getPropertyValue(t) : a[t]) || 0;
    }
  },
  sortNodePosition: (e, t) => e.compareDocumentPosition(t) & 2 ? 1 : -1,
  getBaseTarget: (e, t) => {
    var n;
    return (n = e.style) === null || n === void 0 ? void 0 : n[t];
  },
  measureViewportBox: (e, t) => {
    var n = t.transformPagePoint;
    return eo(e, n);
  },
  /**
   * Reset the transform on the current Element. This is called as part
   * of a batched process across the entire layout tree. To remove this write
   * cycle it'd be interesting to see if it's possible to "undo" all the current
   * layout transforms up the tree in the same way this.getBoundingBoxWithoutTransforms
   * works
   */
  resetTransform: (e, t, n) => {
    var a = n.transformTemplate;
    t.style.transform = a ? a({}, "") : "none", e.scheduleRender();
  },
  restoreTransform: (e, t) => {
    e.style.transform = t.style.transform;
  },
  removeValueFromRenderState: (e, t) => {
    var n = t.vars, a = t.style;
    delete n[e], delete a[e];
  },
  /**
   * Ensure that HTML and Framer-specific value types like `px`->`%` and `Color`
   * can be animated by Motion.
   */
  makeTargetAnimatable: (e, t, n, a) => {
    var o = n.transformValues;
    a === void 0 && (a = !0);
    var { transition: i, transitionEnd: s, ...u } = t, c = Zu(u, i || {}, e);
    if (o && (s && (s = o(s)), u && (u = o(u)), c && (c = o(c))), a) {
      Wu(e, u, c);
      var l = gu(e, u, c, s);
      s = l.transitionEnd, u = l.target;
    }
    return Object.assign({ transition: i, transitionEnd: s }, u);
  },
  scrapeMotionValuesFromProps: Gr,
  build: (e, t, n, a, o, i, s) => {
    e.isVisible !== void 0 && (t.style.visibility = e.isVisible ? "visible" : "hidden");
    var u = a.isEnabled && o.isHydrated;
    Rr(
      t,
      n,
      a,
      o,
      i,
      s.transformTemplate,
      u ? Rt : void 0,
      u ? go : void 0
    );
  },
  render: Co
}, gl = So(Vo), vl = /([a-z])([A-Z])/g, ml = "$1-$2", To = function(e) {
  return e.replace(vl, ml).toLowerCase();
};
const wo = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox"
]);
function Eo(e, t) {
  Co(e, t);
  for (var n in t.attrs)
    e.setAttribute(wo.has(n) ? n : To(n), t.attrs[n]);
}
function Ao(e) {
  var t = Gr(e);
  for (var n in e)
    if (pe(e[n])) {
      var a = n === "x" || n === "y" ? "attr" + n.toUpperCase() : n;
      t[a] = e[n];
    }
  return t;
}
var hl = So(
  // @ts-expect-error
  Object.assign(Object.assign({}, Vo), {
    getBaseTarget: (e, t) => e[t],
    readValueFromInstance: (e, t) => {
      var n;
      return jt(t) ? ((n = Fr(t)) === null || n === void 0 ? void 0 : n.default) || 0 : (t = wo.has(t) ? t : To(t), e.getAttribute(t));
    },
    scrapeMotionValuesFromProps: Ao,
    build: (e, t, n, a, o, i, s) => {
      var u = a?.isEnabled && o?.isHydrated;
      Br(
        t,
        n,
        a,
        o,
        i,
        s.transformTemplate,
        u ? Rt : void 0,
        u ? go : void 0
      );
    },
    render: Eo
  })
), Kr = function(e, t) {
  return e === "SVG" ? hl(t, { enableHardwareAcceleration: !1 }) : gl(t, { enableHardwareAcceleration: !0 });
}, Mo = {
  //@ts-ignore
  scrapeMotionValuesFromProps: Ao,
  createRenderState: Ja,
  onMount: function(e, t, n) {
    var a = n.renderState, o = n.latestValues;
    try {
      a.dimensions = typeof t.getBBox == "function" ? t.getBBox() : t.getBoundingClientRect();
    } catch {
      a.dimensions = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    yl(t) && (a.totalPathLength = t.getTotalLength()), Br(a, o, void 0, void 0, { enableHardwareAcceleration: !1 }, e.transformTemplate), Eo(t, a);
  }
};
function yl(e) {
  return e.tagName === "path";
}
var Lo = {
  //@ts-ignore
  scrapeMotionValuesFromProps: Gr,
  createRenderState: Ir
};
function Hn(e, t) {
  if (Ft(e)) {
    var n = e.initial, a = e.animate;
    return {
      initial: n === !1 || de(n) ? n : void 0,
      animate: de(a) ? a : void 0
    };
  }
  return e.inherit !== !1 ? t || {} : {};
}
function Oo(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(c, "$mc", a), [a, o] = r.setup_stores();
  let i = r.prop(t, "props", 8), s = r.prop(t, "isStatic", 8), u = r.prop(t, "isCustom", 8, void 0), c = I(ye) || ye(u()), l = Hn(i(), Y(c)), f = r.mutable_source(l.initial), d = r.mutable_source(l.animate);
  const p = (m) => Array.isArray(m) ? m.join(" ") : m, g = (m, _) => ({ initial: r.get(f), animate: r.get(d) });
  let v = r.mutable_source(g());
  r.legacy_pre_effect(
    () => (r.get(f), r.get(d), r.deep_read_state(i()), n()),
    () => {
      ((m) => {
        r.set(f, m.initial), r.set(d, m.animate);
      })(Hn(i(), n()));
    }
  ), r.legacy_pre_effect(
    () => (r.deep_read_state(s()), r.get(f), r.get(d)),
    () => {
      s() && r.set(v, g(p(r.get(f)), p(r.get(d))));
    }
  ), r.legacy_pre_effect_reset(), r.init();
  var h = r.comment(), y = r.first_child(h);
  r.slot(
    y,
    t,
    "default",
    {
      get value() {
        return r.get(v);
      }
    },
    null
  ), r.append(e, h), r.pop(), o();
}
function _l(e) {
  var t = pe(e) ? e.get() : e;
  return Nu(t) ? t.toValue() : t;
}
const zn = ({ scrapeMotionValuesFromProps: e, createRenderState: t, onMount: n }, a, o, i) => {
  const s = {
    latestValues: bl(a, o, i, e),
    renderState: t()
  };
  return n && (s.mount = (u) => n(a, u, s)), s;
};
function bl(e, t, n, a) {
  const o = {}, i = n?.initial === !1, s = a(e);
  for (const p in s)
    o[p] = _l(s[p]);
  let { initial: u, animate: c } = e;
  const l = Ft(e), f = _o(e);
  t && f && !l && e.inherit !== !1 && (u ?? (u = t.initial), c ?? (c = t.animate));
  const d = i || u === !1 ? c : u;
  return d && typeof d != "boolean" && !Ur(d) && (Array.isArray(d) ? d : [d]).forEach((g) => {
    const v = yo(e, g);
    if (!v) return;
    const { transitionEnd: h, transition: y, ...m } = v;
    for (const _ in m) o[_] = m[_];
    for (const _ in h) o[_] = h[_];
  }), o;
}
function xl(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(f, "$context", o), a = () => r.store_get(d, "$presenceContext", o), [o, i] = r.setup_stores();
  let s = r.prop(t, "config", 8, void 0), u = r.prop(t, "props", 8), c = r.prop(t, "isStatic", 8), l = r.prop(t, "isCustom", 8, void 0);
  const f = I(ye) || ye(l()), d = I(le) || le(l());
  let p = r.mutable_source(zn(s(), u(), Y(f), Y(d)));
  const g = zn;
  r.legacy_pre_effect(
    () => (r.deep_read_state(c()), r.deep_read_state(s()), r.deep_read_state(u()), n(), a()),
    () => {
      c() && r.set(p, g(s(), u(), n(), a()));
    }
  ), r.legacy_pre_effect_reset(), r.init();
  var v = r.comment(), h = r.first_child(v);
  r.slot(
    h,
    t,
    "default",
    {
      get state() {
        return r.get(p);
      }
    },
    null
  ), r.append(e, v), r.pop(), i();
}
const Do = xl;
function vr(e) {
  return typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function Lt(e, t, n) {
  return (a) => {
    var o;
    a && ((o = e.mount) === null || o === void 0 || o.call(e, a)), t && (a ? t.mount(a) : t.unmount()), n && (typeof n == "function" ? n(a) : vr(n) && (n.current = a));
  };
}
const je = (e) => Me("ScaleCorrection", e) || re([]), kr = () => re([]), jo = (e) => {
  const t = I(je) || je(e), n = je();
  Ee(je, n), He("ScaleCorrection", e, n), Ee(kr, t);
};
function Ro(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "isCustom", 8);
  jo(n()), r.init();
  var a = r.comment(), o = r.first_child(a);
  r.slot(o, t, "default", {}, null), r.append(e, a), r.pop();
}
function Sl(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "visualElement", 12), a = r.prop(t, "props", 8), o = a(), i = r.mutable_source(o.animate);
  r.legacy_pre_effect(() => (r.get(i), r.deep_read_state(a())), () => {
    ((s) => {
      r.set(i, s.animate);
    })(a());
  }), r.legacy_pre_effect(() => (r.deep_read_state(n()), Nn), () => {
    n(n().animationState = n().animationState || Nn(n()), !0);
  }), r.legacy_pre_effect(
    () => (r.get(i), r.deep_read_state(n())),
    () => {
      Ur(r.get(i)) && we().then(() => r.get(
        i
        /*, [animate]*/
      ).subscribe(n()));
    }
  ), r.legacy_pre_effect_reset(), r.init(), r.pop();
}
function Pl(e, t) {
  r.push(t, !0);
  const n = () => r.store_get(r.get(u), "$presenceContext", o), a = () => r.store_get(r.get(c), "$presence", o), [o, i] = r.setup_stores(), s = r.derived(() => t.props.custom), u = r.derived(() => I(le) || le(t.isCustom)), c = r.derived(() => Na(t.isCustom)), l = (p) => {
    const [g, v] = p, h = t.visualElement.animationState?.setActive(U.Exit, !g, { custom: n()?.custom ?? r.get(s) });
    !g && h?.then(v);
  };
  r.user_effect(() => l(a()));
  var f = r.comment(), d = r.first_child(f);
  r.snippet(d, () => t.children ?? r.noop), r.append(e, f), r.pop(), i();
}
const Io = {
  animation: Sl,
  exit: Pl
};
function Cl(e, t) {
  t === void 0 && (t = !0);
  var n = e.getProjectionParent();
  if (!n)
    return !1;
  var a;
  return t ? (a = Mt(n.projection.target, e.projection.target), uo(a, n.getLatestValues())) : a = Mt(n.getLayoutState().layout, e.getLayoutState().layout), te(function(o) {
    return e.setProjectionTargetAxis(o, a[o].min, a[o].max, !0);
  }), !0;
}
function Bo(e, { min: t, max: n }, a) {
  return t !== void 0 && e < t ? e = a ? z(t, e, a.min) : Math.max(e, t) : n !== void 0 && e > n && (e = a ? z(n, e, a.max) : Math.min(e, n)), e;
}
function Vl(e, t, n, a, o) {
  var i = e - t * n;
  return a ? Bo(i, a, o) : i;
}
function qn(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0
  };
}
function Tl(e, { top: t, left: n, bottom: a, right: o }) {
  return {
    x: qn(e.x, n, o),
    y: qn(e.y, t, a)
  };
}
function Gn(e, t) {
  var n, a = t.min - e.min, o = t.max - e.max;
  return t.max - t.min < e.max - e.min && (n = [o, a], [a, o] = n), {
    min: e.min + a,
    max: e.min + o
  };
}
function wl(e, t) {
  return {
    x: Gn(e.x, t.x),
    y: Gn(e.y, t.y)
  };
}
function El(e, t, n) {
  var a = e.max - e.min, o = z(t.min, t.max - a, n);
  return { min: o, max: o + a };
}
function Al(e, t) {
  var n = {};
  return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
const Fo = 0.35;
function Ml(e) {
  return e === !1 ? e = 0 : e === !0 && (e = Fo), {
    x: Kn(e, "left", "right"),
    y: Kn(e, "top", "bottom")
  };
}
function Kn(e, t, n) {
  return {
    min: kn(e, t),
    max: kn(e, n)
  };
}
function kn(e, t) {
  var n;
  return typeof e == "number" ? e : (n = e[t]) !== null && n !== void 0 ? n : 0;
}
var Uo = /* @__PURE__ */ new WeakMap(), Yn;
class Ll {
  /**
   * Track whether we're currently dragging.
   *
   * @internal
   */
  isDragging = !1;
  /**
   * The current direction of drag, or `null` if both.
   *
   * @internal
   */
  currentDirection = null;
  /**
   * The permitted boundaries of travel, in pixels.
   *
   * @internal
   */
  constraints = !1;
  /**
   * The per-axis resolved elastic values.
   *
   * @internal
   */
  elastic = Se();
  /**
   * A reference to the host component's latest props.
   *
   * @internal
   */
  props = {};
  /**
   * @internal
   */
  visualElement;
  /**
   * @internal
   */
  hasMutatedConstraints = !1;
  /**
   * @internal
   */
  cancelLayout;
  /**
   * Track the initial position of the cursor relative to the dragging element
   * when dragging starts as a value of 0-1 on each axis. We then use this to calculate
   * an ideal bounding box for the VisualElement renderer to project into every frame.
   *
   * @internal
   */
  cursorProgress = {
    x: 0.5,
    y: 0.5
  };
  originPoint = { x: 0, y: 0 };
  openGlobalLock = null;
  /**
   * @internal
   */
  panSession;
  /**
   * A reference to the measured constraints bounding box
   */
  constraintsBox;
  constructor({ visualElement: t }) {
    this.visualElement = t, this.visualElement.enableLayoutProjection(), Uo.set(t, this);
  }
  /**
   * Instantiate a PanSession for the drag gesture
   *
   * @public
   */
  start = (t, { snapToCursor: n = !1, cursorProgress: a = void 0 } = {}) => {
    const o = (l) => {
      this.stopMotion();
      var f = vs(l).point;
      (l = this.cancelLayout) === null || l === void 0 || l.call(this);
      var d = this;
      this.cancelLayout = Xt((p, g) => {
        var v = St(d.visualElement), h = us(d.visualElement), y = [...v, ...h], m = !1;
        d.isLayoutDrag() && d.visualElement.lockProjectionTarget(), g(() => {
          y.forEach((_) => _.resetTransform());
        }), p(() => {
          ht(d.visualElement), h.forEach(ht);
        }), g(() => {
          y.forEach((_) => _.restoreTransform()), n && (m = d.snapToCursor(f));
        }), p(() => {
          var _ = !!(d.getAxisMotionValue("x") && !d.isExternalDrag());
          _ || d.visualElement.rebaseProjectionTarget(!0, d.visualElement.measureViewportBox(!1)), d.visualElement.scheduleUpdateLayoutProjection();
          var C = d.visualElement.projection;
          te((S) => {
            if (!m) {
              var T = C.target[S], P = T.min, x = T.max;
              d.cursorProgress[S] = a ? a[S] : Ue(P, x, f[S]);
            }
            var E = d.getAxisMotionValue(S);
            E && (d.originPoint[S] = E.get());
          });
        }), g(() => {
          De.update(), De.preRender(), De.render(), De.postRender();
        }), p(() => d.resolveDragConstraints());
      });
    }, i = (l, f) => {
      const { drag: d, dragPropagation: p, onDragStart: g } = this.props;
      if (d && !p && (this.openGlobalLock && this.openGlobalLock(), this.openGlobalLock = ua(d), !this.openGlobalLock))
        return;
      Zt(), this.isDragging = !0, this.currentDirection = null, g && g(l, f);
      const { animationState: v } = this.visualElement;
      v && v.setActive(U.Drag, !0);
    }, s = (l, f) => {
      const { dragPropagation: d, dragDirectionLock: p, onDirectionLock: g, onDrag: v } = this.props;
      if (!(!d && !this.openGlobalLock)) {
        var h = f.offset;
        if (p && this.currentDirection === null) {
          this.currentDirection = Ol(h), this.currentDirection !== null && g && g(this.currentDirection);
          return;
        }
        this.updateAxis("x", f.point, h), this.updateAxis("y", f.point, h), v && v(l, f), Yn = l;
      }
    }, u = (l, f) => this.stop(l, f), c = this.props.transformPagePoint;
    this.panSession = new Ra(
      t,
      {
        onSessionStart: o,
        // @ts-expect-error
        onStart: i,
        // @ts-expect-error
        onMove: s,
        // @ts-expect-error
        onSessionEnd: u
      },
      { transformPagePoint: c }
    );
  };
  resolveDragConstraints = () => {
    const { dragConstraints: t, dragElastic: n } = this.props;
    var a = this.visualElement.getLayoutState().layoutCorrected;
    t ? this.constraints = vr(t) ? this.resolveRefConstraints(a, t) : Tl(a, t) : this.constraints = !1, this.elastic = Ml(n), this.constraints && !this.hasMutatedConstraints && te((o) => {
      this.getAxisMotionValue(o) && (this.constraints[o] = Al(a[o], this.constraints[o]));
    });
  };
  resolveRefConstraints = (t, n) => {
    const { transformPagePoint: a, onMeasureDragConstraints: o } = this.props, i = n.current;
    mo(
      i !== null,
      "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop."
    ), this.constraintsBox = eo(i, a);
    var s = wl(t, this.constraintsBox);
    if (o) {
      var u = o(os(s));
      this.hasMutatedConstraints = !!u, u && (s = na(u));
    }
    return s;
  };
  cancelDrag = () => {
    var t;
    this.visualElement.unlockProjectionTarget(), (t = this.cancelLayout) === null || t === void 0 || t.call(this), this.isDragging = !1;
    const { projection: n, animationState: a } = this.visualElement;
    this.panSession && this.panSession.end(), this.panSession = void 0, !this.props.dragPropagation && this.openGlobalLock && (this.openGlobalLock(), this.openGlobalLock = null), a && a.setActive(U.Drag, !1);
  };
  stop = (t, n) => {
    var a;
    (a = this.panSession) === null || a === void 0 || a.end(), this.panSession = void 0;
    var o = this.isDragging;
    if (this.cancelDrag(), !o) return;
    var i = n.velocity;
    this.animateDragEnd(i);
    const { onDragEnd: s } = this.props;
    s && s(t, n);
  };
  snapToCursor = (t) => te((n) => {
    var a = this.props.drag;
    if (mt(n, a, this.currentDirection)) {
      var o = this.getAxisMotionValue(n);
      if (o) {
        var i = this.visualElement.getLayoutState().layout, s = i[n].max - i[n].min, u = i[n].min + s / 2, c = t[n] - u;
        this.originPoint[n] = t[n], o.set(c);
      } else
        return this.cursorProgress[n] = 0.5, !0;
    }
  }).includes(!0);
  /**
   * Update the specified axis with the latest pointer information.
   */
  updateAxis = (t, n, a) => {
    var o = this.props.drag;
    if (mt(t, o, this.currentDirection))
      return this.getAxisMotionValue(t) ? this.updateAxisMotionValue(t, a) : this.updateVisualElementAxis(t, n);
  };
  updateAxisMotionValue = (t, n) => {
    var a = this.getAxisMotionValue(t);
    if (!(!n || !a)) {
      var o = this.originPoint[t] + n[t], i = this.constraints ? Bo(o, this.constraints[t], this.elastic[t]) : o;
      a.set(i);
    }
  };
  updateVisualElementAxis = (t, n) => {
    var a, o = this.visualElement.getLayoutState().layout[t], i = o.max - o.min, s = this.cursorProgress[t], u = Vl(
      n[t],
      i,
      s,
      // @ts-expect-error
      (a = this.constraints) === null || a === void 0 ? void 0 : a[t],
      this.elastic[t]
    );
    this.visualElement.setProjectionTargetAxis(t, u, u + i);
  };
  setProps = ({
    drag: t = !1,
    dragDirectionLock: n = !1,
    dragPropagation: a = !1,
    dragConstraints: o = !1,
    dragElastic: i = Fo,
    dragMomentum: s = !0,
    ...u
  }) => {
    this.props = {
      ...u,
      drag: t,
      dragDirectionLock: n,
      dragPropagation: a,
      dragConstraints: o,
      dragElastic: i,
      dragMomentum: s
    };
  };
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - If the component will perform layout animations, we output the gesture to the component's
   *      visual bounding box
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue = (t) => {
    var n = this.props, a = n.layout, o = n.layoutId, i = "_drag" + t.toUpperCase();
    if (this.props[i])
      return this.props[i];
    if (!a && o === void 0)
      return this.visualElement.getValue(t, 0);
  };
  isLayoutDrag = () => !this.getAxisMotionValue("x");
  isExternalDrag = () => {
    var t = this.props, n = t._dragX, a = t._dragY;
    return n || a;
  };
  animateDragEnd = (t) => {
    var n = this.props, a = n.drag, o = n.dragMomentum, i = n.dragElastic, s = n.dragTransition, u = Cl(this.visualElement, this.isLayoutDrag() && !this.isExternalDrag()), c = this.constraints || {};
    if (u && Object.keys(c).length && this.isLayoutDrag()) {
      var l = this.visualElement.getProjectionParent();
      if (l) {
        var f = Mt(l.projection.targetFinal, c);
        te((p) => {
          var g = f[p], v = g.min, h = g.max;
          c[p] = {
            min: isNaN(v) ? void 0 : v,
            max: isNaN(h) ? void 0 : h
          };
        });
      }
    }
    var d = te((p) => {
      var g;
      if (mt(p, a, this.currentDirection)) {
        var v = (
          // @ts-expect-error
          (g = c?.[p]) !== null && g !== void 0 ? g : {}
        ), h = i ? 200 : 1e6, y = i ? 40 : 1e7, m = Object.assign(
          Object.assign(
            {
              type: "inertia",
              velocity: o ? t[p] : 0,
              bounceStiffness: h,
              bounceDamping: y,
              timeConstant: 750,
              restDelta: 1,
              restSpeed: 10
            },
            s
          ),
          v
        );
        return this.getAxisMotionValue(p) ? this.startAxisValueAnimation(p, m) : this.visualElement.startLayoutAnimation(p, m, u);
      }
    });
    return Promise.all(d).then(() => {
      var p, g;
      (g = (p = this.props).onDragTransitionEnd) === null || g === void 0 || g.call(p);
    });
  };
  stopMotion = () => {
    te((t) => {
      var n = this.getAxisMotionValue(t);
      n ? n.stop() : this.visualElement.stopLayoutAnimation();
    });
  };
  startAxisValueAnimation = (t, n) => {
    var a = this.getAxisMotionValue(t);
    if (a) {
      var o = a.get();
      return a.set(o), a.set(o), rt(t, a, 0, n);
    }
  };
  scalePoint = () => {
    var t = this.props, n = t.drag, a = t.dragConstraints;
    if (!(!vr(a) || !this.constraintsBox)) {
      this.stopMotion();
      var o = { x: 0, y: 0 };
      te((i) => {
        o[i] = xu(this.visualElement.projection.target[i], this.constraintsBox[i]);
      }), this.updateConstraints(() => {
        te((i) => {
          if (mt(i, n, null)) {
            var s = El(
              this.visualElement.projection.target[i],
              // @ts-expect-error
              this.constraintsBox[i],
              o[i]
            ), u = s.min, c = s.max;
            this.visualElement.setProjectionTargetAxis(i, u, c);
          }
        });
      }), setTimeout(Zt, 1);
    }
  };
  updateConstraints = (t) => {
    this.cancelLayout = Xt((n, a) => {
      var o = St(_this.visualElement);
      a(() => o.forEach((i) => i.resetTransform())), n(() => ht(this.visualElement)), a(() => o.forEach((i) => i.restoreTransform())), n(() => {
        this.resolveDragConstraints();
      }), t && a(t);
    });
  };
  mount = (t) => {
    var n = t.getInstance(), a = Ie(n, "pointerdown", (u) => {
      var c = this.props, l = c.drag, f = c.dragListener, d = f === void 0 ? !0 : f;
      l && d && this.start(u);
    }), o = Ae(window, "resize", () => {
      this.scalePoint();
    }), i = t.onLayoutUpdate(() => {
      this.isDragging && this.resolveDragConstraints();
    }), s = t.prevDragCursor;
    return s && this.start(Yn, { cursorProgress: s }), () => {
      a?.(), o?.(), i?.(), this.cancelDrag();
    };
  };
}
function mt(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function Ol(e, t = 10) {
  var n = null;
  return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
function Dl(e, t) {
  r.push(t, !0);
  const n = I(Q) || Q(t.isCustom);
  let a = new Ll({ visualElement: t.visualElement }), o;
  const i = (d) => {
    o && o(), r.get(s) && (o = r.get(s).subscribe(d));
  }, s = r.derived(() => t.props.dragControls), u = r.derived(() => Jo(n).current), c = r.derived(() => r.get(u).transformPagePoint);
  r.user_effect(() => a.setProps({
    ...t.props,
    transformPagePoint: r.get(c)
  })), r.user_effect(() => i(a)), Ne(() => {
    o && o();
  }), _e(() => a.mount(t.visualElement));
  var l = r.comment(), f = r.first_child(l);
  r.snippet(f, () => t.children ?? r.noop), r.append(e, l), r.pop();
}
const jl = {
  pan: Ba,
  drag: Dl
}, Rl = {
  tap: Ua,
  focus: sa,
  hover: da
}, Wn = 1e3;
function Il(e, t) {
  return !Zn(e) && !Zn(t) && (!nt(e.x, t.x) || !nt(e.y, t.y));
}
const Xn = { min: 0, max: 0 };
function Zn(e) {
  return nt(e.x, Xn) && nt(e.y, Xn);
}
function nt(e, t) {
  return e.min === t.min && e.max === t.max;
}
const Bl = { duration: 0.45, ease: [0.4, 0, 0.1, 1] };
function Fl(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "visualElement", 12), a = r.prop(t, "layout", 8, void 0), o = r.prop(t, "safeToRemove", 8), i = Se(), s = Se(), u = { x: !1, y: !1 }, c = { x: void 0, y: void 0 }, l = !1;
  const f = (g, v, {
    originBox: h,
    targetBox: y,
    visibilityAction: m,
    shouldStackAnimate: _,
    onComplete: C,
    ...S
  } = {}) => {
    if (_ === !1)
      return l = !1, o()();
    if (l && _ !== !0)
      return;
    _ && (l = !0), v = h || v, g = y || g;
    const T = Il(v, g), P = te((x) => {
      if (a() === "position") {
        const E = g[x].max - g[x].min;
        v[x].max = v[x].min + E;
      }
      if (!n().projection.isTargetLocked)
        if (m !== void 0)
          n().setVisibility(m === m.Show);
        else return T ? d(x, g[x], v[x], S) : n().setProjectionTargetAxis(x, g[x].min, g[x].max);
    });
    return n().syncRender(), Promise.all(P).then(() => {
      l = !1, C && C(), n().notifyLayoutAnimationComplete();
    });
  }, d = (g, v, h, { transition: y } = {}) => {
    if (c[g]?.(), u[g] && nt(v, s[g]))
      return;
    c[g]?.(), u[g] = !0;
    const m = i[g], _ = n().getProjectionAnimationProgress()[g];
    _.clearListeners(), _.set(0), _.set(0);
    const C = () => {
      const x = _.get() / Wn;
      Vu(m, h, v, x), n().setProjectionTargetAxis(g, m.min, m.max);
    };
    C();
    const S = _.onChange(C);
    c[g] = () => {
      u[g] = !1, _.stop(), S();
    }, s[g] = v;
    const T = y || n().getDefaultTransition() || Bl;
    return rt(g === "x" ? "layoutX" : "layoutY", _, Wn, T && It(T, "layout")).then(c[g]);
  };
  _e(() => {
    n(n().animateMotionValue = rt, !0), n().enableLayoutProjection();
    const g = n().onLayoutUpdate(f);
    return n(
      n().layoutSafeToRemove = function() {
        o()();
      },
      !0
    ), Ui(Ka), () => {
      g(), te((v) => c[v]?.());
    };
  }), r.init(), r.pop();
}
function Ul(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(f, "$presence", a), [a, o] = r.setup_stores();
  let i = r.prop(t, "visualElement", 8), s = r.prop(t, "props", 8), u = r.prop(t, "isCustom", 8), c = s(), l = r.mutable_source(c.layout);
  const f = Na(u());
  r.legacy_pre_effect(() => (r.get(l), r.deep_read_state(s())), () => {
    ((d) => {
      r.set(l, d.layout);
    })(s());
  }), r.legacy_pre_effect_reset(), r.init(), Fl(e, {
    get visualElement() {
      return i();
    },
    get layout() {
      return r.get(l);
    },
    get safeToRemove() {
      return n(), r.untrack(() => n()[1]);
    }
  }), r.pop(), o();
}
function Nl(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "visualElement", 8), a = r.prop(t, "syncLayout", 8), o = r.prop(t, "framerSyncLayout", 8), i = r.prop(t, "update", 8);
  const s = I(je), u = I(kr);
  _e(() => {
    Ce(a()) && a().register(n()), Ce(o()) && o().register(n()), n().onUnmount(() => {
      Ce(a()) && a().remove(n()), Ce(o()) && o().remove(n());
    });
  });
  let c = !1;
  const l = (d = !1) => (c || (c = !0, Y(s).forEach((p) => {
    p.updater?.(!0);
  }), Ce(a()) ? a().syncUpdate() : (oa(n(), d), a().add(n()))), null);
  i() === void 0 && Qo(l);
  const f = (d = !1) => {
    c = !1, Y(s).forEach((g, v) => {
      g.afterU?.(!0);
    }), Ce(a()) || a().flush();
  };
  u.update((d) => d.concat([{ updater: l, afterU: f }])), yr(f), r.legacy_pre_effect(() => r.deep_read_state(i()), () => {
    i() !== void 0 && l(i());
  }), r.legacy_pre_effect_reset(), r.init(), r.pop();
}
function Hl(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(f, "$syncLayout", o), a = () => r.store_get(d, "$framerSyncLayout", o), [o, i] = r.setup_stores(), s = r.mutable_source();
  let u = r.prop(t, "visualElement", 8), c = r.prop(t, "props", 8), l = r.prop(t, "isCustom", 8);
  const f = I(Ze) || Ze(l()), d = I(Jr) || Jr(l());
  r.legacy_pre_effect(() => (r.get(s), r.deep_read_state(c())), () => {
    ((p) => {
      r.set(s, p.update);
    })(c());
  }), r.legacy_pre_effect_reset(), r.init(), Nl(e, {
    get syncLayout() {
      return n();
    },
    get framerSyncLayout() {
      return a();
    },
    get visualElement() {
      return u();
    },
    get update() {
      return r.get(s);
    }
  }), r.pop(), i();
}
var zl = {
  measureLayout: Hl,
  layoutAnimation: Ul
};
const No = {
  ...Io,
  ...Rl,
  ...jl,
  ...zl
};
var ql = r.from_html("<!> <!>", 1);
function Gl(e, t) {
  const n = r.legacy_rest_props(t, ["children", "$$slots", "$$events", "$$legacy"]), a = r.legacy_rest_props(n, ["isSVG", "forwardMotionProps", "externalRef", "targetEl"]);
  r.push(t, !1);
  const o = () => r.store_get(m, "$a", i), [i, s] = r.setup_stores(), u = r.mutable_source(), c = r.mutable_source();
  let l = r.prop(t, "isSVG", 8, !1), f = r.prop(t, "forwardMotionProps", 8, !1), d = r.prop(t, "externalRef", 8, void 0), p = r.prop(
    t,
    "targetEl",
    8,
    void 0
    /*
    initial: $$Props["initial"] = undefined,
    style: $$Props["style"] = undefined,
    transformTemplate: $$Props["transformTemplate"] = undefined,
    transformValues = undefined,
    //AnimationProps
    animate: $$Props["animate"] = undefined,
    exit: $$Props["exit"] = undefined,
    variants: $$Props["variants"] = undefined,
    transition: $$Props["transition"] = undefined,
    //VisualElementLifecycles
    onViewportBoxUpdate: $$Props["onViewportBoxUpdate"] = undefined,
    onBeforeLayoutMeasure: $$Props["onBeforeLayoutMeasure"] = undefined,
    onLayoutMeasure: $$Props["onLayoutMeasure"] = undefined,
    onUpdate: $$Props["onUpdate"] = undefined,
    onAnimationStart: $$Props["onAnimationStart"] = undefined,
    onAnimationComplete: $$Props["onAnimationComplete"] = undefined,
    onLayoutAnimationComplete: $$Props["onLayoutAnimationComplete"] =
        undefined,
    //GestureHandlers
    // PanHandlers
    onPan: $$Props["onPan"] = undefined,
    onPanStart: $$Props["onPanStart"] = undefined,
    onPanSessionStart: $$Props["onPanSessionStart"] = undefined,
    onPanEnd: $$Props["onPanEnd"] = undefined,
    // TapHandlers
    onTap: $$Props["onTap"] = undefined,
    onTapStart: $$Props["onTapStart"] = undefined,
    onTapCancel: $$Props["onTapCancel"] = undefined,
    whileTap: $$Props["whileTap"] = undefined,
    //HoverHandlers
    whileHover: $$Props["whileHover"] = undefined,
    onHoverStart: $$Props["onHoverStart"] = undefined,
    onHoverEnd: $$Props["onHoverEnd"] = undefined,
    //FocusHandlers
    whileFocus: $$Props["whileFocus"] = undefined,
    //DraggableProps
    drag: $$Props["drag"] = undefined,
    whileDrag: $$Props["whileDrag"] = undefined,
    dragDirectionLock: $$Props["dragDirectionLock"] = undefined,
    dragPropagation: $$Props["dragPropagation"] = undefined,
    dragConstraints: $$Props["dragConstraints"] = undefined,
    dragElastic: $$Props["dragElastic"] = undefined,
    dragMomentum: $$Props["dragMomentum"] = undefined,
    dragTransition: $$Props["dragTransition"] = undefined,
    dragControls: $$Props["dragControls"] = undefined,
    dragListener: $$Props["dragListener"] = undefined,
    onMeasureDragConstraints: $$Props["onMeasureDragConstraints"] =
        undefined,
    _dragX: $$Props["_dragX"] = undefined,
    _dragY: $$Props["_dragY"] = undefined,
    //DragHandlers
    onDragStart: $$Props["onDragStart"] = undefined,
    onDragEnd: $$Props["onDragEnd"] = undefined,
    onDrag: $$Props["onDrag"] = undefined,
    onDirectionLock: $$Props["onDirectionLock"] = undefined,
    onDragTransitionEnd: $$Props["onDragTransitionEnd"] = undefined,
    // LayoutProps
    layout: $$Props["layout"] = undefined,
    layoutId: $$Props["layoutId"] = undefined,
    //MotionAdvancedProps
    custom: $$Props["custom"] = undefined,
    inherit: $$Props["inherit"] = undefined,
    // **internal***
    isSVG = false,
    update = undefined,
    forwardMotionProps = false,
    externalRef = undefined,
    targetEl = undefined;
        */
  );
  Fe(No);
  let g = l() ? "SVG" : "DOM", v = p() || !1, h = Kr, y = l() ? Mo : Lo;
  const m = I(Q) || Q(v);
  let _ = r.mutable_source(!1);
  const C = (S, T) => (S.visualElement = T, T);
  _e(() => {
    r.set(_, !0);
  }), r.legacy_pre_effect(() => r.deep_read_state(a), () => {
    r.set(u, a);
  }), r.legacy_pre_effect(() => (r.get(c), o()), () => {
    ((S) => {
      r.set(c, S.isStatic);
    })(o() || {});
  }), r.legacy_pre_effect_reset(), r.init(), Ro(e, {
    get isCustom() {
      return v;
    },
    children: (S, T) => {
      Oo(S, {
        get props() {
          return r.get(u);
        },
        get isStatic() {
          return r.get(c);
        },
        children: r.invalid_default_snippet,
        $$slots: {
          default: (P, x) => {
            const E = r.derived_safe_equal(() => x.value);
            Do(P, {
              get config() {
                return y;
              },
              get props() {
                return r.get(u);
              },
              get isStatic() {
                return r.get(c);
              },
              get isCustom() {
                return v;
              },
              children: r.invalid_default_snippet,
              $$slots: {
                default: (O, M) => {
                  const L = r.derived_safe_equal(() => M.state);
                  Ha(O, {
                    get Component() {
                      return g;
                    },
                    get visualState() {
                      return r.get(L);
                    },
                    get createVisualElement() {
                      return h;
                    },
                    get props() {
                      return r.get(u);
                    },
                    get isCustom() {
                      return v;
                    },
                    children: r.invalid_default_snippet,
                    $$slots: {
                      default: (B, D) => {
                        const R = r.derived_safe_equal(() => D.visualElement);
                        {
                          let q = r.derived_safe_equal(() => (r.deep_read_state(r.get(E)), r.deep_read_state(r.get(R)), r.untrack(() => C(r.get(E), r.get(R)))));
                          za(B, {
                            get visualElement() {
                              return r.get(q);
                            },
                            get props() {
                              return r.get(u);
                            },
                            children: r.invalid_default_snippet,
                            $$slots: {
                              default: (G, X) => {
                                const ce = r.derived_safe_equal(() => X.features);
                                var se = ql(), ne = r.first_child(se);
                                qa(ne, {
                                  get value() {
                                    return r.get(E);
                                  },
                                  get isCustom() {
                                    return v;
                                  },
                                  children: (k, $) => {
                                    {
                                      let ve = r.derived_safe_equal(() => (r.deep_read_state(Lt), r.deep_read_state(r.get(L)), r.deep_read_state(r.get(E)), r.deep_read_state(d()), r.untrack(() => Lt(r.get(L), r.get(E).visualElement, d()))));
                                      $a(k, {
                                        get Component() {
                                          return g;
                                        },
                                        get props() {
                                          return r.get(u);
                                        },
                                        get ref() {
                                          return r.get(ve);
                                        },
                                        get visualState() {
                                          return r.get(L);
                                        },
                                        get isStatic() {
                                          return r.get(c);
                                        },
                                        get forwardMotionProps() {
                                          return f();
                                        },
                                        get targetEl() {
                                          return p();
                                        },
                                        children: r.invalid_default_snippet,
                                        $$slots: {
                                          default: (ee, N) => {
                                            const fe = r.derived_safe_equal(() => N.motion), ge = r.derived_safe_equal(() => N.props);
                                            var ae = r.comment(), w = r.first_child(ae);
                                            r.slot(
                                              w,
                                              t,
                                              "default",
                                              {
                                                get motion() {
                                                  return r.get(fe);
                                                },
                                                get props() {
                                                  return r.get(ge);
                                                }
                                              },
                                              null
                                            ), r.append(ee, ae);
                                          }
                                        }
                                      });
                                    }
                                  },
                                  $$slots: { default: !0 }
                                });
                                var K = r.sibling(ne, 2);
                                {
                                  var ie = (k) => {
                                    var $ = r.comment(), ve = r.first_child($);
                                    r.each(ve, 1, () => r.get(ce), (ee) => ee.key, (ee, N) => {
                                      var fe = r.comment(), ge = r.first_child(fe);
                                      r.component(ge, () => r.get(N).Component, (ae, w) => {
                                        w(ae, {
                                          get props() {
                                            return r.get(N), r.untrack(() => r.get(N).props);
                                          },
                                          get visualElement() {
                                            return r.get(N), r.untrack(() => r.get(N).visualElement);
                                          },
                                          get isCustom() {
                                            return v;
                                          }
                                        });
                                      }), r.append(ee, fe);
                                    }), r.append(k, $);
                                  };
                                  r.if(K, (k) => {
                                    r.get(_) && k(ie);
                                  });
                                }
                                r.append(G, se);
                              }
                            }
                          });
                        }
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },
    $$slots: { default: !0 }
  }), r.pop(), s();
}
function Ho(e) {
  var t = !1, n = [], a = /* @__PURE__ */ new Set(), o, i = {
    subscribe: (s) => (a.size === 0 && (o = e?.()), a.add(s), () => {
      a.delete(s), a.size === 0 && o?.();
    }),
    start: (s, u) => {
      if (t) {
        var c = [];
        return a.forEach((l) => {
          c.push(
            bo(l, s, {
              transitionOverride: u
            })
          );
        }), Promise.all(c);
      } else
        return new Promise((l) => {
          n.push({
            animation: [s, u],
            resolve: l
          });
        });
    },
    set: (s) => a.forEach((u) => {
      Yu(u, s);
    }),
    stop: () => {
      a.forEach((s) => {
        Qu(s);
      });
    },
    mount: () => (t = !0, n.forEach((s) => {
      var u = s.animation, c = s.resolve;
      i.start.apply(i, u).then(c);
    }), () => {
      t = !1, i.stop();
    })
  };
  return i;
}
function Pc(e, t) {
  r.push(t, !1);
  let n = Ho();
  _e(n.mount), r.init();
  var a = r.comment(), o = r.first_child(a);
  r.slot(
    o,
    t,
    "default",
    {
      get controls() {
        return n;
      }
    },
    null
  ), r.append(e, a), r.pop();
}
const Cc = () => {
  const e = Ho(() => {
    const t = {};
    return we().then((n) => t.clean = e.mount()), () => {
      t.clean?.();
    };
  });
  return e;
};
var Kl = r.from_html("<div><!></div>");
function Vc(e, t) {
  const n = r.legacy_rest_props(t, ["children", "$$slots", "$$events", "$$legacy"]), a = r.legacy_rest_props(n, ["div"]);
  let o = r.prop(t, "div", 24, () => ({}));
  Gl(e, r.spread_props(() => a, {
    children: r.invalid_default_snippet,
    $$slots: {
      default: (i, s) => {
        const u = r.derived_safe_equal(() => s.motion), c = r.derived_safe_equal(() => s.props);
        var l = Kl();
        r.attribute_effect(l, () => ({ ...r.get(c), ...o() }));
        var f = r.child(l);
        r.slot(f, t, "default", {}, null), r.reset(l), r.action(l, (d) => r.get(u)?.(d)), r.append(i, l);
      }
    }
  }));
}
let Jn = 0;
function kl() {
  const e = Jn;
  return Jn++, e;
}
function Yl() {
  return /* @__PURE__ */ new Map();
}
function Wl(e, t) {
  r.push(t, !0);
  let n = r.prop(t, "onExitComplete", 3, void 0), a = r.prop(t, "initial", 3, void 0), o = r.prop(t, "custom", 3, void 0);
  const i = Yl(), s = kl(), u = r.derived(() => t.presenceAffectsLayout ? void 0 : t.isPresent), c = (g) => ({
    id: s,
    initial: a(),
    isPresent: t.isPresent,
    custom: o(),
    onExitComplete: (v) => {
      if (i.get(v) === !0) return;
      i.set(v, !0);
      let h = !0;
      i.forEach((y) => {
        y || (h = !1);
      }), h && n()?.();
    },
    register: (v) => (i.set(v, !1), () => i.delete(v))
  });
  let l = le();
  r.user_effect(() => {
    t.presenceAffectsLayout && l.set(c());
  }), r.user_effect(() => {
    r.get(u), $o(() => l.set(c()));
  });
  const f = (g) => {
    i.forEach((v, h) => i.set(h, !1));
  };
  r.user_effect(() => {
    f(t.isPresent), we().then(() => {
      !t.isPresent && !i.size && n()?.();
    });
  }), Ee(le, l), He("Presence", t.isCustom, l);
  var d = r.comment(), p = r.first_child(d);
  r.snippet(p, () => t.children ?? r.noop), r.append(e, d), r.pop();
}
function Tc(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(h, "$layoutContext", a), [a, o] = r.setup_stores(), i = r.mutable_source();
  let s = r.prop(t, "list", 8, void 0), u = r.prop(t, "custom", 8, void 0), c = r.prop(t, "initial", 8, !0), l = r.prop(t, "onExitComplete", 8, void 0), f = r.prop(t, "exitBeforeEnter", 8, void 0), d = r.prop(t, "presenceAffectsLayout", 8, !0), p = r.prop(t, "show", 8, void 0), g = r.prop(t, "isCustom", 8, !1), v = r.mutable_source(s() !== void 0 ? s() : p() ? [{ key: 1 }] : []);
  const h = I(Ze) || Ze(g());
  function y(M) {
    return M.key || "";
  }
  let m = r.mutable_source(!0), _ = r.mutable_source(r.get(v)), C = r.mutable_source(r.get(_)), S = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Set();
  const P = (M, L) => {
    M.forEach((B) => {
      const D = y(B);
      L.set(D, B);
    });
  };
  let x = r.mutable_source([
    ...r.get(_).map((M) => ({ present: !0, item: M, key: M.key, onExit: void 0 }))
  ]);
  r.legacy_pre_effect(() => (r.deep_read_state(s()), r.deep_read_state(p())), () => {
    r.set(v, s() !== void 0 ? s() : p() ? [{ key: 1 }] : []);
  }), r.legacy_pre_effect(() => (n(), r.get(v)), () => {
    r.set(i, () => {
      Ce(n()) && n().forceUpdate(), r.set(v, [...r.get(v)]);
    });
  }), r.legacy_pre_effect(() => r.get(v), () => {
    r.set(_, r.get(v));
  }), r.legacy_pre_effect(() => r.get(_), () => {
    P(r.get(_), S);
  }), r.legacy_pre_effect(
    () => (r.get(m), r.get(x), r.get(_), r.get(C), r.deep_read_state(f()), r.get(i), r.deep_read_state(l())),
    () => {
      if (r.get(m))
        r.set(m, !1);
      else {
        r.set(x, [
          ...r.get(_).map((D) => ({ present: !0, item: D, key: D.key, onExit: void 0 }))
        ]);
        const M = r.get(C).map(y), L = r.get(_).map(y), B = M.length;
        for (let D = 0; D < B; D++) {
          const R = M[D];
          L.indexOf(R) === -1 ? T.add(R) : T.delete(R);
        }
        f() && T.size && r.set(x, []), T.forEach((D) => {
          if (L.indexOf(D) !== -1) return;
          const R = S.get(D);
          if (!R) return;
          const q = M.indexOf(D), G = () => {
            S.delete(D), T.delete(D);
            const X = r.get(C).findIndex((ce) => ce.key === D);
            X < 0 || (r.get(C).splice(X, 1), T.size || (r.set(C, [...r.get(_)]), r.get(i)(), l() && l()()));
          };
          r.get(x).splice(q, 0, { present: !1, item: R, key: y(R), onExit: G });
        }), r.set(C, r.get(x));
      }
    }
  ), r.legacy_pre_effect_reset(), r.init();
  var E = r.comment(), O = r.first_child(E);
  r.each(O, 1, () => r.get(x), (M) => y(M), (M, L) => {
    {
      let B = r.derived_safe_equal(() => c() ? void 0 : !1), D = r.derived_safe_equal(() => (r.get(L), r.deep_read_state(u()), r.untrack(() => r.get(L).onExit ? u() : void 0)));
      Wl(M, {
        get isPresent() {
          return r.get(L), r.untrack(() => r.get(L).present);
        },
        get initial() {
          return r.get(B);
        },
        get custom() {
          return r.get(D);
        },
        get presenceAffectsLayout() {
          return d();
        },
        get onExitComplete() {
          return r.get(L), r.untrack(() => r.get(L).onExit);
        },
        get isCustom() {
          return g();
        },
        children: (R, q) => {
          var G = r.comment(), X = r.first_child(G);
          r.slot(
            X,
            t,
            "default",
            {
              get item() {
                return r.get(L), r.untrack(() => r.get(L).item);
              }
            },
            null
          ), r.append(R, G);
        },
        $$slots: { default: !0 }
      });
    }
  }), r.append(e, E), r.pop(), o();
}
function Xl(e) {
  for (var t = !1, n = {}, a = 0; a < cr.length; a++) {
    var o = cr[a], i = "rotate" + o;
    !e.hasValue(i) || e.getStaticValue(i) === 0 || (t = !0, n[i] = e.getStaticValue(i), e.setStaticValue(i, 0));
  }
  if (t) {
    e.syncRender();
    for (var i in n)
      e.setStaticValue(i, n[i]);
    e.scheduleRender();
  }
}
function Zl(e, t, n) {
  n === void 0 && (n = {});
  var a = pe(e) ? e : W(e);
  return rt("", a, t, n), {
    stop: () => a.stop()
  };
}
function Jl() {
  var e = W(1), t = {
    lead: void 0,
    follow: void 0,
    crossfadeOpacity: !1,
    preserveFollowOpacity: !1
  }, n = Object.assign({}, t), a = {}, o = {}, i = !1, s = null, u = 0;
  function c(f, d) {
    var p = t.lead, g = t.follow;
    i = !0, s = null;
    var v = !1, h = () => {
      v = !0, p && p.scheduleRender(), g && g.scheduleRender();
    }, y = () => {
      i = !1, s = Te().timestamp;
    };
    return d = d && It(d, "crossfade"), Zl(
      e,
      f,
      // @ts-expect-error
      Object.assign(Object.assign({}, d), {
        onUpdate: h,
        onComplete: () => {
          v ? y() : (e.set(f), oe.read(y)), h();
        }
      })
    );
  }
  function l() {
    var f, d, p = Te().timestamp, g = t.lead, v = t.follow;
    if (!(p === u || !g)) {
      u = p;
      var h = g.getLatestValues();
      Object.assign(a, h);
      var y = v ? v.getLatestValues() : t.prevValues;
      Object.assign(o, y);
      var m = e.get(), _ = (f = h.opacity) !== null && f !== void 0 ? f : 1, C = (d = y?.opacity) !== null && d !== void 0 ? d : 1;
      t.crossfadeOpacity && v ? (a.opacity = z(
        /**
         * If the follow child has been completely hidden we animate
         * this opacity from its previous opacity, but otherwise from completely transparent.
         */
        // @ts-expect-error
        v.isVisible !== !1 ? 0 : C,
        _,
        Ql(m)
      ), o.opacity = t.preserveFollowOpacity ? C : z(C, 0, $l(m))) : v || (a.opacity = z(C, _, m)), tc(a, o, h, y || {}, !!v, m);
    }
  }
  return {
    isActive: () => a && (i || Te().timestamp === s),
    fromLead: (f) => c(0, f),
    toLead: (f) => {
      var d = 0;
      return !t.prevValues && !t.follow ? d = 1 : n.lead === t.follow && n.follow === t.lead && (d = 1 - e.get()), e.set(d), c(1, f);
    },
    reset: () => e.set(1),
    stop: () => e.stop(),
    getCrossfadeState: (f) => {
      if (l(), f === t.lead)
        return a;
      if (f === t.follow)
        return o;
    },
    setOptions: (f) => {
      n = t, t = f, a = {}, o = {};
    },
    getLatestValues: () => a
  };
}
var Ql = zo(0, 0.5, Or), $l = zo(0.5, 0.95, Mr);
function zo(e, t, n) {
  return (a) => a < e ? 0 : a > t ? 1 : n(Ue(e, t, a));
}
var qo = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], ec = qo.length;
function tc(e, t, n, a, o, i) {
  for (var s = 0; s < ec; s++) {
    var u = "border" + qo[s] + "Radius", c = Qn(a, u), l = Qn(n, u);
    if (!(c === void 0 && l === void 0) && (c || (c = 0), l || (l = 0), typeof c == "number" && typeof l == "number")) {
      var f = Math.max(z(c, l, i), 0);
      e[u] = t[u] = f;
    }
  }
  if (a.rotate || n.rotate) {
    var d = z(a.rotate || 0, n.rotate || 0, i);
    e.rotate = t.rotate = d;
  }
  !o && n.backgroundColor && a.backgroundColor && (e.backgroundColor = t.backgroundColor = wr(
    a.backgroundColor,
    n.backgroundColor
  )(i));
}
function Qn(e, t) {
  var n;
  return (n = e[t]) !== null && n !== void 0 ? n : e.borderRadius;
}
function rc() {
  var e = /* @__PURE__ */ new Set(), t = { leadIsExiting: !1, lead: {}, follow: {} }, n = Object.assign({}, t), a, o, i, s = Jl(), u = !1;
  function c() {
    return t.follow ? t.follow.prevViewportBox : o;
  }
  function l() {
    var f;
    return (f = t.follow) === null || f === void 0 ? void 0 : f.getLayoutState().layout;
  }
  return {
    add: (f) => {
      f.setCrossfader(s), e.add(f), i && (f.prevDragCursor = i), t.lead || (t.lead = f);
    },
    remove: (f) => {
      e.delete(f);
    },
    getLead: () => t.lead,
    updateSnapshot: () => {
      if (t.lead) {
        a = s.isActive() ? s.getLatestValues() : t.lead.getLatestValues(), o = t.lead.prevViewportBox;
        var f = Uo.get(t.lead);
        f && f.isDragging && (i = f.cursorProgress);
      }
    },
    clearSnapshot: () => {
      i = o = void 0;
    },
    updateLeadAndFollow: () => {
      var f;
      n = Object.assign({}, t);
      for (var d, p, g = Array.from(e), v = g.length; v--; v >= 0) {
        var h = g[v];
        if (d && (p ?? (p = h)), d ?? (d = h), d && p) break;
      }
      t.lead = d, t.follow = p, t.leadIsExiting = ((f = t.lead) === null || f === void 0 ? void 0 : f.presence) === J.Exiting, s.setOptions({
        lead: d,
        follow: p,
        prevValues: a,
        crossfadeOpacity: (
          // @ts-expect-error
          p?.isPresenceRoot || d?.isPresenceRoot
        )
      }), // Don't crossfade if we've just animated back from lead and switched the
      // old follow to the new lead.
      t.lead !== n.follow && (n.lead !== t.lead || n.leadIsExiting !== t.leadIsExiting) && (u = !0);
    },
    animate: (f, d) => {
      var p;
      if (d === void 0 && (d = !1), f === t.lead) {
        d ? f.pointTo(t.lead) : f.setVisibility(!0);
        var g = {}, v = (p = t.follow) === null || p === void 0 ? void 0 : p.getProjectionParent();
        if (v && (g.prevParent = v), f.presence === J.Entering ? g.originBox = c() : f.presence === J.Exiting && (g.targetBox = l()), u) {
          u = !1;
          var h = f.getDefaultTransition();
          f.presence === J.Entering ? s.toLead(h) : s.fromLead(h);
        }
        f.notifyLayoutReady(g);
      } else
        d ? t.lead && f.pointTo(t.lead) : f.setVisibility(!1);
    }
  };
}
function wc(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "type", 8, void 0), a = r.prop(t, "isCustom", 8, !1);
  const o = I(ye) || ye(a());
  let i = !1, s = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Map(), c = !1, l = r.mutable_source(!1), f = {
    ...xr(),
    syncUpdate: (P) => g(P),
    forceUpdate: () => {
      g();
    },
    register: (P) => v(P),
    remove: (P) => {
      h(P);
    }
  };
  const d = () => {
    r.set(l, c = !1), s.forEach((x) => {
      x.isPresent ? x.presence !== J.Entering && (x.presence = x.presence === J.Exiting ? J.Entering : J.Present) : x.presence = J.Exiting;
    }), p();
    const P = {
      measureLayout: (x) => x.updateLayoutMeasurement(),
      layoutReady: (x) => {
        x.getLayoutId() !== void 0 ? _(x).animate(x, n() === "crossfade") : x.notifyLayoutReady();
      },
      parent: Y(o).visualElement
    };
    s.forEach((x) => f.add(x)), f.flush(P), u.forEach((x) => x.clearSnapshot());
  }, p = () => {
    u.forEach((P) => P.updateLeadAndFollow());
  }, g = (P = !1) => {
    (P || !c) && (c = !0, s.forEach((x) => Xl(x)), s.forEach((x) => oa(x)), u.forEach((x) => x.updateSnapshot()), (P || !r.get(l)) && r.set(l, !0));
  }, v = (P) => {
    s.add(P), y(P), P.presence = i ? J.Entering : J.Present;
  }, h = (P) => {
    g(), s.delete(P), m(P);
  }, y = (P) => {
    _(P)?.add(P);
  }, m = (P) => {
    _(P)?.remove(P);
  }, _ = (P) => {
    const x = P.getLayoutId();
    if (x !== void 0)
      return !u.has(x) && u.set(x, rc()), u.get(x);
  };
  let C = re(f);
  Ee(Ze, C), He("SharedLayout", a(), C), _e(() => {
    i = !0;
  }), r.legacy_pre_effect(() => (r.get(l), we), () => {
    r.get(l) && we().then(() => {
      d();
    });
  }), r.legacy_pre_effect_reset(), r.init();
  var S = r.comment(), T = r.first_child(S);
  r.slot(T, t, "default", {}, null), r.append(e, S), r.pop();
}
function Ec(e, t) {
  r.push(t, !1);
  let n = r.prop(t, "features", 8), a = r.prop(t, "strict", 8, !1), o = r.prop(t, "isCustom", 8, !1), i = !u(n()), s = r.mutable_source(void 0);
  function u(d) {
    return typeof d == "function";
  }
  _e(() => {
    u(n()) && n()().then(({ renderer: d, ...p }) => {
      Fe(p), r.mutate(s, r.get(s).current = d), setIsLoaded(!0);
    });
  });
  let c = re({ renderer: r.get(s).current, strict: a() });
  Ee(sr, c), He("Lazy", o(), c), r.legacy_pre_effect(() => (r.deep_read_state(n()), Fe), () => {
    if (!u(n()) && i) {
      const { renderer: d, ...p } = n();
      r.mutate(s, r.get(s).current = d), Fe(p);
    }
  }), r.legacy_pre_effect(() => (r.get(s), r.deep_read_state(a())), () => {
    c.set({ renderer: r.get(s).current, strict: a() });
  }), r.legacy_pre_effect_reset(), r.init();
  var l = r.comment(), f = r.first_child(l);
  r.slot(f, t, "default", {}, null), r.append(e, l), r.pop();
}
const nc = () => {
  const e = I(je), t = I(kr), n = (o = !1) => {
    Y(e).forEach((s, u) => {
      s.afterU?.(!0);
    });
  }, a = () => {
    Y(e).forEach((o) => {
      o.updater?.(!0);
    });
  };
  return t.update(
    (o) => o.concat([
      {
        updater: a,
        afterU: n
      }
    ])
  ), {
    update: a
  };
};
function Ac(e, t) {
  r.push(t, !1);
  const n = () => r.store_get(f, "$mcc", a), [a, o] = r.setup_stores(), i = r.mutable_source();
  let s = r.prop(t, "transformPagePoint", 8, void 0), u = r.prop(t, "isStatic", 8, void 0), c = r.prop(t, "transition", 8, void 0), l = r.prop(t, "isCustom", 8, !1);
  const f = I(Q) || Q(l());
  let d = r.mutable_source({
    ...Y(f),
    transformPagePoint: s(),
    isStatic: u(),
    transition: c()
  });
  jo();
  let p = re(r.get(d));
  Ee(Q, p), He("Motion", l(), p);
  const g = () => r.get(d), v = nc();
  r.legacy_pre_effect(
    () => (n(), r.deep_read_state(s()), r.deep_read_state(u()), r.deep_read_state(c())),
    () => {
      r.set(d, {
        ...n(),
        transformPagePoint: s(),
        isStatic: u(),
        transition: c()
      });
    }
  ), r.legacy_pre_effect(() => r.get(d), () => {
    r.set(i, typeof r.get(d).transition == "object" ? r.get(d).transition.toString() : "");
  }), r.legacy_pre_effect(() => (r.get(i), r.get(d)), () => {
    p.set(g(r.get(i), r.get(d).transformPagePoint)), v.update();
  }), r.legacy_pre_effect_reset(), r.init();
  var h = r.comment(), y = r.first_child(h);
  r.slot(y, t, "default", {}, null), r.append(e, h), r.pop(), o();
}
var ac = r.from_html("<!> <!>", 1);
function mr(e, t) {
  const n = r.legacy_rest_props(t, ["children", "$$slots", "$$events", "$$legacy"]), a = r.legacy_rest_props(n, ["isSVG", "forwardMotionProps", "externalRef", "targetEl"]);
  r.push(t, !1);
  const o = () => r.store_get(m, "$a", i), [i, s] = r.setup_stores(), u = r.mutable_source(), c = r.mutable_source();
  let l = r.prop(t, "isSVG", 8, !1), f = r.prop(t, "forwardMotionProps", 8, !1), d = r.prop(t, "externalRef", 8, void 0);
  const g = r.prop(
    t,
    "targetEl",
    8,
    void 0
    /*
      initial: $$Props["initial"] = undefined,
      style: $$Props["style"] = undefined,
      transformTemplate: $$Props["transformTemplate"] = undefined,
      transformValues = undefined,
      //AnimationProps
      animate: $$Props["animate"] = undefined,
      exit: $$Props["exit"] = undefined,
      variants: $$Props["variants"] = undefined,
      transition: $$Props["transition"] = undefined,
      //VisualElementLifecycles
      onViewportBoxUpdate: $$Props["onViewportBoxUpdate"] = undefined,
      onBeforeLayoutMeasure: $$Props["onBeforeLayoutMeasure"] = undefined,
      onLayoutMeasure: $$Props["onLayoutMeasure"] = undefined,
      onUpdate: $$Props["onUpdate"] = undefined,
      onAnimationStart: $$Props["onAnimationStart"] = undefined,
      onAnimationComplete: $$Props["onAnimationComplete"] = undefined,
      onLayoutAnimationComplete: $$Props["onLayoutAnimationComplete"] = undefined,
      //GestureHandlers
      // PanHandlers
      onPan: $$Props["onPan"] = undefined,
      onPanStart: $$Props["onPanStart"] = undefined,
      onPanSessionStart: $$Props["onPanSessionStart"] = undefined,
      onPanEnd: $$Props["onPanEnd"] = undefined,
      // TapHandlers
      onTap: $$Props["onTap"] = undefined,
      onTapStart: $$Props["onTapStart"] = undefined,
      onTapCancel: $$Props["onTapCancel"] = undefined,
      whileTap: $$Props["whileTap"] = undefined,
      //HoverHandlers
      whileHover: $$Props["whileHover"] = undefined,
      onHoverStart: $$Props["onHoverStart"] = undefined,
      onHoverEnd: $$Props["onHoverEnd"] = undefined,
      //FocusHandlers
      whileFocus: $$Props["whileFocus"] = undefined,
      //DraggableProps
      drag: $$Props["drag"] = undefined,
      whileDrag: $$Props["whileDrag"] = undefined,
      dragDirectionLock: $$Props["dragDirectionLock"] = undefined,
      dragPropagation: $$Props["dragPropagation"] = undefined,
      dragConstraints: $$Props["dragConstraints"] = undefined,
      dragElastic: $$Props["dragElastic"] = undefined,
      dragMomentum: $$Props["dragMomentum"] = undefined,
      dragTransition: $$Props["dragTransition"] = undefined,
      dragControls: $$Props["dragControls"] = undefined,
      dragListener: $$Props["dragListener"] = undefined,
      onMeasureDragConstraints: $$Props["onMeasureDragConstraints"] = undefined,
      _dragX: $$Props["_dragX"] = undefined,
      _dragY: $$Props["_dragY"] = undefined,
      //DragHandlers
      onDragStart: $$Props["onDragStart"] = undefined,
      onDragEnd: $$Props["onDragEnd"] = undefined,
      onDrag: $$Props["onDrag"] = undefined,
      onDirectionLock: $$Props["onDirectionLock"] = undefined,
      onDragTransitionEnd: $$Props["onDragTransitionEnd"] = undefined,
      // LayoutProps
      layout: $$Props["layout"] = undefined,
      layoutId: $$Props["layoutId"] = undefined,
      //MotionAdvancedProps
      custom: $$Props["custom"] = undefined,
      inherit: $$Props["inherit"] = undefined,
      // **internal***
      isSVG: $$Props["isSVG"] = false,
      update: $$Props["update"] = undefined,
      forwardMotionProps: $$Props["forwardMotionProps"] = false,
      externalRef: $$Props["externalRef"] = undefined,
      targetEl: $$Props["targetEl"] = undefined;
    */
  )();
  let v = l() ? "SVG" : "DOM", h = Kr, y = l() ? Mo : Lo;
  const m = I(Q) || Q(g);
  let _ = r.mutable_source(!1);
  const C = (S, T) => (S.visualElement = T, T);
  _e(() => r.set(_, !0)), r.legacy_pre_effect(() => r.deep_read_state(a), () => {
    r.set(u, a);
  }), r.legacy_pre_effect(() => (r.get(c), o()), () => {
    ((S) => {
      r.set(c, S.isStatic);
    })(o() || {});
  }), r.legacy_pre_effect_reset(), r.init(), Ro(e, {
    get isCustom() {
      return g;
    },
    children: (S, T) => {
      Oo(S, {
        get props() {
          return r.get(u);
        },
        get isStatic() {
          return r.get(c);
        },
        get isCustom() {
          return g;
        },
        children: r.invalid_default_snippet,
        $$slots: {
          default: (P, x) => {
            const E = r.derived_safe_equal(() => x.value);
            Do(P, {
              get config() {
                return y;
              },
              get props() {
                return r.get(u);
              },
              get isStatic() {
                return r.get(c);
              },
              get isCustom() {
                return g;
              },
              children: r.invalid_default_snippet,
              $$slots: {
                default: (O, M) => {
                  const L = r.derived_safe_equal(() => M.state);
                  Ha(O, {
                    get Component() {
                      return v;
                    },
                    get visualState() {
                      return r.get(L);
                    },
                    get createVisualElement() {
                      return h;
                    },
                    get props() {
                      return r.get(u);
                    },
                    get isCustom() {
                      return g;
                    },
                    children: r.invalid_default_snippet,
                    $$slots: {
                      default: (B, D) => {
                        const R = r.derived_safe_equal(() => D.visualElement);
                        {
                          let q = r.derived_safe_equal(() => (r.deep_read_state(r.get(E)), r.deep_read_state(r.get(R)), r.untrack(() => C(r.get(E), r.get(R)))));
                          za(B, {
                            get visualElement() {
                              return r.get(q);
                            },
                            get props() {
                              return r.get(u);
                            },
                            children: r.invalid_default_snippet,
                            $$slots: {
                              default: (G, X) => {
                                const ce = r.derived_safe_equal(() => X.features);
                                var se = ac(), ne = r.first_child(se);
                                qa(ne, {
                                  get value() {
                                    return r.get(E);
                                  },
                                  get isCustom() {
                                    return g;
                                  },
                                  children: (k, $) => {
                                    {
                                      let ve = r.derived_safe_equal(() => (r.deep_read_state(Lt), r.deep_read_state(r.get(L)), r.deep_read_state(r.get(E)), r.deep_read_state(d()), r.untrack(() => Lt(r.get(L), r.get(E).visualElement, d()))));
                                      $a(k, {
                                        get Component() {
                                          return v;
                                        },
                                        get props() {
                                          return r.get(u);
                                        },
                                        get ref() {
                                          return r.get(ve);
                                        },
                                        get visualState() {
                                          return r.get(L);
                                        },
                                        get isStatic() {
                                          return r.get(c);
                                        },
                                        get forwardMotionProps() {
                                          return f();
                                        },
                                        children: r.invalid_default_snippet,
                                        $$slots: {
                                          default: (ee, N) => {
                                            const fe = r.derived_safe_equal(() => N.motion), ge = r.derived_safe_equal(() => N.props);
                                            var ae = r.comment(), w = r.first_child(ae);
                                            r.slot(
                                              w,
                                              t,
                                              "default",
                                              {
                                                get motion() {
                                                  return r.get(fe);
                                                },
                                                get props() {
                                                  return r.get(ge);
                                                }
                                              },
                                              null
                                            ), r.append(ee, ae);
                                          }
                                        }
                                      });
                                    }
                                  },
                                  $$slots: { default: !0 }
                                });
                                var K = r.sibling(ne, 2);
                                {
                                  var ie = (k) => {
                                    var $ = r.comment(), ve = r.first_child($);
                                    r.each(ve, 1, () => r.get(ce), ({ key: ee, props: N, visualElement: fe, Component: ge }) => ee, (ee, N, fe, ge) => {
                                      let ae = () => r.get(N).props, w = () => r.get(N).visualElement, b = () => r.get(N).Component;
                                      var V = r.comment(), j = r.first_child(V);
                                      r.component(j, b, (F, H) => {
                                        H(F, {
                                          get props() {
                                            return ae();
                                          },
                                          get visualElement() {
                                            return w();
                                          },
                                          get isCustom() {
                                            return g;
                                          }
                                        });
                                      }), r.append(ee, V);
                                    }), r.append(k, $);
                                  };
                                  r.if(K, (k) => {
                                    r.get(_) && k(ie);
                                  });
                                }
                                r.append(G, se);
                              }
                            }
                          });
                        }
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },
    $$slots: { default: !0 }
  }), r.pop(), s();
}
const oc = ({
  preloadedFeatures: e,
  createVisualElement: t,
  useRender: n,
  useVisualState: a,
  Component: o
}) => (e && Fe(e), class extends mr {
  constructor(s) {
    const u = s.props;
    s.props = {
      props: u,
      defaultFeatures: e,
      createVisualElement: t,
      forwardMotionProps: n,
      Component: o,
      visualStateConfig: a
    }, super({ component: mr, ...s });
  }
  // @ts-expect-error
}), sc = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "tspan",
  "use",
  "view"
];
function ic(e) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof e != "string" || /**
    * If it contains a dash, the element is a custom HTML webcomponent.
    */
    e.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(sc.indexOf(e) > -1 || /**
      * If it contains a capital letter, it's an SVG component
      */
      /[A-Z]/.test(e))
    )
  );
}
function uc(e, t) {
  const n = r.legacy_rest_props(t, ["children", "$$slots", "$$events", "$$legacy"]), a = r.legacy_rest_props(n, ["___tag", "el", "isSVG"]);
  r.push(t, !1);
  let o = r.prop(t, "___tag", 8), i = r.prop(t, "el", 12), s = r.prop(t, "isSVG", 8, !1);
  r.init(), mr(e, r.spread_props(() => a, {
    get isSVG() {
      return s();
    },
    children: r.invalid_default_snippet,
    $$slots: {
      default: (u, c) => {
        const l = r.derived_safe_equal(() => c.props), f = r.derived_safe_equal(() => c.motion);
        var d = r.comment(), p = r.first_child(d);
        r.element(
          p,
          o,
          !1,
          (g, v) => {
            r.bind_this(g, (m) => i(m), () => i()), r.action(g, (m) => r.get(f)?.(m)), r.attribute_effect(
              g,
              (m) => ({
                ...m,
                class: (r.deep_read_state(r.get(l)), r.untrack(() => r.get(l).class)),
                xmlns: s() ? "http://www.w3.org/2000/svg" : void 0
              }),
              [
                () => Object.fromEntries(Object.entries(r.get(l)).filter(([m, _]) => m !== "latestvalues" && m !== "renderstate" && m !== "visualProps"))
              ]
            );
            var h = r.comment(), y = r.first_child(h);
            r.slot(y, t, "default", {}, null), r.append(v, h);
          },
          () => s() ? "http://www.w3.org/2000/svg" : void 0
        ), r.append(u, d);
      }
    }
  })), r.pop();
}
function Go(e) {
  return e && Fe(e), new Proxy({}, {
    get(t, n) {
      let a = !1;
      return n.toString().slice(0, 1) === n.toString().slice(0, 1).toLowerCase() && (a = ic(n)), new Proxy(uc, {
        construct(o, i) {
          if ((!i || !i[0]) && i.push({}), !i[0]?.props)
            i[0].props = { ___tag: n, isSVG: a };
          else
            try {
              Object.assign(i[0], {
                ___tag: n,
                isSVG: a
              });
            } catch {
              i[0].props.___tag = n, i[0].props.isSVG = a;
            }
          return new o(...i);
        },
        // support svelte 5
        apply(o, i, s) {
          if (!s[1])
            s[1] = { ___tag: n, isSVG: a };
          else
            try {
              Object.assign(s[1], {
                ___tag: n,
                isSVG: a
              });
            } catch {
              s[1].___tag = n, s[1].isSVG = a;
            }
          return o(...s);
        }
      });
    }
  });
}
var Lc = /* @__PURE__ */ Go(No);
function Oc(e) {
  var t = {
    createVisualElement: Kr(e),
    // useRender: createUseRender(key, false),
    // @ts-expect-error
    forwardMotionProps: e.forwardMotionProps,
    // @ts-expect-error
    Component: e.Component,
    // @ts-expect-error
    defaultFeatures: allMotionFeatures
  };
  return oc(t);
}
var Dc = /* @__PURE__ */ Go({ ...Io });
function Ko(e) {
  const t = { x: !1, y: !1, xp: !1, yp: !1 };
  let n;
  const a = e ? (o) => () => (!t.x && !t.y && !t.xp && !t.yp && (n = e()), t[o] = !0, () => {
    t[o] = !1, !t.x && !t.y && !t.xp && !t.yp && n && n.then((i) => i());
  }) : () => {
  };
  return {
    scrollX: W(0, a("x")),
    scrollY: W(0, a("y")),
    scrollXProgress: W(0, a("xp")),
    scrollYProgress: W(0, a("yp"))
  };
}
function $n(e, t, n) {
  n.set(!e || !t ? 0 : e / t);
}
function ko(e, t) {
  var n = () => {
    var a = t(), o = a.xOffset, i = a.yOffset, s = a.xMaxOffset, u = a.yMaxOffset;
    e.scrollX.set(o), e.scrollY.set(i), $n(o, s, e.scrollXProgress), $n(i, u, e.scrollYProgress);
  };
  return n(), n;
}
const lc = (e) => () => ({
  xOffset: e.scrollLeft,
  yOffset: e.scrollTop,
  xMaxOffset: e.scrollWidth - e.offsetWidth,
  yMaxOffset: e.scrollHeight - e.offsetHeight
}), jc = (e) => {
  const t = {};
  return Object.assign(t, Ko(async () => {
    if (typeof window > "u") return () => {
    };
    let a = 10;
    for (; (!e || !e.current) && !t.ref; ) {
      if (a-- < 1)
        return () => {
        };
      await new Promise((c) => setTimeout(() => c(), 200));
    }
    const o = e && e.current ? e : t.ref, i = ko(t, lc(o)), s = Ae(o, "scroll", i, { passive: !0 }), u = Ae(o, "resize", i);
    return () => {
      s && s(), u && u();
    };
  })), t;
};
let xt;
function cc() {
  return {
    xOffset: window.pageXOffset,
    yOffset: window.pageYOffset,
    xMaxOffset: document.body.clientWidth - window.innerWidth,
    yMaxOffset: document.body.clientHeight - window.innerHeight
  };
}
let Yo = !1;
function fc() {
  if (Yo = !0, typeof window > "u") return;
  const e = ko(
    xt,
    cc
  );
  Ae(window, "scroll", e, { passive: !0 }), Ae(window, "resize", e);
}
function Rc() {
  return xt || (xt = Ko()), we().then((e) => {
    !Yo && fc();
  }), xt;
}
const Wo = (e, t) => {
  let n = [], a = e;
  const o = () => {
    for (const l of n)
      l();
  }, i = () => {
    n = a.map((l) => l.onChange(c)), u();
  }, s = W(t(), () => (o(), i(), o));
  let u = () => {
    s.set(t());
  };
  const c = () => {
    oe.update(u, !1, !0);
  };
  return s.reset = (l, f) => {
    a = l, o(), u = () => {
      s.set(f());
    }, i();
  }, s;
}, Ic = (e, ...t) => {
  let n = e.length;
  const a = () => {
    let i = "";
    for (let s = 0; s < n; s++)
      i += e[s], t[s] && (i += t[s].get());
    return i;
  }, o = Wo(t, a);
  return o.resetInner = o.reset, o.reset = (i, ...s) => {
    n = i.length, o.resetInner(s, a);
  }, o;
}, Bc = (e, t = {}, n = !1) => {
  const a = I(Q) || Q(n);
  let o = null;
  const i = W(pe(e) ? e.get() : e), s = (u, c) => (i.attach((l, f) => {
    const { isStatic: d } = Y(a);
    return d ? f(l) : (o && o.stop(), o = jr({
      from: i.get(),
      to: l,
      velocity: i.getVelocity(),
      ...c,
      onUpdate: f
    }), i.get());
  }), pe(u) ? u.onChange((l) => i.set(Number.parseFloat(l))) : void 0);
  return s(e, t), i.reset = s, i;
};
var dc = (e) => typeof e == "object" && e.mix, pc = (e) => dc(e) ? e.mix : void 0;
function gc(...e) {
  var t = !Array.isArray(e[0]), n = t ? 0 : -1, a = e[0 + n], o = e[1 + n], i = e[2 + n], s = e[3 + n], u = Er(o, i, Object.assign({ mixer: pc(i[0]) }, s));
  return t ? u(a) : u;
}
function Fc(e, t, n, a) {
  const o = [], i = (u, c, l, f) => {
    const d = typeof c == "function" ? c : gc(c, l, f), p = Array.isArray(u) ? u : [u], g = Array.isArray(u) ? d : ([v]) => d(v);
    return [
      p,
      () => {
        o.length = 0;
        const v = p.length;
        for (let h = 0; h < v; h++)
          o[h] = p[h].get();
        return g(o);
      }
    ];
  }, s = Wo(...i(e, t, n, a));
  return s.updateInner = s.reset, s.reset = (u, c, l, f) => s.updateInner(...i(u, c, l, f)), s;
}
const Uc = (e) => {
  let t = e, n;
  const a = (i) => {
    n?.(), t = i, n = t.velocityUpdateSubscribers.add((s) => {
      o.set(s);
    });
  }, o = W(e.getVelocity(), () => (n?.(), n = t.velocityUpdateSubscribers.add((i) => {
    o.set(i);
  }), () => {
    n?.();
  }));
  return o.reset = a, o;
};
let We;
function vc() {
  if (We = W(null), !(typeof window > "u"))
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => We.set(e.matches);
      e.addListener(t), t();
    } else
      We.set(!1);
}
const Nc = () => (!We && vc(), hr(We, (e) => e));
class mc {
  componentControls = /* @__PURE__ */ new Set();
  /**
   * Subscribe a component's internal `VisualElementDragControls` to the user-facing API.
   *
   * @internal
   */
  subscribe = (t) => (this.componentControls.add(t), () => this.componentControls.delete(t));
  /**
   * Start a drag gesture on every `motion` component that has this set of drag controls
   * passed into it via the `dragControls` prop.
   *
   * ```jsx
   * dragControls.start(e, {
   *   snapToCursor: true
   * })
   * ```
   *
   * @param event - PointerEvent
   * @param options - Options
   *
   * @public
   */
  start = (t, n) => {
    this.componentControls.forEach((a) => {
      a.start("nativeEvent" in t ? t.nativeEvent : t, n);
    });
  };
  updateConstraints = (t) => {
    this.componentControls.forEach((n) => {
      n.prepareBoundingBox(), n.resolveDragConstraints();
    });
  };
}
const hc = () => new mc(), Hc = hc, zc = (...e) => {
  let t = 0;
  const n = re(e[t]), a = (o) => {
    t = typeof o != "number" ? xi(0, e.length, t + 1) : o, n.set(e[t]);
  };
  return n.next = a, n;
};
export {
  Tc as AnimatePresence,
  wc as AnimateSharedLayout,
  mc as DragControls,
  sl as FlatTree,
  Jr as FramerTreeLayoutContext,
  gn as LayoutGroupContext,
  Ec as LazyMotion,
  Dc as M,
  Vc as Mdiv,
  Lc as Motion,
  Ac as MotionConfig,
  Q as MotionConfigContext,
  Vc as MotionDiv,
  Gl as MotionSSR,
  Pu as MotionValue,
  le as PresenceContext,
  Pc as UseAnimation,
  Jt as UseDomEvent,
  bc as UseGestures,
  Ba as UsePanGesture,
  Ua as UseTapGesture,
  Ui as addScaleCorrection,
  Zl as animate,
  bo as animateVisualElement,
  Ho as animationControls,
  Io as animations,
  Xt as batchLayout,
  xr as createBatcher,
  Jl as createCrossfader,
  Oc as createDomMotionComponent,
  oc as createMotionComponent,
  jl as drag,
  No as featureBundle,
  Zt as flushLayout,
  Rl as gestureAnimations,
  Et as isValidMotionProp,
  Sc as layoutAnimation,
  Dc as m,
  Lc as motion,
  W as motionValue,
  _l as resolveMotionValue,
  oa as snapshotViewportBox,
  gc as transform,
  Cc as useAnimation,
  zc as useCycle,
  Hc as useDragControls,
  jc as useElementScroll,
  xc as useIsPresent,
  Ic as useMotionTemplate,
  W as useMotionValue,
  Na as usePresence,
  Nc as useReducedMotion,
  Bc as useSpring,
  Fc as useTransform,
  Uc as useVelocity,
  Rc as useViewportScroll,
  So as visualElement
};
