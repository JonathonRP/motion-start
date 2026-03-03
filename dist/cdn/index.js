var jo = Array.isArray, Fl = Array.prototype.indexOf, nn = Array.prototype.includes, Io = Array.from, qa = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, Wa = Object.getOwnPropertyDescriptors, Nl = Object.prototype, Bl = Array.prototype, Fo = Object.getPrototypeOf;
function gn(e) {
  return typeof e == "function";
}
const be = () => {
};
function Ul(e) {
  return e();
}
function mr(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Xa() {
  var e, t, n = new Promise((r, o) => {
    e = r, t = o;
  });
  return { promise: n, resolve: e, reject: t };
}
const ye = 2, ln = 4, rn = 8, Mr = 1 << 24, Tt = 16, $e = 32, fn = 64, Hl = 128, He = 512, fe = 1024, xe = 2048, Je = 4096, Pe = 8192, tt = 16384, cn = 32768, xt = 65536, Ei = 1 << 17, zl = 1 << 18, Lr = 1 << 19, Za = 1 << 20, ft = 1 << 25, It = 65536, ro = 1 << 21, No = 1 << 22, wt = 1 << 23, nt = /* @__PURE__ */ Symbol("$state"), Ja = /* @__PURE__ */ Symbol("legacy props"), kl = /* @__PURE__ */ Symbol(""), Ot = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Qa = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
function $a(e) {
  return e === this.v;
}
function es(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function ts(e) {
  return !es(e, this.v);
}
function je() {
  throw new Error("https://svelte.dev/e/invalid_default_snippet");
}
function kn(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Gl() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Kl(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Yl(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function ql() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Wl(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Xl() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ns(e) {
  throw new Error("https://svelte.dev/e/lifecycle_legacy_only");
}
function Zl(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Jl() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ql() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function $l() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
let dn = !1;
function ef() {
  dn = !0;
}
const tf = 1, nf = 2, rf = 16, of = 1, af = 2, rs = 4, sf = 8, uf = 16, lf = 1, ff = 2, le = /* @__PURE__ */ Symbol(), os = "http://www.w3.org/1999/xhtml", cf = "http://www.w3.org/2000/svg", df = "@attach";
let Y = null;
function gr(e) {
  Y = e;
}
function J(e) {
  return (
    /** @type {T} */
    is().get(e)
  );
}
function Ft(e, t) {
  return is().set(e, t), t;
}
function G(e, t = !1, n) {
  Y = {
    p: Y,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: dn && !t ? { s: null, u: null, $: [] } : null
  };
}
function K(e) {
  var t = (
    /** @type {ComponentContext} */
    Y
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      Es(r);
  }
  return t.i = !0, Y = t.p, /** @type {T} */
  {};
}
function Gn() {
  return !dn || Y !== null && Y.l === null;
}
function is(e) {
  return Y === null && kn(), Y.c ??= new Map(vf(Y) || void 0);
}
function vf(e) {
  let t = e.p;
  for (; t !== null; ) {
    const n = t.c;
    if (n !== null)
      return n;
    t = t.p;
  }
  return null;
}
let Mt = [];
function as() {
  var e = Mt;
  Mt = [], mr(e);
}
function on(e) {
  if (Mt.length === 0 && !Pn) {
    var t = Mt;
    queueMicrotask(() => {
      t === Mt && as();
    });
  }
  Mt.push(e);
}
function pf() {
  for (; Mt.length > 0; )
    as();
}
function hf() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function qt(e) {
  if (typeof e != "object" || e === null || nt in e)
    return e;
  const t = Fo(e);
  if (t !== Nl && t !== Bl)
    return e;
  var n = /* @__PURE__ */ new Map(), r = jo(e), o = /* @__PURE__ */ ht(0), i = Rt, a = (s) => {
    if (Rt === i)
      return s();
    var u = z, l = Rt;
    rt(null), Mi(i);
    var f = s();
    return rt(u), Mi(l), f;
  };
  return r && n.set("length", /* @__PURE__ */ ht(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(s, u, l) {
        (!("value" in l) || l.configurable === !1 || l.enumerable === !1 || l.writable === !1) && Jl();
        var f = n.get(u);
        return f === void 0 ? a(() => {
          var c = /* @__PURE__ */ ht(l.value);
          return n.set(u, c), c;
        }) : O(f, l.value, !0), !0;
      },
      deleteProperty(s, u) {
        var l = n.get(u);
        if (l === void 0) {
          if (u in s) {
            const f = a(() => /* @__PURE__ */ ht(le));
            n.set(u, f), Cn(o);
          }
        } else
          O(l, le), Cn(o);
        return !0;
      },
      get(s, u, l) {
        if (u === nt)
          return e;
        var f = n.get(u), c = u in s;
        if (f === void 0 && (!c || Jt(s, u)?.writable) && (f = a(() => {
          var h = qt(c ? s[u] : le), p = /* @__PURE__ */ ht(h);
          return p;
        }), n.set(u, f)), f !== void 0) {
          var d = v(f);
          return d === le ? void 0 : d;
        }
        return Reflect.get(s, u, l);
      },
      getOwnPropertyDescriptor(s, u) {
        var l = Reflect.getOwnPropertyDescriptor(s, u);
        if (l && "value" in l) {
          var f = n.get(u);
          f && (l.value = v(f));
        } else if (l === void 0) {
          var c = n.get(u), d = c?.v;
          if (c !== void 0 && d !== le)
            return {
              enumerable: !0,
              configurable: !0,
              value: d,
              writable: !0
            };
        }
        return l;
      },
      has(s, u) {
        if (u === nt)
          return !0;
        var l = n.get(u), f = l !== void 0 && l.v !== le || Reflect.has(s, u);
        if (l !== void 0 || q !== null && (!f || Jt(s, u)?.writable)) {
          l === void 0 && (l = a(() => {
            var d = f ? qt(s[u]) : le, h = /* @__PURE__ */ ht(d);
            return h;
          }), n.set(u, l));
          var c = v(l);
          if (c === le)
            return !1;
        }
        return f;
      },
      set(s, u, l, f) {
        var c = n.get(u), d = u in s;
        if (r && u === "length")
          for (var h = l; h < /** @type {Source<number>} */
          c.v; h += 1) {
            var p = n.get(h + "");
            p !== void 0 ? O(p, le) : h in s && (p = a(() => /* @__PURE__ */ ht(le)), n.set(h + "", p));
          }
        if (c === void 0)
          (!d || Jt(s, u)?.writable) && (c = a(() => /* @__PURE__ */ ht(void 0)), O(c, qt(l)), n.set(u, c));
        else {
          d = c.v !== le;
          var g = a(() => qt(l));
          O(c, g);
        }
        var y = Reflect.getOwnPropertyDescriptor(s, u);
        if (y?.set && y.set.call(f, l), !d) {
          if (r && typeof u == "string") {
            var m = (
              /** @type {Source<number>} */
              n.get("length")
            ), b = Number(u);
            Number.isInteger(b) && b >= m.v && O(m, b + 1);
          }
          Cn(o);
        }
        return !0;
      },
      ownKeys(s) {
        v(o);
        var u = Reflect.ownKeys(s).filter((c) => {
          var d = n.get(c);
          return d === void 0 || d.v !== le;
        });
        for (var [l, f] of n)
          f.v !== le && !(l in s) && u.push(l);
        return u;
      },
      setPrototypeOf() {
        Ql();
      }
    }
  );
}
function Ti(e) {
  try {
    if (e !== null && typeof e == "object" && nt in e)
      return e[nt];
  } catch {
  }
  return e;
}
function mf(e, t) {
  return Object.is(Ti(e), Ti(t));
}
var gf, yf, bf;
function an(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function yr(e) {
  return (
    /** @type {TemplateNode | null} */
    yf.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Kn(e) {
  return (
    /** @type {TemplateNode | null} */
    bf.call(e)
  );
}
function _f(e, t) {
  return /* @__PURE__ */ yr(e);
}
function N(e, t = !1) {
  {
    var n = /* @__PURE__ */ yr(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Kn(n) : n;
  }
}
function yt(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ Kn(r);
  return r;
}
function wf(e) {
  e.textContent = "";
}
function ss() {
  return !1;
}
function us(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(t ?? os, e, void 0)
  );
}
function Sf(e) {
  var t = q;
  if (t === null)
    return z.f |= wt, e;
  if ((t.f & cn) === 0 && (t.f & ln) === 0)
    throw e;
  br(e, t);
}
function br(e, t) {
  for (; t !== null; ) {
    if ((t.f & Hl) !== 0) {
      if ((t.f & cn) === 0)
        throw e;
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    }
    t = t.parent;
  }
  throw e;
}
const xf = -7169;
function ae(e, t) {
  e.f = e.f & xf | t;
}
function Bo(e) {
  (e.f & He) !== 0 || e.deps === null ? ae(e, fe) : ae(e, Je);
}
function ls(e) {
  if (e !== null)
    for (const t of e)
      (t.f & ye) === 0 || (t.f & It) === 0 || (t.f ^= It, ls(
        /** @type {Derived} */
        t.deps
      ));
}
function Pf(e, t, n) {
  (e.f & xe) !== 0 ? t.add(e) : (e.f & Je) !== 0 && n.add(e), ls(e.deps), ae(e, fe);
}
const nr = /* @__PURE__ */ new Set();
let ee = null, We = null, Ve = [], Dr = null, Pn = !1, sn = null, Cf = 1;
class Rr {
  // for debugging. TODO remove once async is stable
  id = Cf++;
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<(batch: Batch) => void>}
   */
  #t = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #n = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #e = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #r = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #a = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #s = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #o = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #i = /* @__PURE__ */ new Map();
  is_fork = !1;
  #u = !1;
  #l() {
    return this.is_fork || this.#r > 0;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    this.#i.has(t) || this.#i.set(t, { d: [], m: [] });
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   */
  unskip_effect(t) {
    var n = this.#i.get(t);
    if (n) {
      this.#i.delete(t);
      for (var r of n.d)
        ae(r, xe), bt(r);
      for (r of n.m)
        ae(r, Je), bt(r);
    }
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    Ve = [], this.apply();
    var n = sn = [], r = [];
    for (const o of t)
      this.#f(o, n, r);
    if (sn = null, this.#l()) {
      this.#c(r), this.#c(n);
      for (const [o, i] of this.#i)
        vs(o, i);
    } else {
      ee = null;
      for (const o of this.#t) o(this);
      this.#t.clear(), this.#e === 0 && this.#d(), Ai(r), Ai(n), this.#s.clear(), this.#o.clear(), this.#a?.resolve();
    }
    We = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #f(t, n, r) {
    t.f ^= fe;
    for (var o = t.first; o !== null; ) {
      var i = o.f, a = (i & ($e | fn)) !== 0, s = a && (i & fe) !== 0, u = (i & Pe) !== 0, l = s || this.#i.has(o);
      if (!l && o.fn !== null) {
        a ? u || (o.f ^= fe) : (i & ln) !== 0 ? n.push(o) : (i & (rn | Mr)) !== 0 && u ? r.push(o) : vn(o) && (Bt(o), (i & Tt) !== 0 && (this.#o.add(o), u && ae(o, xe)));
        var f = o.first;
        if (f !== null) {
          o = f;
          continue;
        }
      }
      for (; o !== null; ) {
        var c = o.next;
        if (c !== null) {
          o = c;
          break;
        }
        o = o.parent;
      }
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #c(t) {
    for (var n = 0; n < t.length; n += 1)
      Pf(t[n], this.#s, this.#o);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(t, n) {
    n !== le && !this.previous.has(t) && this.previous.set(t, n), (t.f & wt) === 0 && (this.current.set(t, t.v), We?.set(t, t.v));
  }
  activate() {
    ee = this, this.apply();
  }
  deactivate() {
    ee === this && (ee = null, We = null);
  }
  flush() {
    if (Ve.length > 0)
      ee = this, fs();
    else if (this.#e === 0 && !this.is_fork) {
      for (const t of this.#t) t(this);
      this.#t.clear(), this.#d(), this.#a?.resolve();
    }
    this.deactivate();
  }
  discard() {
    for (const t of this.#n) t(this);
    this.#n.clear();
  }
  #d() {
    if (nr.size > 1) {
      this.previous.clear();
      var t = ee, n = We, r = !0;
      for (const i of nr) {
        if (i === this) {
          r = !1;
          continue;
        }
        const a = [];
        for (const [u, l] of this.current) {
          if (i.current.has(u))
            if (r && l !== i.current.get(u))
              i.current.set(u, l);
            else
              continue;
          a.push(u);
        }
        if (a.length === 0)
          continue;
        const s = [...i.current.keys()].filter((u) => !this.current.has(u));
        if (s.length > 0) {
          var o = Ve;
          Ve = [];
          const u = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map();
          for (const f of a)
            cs(f, s, u, l);
          if (Ve.length > 0) {
            ee = i, i.apply();
            for (const f of Ve)
              i.#f(f, [], []);
            i.deactivate();
          }
          Ve = o;
        }
      }
      ee = t, We = n;
    }
    this.#i.clear(), nr.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#e += 1, t && (this.#r += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#e -= 1, t && (this.#r -= 1), !this.#u && (this.#u = !0, on(() => {
      this.#u = !1, this.#l() ? Ve.length > 0 && this.flush() : this.revive();
    }));
  }
  revive() {
    for (const t of this.#s)
      this.#o.delete(t), ae(t, xe), bt(t);
    for (const t of this.#o)
      ae(t, Je), bt(t);
    this.flush();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#t.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#n.add(t);
  }
  settled() {
    return (this.#a ??= Xa()).promise;
  }
  static ensure() {
    if (ee === null) {
      const t = ee = new Rr();
      nr.add(ee), Pn || on(() => {
        ee === t && t.flush();
      });
    }
    return ee;
  }
  apply() {
  }
}
function Ef(e) {
  var t = Pn;
  Pn = !0;
  try {
    for (var n; ; ) {
      if (pf(), Ve.length === 0 && (ee?.flush(), Ve.length === 0))
        return Dr = null, /** @type {T} */
        n;
      fs();
    }
  } finally {
    Pn = t;
  }
}
function fs() {
  var e = null;
  try {
    for (var t = 0; Ve.length > 0; ) {
      var n = Rr.ensure();
      if (t++ > 1e3) {
        var r, o;
        Tf();
      }
      n.process(Ve), St.clear();
    }
  } finally {
    Ve = [], Dr = null, sn = null;
  }
}
function Tf() {
  try {
    Xl();
  } catch (e) {
    br(e, Dr);
  }
}
let lt = null;
function Ai(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (tt | Pe)) === 0 && vn(r) && (lt = /* @__PURE__ */ new Set(), Bt(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Vs(r), lt?.size > 0)) {
        St.clear();
        for (const o of lt) {
          if ((o.f & (tt | Pe)) !== 0) continue;
          const i = [o];
          let a = o.parent;
          for (; a !== null; )
            lt.has(a) && (lt.delete(a), i.push(a)), a = a.parent;
          for (let s = i.length - 1; s >= 0; s--) {
            const u = i[s];
            (u.f & (tt | Pe)) === 0 && Bt(u);
          }
        }
        lt.clear();
      }
    }
    lt = null;
  }
}
function cs(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const o of e.reactions) {
      const i = o.f;
      (i & ye) !== 0 ? cs(
        /** @type {Derived} */
        o,
        t,
        n,
        r
      ) : (i & (No | Tt)) !== 0 && (i & xe) === 0 && ds(o, t, r) && (ae(o, xe), bt(
        /** @type {Effect} */
        o
      ));
    }
}
function ds(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const o of e.deps) {
      if (nn.call(t, o))
        return !0;
      if ((o.f & ye) !== 0 && ds(
        /** @type {Derived} */
        o,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          o,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function bt(e) {
  var t = Dr = e, n = t.b;
  if (n?.is_pending && (e.f & (ln | rn | Mr)) !== 0 && (e.f & cn) === 0) {
    n.defer_effect(e);
    return;
  }
  for (; t.parent !== null; ) {
    t = t.parent;
    var r = t.f;
    if (sn !== null && t === q && (e.f & rn) === 0)
      return;
    if ((r & (fn | $e)) !== 0) {
      if ((r & fe) === 0)
        return;
      t.f ^= fe;
    }
  }
  Ve.push(t);
}
function vs(e, t) {
  if (!((e.f & $e) !== 0 && (e.f & fe) !== 0)) {
    (e.f & xe) !== 0 ? t.d.push(e) : (e.f & Je) !== 0 && t.m.push(e), ae(e, fe);
    for (var n = e.first; n !== null; )
      vs(n, t), n = n.next;
  }
}
function Af(e) {
  let t = 0, n = Nt(0), r;
  return () => {
    jr() && (v(n), Nr(() => (t === 0 && (r = X(() => e(() => Cn(n)))), t += 1, () => {
      on(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, Cn(n));
      });
    })));
  };
}
function Vf(e, t, n, r) {
  const o = Gn() ? Yn : U;
  var i = e.filter((c) => !c.settled);
  if (n.length === 0 && i.length === 0) {
    r(t.map(o));
    return;
  }
  var a = (
    /** @type {Effect} */
    q
  ), s = Of(), u = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((c) => c.promise)) : null;
  function l(c) {
    s();
    try {
      r(c);
    } catch (d) {
      (a.f & tt) === 0 && br(d, a);
    }
    oo();
  }
  if (n.length === 0) {
    u.then(() => l(t.map(o)));
    return;
  }
  function f() {
    s(), Promise.all(n.map((c) => /* @__PURE__ */ Lf(c))).then((c) => l([...t.map(o), ...c])).catch((c) => br(c, a));
  }
  u ? u.then(f) : f();
}
function Of() {
  var e = q, t = z, n = Y, r = ee;
  return function(i = !0) {
    ot(e), rt(t), gr(n), i && r?.activate();
  };
}
function oo(e = !0) {
  ot(null), rt(null), gr(null), e && ee?.deactivate();
}
function Mf() {
  var e = (
    /** @type {Boundary} */
    /** @type {Effect} */
    q.b
  ), t = (
    /** @type {Batch} */
    ee
  ), n = e.is_rendered();
  return e.update_pending_count(1), t.increment(n), () => {
    e.update_pending_count(-1), t.decrement(n);
  };
}
// @__NO_SIDE_EFFECTS__
function Yn(e) {
  var t = ye | xe, n = z !== null && (z.f & ye) !== 0 ? (
    /** @type {Derived} */
    z
  ) : null;
  return q !== null && (q.f |= Lr), {
    ctx: Y,
    deps: null,
    effects: null,
    equals: $a,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      le
    ),
    wv: 0,
    parent: n ?? q,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function Lf(e, t, n) {
  /** @type {Effect | null} */
  q === null && Gl();
  var o = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = Nt(
    /** @type {V} */
    le
  ), a = !z, s = /* @__PURE__ */ new Map();
  return zf(() => {
    var u = Xa();
    o = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, u.reject).finally(oo);
    } catch (d) {
      u.reject(d), oo();
    }
    var l = (
      /** @type {Batch} */
      ee
    );
    if (a) {
      var f = Mf();
      s.get(l)?.reject(Ot), s.delete(l), s.set(l, u);
    }
    const c = (d, h = void 0) => {
      if (l.activate(), h)
        h !== Ot && (i.f |= wt, Ln(i, h));
      else {
        (i.f & wt) !== 0 && (i.f ^= wt), Ln(i, d);
        for (const [p, g] of s) {
          if (s.delete(p), p === l) break;
          g.reject(Ot);
        }
      }
      f && f();
    };
    u.promise.then(c, (d) => c(null, d || "unknown"));
  }), Ir(() => {
    for (const u of s.values())
      u.reject(Ot);
  }), new Promise((u) => {
    function l(f) {
      function c() {
        f === o ? u(i) : l(o);
      }
      f.then(c, c);
    }
    l(o);
  });
}
// @__NO_SIDE_EFFECTS__
function ct(e) {
  const t = /* @__PURE__ */ Yn(e);
  return ys(t), t;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
  const t = /* @__PURE__ */ Yn(e);
  return t.equals = ts, t;
}
function Df(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      ke(
        /** @type {Effect} */
        t[n]
      );
  }
}
function Rf(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & ye) === 0)
      return (t.f & tt) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function Uo(e) {
  var t, n = q;
  ot(Rf(e));
  try {
    e.f &= ~It, Df(e), t = Ss(e);
  } finally {
    ot(n);
  }
  return t;
}
function ps(e) {
  var t = Uo(e);
  if (!e.equals(t) && (e.wv = _s(), (!ee?.is_fork || e.deps === null) && (e.v = t, e.deps === null))) {
    ae(e, fe);
    return;
  }
  Pt || (We !== null ? (jr() || ee?.is_fork) && We.set(e, t) : Bo(e));
}
function jf(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(Ot), t.teardown = be, t.ac = null, Dn(t, 0), zo(t));
}
function hs(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && Bt(t);
}
let io = /* @__PURE__ */ new Set();
const St = /* @__PURE__ */ new Map();
let ms = !1;
function Nt(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: $a,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function ht(e, t) {
  const n = Nt(e);
  return ys(n), n;
}
// @__NO_SIDE_EFFECTS__
function L(e, t = !1, n = !0) {
  const r = Nt(e);
  return t || (r.equals = ts), dn && n && Y !== null && Y.l !== null && (Y.l.s ??= []).push(r), r;
}
function Wt(e, t) {
  return O(
    e,
    X(() => v(e))
  ), t;
}
function O(e, t, n = !1) {
  z !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Xe || (z.f & Ei) !== 0) && Gn() && (z.f & (ye | Tt | No | Ei)) !== 0 && (ze === null || !nn.call(ze, e)) && $l();
  let r = n ? qt(t) : t;
  return Ln(e, r);
}
function Ln(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    Pt ? St.set(e, t) : St.set(e, n), e.v = t;
    var r = Rr.ensure();
    if (r.capture(e, n), (e.f & ye) !== 0) {
      const o = (
        /** @type {Derived} */
        e
      );
      (e.f & xe) !== 0 && Uo(o), Bo(o);
    }
    e.wv = _s(), gs(e, xe), Gn() && q !== null && (q.f & fe) !== 0 && (q.f & ($e | fn)) === 0 && (Ue === null ? Nf([e]) : Ue.push(e)), !r.is_fork && io.size > 0 && !ms && If();
  }
  return t;
}
function If() {
  ms = !1;
  for (const e of io)
    (e.f & fe) !== 0 && ae(e, Je), vn(e) && Bt(e);
  io.clear();
}
function Vi(e, t = 1) {
  var n = v(e), r = t === 1 ? n++ : n--;
  return O(e, n), r;
}
function Cn(e) {
  O(e, e.v + 1);
}
function gs(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = Gn(), o = n.length, i = 0; i < o; i++) {
      var a = n[i], s = a.f;
      if (!(!r && a === q)) {
        var u = (s & xe) === 0;
        if (u && ae(a, t), (s & ye) !== 0) {
          var l = (
            /** @type {Derived} */
            a
          );
          We?.delete(l), (s & It) === 0 && (s & He && (a.f |= It), gs(l, Je));
        } else u && ((s & Tt) !== 0 && lt !== null && lt.add(
          /** @type {Effect} */
          a
        ), bt(
          /** @type {Effect} */
          a
        ));
      }
    }
}
function Ff(e, t) {
  if (t) {
    const n = document.body;
    e.autofocus = !0, on(() => {
      document.activeElement === n && e.focus();
    });
  }
}
function Ho(e) {
  var t = z, n = q;
  rt(null), ot(null);
  try {
    return e();
  } finally {
    rt(t), ot(n);
  }
}
let fr = !1, Pt = !1;
function Oi(e) {
  Pt = e;
}
let z = null, Xe = !1;
function rt(e) {
  z = e;
}
let q = null;
function ot(e) {
  q = e;
}
let ze = null;
function ys(e) {
  z !== null && (ze === null ? ze = [e] : ze.push(e));
}
let Oe = null, Re = 0, Ue = null;
function Nf(e) {
  Ue = e;
}
let bs = 1, Lt = 0, Rt = Lt;
function Mi(e) {
  Rt = e;
}
function _s() {
  return ++bs;
}
function vn(e) {
  var t = e.f;
  if ((t & xe) !== 0)
    return !0;
  if (t & ye && (e.f &= ~It), (t & Je) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, o = 0; o < r; o++) {
      var i = n[o];
      if (vn(
        /** @type {Derived} */
        i
      ) && ps(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
        return !0;
    }
    (t & He) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    We === null && ae(e, fe);
  }
  return !1;
}
function ws(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(ze !== null && nn.call(ze, e)))
    for (var o = 0; o < r.length; o++) {
      var i = r[o];
      (i.f & ye) !== 0 ? ws(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (n ? ae(i, xe) : (i.f & fe) !== 0 && ae(i, Je), bt(
        /** @type {Effect} */
        i
      ));
    }
}
function Ss(e) {
  var t = Oe, n = Re, r = Ue, o = z, i = ze, a = Y, s = Xe, u = Rt, l = e.f;
  Oe = /** @type {null | Value[]} */
  null, Re = 0, Ue = null, z = (l & ($e | fn)) === 0 ? e : null, ze = null, gr(e.ctx), Xe = !1, Rt = ++Lt, e.ac !== null && (Ho(() => {
    e.ac.abort(Ot);
  }), e.ac = null);
  try {
    e.f |= ro;
    var f = (
      /** @type {Function} */
      e.fn
    ), c = f();
    e.f |= cn;
    var d = e.deps, h = ee?.is_fork;
    if (Oe !== null) {
      var p;
      if (h || Dn(e, Re), d !== null && Re > 0)
        for (d.length = Re + Oe.length, p = 0; p < Oe.length; p++)
          d[Re + p] = Oe[p];
      else
        e.deps = d = Oe;
      if (jr() && (e.f & He) !== 0)
        for (p = Re; p < d.length; p++)
          (d[p].reactions ??= []).push(e);
    } else !h && d !== null && Re < d.length && (Dn(e, Re), d.length = Re);
    if (Gn() && Ue !== null && !Xe && d !== null && (e.f & (ye | Je | xe)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      Ue.length; p++)
        ws(
          Ue[p],
          /** @type {Effect} */
          e
        );
    if (o !== null && o !== e) {
      if (Lt++, o.deps !== null)
        for (let g = 0; g < n; g += 1)
          o.deps[g].rv = Lt;
      if (t !== null)
        for (const g of t)
          g.rv = Lt;
      Ue !== null && (r === null ? r = Ue : r.push(.../** @type {Source[]} */
      Ue));
    }
    return (e.f & wt) !== 0 && (e.f ^= wt), c;
  } catch (g) {
    return Sf(g);
  } finally {
    e.f ^= ro, Oe = t, Re = n, Ue = r, z = o, ze = i, gr(a), Xe = s, Rt = u;
  }
}
function Bf(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = Fl.call(n, e);
    if (r !== -1) {
      var o = n.length - 1;
      o === 0 ? n = t.reactions = null : (n[r] = n[o], n.pop());
    }
  }
  if (n === null && (t.f & ye) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Oe === null || !nn.call(Oe, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    (i.f & He) !== 0 && (i.f ^= He, i.f &= ~It), Bo(i), jf(i), Dn(i, 0);
  }
}
function Dn(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Bf(e, n[r]);
}
function Bt(e) {
  var t = e.f;
  if ((t & tt) === 0) {
    ae(e, fe);
    var n = q, r = fr;
    q = e, fr = !0;
    try {
      (t & (Tt | Mr)) !== 0 ? kf(e) : zo(e), As(e);
      var o = Ss(e);
      e.teardown = typeof o == "function" ? o : null, e.wv = bs;
      var i;
    } finally {
      fr = r, q = n;
    }
  }
}
async function Ut() {
  await Promise.resolve(), Ef();
}
function v(e) {
  var t = e.f, n = (t & ye) !== 0;
  if (z !== null && !Xe) {
    var r = q !== null && (q.f & tt) !== 0;
    if (!r && (ze === null || !nn.call(ze, e))) {
      var o = z.deps;
      if ((z.f & ro) !== 0)
        e.rv < Lt && (e.rv = Lt, Oe === null && o !== null && o[Re] === e ? Re++ : Oe === null ? Oe = [e] : Oe.push(e));
      else {
        (z.deps ??= []).push(e);
        var i = e.reactions;
        i === null ? e.reactions = [z] : nn.call(i, z) || i.push(z);
      }
    }
  }
  if (Pt && St.has(e))
    return St.get(e);
  if (n) {
    var a = (
      /** @type {Derived} */
      e
    );
    if (Pt) {
      var s = a.v;
      return ((a.f & fe) === 0 && a.reactions !== null || Ps(a)) && (s = Uo(a)), St.set(a, s), s;
    }
    var u = (a.f & He) === 0 && !Xe && z !== null && (fr || (z.f & He) !== 0), l = (a.f & cn) === 0;
    vn(a) && (u && (a.f |= He), ps(a)), u && !l && (hs(a), xs(a));
  }
  if (We?.has(e))
    return We.get(e);
  if ((e.f & wt) !== 0)
    throw e.v;
  return e.v;
}
function xs(e) {
  if (e.f |= He, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & ye) !== 0 && (t.f & He) === 0 && (hs(
        /** @type {Derived} */
        t
      ), xs(
        /** @type {Derived} */
        t
      ));
}
function Ps(e) {
  if (e.v === le) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (St.has(t) || (t.f & ye) !== 0 && Ps(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function X(e) {
  var t = Xe;
  try {
    return Xe = !0, e();
  } finally {
    Xe = t;
  }
}
function V(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (nt in e)
      ao(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && nt in n && ao(n);
      }
  }
}
function ao(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        ao(e[r], t);
      } catch {
      }
    const n = Fo(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = Wa(n);
      for (let o in r) {
        const i = r[o].get;
        if (i)
          try {
            i.call(e);
          } catch {
          }
      }
    }
  }
}
function Cs(e) {
  q === null && (z === null && Wl(), ql()), Pt && Yl();
}
function Uf(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function pt(e, t) {
  var n = q;
  n !== null && (n.f & Pe) !== 0 && (e |= Pe);
  var r = {
    ctx: Y,
    deps: null,
    nodes: null,
    f: e | xe | He,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  }, o = r;
  if ((e & ln) !== 0)
    sn !== null ? sn.push(r) : bt(r);
  else if (t !== null) {
    try {
      Bt(r);
    } catch (a) {
      throw ke(r), a;
    }
    o.deps === null && o.teardown === null && o.nodes === null && o.first === o.last && // either `null`, or a singular child
    (o.f & Lr) === 0 && (o = o.first, (e & Tt) !== 0 && (e & xt) !== 0 && o !== null && (o.f |= xt));
  }
  if (o !== null && (o.parent = n, n !== null && Uf(o, n), z !== null && (z.f & ye) !== 0 && (e & fn) === 0)) {
    var i = (
      /** @type {Derived} */
      z
    );
    (i.effects ??= []).push(o);
  }
  return r;
}
function jr() {
  return z !== null && !Xe;
}
function Ir(e) {
  const t = pt(rn, null);
  return ae(t, fe), t.teardown = e, t;
}
function Ze(e) {
  Cs();
  var t = (
    /** @type {Effect} */
    q.f
  ), n = !z && (t & $e) !== 0 && (t & cn) === 0;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      Y
    );
    (r.e ??= []).push(e);
  } else
    return Es(e);
}
function Es(e) {
  return pt(ln | Za, e);
}
function Hf(e) {
  return Cs(), pt(rn | Za, e);
}
function Fr(e) {
  return pt(ln, e);
}
function I(e, t) {
  var n = (
    /** @type {ComponentContextLegacy} */
    Y
  ), r = { effect: null, ran: !1, deps: e };
  n.l.$.push(r), r.effect = Nr(() => {
    e(), !r.ran && (r.ran = !0, X(t));
  });
}
function oe() {
  var e = (
    /** @type {ComponentContextLegacy} */
    Y
  );
  Nr(() => {
    for (var t of e.l.$) {
      t.deps();
      var n = t.effect;
      (n.f & fe) !== 0 && n.deps !== null && ae(n, Je), vn(n) && Bt(n), t.ran = !1;
    }
  });
}
function zf(e) {
  return pt(No | Lr, e);
}
function Nr(e, t = 0) {
  return pt(rn | t, e);
}
function qn(e, t = 0) {
  var n = pt(Tt | t, e);
  return n;
}
function Ts(e, t = 0) {
  var n = pt(Mr | t, e);
  return n;
}
function Ht(e) {
  return pt($e | Lr, e);
}
function As(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Pt, r = z;
    Oi(!0), rt(null);
    try {
      t.call(null);
    } finally {
      Oi(n), rt(r);
    }
  }
}
function zo(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const o = n.ac;
    o !== null && Ho(() => {
      o.abort(Ot);
    });
    var r = n.next;
    (n.f & fn) !== 0 ? n.parent = null : ke(n, t), n = r;
  }
}
function kf(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & $e) === 0 && ke(t), t = n;
  }
}
function ke(e, t = !0) {
  var n = !1;
  (t || (e.f & zl) !== 0) && e.nodes !== null && e.nodes.end !== null && (Gf(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), zo(e, t && !n), Dn(e, 0), ae(e, tt);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const i of r)
      i.stop();
  As(e);
  var o = e.parent;
  o !== null && o.first !== null && Vs(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = null;
}
function Gf(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Kn(e);
    e.remove(), e = n;
  }
}
function Vs(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function ko(e, t, n = !0) {
  var r = [];
  Os(e, r, !0);
  var o = () => {
    n && ke(e), t && t();
  }, i = r.length;
  if (i > 0) {
    var a = () => --i || o();
    for (var s of r)
      s.out(a);
  } else
    o();
}
function Os(e, t, n) {
  if ((e.f & Pe) === 0) {
    e.f ^= Pe;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const s of r)
        (s.is_global || n) && t.push(s);
    for (var o = e.first; o !== null; ) {
      var i = o.next, a = (o.f & xt) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (o.f & $e) !== 0 && (e.f & Tt) !== 0;
      Os(o, t, a ? n : !1), o = i;
    }
  }
}
function Go(e) {
  Ms(e, !0);
}
function Ms(e, t) {
  if ((e.f & Pe) !== 0) {
    e.f ^= Pe;
    for (var n = e.first; n !== null; ) {
      var r = n.next, o = (n.f & xt) !== 0 || (n.f & $e) !== 0;
      Ms(n, o ? t : !1), n = r;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const a of i)
        (a.is_global || t) && a.in();
  }
}
function Ls(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var o = n === r ? null : /* @__PURE__ */ Kn(n);
      t.append(n), n = o;
    }
}
function Kf(e) {
  return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
const Yf = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function qf(e) {
  return Yf.includes(e);
}
const Wf = {
  // no `class: 'className'` because we handle that separately
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function Xf(e) {
  return e = e.toLowerCase(), Wf[e] ?? e;
}
const Sn = /* @__PURE__ */ Symbol("events"), Zf = /* @__PURE__ */ new Set(), Jf = /* @__PURE__ */ new Set();
function Qf(e, t, n, r = {}) {
  function o(i) {
    if (r.capture || tc.call(t, i), !i.cancelBubble)
      return Ho(() => n?.call(this, i));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? on(() => {
    t.addEventListener(e, o, r);
  }) : t.addEventListener(e, o, r), o;
}
function $f(e, t, n) {
  (t[Sn] ??= {})[e] = n;
}
function ec(e) {
  for (var t = 0; t < e.length; t++)
    Zf.add(e[t]);
  for (var n of Jf)
    n(e);
}
let Li = null;
function tc(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, o = e.composedPath?.() || [], i = (
    /** @type {null | Element} */
    o[0] || e.target
  );
  Li = e;
  var a = 0, s = Li === e && e[Sn];
  if (s) {
    var u = o.indexOf(s);
    if (u !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Sn] = t;
      return;
    }
    var l = o.indexOf(t);
    if (l === -1)
      return;
    u <= l && (a = u);
  }
  if (i = /** @type {Element} */
  o[a] || e.target, i !== t) {
    qa(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || n;
      }
    });
    var f = z, c = q;
    rt(null), ot(null);
    try {
      for (var d, h = []; i !== null; ) {
        var p = i.assignedSlot || i.parentNode || /** @type {any} */
        i.host || null;
        try {
          var g = i[Sn]?.[r];
          g != null && (!/** @type {any} */
          i.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === i) && g.call(i, e);
        } catch (y) {
          d ? h.push(y) : d = y;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        i = p;
      }
      if (d) {
        for (let y of h)
          queueMicrotask(() => {
            throw y;
          });
        throw d;
      }
    } finally {
      e[Sn] = t, delete e.currentTarget, rt(f), ot(c);
    }
  }
}
const nc = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function rc(e) {
  return (
    /** @type {string} */
    nc?.createHTML(e) ?? e
  );
}
function oc(e) {
  var t = us("template");
  return t.innerHTML = rc(e.replaceAll("<!>", "<!---->")), t.content;
}
function _r(e, t) {
  var n = (
    /** @type {Effect} */
    q
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Wn(e, t) {
  var n = (t & lf) !== 0, r = (t & ff) !== 0, o, i = !e.startsWith("<!>");
  return () => {
    o === void 0 && (o = oc(i ? e : "<!>" + e), n || (o = /** @type {TemplateNode} */
    /* @__PURE__ */ yr(o)));
    var a = (
      /** @type {TemplateNode} */
      r || gf ? document.importNode(o, !0) : o.cloneNode(!0)
    );
    if (n) {
      var s = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ yr(a)
      ), u = (
        /** @type {TemplateNode} */
        a.lastChild
      );
      _r(s, u);
    } else
      _r(a, a);
    return a;
  };
}
function H() {
  var e = document.createDocumentFragment(), t = document.createComment(""), n = an();
  return e.append(t, n), _r(t, n), e;
}
function F(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
class Br {
  /** @type {TemplateNode} */
  anchor;
  /** @type {Map<Batch, Key>} */
  #t = /* @__PURE__ */ new Map();
  /**
   * Map of keys to effects that are currently rendered in the DOM.
   * These effects are visible and actively part of the document tree.
   * Example:
   * ```
   * {#if condition}
   * 	foo
   * {:else}
   * 	bar
   * {/if}
   * ```
   * Can result in the entries `true->Effect` and `false->Effect`
   * @type {Map<Key, Effect>}
   */
  #n = /* @__PURE__ */ new Map();
  /**
   * Similar to #onscreen with respect to the keys, but contains branches that are not yet
   * in the DOM, because their insertion is deferred.
   * @type {Map<Key, Branch>}
   */
  #e = /* @__PURE__ */ new Map();
  /**
   * Keys of effects that are currently outroing
   * @type {Set<Key>}
   */
  #r = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #a = !0;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    this.anchor = t, this.#a = n;
  }
  /**
   * @param {Batch} batch
   */
  #s = (t) => {
    if (this.#t.has(t)) {
      var n = (
        /** @type {Key} */
        this.#t.get(t)
      ), r = this.#n.get(n);
      if (r)
        Go(r), this.#r.delete(n);
      else {
        var o = this.#e.get(n);
        o && (o.effect.f & Pe) === 0 && (this.#n.set(n, o.effect), this.#e.delete(n), o.fragment.lastChild.remove(), this.anchor.before(o.fragment), r = o.effect);
      }
      for (const [i, a] of this.#t) {
        if (this.#t.delete(i), i === t)
          break;
        const s = this.#e.get(a);
        s && (ke(s.effect), this.#e.delete(a));
      }
      for (const [i, a] of this.#n) {
        if (i === n || this.#r.has(i) || (a.f & Pe) !== 0) continue;
        const s = () => {
          if (Array.from(this.#t.values()).includes(i)) {
            var l = document.createDocumentFragment();
            Ls(a, l), l.append(an()), this.#e.set(i, { effect: a, fragment: l });
          } else
            ke(a);
          this.#r.delete(i), this.#n.delete(i);
        };
        this.#a || !r ? (this.#r.add(i), ko(a, s, !1)) : s();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #o = (t) => {
    this.#t.delete(t);
    const n = Array.from(this.#t.values());
    for (const [r, o] of this.#e)
      n.includes(r) || (ke(o.effect), this.#e.delete(r));
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      ee
    ), o = ss();
    if (n && !this.#n.has(t) && !this.#e.has(t))
      if (o) {
        var i = document.createDocumentFragment(), a = an();
        i.append(a), this.#e.set(t, {
          effect: Ht(() => n(a)),
          fragment: i
        });
      } else
        this.#n.set(
          t,
          Ht(() => n(this.anchor))
        );
    if (this.#t.set(r, t), o) {
      for (const [s, u] of this.#n)
        s === t ? r.unskip_effect(u) : r.skip_effect(u);
      for (const [s, u] of this.#e)
        s === t ? r.unskip_effect(u.effect) : r.skip_effect(u.effect);
      r.oncommit(this.#s), r.ondiscard(this.#o);
    } else
      this.#s(r);
  }
}
function Ko(e, t, n = !1) {
  var r = new Br(e), o = n ? xt : 0;
  function i(a, s) {
    r.ensure(a, s);
  }
  qn(() => {
    var a = !1;
    t((s, u = 0) => {
      a = !0, i(u, s);
    }), a || i(-1, null);
  }, o);
}
function ic(e, t, n) {
  for (var r = [], o = t.length, i, a = t.length, s = 0; s < o; s++) {
    let c = t[s];
    ko(
      c,
      () => {
        if (i) {
          if (i.pending.delete(c), i.done.add(c), i.pending.size === 0) {
            var d = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            so(e, Io(i.done)), d.delete(i), d.size === 0 && (e.outrogroups = null);
          }
        } else
          a -= 1;
      },
      !1
    );
  }
  if (a === 0) {
    var u = r.length === 0 && n !== null;
    if (u) {
      var l = (
        /** @type {Element} */
        n
      ), f = (
        /** @type {Element} */
        l.parentNode
      );
      wf(f), f.append(l), e.items.clear();
    }
    so(e, t, !u);
  } else
    i = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(i);
}
function so(e, t, n = !0) {
  var r;
  if (e.pending.size > 0) {
    r = /* @__PURE__ */ new Set();
    for (const a of e.pending.values())
      for (const s of a)
        r.add(
          /** @type {EachItem} */
          e.items.get(s).e
        );
  }
  for (var o = 0; o < t.length; o++) {
    var i = t[o];
    if (r?.has(i)) {
      i.f |= ft;
      const a = document.createDocumentFragment();
      Ls(i, a);
    } else
      ke(t[o], n);
  }
}
var Di;
function Yo(e, t, n, r, o, i = null) {
  var a = e, s = /* @__PURE__ */ new Map(), u = null, l = /* @__PURE__ */ U(() => {
    var m = n();
    return jo(m) ? m : m == null ? [] : Io(m);
  }), f, c = /* @__PURE__ */ new Map(), d = !0;
  function h(m) {
    (y.effect.f & tt) === 0 && (y.pending.delete(m), y.fallback = u, ac(y, f, a, t, r), u !== null && (f.length === 0 ? (u.f & ft) === 0 ? Go(u) : (u.f ^= ft, xn(u, null, a)) : ko(u, () => {
      u = null;
    })));
  }
  function p(m) {
    y.pending.delete(m);
  }
  var g = qn(() => {
    f = /** @type {V[]} */
    v(l);
    for (var m = f.length, b = /* @__PURE__ */ new Set(), _ = (
      /** @type {Batch} */
      ee
    ), w = ss(), C = 0; C < m; C += 1) {
      var x = f[C], S = r(x, C), A = d ? null : s.get(S);
      A ? (A.v && Ln(A.v, x), A.i && Ln(A.i, C), w && _.unskip_effect(A.e)) : (A = sc(
        s,
        d ? a : Di ??= an(),
        x,
        S,
        C,
        o,
        t,
        n
      ), d || (A.e.f |= ft), s.set(S, A)), b.add(S);
    }
    if (m === 0 && i && !u && (d ? u = Ht(() => i(a)) : (u = Ht(() => i(Di ??= an())), u.f |= ft)), m > b.size && Kl(), !d)
      if (c.set(_, b), w) {
        for (const [B, R] of s)
          b.has(B) || _.skip_effect(R.e);
        _.oncommit(h), _.ondiscard(p);
      } else
        h(_);
    v(l);
  }), y = { effect: g, items: s, pending: c, outrogroups: null, fallback: u };
  d = !1;
}
function yn(e) {
  for (; e !== null && (e.f & $e) === 0; )
    e = e.next;
  return e;
}
function ac(e, t, n, r, o) {
  var i = t.length, a = e.items, s = yn(e.effect.first), u, l = null, f = [], c = [], d, h, p, g;
  for (g = 0; g < i; g += 1) {
    if (d = t[g], h = o(d, g), p = /** @type {EachItem} */
    a.get(h).e, e.outrogroups !== null)
      for (const A of e.outrogroups)
        A.pending.delete(p), A.done.delete(p);
    if ((p.f & ft) !== 0)
      if (p.f ^= ft, p === s)
        xn(p, null, n);
      else {
        var y = l ? l.next : s;
        p === e.effect.last && (e.effect.last = p.prev), p.prev && (p.prev.next = p.next), p.next && (p.next.prev = p.prev), mt(e, l, p), mt(e, p, y), xn(p, y, n), l = p, f = [], c = [], s = yn(l.next);
        continue;
      }
    if ((p.f & Pe) !== 0 && Go(p), p !== s) {
      if (u !== void 0 && u.has(p)) {
        if (f.length < c.length) {
          var m = c[0], b;
          l = m.prev;
          var _ = f[0], w = f[f.length - 1];
          for (b = 0; b < f.length; b += 1)
            xn(f[b], m, n);
          for (b = 0; b < c.length; b += 1)
            u.delete(c[b]);
          mt(e, _.prev, w.next), mt(e, l, _), mt(e, w, m), s = m, l = w, g -= 1, f = [], c = [];
        } else
          u.delete(p), xn(p, s, n), mt(e, p.prev, p.next), mt(e, p, l === null ? e.effect.first : l.next), mt(e, l, p), l = p;
        continue;
      }
      for (f = [], c = []; s !== null && s !== p; )
        (u ??= /* @__PURE__ */ new Set()).add(s), c.push(s), s = yn(s.next);
      if (s === null)
        continue;
    }
    (p.f & ft) === 0 && f.push(p), l = p, s = yn(p.next);
  }
  if (e.outrogroups !== null) {
    for (const A of e.outrogroups)
      A.pending.size === 0 && (so(e, Io(A.done)), e.outrogroups?.delete(A));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (s !== null || u !== void 0) {
    var C = [];
    if (u !== void 0)
      for (p of u)
        (p.f & Pe) === 0 && C.push(p);
    for (; s !== null; )
      (s.f & Pe) === 0 && s !== e.fallback && C.push(s), s = yn(s.next);
    var x = C.length;
    if (x > 0) {
      var S = null;
      ic(e, C, S);
    }
  }
}
function sc(e, t, n, r, o, i, a, s) {
  var u = (a & tf) !== 0 ? (a & rf) === 0 ? /* @__PURE__ */ L(n, !1, !1) : Nt(n) : null, l = (a & nf) !== 0 ? Nt(o) : null;
  return {
    v: u,
    i: l,
    e: Ht(() => (i(t, u ?? n, l ?? o, s), () => {
      e.delete(r);
    }))
  };
}
function xn(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, o = e.nodes.end, i = t && (t.f & ft) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var a = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Kn(r)
      );
      if (i.before(r), r === o)
        return;
      r = a;
    }
}
function mt(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function $(e, t, n, r, o) {
  var i = t.$$slots?.[n], a = !1;
  i === !0 && (i = t.children, a = !0), i === void 0 || i(e, a ? () => r : r);
}
function pn(e, t, ...n) {
  var r = new Br(e);
  qn(() => {
    const o = t() ?? null;
    r.ensure(o, o && ((i) => o(i, ...n)));
  }, xt);
}
function qo(e, t, n) {
  var r = new Br(e);
  qn(() => {
    var o = t() ?? null;
    r.ensure(o, o && ((i) => n(i, o)));
  }, xt);
}
function uc(e, t, n, r, o, i) {
  var a = null, s = (
    /** @type {TemplateNode} */
    e
  ), u = new Br(s, !1);
  qn(() => {
    const l = t() || null;
    var f = o ? o() : l === "svg" ? cf : void 0;
    if (l === null) {
      u.ensure(null, null);
      return;
    }
    return u.ensure(l, (c) => {
      if (l) {
        if (a = us(l, f), _r(a, a), r) {
          var d = a.appendChild(an());
          r(a, d);
        }
        q.nodes.end = a, c.before(a);
      }
    }), () => {
    };
  }, xt), Ir(() => {
  });
}
function Ds(e, t, n) {
  Fr(() => {
    var r = X(() => t(e, n?.()) || {});
    if (r?.destroy)
      return () => (
        /** @type {Function} */
        r.destroy()
      );
  });
}
function lc(e, t) {
  var n = void 0, r;
  Ts(() => {
    n !== (n = t()) && (r && (ke(r), r = null), n && (r = Ht(() => {
      Fr(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
function Rs(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = Rs(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function fc() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Rs(e)) && (r && (r += " "), r += t);
  return r;
}
function cc(e) {
  return typeof e == "object" ? fc(e) : e ?? "";
}
const Ri = [...` 	
\r\f \v\uFEFF`];
function dc(e, t, n) {
  var r = e == null ? "" : "" + e;
  if (n) {
    for (var o of Object.keys(n))
      if (n[o])
        r = r ? r + " " + o : o;
      else if (r.length)
        for (var i = o.length, a = 0; (a = r.indexOf(o, a)) >= 0; ) {
          var s = a + i;
          (a === 0 || Ri.includes(r[a - 1])) && (s === r.length || Ri.includes(r[s])) ? r = (a === 0 ? "" : r.substring(0, a)) + r.substring(s + 1) : a = s;
        }
  }
  return r === "" ? null : r;
}
function ji(e, t = !1) {
  var n = t ? " !important;" : ";", r = "";
  for (var o of Object.keys(e)) {
    var i = e[o];
    i != null && i !== "" && (r += " " + o + ": " + i + n);
  }
  return r;
}
function qr(e) {
  return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function vc(e, t) {
  if (t) {
    var n = "", r, o;
    if (Array.isArray(t) ? (r = t[0], o = t[1]) : r = t, e) {
      e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var i = !1, a = 0, s = !1, u = [];
      r && u.push(...Object.keys(r).map(qr)), o && u.push(...Object.keys(o).map(qr));
      var l = 0, f = -1;
      const g = e.length;
      for (var c = 0; c < g; c++) {
        var d = e[c];
        if (s ? d === "/" && e[c - 1] === "*" && (s = !1) : i ? i === d && (i = !1) : d === "/" && e[c + 1] === "*" ? s = !0 : d === '"' || d === "'" ? i = d : d === "(" ? a++ : d === ")" && a--, !s && i === !1 && a === 0) {
          if (d === ":" && f === -1)
            f = c;
          else if (d === ";" || c === g - 1) {
            if (f !== -1) {
              var h = qr(e.substring(l, f).trim());
              if (!u.includes(h)) {
                d !== ";" && c++;
                var p = e.substring(l, c).trim();
                n += " " + p + ";";
              }
            }
            l = c + 1, f = -1;
          }
        }
      }
    }
    return r && (n += ji(r)), o && (n += ji(o, !0)), n = n.trim(), n === "" ? null : n;
  }
  return e == null ? null : String(e);
}
function pc(e, t, n, r, o, i) {
  var a = e.__className;
  if (a !== n || a === void 0) {
    var s = dc(n, r, i);
    s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s), e.__className = n;
  } else if (i && o !== i)
    for (var u in i) {
      var l = !!i[u];
      (o == null || l !== !!o[u]) && e.classList.toggle(u, l);
    }
  return i;
}
function Wr(e, t = {}, n, r) {
  for (var o in n) {
    var i = n[o];
    t[o] !== i && (n[o] == null ? e.style.removeProperty(o) : e.style.setProperty(o, i, r));
  }
}
function hc(e, t, n, r) {
  var o = e.__style;
  if (o !== t) {
    var i = vc(t, r);
    i == null ? e.removeAttribute("style") : e.style.cssText = i, e.__style = t;
  } else r && (Array.isArray(r) ? (Wr(e, n?.[0], r[0]), Wr(e, n?.[1], r[1], "important")) : Wr(e, n, r));
  return r;
}
function uo(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!jo(t))
      return hf();
    for (var r of e.options)
      r.selected = t.includes(Ii(r));
    return;
  }
  for (r of e.options) {
    var o = Ii(r);
    if (mf(o, t)) {
      r.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function mc(e) {
  var t = new MutationObserver(() => {
    uo(e, e.__value);
  });
  t.observe(e, {
    // Listen to option element changes
    childList: !0,
    subtree: !0,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: !0,
    attributeFilter: ["value"]
  }), Ir(() => {
    t.disconnect();
  });
}
function Ii(e) {
  return "__value" in e ? e.__value : e.value;
}
const bn = /* @__PURE__ */ Symbol("class"), _n = /* @__PURE__ */ Symbol("style"), js = /* @__PURE__ */ Symbol("is custom element"), Is = /* @__PURE__ */ Symbol("is html"), gc = Qa ? "option" : "OPTION", yc = Qa ? "select" : "SELECT";
function bc(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Fi(e, t, n, r) {
  var o = Ns(e);
  o[t] !== (o[t] = n) && (t === "loading" && (e[kl] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Bs(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function _c(e, t, n, r, o = !1, i = !1) {
  var a = Ns(e), s = a[js], u = !a[Is], l = t || {}, f = e.nodeName === gc;
  for (var c in t)
    c in n || (n[c] = null);
  n.class ? n.class = cc(n.class) : n[bn] && (n.class = null), n[_n] && (n.style ??= null);
  var d = Bs(e);
  for (const _ in n) {
    let w = n[_];
    if (f && _ === "value" && w == null) {
      e.value = e.__value = "", l[_] = w;
      continue;
    }
    if (_ === "class") {
      var h = e.namespaceURI === "http://www.w3.org/1999/xhtml";
      pc(e, h, w, r, t?.[bn], n[bn]), l[_] = w, l[bn] = n[bn];
      continue;
    }
    if (_ === "style") {
      hc(e, w, t?.[_n], n[_n]), l[_] = w, l[_n] = n[_n];
      continue;
    }
    var p = l[_];
    if (!(w === p && !(w === void 0 && e.hasAttribute(_)))) {
      l[_] = w;
      var g = _[0] + _[1];
      if (g !== "$$")
        if (g === "on") {
          const C = {}, x = "$$" + _;
          let S = _.slice(2);
          var y = qf(S);
          if (Kf(S) && (S = S.slice(0, -7), C.capture = !0), !y && p) {
            if (w != null) continue;
            e.removeEventListener(S, l[x], C), l[x] = null;
          }
          if (y)
            $f(S, e, w), ec([S]);
          else if (w != null) {
            let A = function(B) {
              l[_].call(this, B);
            };
            l[x] = Qf(S, e, A, C);
          }
        } else if (_ === "style")
          Fi(e, _, w);
        else if (_ === "autofocus")
          Ff(
            /** @type {HTMLElement} */
            e,
            !!w
          );
        else if (!s && (_ === "__value" || _ === "value" && w != null))
          e.value = e.__value = w;
        else if (_ === "selected" && f)
          bc(
            /** @type {HTMLOptionElement} */
            e,
            w
          );
        else {
          var m = _;
          u || (m = Xf(m));
          var b = m === "defaultValue" || m === "defaultChecked";
          if (w == null && !s && !b)
            if (a[_] = null, m === "value" || m === "checked") {
              let C = (
                /** @type {HTMLInputElement} */
                e
              );
              const x = t === void 0;
              if (m === "value") {
                let S = C.defaultValue;
                C.removeAttribute(m), C.defaultValue = S, C.value = C.__value = x ? S : null;
              } else {
                let S = C.defaultChecked;
                C.removeAttribute(m), C.defaultChecked = S, C.checked = x ? S : !1;
              }
            } else
              e.removeAttribute(_);
          else b || d.includes(m) && (s || typeof w != "string") ? (e[m] = w, m in a && (a[m] = le)) : typeof w != "function" && Fi(e, m, w);
        }
    }
  }
  return l;
}
function Fs(e, t, n = [], r = [], o = [], i, a = !1, s = !1) {
  Vf(o, n, r, (u) => {
    var l = void 0, f = {}, c = e.nodeName === yc, d = !1;
    if (Ts(() => {
      var p = t(...u.map(v)), g = _c(
        e,
        l,
        p,
        i,
        a,
        s
      );
      d && c && "value" in p && uo(
        /** @type {HTMLSelectElement} */
        e,
        p.value
      );
      for (let m of Object.getOwnPropertySymbols(f))
        p[m] || ke(f[m]);
      for (let m of Object.getOwnPropertySymbols(p)) {
        var y = p[m];
        m.description === df && (!l || y !== l[m]) && (f[m] && ke(f[m]), f[m] = Ht(() => lc(e, () => y))), g[m] = y;
      }
      l = g;
    }), c) {
      var h = (
        /** @type {HTMLSelectElement} */
        e
      );
      Fr(() => {
        uo(
          h,
          /** @type {Record<string | symbol, any>} */
          l.value,
          !0
        ), mc(h);
      });
    }
    d = !0;
  });
}
function Ns(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    e.__attributes ??= {
      [js]: e.nodeName.includes("-"),
      [Is]: e.namespaceURI === os
    }
  );
}
var Ni = /* @__PURE__ */ new Map();
function Bs(e) {
  var t = e.getAttribute("is") || e.nodeName, n = Ni.get(t);
  if (n) return n;
  Ni.set(t, n = []);
  for (var r, o = e, i = Element.prototype; i !== o; ) {
    r = Wa(o);
    for (var a in r)
      r[a].set && n.push(a);
    o = Fo(o);
  }
  return n;
}
function Bi(e, t) {
  return e === t || e?.[nt] === t;
}
function wc(e = {}, t, n, r) {
  return Fr(() => {
    var o, i;
    return Nr(() => {
      o = i, i = [], X(() => {
        e !== n(...i) && (t(e, ...i), o && Bi(n(...o), e) && t(null, ...o));
      });
    }), () => {
      on(() => {
        i && Bi(n(...i), e) && t(null, ...i);
      });
    };
  }), e;
}
function Q(e = !1) {
  const t = (
    /** @type {ComponentContextLegacy} */
    Y
  ), n = t.l.u;
  if (!n) return;
  let r = () => V(t.s);
  if (e) {
    let o = 0, i = (
      /** @type {Record<string, any>} */
      {}
    );
    const a = /* @__PURE__ */ Yn(() => {
      let s = !1;
      const u = t.s;
      for (const l in u)
        u[l] !== i[l] && (i[l] = u[l], s = !0);
      return s && o++, o;
    });
    r = () => v(a);
  }
  n.b.length && Hf(() => {
    Ui(t, r), mr(n.b);
  }), Ze(() => {
    const o = X(() => n.m.map(Ul));
    return () => {
      for (const i of o)
        typeof i == "function" && i();
    };
  }), n.a.length && Ze(() => {
    Ui(t, r), mr(n.a);
  });
}
function Ui(e, t) {
  if (e.l.s)
    for (const n of e.l.s) v(n);
  t();
}
let rr = !1, lo = /* @__PURE__ */ Symbol();
function me(e, t, n) {
  const r = n[t] ??= {
    store: null,
    source: /* @__PURE__ */ L(void 0),
    unsubscribe: be
  };
  if (r.store !== e && !(lo in n))
    if (r.unsubscribe(), r.store = e ?? null, e == null)
      r.source.v = void 0, r.unsubscribe = be;
    else {
      var o = !0;
      r.unsubscribe = Zo(e, (i) => {
        o ? r.source.v = i : O(r.source, i);
      }), o = !1;
    }
  return e && lo in n ? se(e) : v(r.source);
}
function it() {
  const e = {};
  function t() {
    Ir(() => {
      for (var n in e)
        e[n].unsubscribe();
      qa(e, lo, {
        enumerable: !1,
        value: !0
      });
    });
  }
  return [e, t];
}
function Sc(e) {
  var t = rr;
  try {
    return rr = !1, [e(), rr];
  } finally {
    rr = t;
  }
}
const xc = {
  get(e, t) {
    if (!e.exclude.includes(t))
      return v(e.version), t in e.special ? e.special[t]() : e.props[t];
  },
  set(e, t, n) {
    if (!(t in e.special)) {
      var r = q;
      try {
        ot(e.parent_effect), e.special[t] = E(
          {
            get [t]() {
              return e.props[t];
            }
          },
          /** @type {string} */
          t,
          rs
        );
      } finally {
        ot(r);
      }
    }
    return e.special[t](n), Vi(e.version), !0;
  },
  getOwnPropertyDescriptor(e, t) {
    if (!e.exclude.includes(t) && t in e.props)
      return {
        enumerable: !0,
        configurable: !0,
        value: e.props[t]
      };
  },
  deleteProperty(e, t) {
    return e.exclude.includes(t) || (e.exclude.push(t), Vi(e.version)), !0;
  },
  has(e, t) {
    return e.exclude.includes(t) ? !1 : t in e.props;
  },
  ownKeys(e) {
    return Reflect.ownKeys(e.props).filter((t) => !e.exclude.includes(t));
  }
};
function Ct(e, t) {
  return new Proxy(
    {
      props: e,
      exclude: t,
      special: {},
      version: Nt(0),
      // TODO this is only necessary because we need to track component
      // destruction inside `prop`, because of `bind:this`, but it
      // seems likely that we can simplify `bind:this` instead
      parent_effect: (
        /** @type {Effect} */
        q
      )
    },
    xc
  );
}
const Pc = {
  get(e, t) {
    let n = e.props.length;
    for (; n--; ) {
      let r = e.props[n];
      if (gn(r) && (r = r()), typeof r == "object" && r !== null && t in r) return r[t];
    }
  },
  set(e, t, n) {
    let r = e.props.length;
    for (; r--; ) {
      let o = e.props[r];
      gn(o) && (o = o());
      const i = Jt(o, t);
      if (i && i.set)
        return i.set(n), !0;
    }
    return !1;
  },
  getOwnPropertyDescriptor(e, t) {
    let n = e.props.length;
    for (; n--; ) {
      let r = e.props[n];
      if (gn(r) && (r = r()), typeof r == "object" && r !== null && t in r) {
        const o = Jt(r, t);
        return o && !o.configurable && (o.configurable = !0), o;
      }
    }
  },
  has(e, t) {
    if (t === nt || t === Ja) return !1;
    for (let n of e.props)
      if (gn(n) && (n = n()), n != null && t in n) return !0;
    return !1;
  },
  ownKeys(e) {
    const t = [];
    for (let n of e.props)
      if (gn(n) && (n = n()), !!n) {
        for (const r in n)
          t.includes(r) || t.push(r);
        for (const r of Object.getOwnPropertySymbols(n))
          t.includes(r) || t.push(r);
      }
    return t;
  }
};
function Us(...e) {
  return new Proxy({ props: e }, Pc);
}
function E(e, t, n, r) {
  var o = !dn || (n & af) !== 0, i = (n & sf) !== 0, a = (n & uf) !== 0, s = (
    /** @type {V} */
    r
  ), u = !0, l = () => (u && (u = !1, s = a ? X(
    /** @type {() => V} */
    r
  ) : (
    /** @type {V} */
    r
  )), s), f;
  if (i) {
    var c = nt in e || Ja in e;
    f = Jt(e, t)?.set ?? (c && t in e ? (_) => e[t] = _ : void 0);
  }
  var d, h = !1;
  i ? [d, h] = Sc(() => (
    /** @type {V} */
    e[t]
  )) : d = /** @type {V} */
  e[t], d === void 0 && r !== void 0 && (d = l(), f && (o && Zl(), f(d)));
  var p;
  if (o ? p = () => {
    var _ = (
      /** @type {V} */
      e[t]
    );
    return _ === void 0 ? l() : (u = !0, _);
  } : p = () => {
    var _ = (
      /** @type {V} */
      e[t]
    );
    return _ !== void 0 && (s = /** @type {V} */
    void 0), _ === void 0 ? s : _;
  }, o && (n & rs) === 0)
    return p;
  if (f) {
    var g = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(_, w) {
        return arguments.length > 0 ? ((!o || !w || g || h) && f(w ? p() : _), _) : p();
      })
    );
  }
  var y = !1, m = ((n & of) !== 0 ? Yn : U)(() => (y = !1, p()));
  i && v(m);
  var b = (
    /** @type {Effect} */
    q
  );
  return (
    /** @type {() => V} */
    (function(_, w) {
      if (arguments.length > 0) {
        const C = w ? v(m) : o && i ? qt(_) : _;
        return O(m, C), y = !0, s !== void 0 && (s = C), _;
      }
      return Pt && y || (b.f & tt) !== 0 ? m.v : v(m);
    })
  );
}
function at(e) {
  Y === null && kn(), dn && Y.l !== null ? Xo(Y).m.push(e) : Ze(() => {
    const t = X(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function hn(e) {
  Y === null && kn(), at(() => () => X(e));
}
function Cc(e) {
  Y === null && kn(), Y.l === null && ns(), Xo(Y).b.push(e);
}
function Wo(e) {
  Y === null && kn(), Y.l === null && ns(), Xo(Y).a.push(e);
}
function Xo(e) {
  var t = (
    /** @type {ComponentContextLegacy} */
    e.l
  );
  return t.u ??= { a: [], b: [], m: [] };
}
function Zo(e, t, n) {
  if (e == null)
    return t(void 0), n && n(void 0), be;
  const r = X(
    () => e.subscribe(
      t,
      // @ts-expect-error
      n
    )
  );
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
const Kt = [];
function Hs(e, t) {
  return {
    subscribe: Ee(e, t).subscribe
  };
}
function Ee(e, t = be) {
  let n = null;
  const r = /* @__PURE__ */ new Set();
  function o(s) {
    if (es(e, s) && (e = s, n)) {
      const u = !Kt.length;
      for (const l of r)
        l[1](), Kt.push(l, e);
      if (u) {
        for (let l = 0; l < Kt.length; l += 2)
          Kt[l][0](Kt[l + 1]);
        Kt.length = 0;
      }
    }
  }
  function i(s) {
    o(s(
      /** @type {T} */
      e
    ));
  }
  function a(s, u = be) {
    const l = [s, u];
    return r.add(l), r.size === 1 && (n = t(o, i) || be), s(
      /** @type {T} */
      e
    ), () => {
      r.delete(l), r.size === 0 && n && (n(), n = null);
    };
  }
  return { set: o, update: i, subscribe: a };
}
function Jo(e, t, n) {
  const r = !Array.isArray(e), o = r ? [e] : e;
  if (!o.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const i = t.length < 2;
  return Hs(n, (a, s) => {
    let u = !1;
    const l = [];
    let f = 0, c = be;
    const d = () => {
      if (f)
        return;
      c();
      const p = t(r ? l[0] : l, a, s);
      i ? a(p) : c = typeof p == "function" ? p : be;
    }, h = o.map(
      (p, g) => Zo(
        p,
        (y) => {
          l[g] = y, f &= ~(1 << g), u && d();
        },
        () => {
          f |= 1 << g;
        }
      )
    );
    return u = !0, d(), function() {
      mr(h), c(), u = !1;
    };
  });
}
function se(e) {
  let t;
  return Zo(e, (n) => t = n)(), t;
}
function Ec(e) {
  let t;
  const n = Af((o) => {
    let i = !1;
    const a = e.subscribe((s) => {
      t = s, i && o();
    });
    return i = !0, a;
  });
  function r() {
    return jr() ? (n(), t) : se(e);
  }
  return "set" in e ? {
    get current() {
      return r();
    },
    set current(o) {
      e.set(o);
    }
  } : {
    get current() {
      return r();
    }
  };
}
const zs = 1 / 60 * 1e3, Tc = typeof performance < "u" ? () => performance.now() : () => Date.now(), ks = typeof window < "u" ? (e) => window.requestAnimationFrame(e) : (e) => setTimeout(() => e(Tc()), zs);
function Ac(e) {
  let t = [], n = [], r = 0, o = !1, i = !1;
  const a = /* @__PURE__ */ new WeakSet(), s = {
    schedule: (u, l = !1, f = !1) => {
      const c = f && o, d = c ? t : n;
      return l && a.add(u), d.indexOf(u) === -1 && (d.push(u), c && o && (r = t.length)), u;
    },
    cancel: (u) => {
      const l = n.indexOf(u);
      l !== -1 && n.splice(l, 1), a.delete(u);
    },
    process: (u) => {
      if (o) {
        i = !0;
        return;
      }
      if (o = !0, [t, n] = [n, t], n.length = 0, r = t.length, r)
        for (let l = 0; l < r; l++) {
          const f = t[l];
          f(u), a.has(f) && (s.schedule(f), e());
        }
      o = !1, i && (i = !1, s.process(u));
    }
  };
  return s;
}
const Vc = 40;
let fo = !0, Rn = !1, co = !1;
const Qt = {
  delta: 0,
  timestamp: 0
}, Xn = [
  "read",
  "update",
  "preRender",
  "render",
  "postRender"
], Ur = Xn.reduce((e, t) => (e[t] = Ac(() => Rn = !0), e), {}), Ie = Xn.reduce((e, t) => {
  const n = Ur[t];
  return e[t] = (r, o = !1, i = !1) => (Rn || Mc(), n.schedule(r, o, i)), e;
}, {}), En = Xn.reduce((e, t) => (e[t] = Ur[t].cancel, e), {}), Xt = Xn.reduce((e, t) => (e[t] = () => Ur[t].process(Qt), e), {}), Oc = (e) => Ur[e].process(Qt), Gs = (e) => {
  Rn = !1, Qt.delta = fo ? zs : Math.max(Math.min(e - Qt.timestamp, Vc), 1), Qt.timestamp = e, co = !0, Xn.forEach(Oc), co = !1, Rn && (fo = !1, ks(Gs));
}, Mc = () => {
  Rn = !0, fo = !0, co || ks(Gs);
}, jt = () => Qt;
function Qo(e) {
  return e;
}
function Ks({ top: e, left: t, right: n, bottom: r }) {
  return {
    x: { min: t, max: n },
    y: { min: e, max: r }
  };
}
function Lc({ x: e, y: t }) {
  return {
    top: t.min,
    bottom: t.max,
    left: e.min,
    right: e.max
  };
}
function Dc({ top: e, left: t, bottom: n, right: r }, o) {
  o === void 0 && (o = Qo);
  var i = o({ x: t, y: e }), a = o({ x: r, y: n });
  return {
    top: i.y,
    left: i.x,
    bottom: a.y,
    right: a.x
  };
}
function Et() {
  return { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } };
}
function Rc(e) {
  return {
    x: Object.assign({}, e.x),
    y: Object.assign({}, e.y)
  };
}
var Hi = {
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
};
function zi() {
  return {
    x: Object.assign({}, Hi),
    y: Object.assign({}, Hi)
  };
}
var $o = function(e, t) {
  return e.depth - t.depth;
};
function Ys(e) {
  var t = e.projection.isEnabled;
  return t || e.shouldResetTransform();
}
function wr(e, t) {
  t === void 0 && (t = []);
  var n = e.parent;
  return n && wr(n, t), Ys(e) && t.push(e), t;
}
function jc(e) {
  var t = [], n = (r) => {
    Ys(r) && t.push(r), r.children.forEach(n);
  };
  return e.children.forEach(n), t.sort($o);
}
function cr(e) {
  if (!e.shouldResetTransform()) {
    var t = e.getLayoutState();
    e.notifyBeforeLayoutMeasure(t.layout), t.isHydrated = !0, t.layout = e.measureViewportBox(), t.layoutCorrected = Rc(t.layout), e.notifyLayoutMeasure(t.layout, e.prevViewportBox || t.layout), Ie.update(() => e.rebaseProjectionTarget());
  }
}
function qs(e, t) {
  e.shouldResetTransform() || (t || (e.prevViewportBox = e.measureViewportBox(!1)), e.rebaseProjectionTarget(!1, e.prevViewportBox));
}
var Tn = /* @__PURE__ */ new Set();
function ki(e, t, n) {
  e[n] || (e[n] = []), e[n].push(t);
}
function vo(e) {
  return Tn.add(e), function() {
    return Tn.delete(e);
  };
}
function po() {
  if (Tn.size) {
    var e = 0, t = [[]], n = [], r = function(s) {
      return ki(t, s, e);
    }, o = function(s) {
      ki(n, s, e), e++;
    };
    Tn.forEach(function(s) {
      s(r, o), e = 0;
    }), Tn.clear(), Ie.postRender(function() {
      setTimeout(function() {
        return !1;
      }, 10);
    });
    for (var i = n.length, a = 0; a <= i; a++)
      t[a] && t[a].forEach(Gi), n[a] && n[a].forEach(Gi);
  }
}
var Gi = function(e) {
  return e();
}, Se = /* @__PURE__ */ ((e) => (e[e.Entering = 0] = "Entering", e[e.Present = 1] = "Present", e[e.Exiting = 2] = "Exiting", e))(Se || {}), Ic = {
  layoutReady: (e) => e.notifyLayoutReady()
};
function ei() {
  var e = /* @__PURE__ */ new Set();
  return {
    add: (t) => e.add(t),
    flush: (t) => {
      var n = t === void 0 ? Ic : t, r = n.layoutReady, o = n.parent;
      vo((i, a) => {
        var s = Array.from(e).sort($o), u = o ? wr(o) : [];
        a(() => {
          var l = [...u, ...s];
          l.forEach((f) => f.resetTransform());
        }), i(() => {
          s.forEach(cr);
        }), a(() => {
          u.forEach((l) => l.restoreTransform()), s.forEach(r);
        }), i(() => {
          s.forEach((l) => {
            l.isPresent && (l.presence = Se.Present);
          });
        }), a(() => {
          Xt.preRender(), Xt.render();
        }), i(() => {
          Ie.postRender(() => s.forEach(Fc)), e.clear();
        });
      }), po();
    }
  };
}
function Fc(e) {
  e.prevViewportBox = e.projection.target;
}
const kt = (e, t) => {
  if (!t || !window)
    return;
  let n = t;
  for (; n = n.parentNode; )
    if (n.motionDomContext && n.motionDomContext.has(e))
      return n.motionDomContext.get(e);
}, mn = (e, t, n) => {
  t && window && (t.motionDomContext || (t.motionDomContext = /* @__PURE__ */ new Map()), t.motionDomContext.set(e, n));
};
function jn(e) {
  return kt("SharedLayout", e) || Ee(ei());
}
var Ki = (e) => Ee(ei());
function Vt(e) {
  return "forceUpdate" in e;
}
ef();
function ho(e, t) {
  G(t, !0);
  let n = E(t, "handler", 3, void 0), r = E(t, "options", 3, void 0), o = () => {
  };
  const i = (u, l, f, c) => {
    if (o(), !u)
      return () => {
      };
    const d = u.current;
    return f && d ? zt(d, l, f, c) : () => {
    };
  };
  Ze(() => {
    o = i(t.ref, t.eventName, n(), r());
  }), hn(o);
  var a = H(), s = N(a);
  pn(s, () => t.children ?? be), F(e, a), K();
}
function zt(e, t, n, r) {
  return e.addEventListener(t, n, r), function() {
    return e.removeEventListener(t, n, r);
  };
}
var re = /* @__PURE__ */ ((e) => (e.Animate = "animate", e.Hover = "whileHover", e.Tap = "whileTap", e.Drag = "whileDrag", e.Focus = "whileFocus", e.Exit = "exit", e))(re || {});
function Ws(e, t) {
  G(t, !1);
  const n = /* @__PURE__ */ L();
  let r = E(t, "props", 8), o = E(t, "visualElement", 8);
  const i = () => {
    o().animationState?.setActive(re.Focus, !0);
  }, a = () => {
    o().animationState?.setActive(re.Focus, !1);
  };
  I(() => (v(n), V(r())), () => {
    ((s) => {
      O(n, s.whileFocus);
    })(r());
  }), oe(), Q();
  {
    let s = /* @__PURE__ */ U(() => v(n) ? i : void 0);
    ho(e, {
      get ref() {
        return o();
      },
      eventName: "focus",
      get handler() {
        return v(s);
      },
      children: (u, l) => {
        {
          let f = /* @__PURE__ */ U(() => v(n) ? a : void 0);
          ho(u, {
            get ref() {
              return o();
            },
            eventName: "blur",
            get handler() {
              return v(f);
            },
            children: (c, d) => {
              var h = H(), p = N(h);
              $(p, t, "default", {}), F(c, h);
            },
            $$slots: { default: !0 }
          });
        }
      },
      $$slots: { default: !0 }
    });
  }
  K();
}
function Xs(e) {
  var t = null;
  return function() {
    var n = function() {
      t = null;
    };
    return t === null ? (t = e, n) : !1;
  };
}
var Yi = Xs("dragHorizontal"), qi = Xs("dragVertical");
function Zs(e) {
  var t = !1;
  if (e === "y")
    t = qi();
  else if (e === "x")
    t = Yi();
  else {
    var n = Yi(), r = qi();
    n && r ? t = function() {
      n(), r();
    } : (n && n(), r && r());
  }
  return t;
}
function Js() {
  var e = Zs(!0);
  return e ? (e(), !1) : !0;
}
function Qs(e) {
  return typeof PointerEvent < "u" && e instanceof PointerEvent ? e.pointerType === "mouse" : e instanceof MouseEvent;
}
function $s(e) {
  var t = !!e.touches;
  return t;
}
function Nc(e) {
  return function(t) {
    var n = t instanceof MouseEvent, r = !n || n && t.button === 0;
    r && e(t);
  };
}
var Bc = { pageX: 0, pageY: 0 };
function Uc(e, t) {
  t === void 0 && (t = "page");
  var n = e.touches[0] || e.changedTouches[0], r = n || Bc;
  return {
    x: r[t + "X"],
    y: r[t + "Y"]
  };
}
function Hc(e, t) {
  return t === void 0 && (t = "page"), {
    x: e[t + "X"],
    y: e[t + "Y"]
  };
}
function ti(e, t) {
  return t === void 0 && (t = "page"), {
    point: $s(e) ? Uc(e, t) : Hc(e, t)
  };
}
function zc(e) {
  return ti(e, "client");
}
var mo = function(e, t) {
  t === void 0 && (t = !1);
  var n = function(r) {
    return e(r, ti(r));
  };
  return t ? Nc(n) : n;
}, ni = typeof window < "u", kc = function() {
  return ni && window.onpointerdown === null;
}, Gc = function() {
  return ni && window.ontouchstart === null;
}, Kc = function() {
  return ni && window.onmousedown === null;
};
function Sr(e, t) {
  G(t, !1);
  let n = E(t, "ref", 8), r = E(t, "eventName", 8), o = E(t, "handler", 8, void 0), i = E(t, "options", 8, void 0);
  Q();
  {
    let a = /* @__PURE__ */ U(() => (V(go), V(r()), X(() => go(r())))), s = /* @__PURE__ */ U(() => (V(o()), V(mo), V(r()), X(() => o() && mo(o(), r() === "pointerdown"))));
    ho(e, {
      get ref() {
        return n();
      },
      get eventName() {
        return v(a);
      },
      get handler() {
        return v(s);
      },
      get options() {
        return i();
      },
      children: (u, l) => {
        var f = H(), c = N(f);
        $(c, t, "default", {}), F(u, f);
      },
      $$slots: { default: !0 }
    });
  }
  K();
}
const Yc = {
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointercancel: "mousecancel",
  pointerover: "mouseover",
  pointerout: "mouseout",
  pointerenter: "mouseenter",
  pointerleave: "mouseleave"
}, qc = {
  pointerdown: "touchstart",
  pointermove: "touchmove",
  pointerup: "touchend",
  pointercancel: "touchcancel"
};
function go(e) {
  return kc() ? e : Gc() ? qc[e] : Kc() ? Yc[e] : e;
}
function $t(e, t, n, r) {
  return zt(
    e,
    go(t),
    mo(n, t === "pointerdown"),
    r
  );
}
function Wi(e, t, n) {
  return (r, o) => {
    !Qs(r) || Js() || (n?.(r, o), e.animationState?.setActive(re.Hover, t));
  };
}
var Wc = /* @__PURE__ */ Wn("<!> <!> <!>", 1);
function eu(e, t) {
  G(t, !1);
  let n = E(t, "props", 8), r = E(t, "visualElement", 8), o = n(), i = /* @__PURE__ */ L(o.onHoverStart), a = /* @__PURE__ */ L(o.onHoverEnd), s = /* @__PURE__ */ L(o.whileHover);
  I(
    () => (v(i), v(a), v(s), V(n())),
    () => {
      ((d) => {
        O(i, d.onHoverStart), O(a, d.onHoverEnd), O(s, d.whileHover);
      })(n());
    }
  ), oe(), Q();
  var u = Wc(), l = N(u);
  {
    let d = /* @__PURE__ */ U(() => (v(i), v(s), V(r()), X(() => v(i) || v(s) ? Wi(r(), !0, v(i)) : void 0)));
    Sr(l, {
      get ref() {
        return r();
      },
      eventName: "pointerenter",
      get handler() {
        return v(d);
      }
    });
  }
  var f = yt(l, 2);
  {
    let d = /* @__PURE__ */ U(() => (v(a), v(s), V(r()), X(() => v(a) || v(s) ? Wi(r(), !1, v(a)) : void 0)));
    Sr(f, {
      get ref() {
        return r();
      },
      eventName: "pointerleave",
      get handler() {
        return v(d);
      }
    });
  }
  var c = yt(f, 2);
  $(c, t, "default", {}), F(e, u), K();
}
var Ce = (e) => kt("MotionConfig", e) || Ee({
  transformPagePoint: function(t) {
    return t;
  },
  isStatic: !1
});
function tu(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
var ri = function() {
}, In = function() {
};
process.env.NODE_ENV !== "production" && (ri = function(e, t) {
  !e && typeof console < "u" && console.warn(t);
}, In = function(e, t) {
  if (!e)
    throw new Error(t);
});
const xr = (e, t, n) => Math.min(Math.max(n, e), t), Xr = 1e-3, Xc = 0.01, Xi = 10, Zc = 0.05, Jc = 1;
function Qc({ duration: e = 800, bounce: t = 0.25, velocity: n = 0, mass: r = 1 }) {
  let o, i;
  ri(e <= Xi * 1e3, "Spring duration must be 10 seconds or less");
  let a = 1 - t;
  a = xr(Zc, Jc, a), e = xr(Xc, Xi, e / 1e3), a < 1 ? (o = (l) => {
    const f = l * a, c = f * e, d = f - n, h = yo(l, a), p = Math.exp(-c);
    return Xr - d / h * p;
  }, i = (l) => {
    const c = l * a * e, d = c * n + n, h = Math.pow(a, 2) * Math.pow(l, 2) * e, p = Math.exp(-c), g = yo(Math.pow(l, 2), a);
    return (-o(l) + Xr > 0 ? -1 : 1) * ((d - h) * p) / g;
  }) : (o = (l) => {
    const f = Math.exp(-l * e), c = (l - n) * e + 1;
    return -Xr + f * c;
  }, i = (l) => {
    const f = Math.exp(-l * e), c = (n - l) * (e * e);
    return f * c;
  });
  const s = 5 / e, u = ed(o, i, s);
  if (e = e * 1e3, isNaN(u))
    return {
      stiffness: 100,
      damping: 10,
      duration: e
    };
  {
    const l = Math.pow(u, 2) * r;
    return {
      stiffness: l,
      damping: a * 2 * Math.sqrt(r * l),
      duration: e
    };
  }
}
const $c = 12;
function ed(e, t, n) {
  let r = n;
  for (let o = 1; o < $c; o++)
    r = r - e(r) / t(r);
  return r;
}
function yo(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const td = ["duration", "bounce"], nd = ["stiffness", "damping", "mass"];
function Zi(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function rd(e) {
  let t = Object.assign({ velocity: 0, stiffness: 100, damping: 10, mass: 1, isResolvedFromDuration: !1 }, e);
  if (!Zi(e, nd) && Zi(e, td)) {
    const n = Qc(e);
    t = Object.assign(Object.assign(Object.assign({}, t), n), { velocity: 0, mass: 1 }), t.isResolvedFromDuration = !0;
  }
  return t;
}
function oi(e) {
  var { from: t = 0, to: n = 1, restSpeed: r = 2, restDelta: o } = e, i = tu(e, ["from", "to", "restSpeed", "restDelta"]);
  const a = { done: !1, value: t };
  let { stiffness: s, damping: u, mass: l, velocity: f, duration: c, isResolvedFromDuration: d } = rd(i), h = Ji, p = Ji;
  function g() {
    const y = f ? -(f / 1e3) : 0, m = n - t, b = u / (2 * Math.sqrt(s * l)), _ = Math.sqrt(s / l) / 1e3;
    if (o === void 0 && (o = Math.min(Math.abs(n - t) / 100, 0.4)), b < 1) {
      const w = yo(_, b);
      h = (C) => {
        const x = Math.exp(-b * _ * C);
        return n - x * ((y + b * _ * m) / w * Math.sin(w * C) + m * Math.cos(w * C));
      }, p = (C) => {
        const x = Math.exp(-b * _ * C);
        return b * _ * x * (Math.sin(w * C) * (y + b * _ * m) / w + m * Math.cos(w * C)) - x * (Math.cos(w * C) * (y + b * _ * m) - w * m * Math.sin(w * C));
      };
    } else if (b === 1)
      h = (w) => n - Math.exp(-_ * w) * (m + (y + _ * m) * w);
    else {
      const w = _ * Math.sqrt(b * b - 1);
      h = (C) => {
        const x = Math.exp(-b * _ * C), S = Math.min(w * C, 300);
        return n - x * ((y + b * _ * m) * Math.sinh(S) + w * m * Math.cosh(S)) / w;
      };
    }
  }
  return g(), {
    next: (y) => {
      const m = h(y);
      if (d)
        a.done = y >= c;
      else {
        const b = p(y) * 1e3, _ = Math.abs(b) <= r, w = Math.abs(n - m) <= o;
        a.done = _ && w;
      }
      return a.value = a.done ? n : m, a;
    },
    flipTarget: () => {
      f = -f, [t, n] = [n, t], g();
    }
  };
}
oi.needsInterpolation = (e, t) => typeof e == "string" || typeof t == "string";
const Ji = (e) => 0, un = (e, t, n) => {
  const r = t - e;
  return r === 0 ? 1 : (n - e) / r;
}, ce = (e, t, n) => -n * e + n * t + e, nu = (e, t) => (n) => Math.max(Math.min(n, t), e), An = (e) => e % 1 ? Number(e.toFixed(5)) : e, Fn = /(-)?([\d]*\.?[\d])+/g, bo = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi, od = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function Zn(e) {
  return typeof e == "string";
}
const Gt = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, Vn = Object.assign(Object.assign({}, Gt), { transform: nu(0, 1) }), or = Object.assign(Object.assign({}, Gt), { default: 1 }), Jn = (e) => ({
  test: (t) => Zn(t) && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), gt = Jn("deg"), en = Jn("%"), D = Jn("px"), id = Jn("vh"), ad = Jn("vw"), Qi = Object.assign(Object.assign({}, en), { parse: (e) => en.parse(e) / 100, transform: (e) => en.transform(e * 100) }), ii = (e, t) => (n) => !!(Zn(n) && od.test(n) && n.startsWith(e) || t && Object.prototype.hasOwnProperty.call(n, t)), ru = (e, t, n) => (r) => {
  if (!Zn(r))
    return r;
  const [o, i, a, s] = r.match(Fn);
  return {
    [e]: parseFloat(o),
    [t]: parseFloat(i),
    [n]: parseFloat(a),
    alpha: s !== void 0 ? parseFloat(s) : 1
  };
}, Dt = {
  test: ii("hsl", "hue"),
  parse: ru("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + en.transform(An(t)) + ", " + en.transform(An(n)) + ", " + An(Vn.transform(r)) + ")"
}, sd = nu(0, 255), Zr = Object.assign(Object.assign({}, Gt), { transform: (e) => Math.round(sd(e)) }), _t = {
  test: ii("rgb", "red"),
  parse: ru("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Zr.transform(e) + ", " + Zr.transform(t) + ", " + Zr.transform(n) + ", " + An(Vn.transform(r)) + ")"
};
function ud(e) {
  let t = "", n = "", r = "", o = "";
  return e.length > 5 ? (t = e.substr(1, 2), n = e.substr(3, 2), r = e.substr(5, 2), o = e.substr(7, 2)) : (t = e.substr(1, 1), n = e.substr(2, 1), r = e.substr(3, 1), o = e.substr(4, 1), t += t, n += n, r += r, o += o), {
    red: parseInt(t, 16),
    green: parseInt(n, 16),
    blue: parseInt(r, 16),
    alpha: o ? parseInt(o, 16) / 255 : 1
  };
}
const _o = {
  test: ii("#"),
  parse: ud,
  transform: _t.transform
}, we = {
  test: (e) => _t.test(e) || _o.test(e) || Dt.test(e),
  parse: (e) => _t.test(e) ? _t.parse(e) : Dt.test(e) ? Dt.parse(e) : _o.parse(e),
  transform: (e) => Zn(e) ? e : e.hasOwnProperty("red") ? _t.transform(e) : Dt.transform(e)
}, ou = "${c}", iu = "${n}";
function ld(e) {
  var t, n, r, o;
  return isNaN(e) && Zn(e) && ((n = (t = e.match(Fn)) === null || t === void 0 ? void 0 : t.length) !== null && n !== void 0 ? n : 0) + ((o = (r = e.match(bo)) === null || r === void 0 ? void 0 : r.length) !== null && o !== void 0 ? o : 0) > 0;
}
function au(e) {
  typeof e == "number" && (e = `${e}`);
  const t = [];
  let n = 0;
  const r = e.match(bo);
  r && (n = r.length, e = e.replace(bo, ou), t.push(...r.map(we.parse)));
  const o = e.match(Fn);
  return o && (e = e.replace(Fn, iu), t.push(...o.map(Gt.parse))), { values: t, numColors: n, tokenised: e };
}
function su(e) {
  return au(e).values;
}
function uu(e) {
  const { values: t, numColors: n, tokenised: r } = au(e), o = t.length;
  return (i) => {
    let a = r;
    for (let s = 0; s < o; s++)
      a = a.replace(s < n ? ou : iu, s < n ? we.transform(i[s]) : An(i[s]));
    return a;
  };
}
const fd = (e) => typeof e == "number" ? 0 : e;
function cd(e) {
  const t = su(e);
  return uu(e)(t.map(fd));
}
const dt = { test: ld, parse: su, createTransformer: uu, getAnimatableNone: cd }, dd = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function vd(e) {
  let [t, n] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [r] = n.match(Fn) || [];
  if (!r)
    return e;
  const o = n.replace(r, "");
  let i = dd.has(t) ? 1 : 0;
  return r !== n && (i *= 100), t + "(" + i + o + ")";
}
const pd = /([a-z-]*)\(.*?\)/g, wo = Object.assign(Object.assign({}, dt), { getAnimatableNone: (e) => {
  const t = e.match(pd);
  return t ? t.map(vd).join(" ") : e;
} });
function Jr(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function $i({ hue: e, saturation: t, lightness: n, alpha: r }) {
  e /= 360, t /= 100, n /= 100;
  let o = 0, i = 0, a = 0;
  if (!t)
    o = i = a = n;
  else {
    const s = n < 0.5 ? n * (1 + t) : n + t - n * t, u = 2 * n - s;
    o = Jr(u, s, e + 1 / 3), i = Jr(u, s, e), a = Jr(u, s, e - 1 / 3);
  }
  return {
    red: Math.round(o * 255),
    green: Math.round(i * 255),
    blue: Math.round(a * 255),
    alpha: r
  };
}
const hd = (e, t, n) => {
  const r = e * e, o = t * t;
  return Math.sqrt(Math.max(0, n * (o - r) + r));
}, md = [_o, _t, Dt], ea = (e) => md.find((t) => t.test(e)), ta = (e) => `'${e}' is not an animatable color. Use the equivalent color code instead.`, ai = (e, t) => {
  let n = ea(e), r = ea(t);
  In(!!n, ta(e)), In(!!r, ta(t));
  let o = n.parse(e), i = r.parse(t);
  n === Dt && (o = $i(o), n = _t), r === Dt && (i = $i(i), r = _t);
  const a = Object.assign({}, o);
  return (s) => {
    for (const u in a)
      u !== "alpha" && (a[u] = hd(o[u], i[u], s));
    return a.alpha = ce(o.alpha, i.alpha, s), n.transform(a);
  };
}, So = (e) => typeof e == "number", gd = (e, t) => (n) => t(e(n)), Qn = (...e) => e.reduce(gd);
function lu(e, t) {
  return So(e) ? (n) => ce(e, t, n) : we.test(e) ? ai(e, t) : cu(e, t);
}
const fu = (e, t) => {
  const n = [...e], r = n.length, o = e.map((i, a) => lu(i, t[a]));
  return (i) => {
    for (let a = 0; a < r; a++)
      n[a] = o[a](i);
    return n;
  };
}, yd = (e, t) => {
  const n = Object.assign(Object.assign({}, e), t), r = {};
  for (const o in n)
    e[o] !== void 0 && t[o] !== void 0 && (r[o] = lu(e[o], t[o]));
  return (o) => {
    for (const i in r)
      n[i] = r[i](o);
    return n;
  };
};
function na(e) {
  const t = dt.parse(e), n = t.length;
  let r = 0, o = 0, i = 0;
  for (let a = 0; a < n; a++)
    r || typeof t[a] == "number" ? r++ : t[a].hue !== void 0 ? i++ : o++;
  return { parsed: t, numNumbers: r, numRGB: o, numHSL: i };
}
const cu = (e, t) => {
  const n = dt.createTransformer(t), r = na(e), o = na(t);
  return r.numHSL === o.numHSL && r.numRGB === o.numRGB && r.numNumbers >= o.numNumbers ? Qn(fu(r.parsed, o.parsed), n) : (ri(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), (a) => `${a > 0 ? t : e}`);
}, bd = (e, t) => (n) => ce(e, t, n);
function _d(e) {
  if (typeof e == "number")
    return bd;
  if (typeof e == "string")
    return we.test(e) ? ai : cu;
  if (Array.isArray(e))
    return fu;
  if (typeof e == "object")
    return yd;
}
function wd(e, t, n) {
  const r = [], o = n || _d(e[0]), i = e.length - 1;
  for (let a = 0; a < i; a++) {
    let s = o(e[a], e[a + 1]);
    if (t) {
      const u = Array.isArray(t) ? t[a] : t;
      s = Qn(u, s);
    }
    r.push(s);
  }
  return r;
}
function Sd([e, t], [n]) {
  return (r) => n(un(e, t, r));
}
function xd(e, t) {
  const n = e.length, r = n - 1;
  return (o) => {
    let i = 0, a = !1;
    if (o <= e[0] ? a = !0 : o >= e[r] && (i = r - 1, a = !0), !a) {
      let u = 1;
      for (; u < n && !(e[u] > o || u === r); u++)
        ;
      i = u - 1;
    }
    const s = un(e[i], e[i + 1], o);
    return t[i](s);
  };
}
function si(e, t, { clamp: n = !0, ease: r, mixer: o } = {}) {
  const i = e.length;
  In(i === t.length, "Both input and output ranges must be the same length"), In(!r || !Array.isArray(r) || r.length === i - 1, "Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."), e[0] > e[i - 1] && (e = [].concat(e), t = [].concat(t), e.reverse(), t.reverse());
  const a = wd(t, r, o), s = i === 2 ? Sd(e, a) : xd(e, a);
  return n ? (u) => s(xr(e[0], e[i - 1], u)) : s;
}
const Hr = (e) => (t) => 1 - e(1 - t), ui = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Pd = (e) => (t) => Math.pow(t, e), du = (e) => (t) => t * t * ((e + 1) * t - e), Cd = (e) => {
  const t = du(e);
  return (n) => (n *= 2) < 1 ? 0.5 * t(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1)));
}, vu = 1.525, Ed = 4 / 11, Td = 8 / 11, Ad = 9 / 10, li = (e) => e, fi = Pd(2), Vd = Hr(fi), pu = ui(fi), hu = (e) => 1 - Math.sin(Math.acos(e)), ci = Hr(hu), Od = ui(ci), di = du(vu), Md = Hr(di), Ld = ui(di), Dd = Cd(vu), Rd = 4356 / 361, jd = 35442 / 1805, Id = 16061 / 1805, Pr = (e) => {
  if (e === 1 || e === 0)
    return e;
  const t = e * e;
  return e < Ed ? 7.5625 * t : e < Td ? 9.075 * t - 9.9 * e + 3.4 : e < Ad ? Rd * t - jd * e + Id : 10.8 * e * e - 20.52 * e + 10.72;
}, Fd = Hr(Pr), Nd = (e) => e < 0.5 ? 0.5 * (1 - Pr(1 - e * 2)) : 0.5 * Pr(e * 2 - 1) + 0.5;
function Bd(e, t) {
  return e.map(() => t || pu).splice(0, e.length - 1);
}
function Ud(e) {
  const t = e.length;
  return e.map((n, r) => r !== 0 ? r / (t - 1) : 0);
}
function Hd(e, t) {
  return e.map((n) => n * t);
}
function dr({ from: e = 0, to: t = 1, ease: n, offset: r, duration: o = 300 }) {
  const i = { done: !1, value: e }, a = Array.isArray(t) ? t : [e, t], s = Hd(r && r.length === a.length ? r : Ud(a), o);
  function u() {
    return si(s, a, {
      ease: Array.isArray(n) ? n : Bd(a, n)
    });
  }
  let l = u();
  return {
    next: (f) => (i.value = l(f), i.done = f >= o, i),
    flipTarget: () => {
      a.reverse(), l = u();
    }
  };
}
function zd({ velocity: e = 0, from: t = 0, power: n = 0.8, timeConstant: r = 350, restDelta: o = 0.5, modifyTarget: i }) {
  const a = { done: !1, value: t };
  let s = n * e;
  const u = t + s, l = i === void 0 ? u : i(u);
  return l !== u && (s = l - t), {
    next: (f) => {
      const c = -s * Math.exp(-f / r);
      return a.done = !(c > o || c < -o), a.value = a.done ? l : l + c, a;
    },
    flipTarget: () => {
    }
  };
}
const ra = { keyframes: dr, spring: oi, decay: zd };
function kd(e) {
  if (Array.isArray(e.to))
    return dr;
  if (ra[e.type])
    return ra[e.type];
  const t = new Set(Object.keys(e));
  return t.has("ease") || t.has("duration") && !t.has("dampingRatio") ? dr : t.has("dampingRatio") || t.has("stiffness") || t.has("mass") || t.has("damping") || t.has("restSpeed") || t.has("restDelta") ? oi : dr;
}
function mu(e, t, n = 0) {
  return e - t - n;
}
function Gd(e, t, n = 0, r = !0) {
  return r ? mu(t + -e, t, n) : t - (e - t) + n;
}
function Kd(e, t, n, r) {
  return r ? e >= t + n : e <= -n;
}
const Yd = (e) => {
  const t = ({ delta: n }) => e(n);
  return {
    start: () => Ie.update(t, !0),
    stop: () => En.update(t)
  };
};
function vi(e) {
  var t, n, { from: r, autoplay: o = !0, driver: i = Yd, elapsed: a = 0, repeat: s = 0, repeatType: u = "loop", repeatDelay: l = 0, onPlay: f, onStop: c, onComplete: d, onRepeat: h, onUpdate: p } = e, g = tu(e, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
  let { to: y } = g, m, b = 0, _ = g.duration, w, C = !1, x = !0, S;
  const A = kd(g);
  !((n = (t = A).needsInterpolation) === null || n === void 0) && n.call(t, r, y) && (S = si([0, 100], [r, y], {
    clamp: !1
  }), r = 0, y = 100);
  const B = A(Object.assign(Object.assign({}, g), { from: r, to: y }));
  function R() {
    b++, u === "reverse" ? (x = b % 2 === 0, a = Gd(a, _, l, x)) : (a = mu(a, _, l), u === "mirror" && B.flipTarget()), C = !1, h && h();
  }
  function j() {
    m.stop(), d && d();
  }
  function te(Z) {
    if (x || (Z = -Z), a += Z, !C) {
      const de = B.next(Math.max(0, a));
      w = de.value, S && (w = S(w)), C = x ? de.done : a <= 0;
    }
    p?.(w), C && (b === 0 && (_ ?? (_ = a)), b < s ? Kd(a, _, l, x) && R() : j());
  }
  function k() {
    f?.(), m = i(te), m.start();
  }
  return o && k(), {
    stop: () => {
      c?.(), m.stop();
    }
  };
}
function gu(e, t) {
  return t ? e * (1e3 / t) : 0;
}
function qd({ from: e = 0, velocity: t = 0, min: n, max: r, power: o = 0.8, timeConstant: i = 750, bounceStiffness: a = 500, bounceDamping: s = 10, restDelta: u = 1, modifyTarget: l, driver: f, onUpdate: c, onComplete: d, onStop: h }) {
  let p;
  function g(_) {
    return n !== void 0 && _ < n || r !== void 0 && _ > r;
  }
  function y(_) {
    return n === void 0 ? r : r === void 0 || Math.abs(n - _) < Math.abs(r - _) ? n : r;
  }
  function m(_) {
    p?.stop(), p = vi(Object.assign(Object.assign({}, _), {
      driver: f,
      onUpdate: (w) => {
        var C;
        c?.(w), (C = _.onUpdate) === null || C === void 0 || C.call(_, w);
      },
      onComplete: d,
      onStop: h
    }));
  }
  function b(_) {
    m(Object.assign({ type: "spring", stiffness: a, damping: s, restDelta: u }, _));
  }
  if (g(e))
    b({ from: e, velocity: t, to: y(e) });
  else {
    let _ = o * t + e;
    typeof l < "u" && (_ = l(_));
    const w = y(_), C = w === n ? -1 : 1;
    let x, S;
    const A = (B) => {
      x = S, S = B, t = gu(B - x, jt().delta), (C === 1 && B > w || C === -1 && B < w) && b({ from: B, to: w, velocity: t });
    };
    m({
      type: "decay",
      from: e,
      velocity: t,
      timeConstant: i,
      power: o,
      restDelta: u,
      modifyTarget: l,
      onUpdate: g(_) ? A : void 0
    });
  }
  return {
    stop: () => p?.stop()
  };
}
const xo = (e) => e.hasOwnProperty("x") && e.hasOwnProperty("y"), oa = (e) => xo(e) && e.hasOwnProperty("z"), ir = (e, t) => Math.abs(e - t);
function yu(e, t) {
  if (So(e) && So(t))
    return ir(e, t);
  if (xo(e) && xo(t)) {
    const n = ir(e.x, t.x), r = ir(e.y, t.y), o = oa(e) && oa(t) ? ir(e.z, t.z) : 0;
    return Math.sqrt(Math.pow(n, 2) + Math.pow(r, 2) + Math.pow(o, 2));
  }
}
const Wd = (e, t, n) => {
  const r = t - e;
  return ((n - e) % r + r) % r + e;
}, bu = (e, t) => 1 - 3 * t + 3 * e, _u = (e, t) => 3 * t - 6 * e, wu = (e) => 3 * e, Cr = (e, t, n) => ((bu(t, n) * e + _u(t, n)) * e + wu(t)) * e, Su = (e, t, n) => 3 * bu(t, n) * e * e + 2 * _u(t, n) * e + wu(t), Xd = 1e-7, Zd = 10;
function Jd(e, t, n, r, o) {
  let i, a, s = 0;
  do
    a = t + (n - t) / 2, i = Cr(a, r, o) - e, i > 0 ? n = a : t = a;
  while (Math.abs(i) > Xd && ++s < Zd);
  return a;
}
const Qd = 8, $d = 1e-3;
function ev(e, t, n, r) {
  for (let o = 0; o < Qd; ++o) {
    const i = Su(t, n, r);
    if (i === 0)
      return t;
    const a = Cr(t, n, r) - e;
    t -= a / i;
  }
  return t;
}
const vr = 11, ar = 1 / (vr - 1);
function tv(e, t, n, r) {
  if (e === t && n === r)
    return li;
  const o = new Float32Array(vr);
  for (let a = 0; a < vr; ++a)
    o[a] = Cr(a * ar, e, n);
  function i(a) {
    let s = 0, u = 1;
    const l = vr - 1;
    for (; u !== l && o[u] <= a; ++u)
      s += ar;
    --u;
    const f = (a - o[u]) / (o[u + 1] - o[u]), c = s + f * ar, d = Su(c, e, n);
    return d >= $d ? ev(a, c, e, n) : d === 0 ? c : Jd(a, s, s + ar, e, n);
  }
  return (a) => a === 0 || a === 1 ? a : Cr(i(a), t, r);
}
var Er = function(e) {
  return e * 1e3;
};
class xu {
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
  constructor(t, n, { transformPagePoint: r } = {}) {
    if (!($s(t) && t.touches.length > 1)) {
      this.handlers = n, this.transformPagePoint = r;
      var o = ti(t), i = Qr(o, this.transformPagePoint), a = i.point, s = jt().timestamp;
      this.history = [{ ...a, timestamp: s }];
      var u = n.onSessionStart;
      u && u(t, $r(i, this.history)), this.removeListeners = Qn(
        $t(window, "pointermove", this.handlePointerMove),
        $t(window, "pointerup", this.handlePointerUp),
        $t(window, "pointercancel", this.handlePointerUp)
      );
    }
  }
  updatePoint = () => {
    if (this.lastMoveEvent && this.lastMoveEventInfo) {
      var t = $r(this.lastMoveEventInfo, this.history), n = this.startEvent !== null, r = yu(t.offset, { x: 0, y: 0 }) >= 3;
      if (!(!n && !r)) {
        var o = t.point, i = jt().timestamp;
        this.history.push(Object.assign(Object.assign({}, o), { timestamp: i }));
        var a = this.handlers, s = a.onStart, u = a.onMove;
        n || (s && s(this.lastMoveEvent, t), this.startEvent = this.lastMoveEvent), u && u(this.lastMoveEvent, t);
      }
    }
  };
  handlePointerMove = (t, n) => {
    if (this.lastMoveEvent = t, this.lastMoveEventInfo = Qr(n, this.transformPagePoint), Qs(t) && t.buttons === 0) {
      this.handlePointerUp(t, n);
      return;
    }
    Ie.update(this.updatePoint, !0);
  };
  handlePointerUp = (t, n) => {
    this.end();
    var r = this.handlers, o = r.onEnd, i = r.onSessionEnd, a = $r(Qr(n, this.transformPagePoint), this.history);
    this.startEvent && o && o(t, a), i && i(t, a);
  };
  updateHandlers = (t) => {
    this.handlers = t;
  };
  end = () => {
    this.removeListeners?.(), En.update(this.updatePoint);
  };
}
function Qr(e, t) {
  return t ? { point: t(e.point) } : e;
}
function ia(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function $r(e, t) {
  var n = e.point;
  return {
    point: n,
    delta: ia(n, Pu(t)),
    offset: ia(n, nv(t)),
    velocity: rv(t, 0.1)
  };
}
function nv(e) {
  return e[0];
}
function Pu(e) {
  return e[e.length - 1];
}
function rv(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  for (var n = e.length - 1, r = null, o = Pu(e); n >= 0 && (r = e[n], !(o.timestamp - r.timestamp > Er(t))); )
    n--;
  if (!r)
    return { x: 0, y: 0 };
  var i = (o.timestamp - r.timestamp) / 1e3;
  if (i === 0)
    return { x: 0, y: 0 };
  var a = {
    x: (o.x - r.x) / i,
    y: (o.y - r.y) / i
  };
  return a.x === Number.POSITIVE_INFINITY && (a.x = 0), a.y === Number.POSITIVE_INFINITY && (a.y = 0), a;
}
function Cu(e, t) {
  G(t, !1);
  const n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L();
  let o = E(t, "props", 8), i = E(t, "visualElement", 8), a = E(t, "isCustom", 8, !1), s = o(), u = /* @__PURE__ */ L(s.onPan), l = /* @__PURE__ */ L(s.onPanStart), f = /* @__PURE__ */ L(s.onPanEnd), c = /* @__PURE__ */ L(s.onPanSessionStart), d = /* @__PURE__ */ L(null);
  const h = J(Ce) || Ce(a());
  let p = /* @__PURE__ */ L({
    onSessionStart: v(c),
    onStart: v(l),
    onMove: v(u),
    onEnd: (y, m) => {
      O(d, null), v(f) && v(f)(y, m);
    }
  });
  function g(y) {
    O(d, new xu(y, v(p), { transformPagePoint: v(r) }));
  }
  Wo(() => {
    v(d) !== null && v(d).updateHandlers(v(p));
  }), hn(() => v(d) && v(d).end()), I(
    () => (v(u), v(l), v(f), v(c), V(o())),
    () => {
      ((y) => {
        O(u, y.onPan), O(l, y.onPanStart), O(f, y.onPanEnd), O(c, y.onPanSessionStart);
      })(o());
    }
  ), I(
    () => (v(u), v(l), v(f), v(c)),
    () => {
      O(n, v(u) || v(l) || v(f) || v(c));
    }
  ), I(() => (v(r), se), () => {
    ((y) => {
      O(r, y.transformPagePoint);
    })(se(h));
  }), I(
    () => (v(c), v(l), v(u), v(f)),
    () => {
      O(p, {
        onSessionStart: v(c),
        onStart: v(l),
        onMove: v(u),
        onEnd: (y, m) => {
          O(d, null), v(f) && v(f)(y, m);
        }
      });
    }
  ), oe(), Q();
  {
    let y = /* @__PURE__ */ U(() => v(n) && g);
    Sr(e, {
      get ref() {
        return i();
      },
      eventName: "pointerdown",
      get handler() {
        return v(y);
      },
      children: (m, b) => {
        var _ = H(), w = N(_);
        $(w, t, "default", {}), F(m, _);
      },
      $$slots: { default: !0 }
    });
  }
  K();
}
var Eu = function(e, t) {
  return t ? e === t ? !0 : Eu(e, t.parentElement) : !1;
};
function Tu(e, t) {
  G(t, !1);
  const n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L(), o = /* @__PURE__ */ L(), i = /* @__PURE__ */ L(), a = /* @__PURE__ */ L();
  let s = E(t, "props", 8), u = E(t, "visualElement", 8), l = !1, f = null;
  function c() {
    f?.(), f = null;
  }
  function d() {
    return c(), l = !1, u().animationState?.setActive(re.Tap, !1), !Js();
  }
  function h(y, m) {
    d() && (Eu(u().getInstance(), y.target) ? v(n)?.(y, m) : v(o)?.(y, m));
  }
  function p(y, m) {
    d() && v(o)?.(y, m);
  }
  function g(y, m) {
    l || (c(), l = !0, f = Qn(
      // @ts-expect-error
      $t(window, "pointerup", h),
      $t(window, "pointercancel", p)
    ), v(r)?.(y, m), u().animationState?.setActive(re.Tap, !0));
  }
  hn(c), I(
    () => (v(n), v(r), v(o), v(i), V(s())),
    () => {
      ((y) => {
        O(n, y.onTap), O(r, y.onTapStart), O(o, y.onTapCancel), O(i, y.whileTap);
      })(s());
    }
  ), I(
    () => (v(n), v(r), v(o), v(i)),
    () => {
      O(a, v(n) || v(r) || v(o) || v(i));
    }
  ), oe(), Q();
  {
    let y = /* @__PURE__ */ U(() => v(a) ? g : void 0);
    Sr(e, {
      get ref() {
        return u();
      },
      eventName: "pointerdown",
      get handler() {
        return v(y);
      },
      children: (m, b) => {
        var _ = H(), w = N(_);
        $(w, t, "default", {}), F(m, _);
      },
      $$slots: { default: !0 }
    });
  }
  K();
}
var ov = /* @__PURE__ */ Wn("<!> <!> <!> <!> <!>", 1);
function Yh(e, t) {
  let n = E(t, "props", 8), r = E(t, "visualElement", 8);
  var o = ov(), i = N(o);
  Cu(i, {
    get props() {
      return n();
    },
    get visualElement() {
      return r();
    }
  });
  var a = yt(i, 2);
  Tu(a, {
    get props() {
      return n();
    },
    get visualElement() {
      return r();
    }
  });
  var s = yt(a, 2);
  eu(s, {
    get props() {
      return n();
    },
    get visualElement() {
      return r();
    }
  });
  var u = yt(s, 2);
  Ws(u, {
    get props() {
      return n();
    },
    get visualElement() {
      return r();
    }
  });
  var l = yt(u, 2);
  $(l, t, "default", {}), F(e, o);
}
const Ge = (e) => kt("Presence", e) || Ee(null);
let iv = 0;
const av = () => iv++;
function aa(e) {
  return e === null ? !0 : e.isPresent;
}
const qh = (e = !1) => {
  let t = J(Ge) || Ge(e);
  return Jo(t, (n) => n === null ? !0 : n.isPresent);
}, Au = (e = !1) => {
  const t = J(Ge) || Ge(e), n = se(t) === null ? void 0 : av();
  return at(() => {
    se(t) !== null && se(t).register(n);
  }), se(t) === null ? Hs([!0, null]) : Jo(
    t,
    (r) => !r.isPresent && r.onExitComplete ? [!1, () => r.onExitComplete?.(n)] : [!0]
  );
}, sa = (e) => kt("LayoutGroup", e) || Ee(null), Po = (e) => kt("Lazy", e) || Ee({ strict: !1 }), vt = (e) => kt("Motion", e) || Ee({});
function Vu(e, t) {
  G(t, !1);
  const n = () => me(m, "$mc", s), r = () => me(_, "$layoutGroupId", s), o = () => me(y, "$lazyContext", s), i = () => me(g, "$presenceContext", s), a = () => me(p, "$config", s), [s, u] = it();
  let l = E(t, "createVisualElement", 12, void 0), f = E(t, "props", 8), c = E(t, "Component", 8), d = E(t, "visualState", 8), h = E(t, "isCustom", 8);
  const p = J(Ce) || Ce(h()), g = J(Ge) || Ge(h()), y = J(Po) || Po(h()), m = J(vt) || vt(h());
  let b = /* @__PURE__ */ L(se(m).visualElement);
  const _ = J(sa) || sa(h());
  let w = /* @__PURE__ */ L(r() && f().layoutId !== void 0 ? r() + "-" + f().layoutId : f().layoutId), C = /* @__PURE__ */ L(), x = /* @__PURE__ */ L(void 0);
  l() || l(o().renderer);
  let S = /* @__PURE__ */ L(v(x));
  Wo(() => {
    Ut().then(() => {
      v(S)?.animationState?.animateChanges();
    });
  }), hn(() => {
    v(C)?.(), v(S)?.notifyUnmount();
  }), I(() => n(), () => {
    O(b, n().visualElement);
  }), I(() => (r(), V(f())), () => {
    O(w, r() && f().layoutId !== void 0 ? r() + "-" + f().layoutId : f().layoutId);
  }), I(
    () => (v(x), V(l()), V(c()), V(d()), v(b), V(f()), v(w), i()),
    () => {
      !v(x) && l() && O(x, l()(c(), {
        visualState: d(),
        parent: v(b),
        props: { ...f(), layoutId: v(w) },
        presenceId: i()?.id,
        blockInitialAnimation: i()?.initial === !1
      }));
    }
  ), I(() => v(x), () => {
    O(S, v(x));
  }), I(
    () => (v(S), a(), V(f()), v(w), i(), v(b), v(C)),
    () => {
      v(S) && (v(S).setProps({ ...a(), ...f(), layoutId: v(w) }), Wt(S, v(S).isPresent = aa(i())), Wt(S, v(S).isPresenceRoot = !v(b) || v(b).presenceId !== i()?.id), v(S).syncRender(), v(C) || O(C, g.subscribe((R) => {
        v(S) && (Wt(S, v(S).isPresent = aa(R)), Wt(S, v(S).isPresenceRoot = !v(b) || v(b).presenceId !== R?.id));
      })));
    }
  ), oe(), Q();
  var A = H(), B = N(A);
  $(
    B,
    t,
    "default",
    {
      get visualElement() {
        return v(S);
      }
    }
  ), F(e, A), K(), u();
}
var ut = function(e) {
  return {
    isEnabled: function(t) {
      return e.some(function(n) {
        return !!t[n];
      });
    }
  };
}, Co = {
  measureLayout: ut(["layout", "layoutId", "drag"]),
  animation: ut([
    "animate",
    "exit",
    "variants",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileDrag"
  ]),
  exit: ut(["exit"]),
  drag: ut(["drag", "dragControls"]),
  focus: ut(["whileFocus"]),
  hover: ut(["whileHover", "onHoverStart", "onHoverEnd"]),
  tap: ut(["whileTap", "onTap", "onTapStart", "onTapCancel"]),
  pan: ut([
    "onPan",
    "onPanStart",
    "onPanSessionStart",
    "onPanEnd"
  ]),
  layoutAnimation: ut(["layout", "layoutId"])
};
function tn(e) {
  for (var t in e) {
    var n = e[t];
    n !== null && (Co[t].Component = n);
  }
}
function Ou(e, t) {
  G(t, !1);
  const n = Object.keys(Co), r = n.length;
  let o = E(t, "visualElement", 8), i = E(t, "props", 8), a = /* @__PURE__ */ L([]);
  I(
    () => (v(a), V(i()), V(o())),
    () => {
      O(a, []);
      for (let f = 0; f < r; f++) {
        const c = n[f], { isEnabled: d, Component: h } = Co[c];
        d(i()) && h && v(a).push({
          Component: h,
          key: c,
          props: i(),
          visualElement: o()
        });
      }
    }
  ), oe(), Q();
  var s = H(), u = N(s);
  {
    var l = (f) => {
      var c = H(), d = N(c);
      $(
        d,
        t,
        "default",
        {
          get features() {
            return v(a);
          }
        }
      ), F(f, c);
    };
    Ko(u, (f) => {
      o() && f(l);
    });
  }
  F(e, s), K();
}
function Mu(e, t) {
  G(t, !1);
  let n = E(t, "value", 8), r = E(t, "isCustom", 8), o = Ee(n());
  Ft(vt, o), mn("Motion", r(), o), hn(() => {
    n()?.visualElement?.unmount();
  }), I(() => V(n()), () => {
    o.set(n());
  }), oe(), Q();
  var i = H(), a = N(i);
  $(a, t, "default", {}), F(e, i), K();
}
const sv = () => {
  try {
    return process.env || (process.env = {}), !0;
  } catch {
  }
  return !window || window.process && window.process.env ? !1 : (window.process || (window.process = {}), window.process.env = {}, !0);
};
sv();
function Eo(e) {
  return typeof e == "string" && e.startsWith("var(--");
}
var Lu = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
function uv(e) {
  var t = Lu.exec(e);
  if (!t) return [,];
  var [n, r, o] = t;
  return [r, o];
}
function To(e, t, n) {
  var [r, o] = uv(e);
  if (r) {
    var i = window.getComputedStyle(t).getPropertyValue(r);
    return i ? i.trim() : Eo(o) ? To(o, t) : o;
  }
}
function lv(e, { ...t }, n) {
  var r = e.getInstance();
  if (!(r instanceof HTMLElement)) return { target: t, transitionEnd: n };
  n && (n = Object.assign({}, n)), e.forEachValue((s) => {
    var u = s.get();
    if (Eo(u)) {
      var l = To(u, r);
      l && s.set(l);
    }
  });
  for (var o in t) {
    var i = t[o];
    if (Eo(i)) {
      var a = To(i, r);
      a && (t[o] = a, n && ((_b = n[o]) !== null && _b !== void 0 ? _b : n[o] = i));
    }
  }
  return { target: t, transitionEnd: n };
}
function ua(e, t) {
  return e / (t.max - t.min) * 100;
}
function fv(e, t, { target: n }) {
  if (typeof e == "string")
    if (D.test(e))
      e = Number.parseFloat(e);
    else
      return e;
  var r = ua(e, n.x), o = ua(e, n.y);
  return r + "% " + o + "%";
}
var la = "_$css";
function cv(e, { delta: t, treeScale: n }) {
  var r = e, o = e.includes("var("), i = [];
  o && (e = e.replace(Lu, (p) => (i.push(p), la)));
  var a = dt.parse(e);
  if (a.length > 5) return r;
  var s = dt.createTransformer(e), u = typeof a[0] != "number" ? 1 : 0, l = t.x.scale * n.x, f = t.y.scale * n.y;
  a[0 + u] /= l, a[1 + u] /= f;
  var c = ce(l, f, 0.5);
  typeof a[2 + u] == "number" && (a[2 + u] /= c), typeof a[3 + u] == "number" && (a[3 + u] /= c);
  var d = s(a);
  if (o) {
    var h = 0;
    d = d.replace(la, () => {
      var p = i[h];
      return h++, p;
    });
  }
  return d;
}
var wn = {
  process: fv
}, Du = {
  borderRadius: Object.assign(Object.assign({}, wn), {
    applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
  }),
  borderTopLeftRadius: wn,
  borderTopRightRadius: wn,
  borderBottomLeftRadius: wn,
  borderBottomRightRadius: wn,
  boxShadow: {
    process: cv
  }
}, On = Du;
function dv(e) {
  for (var t in e)
    On[t] = e[t];
}
var Ao = ["", "X", "Y", "Z"], vv = ["translate", "scale", "rotate", "skew"], Nn = ["transformPerspective", "x", "y", "z"];
vv.forEach(function(e) {
  return Ao.forEach(function(t) {
    return Nn.push(e + t);
  });
});
function pv(e, t) {
  return Nn.indexOf(e) - Nn.indexOf(t);
}
var hv = new Set(Nn);
function zr(e) {
  return hv.has(e);
}
var mv = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
function Ru(e) {
  return mv.has(e);
}
function ju(e, t) {
  var n = t.layout, r = t.layoutId;
  return zr(e) || Ru(e) || (n || r !== void 0) && !!On[e];
}
var Qe = function(e) {
  return e !== null && typeof e == "object" && e.getVelocity;
}, gv = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
function yv({ transform: e, transformKeys: t }, { enableHardwareAcceleration: n, allowTransformNone: r }, o, i) {
  var a = "";
  t.sort(pv);
  for (var s = !1, u = t.length, l = 0; l < u; l++) {
    var f = t[l];
    a += (gv[f] || f) + "(" + e[f] + ") ", f === "z" && (s = !0);
  }
  return !s && n ? a += "translateZ(0)" : a = a.trim(), i ? a = i(e, o ? "" : a) : r && o && (a = "none"), a;
}
function bv({ originX: e = "50%", originY: t = "50%", originZ: n = 0 }) {
  return e + " " + t + " " + n;
}
function Iu(e) {
  return e.startsWith("--");
}
var _v = function(e, t) {
  return t && typeof e == "number" ? t.transform(e) : e;
}, fa = Object.assign(Object.assign({}, Gt), { transform: Math.round }), Fu = {
  // Border props
  borderWidth: D,
  borderTopWidth: D,
  borderRightWidth: D,
  borderBottomWidth: D,
  borderLeftWidth: D,
  borderRadius: D,
  radius: D,
  borderTopLeftRadius: D,
  borderTopRightRadius: D,
  borderBottomRightRadius: D,
  borderBottomLeftRadius: D,
  // Positioning props
  width: D,
  maxWidth: D,
  height: D,
  maxHeight: D,
  size: D,
  top: D,
  right: D,
  bottom: D,
  left: D,
  // Spacing props
  padding: D,
  paddingTop: D,
  paddingRight: D,
  paddingBottom: D,
  paddingLeft: D,
  margin: D,
  marginTop: D,
  marginRight: D,
  marginBottom: D,
  marginLeft: D,
  // Transform props
  rotate: gt,
  rotateX: gt,
  rotateY: gt,
  rotateZ: gt,
  scale: or,
  scaleX: or,
  scaleY: or,
  scaleZ: or,
  skew: gt,
  skewX: gt,
  skewY: gt,
  distance: D,
  translateX: D,
  translateY: D,
  translateZ: D,
  x: D,
  y: D,
  z: D,
  perspective: D,
  transformPerspective: D,
  opacity: Vn,
  originX: Qi,
  originY: Qi,
  originZ: D,
  // Misc
  zIndex: fa,
  // SVG
  fillOpacity: Vn,
  strokeOpacity: Vn,
  numOctaves: fa
};
function pi(e, t, n, r, o, i, a, s) {
  var u, l = e.style, f = e.vars, c = e.transform, d = e.transformKeys, h = e.transformOrigin;
  d.length = 0;
  var p = !1, g = !1, y = !0;
  for (var m in t) {
    var b = t[m];
    if (Iu(m)) {
      f[m] = b;
      continue;
    }
    var _ = Fu[m], w = _v(b, _);
    if (zr(m)) {
      if (p = !0, c[m] = w, d.push(m), !y)
        continue;
      b !== ((u = _.default) !== null && u !== void 0 ? u : 0) && (y = !1);
    } else if (Ru(m))
      h[m] = w, g = !0;
    else if (r && n && r.isHydrated && On[m]) {
      var C = On[m].process(b, r, n), x = On[m].applyTo;
      if (x)
        for (var S = x.length, A = 0; A < S; A++)
          l[x[A]] = C;
      else
        l[m] = C;
    } else
      l[m] = w;
  }
  r && n && a && s ? (l.transform = a(r.deltaFinal, r.treeScale, p ? c : void 0), i && (l.transform = i(c, l.transform)), l.transformOrigin = s(r)) : (p && (l.transform = yv(e, o, y, i)), g && (l.transformOrigin = bv(h)));
}
var hi = function() {
  return {
    style: {},
    transform: {},
    transformKeys: [],
    transformOrigin: {},
    vars: {}
  };
};
function wv(e, t) {
  G(t, !0);
  const n = (a) => {
    let s = hi();
    pi(s, t.visualState, void 0, void 0, { enableHardwareAcceleration: !t.isStatic }, t.props.transformTemplate);
    const { vars: u, style: l } = s;
    return { ...u, ...l };
  }, r = /* @__PURE__ */ ct(() => n(t.visualState));
  var o = H(), i = N(o);
  pn(i, () => t.children, () => v(r)), F(e, o), K();
}
function Sv(e, t) {
  G(t, !1);
  const n = /* @__PURE__ */ L();
  let r = E(t, "visualState", 8), o = E(t, "props", 8), i = E(t, "isStatic", 8), a = /* @__PURE__ */ L({});
  const s = Nu, u = (l) => (Object.assign(v(a), l), o().transformValues && O(a, o().transformValues(v(a))), v(a));
  I(() => V(o()), () => {
    O(n, o().style || {});
  }), I(() => (v(a), v(n), V(o())), () => {
    s(v(a), v(n), o());
  }), oe(), Q(), wv(e, {
    get props() {
      return o();
    },
    get visualState() {
      return r();
    },
    get isStatic() {
      return i();
    },
    children: (f, c = be) => {
      var d = H(), h = N(d);
      {
        let p = /* @__PURE__ */ U(() => (c(), V(o()), v(a), X(() => u({ s1: c(), props: o(), style: v(a) }))));
        $(
          h,
          t,
          "default",
          {
            get styles() {
              return v(p);
            }
          }
        );
      }
      F(f, d);
    },
    $$slots: { default: !0 }
  }), K();
}
function xv(e, t) {
  let n = E(t, "props", 8), r = E(t, "visualState", 8), o = E(t, "isStatic", 8);
  const i = (a, s) => {
    let u = {
      draggable: !1,
      style: {
        userSelect: void 0,
        WebkitUserSelect: void 0,
        WebkitTouchCallout: void 0,
        touchAction: void 0
      }
    };
    return s.drag && (u.draggable = !1, a.userSelect = a.WebkitUserSelect = a.WebkitTouchCallout = "none", a.touchAction = s.drag === !0 ? "none" : `pan-${s.drag === "x" ? "y" : "x"}`), u.style = a, u;
  };
  Sv(e, {
    get visualState() {
      return r();
    },
    get props() {
      return n();
    },
    get isStatic() {
      return o();
    },
    children: je,
    $$slots: {
      default: (a, s) => {
        const u = /* @__PURE__ */ U(() => s.styles);
        var l = H(), f = N(l);
        {
          let c = /* @__PURE__ */ U(() => (V(v(u)), V(n()), X(() => i(v(u), n()))));
          $(
            f,
            t,
            "default",
            {
              get visualProps() {
                return v(c);
              }
            }
          );
        }
        F(a, l);
      }
    }
  });
}
const Pv = xv;
function Nu(e, t, n) {
  for (const r in t)
    !Qe(t[r]) && !ju(r, n) && (e[r] = t[r]);
}
function ca(e, t, n) {
  return typeof e == "string" ? e : D.transform?.(t + n * e);
}
function Cv(e, t, n) {
  var r = ca(t, e.x, e.width), o = ca(n, e.y, e.height);
  return r + " " + o;
}
var eo = function(e, t) {
  return D.transform?.(e * t);
}, Ev = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Tv(e, t, n, r, o, i) {
  r === void 0 && (r = 1), o === void 0 && (o = 0);
  var a = Ev;
  e[a.offset] = eo(-o, t);
  var s = eo(n, t), u = eo(r, t);
  e[a.array] = s + " " + u;
}
function mi(e, { attrX: t, attrY: n, originX: r, originY: o, pathLength: i, pathSpacing: a, pathOffset: s, ...u }, l, f, c, d, h, p) {
  pi(
    e,
    u,
    l,
    f,
    c,
    d,
    h,
    p
  ), e.attrs = e.style, e.style = {};
  var g = e.attrs, y = e.style, m = e.dimensions, b = e.totalPathLength;
  g.transform && (m && (y.transform = g.transform), delete g.transform), m && (r !== void 0 || o !== void 0 || y.transform) && (y.transformOrigin = Cv(
    m,
    // @ts-expect-error
    r !== void 0 ? r : 0.5,
    o !== void 0 ? o : 0.5
  )), t !== void 0 && (g.x = t), n !== void 0 && (g.y = n), b !== void 0 && i !== void 0 && Tv(g, b, i, a, s);
}
var Bu = () => Object.assign(Object.assign({}, hi()), { attrs: {} });
function Av(e, t) {
  G(t, !0);
  let n = (a) => {
    const s = Bu();
    return mi(s, t.visualState, void 0, void 0, { enableHardwareAcceleration: !1 }, t.props.transformTemplate), { ...s.attrs, style: { ...s.style } };
  };
  const r = /* @__PURE__ */ ct(() => n(t.visualState));
  Ze(() => {
    if (t.props.style) {
      const a = {};
      Nu(a, t.props.style, t.props), v(r).style = { ...a, ...v(r).style };
    }
  });
  var o = H(), i = N(o);
  pn(i, () => t.children ?? be, () => v(r)), F(e, o), K();
}
var Vv = /* @__PURE__ */ new Set([
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
function Tr(e) {
  return Vv.has(e);
}
var Uu = function(e) {
  return !Tr(e);
};
try {
  var Ov = require("@emotion/is-prop-valid").default;
  Uu = function(e) {
    return e.startsWith("on") ? !Tr(e) : Ov(e);
  };
} catch {
}
function Mv(e, t, n) {
  var r = {};
  for (var o in e)
    (Uu(o) || n === !0 && Tr(o) || !t && !Tr(o)) && (r[o] = e[o]);
  return r;
}
function Hu(e, t) {
  G(t, !1);
  const n = /* @__PURE__ */ L();
  let r = E(t, "props", 8), o = E(t, "visualState", 8), i = E(t, "Component", 8), a = E(t, "forwardMotionProps", 8, !1), s = E(t, "isStatic", 8), u = E(t, "ref", 8), l = E(t, "targetEl", 8, void 0);
  const f = (h) => {
    u()(h);
  };
  I(
    () => (V(r()), V(i()), V(a())),
    () => {
      O(n, Mv(r(), typeof i() == "string", a()));
    }
  ), I(() => V(l()), () => {
    l() && f(l());
  }), oe(), Q();
  var c = H(), d = N(c);
  {
    const h = (p, g = be) => {
      var y = H(), m = N(y);
      {
        let b = /* @__PURE__ */ U(() => (v(n), g(), X(() => ({ ...v(n), ...g() }))));
        $(
          m,
          t,
          "default",
          {
            motion: f,
            get props() {
              return v(b);
            }
          }
        );
      }
      F(p, y);
    };
    qo(d, () => i() === "SVG" ? Av : Pv, (p, g) => {
      g(p, {
        get visualState() {
          return o();
        },
        get isStatic() {
          return s();
        },
        get props() {
          return r();
        },
        children: h,
        $$slots: { default: !0 }
      });
    });
  }
  F(e, c), K();
}
function zu(e, t) {
  var n = e.getBoundingClientRect();
  return Ks(Dc(n, t));
}
const Bn = (e) => Array.isArray(e);
var ku = function(e) {
  return function(t) {
    return t.test(e);
  };
}, Lv = {
  test: function(e) {
    return e === "auto";
  },
  parse: function(e) {
    return e;
  }
}, Gu = [Gt, D, en, gt, ad, id, Lv], to = function(e) {
  return Gu.find(ku(e));
}, Dv = /* @__PURE__ */ new Set(["width", "height", "top", "left", "right", "bottom", "x", "y"]), Ku = (e) => Dv.has(e), Rv = (e) => Object.keys(e).some(Ku), Yu = (e, t) => {
  e.set(t, !1), e.set(t);
}, da = (e) => e === Gt || e === D, va = (e, t) => Number.parseFloat(e.split(", ")[t]), pa = (e, t) => (n, r) => {
  if (varm = r.transform, transform === "none" || !transform) return 0;
  var o = transform.match(/^matrix3d\((.+)\)$/);
  if (o)
    return va(o[1], t);
  var i = transform.match(/^matrix\((.+)\)$/);
  return i ? va(i[1], e) : 0;
}, jv = /* @__PURE__ */ new Set(["x", "y", "z"]), Iv = Nn.filter((e) => !jv.has(e));
function Fv(e) {
  var t = [];
  return Iv.forEach((n) => {
    var r = e.getValue(n);
    r !== void 0 && (t.push([n, r.get()]), r.set(n.startsWith("scale") ? 1 : 0));
  }), t.length && e.syncRender(), t;
}
var ha = {
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
    var n = e.y, r = t.top;
    return r + (n.max - n.min);
  },
  right: (e, t) => {
    var n = e.x, r = t.left;
    return r + (n.max - n.min);
  },
  // Transform
  x: pa(4, 13),
  y: pa(5, 14)
}, Nv = (e, t, n) => {
  var r = t.measureViewportBox(), o = t.getInstance(), i = getComputedStyle(o), a = i.display, s = i.top, u = i.left, l = i.bottom, f = i.right, c = i.transform, d = { top: s, left: u, bottom: l, right: f, transform: c };
  a === "none" && t.setStaticValue("display", e.display || "block"), t.syncRender();
  var h = t.measureViewportBox();
  return n.forEach((p) => {
    var g = t.getValue(p);
    Yu(g, ha[p](r, d)), e[p] = ha[p](h, i);
  }), e;
}, Bv = (e, t, n, r) => {
  n === void 0 && (n = {}), r === void 0 && (r = {}), t = Object.assign({}, t), r = Object.assign({}, r);
  var o = Object.keys(t).filter(Ku), i = [], a = !1, s = [];
  if (o.forEach((l) => {
    var f = e.getValue(l);
    if (e.hasValue(l)) {
      var c = n[l], d = t[l], h = to(c), p;
      if (Bn(d))
        for (var g = d.length, y = d[0] === null ? 1 : 0; y < g; y++)
          p || (p = to(d[y]));
      else
        p = to(d);
      if (h !== p)
        if (da(h) && da(p)) {
          var m = f?.get();
          typeof m == "string" && f?.set(Number.parseFloat(m)), typeof d == "string" ? t[l] = Number.parseFloat(d) : Array.isArray(d) && p === D && (t[l] = d.map(Number.parseFloat));
        } else h?.transform && p?.transform && (c === 0 || d === 0) ? c === 0 ? f?.set(p?.transform(c)) : t[l] = h?.transform(d) : (a || (i = Fv(e), a = !0), s.push(l), r[l] = r[l] !== void 0 ? r[l] : t[l], Yu(f, d));
    }
  }), s.length) {
    var u = Nv(t, e, s);
    return i.length && i.forEach((l) => {
      var [f, c] = l;
      e.getValue(f).set(c);
    }), e.syncRender(), { target: u, transitionEnd: r };
  } else
    return { target: t, transitionEnd: r };
};
function Uv(e, t, n, r) {
  return Rv(t) ? Bv(e, t, n, r) : { target: t, transitionEnd: r };
}
var Hv = function(e, t, n, r) {
  var o = lv(e, t, r);
  return t = o.target, r = o.transitionEnd, Uv(e, t, n, r);
}, zv = Object.assign(Object.assign({}, Fu), {
  // Color props
  color: we,
  backgroundColor: we,
  outlineColor: we,
  fill: we,
  stroke: we,
  // Border props
  borderColor: we,
  borderTopColor: we,
  borderRightColor: we,
  borderBottomColor: we,
  borderLeftColor: we,
  filter: wo,
  WebkitFilter: wo
}), gi = (e) => zv[e];
function Me(e) {
  return [e("x"), e("y")];
}
function qu(e) {
  var t = e.getProps(), n = t.drag, r = t._dragX;
  return n && !r;
}
function ma(e, t) {
  e.min = t.min, e.max = t.max;
}
function kv(e, t) {
  ma(e.x, t.x), ma(e.y, t.y);
}
function Ar(e, t, n) {
  var r = e - n, o = t * r;
  return n + o;
}
function ga(e, t, n, r, o) {
  return o !== void 0 && (e = Ar(e, o, r)), Ar(e, n, r) + t;
}
function Vo(e, t, n, r, o) {
  t === void 0 && (t = 0), n === void 0 && (n = 1), e.min = ga(e.min, t, n, r, o), e.max = ga(e.max, t, n, r, o);
}
function Gv(e, { x: t, y: n }) {
  Vo(e.x, t.translate, t.scale, t.originPoint), Vo(e.y, n.translate, n.scale, n.originPoint);
}
function ya(e, t, n, [r, o, i]) {
  e.min = t.min, e.max = t.max;
  var a = n[i] !== void 0 ? n[i] : 0.5, s = ce(t.min, t.max, a);
  Vo(e, n[r], n[o], s, n.scale);
}
var Wu = ["x", "scaleX", "originX"], Xu = ["y", "scaleY", "originY"];
function Oo(e, t, n) {
  ya(e.x, t.x, n, Wu), ya(e.y, t.y, n, Xu);
}
function ba(e, t, n, r, o) {
  return e -= t, e = Ar(e, 1 / n, r), o !== void 0 && (e = Ar(e, 1 / o, r)), e;
}
function Kv(e, t, n, r, o) {
  t === void 0 && (t = 0), n === void 0 && (n = 1), r === void 0 && (r = 0.5);
  var i = ce(e.min, e.max, r) - t;
  e.min = ba(e.min, t, n, i, o), e.max = ba(e.max, t, n, i, o);
}
function _a(e, t, [n, r, o]) {
  Kv(e, t[n], t[r], t[o], t.scale);
}
function Zu(e, t) {
  _a(e.x, t, Wu), _a(e.y, t, Xu);
}
function Yv(e, t, n) {
  var r = n.length;
  if (r) {
    t.x = t.y = 1;
    for (var o, i, a = 0; a < r; a++)
      o = n[a], i = o.getLayoutState().delta, t.x *= i.x.scale, t.y *= i.y.scale, Gv(e, i), qu(o) && Oo(e, e, o.getLatestValues());
  }
}
var qv = function(e) {
  return xr(0, 1, e);
};
function wa(e, t, n) {
  return t === void 0 && (t = 0), n === void 0 && (n = 0.01), yu(e, t) < n;
}
function Un(e) {
  return e.max - e.min;
}
function Wv(e, t) {
  var n = 0.5, r = Un(e), o = Un(t);
  return o > r ? n = un(t.min, t.max - r, e.min) : r > o && (n = un(e.min, e.max - o, t.min)), qv(n);
}
function Sa(e, t, n, r) {
  r === void 0 && (r = 0.5), e.origin = r, e.originPoint = ce(t.min, t.max, e.origin), e.scale = Un(n) / Un(t), wa(e.scale, 1, 1e-4) && (e.scale = 1), e.translate = ce(n.min, n.max, e.origin) - e.originPoint, wa(e.translate) && (e.translate = 0);
}
function Ju(e, t, n, r) {
  Sa(e.x, t.x, n.x, xa(r.originX)), Sa(e.y, t.y, n.y, xa(r.originY));
}
function xa(e) {
  return typeof e == "number" ? e : 0.5;
}
function Pa(e, t, n) {
  e.min = n.min + t.min, e.max = e.min + Un(t);
}
function Xv(e, t) {
  Pa(e.target.x, e.relativeTarget.x, t.target.x), Pa(e.target.y, e.relativeTarget.y, t.target.y);
}
function Qu(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function $u(e, t) {
  var n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
class pr {
  subscriptions = [];
  add = (t) => (Qu(this.subscriptions, t), () => $u(this.subscriptions, t));
  notify = (...[t, n, r]) => {
    var o = this.subscriptions.length;
    if (o)
      if (o === 1)
        this.subscriptions[0](t, n, r);
      else
        for (var i = 0; i < o; i++) {
          var a = this.subscriptions[i];
          a && a(t, n, r);
        }
  };
  getSize = () => this.subscriptions.length;
  clear = () => {
    this.subscriptions.length = 0;
  };
}
class Zv {
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
  updateSubscribers = new pr();
  /**
   * Functions to notify when the velocity updates.
   *
   * @internal
   */
  velocityUpdateSubscribers = new pr();
  /**
   * Functions to notify when the `MotionValue` updates and `render` is set to `true`.
   *
   * @internal
   */
  renderSubscribers = new pr();
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
    this.prev = this.current = t, this.canTrackVelocity = Jv(this.current), n && (this.onSubscription = () => {
      if (this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0) {
        const r = n();
        this.onUnsubscription = () => {
        }, r && (this.onUnsubscription = () => {
          this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0 && r();
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
    var r = jt(), o = r.delta, i = r.timestamp;
    this.lastUpdated !== i && (this.timeDelta = o, this.lastUpdated = i, Ie.postRender(this.scheduleVelocityCheck)), this.prev !== this.current && this.updateSubscribers.notify(this.current), this.velocityUpdateSubscribers.getSize() && this.velocityUpdateSubscribers.notify(this.getVelocity()), n && this.renderSubscribers.notify(this.current);
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
      gu(
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
  scheduleVelocityCheck = () => Ie.postRender(this.velocityCheck);
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
var Jv = (e) => !isNaN(Number.parseFloat(e));
function ge(e, t) {
  return new Zv(e, t);
}
function Qv(e, t, n, r) {
  e.min = ce(t.min, n.min, r), e.max = ce(t.max, n.max, r);
}
function Ca(e, t) {
  return {
    min: t.min - e.min,
    max: t.max - e.min
  };
}
function Vr(e, t) {
  return {
    x: Ca(e.x, t.x),
    y: Ca(e.y, t.y)
  };
}
const Wh = {
  track: (e) => e
};
function $v(e) {
  var t = e.getProjectionParent();
  if (!t) {
    e.rebaseProjectionTarget();
    return;
  }
  var n = Vr(t.getLayoutState().layout, e.getLayoutState().layout);
  Me(function(r) {
    e.setProjectionTargetAxis(r, n[r].min, n[r].max, !0);
  });
}
var ep = function() {
  return {
    isEnabled: !1,
    isTargetLocked: !1,
    target: Et(),
    targetFinal: Et()
  };
};
function el() {
  return {
    isHydrated: !1,
    layout: Et(),
    layoutCorrected: Et(),
    treeScale: { x: 1, y: 1 },
    delta: zi(),
    deltaFinal: zi(),
    deltaTransform: ""
  };
}
var Ea = el();
function kr({ x: e, y: t }, n, r) {
  var o = e.translate / n.x, i = t.translate / n.y, a = "translate3d(" + o + "px, " + i + "px, 0) ";
  if (r) {
    var s = r.rotate, u = r.rotateX, l = r.rotateY;
    s && (a += "rotate(" + s + ") "), u && (a += "rotateX(" + u + ") "), l && (a += "rotateY(" + l + ") ");
  }
  return a += "scale(" + e.scale + ", " + t.scale + ")", !r && a === tp ? "" : a;
}
function tl({ deltaFinal: e }) {
  return e.x.origin * 100 + "% " + e.y.origin * 100 + "% 0";
}
var tp = kr(Ea.delta, Ea.treeScale, {});
const yi = (e) => typeof e == "object" && typeof e?.start == "function";
function nl(e, t) {
  if (!Array.isArray(t))
    return !1;
  var n = t.length;
  if (n !== e.length)
    return !1;
  for (var r = 0; r < n; r++)
    if (t[r] !== e[r])
      return !1;
  return !0;
}
function bi(e, t) {
  var n, r = gi(e);
  return r !== wo && (r = dt), (n = r.getAnimatableNone) === null || n === void 0 ? void 0 : n.call(r, t);
}
let _i = Qo, rl = Qo;
process.env.NODE_ENV !== "production" && (_i = (e, t) => {
  !e && typeof console < "u" && console.warn(t);
}, rl = (e, t) => {
  if (!e)
    throw new Error(t);
});
var At = () => ({
  type: "spring",
  stiffness: 500,
  damping: 25,
  restDelta: 0.5,
  restSpeed: 10
}), sr = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restDelta: 0.01,
  restSpeed: 10
}), no = () => ({
  type: "keyframes",
  ease: "linear",
  duration: 0.3
}), np = (e) => ({
  type: "keyframes",
  duration: 0.8,
  values: e
}), Ta = {
  x: At,
  y: At,
  z: At,
  rotate: At,
  rotateX: At,
  rotateY: At,
  rotateZ: At,
  scaleX: sr,
  scaleY: sr,
  scale: sr,
  opacity: no,
  backgroundColor: no,
  color: no,
  default: sr
}, rp = (e, t) => {
  var n;
  return Bn(t) ? n = np : n = Ta[e] || Ta.default, Object.assign({ to: t }, n(t));
}, op = {
  linear: li,
  easeIn: fi,
  easeInOut: pu,
  easeOut: Vd,
  circIn: hu,
  circInOut: Od,
  circOut: ci,
  backIn: di,
  backInOut: Ld,
  backOut: Md,
  anticipate: Dd,
  bounceIn: Fd,
  bounceInOut: Nd,
  bounceOut: Pr
}, Aa = (e) => {
  if (Array.isArray(e)) {
    var [t, n, r, o] = e;
    return tv(t, n, r, o);
  } else if (typeof e == "string")
    return op[e];
  return e;
};
const ip = (e) => Array.isArray(e) && typeof e[0] != "number";
var Va = function(e, t) {
  return e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
  dt.test(t) && // And it contains numbers and/or colors
  !t.startsWith("url("));
};
function ap(e) {
  var {
    delay: t,
    when: n,
    delayChildren: r,
    staggerChildren: o,
    staggerDirection: i,
    repeat: a,
    repeatType: s,
    repeatDelay: u,
    from: l,
    ...f
  } = e;
  return !!Object.keys(f).length;
}
var Oa = !1;
function sp(e) {
  var { ease: t, times: n, yoyo: r, flip: o, loop: i, ...a } = e, s = Object.assign({}, a);
  return n && (s.offset = n), a.duration && (s.duration = Er(a.duration)), a.repeatDelay && (s.repeatDelay = Er(a.repeatDelay)), t && (s.ease = ip(t) ? t.map(Aa) : Aa(t)), a.type === "tween" && (s.type = "keyframes"), (r || i || o) && (_i(
    !Oa,
    "yoyo, loop and flip have been removed from the API. Replace with repeat and repeatType options."
  ), Oa = !0, r ? s.repeatType = "reverse" : i ? s.repeatType = "loop" : o && (s.repeatType = "mirror"), s.repeat = i || r || o || a.repeat), a.type !== "spring" && (s.type = "keyframes"), s;
}
function up(e, t) {
  var n, r = Gr(e, t) || {};
  return (n = r.delay) !== null && n !== void 0 ? n : 0;
}
function lp(e) {
  return Array.isArray(e.to) && e.to[0] === null && (e.to = [...e.to], e.to[0] = e.from), e;
}
function fp(e, t, n) {
  var r;
  return Array.isArray(t.to) && ((r = e.duration) !== null && r !== void 0 || (e.duration = 0.8)), lp(t), ap(e) || (e = Object.assign(Object.assign({}, e), rp(n, t.to))), Object.assign(Object.assign({}, t), sp(e));
}
function cp(e, t, n, r, o) {
  var i, a = Gr(r, e), s = (i = a.from) !== null && i !== void 0 ? i : t.get(), u = Va(e, n);
  s === "none" && u && typeof n == "string" ? s = bi(e, n) : Ma(s) && typeof n == "string" ? s = La(n) : !Array.isArray(n) && Ma(n) && typeof s == "string" && (n = La(s));
  var l = Va(e, s);
  _i(
    l === u,
    "You are trying to animate " + e + ' from "' + s + '" to "' + n + '". ' + s + " is not an animatable value - to enable this animation set " + s + " to a value animatable to " + n + " via the `style` property."
  );
  function f() {
    var d = {
      from: s,
      to: n,
      velocity: t.getVelocity(),
      onComplete: o,
      onUpdate: (h) => t.set(h)
    };
    return a.type === "inertia" || a.type === "decay" ? qd(Object.assign(Object.assign({}, d), a)) : vi(
      Object.assign(Object.assign({}, fp(a, d, e)), {
        onUpdate: (h) => {
          var p;
          d.onUpdate(h), (p = a.onUpdate) === null || p === void 0 || p.call(a, h);
        },
        onComplete: () => {
          var h;
          d.onComplete(), (h = a.onComplete) === null || h === void 0 || h.call(a);
        }
      })
    );
  }
  function c() {
    var d;
    return t.set(n), o(), (d = a?.onComplete) === null || d === void 0 || d.call(a), { stop: () => {
    } };
  }
  return !l || !u || a.type === !1 ? c : f;
}
function Ma(e) {
  return e === 0 || typeof e == "string" && Number.parseFloat(e) === 0 && e.indexOf(" ") === -1;
}
function La(e) {
  return typeof e == "number" ? 0 : bi("", e);
}
function Gr(e, t) {
  const n = e;
  return n[t] || n.default || n;
}
function Hn(e, t, n, r) {
  return r === void 0 && (r = {}), t.start((o) => {
    var i, a, s = cp(e, t, n, r, o), u = up(r, e), l = () => a = s();
    return u ? i = setTimeout(l, Er(u)) : l(), () => {
      clearTimeout(i), a?.stop();
    };
  });
}
var dp = function(e) {
  return /^\-?\d*\.?\d+$/.test(e);
}, vp = function(e) {
  return !!(e && typeof e == "object" && e.mix && e.toValue);
}, pp = function(e) {
  return Bn(e) ? e[e.length - 1] || 0 : e;
}, hp = [...Gu, we, dt], mp = (e) => hp.find(ku(e));
function ol(e) {
  return Array.isArray(e);
}
function qe(e) {
  return typeof e == "string" || ol(e);
}
function gp(e) {
  var t = {};
  return e.forEachValue(function(n, r) {
    return t[r] = n.get();
  }), t;
}
function yp(e) {
  var t = {};
  return e.forEachValue(function(n, r) {
    return t[r] = n.getVelocity();
  }), t;
}
function il(e, t, n, r, o) {
  var i;
  return r === void 0 && (r = {}), o === void 0 && (o = {}), typeof t == "string" && (t = (i = e.variants) === null || i === void 0 ? void 0 : i[t]), typeof t == "function" ? t(n ?? e.custom, r, o) : t;
}
function Kr(e, t, n) {
  var r = e.getProps();
  return il(r, t, n ?? r.custom, gp(e), yp(e));
}
function Yr(e) {
  var t;
  return typeof ((t = e.animate) === null || t === void 0 ? void 0 : t.start) == "function" || qe(e.initial) || qe(e.animate) || qe(e.whileHover) || qe(e.whileDrag) || qe(e.whileTap) || qe(e.whileFocus) || qe(e.exit);
}
function al(e) {
  return !!(Yr(e) || e.variants);
}
function bp(e, t, n) {
  e.hasValue(t) ? e.getValue(t)?.set(n) : e.addValue(t, ge(n));
}
function wi(e, t) {
  var n = Kr(e, t), r = n ? e.makeTargetAnimatable(n, !1) : {}, o = r.transitionEnd, { transition: i, transitionEnd: a = o === void 0 ? {} : o, ...s } = r;
  s = Object.assign(Object.assign({}, s), a);
  for (var u in s) {
    var l = pp(s[u]);
    bp(e, u, l);
  }
}
function Mo(e, t) {
  var n = [...t].reverse();
  n.forEach((r) => {
    var o, i = e.getVariant(r);
    i && wi(e, i), (o = e.variantChildren) === null || o === void 0 || o.forEach((a) => {
      Mo(a, t);
    });
  });
}
function _p(e, t) {
  if (Array.isArray(t))
    return Mo(e, t);
  if (typeof t == "string")
    return Mo(e, [t]);
  wi(e, t);
}
function wp(e, t, n) {
  var r, o, i, a, s = Object.keys(t).filter((h) => !e.hasValue(h)), u = s.length;
  if (u)
    for (var l = 0; l < u; l++) {
      var f = s[l], c = t[f], d = null;
      Array.isArray(c) && (d = c[0]), d === null && (d = (o = (r = n[f]) !== null && r !== void 0 ? r : e.readValue(f)) !== null && o !== void 0 ? o : t[f]), d != null && (typeof d == "string" && dp(d) ? d = Number.parseFloat(d) : !mp(d) && dt.test(c) && (d = bi(f, c)), e.addValue(f, ge(d)), (i = (a = n)[f]) !== null && i !== void 0 || (a[f] = d), e.setBaseTarget(f, d));
    }
}
function Sp(e, t) {
  if (t) {
    var n = t[e] || t.default || t;
    return n.from;
  }
}
function xp(e, t, n) {
  var r, o, i = {};
  for (var a in e)
    i[a] = (r = Sp(a, t)) !== null && r !== void 0 ? r : (o = n.getValue(a)) === null || o === void 0 ? void 0 : o.get();
  return i;
}
function sl(e, t, n = {}) {
  e.notifyAnimationStart();
  var r;
  if (Array.isArray(t)) {
    var o = t.map((a) => Lo(e, a, n));
    r = Promise.all(o);
  } else if (typeof t == "string")
    r = Lo(e, t, n);
  else {
    var i = typeof t == "function" ? Kr(e, t, n.custom) : t;
    r = ul(e, i, n);
  }
  return r.then(() => e.notifyAnimationComplete(t));
}
function Lo(e, t, n = {}) {
  var r;
  n === void 0 && (n = {});
  var o = Kr(e, t, n.custom), i = (o || {}).transition, a = i === void 0 ? e.getDefaultTransition() || {} : i;
  n.transitionOverride && (a = n.transitionOverride);
  var s = o ? () => ul(e, o, n) : () => Promise.resolve(), u = !((r = e.variantChildren) === null || r === void 0) && r.size ? (d) => {
    d === void 0 && (d = 0);
    var h = a.delayChildren, p = h === void 0 ? 0 : h, g = a.staggerChildren, y = a.staggerDirection;
    return Pp(
      e,
      t,
      p + d,
      g,
      y,
      n
    );
  } : () => Promise.resolve(), l = a.when;
  if (l) {
    var [f, c] = l === "beforeChildren" ? [s, u] : [u, s];
    return f().then(c);
  }
  return Promise.all([s(), u(n.delay)]);
}
function ul(e, t, n) {
  var r, o = n === void 0 ? {} : n, i = o.delay, a = i === void 0 ? 0 : i, s = o.transitionOverride, u = o.type, l = e.makeTargetAnimatable(t), { transition: f = e.getDefaultTransition(), transitionEnd: c, ...d } = l;
  s && (f = s);
  var h = [], p = u && ((r = e.animationState) === null || r === void 0 ? void 0 : r.getState()[u]);
  for (var g in d) {
    var y = e.getValue(g), m = d[g];
    if (!(!y || m === void 0 || p && Tp(p, g))) {
      var b = Hn(g, y, m, Object.assign({ delay: a }, f));
      h.push(b);
    }
  }
  return Promise.all(h).then(() => {
    c && wi(e, c);
  });
}
function Pp(e, t, n, r, o, i) {
  n === void 0 && (n = 0), r === void 0 && (r = 0), o === void 0 && (o = 1);
  var a = [], s = (e.variantChildren.size - 1) * r, u = o === 1 ? (l) => (l === void 0 && (l = 0), l * r) : (l) => (l === void 0 && (l = 0), s - l * r);
  return Array.from(e.variantChildren).sort(Ep).forEach((l, f) => {
    a.push(
      Lo(
        l,
        t,
        Object.assign(Object.assign({}, i), { delay: n + u(f) })
      ).then(() => l.notifyAnimationComplete(t))
    );
  }), Promise.all(a);
}
function Cp(e) {
  e.forEachValue((t) => t.stop());
}
function Ep(e, t) {
  return e.sortNodePosition(t);
}
function Tp(e, t) {
  var n = e.protectedKeys, r = e.needsAnimating, o = n.hasOwnProperty(t) && r[t] !== !0;
  return r[t] = !1, o;
}
var Si = [
  re.Animate,
  re.Hover,
  re.Tap,
  re.Drag,
  re.Focus,
  re.Exit
], Ap = [...Si].reverse(), Vp = Si.length;
function Op(e) {
  return (t) => Promise.all(
    t.map((n) => {
      var r = n.animation, o = n.options;
      return sl(e, r, o);
    })
  );
}
function Da(e) {
  var t = Op(e), n = Lp(), r = {}, o = !0, i = (f, c) => {
    var d = Kr(e, c);
    if (d) {
      var { transition: h, transitionEnd: p, ...g } = d;
      f = Object.assign(Object.assign(Object.assign({}, f), g), p);
    }
    return f;
  };
  function a(f) {
    return r[f] !== void 0;
  }
  function s(f) {
    t = f(e);
  }
  function u(f, c) {
    for (var d, h = e.getProps(), p = e.getVariantContext(!0) || {}, g = [], y = /* @__PURE__ */ new Set(), m = {}, b = Number.POSITIVE_INFINITY, _ = (S) => {
      var A = Ap[S], B = n[A], R = (d = h[A]) !== null && d !== void 0 ? d : p[A], j = qe(R), te = A === c ? B.isActive : null;
      te === !1 && (b = S);
      var k = R === p[A] && R !== h[A] && j;
      if (k && o && e.manuallyAnimateOnMount && (k = !1), B.protectedKeys = Object.assign({}, m), // If it isn't active and hasn't *just* been set as inactive
      !B.isActive && te === null || // If we didn't and don't have any defined prop for this animation type
      !R && !B.prevProp || // Or if the prop doesn't define an animation
      yi(R) || typeof R == "boolean")
        return "continue";
      var Z = Mp(B.prevProp, R) || // If we're making this variant active, we want to always make it active
      A === c && B.isActive && !k && j || // If we removed a higher-priority variant (i is in reverse order)
      S > b && j, de = Array.isArray(R) ? R : [R], ve = de.reduce(i, {});
      te === !1 && (ve = {});
      var _e = B.prevResolvedValues, Ke = _e === void 0 ? {} : _e, Fe = Object.assign(Object.assign({}, Ke), ve), Le = (Te) => {
        Z = !0, y.delete(Te), B.needsAnimating[Te] = !0;
      };
      for (var pe in Fe) {
        var Ne = ve[pe], he = Ke[pe];
        m.hasOwnProperty(pe) || (Ne !== he ? Bn(Ne) && Bn(he) ? nl(Ne, he) ? B.protectedKeys[pe] = !0 : Le(pe) : Ne !== void 0 ? Le(pe) : y.add(pe) : Ne !== void 0 && y.has(pe) ? Le(pe) : B.protectedKeys[pe] = !0);
      }
      B.prevProp = R, B.prevResolvedValues = ve, B.isActive && (m = Object.assign(Object.assign({}, m), ve)), o && e.blockInitialAnimation && (Z = !1), Z && !k && g.push.apply(g, [
        ...de.map((Te) => ({
          animation: Te,
          options: Object.assign({ type: A }, f)
        }))
      ]);
    }, w = 0; w < Vp; w++)
      _(w);
    if (r = Object.assign({}, m), y.size) {
      var C = {};
      y.forEach((S) => {
        var A = e.getBaseTarget(S);
        A !== void 0 && (C[S] = A);
      }), g.push({ animation: C });
    }
    var x = !!g.length;
    return o && h.initial === !1 && !e.manuallyAnimateOnMount && (x = !1), o = !1, x ? t(g) : Promise.resolve();
  }
  function l(f, c, d) {
    var h;
    return n[f].isActive === c ? Promise.resolve() : ((h = e.variantChildren) === null || h === void 0 || h.forEach((p) => {
      var g;
      return (g = p.animationState) === null || g === void 0 ? void 0 : g.setActive(f, c);
    }), n[f].isActive = c, u(d, f));
  }
  return {
    isAnimated: a,
    animateChanges: u,
    setActive: l,
    setAnimateFunction: s,
    getState: () => n
  };
}
function Mp(e, t) {
  return typeof t == "string" ? t !== e : ol(t) ? !nl(t, e) : !1;
}
function Yt(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Lp() {
  var e;
  return e = {}, e[re.Animate] = Yt(!0), e[re.Hover] = Yt(), e[re.Tap] = Yt(), e[re.Drag] = Yt(), e[re.Focus] = Yt(), e[re.Exit] = Yt(), e;
}
class Dp {
  children = [];
  isDirty = !1;
  add = (t) => {
    Qu(this.children, t), this.isDirty = !0;
  };
  remove = (t) => {
    $u(this.children, t), this.isDirty = !0;
  };
  forEach = (t) => {
    this.isDirty && this.children.sort($o);
    for (var n = this.children.length, r = 0; r < n; r++)
      t(this.children[r]);
  };
}
var ur = [
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
function Rp() {
  var e = ur.map(() => new pr()), t = {}, n = {
    clearAllListeners: () => e.forEach((r) => r.clear()),
    updatePropListeners: (r) => ur.forEach((o) => {
      var i;
      (i = t[o]) === null || i === void 0 || i.call(t);
      var a = "on" + o, s = r[a];
      s && (t[o] = n[a](s));
    })
  };
  return e.forEach((r, o) => {
    n["on" + ur[o]] = (i) => r.add(i), n["notify" + ur[o]] = (...i) => r.notify.apply(r, i);
  }), n;
}
function jp(e, t, n) {
  var r;
  for (var o in t) {
    var i = t[o], a = n[o];
    if (Qe(i))
      e.addValue(o, i);
    else if (Qe(a))
      e.addValue(o, ge(i));
    else if (a !== i)
      if (e.hasValue(o)) {
        var s = e.getValue(o);
        s?.hasAnimated && s.set(i);
      } else
        e.addValue(o, ge((r = e.getStaticValue(o)) !== null && r !== void 0 ? r : i));
  }
  for (var o in n)
    t[o] === void 0 && e.removeValue(o);
  return t;
}
function Ip({ delta: e, layout: t, layoutCorrected: n, treeScale: r }, { target: o }, i, a) {
  kv(n, t), Yv(n, r, i), Ju(e, n, o, a);
}
var ll = function({
  treeType: e,
  build: t,
  getBaseTarget: n,
  makeTargetAnimatable: r,
  measureViewportBox: o,
  render: i,
  readValueFromInstance: a,
  resetTransform: s,
  restoreTransform: u,
  removeValueFromRenderState: l,
  sortNodePosition: f,
  scrapeMotionValuesFromProps: c
}) {
  return function({ parent: d, props: h, presenceId: p, blockInitialAnimation: g, visualState: y }, m) {
    m === void 0 && (m = {});
    var b = y.latestValues, _ = y.renderState, w, C = Rp(), x = ep(), S, A = x, B = b, R, j = el(), te, k = !1, Z = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), ve = {}, _e, Ke = Object.assign({}, b), Fe;
    function Le() {
      w && (M.isProjectionReady() && (Oo(A.targetFinal, A.target, B), Ju(j.deltaFinal, j.layoutCorrected, A.targetFinal, b)), pe(), i(w, _));
    }
    function pe() {
      var P = b;
      if (te && te.isActive()) {
        var T = te.getCrossfadeState(M);
        T && (P = T);
      }
      t(M, _, P, A, j, m, h);
    }
    function Ne() {
      C.notifyUpdate(b);
    }
    function he() {
      if (M.isProjectionReady()) {
        var P = j.delta, T = j.treeScale, W = T.x, ne = T.y, ue = j.deltaTransform;
        Ip(j, A, M.path, b), k && M.notifyViewportBoxUpdate(A.target, P), k = !1;
        var Be = kr(P, T);
        (Be !== ue || // Also compare calculated treeScale, for values that rely on this only for scale correction
        W !== T.x || ne !== T.y) && M.scheduleRender(), j.deltaTransform = Be;
      }
    }
    function Te() {
      M.layoutTree.forEach(Np);
    }
    function st(P, T) {
      var W = T.onChange(function(ue) {
        b[P] = ue, h.onUpdate && Ie.update(Ne, !1, !0);
      }), ne = T.onRenderRequest(M.scheduleRender);
      de.set(P, function() {
        W(), ne();
      });
    }
    var Ae = c(h);
    for (var ie in Ae) {
      var Ye = Ae[ie];
      b[ie] !== void 0 && Qe(Ye) && Ye.set(b[ie], !1);
    }
    var et = Yr(h), De = al(h), M = Object.assign(
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
          depth: d ? d.depth + 1 : 0,
          parent: d,
          children: /* @__PURE__ */ new Set(),
          /**
           * An ancestor path back to the root visual element. This is used
           * by layout projection to quickly recurse back up the tree.
           */
          path: d ? [...d.path, d] : [],
          layoutTree: d ? d.layoutTree : new Dp(),
          /**
           *
           */
          presenceId: p,
          projection: x,
          /**
           * If this component is part of the variant tree, it should track
           * any children that are also part of the tree. This is essentially
           * a shadow tree to simplify logic around how to stagger over children.
           */
          variantChildren: De ? /* @__PURE__ */ new Set() : void 0,
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
          manuallyAnimateOnMount: !!d?.isMounted(),
          /**
           * This can be set by AnimatePresence to force components that mount
           * at the same time as it to mount as if they have initial={false} set.
           */
          blockInitialAnimation: g,
          /**
           * Determine whether this component has mounted yet. This is mostly used
           * by variant children to determine whether they need to trigger their
           * own animations on mount.
           */
          isMounted: function() {
            return !!w;
          },
          mount: function(P) {
            w = M.current = P, M.pointTo(M), De && d && !et && (Fe = d?.addVariantChild(M)), d?.children.add(M);
          },
          /**
           *
           */
          unmount: function() {
            En.update(Ne), En.render(Le), En.preRender(M.updateLayoutProjection), de.forEach(function(P) {
              return P();
            }), M.stopLayoutAnimation(), M.layoutTree.remove(M), Fe?.(), d?.children.delete(M), R?.(), C.clearAllListeners();
          },
          /**
           * Add a child visual element to our set of children.
           */
          addVariantChild: function(P) {
            var T, W = M.getClosestVariantNode();
            if (W)
              return (T = W.variantChildren) === null || T === void 0 || T.add(P), function() {
                return W?.variantChildren?.delete(P);
              };
          },
          sortNodePosition: function(P) {
            return !f || e !== P.treeType ? 0 : f(M.getInstance(), P.getInstance());
          },
          /**
           * Returns the closest variant node in the tree starting from
           * this visual element.
           */
          getClosestVariantNode: function() {
            return De ? M : d?.getClosestVariantNode();
          },
          /**
           * A method that schedules an update to layout projections throughout
           * the tree. We inherit from the parent so there's only ever one
           * job scheduled on the next frame - that of the root visual element.
           */
          scheduleUpdateLayoutProjection: d ? d.scheduleUpdateLayoutProjection : function() {
            return Ie.preRender(M.updateTreeLayoutProjection, !1, !0);
          },
          /**
           * Expose the latest layoutId prop.
           */
          getLayoutId: function() {
            return h.layoutId;
          },
          /**
           * Returns the current instance.
           */
          getInstance: function() {
            return w;
          },
          /**
           * Get/set the latest static values.
           */
          getStaticValue: function(P) {
            return b[P];
          },
          setStaticValue: function(P, T) {
            return b[P] = T;
          },
          /**
           * Returns the latest motion value state. Currently only used to take
           * a snapshot of the visual element - perhaps this can return the whole
           * visual state
           */
          getLatestValues: function() {
            return b;
          },
          /**
           * Set the visiblity of the visual element. If it's changed, schedule
           * a render to reflect these changes.
           */
          setVisibility: function(P) {
            M.isVisible !== P && (M.isVisible = P, M.scheduleRender());
          },
          /**
           * Make a target animatable by Popmotion. For instance, if we're
           * trying to animate width from 100px to 100vw we need to measure 100vw
           * in pixels to determine what we really need to animate to. This is also
           * pluggable to support Framer's custom value types like Color,
           * and CSS variables.
           */
          makeTargetAnimatable: function(P, T) {
            return T === void 0 && (T = !0), r(M, P, h, T);
          },
          // Motion values ========================
          /**
           * Add a motion value and bind it to this visual element.
           */
          addValue: function(P, T) {
            M.hasValue(P) && M.removeValue(P), Z.set(P, T), b[P] = T.get(), st(P, T);
          },
          /**
           * Remove a motion value and unbind any active subscriptions.
           */
          removeValue: function(P) {
            var T;
            Z.delete(P), (T = de.get(P)) === null || T === void 0 || T(), de.delete(P), delete b[P], l(P, _);
          },
          /**
           * Check whether we have a motion value for this key
           */
          hasValue: function(P) {
            return Z.has(P);
          },
          /**
           * Get a motion value for this key. If called with a default
           * value, we'll create one if none exists.
           */
          getValue: function(P, T) {
            var W = Z.get(P);
            return W === void 0 && T !== void 0 && (W = ge(T), M.addValue(P, W)), W;
          },
          /**
           * Iterate over our motion values.
           */
          forEachValue: function(P) {
            return Z.forEach(P);
          },
          /**
           * If we're trying to animate to a previously unencountered value,
           * we need to check for it in our state and as a last resort read it
           * directly from the instance (which might have performance implications).
           */
          readValue: function(P) {
            var T;
            return (T = b[P]) !== null && T !== void 0 ? T : a(w, P, m);
          },
          /**
           * Set the base target to later animate back to. This is currently
           * only hydrated on creation and when we first read a value.
           */
          setBaseTarget: function(P, T) {
            Ke[P] = T;
          },
          /**
           * Find the base target for a value thats been removed from all animation
           * props.
           */
          getBaseTarget: function(P) {
            if (n) {
              var T = n(h, P);
              if (T !== void 0 && !Qe(T)) return T;
            }
            return Ke[P];
          }
        },
        C
      ),
      {
        /**
         * Build the renderer state based on the latest visual state.
         */
        build: function() {
          return pe(), _;
        },
        /**
         * Schedule a render on the next animation frame.
         */
        scheduleRender: function() {
          Ie.render(Le, !1, !0);
        },
        /**
         * Synchronously fire render. It's prefered that we batch renders but
         * in many circumstances, like layout measurement, we need to run this
         * synchronously. However in those instances other measures should be taken
         * to batch reads/writes.
         */
        syncRender: Le,
        /**
         * Update the provided props. Ensure any newly-added motion values are
         * added to our map, old ones removed, and listeners updated.
         */
        setProps: function(P) {
          h = P, C.updatePropListeners(P), ve = jp(M, c(h), ve);
        },
        getProps: function() {
          return h;
        },
        // Variants ==============================
        /**
         * Returns the variant definition with a given name.
         */
        getVariant: function(P) {
          var T;
          return (T = h.variants) === null || T === void 0 ? void 0 : T[P];
        },
        /**
         * Returns the defined default transition on this component.
         */
        getDefaultTransition: function() {
          return h.transition;
        },
        /**
         * Used by child variant nodes to get the closest ancestor variant props.
         */
        getVariantContext: function(P) {
          if (P === void 0 && (P = !1), P) return d?.getVariantContext();
          if (!et) {
            var T = d?.getVariantContext() || {};
            return h.initial !== void 0 && (T.initial = h.initial), T;
          }
          for (var W = {}, ne = 0; ne < Bp; ne++) {
            var ue = fl[ne], Be = h[ue];
            (qe(Be) || Be === !1) && (W[ue] = Be);
          }
          return W;
        },
        // Layout projection ==============================
        /**
         * Enable layout projection for this visual element. Won't actually
         * occur until we also have hydrated layout measurements.
         */
        enableLayoutProjection: function() {
          x.isEnabled = !0, M.layoutTree.add(M);
        },
        /**
         * Lock the projection target, for instance when dragging, so
         * nothing else can try and animate it.
         */
        lockProjectionTarget: function() {
          x.isTargetLocked = !0;
        },
        unlockProjectionTarget: function() {
          M.stopLayoutAnimation(), x.isTargetLocked = !1;
        },
        getLayoutState: function() {
          return j;
        },
        setCrossfader: function(P) {
          te = P;
        },
        isProjectionReady: function() {
          return x.isEnabled && x.isHydrated && j.isHydrated;
        },
        /**
         * Start a layout animation on a given axis.
         */
        startLayoutAnimation: function(P, T, W) {
          W === void 0 && (W = !1);
          var ne = M.getProjectionAnimationProgress()[P], ue = W ? x.relativeTarget[P] : x.target[P], Be = ue.min, $n = ue.max, er = $n - Be;
          return ne.clearListeners(), ne.set(Be), ne.set(Be), ne.onChange(function(tr) {
            M.setProjectionTargetAxis(P, tr, tr + er, W);
          }), M.animateMotionValue(P, ne, 0, T);
        },
        /**
         * Stop layout animations.
         */
        stopLayoutAnimation: function() {
          Me(function(P) {
            return M.getProjectionAnimationProgress()[P].stop();
          });
        },
        /**
         * Measure the current viewport box with or without transforms.
         * Only measures axis-aligned boxes, rotate and skew must be manually
         * removed with a re-render to work.
         */
        measureViewportBox: function(P) {
          P === void 0 && (P = !0);
          var T = o(w, m);
          return P || Zu(T, b), T;
        },
        /**
         * Get the motion values tracking the layout animations on each
         * axis. Lazy init if not already created.
         */
        getProjectionAnimationProgress: function() {
          return _e || (_e = {
            x: ge(0),
            y: ge(0)
          }), _e;
        },
        /**
         * Update the projection of a single axis. Schedule an update to
         * the tree layout projection.
         */
        setProjectionTargetAxis: function(P, T, W, ne) {
          ne === void 0 && (ne = !1);
          var ue;
          ne ? (x.relativeTarget || (x.relativeTarget = Et()), ue = x.relativeTarget[P]) : (x.relativeTarget = void 0, ue = x.target[P]), x.isHydrated = !0, ue.min = T, ue.max = W, k = !0, C.notifySetAxisTarget();
        },
        /**
         * Rebase the projection target on top of the provided viewport box
         * or the measured layout. This ensures that non-animating elements
         * don't fall out of sync differences in measurements vs projections
         * after a page scroll or other relayout.
         */
        rebaseProjectionTarget: function(P, T) {
          T === void 0 && (T = j.layout);
          var W = M.getProjectionAnimationProgress(), ne = W.x, ue = W.y, Be = !x.relativeTarget && !x.isTargetLocked && !ne.isAnimating() && !ue.isAnimating();
          (P || Be) && Me(function($n) {
            var er = T[$n], tr = er.min, Il = er.max;
            M.setProjectionTargetAxis($n, tr, Il);
          });
        },
        /**
         * Notify the visual element that its layout is up-to-date.
         * Currently Animate.tsx uses this to check whether a layout animation
         * needs to be performed.
         */
        notifyLayoutReady: function(P) {
          $v(M), M.notifyLayoutUpdate(j.layout, M.prevViewportBox || j.layout, P);
        },
        /**
         * Temporarily reset the transform of the instance.
         */
        resetTransform: function() {
          return s(M, w, h);
        },
        restoreTransform: function() {
          return u(w, _);
        },
        updateLayoutProjection: he,
        updateTreeLayoutProjection: function() {
          M.layoutTree.forEach(Fp), Ie.preRender(Te, !1, !0);
        },
        getProjectionParent: function() {
          if (S === void 0) {
            for (var P = !1, T = M.path.length - 1; T >= 0; T--) {
              var W = M.path[T];
              if (W.projection.isEnabled) {
                P = W;
                break;
              }
            }
            S = P;
          }
          return S;
        },
        resolveRelativeTargetBox: function() {
          var P = M.getProjectionParent();
          if (!(!x.relativeTarget || !P) && (Xv(x, P.projection), qu(P))) {
            var T = x.target;
            Oo(T, T, P.getLatestValues());
          }
        },
        shouldResetTransform: function() {
          return !!h._layoutResetTransform;
        },
        /**
         *
         */
        pointTo: function(P) {
          A = P.projection, B = P.getLatestValues(), R?.(), R = Qn(
            P.onSetAxisTarget(M.scheduleUpdateLayoutProjection),
            P.onLayoutAnimationComplete(function() {
              var T;
              M.isPresent ? M.presence = Se.Present : (T = M.layoutSafeToRemove) === null || T === void 0 || T.call(M);
            })
          );
        },
        // TODO: Clean this up
        isPresent: !0,
        presence: Se.Entering
      }
    );
    return M;
  };
};
function Fp(e) {
  e.resolveRelativeTargetBox();
}
function Np(e) {
  e.updateLayoutProjection();
}
var fl = ["initial", ...Si], Bp = fl.length;
function cl(e, { style: t, vars: n }) {
  Object.assign(e.style, t);
  for (var r in n)
    e.style.setProperty(r, n[r]);
}
function xi(e) {
  var t = e.style, n = {};
  for (var r in t)
    (Qe(t[r]) || ju(r, e)) && (n[r] = t[r]);
  return n;
}
function Up(e) {
  return window.getComputedStyle(e);
}
var dl = {
  treeType: "dom",
  readValueFromInstance: (e, t) => {
    if (zr(t)) {
      var n = gi(t);
      return n && n.default || 0;
    } else {
      var r = Up(e);
      return (Iu(t) ? r.getPropertyValue(t) : r[t]) || 0;
    }
  },
  sortNodePosition: (e, t) => e.compareDocumentPosition(t) & 2 ? 1 : -1,
  getBaseTarget: (e, t) => {
    var n;
    return (n = e.style) === null || n === void 0 ? void 0 : n[t];
  },
  measureViewportBox: (e, t) => {
    var n = t.transformPagePoint;
    return zu(e, n);
  },
  /**
   * Reset the transform on the current Element. This is called as part
   * of a batched process across the entire layout tree. To remove this write
   * cycle it'd be interesting to see if it's possible to "undo" all the current
   * layout transforms up the tree in the same way this.getBoundingBoxWithoutTransforms
   * works
   */
  resetTransform: (e, t, n) => {
    var r = n.transformTemplate;
    t.style.transform = r ? r({}, "") : "none", e.scheduleRender();
  },
  restoreTransform: (e, t) => {
    e.style.transform = t.style.transform;
  },
  removeValueFromRenderState: (e, t) => {
    var n = t.vars, r = t.style;
    delete n[e], delete r[e];
  },
  /**
   * Ensure that HTML and Framer-specific value types like `px`->`%` and `Color`
   * can be animated by Motion.
   */
  makeTargetAnimatable: (e, t, n, r) => {
    var o = n.transformValues;
    r === void 0 && (r = !0);
    var { transition: i, transitionEnd: a, ...s } = t, u = xp(s, i || {}, e);
    if (o && (a && (a = o(a)), s && (s = o(s)), u && (u = o(u))), r) {
      wp(e, s, u);
      var l = Hv(e, s, u, a);
      a = l.transitionEnd, s = l.target;
    }
    return Object.assign({ transition: i, transitionEnd: a }, s);
  },
  scrapeMotionValuesFromProps: xi,
  build: (e, t, n, r, o, i, a) => {
    e.isVisible !== void 0 && (t.style.visibility = e.isVisible ? "visible" : "hidden");
    var s = r.isEnabled && o.isHydrated;
    pi(
      t,
      n,
      r,
      o,
      i,
      a.transformTemplate,
      s ? kr : void 0,
      s ? tl : void 0
    );
  },
  render: cl
}, Hp = ll(dl), zp = /([a-z])([A-Z])/g, kp = "$1-$2", vl = function(e) {
  return e.replace(zp, kp).toLowerCase();
};
const pl = /* @__PURE__ */ new Set([
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
function hl(e, t) {
  cl(e, t);
  for (var n in t.attrs)
    e.setAttribute(pl.has(n) ? n : vl(n), t.attrs[n]);
}
function ml(e) {
  var t = xi(e);
  for (var n in e)
    if (Qe(e[n])) {
      var r = n === "x" || n === "y" ? "attr" + n.toUpperCase() : n;
      t[r] = e[n];
    }
  return t;
}
var Gp = ll(
  // @ts-expect-error
  Object.assign(Object.assign({}, dl), {
    getBaseTarget: (e, t) => e[t],
    readValueFromInstance: (e, t) => {
      var n;
      return zr(t) ? ((n = gi(t)) === null || n === void 0 ? void 0 : n.default) || 0 : (t = pl.has(t) ? t : vl(t), e.getAttribute(t));
    },
    scrapeMotionValuesFromProps: ml,
    build: (e, t, n, r, o, i, a) => {
      var s = r?.isEnabled && o?.isHydrated;
      mi(
        t,
        n,
        r,
        o,
        i,
        a.transformTemplate,
        s ? kr : void 0,
        s ? tl : void 0
      );
    },
    render: hl
  })
), Pi = function(e, t) {
  return e === "SVG" ? Gp(t, { enableHardwareAcceleration: !1 }) : Hp(t, { enableHardwareAcceleration: !0 });
}, gl = {
  //@ts-ignore
  scrapeMotionValuesFromProps: ml,
  createRenderState: Bu,
  onMount: function(e, t, n) {
    var r = n.renderState, o = n.latestValues;
    try {
      r.dimensions = typeof t.getBBox == "function" ? t.getBBox() : t.getBoundingClientRect();
    } catch {
      r.dimensions = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    Kp(t) && (r.totalPathLength = t.getTotalLength()), mi(r, o, void 0, void 0, { enableHardwareAcceleration: !1 }, e.transformTemplate), hl(t, r);
  }
};
function Kp(e) {
  return e.tagName === "path";
}
var yl = {
  //@ts-ignore
  scrapeMotionValuesFromProps: xi,
  createRenderState: hi
};
function Ra(e, t) {
  if (Yr(e)) {
    var n = e.initial, r = e.animate;
    return {
      initial: n === !1 || qe(n) ? n : void 0,
      animate: qe(r) ? r : void 0
    };
  }
  return e.inherit !== !1 ? t || {} : {};
}
function bl(e, t) {
  G(t, !1);
  const n = () => me(u, "$mc", r), [r, o] = it();
  let i = E(t, "props", 8), a = E(t, "isStatic", 8), s = E(t, "isCustom", 8, void 0), u = J(vt) || vt(s()), l = Ra(i(), se(u)), f = /* @__PURE__ */ L(l.initial), c = /* @__PURE__ */ L(l.animate);
  const d = (m) => Array.isArray(m) ? m.join(" ") : m, h = (m, b) => ({ initial: v(f), animate: v(c) });
  let p = /* @__PURE__ */ L(h());
  I(
    () => (v(f), v(c), V(i()), n()),
    () => {
      ((m) => {
        O(f, m.initial), O(c, m.animate);
      })(Ra(i(), n()));
    }
  ), I(
    () => (V(a()), v(f), v(c)),
    () => {
      a() && O(p, h(d(v(f)), d(v(c))));
    }
  ), oe(), Q();
  var g = H(), y = N(g);
  $(
    y,
    t,
    "default",
    {
      get value() {
        return v(p);
      }
    }
  ), F(e, g), K(), o();
}
function Yp(e) {
  var t = Qe(e) ? e.get() : e;
  return vp(t) ? t.toValue() : t;
}
const ja = ({ scrapeMotionValuesFromProps: e, createRenderState: t, onMount: n }, r, o, i) => {
  const a = {
    latestValues: qp(r, o, i, e),
    renderState: t()
  };
  return n && (a.mount = (s) => n(r, s, a)), a;
};
function qp(e, t, n, r) {
  const o = {}, i = n?.initial === !1, a = r(e);
  for (const d in a)
    o[d] = Yp(a[d]);
  let { initial: s, animate: u } = e;
  const l = Yr(e), f = al(e);
  t && f && !l && e.inherit !== !1 && (s ?? (s = t.initial), u ?? (u = t.animate));
  const c = i || s === !1 ? u : s;
  return c && typeof c != "boolean" && !yi(c) && (Array.isArray(c) ? c : [c]).forEach((h) => {
    const p = il(e, h);
    if (!p) return;
    const { transitionEnd: g, transition: y, ...m } = p;
    for (const b in m) o[b] = m[b];
    for (const b in g) o[b] = g[b];
  }), o;
}
function Wp(e, t) {
  G(t, !1);
  const n = () => me(f, "$context", o), r = () => me(c, "$presenceContext", o), [o, i] = it();
  let a = E(t, "config", 8, void 0), s = E(t, "props", 8), u = E(t, "isStatic", 8), l = E(t, "isCustom", 8, void 0);
  const f = J(vt) || vt(l()), c = J(Ge) || Ge(l());
  let d = /* @__PURE__ */ L(ja(a(), s(), se(f), se(c)));
  const h = ja;
  I(
    () => (V(u()), V(a()), V(s()), n(), r()),
    () => {
      u() && O(d, h(a(), s(), n(), r()));
    }
  ), oe(), Q();
  var p = H(), g = N(p);
  $(
    g,
    t,
    "default",
    {
      get state() {
        return v(d);
      }
    }
  ), F(e, p), K(), i();
}
const _l = Wp;
function Do(e) {
  return typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function Or(e, t, n) {
  return (r) => {
    var o;
    r && ((o = e.mount) === null || o === void 0 || o.call(e, r)), t && (r ? t.mount(r) : t.unmount()), n && (typeof n == "function" ? n(r) : Do(n) && (n.current = r));
  };
}
const Zt = (e) => kt("ScaleCorrection", e) || Ee([]), Ci = () => Ee([]), wl = (e) => {
  const t = J(Zt) || Zt(e), n = Zt();
  Ft(Zt, n), mn("ScaleCorrection", e, n), Ft(Ci, t);
};
function Sl(e, t) {
  G(t, !1);
  let n = E(t, "isCustom", 8);
  wl(n()), Q();
  var r = H(), o = N(r);
  $(o, t, "default", {}), F(e, r), K();
}
function Xp(e, t) {
  G(t, !1);
  let n = E(t, "visualElement", 12), r = E(t, "props", 8), o = r(), i = /* @__PURE__ */ L(o.animate);
  I(() => (v(i), V(r())), () => {
    ((a) => {
      O(i, a.animate);
    })(r());
  }), I(() => (V(n()), Da), () => {
    n(n().animationState = n().animationState || Da(n()), !0);
  }), I(
    () => (v(i), V(n())),
    () => {
      yi(v(i)) && Ut().then(() => v(
        i
        /*, [animate]*/
      ).subscribe(n()));
    }
  ), oe(), Q(), K();
}
function Zp(e, t) {
  G(t, !0);
  const n = () => me(v(s), "$presenceContext", o), r = () => me(v(u), "$presence", o), [o, i] = it(), a = /* @__PURE__ */ ct(() => t.props.custom), s = /* @__PURE__ */ ct(() => J(Ge) || Ge(t.isCustom)), u = /* @__PURE__ */ ct(() => Au(t.isCustom)), l = (d) => {
    const [h, p] = d, g = t.visualElement.animationState?.setActive(re.Exit, !h, { custom: n()?.custom ?? v(a) });
    !h && g?.then(p);
  };
  Ze(() => l(r()));
  var f = H(), c = N(f);
  pn(c, () => t.children ?? be), F(e, f), K(), i();
}
const xl = {
  animation: Xp,
  exit: Zp
};
function Jp(e, t) {
  t === void 0 && (t = !0);
  var n = e.getProjectionParent();
  if (!n)
    return !1;
  var r;
  return t ? (r = Vr(n.projection.target, e.projection.target), Zu(r, n.getLatestValues())) : r = Vr(n.getLayoutState().layout, e.getLayoutState().layout), Me(function(o) {
    return e.setProjectionTargetAxis(o, r[o].min, r[o].max, !0);
  }), !0;
}
function Pl(e, { min: t, max: n }, r) {
  return t !== void 0 && e < t ? e = r ? ce(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? ce(n, e, r.max) : Math.min(e, n)), e;
}
function Qp(e, t, n, r, o) {
  var i = e - t * n;
  return r ? Pl(i, r, o) : i;
}
function Ia(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0
  };
}
function $p(e, { top: t, left: n, bottom: r, right: o }) {
  return {
    x: Ia(e.x, n, o),
    y: Ia(e.y, t, r)
  };
}
function Fa(e, t) {
  var n, r = t.min - e.min, o = t.max - e.max;
  return t.max - t.min < e.max - e.min && (n = [o, r], [r, o] = n), {
    min: e.min + r,
    max: e.min + o
  };
}
function eh(e, t) {
  return {
    x: Fa(e.x, t.x),
    y: Fa(e.y, t.y)
  };
}
function th(e, t, n) {
  var r = e.max - e.min, o = ce(t.min, t.max - r, n);
  return { min: o, max: o + r };
}
function nh(e, t) {
  var n = {};
  return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
const Cl = 0.35;
function rh(e) {
  return e === !1 ? e = 0 : e === !0 && (e = Cl), {
    x: Na(e, "left", "right"),
    y: Na(e, "top", "bottom")
  };
}
function Na(e, t, n) {
  return {
    min: Ba(e, t),
    max: Ba(e, n)
  };
}
function Ba(e, t) {
  var n;
  return typeof e == "number" ? e : (n = e[t]) !== null && n !== void 0 ? n : 0;
}
var El = /* @__PURE__ */ new WeakMap(), Ua;
class oh {
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
  elastic = Et();
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
    this.visualElement = t, this.visualElement.enableLayoutProjection(), El.set(t, this);
  }
  /**
   * Instantiate a PanSession for the drag gesture
   *
   * @public
   */
  start = (t, { snapToCursor: n = !1, cursorProgress: r = void 0 } = {}) => {
    const o = (l) => {
      this.stopMotion();
      var f = zc(l).point;
      (l = this.cancelLayout) === null || l === void 0 || l.call(this);
      var c = this;
      this.cancelLayout = vo((d, h) => {
        var p = wr(c.visualElement), g = jc(c.visualElement), y = [...p, ...g], m = !1;
        c.isLayoutDrag() && c.visualElement.lockProjectionTarget(), h(() => {
          y.forEach((b) => b.resetTransform());
        }), d(() => {
          cr(c.visualElement), g.forEach(cr);
        }), h(() => {
          y.forEach((b) => b.restoreTransform()), n && (m = c.snapToCursor(f));
        }), d(() => {
          var b = !!(c.getAxisMotionValue("x") && !c.isExternalDrag());
          b || c.visualElement.rebaseProjectionTarget(!0, c.visualElement.measureViewportBox(!1)), c.visualElement.scheduleUpdateLayoutProjection();
          var _ = c.visualElement.projection;
          Me((w) => {
            if (!m) {
              var C = _.target[w], x = C.min, S = C.max;
              c.cursorProgress[w] = r ? r[w] : un(x, S, f[w]);
            }
            var A = c.getAxisMotionValue(w);
            A && (c.originPoint[w] = A.get());
          });
        }), h(() => {
          Xt.update(), Xt.preRender(), Xt.render(), Xt.postRender();
        }), d(() => c.resolveDragConstraints());
      });
    }, i = (l, f) => {
      const { drag: c, dragPropagation: d, onDragStart: h } = this.props;
      if (c && !d && (this.openGlobalLock && this.openGlobalLock(), this.openGlobalLock = Zs(c), !this.openGlobalLock))
        return;
      po(), this.isDragging = !0, this.currentDirection = null, h && h(l, f);
      const { animationState: p } = this.visualElement;
      p && p.setActive(re.Drag, !0);
    }, a = (l, f) => {
      const { dragPropagation: c, dragDirectionLock: d, onDirectionLock: h, onDrag: p } = this.props;
      if (!(!c && !this.openGlobalLock)) {
        var g = f.offset;
        if (d && this.currentDirection === null) {
          this.currentDirection = ih(g), this.currentDirection !== null && h && h(this.currentDirection);
          return;
        }
        this.updateAxis("x", f.point, g), this.updateAxis("y", f.point, g), p && p(l, f), Ua = l;
      }
    }, s = (l, f) => this.stop(l, f), u = this.props.transformPagePoint;
    this.panSession = new xu(
      t,
      {
        onSessionStart: o,
        // @ts-expect-error
        onStart: i,
        // @ts-expect-error
        onMove: a,
        // @ts-expect-error
        onSessionEnd: s
      },
      { transformPagePoint: u }
    );
  };
  resolveDragConstraints = () => {
    const { dragConstraints: t, dragElastic: n } = this.props;
    var r = this.visualElement.getLayoutState().layoutCorrected;
    t ? this.constraints = Do(t) ? this.resolveRefConstraints(r, t) : $p(r, t) : this.constraints = !1, this.elastic = rh(n), this.constraints && !this.hasMutatedConstraints && Me((o) => {
      this.getAxisMotionValue(o) && (this.constraints[o] = nh(r[o], this.constraints[o]));
    });
  };
  resolveRefConstraints = (t, n) => {
    const { transformPagePoint: r, onMeasureDragConstraints: o } = this.props, i = n.current;
    rl(
      i !== null,
      "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop."
    ), this.constraintsBox = zu(i, r);
    var a = eh(t, this.constraintsBox);
    if (o) {
      var s = o(Lc(a));
      this.hasMutatedConstraints = !!s, s && (a = Ks(s));
    }
    return a;
  };
  cancelDrag = () => {
    var t;
    this.visualElement.unlockProjectionTarget(), (t = this.cancelLayout) === null || t === void 0 || t.call(this), this.isDragging = !1;
    const { projection: n, animationState: r } = this.visualElement;
    this.panSession && this.panSession.end(), this.panSession = void 0, !this.props.dragPropagation && this.openGlobalLock && (this.openGlobalLock(), this.openGlobalLock = null), r && r.setActive(re.Drag, !1);
  };
  stop = (t, n) => {
    var r;
    (r = this.panSession) === null || r === void 0 || r.end(), this.panSession = void 0;
    var o = this.isDragging;
    if (this.cancelDrag(), !o) return;
    var i = n.velocity;
    this.animateDragEnd(i);
    const { onDragEnd: a } = this.props;
    a && a(t, n);
  };
  snapToCursor = (t) => Me((n) => {
    var r = this.props.drag;
    if (lr(n, r, this.currentDirection)) {
      var o = this.getAxisMotionValue(n);
      if (o) {
        var i = this.visualElement.getLayoutState().layout, a = i[n].max - i[n].min, s = i[n].min + a / 2, u = t[n] - s;
        this.originPoint[n] = t[n], o.set(u);
      } else
        return this.cursorProgress[n] = 0.5, !0;
    }
  }).includes(!0);
  /**
   * Update the specified axis with the latest pointer information.
   */
  updateAxis = (t, n, r) => {
    var o = this.props.drag;
    if (lr(t, o, this.currentDirection))
      return this.getAxisMotionValue(t) ? this.updateAxisMotionValue(t, r) : this.updateVisualElementAxis(t, n);
  };
  updateAxisMotionValue = (t, n) => {
    var r = this.getAxisMotionValue(t);
    if (!(!n || !r)) {
      var o = this.originPoint[t] + n[t], i = this.constraints ? Pl(o, this.constraints[t], this.elastic[t]) : o;
      r.set(i);
    }
  };
  updateVisualElementAxis = (t, n) => {
    var r, o = this.visualElement.getLayoutState().layout[t], i = o.max - o.min, a = this.cursorProgress[t], s = Qp(
      n[t],
      i,
      a,
      // @ts-expect-error
      (r = this.constraints) === null || r === void 0 ? void 0 : r[t],
      this.elastic[t]
    );
    this.visualElement.setProjectionTargetAxis(t, s, s + i);
  };
  setProps = ({
    drag: t = !1,
    dragDirectionLock: n = !1,
    dragPropagation: r = !1,
    dragConstraints: o = !1,
    dragElastic: i = Cl,
    dragMomentum: a = !0,
    ...s
  }) => {
    this.props = {
      ...s,
      drag: t,
      dragDirectionLock: n,
      dragPropagation: r,
      dragConstraints: o,
      dragElastic: i,
      dragMomentum: a
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
    var n = this.props, r = n.layout, o = n.layoutId, i = "_drag" + t.toUpperCase();
    if (this.props[i])
      return this.props[i];
    if (!r && o === void 0)
      return this.visualElement.getValue(t, 0);
  };
  isLayoutDrag = () => !this.getAxisMotionValue("x");
  isExternalDrag = () => {
    var t = this.props, n = t._dragX, r = t._dragY;
    return n || r;
  };
  animateDragEnd = (t) => {
    var n = this.props, r = n.drag, o = n.dragMomentum, i = n.dragElastic, a = n.dragTransition, s = Jp(this.visualElement, this.isLayoutDrag() && !this.isExternalDrag()), u = this.constraints || {};
    if (s && Object.keys(u).length && this.isLayoutDrag()) {
      var l = this.visualElement.getProjectionParent();
      if (l) {
        var f = Vr(l.projection.targetFinal, u);
        Me((d) => {
          var h = f[d], p = h.min, g = h.max;
          u[d] = {
            min: isNaN(p) ? void 0 : p,
            max: isNaN(g) ? void 0 : g
          };
        });
      }
    }
    var c = Me((d) => {
      var h;
      if (lr(d, r, this.currentDirection)) {
        var p = (
          // @ts-expect-error
          (h = u?.[d]) !== null && h !== void 0 ? h : {}
        ), g = i ? 200 : 1e6, y = i ? 40 : 1e7, m = Object.assign(
          Object.assign(
            {
              type: "inertia",
              velocity: o ? t[d] : 0,
              bounceStiffness: g,
              bounceDamping: y,
              timeConstant: 750,
              restDelta: 1,
              restSpeed: 10
            },
            a
          ),
          p
        );
        return this.getAxisMotionValue(d) ? this.startAxisValueAnimation(d, m) : this.visualElement.startLayoutAnimation(d, m, s);
      }
    });
    return Promise.all(c).then(() => {
      var d, h;
      (h = (d = this.props).onDragTransitionEnd) === null || h === void 0 || h.call(d);
    });
  };
  stopMotion = () => {
    Me((t) => {
      var n = this.getAxisMotionValue(t);
      n ? n.stop() : this.visualElement.stopLayoutAnimation();
    });
  };
  startAxisValueAnimation = (t, n) => {
    var r = this.getAxisMotionValue(t);
    if (r) {
      var o = r.get();
      return r.set(o), r.set(o), Hn(t, r, 0, n);
    }
  };
  scalePoint = () => {
    var t = this.props, n = t.drag, r = t.dragConstraints;
    if (!(!Do(r) || !this.constraintsBox)) {
      this.stopMotion();
      var o = { x: 0, y: 0 };
      Me((i) => {
        o[i] = Wv(this.visualElement.projection.target[i], this.constraintsBox[i]);
      }), this.updateConstraints(() => {
        Me((i) => {
          if (lr(i, n, null)) {
            var a = th(
              this.visualElement.projection.target[i],
              // @ts-expect-error
              this.constraintsBox[i],
              o[i]
            ), s = a.min, u = a.max;
            this.visualElement.setProjectionTargetAxis(i, s, u);
          }
        });
      }), setTimeout(po, 1);
    }
  };
  updateConstraints = (t) => {
    this.cancelLayout = vo((n, r) => {
      var o = wr(_this.visualElement);
      r(() => o.forEach((i) => i.resetTransform())), n(() => cr(this.visualElement)), r(() => o.forEach((i) => i.restoreTransform())), n(() => {
        this.resolveDragConstraints();
      }), t && r(t);
    });
  };
  mount = (t) => {
    var n = t.getInstance(), r = $t(n, "pointerdown", (s) => {
      var u = this.props, l = u.drag, f = u.dragListener, c = f === void 0 ? !0 : f;
      l && c && this.start(s);
    }), o = zt(window, "resize", () => {
      this.scalePoint();
    }), i = t.onLayoutUpdate(() => {
      this.isDragging && this.resolveDragConstraints();
    }), a = t.prevDragCursor;
    return a && this.start(Ua, { cursorProgress: a }), () => {
      r?.(), o?.(), i?.(), this.cancelDrag();
    };
  };
}
function lr(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function ih(e, t = 10) {
  var n = null;
  return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
function ah(e, t) {
  G(t, !0);
  const n = J(Ce) || Ce(t.isCustom);
  let r = new oh({ visualElement: t.visualElement }), o;
  const i = (c) => {
    o && o(), v(a) && (o = v(a).subscribe(c));
  }, a = /* @__PURE__ */ ct(() => t.props.dragControls), s = /* @__PURE__ */ ct(() => Ec(n).current), u = /* @__PURE__ */ ct(() => v(s).transformPagePoint);
  Ze(() => r.setProps({
    ...t.props,
    transformPagePoint: v(u)
  })), Ze(() => i(r)), hn(() => {
    o && o();
  }), at(() => r.mount(t.visualElement));
  var l = H(), f = N(l);
  pn(f, () => t.children ?? be), F(e, l), K();
}
const sh = {
  pan: Cu,
  drag: ah
}, uh = {
  tap: Tu,
  focus: Ws,
  hover: eu
}, Ha = 1e3;
function lh(e, t) {
  return !ka(e) && !ka(t) && (!zn(e.x, t.x) || !zn(e.y, t.y));
}
const za = { min: 0, max: 0 };
function ka(e) {
  return zn(e.x, za) && zn(e.y, za);
}
function zn(e, t) {
  return e.min === t.min && e.max === t.max;
}
const fh = { duration: 0.45, ease: [0.4, 0, 0.1, 1] };
function ch(e, t) {
  G(t, !1);
  let n = E(t, "visualElement", 12), r = E(t, "layout", 8, void 0), o = E(t, "safeToRemove", 8), i = Et(), a = Et(), s = { x: !1, y: !1 }, u = { x: void 0, y: void 0 }, l = !1;
  const f = (h, p, {
    originBox: g,
    targetBox: y,
    visibilityAction: m,
    shouldStackAnimate: b,
    onComplete: _,
    ...w
  } = {}) => {
    if (b === !1)
      return l = !1, o()();
    if (l && b !== !0)
      return;
    b && (l = !0), p = g || p, h = y || h;
    const C = lh(p, h), x = Me((S) => {
      if (r() === "position") {
        const A = h[S].max - h[S].min;
        p[S].max = p[S].min + A;
      }
      if (!n().projection.isTargetLocked)
        if (m !== void 0)
          n().setVisibility(m === m.Show);
        else return C ? c(S, h[S], p[S], w) : n().setProjectionTargetAxis(S, h[S].min, h[S].max);
    });
    return n().syncRender(), Promise.all(x).then(() => {
      l = !1, _ && _(), n().notifyLayoutAnimationComplete();
    });
  }, c = (h, p, g, { transition: y } = {}) => {
    if (u[h]?.(), s[h] && zn(p, a[h]))
      return;
    u[h]?.(), s[h] = !0;
    const m = i[h], b = n().getProjectionAnimationProgress()[h];
    b.clearListeners(), b.set(0), b.set(0);
    const _ = () => {
      const S = b.get() / Ha;
      Qv(m, g, p, S), n().setProjectionTargetAxis(h, m.min, m.max);
    };
    _();
    const w = b.onChange(_);
    u[h] = () => {
      s[h] = !1, b.stop(), w();
    }, a[h] = p;
    const C = y || n().getDefaultTransition() || fh;
    return Hn(h === "x" ? "layoutX" : "layoutY", b, Ha, C && Gr(C, "layout")).then(u[h]);
  };
  at(() => {
    n(n().animateMotionValue = Hn, !0), n().enableLayoutProjection();
    const h = n().onLayoutUpdate(f);
    return n(
      n().layoutSafeToRemove = function() {
        o()();
      },
      !0
    ), dv(Du), () => {
      h(), Me((p) => u[p]?.());
    };
  }), Q(), K();
}
function dh(e, t) {
  G(t, !1);
  const n = () => me(f, "$presence", r), [r, o] = it();
  let i = E(t, "visualElement", 8), a = E(t, "props", 8), s = E(t, "isCustom", 8), u = a(), l = /* @__PURE__ */ L(u.layout);
  const f = Au(s());
  I(() => (v(l), V(a())), () => {
    ((c) => {
      O(l, c.layout);
    })(a());
  }), oe(), Q(), ch(e, {
    get visualElement() {
      return i();
    },
    get layout() {
      return v(l);
    },
    get safeToRemove() {
      return n(), X(() => n()[1]);
    }
  }), K(), o();
}
function vh(e, t) {
  G(t, !1);
  let n = E(t, "visualElement", 8), r = E(t, "syncLayout", 8), o = E(t, "framerSyncLayout", 8), i = E(t, "update", 8);
  const a = J(Zt), s = J(Ci);
  at(() => {
    Vt(r()) && r().register(n()), Vt(o()) && o().register(n()), n().onUnmount(() => {
      Vt(r()) && r().remove(n()), Vt(o()) && o().remove(n());
    });
  });
  let u = !1;
  const l = (c = !1) => (u || (u = !0, se(a).forEach((d) => {
    d.updater?.(!0);
  }), Vt(r()) ? r().syncUpdate() : (qs(n(), c), r().add(n()))), null);
  i() === void 0 && Cc(l);
  const f = (c = !1) => {
    u = !1, se(a).forEach((h, p) => {
      h.afterU?.(!0);
    }), Vt(r()) || r().flush();
  };
  s.update((c) => c.concat([{ updater: l, afterU: f }])), Wo(f), I(() => V(i()), () => {
    i() !== void 0 && l(i());
  }), oe(), Q(), K();
}
function ph(e, t) {
  G(t, !1);
  const n = () => me(f, "$syncLayout", o), r = () => me(c, "$framerSyncLayout", o), [o, i] = it(), a = /* @__PURE__ */ L();
  let s = E(t, "visualElement", 8), u = E(t, "props", 8), l = E(t, "isCustom", 8);
  const f = J(jn) || jn(l()), c = J(Ki) || Ki(l());
  I(() => (v(a), V(u())), () => {
    ((d) => {
      O(a, d.update);
    })(u());
  }), oe(), Q(), vh(e, {
    get syncLayout() {
      return n();
    },
    get framerSyncLayout() {
      return r();
    },
    get visualElement() {
      return s();
    },
    get update() {
      return v(a);
    }
  }), K(), i();
}
var hh = {
  measureLayout: ph,
  layoutAnimation: dh
};
const Tl = {
  ...xl,
  ...uh,
  ...sh,
  ...hh
};
var mh = /* @__PURE__ */ Wn("<!> <!>", 1);
function gh(e, t) {
  const n = Ct(t, ["children", "$$slots", "$$events", "$$legacy"]), r = Ct(n, ["isSVG", "forwardMotionProps", "externalRef", "targetEl"]);
  G(t, !1);
  const o = () => me(m, "$a", i), [i, a] = it(), s = /* @__PURE__ */ L(), u = /* @__PURE__ */ L();
  let l = E(t, "isSVG", 8, !1), f = E(t, "forwardMotionProps", 8, !1), c = E(t, "externalRef", 8, void 0), d = E(
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
  tn(Tl);
  let h = l() ? "SVG" : "DOM", p = d() || !1, g = Pi, y = l() ? gl : yl;
  const m = J(Ce) || Ce(p);
  let b = /* @__PURE__ */ L(!1);
  const _ = (w, C) => (w.visualElement = C, C);
  at(() => {
    O(b, !0);
  }), I(() => V(r), () => {
    O(s, r);
  }), I(() => (v(u), o()), () => {
    ((w) => {
      O(u, w.isStatic);
    })(o() || {});
  }), oe(), Q(), Sl(e, {
    get isCustom() {
      return p;
    },
    children: (w, C) => {
      bl(w, {
        get props() {
          return v(s);
        },
        get isStatic() {
          return v(u);
        },
        children: je,
        $$slots: {
          default: (x, S) => {
            const A = /* @__PURE__ */ U(() => S.value);
            _l(x, {
              get config() {
                return y;
              },
              get props() {
                return v(s);
              },
              get isStatic() {
                return v(u);
              },
              get isCustom() {
                return p;
              },
              children: je,
              $$slots: {
                default: (B, R) => {
                  const j = /* @__PURE__ */ U(() => R.state);
                  Vu(B, {
                    get Component() {
                      return h;
                    },
                    get visualState() {
                      return v(j);
                    },
                    get createVisualElement() {
                      return g;
                    },
                    get props() {
                      return v(s);
                    },
                    get isCustom() {
                      return p;
                    },
                    children: je,
                    $$slots: {
                      default: (te, k) => {
                        const Z = /* @__PURE__ */ U(() => k.visualElement);
                        {
                          let de = /* @__PURE__ */ U(() => (V(v(A)), V(v(Z)), X(() => _(v(A), v(Z)))));
                          Ou(te, {
                            get visualElement() {
                              return v(de);
                            },
                            get props() {
                              return v(s);
                            },
                            children: je,
                            $$slots: {
                              default: (ve, _e) => {
                                const Ke = /* @__PURE__ */ U(() => _e.features);
                                var Fe = mh(), Le = N(Fe);
                                Mu(Le, {
                                  get value() {
                                    return v(A);
                                  },
                                  get isCustom() {
                                    return p;
                                  },
                                  children: (he, Te) => {
                                    {
                                      let st = /* @__PURE__ */ U(() => (V(Or), V(v(j)), V(v(A)), V(c()), X(() => Or(v(j), v(A).visualElement, c()))));
                                      Hu(he, {
                                        get Component() {
                                          return h;
                                        },
                                        get props() {
                                          return v(s);
                                        },
                                        get ref() {
                                          return v(st);
                                        },
                                        get visualState() {
                                          return v(j);
                                        },
                                        get isStatic() {
                                          return v(u);
                                        },
                                        get forwardMotionProps() {
                                          return f();
                                        },
                                        get targetEl() {
                                          return d();
                                        },
                                        children: je,
                                        $$slots: {
                                          default: (Ae, ie) => {
                                            const Ye = /* @__PURE__ */ U(() => ie.motion), et = /* @__PURE__ */ U(() => ie.props);
                                            var De = H(), M = N(De);
                                            $(
                                              M,
                                              t,
                                              "default",
                                              {
                                                get motion() {
                                                  return v(Ye);
                                                },
                                                get props() {
                                                  return v(et);
                                                }
                                              }
                                            ), F(Ae, De);
                                          }
                                        }
                                      });
                                    }
                                  },
                                  $$slots: { default: !0 }
                                });
                                var pe = yt(Le, 2);
                                {
                                  var Ne = (he) => {
                                    var Te = H(), st = N(Te);
                                    Yo(st, 1, () => v(Ke), (Ae) => Ae.key, (Ae, ie) => {
                                      var Ye = H(), et = N(Ye);
                                      qo(et, () => v(ie).Component, (De, M) => {
                                        M(De, {
                                          get props() {
                                            return v(ie), X(() => v(ie).props);
                                          },
                                          get visualElement() {
                                            return v(ie), X(() => v(ie).visualElement);
                                          },
                                          get isCustom() {
                                            return p;
                                          }
                                        });
                                      }), F(Ae, Ye);
                                    }), F(he, Te);
                                  };
                                  Ko(pe, (he) => {
                                    v(b) && he(Ne);
                                  });
                                }
                                F(ve, Fe);
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
  }), K(), a();
}
function Al(e) {
  var t = !1, n = [], r = /* @__PURE__ */ new Set(), o, i = {
    subscribe: (a) => (r.size === 0 && (o = e?.()), r.add(a), () => {
      r.delete(a), r.size === 0 && o?.();
    }),
    start: (a, s) => {
      if (t) {
        var u = [];
        return r.forEach((l) => {
          u.push(
            sl(l, a, {
              transitionOverride: s
            })
          );
        }), Promise.all(u);
      } else
        return new Promise((l) => {
          n.push({
            animation: [a, s],
            resolve: l
          });
        });
    },
    set: (a) => r.forEach((s) => {
      _p(s, a);
    }),
    stop: () => {
      r.forEach((a) => {
        Cp(a);
      });
    },
    mount: () => (t = !0, n.forEach((a) => {
      var s = a.animation, u = a.resolve;
      i.start.apply(i, s).then(u);
    }), () => {
      t = !1, i.stop();
    })
  };
  return i;
}
function Xh(e, t) {
  G(t, !1);
  let n = Al();
  at(n.mount), Q();
  var r = H(), o = N(r);
  $(
    o,
    t,
    "default",
    {
      get controls() {
        return n;
      }
    }
  ), F(e, r), K();
}
const Zh = () => {
  const e = Al(() => {
    const t = {};
    return Ut().then((n) => t.clean = e.mount()), () => {
      t.clean?.();
    };
  });
  return e;
};
var yh = /* @__PURE__ */ Wn("<div><!></div>");
function Jh(e, t) {
  const n = Ct(t, ["children", "$$slots", "$$events", "$$legacy"]), r = Ct(n, ["div"]);
  let o = E(t, "div", 24, () => ({}));
  gh(e, Us(() => r, {
    children: je,
    $$slots: {
      default: (i, a) => {
        const s = /* @__PURE__ */ U(() => a.motion), u = /* @__PURE__ */ U(() => a.props);
        var l = yh();
        Fs(l, () => ({ ...v(u), ...o() }));
        var f = _f(l);
        $(f, t, "default", {}), Ds(l, (c) => v(s)?.(c)), F(i, l);
      }
    }
  }));
}
let Ga = 0;
function bh() {
  const e = Ga;
  return Ga++, e;
}
function _h() {
  return /* @__PURE__ */ new Map();
}
function wh(e, t) {
  G(t, !0);
  let n = E(t, "onExitComplete", 3, void 0), r = E(t, "initial", 3, void 0), o = E(t, "custom", 3, void 0);
  const i = _h(), a = bh(), s = /* @__PURE__ */ ct(() => t.presenceAffectsLayout ? void 0 : t.isPresent), u = (h) => ({
    id: a,
    initial: r(),
    isPresent: t.isPresent,
    custom: o(),
    onExitComplete: (p) => {
      if (i.get(p) === !0) return;
      i.set(p, !0);
      let g = !0;
      i.forEach((y) => {
        y || (g = !1);
      }), g && n()?.();
    },
    register: (p) => (i.set(p, !1), () => i.delete(p))
  });
  let l = Ge();
  Ze(() => {
    t.presenceAffectsLayout && l.set(u());
  }), Ze(() => {
    v(s), X(() => l.set(u()));
  });
  const f = (h) => {
    i.forEach((p, g) => i.set(g, !1));
  };
  Ze(() => {
    f(t.isPresent), Ut().then(() => {
      !t.isPresent && !i.size && n()?.();
    });
  }), Ft(Ge, l), mn("Presence", t.isCustom, l);
  var c = H(), d = N(c);
  pn(d, () => t.children ?? be), F(e, c), K();
}
function Qh(e, t) {
  G(t, !1);
  const n = () => me(g, "$layoutContext", r), [r, o] = it(), i = /* @__PURE__ */ L();
  let a = E(t, "list", 8, void 0), s = E(t, "custom", 8, void 0), u = E(t, "initial", 8, !0), l = E(t, "onExitComplete", 8, void 0), f = E(t, "exitBeforeEnter", 8, void 0), c = E(t, "presenceAffectsLayout", 8, !0), d = E(t, "show", 8, void 0), h = E(t, "isCustom", 8, !1), p = /* @__PURE__ */ L(a() !== void 0 ? a() : d() ? [{ key: 1 }] : []);
  const g = J(jn) || jn(h());
  function y(R) {
    return R.key || "";
  }
  let m = /* @__PURE__ */ L(!0), b = /* @__PURE__ */ L(v(p)), _ = /* @__PURE__ */ L(v(b)), w = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Set();
  const x = (R, j) => {
    R.forEach((te) => {
      const k = y(te);
      j.set(k, te);
    });
  };
  let S = /* @__PURE__ */ L([
    ...v(b).map((R) => ({ present: !0, item: R, key: R.key, onExit: void 0 }))
  ]);
  I(() => (V(a()), V(d())), () => {
    O(p, a() !== void 0 ? a() : d() ? [{ key: 1 }] : []);
  }), I(() => (n(), v(p)), () => {
    O(i, () => {
      Vt(n()) && n().forceUpdate(), O(p, [...v(p)]);
    });
  }), I(() => v(p), () => {
    O(b, v(p));
  }), I(() => v(b), () => {
    x(v(b), w);
  }), I(
    () => (v(m), v(S), v(b), v(_), V(f()), v(i), V(l())),
    () => {
      if (v(m))
        O(m, !1);
      else {
        O(S, [
          ...v(b).map((k) => ({ present: !0, item: k, key: k.key, onExit: void 0 }))
        ]);
        const R = v(_).map(y), j = v(b).map(y), te = R.length;
        for (let k = 0; k < te; k++) {
          const Z = R[k];
          j.indexOf(Z) === -1 ? C.add(Z) : C.delete(Z);
        }
        f() && C.size && O(S, []), C.forEach((k) => {
          if (j.indexOf(k) !== -1) return;
          const Z = w.get(k);
          if (!Z) return;
          const de = R.indexOf(k), ve = () => {
            w.delete(k), C.delete(k);
            const _e = v(_).findIndex((Ke) => Ke.key === k);
            _e < 0 || (v(_).splice(_e, 1), C.size || (O(_, [...v(b)]), v(i)(), l() && l()()));
          };
          v(S).splice(de, 0, { present: !1, item: Z, key: y(Z), onExit: ve });
        }), O(_, v(S));
      }
    }
  ), oe(), Q();
  var A = H(), B = N(A);
  Yo(B, 1, () => v(S), (R) => y(R), (R, j) => {
    {
      let te = /* @__PURE__ */ U(() => u() ? void 0 : !1), k = /* @__PURE__ */ U(() => (v(j), V(s()), X(() => v(j).onExit ? s() : void 0)));
      wh(R, {
        get isPresent() {
          return v(j), X(() => v(j).present);
        },
        get initial() {
          return v(te);
        },
        get custom() {
          return v(k);
        },
        get presenceAffectsLayout() {
          return c();
        },
        get onExitComplete() {
          return v(j), X(() => v(j).onExit);
        },
        get isCustom() {
          return h();
        },
        children: (Z, de) => {
          var ve = H(), _e = N(ve);
          $(
            _e,
            t,
            "default",
            {
              get item() {
                return v(j), X(() => v(j).item);
              }
            }
          ), F(Z, ve);
        },
        $$slots: { default: !0 }
      });
    }
  }), F(e, A), K(), o();
}
function Sh(e) {
  for (var t = !1, n = {}, r = 0; r < Ao.length; r++) {
    var o = Ao[r], i = "rotate" + o;
    !e.hasValue(i) || e.getStaticValue(i) === 0 || (t = !0, n[i] = e.getStaticValue(i), e.setStaticValue(i, 0));
  }
  if (t) {
    e.syncRender();
    for (var i in n)
      e.setStaticValue(i, n[i]);
    e.scheduleRender();
  }
}
function xh(e, t, n) {
  n === void 0 && (n = {});
  var r = Qe(e) ? e : ge(e);
  return Hn("", r, t, n), {
    stop: () => r.stop()
  };
}
function Ph() {
  var e = ge(1), t = {
    lead: void 0,
    follow: void 0,
    crossfadeOpacity: !1,
    preserveFollowOpacity: !1
  }, n = Object.assign({}, t), r = {}, o = {}, i = !1, a = null, s = 0;
  function u(f, c) {
    var d = t.lead, h = t.follow;
    i = !0, a = null;
    var p = !1, g = () => {
      p = !0, d && d.scheduleRender(), h && h.scheduleRender();
    }, y = () => {
      i = !1, a = jt().timestamp;
    };
    return c = c && Gr(c, "crossfade"), xh(
      e,
      f,
      // @ts-expect-error
      Object.assign(Object.assign({}, c), {
        onUpdate: g,
        onComplete: () => {
          p ? y() : (e.set(f), Ie.read(y)), g();
        }
      })
    );
  }
  function l() {
    var f, c, d = jt().timestamp, h = t.lead, p = t.follow;
    if (!(d === s || !h)) {
      s = d;
      var g = h.getLatestValues();
      Object.assign(r, g);
      var y = p ? p.getLatestValues() : t.prevValues;
      Object.assign(o, y);
      var m = e.get(), b = (f = g.opacity) !== null && f !== void 0 ? f : 1, _ = (c = y?.opacity) !== null && c !== void 0 ? c : 1;
      t.crossfadeOpacity && p ? (r.opacity = ce(
        /**
         * If the follow child has been completely hidden we animate
         * this opacity from its previous opacity, but otherwise from completely transparent.
         */
        // @ts-expect-error
        p.isVisible !== !1 ? 0 : _,
        b,
        Ch(m)
      ), o.opacity = t.preserveFollowOpacity ? _ : ce(_, 0, Eh(m))) : p || (r.opacity = ce(_, b, m)), Ah(r, o, g, y || {}, !!p, m);
    }
  }
  return {
    isActive: () => r && (i || jt().timestamp === a),
    fromLead: (f) => u(0, f),
    toLead: (f) => {
      var c = 0;
      return !t.prevValues && !t.follow ? c = 1 : n.lead === t.follow && n.follow === t.lead && (c = 1 - e.get()), e.set(c), u(1, f);
    },
    reset: () => e.set(1),
    stop: () => e.stop(),
    getCrossfadeState: (f) => {
      if (l(), f === t.lead)
        return r;
      if (f === t.follow)
        return o;
    },
    setOptions: (f) => {
      n = t, t = f, r = {}, o = {};
    },
    getLatestValues: () => r
  };
}
var Ch = Vl(0, 0.5, ci), Eh = Vl(0.5, 0.95, li);
function Vl(e, t, n) {
  return (r) => r < e ? 0 : r > t ? 1 : n(un(e, t, r));
}
var Ol = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Th = Ol.length;
function Ah(e, t, n, r, o, i) {
  for (var a = 0; a < Th; a++) {
    var s = "border" + Ol[a] + "Radius", u = Ka(r, s), l = Ka(n, s);
    if (!(u === void 0 && l === void 0) && (u || (u = 0), l || (l = 0), typeof u == "number" && typeof l == "number")) {
      var f = Math.max(ce(u, l, i), 0);
      e[s] = t[s] = f;
    }
  }
  if (r.rotate || n.rotate) {
    var c = ce(r.rotate || 0, n.rotate || 0, i);
    e.rotate = t.rotate = c;
  }
  !o && n.backgroundColor && r.backgroundColor && (e.backgroundColor = t.backgroundColor = ai(
    r.backgroundColor,
    n.backgroundColor
  )(i));
}
function Ka(e, t) {
  var n;
  return (n = e[t]) !== null && n !== void 0 ? n : e.borderRadius;
}
function Vh() {
  var e = /* @__PURE__ */ new Set(), t = { leadIsExiting: !1, lead: {}, follow: {} }, n = Object.assign({}, t), r, o, i, a = Ph(), s = !1;
  function u() {
    return t.follow ? t.follow.prevViewportBox : o;
  }
  function l() {
    var f;
    return (f = t.follow) === null || f === void 0 ? void 0 : f.getLayoutState().layout;
  }
  return {
    add: (f) => {
      f.setCrossfader(a), e.add(f), i && (f.prevDragCursor = i), t.lead || (t.lead = f);
    },
    remove: (f) => {
      e.delete(f);
    },
    getLead: () => t.lead,
    updateSnapshot: () => {
      if (t.lead) {
        r = a.isActive() ? a.getLatestValues() : t.lead.getLatestValues(), o = t.lead.prevViewportBox;
        var f = El.get(t.lead);
        f && f.isDragging && (i = f.cursorProgress);
      }
    },
    clearSnapshot: () => {
      i = o = void 0;
    },
    updateLeadAndFollow: () => {
      var f;
      n = Object.assign({}, t);
      for (var c, d, h = Array.from(e), p = h.length; p--; p >= 0) {
        var g = h[p];
        if (c && (d ?? (d = g)), c ?? (c = g), c && d) break;
      }
      t.lead = c, t.follow = d, t.leadIsExiting = ((f = t.lead) === null || f === void 0 ? void 0 : f.presence) === Se.Exiting, a.setOptions({
        lead: c,
        follow: d,
        prevValues: r,
        crossfadeOpacity: (
          // @ts-expect-error
          d?.isPresenceRoot || c?.isPresenceRoot
        )
      }), // Don't crossfade if we've just animated back from lead and switched the
      // old follow to the new lead.
      t.lead !== n.follow && (n.lead !== t.lead || n.leadIsExiting !== t.leadIsExiting) && (s = !0);
    },
    animate: (f, c) => {
      var d;
      if (c === void 0 && (c = !1), f === t.lead) {
        c ? f.pointTo(t.lead) : f.setVisibility(!0);
        var h = {}, p = (d = t.follow) === null || d === void 0 ? void 0 : d.getProjectionParent();
        if (p && (h.prevParent = p), f.presence === Se.Entering ? h.originBox = u() : f.presence === Se.Exiting && (h.targetBox = l()), s) {
          s = !1;
          var g = f.getDefaultTransition();
          f.presence === Se.Entering ? a.toLead(g) : a.fromLead(g);
        }
        f.notifyLayoutReady(h);
      } else
        c ? t.lead && f.pointTo(t.lead) : f.setVisibility(!1);
    }
  };
}
function $h(e, t) {
  G(t, !1);
  let n = E(t, "type", 8, void 0), r = E(t, "isCustom", 8, !1);
  const o = J(vt) || vt(r());
  let i = !1, a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), u = !1, l = /* @__PURE__ */ L(!1), f = {
    ...ei(),
    syncUpdate: (x) => h(x),
    forceUpdate: () => {
      h();
    },
    register: (x) => p(x),
    remove: (x) => {
      g(x);
    }
  };
  const c = () => {
    O(l, u = !1), a.forEach((S) => {
      S.isPresent ? S.presence !== Se.Entering && (S.presence = S.presence === Se.Exiting ? Se.Entering : Se.Present) : S.presence = Se.Exiting;
    }), d();
    const x = {
      measureLayout: (S) => S.updateLayoutMeasurement(),
      layoutReady: (S) => {
        S.getLayoutId() !== void 0 ? b(S).animate(S, n() === "crossfade") : S.notifyLayoutReady();
      },
      parent: se(o).visualElement
    };
    a.forEach((S) => f.add(S)), f.flush(x), s.forEach((S) => S.clearSnapshot());
  }, d = () => {
    s.forEach((x) => x.updateLeadAndFollow());
  }, h = (x = !1) => {
    (x || !u) && (u = !0, a.forEach((S) => Sh(S)), a.forEach((S) => qs(S)), s.forEach((S) => S.updateSnapshot()), (x || !v(l)) && O(l, !0));
  }, p = (x) => {
    a.add(x), y(x), x.presence = i ? Se.Entering : Se.Present;
  }, g = (x) => {
    h(), a.delete(x), m(x);
  }, y = (x) => {
    b(x)?.add(x);
  }, m = (x) => {
    b(x)?.remove(x);
  }, b = (x) => {
    const S = x.getLayoutId();
    if (S !== void 0)
      return !s.has(S) && s.set(S, Vh()), s.get(S);
  };
  let _ = Ee(f);
  Ft(jn, _), mn("SharedLayout", r(), _), at(() => {
    i = !0;
  }), I(() => (v(l), Ut), () => {
    v(l) && Ut().then(() => {
      c();
    });
  }), oe(), Q();
  var w = H(), C = N(w);
  $(C, t, "default", {}), F(e, w), K();
}
function em(e, t) {
  G(t, !1);
  let n = E(t, "features", 8), r = E(t, "strict", 8, !1), o = E(t, "isCustom", 8, !1), i = !s(n()), a = /* @__PURE__ */ L(void 0);
  function s(c) {
    return typeof c == "function";
  }
  at(() => {
    s(n()) && n()().then(({ renderer: c, ...d }) => {
      tn(d), Wt(a, v(a).current = c), setIsLoaded(!0);
    });
  });
  let u = Ee({ renderer: v(a).current, strict: r() });
  Ft(Po, u), mn("Lazy", o(), u), I(() => (V(n()), tn), () => {
    if (!s(n()) && i) {
      const { renderer: c, ...d } = n();
      Wt(a, v(a).current = c), tn(d);
    }
  }), I(() => (v(a), V(r())), () => {
    u.set({ renderer: v(a).current, strict: r() });
  }), oe(), Q();
  var l = H(), f = N(l);
  $(f, t, "default", {}), F(e, l), K();
}
const Oh = () => {
  const e = J(Zt), t = J(Ci), n = (o = !1) => {
    se(e).forEach((a, s) => {
      a.afterU?.(!0);
    });
  }, r = () => {
    se(e).forEach((o) => {
      o.updater?.(!0);
    });
  };
  return t.update(
    (o) => o.concat([
      {
        updater: r,
        afterU: n
      }
    ])
  ), {
    update: r
  };
};
function tm(e, t) {
  G(t, !1);
  const n = () => me(f, "$mcc", r), [r, o] = it(), i = /* @__PURE__ */ L();
  let a = E(t, "transformPagePoint", 8, void 0), s = E(t, "isStatic", 8, void 0), u = E(t, "transition", 8, void 0), l = E(t, "isCustom", 8, !1);
  const f = J(Ce) || Ce(l());
  let c = /* @__PURE__ */ L({
    ...se(f),
    transformPagePoint: a(),
    isStatic: s(),
    transition: u()
  });
  wl();
  let d = Ee(v(c));
  Ft(Ce, d), mn("Motion", l(), d);
  const h = () => v(c), p = Oh();
  I(
    () => (n(), V(a()), V(s()), V(u())),
    () => {
      O(c, {
        ...n(),
        transformPagePoint: a(),
        isStatic: s(),
        transition: u()
      });
    }
  ), I(() => v(c), () => {
    O(i, typeof v(c).transition == "object" ? v(c).transition.toString() : "");
  }), I(() => (v(i), v(c)), () => {
    d.set(h(v(i), v(c).transformPagePoint)), p.update();
  }), oe(), Q();
  var g = H(), y = N(g);
  $(y, t, "default", {}), F(e, g), K(), o();
}
var Mh = /* @__PURE__ */ Wn("<!> <!>", 1);
function Ro(e, t) {
  const n = Ct(t, ["children", "$$slots", "$$events", "$$legacy"]), r = Ct(n, ["isSVG", "forwardMotionProps", "externalRef", "targetEl"]);
  G(t, !1);
  const o = () => me(m, "$a", i), [i, a] = it(), s = /* @__PURE__ */ L(), u = /* @__PURE__ */ L();
  let l = E(t, "isSVG", 8, !1), f = E(t, "forwardMotionProps", 8, !1), c = E(t, "externalRef", 8, void 0);
  const h = E(
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
  let p = l() ? "SVG" : "DOM", g = Pi, y = l() ? gl : yl;
  const m = J(Ce) || Ce(h);
  let b = /* @__PURE__ */ L(!1);
  const _ = (w, C) => (w.visualElement = C, C);
  at(() => O(b, !0)), I(() => V(r), () => {
    O(s, r);
  }), I(() => (v(u), o()), () => {
    ((w) => {
      O(u, w.isStatic);
    })(o() || {});
  }), oe(), Q(), Sl(e, {
    get isCustom() {
      return h;
    },
    children: (w, C) => {
      bl(w, {
        get props() {
          return v(s);
        },
        get isStatic() {
          return v(u);
        },
        get isCustom() {
          return h;
        },
        children: je,
        $$slots: {
          default: (x, S) => {
            const A = /* @__PURE__ */ U(() => S.value);
            _l(x, {
              get config() {
                return y;
              },
              get props() {
                return v(s);
              },
              get isStatic() {
                return v(u);
              },
              get isCustom() {
                return h;
              },
              children: je,
              $$slots: {
                default: (B, R) => {
                  const j = /* @__PURE__ */ U(() => R.state);
                  Vu(B, {
                    get Component() {
                      return p;
                    },
                    get visualState() {
                      return v(j);
                    },
                    get createVisualElement() {
                      return g;
                    },
                    get props() {
                      return v(s);
                    },
                    get isCustom() {
                      return h;
                    },
                    children: je,
                    $$slots: {
                      default: (te, k) => {
                        const Z = /* @__PURE__ */ U(() => k.visualElement);
                        {
                          let de = /* @__PURE__ */ U(() => (V(v(A)), V(v(Z)), X(() => _(v(A), v(Z)))));
                          Ou(te, {
                            get visualElement() {
                              return v(de);
                            },
                            get props() {
                              return v(s);
                            },
                            children: je,
                            $$slots: {
                              default: (ve, _e) => {
                                const Ke = /* @__PURE__ */ U(() => _e.features);
                                var Fe = Mh(), Le = N(Fe);
                                Mu(Le, {
                                  get value() {
                                    return v(A);
                                  },
                                  get isCustom() {
                                    return h;
                                  },
                                  children: (he, Te) => {
                                    {
                                      let st = /* @__PURE__ */ U(() => (V(Or), V(v(j)), V(v(A)), V(c()), X(() => Or(v(j), v(A).visualElement, c()))));
                                      Hu(he, {
                                        get Component() {
                                          return p;
                                        },
                                        get props() {
                                          return v(s);
                                        },
                                        get ref() {
                                          return v(st);
                                        },
                                        get visualState() {
                                          return v(j);
                                        },
                                        get isStatic() {
                                          return v(u);
                                        },
                                        get forwardMotionProps() {
                                          return f();
                                        },
                                        children: je,
                                        $$slots: {
                                          default: (Ae, ie) => {
                                            const Ye = /* @__PURE__ */ U(() => ie.motion), et = /* @__PURE__ */ U(() => ie.props);
                                            var De = H(), M = N(De);
                                            $(
                                              M,
                                              t,
                                              "default",
                                              {
                                                get motion() {
                                                  return v(Ye);
                                                },
                                                get props() {
                                                  return v(et);
                                                }
                                              }
                                            ), F(Ae, De);
                                          }
                                        }
                                      });
                                    }
                                  },
                                  $$slots: { default: !0 }
                                });
                                var pe = yt(Le, 2);
                                {
                                  var Ne = (he) => {
                                    var Te = H(), st = N(Te);
                                    Yo(st, 1, () => v(Ke), ({ key: Ae, props: ie, visualElement: Ye, Component: et }) => Ae, (Ae, ie, Ye, et) => {
                                      let De = () => v(ie).props, M = () => v(ie).visualElement, P = () => v(ie).Component;
                                      var T = H(), W = N(T);
                                      qo(W, P, (ne, ue) => {
                                        ue(ne, {
                                          get props() {
                                            return De();
                                          },
                                          get visualElement() {
                                            return M();
                                          },
                                          get isCustom() {
                                            return h;
                                          }
                                        });
                                      }), F(Ae, T);
                                    }), F(he, Te);
                                  };
                                  Ko(pe, (he) => {
                                    v(b) && he(Ne);
                                  });
                                }
                                F(ve, Fe);
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
  }), K(), a();
}
const Lh = ({
  preloadedFeatures: e,
  createVisualElement: t,
  useRender: n,
  useVisualState: r,
  Component: o
}) => (e && tn(e), class extends Ro {
  constructor(a) {
    const s = a.props;
    a.props = {
      props: s,
      defaultFeatures: e,
      createVisualElement: t,
      forwardMotionProps: n,
      Component: o,
      visualStateConfig: r
    }, super({ component: Ro, ...a });
  }
  // @ts-expect-error
}), Dh = [
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
function Rh(e) {
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
      !!(Dh.indexOf(e) > -1 || /**
      * If it contains a capital letter, it's an SVG component
      */
      /[A-Z]/.test(e))
    )
  );
}
function jh(e, t) {
  const n = Ct(t, ["children", "$$slots", "$$events", "$$legacy"]), r = Ct(n, ["___tag", "el", "isSVG"]);
  G(t, !1);
  let o = E(t, "___tag", 8), i = E(t, "el", 12), a = E(t, "isSVG", 8, !1);
  Q(), Ro(e, Us(() => r, {
    get isSVG() {
      return a();
    },
    children: je,
    $$slots: {
      default: (s, u) => {
        const l = /* @__PURE__ */ U(() => u.props), f = /* @__PURE__ */ U(() => u.motion);
        var c = H(), d = N(c);
        uc(
          d,
          o,
          !1,
          (h, p) => {
            wc(h, (m) => i(m), () => i()), Ds(h, (m) => v(f)?.(m)), Fs(
              h,
              (m) => ({
                ...m,
                class: (V(v(l)), X(() => v(l).class)),
                xmlns: a() ? "http://www.w3.org/2000/svg" : void 0
              }),
              [
                () => Object.fromEntries(Object.entries(v(l)).filter(([m, b]) => m !== "latestvalues" && m !== "renderstate" && m !== "visualProps"))
              ]
            );
            var g = H(), y = N(g);
            $(y, t, "default", {}), F(p, g);
          },
          () => a() ? "http://www.w3.org/2000/svg" : void 0
        ), F(s, c);
      }
    }
  })), K();
}
function Ml(e) {
  return e && tn(e), new Proxy({}, {
    get(t, n) {
      let r = !1;
      return n.toString().slice(0, 1) === n.toString().slice(0, 1).toLowerCase() && (r = Rh(n)), new Proxy(jh, {
        construct(o, i) {
          if ((!i || !i[0]) && i.push({}), !i[0]?.props)
            i[0].props = { ___tag: n, isSVG: r };
          else
            try {
              Object.assign(i[0], {
                ___tag: n,
                isSVG: r
              });
            } catch {
              i[0].props.___tag = n, i[0].props.isSVG = r;
            }
          return new o(...i);
        },
        // support svelte 5
        apply(o, i, a) {
          if (!a[1])
            a[1] = { ___tag: n, isSVG: r };
          else
            try {
              Object.assign(a[1], {
                ___tag: n,
                isSVG: r
              });
            } catch {
              a[1].___tag = n, a[1].isSVG = r;
            }
          return o(...a);
        }
      });
    }
  });
}
var rm = /* @__PURE__ */ Ml(Tl);
function om(e) {
  var t = {
    createVisualElement: Pi(e),
    // useRender: createUseRender(key, false),
    // @ts-expect-error
    forwardMotionProps: e.forwardMotionProps,
    // @ts-expect-error
    Component: e.Component,
    // @ts-expect-error
    defaultFeatures: allMotionFeatures
  };
  return Lh(t);
}
var im = /* @__PURE__ */ Ml({ ...xl });
function Ll(e) {
  const t = { x: !1, y: !1, xp: !1, yp: !1 };
  let n;
  const r = e ? (o) => () => (!t.x && !t.y && !t.xp && !t.yp && (n = e()), t[o] = !0, () => {
    t[o] = !1, !t.x && !t.y && !t.xp && !t.yp && n && n.then((i) => i());
  }) : () => {
  };
  return {
    scrollX: ge(0, r("x")),
    scrollY: ge(0, r("y")),
    scrollXProgress: ge(0, r("xp")),
    scrollYProgress: ge(0, r("yp"))
  };
}
function Ya(e, t, n) {
  n.set(!e || !t ? 0 : e / t);
}
function Dl(e, t) {
  var n = () => {
    var r = t(), o = r.xOffset, i = r.yOffset, a = r.xMaxOffset, s = r.yMaxOffset;
    e.scrollX.set(o), e.scrollY.set(i), Ya(o, a, e.scrollXProgress), Ya(i, s, e.scrollYProgress);
  };
  return n(), n;
}
const Ih = (e) => () => ({
  xOffset: e.scrollLeft,
  yOffset: e.scrollTop,
  xMaxOffset: e.scrollWidth - e.offsetWidth,
  yMaxOffset: e.scrollHeight - e.offsetHeight
}), am = (e) => {
  const t = {};
  return Object.assign(t, Ll(async () => {
    if (typeof window > "u") return () => {
    };
    let r = 10;
    for (; (!e || !e.current) && !t.ref; ) {
      if (r-- < 1)
        return () => {
        };
      await new Promise((u) => setTimeout(() => u(), 200));
    }
    const o = e && e.current ? e : t.ref, i = Dl(t, Ih(o)), a = zt(o, "scroll", i, { passive: !0 }), s = zt(o, "resize", i);
    return () => {
      a && a(), s && s();
    };
  })), t;
};
let hr;
function Fh() {
  return {
    xOffset: window.pageXOffset,
    yOffset: window.pageYOffset,
    xMaxOffset: document.body.clientWidth - window.innerWidth,
    yMaxOffset: document.body.clientHeight - window.innerHeight
  };
}
let Rl = !1;
function Nh() {
  if (Rl = !0, typeof window > "u") return;
  const e = Dl(
    hr,
    Fh
  );
  zt(window, "scroll", e, { passive: !0 }), zt(window, "resize", e);
}
function sm() {
  return hr || (hr = Ll()), Ut().then((e) => {
    !Rl && Nh();
  }), hr;
}
const jl = (e, t) => {
  let n = [], r = e;
  const o = () => {
    for (const l of n)
      l();
  }, i = () => {
    n = r.map((l) => l.onChange(u)), s();
  }, a = ge(t(), () => (o(), i(), o));
  let s = () => {
    a.set(t());
  };
  const u = () => {
    Ie.update(s, !1, !0);
  };
  return a.reset = (l, f) => {
    r = l, o(), s = () => {
      a.set(f());
    }, i();
  }, a;
}, um = (e, ...t) => {
  let n = e.length;
  const r = () => {
    let i = "";
    for (let a = 0; a < n; a++)
      i += e[a], t[a] && (i += t[a].get());
    return i;
  }, o = jl(t, r);
  return o.resetInner = o.reset, o.reset = (i, ...a) => {
    n = i.length, o.resetInner(a, r);
  }, o;
}, lm = (e, t = {}, n = !1) => {
  const r = J(Ce) || Ce(n);
  let o = null;
  const i = ge(Qe(e) ? e.get() : e), a = (s, u) => (i.attach((l, f) => {
    const { isStatic: c } = se(r);
    return c ? f(l) : (o && o.stop(), o = vi({
      from: i.get(),
      to: l,
      velocity: i.getVelocity(),
      ...u,
      onUpdate: f
    }), i.get());
  }), Qe(s) ? s.onChange((l) => i.set(Number.parseFloat(l))) : void 0);
  return a(e, t), i.reset = a, i;
};
var Bh = (e) => typeof e == "object" && e.mix, Uh = (e) => Bh(e) ? e.mix : void 0;
function Hh(...e) {
  var t = !Array.isArray(e[0]), n = t ? 0 : -1, r = e[0 + n], o = e[1 + n], i = e[2 + n], a = e[3 + n], s = si(o, i, Object.assign({ mixer: Uh(i[0]) }, a));
  return t ? s(r) : s;
}
function fm(e, t, n, r) {
  const o = [], i = (s, u, l, f) => {
    const c = typeof u == "function" ? u : Hh(u, l, f), d = Array.isArray(s) ? s : [s], h = Array.isArray(s) ? c : ([p]) => c(p);
    return [
      d,
      () => {
        o.length = 0;
        const p = d.length;
        for (let g = 0; g < p; g++)
          o[g] = d[g].get();
        return h(o);
      }
    ];
  }, a = jl(...i(e, t, n, r));
  return a.updateInner = a.reset, a.reset = (s, u, l, f) => a.updateInner(...i(s, u, l, f)), a;
}
const cm = (e) => {
  let t = e, n;
  const r = (i) => {
    n?.(), t = i, n = t.velocityUpdateSubscribers.add((a) => {
      o.set(a);
    });
  }, o = ge(e.getVelocity(), () => (n?.(), n = t.velocityUpdateSubscribers.add((i) => {
    o.set(i);
  }), () => {
    n?.();
  }));
  return o.reset = r, o;
};
let Mn;
function zh() {
  if (Mn = ge(null), !(typeof window > "u"))
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => Mn.set(e.matches);
      e.addListener(t), t();
    } else
      Mn.set(!1);
}
const dm = () => (!Mn && zh(), Jo(Mn, (e) => e));
class kh {
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
    this.componentControls.forEach((r) => {
      r.start("nativeEvent" in t ? t.nativeEvent : t, n);
    });
  };
  updateConstraints = (t) => {
    this.componentControls.forEach((n) => {
      n.prepareBoundingBox(), n.resolveDragConstraints();
    });
  };
}
const Gh = () => new kh(), vm = Gh, pm = (...e) => {
  let t = 0;
  const n = Ee(e[t]), r = (o) => {
    t = typeof o != "number" ? Wd(0, e.length, t + 1) : o, n.set(e[t]);
  };
  return n.next = r, n;
};
export {
  Qh as AnimatePresence,
  $h as AnimateSharedLayout,
  kh as DragControls,
  Dp as FlatTree,
  Ki as FramerTreeLayoutContext,
  sa as LayoutGroupContext,
  em as LazyMotion,
  im as M,
  Jh as Mdiv,
  rm as Motion,
  tm as MotionConfig,
  Ce as MotionConfigContext,
  Jh as MotionDiv,
  gh as MotionSSR,
  Zv as MotionValue,
  Ge as PresenceContext,
  Xh as UseAnimation,
  ho as UseDomEvent,
  Yh as UseGestures,
  Cu as UsePanGesture,
  Tu as UseTapGesture,
  dv as addScaleCorrection,
  xh as animate,
  sl as animateVisualElement,
  Al as animationControls,
  xl as animations,
  vo as batchLayout,
  ei as createBatcher,
  Ph as createCrossfader,
  om as createDomMotionComponent,
  Lh as createMotionComponent,
  sh as drag,
  Tl as featureBundle,
  po as flushLayout,
  uh as gestureAnimations,
  Tr as isValidMotionProp,
  Wh as layoutAnimation,
  im as m,
  rm as motion,
  ge as motionValue,
  Yp as resolveMotionValue,
  qs as snapshotViewportBox,
  Hh as transform,
  Zh as useAnimation,
  pm as useCycle,
  vm as useDragControls,
  am as useElementScroll,
  qh as useIsPresent,
  um as useMotionTemplate,
  ge as useMotionValue,
  Au as usePresence,
  dm as useReducedMotion,
  lm as useSpring,
  fm as useTransform,
  cm as useVelocity,
  sm as useViewportScroll,
  ll as visualElement
};
