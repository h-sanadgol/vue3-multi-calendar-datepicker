(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) r(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === 'childList')
        for (const a of i.addedNodes)
          a.tagName === 'LINK' && a.rel === 'modulepreload' && r(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(n) {
    const i = {};
    return (
      n.integrity && (i.integrity = n.integrity),
      n.referrerPolicy && (i.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === 'use-credentials'
        ? (i.credentials = 'include')
        : n.crossOrigin === 'anonymous'
          ? (i.credentials = 'omit')
          : (i.credentials = 'same-origin'),
      i
    );
  }
  function r(n) {
    if (n.ep) return;
    n.ep = !0;
    const i = s(n);
    fetch(n.href, i);
  }
})();
function makeMap(e) {
  const t = Object.create(null);
  for (const s of e.split(',')) t[s] = 1;
  return (s) => s in t;
}
const EMPTY_OBJ = {},
  EMPTY_ARR = [],
  NOOP = () => {},
  NO = () => !1,
  isOn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  isModelListener = (e) => e.startsWith('onUpdate:'),
  extend = Object.assign,
  remove = (e, t) => {
    const s = e.indexOf(t);
    s > -1 && e.splice(s, 1);
  },
  hasOwnProperty$1 = Object.prototype.hasOwnProperty,
  hasOwn = (e, t) => hasOwnProperty$1.call(e, t),
  isArray = Array.isArray,
  isMap = (e) => toTypeString(e) === '[object Map]',
  isSet = (e) => toTypeString(e) === '[object Set]',
  isDate = (e) => toTypeString(e) === '[object Date]',
  isFunction = (e) => typeof e == 'function',
  isString = (e) => typeof e == 'string',
  isSymbol = (e) => typeof e == 'symbol',
  isObject = (e) => e !== null && typeof e == 'object',
  isPromise = (e) =>
    (isObject(e) || isFunction(e)) && isFunction(e.then) && isFunction(e.catch),
  objectToString = Object.prototype.toString,
  toTypeString = (e) => objectToString.call(e),
  toRawType = (e) => toTypeString(e).slice(8, -1),
  isPlainObject = (e) => toTypeString(e) === '[object Object]',
  isIntegerKey = (e) =>
    isString(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
  isReservedProp = makeMap(
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted',
  ),
  cacheStringFunction = (e) => {
    const t = Object.create(null);
    return (s) => t[s] || (t[s] = e(s));
  },
  camelizeRE = /-\w/g,
  camelize = cacheStringFunction((e) =>
    e.replace(camelizeRE, (t) => t.slice(1).toUpperCase()),
  ),
  hyphenateRE = /\B([A-Z])/g,
  hyphenate = cacheStringFunction((e) =>
    e.replace(hyphenateRE, '-$1').toLowerCase(),
  ),
  capitalize = cacheStringFunction(
    (e) => e.charAt(0).toUpperCase() + e.slice(1),
  ),
  toHandlerKey = cacheStringFunction((e) => (e ? `on${capitalize(e)}` : '')),
  hasChanged = (e, t) => !Object.is(e, t),
  invokeArrayFns = (e, ...t) => {
    for (let s = 0; s < e.length; s++) e[s](...t);
  },
  def = (e, t, s, r = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: r,
      value: s,
    });
  },
  looseToNumber = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  };
let _globalThis;
const getGlobalThis = () =>
  _globalThis ||
  (_globalThis =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {});
function normalizeStyle(e) {
  if (isArray(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++) {
      const r = e[s],
        n = isString(r) ? parseStringStyle(r) : normalizeStyle(r);
      if (n) for (const i in n) t[i] = n[i];
    }
    return t;
  } else if (isString(e) || isObject(e)) return e;
}
const listDelimiterRE = /;(?![^(]*\))/g,
  propertyDelimiterRE = /:([^]+)/,
  styleCommentRE =
    /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function parseStringStyle(e) {
  const t = {};
  return (
    e
      .replace(styleCommentRE, (s) => (s.startsWith('/*') ? '' : s))
      .split(listDelimiterRE)
      .forEach((s) => {
        if (s) {
          const r = s.split(propertyDelimiterRE);
          r.length > 1 && (t[r[0].trim()] = r[1].trim());
        }
      }),
    t
  );
}
function normalizeClass(e) {
  let t = '';
  if (isString(e)) t = e;
  else if (isArray(e))
    for (let s = 0; s < e.length; s++) {
      const r = normalizeClass(e[s]);
      r && (t += r + ' ');
    }
  else if (isObject(e)) for (const s in e) e[s] && (t += s + ' ');
  return t.trim();
}
function normalizeProps(e) {
  if (!e) return null;
  let { class: t, style: s } = e;
  return (
    t && !isString(t) && (e.class = normalizeClass(t)),
    s && (e.style = normalizeStyle(s)),
    e
  );
}
const specialBooleanAttrs =
    'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly',
  isSpecialBooleanAttr = makeMap(specialBooleanAttrs);
function includeBooleanAttr(e) {
  return !!e || e === '';
}
function looseCompareArrays(e, t, s) {
  if (e.length !== t.length) return !1;
  let r = !0;
  for (let n = 0; r && n < e.length; n++) r = looseEqual(e[n], t[n], s);
  return r;
}
function looseCompareCollections(e, t, s) {
  if (e.size !== t.size) return !1;
  const r = Array.from(t),
    n = new Uint8Array(r.length);
  for (const i of e) {
    let a = -1;
    for (let o = 0; o < r.length; o++)
      if (!n[o] && looseEqual(i, r[o], s)) {
        a = o;
        break;
      }
    if (a < 0) return !1;
    n[a] = 1;
  }
  return !0;
}
function looseCompareObjects(e, t, s) {
  let r = isMap(e),
    n = isMap(t);
  if (r || n || ((r = isSet(e)), (n = isSet(t)), r || n))
    return r && n ? looseCompareCollections(e, t, s) : !1;
  const i = Object.keys(e).length,
    a = Object.keys(t).length;
  if (i !== a) return !1;
  for (const o in e) {
    const l = e.hasOwnProperty(o),
      d = t.hasOwnProperty(o);
    if ((l && !d) || (!l && d) || !looseEqual(e[o], t[o], s)) return !1;
  }
  return String(e) === String(t);
}
function looseCompareNested(e, t, s, r) {
  s || (s = [new Map(), new Map()]);
  const [n, i] = s;
  if (n.has(e) || i.has(t)) return n.get(e) === t && i.get(t) === e;
  (n.set(e, t), i.set(t, e));
  const a = r(e, t, s);
  return (n.delete(e), i.delete(t), a);
}
function looseEqual(e, t, s) {
  if (e === t) return !0;
  let r = isDate(e),
    n = isDate(t);
  return r || n
    ? r && n
      ? e.getTime() === t.getTime()
      : !1
    : ((r = isSymbol(e)),
      (n = isSymbol(t)),
      r || n
        ? e === t
        : ((r = isArray(e)),
          (n = isArray(t)),
          r || n
            ? r && n
              ? looseCompareNested(e, t, s, looseCompareArrays)
              : !1
            : ((r = isObject(e)),
              (n = isObject(t)),
              r || n
                ? !r || !n
                  ? !1
                  : looseCompareNested(e, t, s, looseCompareObjects)
                : String(e) === String(t))));
}
function looseIndexOf(e, t) {
  return e.findIndex((s) => looseEqual(s, t));
}
const isRef$1 = (e) => !!(e && e.__v_isRef === !0),
  toDisplayString = (e) =>
    isString(e)
      ? e
      : e == null
        ? ''
        : isArray(e) ||
            (isObject(e) &&
              (e.toString === objectToString || !isFunction(e.toString)))
          ? isRef$1(e)
            ? toDisplayString(e.value)
            : JSON.stringify(e, replacer, 2)
          : String(e),
  replacer = (e, t) =>
    isRef$1(t)
      ? replacer(e, t.value)
      : isMap(t)
        ? {
            [`Map(${t.size})`]: [...t.entries()].reduce(
              (s, [r, n], i) => ((s[stringifySymbol(r, i) + ' =>'] = n), s),
              {},
            ),
          }
        : isSet(t)
          ? {
              [`Set(${t.size})`]: [...t.values()].map((s) =>
                stringifySymbol(s),
              ),
            }
          : isSymbol(t)
            ? stringifySymbol(t)
            : isObject(t) && !isArray(t) && !isPlainObject(t)
              ? String(t)
              : t,
  stringifySymbol = (e, t = '') => {
    var s;
    return isSymbol(e) ? `Symbol(${(s = e.description) != null ? s : t})` : e;
  };
let activeEffectScope;
class EffectScope {
  constructor(t = !1) {
    ((this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this._warnOnRun = !0),
      (this.__v_skip = !0),
      !t &&
        activeEffectScope &&
        (activeEffectScope.active
          ? ((this.parent = activeEffectScope),
            (this.index =
              (
                activeEffectScope.scopes || (activeEffectScope.scopes = [])
              ).push(this) - 1))
          : ((this._active = !1), (this._warnOnRun = !1))));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, s;
      if (this.scopes) {
        const r = this.scopes.slice();
        for (t = 0, s = r.length; t < s; t++) r[t].pause();
      }
      for (t = 0, s = this.effects.length; t < s; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, s;
      if (this.scopes) {
        const n = this.scopes.slice();
        for (t = 0, s = n.length; t < s; t++) n[t].resume();
      }
      const r = this.effects.slice();
      for (t = 0, s = r.length; t < s; t++) r[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const s = activeEffectScope;
      try {
        return ((activeEffectScope = this), t());
      } finally {
        activeEffectScope = s;
      }
    }
  }
  on() {
    ++this._on === 1 &&
      ((this.prevScope = activeEffectScope), (activeEffectScope = this));
  }
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (activeEffectScope === this) activeEffectScope = this.prevScope;
      else {
        let t = activeEffectScope;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let s, r;
      for (s = 0, r = this.effects.length; s < r; s++) this.effects[s].stop();
      for (this.effects.length = 0, s = 0, r = this.cleanups.length; s < r; s++)
        this.cleanups[s]();
      if (((this.cleanups.length = 0), this.scopes)) {
        const n = this.scopes.slice();
        for (s = 0, r = n.length; s < r; s++) n[s].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const n = this.parent.scopes.pop();
        n &&
          n !== this &&
          ((this.parent.scopes[this.index] = n), (n.index = this.index));
      }
      this.parent = void 0;
    }
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeSub;
const pausedQueueEffects = new WeakSet();
class ReactiveEffect {
  constructor(t) {
    ((this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      activeEffectScope &&
        (activeEffectScope.active
          ? activeEffectScope.effects.push(this)
          : (this.flags &= -2)));
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 &&
      ((this.flags &= -65),
      pausedQueueEffects.has(this) &&
        (pausedQueueEffects.delete(this), this.trigger()));
  }
  notify() {
    (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || batch(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    ((this.flags |= 2), cleanupEffect(this), prepareDeps(this));
    const t = activeSub,
      s = shouldTrack;
    ((activeSub = this), (shouldTrack = !0));
    try {
      return this.fn();
    } finally {
      (cleanupDeps(this),
        (activeSub = t),
        (shouldTrack = s),
        (this.flags &= -3));
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) removeSub(t);
      ((this.deps = this.depsTail = void 0),
        cleanupEffect(this),
        this.onStop && this.onStop(),
        (this.flags &= -2));
    }
  }
  trigger() {
    this.flags & 64
      ? pausedQueueEffects.add(this)
      : this.scheduler
        ? this.scheduler()
        : this.runIfDirty();
  }
  runIfDirty() {
    isDirty(this) && this.run();
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0,
  batchedSub,
  batchedComputed;
function batch(e, t = !1) {
  if (((e.flags |= 8), t)) {
    ((e.next = batchedComputed), (batchedComputed = e));
    return;
  }
  ((e.next = batchedSub), (batchedSub = e));
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) return;
  if (batchedComputed) {
    let t = batchedComputed;
    for (batchedComputed = void 0; t; ) {
      const s = t.next;
      ((t.next = void 0), (t.flags &= -9), (t = s));
    }
  }
  let e;
  for (; batchedSub; ) {
    let t = batchedSub;
    for (batchedSub = void 0; t; ) {
      const s = t.next;
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger();
        } catch (r) {
          e || (e = r);
        }
      t = s;
    }
  }
  if (e) throw e;
}
function prepareDeps(e) {
  for (let t = e.deps; t; t = t.nextDep)
    ((t.version = -1),
      (t.prevActiveLink = t.dep.activeLink),
      (t.dep.activeLink = t));
}
function cleanupDeps(e) {
  let t,
    s = e.depsTail,
    r = s;
  for (; r; ) {
    const n = r.prevDep;
    (r.version === -1
      ? (r === s && (s = n), removeSub(r), removeDep(r))
      : (t = r),
      (r.dep.activeLink = r.prevActiveLink),
      (r.prevActiveLink = void 0),
      (r = n));
  }
  ((e.deps = t), (e.depsTail = s));
}
function isDirty(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed &&
        (refreshComputed(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0;
  return !!e._dirty;
}
function refreshComputed(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === globalVersion) ||
    ((e.globalVersion = globalVersion),
    !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !isDirty(e)))
  )
    return;
  e.flags |= 2;
  const t = e.dep,
    s = activeSub,
    r = shouldTrack;
  ((activeSub = e), (shouldTrack = !0));
  try {
    prepareDeps(e);
    const n = e.fn(e._value);
    (t.version === 0 || hasChanged(n, e._value)) &&
      ((e.flags |= 128), (e._value = n), t.version++);
  } catch (n) {
    throw (t.version++, n);
  } finally {
    ((activeSub = s), (shouldTrack = r), cleanupDeps(e), (e.flags &= -3));
  }
}
function removeSub(e, t = !1) {
  const { dep: s, prevSub: r, nextSub: n } = e;
  if (
    (r && ((r.nextSub = n), (e.prevSub = void 0)),
    n && ((n.prevSub = r), (e.nextSub = void 0)),
    s.subs === e && ((s.subs = r), !r && s.computed))
  ) {
    s.computed.flags &= -5;
    for (let i = s.computed.deps; i; i = i.nextDep) removeSub(i, !0);
  }
  !t && !--s.sc && s.map && s.map.delete(s.key);
}
function removeDep(e) {
  const { prevDep: t, nextDep: s } = e;
  (t && ((t.nextDep = s), (e.prevDep = void 0)),
    s && ((s.prevDep = t), (e.nextDep = void 0)));
}
let shouldTrack = !0;
const trackStack = [];
function pauseTracking() {
  (trackStack.push(shouldTrack), (shouldTrack = !1));
}
function resetTracking() {
  const e = trackStack.pop();
  shouldTrack = e === void 0 ? !0 : e;
}
function cleanupEffect(e) {
  const { cleanup: t } = e;
  if (((e.cleanup = void 0), t)) {
    const s = activeSub;
    activeSub = void 0;
    try {
      t();
    } finally {
      activeSub = s;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(t, s) {
    ((this.sub = t),
      (this.dep = s),
      (this.version = s.version),
      (this.nextDep =
        this.prevDep =
        this.nextSub =
        this.prevSub =
        this.prevActiveLink =
          void 0));
  }
}
class Dep {
  constructor(t) {
    ((this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0));
  }
  track(t) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) return;
    let s = this.activeLink;
    if (s === void 0 || s.sub !== activeSub)
      ((s = this.activeLink = new Link(activeSub, this)),
        activeSub.deps
          ? ((s.prevDep = activeSub.depsTail),
            (activeSub.depsTail.nextDep = s),
            (activeSub.depsTail = s))
          : (activeSub.deps = activeSub.depsTail = s),
        addSub(s));
    else if (s.version === -1 && ((s.version = this.version), s.nextDep)) {
      const r = s.nextDep;
      ((r.prevDep = s.prevDep),
        s.prevDep && (s.prevDep.nextDep = r),
        (s.prevDep = activeSub.depsTail),
        (s.nextDep = void 0),
        (activeSub.depsTail.nextDep = s),
        (activeSub.depsTail = s),
        activeSub.deps === s && (activeSub.deps = r));
    }
    return s;
  }
  trigger(t) {
    (this.version++, globalVersion++, this.notify(t));
  }
  notify(t) {
    startBatch();
    try {
      for (let s = this.subs; s; s = s.prevSub)
        s.sub.notify() && s.sub.dep.notify();
    } finally {
      endBatch();
    }
  }
}
function addSub(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep) addSub(r);
    }
    const s = e.dep.subs;
    (s !== e && ((e.prevSub = s), s && (s.nextSub = e)), (e.dep.subs = e));
  }
}
const targetMap = new WeakMap(),
  ITERATE_KEY = Symbol(''),
  MAP_KEY_ITERATE_KEY = Symbol(''),
  ARRAY_ITERATE_KEY = Symbol('');
function track(e, t, s) {
  if (shouldTrack && activeSub) {
    let r = targetMap.get(e);
    r || targetMap.set(e, (r = new Map()));
    let n = r.get(s);
    (n || (r.set(s, (n = new Dep())), (n.map = r), (n.key = s)), n.track());
  }
}
function trigger(e, t, s, r, n, i) {
  const a = targetMap.get(e);
  if (!a) {
    globalVersion++;
    return;
  }
  const o = (l) => {
    l && l.trigger();
  };
  if ((startBatch(), t === 'clear')) a.forEach(o);
  else {
    const l = isArray(e),
      d = l && isIntegerKey(s);
    if (l && s === 'length') {
      const c = Number(r);
      a.forEach((f, v) => {
        (v === 'length' ||
          v === ARRAY_ITERATE_KEY ||
          (!isSymbol(v) && v >= c)) &&
          o(f);
      });
    } else
      switch (
        ((s !== void 0 || a.has(void 0)) && o(a.get(s)),
        d && o(a.get(ARRAY_ITERATE_KEY)),
        t)
      ) {
        case 'add':
          l
            ? d && o(a.get('length'))
            : (o(a.get(ITERATE_KEY)),
              isMap(e) && o(a.get(MAP_KEY_ITERATE_KEY)));
          break;
        case 'delete':
          l ||
            (o(a.get(ITERATE_KEY)), isMap(e) && o(a.get(MAP_KEY_ITERATE_KEY)));
          break;
        case 'set':
          isMap(e) && o(a.get(ITERATE_KEY));
          break;
      }
  }
  endBatch();
}
function getDepFromReactive(e, t) {
  const s = targetMap.get(e);
  return s && s.get(t);
}
function reactiveReadArray(e) {
  const t = toRaw(e);
  return t === e || (track(t, 'iterate', ARRAY_ITERATE_KEY), isShallow(e))
    ? t
    : isReadonly(e)
      ? isReactive(e)
        ? t.map((s) => toReadonly(toReactive(s)))
        : t.map(toReadonly)
      : t.map(toReactive);
}
function shallowReadArray(e) {
  return (track((e = toRaw(e)), 'iterate', ARRAY_ITERATE_KEY), e);
}
function toWrapped(e, t) {
  return isReadonly(e)
    ? toReadonly(isReactive(e) ? toReactive(t) : t)
    : toReactive(t);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, (e) => toWrapped(this, e));
  },
  concat(...e) {
    return reactiveReadArray(this).concat(
      ...e.map((t) => (isArray(t) ? reactiveReadArray(t) : t)),
    );
  },
  entries() {
    return iterator(
      this,
      'entries',
      (e) => ((e[1] = toWrapped(this, e[1])), e),
    );
  },
  every(e, t) {
    return apply(this, 'every', e, t, void 0, arguments);
  },
  filter(e, t) {
    return apply(
      this,
      'filter',
      e,
      t,
      (s) => s.map((r) => toWrapped(this, r)),
      arguments,
    );
  },
  find(e, t) {
    return apply(this, 'find', e, t, (s) => toWrapped(this, s), arguments);
  },
  findIndex(e, t) {
    return apply(this, 'findIndex', e, t, void 0, arguments);
  },
  findLast(e, t) {
    return apply(this, 'findLast', e, t, (s) => toWrapped(this, s), arguments);
  },
  findLastIndex(e, t) {
    return apply(this, 'findLastIndex', e, t, void 0, arguments);
  },
  forEach(e, t) {
    return apply(this, 'forEach', e, t, void 0, arguments);
  },
  includes(...e) {
    return searchProxy(this, 'includes', e);
  },
  indexOf(...e) {
    return searchProxy(this, 'indexOf', e);
  },
  join(e) {
    return reactiveReadArray(this).join(e);
  },
  lastIndexOf(...e) {
    return searchProxy(this, 'lastIndexOf', e);
  },
  map(e, t) {
    return apply(this, 'map', e, t, void 0, arguments);
  },
  pop() {
    return noTracking(this, 'pop');
  },
  push(...e) {
    return noTracking(this, 'push', e);
  },
  reduce(e, ...t) {
    return reduce(this, 'reduce', e, t);
  },
  reduceRight(e, ...t) {
    return reduce(this, 'reduceRight', e, t);
  },
  shift() {
    return noTracking(this, 'shift');
  },
  some(e, t) {
    return apply(this, 'some', e, t, void 0, arguments);
  },
  splice(...e) {
    return noTracking(this, 'splice', e);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(e) {
    return reactiveReadArray(this).toSorted(e);
  },
  toSpliced(...e) {
    return reactiveReadArray(this).toSpliced(...e);
  },
  unshift(...e) {
    return noTracking(this, 'unshift', e);
  },
  values() {
    return iterator(this, 'values', (e) => toWrapped(this, e));
  },
};
function iterator(e, t, s) {
  const r = shallowReadArray(e),
    n = r[t],
    i = n.call(r);
  if (r !== e && !isShallow(e)) {
    if (i[Symbol.toStringTag] === 'Array Iterator') {
      const a = Object.create(Object.getPrototypeOf(i));
      return (
        (a.next = () => wrapResult(i.next(), s)),
        n !== arrayProto[t] &&
          Object.defineProperties(a, {
            return: {
              get() {
                const o = i.return;
                return typeof o == 'function' ? o.bind(i) : o;
              },
            },
            throw: {
              get() {
                const o = i.throw;
                return typeof o == 'function' ? o.bind(i) : o;
              },
            },
          }),
        a
      );
    }
    ((i._next = i.next), (i.next = () => wrapResult(i._next(), s)));
  }
  return i;
}
function wrapResult(e, t) {
  return (e.done || (e.value = t(e.value)), e);
}
const arrayProto = Array.prototype;
function apply(e, t, s, r, n, i) {
  const a = shallowReadArray(e),
    o = a !== e && !isShallow(e),
    l = a[t];
  if (l !== arrayProto[t]) {
    const f = l.apply(e, i);
    return o ? toReactive(f) : f;
  }
  let d = s;
  a !== e &&
    (o
      ? (d = function (f, v) {
          return s.call(this, toWrapped(e, f), v, e);
        })
      : s.length > 2 &&
        (d = function (f, v) {
          return s.call(this, f, v, e);
        }));
  const c = l.call(a, d, r);
  return o && n ? n(c) : c;
}
function reduce(e, t, s, r) {
  const n = shallowReadArray(e),
    i = n !== e && !isShallow(e);
  let a = s,
    o = !1;
  n !== e &&
    (i
      ? ((o = r.length === 0),
        (a = function (d, c, f) {
          return (
            o && ((o = !1), (d = toWrapped(e, d))),
            s.call(this, d, toWrapped(e, c), f, e)
          );
        }))
      : s.length > 3 &&
        (a = function (d, c, f) {
          return s.call(this, d, c, f, e);
        }));
  const l = n[t](a, ...r);
  return o ? toWrapped(e, l) : l;
}
function searchProxy(e, t, s) {
  const r = toRaw(e);
  track(r, 'iterate', ARRAY_ITERATE_KEY);
  const n = r[t](...s);
  return (n === -1 || n === !1) && isProxy(s[0])
    ? ((s[0] = toRaw(s[0])), r[t](...s))
    : n;
}
function noTracking(e, t, s = []) {
  (pauseTracking(), startBatch());
  const r = toRaw(e)[t].apply(e, s);
  return (endBatch(), resetTracking(), r);
}
const isNonTrackableKeys = makeMap('__proto__,__v_isRef,__isVue'),
  builtInSymbols = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== 'arguments' && e !== 'caller')
      .map((e) => Symbol[e])
      .filter(isSymbol),
  );
function hasOwnProperty(e) {
  isSymbol(e) || (e = String(e));
  const t = toRaw(this);
  return (track(t, 'has', e), t.hasOwnProperty(e));
}
class BaseReactiveHandler {
  constructor(t = !1, s = !1) {
    ((this._isReadonly = t), (this._isShallow = s));
  }
  get(t, s, r) {
    if (s === '__v_skip') return t.__v_skip;
    const n = this._isReadonly,
      i = this._isShallow;
    if (s === '__v_isReactive') return !n;
    if (s === '__v_isReadonly') return n;
    if (s === '__v_isShallow') return i;
    if (s === '__v_raw')
      return r ===
        (n
          ? i
            ? shallowReadonlyMap
            : readonlyMap
          : i
            ? shallowReactiveMap
            : reactiveMap
        ).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(r)
        ? t
        : void 0;
    const a = isArray(t);
    if (!n) {
      let l;
      if (a && (l = arrayInstrumentations[s])) return l;
      if (s === 'hasOwnProperty') return hasOwnProperty;
    }
    const o = Reflect.get(t, s, isRef(t) ? t : r);
    if (
      (isSymbol(s) ? builtInSymbols.has(s) : isNonTrackableKeys(s)) ||
      (n || track(t, 'get', s), i)
    )
      return o;
    if (isRef(o)) {
      const l = a && isIntegerKey(s) ? o : o.value;
      return n && isObject(l) ? readonly(l) : l;
    }
    return isObject(o) ? (n ? readonly(o) : reactive(o)) : o;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, s, r, n) {
    let i = t[s];
    const a = isArray(t) && isIntegerKey(s);
    if (!this._isShallow) {
      const d = isReadonly(i);
      if (
        (!isShallow(r) && !isReadonly(r) && ((i = toRaw(i)), (r = toRaw(r))),
        !a && isRef(i) && !isRef(r))
      )
        return (d || (i.value = r), !0);
    }
    const o = a ? Number(s) < t.length : hasOwn(t, s),
      l = Reflect.set(t, s, r, isRef(t) ? t : n);
    return (
      t === toRaw(n) &&
        l &&
        (o
          ? hasChanged(r, i) && trigger(t, 'set', s, r)
          : trigger(t, 'add', s, r)),
      l
    );
  }
  deleteProperty(t, s) {
    const r = hasOwn(t, s);
    t[s];
    const n = Reflect.deleteProperty(t, s);
    return (n && r && trigger(t, 'delete', s, void 0), n);
  }
  has(t, s) {
    const r = Reflect.has(t, s);
    return ((!isSymbol(s) || !builtInSymbols.has(s)) && track(t, 'has', s), r);
  }
  ownKeys(t) {
    return (
      track(t, 'iterate', isArray(t) ? 'length' : ITERATE_KEY),
      Reflect.ownKeys(t)
    );
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, s) {
    return !0;
  }
  deleteProperty(t, s) {
    return !0;
  }
}
const mutableHandlers = new MutableReactiveHandler(),
  readonlyHandlers = new ReadonlyReactiveHandler(),
  shallowReactiveHandlers = new MutableReactiveHandler(!0),
  shallowReadonlyHandlers = new ReadonlyReactiveHandler(!0),
  toShallow = (e) => e,
  getProto = (e) => Reflect.getPrototypeOf(e);
function createIterableMethod(e, t, s) {
  return function (...r) {
    const n = this.__v_raw,
      i = toRaw(n),
      a = isMap(i),
      o = e === 'entries' || (e === Symbol.iterator && a),
      l = e === 'keys' && a,
      d = n[e](...r),
      c = s ? toShallow : t ? toReadonly : toReactive;
    return (
      !t && track(i, 'iterate', l ? MAP_KEY_ITERATE_KEY : ITERATE_KEY),
      extend(Object.create(d), {
        next() {
          const { value: f, done: v } = d.next();
          return v
            ? { value: f, done: v }
            : { value: o ? [c(f[0]), c(f[1])] : c(f), done: v };
        },
      })
    );
  };
}
function createReadonlyMethod(e) {
  return function (...t) {
    return e === 'delete' ? !1 : e === 'clear' ? void 0 : this;
  };
}
function createInstrumentations(e, t) {
  const s = {
    get(n) {
      const i = this.__v_raw,
        a = toRaw(i),
        o = toRaw(n);
      e || (hasChanged(n, o) && track(a, 'get', n), track(a, 'get', o));
      const { has: l } = getProto(a),
        d = t ? toShallow : e ? toReadonly : toReactive;
      if (l.call(a, n)) return d(i.get(n));
      if (l.call(a, o)) return d(i.get(o));
      i !== a && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return (!e && track(toRaw(n), 'iterate', ITERATE_KEY), n.size);
    },
    has(n) {
      const i = this.__v_raw,
        a = toRaw(i),
        o = toRaw(n);
      return (
        e || (hasChanged(n, o) && track(a, 'has', n), track(a, 'has', o)),
        n === o ? i.has(n) : i.has(n) || i.has(o)
      );
    },
    forEach(n, i) {
      const a = this,
        o = a.__v_raw,
        l = toRaw(o),
        d = t ? toShallow : e ? toReadonly : toReactive;
      return (
        !e && track(l, 'iterate', ITERATE_KEY),
        o.forEach((c, f) => n.call(i, d(c), d(f), a))
      );
    },
  };
  return (
    extend(
      s,
      e
        ? {
            add: createReadonlyMethod('add'),
            set: createReadonlyMethod('set'),
            delete: createReadonlyMethod('delete'),
            clear: createReadonlyMethod('clear'),
          }
        : {
            add(n) {
              const i = toRaw(this),
                a = getProto(i),
                o = toRaw(n),
                l = !t && !isShallow(n) && !isReadonly(n) ? o : n;
              return (
                a.has.call(i, l) ||
                  (hasChanged(n, l) && a.has.call(i, n)) ||
                  (hasChanged(o, l) && a.has.call(i, o)) ||
                  (i.add(l), trigger(i, 'add', l, l)),
                this
              );
            },
            set(n, i) {
              !t && !isShallow(i) && !isReadonly(i) && (i = toRaw(i));
              const a = toRaw(this),
                { has: o, get: l } = getProto(a);
              let d = o.call(a, n);
              d || ((n = toRaw(n)), (d = o.call(a, n)));
              const c = l.call(a, n);
              return (
                a.set(n, i),
                d
                  ? hasChanged(i, c) && trigger(a, 'set', n, i)
                  : trigger(a, 'add', n, i),
                this
              );
            },
            delete(n) {
              const i = toRaw(this),
                { has: a, get: o } = getProto(i);
              let l = a.call(i, n);
              (l || ((n = toRaw(n)), (l = a.call(i, n))), o && o.call(i, n));
              const d = i.delete(n);
              return (l && trigger(i, 'delete', n, void 0), d);
            },
            clear() {
              const n = toRaw(this),
                i = n.size !== 0,
                a = n.clear();
              return (i && trigger(n, 'clear', void 0, void 0), a);
            },
          },
    ),
    ['keys', 'values', 'entries', Symbol.iterator].forEach((n) => {
      s[n] = createIterableMethod(n, e, t);
    }),
    s
  );
}
function createInstrumentationGetter(e, t) {
  const s = createInstrumentations(e, t);
  return (r, n, i) =>
    n === '__v_isReactive'
      ? !e
      : n === '__v_isReadonly'
        ? e
        : n === '__v_isShallow'
          ? t
          : n === '__v_raw'
            ? r
            : Reflect.get(hasOwn(s, n) && n in r ? s : r, n, i);
}
const mutableCollectionHandlers = { get: createInstrumentationGetter(!1, !1) },
  shallowCollectionHandlers = { get: createInstrumentationGetter(!1, !0) },
  readonlyCollectionHandlers = { get: createInstrumentationGetter(!0, !1) },
  shallowReadonlyCollectionHandlers = {
    get: createInstrumentationGetter(!0, !0),
  },
  reactiveMap = new WeakMap(),
  shallowReactiveMap = new WeakMap(),
  readonlyMap = new WeakMap(),
  shallowReadonlyMap = new WeakMap();
function targetTypeMap(e) {
  switch (e) {
    case 'Object':
    case 'Array':
      return 1;
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2;
    default:
      return 0;
  }
}
function reactive(e) {
  return isReadonly(e)
    ? e
    : createReactiveObject(
        e,
        !1,
        mutableHandlers,
        mutableCollectionHandlers,
        reactiveMap,
      );
}
function shallowReactive(e) {
  return createReactiveObject(
    e,
    !1,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap,
  );
}
function readonly(e) {
  return createReactiveObject(
    e,
    !0,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap,
  );
}
function shallowReadonly(e) {
  return createReactiveObject(
    e,
    !0,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap,
  );
}
function createReactiveObject(e, t, s, r, n) {
  if (
    !isObject(e) ||
    (e.__v_raw && !(t && e.__v_isReactive)) ||
    e.__v_skip ||
    !Object.isExtensible(e)
  )
    return e;
  const i = n.get(e);
  if (i) return i;
  const a = targetTypeMap(toRawType(e));
  if (a === 0) return e;
  const o = new Proxy(e, a === 2 ? r : s);
  return (n.set(e, o), o);
}
function isReactive(e) {
  return isReadonly(e) ? isReactive(e.__v_raw) : !!(e && e.__v_isReactive);
}
function isReadonly(e) {
  return !!(e && e.__v_isReadonly);
}
function isShallow(e) {
  return !!(e && e.__v_isShallow);
}
function isProxy(e) {
  return e ? !!e.__v_raw : !1;
}
function toRaw(e) {
  const t = e && e.__v_raw;
  return t ? toRaw(t) : e;
}
function markRaw(e) {
  return (
    !hasOwn(e, '__v_skip') && Object.isExtensible(e) && def(e, '__v_skip', !0),
    e
  );
}
const toReactive = (e) => (isObject(e) ? reactive(e) : e),
  toReadonly = (e) => (isObject(e) ? readonly(e) : e);
function isRef(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function ref(e) {
  return createRef(e, !1);
}
function createRef(e, t) {
  return isRef(e) ? e : new RefImpl(e, t);
}
class RefImpl {
  constructor(t, s) {
    ((this.dep = new Dep()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = s ? t : toRaw(t)),
      (this._value = s ? t : toReactive(t)),
      (this.__v_isShallow = s));
  }
  get value() {
    return (this.dep.track(), this._value);
  }
  set value(t) {
    const s = this._rawValue,
      r = this.__v_isShallow || isShallow(t) || isReadonly(t);
    ((t = r ? t : toRaw(t)),
      hasChanged(t, s) &&
        ((this._rawValue = t),
        (this._value = r ? t : toReactive(t)),
        this.dep.trigger()));
  }
}
function unref(e) {
  return isRef(e) ? e.value : e;
}
const shallowUnwrapHandlers = {
  get: (e, t, s) => (t === '__v_raw' ? e : unref(Reflect.get(e, t, s))),
  set: (e, t, s, r) => {
    const n = e[t];
    return isRef(n) && !isRef(s)
      ? ((n.value = s), !0)
      : Reflect.set(e, t, s, r);
  },
};
function proxyRefs(e) {
  return isReactive(e) ? e : new Proxy(e, shallowUnwrapHandlers);
}
function toRefs(e) {
  const t = isArray(e) ? new Array(e.length) : {};
  for (const s in e) t[s] = propertyToRef(e, s);
  return t;
}
class ObjectRefImpl {
  constructor(t, s, r) {
    ((this._object = t),
      (this._defaultValue = r),
      (this.__v_isRef = !0),
      (this._value = void 0),
      (this._key = isSymbol(s) ? s : String(s)),
      (this._raw = toRaw(t)));
    let n = !0,
      i = t;
    if (!isArray(t) || isSymbol(this._key) || !isIntegerKey(this._key))
      do n = !isProxy(i) || isShallow(i);
      while (n && (i = i.__v_raw));
    this._shallow = n;
  }
  get value() {
    let t = this._object[this._key];
    return (
      this._shallow && (t = unref(t)),
      (this._value = t === void 0 ? this._defaultValue : t)
    );
  }
  set value(t) {
    if (this._shallow && isRef(this._raw[this._key])) {
      const s = this._object[this._key];
      if (isRef(s)) {
        s.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return getDepFromReactive(this._raw, this._key);
  }
}
function propertyToRef(e, t, s) {
  return new ObjectRefImpl(e, t, s);
}
class ComputedRefImpl {
  constructor(t, s, r) {
    ((this.fn = t),
      (this.setter = s),
      (this._value = void 0),
      (this.dep = new Dep(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = globalVersion - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !s),
      (this.isSSR = r));
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && activeSub !== this))
      return (batch(this, !0), !0);
  }
  get value() {
    const t = this.dep.track();
    return (
      refreshComputed(this),
      t && (t.version = this.dep.version),
      this._value
    );
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function computed$1(e, t, s = !1) {
  let r, n;
  return (
    isFunction(e) ? (r = e) : ((r = e.get), (n = e.set)),
    new ComputedRefImpl(r, n, s)
  );
}
const INITIAL_WATCHER_VALUE = {},
  cleanupMap = new WeakMap();
let activeWatcher;
function onWatcherCleanup(e, t = !1, s = activeWatcher) {
  if (s) {
    let r = cleanupMap.get(s);
    (r || cleanupMap.set(s, (r = [])), r.push(e));
  }
}
function watch$1(e, t, s = EMPTY_OBJ) {
  const {
      immediate: r,
      deep: n,
      once: i,
      scheduler: a,
      augmentJob: o,
      call: l,
    } = s,
    d = (E) =>
      n
        ? E
        : isShallow(E) || n === !1 || n === 0
          ? traverse(E, 1)
          : traverse(E);
  let c,
    f,
    v,
    M,
    P = !1,
    B = !1;
  if (
    (isRef(e)
      ? ((f = () => e.value), (P = isShallow(e)))
      : isReactive(e)
        ? ((f = () => d(e)), (P = !0))
        : isArray(e)
          ? ((B = !0),
            (P = e.some((E) => isReactive(E) || isShallow(E))),
            (f = () =>
              e.map((E) => {
                if (isRef(E)) return E.value;
                if (isReactive(E)) return d(E);
                if (isFunction(E)) return l ? l(E, 2) : E();
              })))
          : isFunction(e)
            ? t
              ? (f = l ? () => l(e, 2) : e)
              : (f = () => {
                  if (v) {
                    pauseTracking();
                    try {
                      v();
                    } finally {
                      resetTracking();
                    }
                  }
                  const E = activeWatcher;
                  activeWatcher = c;
                  try {
                    return l ? l(e, 3, [M]) : e(M);
                  } finally {
                    activeWatcher = E;
                  }
                })
            : (f = NOOP),
    t && n)
  ) {
    const E = f,
      F = n === !0 ? 1 / 0 : n;
    f = () => traverse(E(), F);
  }
  const $ = getCurrentScope(),
    I = () => {
      (c.stop(), $ && $.active && remove($.effects, c));
    };
  if (i && t) {
    const E = t;
    t = (...F) => {
      try {
        return E(...F);
      } finally {
        I();
      }
    };
  }
  let O = B
    ? new Array(e.length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE;
  const j = (E) => {
    if (!(!(c.flags & 1) || (!c.dirty && !E)))
      if (t) {
        const F = c.run();
        if (
          E ||
          n ||
          P ||
          (B ? F.some((q, z) => hasChanged(q, O[z])) : hasChanged(F, O))
        ) {
          const q = activeWatcher;
          pauseTracking();
          try {
            (v && v(), (activeWatcher = c));
            const z = [
              F,
              O === INITIAL_WATCHER_VALUE
                ? void 0
                : B && O[0] === INITIAL_WATCHER_VALUE
                  ? []
                  : O,
              M,
            ];
            ((O = F), l ? l(t, 3, z) : t(...z));
          } finally {
            ((activeWatcher = q), resetTracking());
          }
        }
      } else c.run();
  };
  return (
    o && o(j),
    (c = new ReactiveEffect(f)),
    (c.scheduler = a ? () => a(j, !1) : j),
    (M = (E) => onWatcherCleanup(E, !1, c)),
    (v = c.onStop =
      () => {
        const E = cleanupMap.get(c);
        if (E) {
          if (l) l(E, 4);
          else for (const F of E) F();
          cleanupMap.delete(c);
        }
      }),
    t ? (r ? j(!0) : (O = c.run())) : a ? a(j.bind(null, !0), !0) : c.run(),
    (I.pause = c.pause.bind(c)),
    (I.resume = c.resume.bind(c)),
    (I.stop = I),
    I
  );
}
function traverse(e, t = 1 / 0, s) {
  if (
    t <= 0 ||
    !isObject(e) ||
    e.__v_skip ||
    ((s = s || new Map()), (s.get(e) || 0) >= t)
  )
    return e;
  if ((s.set(e, t), t--, isRef(e))) traverse(e.value, t, s);
  else if (isArray(e)) for (let r = 0; r < e.length; r++) traverse(e[r], t, s);
  else if (isSet(e) || isMap(e))
    e.forEach((r) => {
      traverse(r, t, s);
    });
  else if (isPlainObject(e)) {
    for (const r in e) traverse(e[r], t, s);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && traverse(e[r], t, s);
  }
  return e;
}
const stack = [];
let isWarning = !1;
function warn$1(e, ...t) {
  if (isWarning) return;
  ((isWarning = !0), pauseTracking());
  const s = stack.length ? stack[stack.length - 1].component : null,
    r = s && s.appContext.config.warnHandler,
    n = getComponentTrace();
  if (r)
    callWithErrorHandling(r, s, 11, [
      e +
        t
          .map((i) => {
            var a, o;
            return (o = (a = i.toString) == null ? void 0 : a.call(i)) != null
              ? o
              : JSON.stringify(i);
          })
          .join(''),
      s && s.proxy,
      n.map(({ vnode: i }) => `at <${formatComponentName(s, i.type)}>`).join(`
`),
      n,
    ]);
  else {
    const i = [`[Vue warn]: ${e}`, ...t];
    (n.length &&
      i.push(
        `
`,
        ...formatTrace(n),
      ),
      console.warn(...i));
  }
  (resetTracking(), (isWarning = !1));
}
function getComponentTrace() {
  let e = stack[stack.length - 1];
  if (!e) return [];
  const t = [];
  for (; e; ) {
    const s = t[0];
    s && s.vnode === e
      ? s.recurseCount++
      : t.push({ vnode: e, recurseCount: 0 });
    const r = e.component && e.component.parent;
    e = r && r.vnode;
  }
  return t;
}
function formatTrace(e) {
  const t = [];
  return (
    e.forEach((s, r) => {
      t.push(
        ...(r === 0
          ? []
          : [
              `
`,
            ]),
        ...formatTraceEntry(s),
      );
    }),
    t
  );
}
function formatTraceEntry({ vnode: e, recurseCount: t }) {
  const s = t > 0 ? `... (${t} recursive calls)` : '',
    r = e.component ? e.component.parent == null : !1,
    n = ` at <${formatComponentName(e.component, e.type, r)}`,
    i = '>' + s;
  return e.props ? [n, ...formatProps(e.props), i] : [n + i];
}
function formatProps(e) {
  const t = [],
    s = Object.keys(e);
  return (
    s.slice(0, 3).forEach((r) => {
      t.push(...formatProp(r, e[r]));
    }),
    s.length > 3 && t.push(' ...'),
    t
  );
}
function formatProp(e, t, s) {
  return isString(t)
    ? ((t = JSON.stringify(t)), s ? t : [`${e}=${t}`])
    : typeof t == 'number' || typeof t == 'boolean' || t == null
      ? s
        ? t
        : [`${e}=${t}`]
      : isRef(t)
        ? ((t = formatProp(e, toRaw(t.value), !0)),
          s ? t : [`${e}=Ref<`, t, '>'])
        : isFunction(t)
          ? [`${e}=fn${t.name ? `<${t.name}>` : ''}`]
          : ((t = toRaw(t)), s ? t : [`${e}=`, t]);
}
function callWithErrorHandling(e, t, s, r) {
  try {
    return r ? e(...r) : e();
  } catch (n) {
    handleError(n, t, s);
  }
}
function callWithAsyncErrorHandling(e, t, s, r) {
  if (isFunction(e)) {
    const n = callWithErrorHandling(e, t, s, r);
    return (
      n &&
        isPromise(n) &&
        n.catch((i) => {
          handleError(i, t, s);
        }),
      n
    );
  }
  if (isArray(e)) {
    const n = [];
    for (let i = 0; i < e.length; i++)
      n.push(callWithAsyncErrorHandling(e[i], t, s, r));
    return n;
  }
}
function handleError(e, t, s, r = !0) {
  const n = t ? t.vnode : null,
    { errorHandler: i, throwUnhandledErrorInProduction: a } =
      (t && t.appContext.config) || EMPTY_OBJ;
  if (t) {
    let o = t.parent;
    const l = t.proxy,
      d = `https://vuejs.org/error-reference/#runtime-${s}`;
    for (; o; ) {
      const c = o.ec;
      if (c) {
        for (let f = 0; f < c.length; f++) if (c[f](e, l, d) === !1) return;
      }
      o = o.parent;
    }
    if (i) {
      (pauseTracking(),
        callWithErrorHandling(i, null, 10, [e, l, d]),
        resetTracking());
      return;
    }
  }
  logError(e, s, n, r, a);
}
function logError(e, t, s, r = !0, n = !1) {
  if (n) throw e;
  console.error(e);
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null,
  postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
function nextTick(e) {
  const t = currentFlushPromise || resolvedPromise;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function findInsertionIndex(e) {
  let t = flushIndex + 1,
    s = queue.length;
  for (; t < s; ) {
    const r = (t + s) >>> 1,
      n = queue[r],
      i = getId(n);
    i < e || (i === e && n.flags & 2) ? (t = r + 1) : (s = r);
  }
  return t;
}
function queueJob(e) {
  if (!(e.flags & 1)) {
    const t = getId(e),
      s = queue[queue.length - 1];
    (!s || (!(e.flags & 2) && t >= getId(s))
      ? queue.push(e)
      : queue.splice(findInsertionIndex(t), 0, e),
      (e.flags |= 1),
      queueFlush());
  }
}
function queueFlush() {
  currentFlushPromise ||
    (currentFlushPromise = resolvedPromise.then(flushJobs));
}
function queuePostFlushCb(e) {
  if (!isArray(e))
    activePostFlushCbs && e.id === -1
      ? activePostFlushCbs.splice(postFlushIndex + 1, 0, e)
      : e.flags & 1 || (pendingPostFlushCbs.push(e), (e.flags |= 1));
  else for (let t = 0; t < e.length; t++) pendingPostFlushCbs.push(e[t]);
  queueFlush();
}
function flushPreFlushCbs(e, t, s, r = flushIndex + 1) {
  for (; r < queue.length; r++) {
    const n = queue[r];
    if (n && n.flags & 2) {
      if ((e && n.id !== e.uid) || (t !== void 0 && !(n.id >= t))) continue;
      (queue.splice(r, 1),
        (r = e ? r - 1 : flushIndex),
        n.flags & 4 && (n.flags &= -2),
        n(),
        n.flags & 4 || (n.flags &= -2));
    }
  }
}
function flushPostFlushCbs(e, t, s = 0) {
  if (pendingPostFlushCbs.length) {
    let r = pendingPostFlushCbs,
      n = 0;
    if (t) {
      r = [];
      for (let a = 0; a < pendingPostFlushCbs.length; a++) {
        const o = pendingPostFlushCbs[a];
        (o.i !== void 0 ? !o.i || o.i.uid < s : t.has(o))
          ? (pendingPostFlushCbs[n++] = o)
          : r.push(o);
      }
    }
    const i = [...new Set(r)].sort((a, o) => getId(a) - getId(o));
    if (((pendingPostFlushCbs.length = n), activePostFlushCbs)) {
      for (let a = 0; a < i.length; a++) activePostFlushCbs.push(i[a]);
      return;
    }
    for (
      activePostFlushCbs = i, postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      const a = activePostFlushCbs[postFlushIndex];
      (a.flags & 4 && (a.flags &= -2), a.flags & 8 || a(), (a.flags &= -2));
    }
    ((activePostFlushCbs = null), (postFlushIndex = 0));
  }
}
let isFlushing = !1;
function flushOnAppMount(e, t) {
  if (isFlushing) {
    e();
    return;
  }
  const s = t === void 0 ? void 0 : new Set(pendingPostFlushCbs);
  (e(), (isFlushing = !0));
  try {
    (flushPreFlushCbs(void 0, t), flushPostFlushCbs(void 0, s, t));
  } finally {
    isFlushing = !1;
  }
}
const getId = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function flushJobs(e) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const t = queue[flushIndex];
      t &&
        !(t.flags & 8) &&
        (t.flags & 4 && (t.flags &= -2),
        callWithErrorHandling(t, t.i, t.i ? 15 : 14),
        t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const t = queue[flushIndex];
      t && (t.flags &= -2);
    }
    ((flushIndex = -1),
      (queue.length = 0),
      flushPostFlushCbs(),
      (currentFlushPromise = null),
      (queue.length || pendingPostFlushCbs.length) && flushJobs());
  }
}
let currentRenderingInstance = null,
  currentScopeId = null;
function setCurrentRenderingInstance(e) {
  const t = currentRenderingInstance;
  return (
    (currentRenderingInstance = e),
    (currentScopeId = (e && e.type.__scopeId) || null),
    t
  );
}
function withCtx(e, t = currentRenderingInstance, s) {
  if (!t || e._n) return e;
  const r = (...n) => {
    r._d && setBlockTracking(-1);
    const i = setCurrentRenderingInstance(t),
      a = blockStack.length;
    let o;
    try {
      o = e(...n);
    } finally {
      for (let l = blockStack.length; l > a; l--) closeBlock();
      (setCurrentRenderingInstance(i), r._d && setBlockTracking(1));
    }
    return o;
  };
  return ((r._n = !0), (r._c = !0), (r._d = !0), r);
}
function withDirectives(e, t) {
  if (currentRenderingInstance === null) return e;
  const s = getComponentPublicInstance(currentRenderingInstance),
    r = e.dirs || (e.dirs = []);
  for (let n = 0; n < t.length; n++) {
    let [i, a, o, l = EMPTY_OBJ] = t[n];
    i &&
      (isFunction(i) && (i = { mounted: i, updated: i }),
      i.deep && traverse(a),
      r.push({
        dir: i,
        instance: s,
        value: a,
        oldValue: void 0,
        arg: o,
        modifiers: l,
      }));
  }
  return e;
}
function invokeDirectiveHook(e, t, s, r) {
  const n = e.dirs,
    i = t && t.dirs;
  for (let a = 0; a < n.length; a++) {
    const o = n[a];
    i && (o.oldValue = i[a].value);
    let l = o.dir[r];
    l &&
      (pauseTracking(),
      callWithAsyncErrorHandling(l, s, 8, [e.el, o, e, t]),
      resetTracking());
  }
}
function provide(e, t) {
  if (currentInstance) {
    let s = currentInstance.provides;
    const r = currentInstance.parent && currentInstance.parent.provides;
    (r === s && (s = currentInstance.provides = Object.create(r)), (s[e] = t));
  }
}
function inject(e, t, s = !1) {
  const r = getCurrentInstance();
  if (r || currentApp) {
    let n = currentApp
      ? currentApp._context.provides
      : r
        ? r.parent == null || r.ce
          ? r.vnode.appContext && r.vnode.appContext.provides
          : r.parent.provides
        : void 0;
    if (n && e in n) return n[e];
    if (arguments.length > 1)
      return s && isFunction(t) ? t.call(r && r.proxy) : t;
  }
}
const ssrContextKey = Symbol.for('v-scx'),
  useSSRContext = () => inject(ssrContextKey);
function watch(e, t, s) {
  return doWatch(e, t, s);
}
function doWatch(e, t, s = EMPTY_OBJ) {
  const { immediate: r, deep: n, flush: i, once: a } = s,
    o = extend({}, s),
    l = (t && r) || (!t && i !== 'post');
  let d;
  if (isInSSRComponentSetup) {
    if (i === 'sync') {
      const M = useSSRContext();
      d = M.__watcherHandles || (M.__watcherHandles = []);
    } else if (!l) {
      const M = () => {};
      return ((M.stop = NOOP), (M.resume = NOOP), (M.pause = NOOP), M);
    }
  }
  const c = currentInstance;
  o.call = (M, P, B) => callWithAsyncErrorHandling(M, c, P, B);
  let f = !1;
  (i === 'post'
    ? (o.scheduler = (M) => {
        ((M.i = c), queuePostRenderEffect(M, c && c.suspense));
      })
    : i !== 'sync' &&
      ((f = !0),
      (o.scheduler = (M, P) => {
        P ? M() : queueJob(M);
      })),
    (o.augmentJob = (M) => {
      (t && (M.flags |= 4),
        f && ((M.flags |= 2), c && ((M.id = c.uid), (M.i = c))));
    }));
  const v = watch$1(e, t, o);
  return (isInSSRComponentSetup && (d ? d.push(v) : l && v()), v);
}
function instanceWatch(e, t, s) {
  const r = this.proxy,
    n = isString(e)
      ? e.includes('.')
        ? createPathGetter(r, e)
        : () => r[e]
      : e.bind(r, r);
  let i;
  isFunction(t) ? (i = t) : ((i = t.handler), (s = t));
  const a = setCurrentInstance(this),
    o = doWatch(n, i.bind(r), s);
  return (a(), o);
}
function createPathGetter(e, t) {
  const s = t.split('.');
  return () => {
    let r = e;
    for (let n = 0; n < s.length && r; n++) r = r[s[n]];
    return r;
  };
}
const TeleportEndKey = Symbol('_vte'),
  isTeleport = (e) => e.__isTeleport,
  leaveCbKey = Symbol('_leaveCb');
function findNonCommentChild(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const s of e)
      if (s.type !== Comment) {
        t = s;
        break;
      }
  }
  return t;
}
function getInnerChild$1(e) {
  if (!isKeepAlive(e))
    return isTeleport(e.type) && e.children
      ? findNonCommentChild(e.children)
      : e;
  if (e.component) return e.component.subTree;
  const { shapeFlag: t, children: s } = e;
  if (s) {
    if (t & 16) return s[0];
    if (t & 32 && isFunction(s.default)) return s.default();
  }
}
function setTransitionHooks(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const s = e.component.subTree;
    setTransitionHooks((isTeleport(s.type) && getInnerChild$1(s)) || s, t);
  } else if (e.shapeFlag & 128)
    ((e.ssContent.transition = t.clone(e.ssContent)),
      (e.ssFallback.transition = t.clone(e.ssFallback)));
  else if (((e.transition = t), e.type === Fragment && isArray(e.children))) {
    const s = filterSingleRoot(e.children, !1);
    s && setTransitionHooks(s, t);
  }
}
function getTransitionRoot(e) {
  if (e.component) return getTransitionRoot(e.component.subTree);
  if (e.type === Fragment) {
    const t = isArray(e.children) && filterSingleRoot(e.children, !1);
    return t ? getTransitionRoot(t) : void 0;
  }
  if (e.type !== Comment) return e;
}
function defineComponent(e, t) {
  return isFunction(e) ? extend({ name: e.name }, t, { setup: e }) : e;
}
function markAsyncBoundary(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + '-', 0, 0];
}
function isTemplateRefKey(e, t) {
  let s;
  return !!((s = Object.getOwnPropertyDescriptor(e, t)) && !s.configurable);
}
const pendingSetRefMap = new WeakMap();
function setRef(e, t, s, r, n = !1) {
  if (isArray(e)) {
    e.forEach((B, $) => setRef(B, t && (isArray(t) ? t[$] : t), s, r, n));
    return;
  }
  if (isAsyncWrapper(r) && !n) {
    r.shapeFlag & 512 &&
      r.type.__asyncResolved &&
      r.component.subTree.component &&
      setRef(e, t, s, r.component.subTree);
    return;
  }
  const i = r.shapeFlag & 4 ? getComponentPublicInstance(r.component) : r.el,
    a = n ? null : i,
    { i: o, r: l } = e,
    d = t && t.r,
    c = o.refs === EMPTY_OBJ ? (o.refs = {}) : o.refs,
    f = o.setupState,
    v = toRaw(f),
    M =
      f === EMPTY_OBJ
        ? NO
        : (B) => (isTemplateRefKey(c, B) ? !1 : hasOwn(v, B)),
    P = (B, $) => !($ && isTemplateRefKey(c, $));
  if (d != null && d !== l) {
    if ((invalidatePendingSetRef(t), isString(d)))
      ((c[d] = null), M(d) && (f[d] = null));
    else if (isRef(d)) {
      const B = t;
      (P(d, B.k) && (d.value = null), B.k && (c[B.k] = null));
    }
  }
  if (isFunction(l)) callWithErrorHandling(l, o, 12, [a, c]);
  else {
    const B = isString(l),
      $ = isRef(l);
    if (B || $) {
      const I = () => {
        if (e.f) {
          const O = B ? (M(l) ? f[l] : c[l]) : P() || !e.k ? l.value : c[e.k];
          if (n) isArray(O) && remove(O, i);
          else if (isArray(O)) O.includes(i) || O.push(i);
          else if (B) ((c[l] = [i]), M(l) && (f[l] = c[l]));
          else {
            const j = [i];
            (P(l, e.k) && (l.value = j), e.k && (c[e.k] = j));
          }
        } else
          B
            ? ((c[l] = a), M(l) && (f[l] = a))
            : $ && (P(l, e.k) && (l.value = a), e.k && (c[e.k] = a));
      };
      if (a) {
        const O = () => {
          (I(), pendingSetRefMap.delete(e));
        };
        ((O.id = -1), pendingSetRefMap.set(e, O), queuePostRenderEffect(O, s));
      } else (invalidatePendingSetRef(e), I());
    }
  }
}
function invalidatePendingSetRef(e) {
  const t = pendingSetRefMap.get(e);
  t && ((t.flags |= 8), pendingSetRefMap.delete(e));
}
getGlobalThis().requestIdleCallback;
getGlobalThis().cancelIdleCallback;
const isAsyncWrapper = (e) => !!e.type.__asyncLoader,
  isKeepAlive = (e) => e.type.__isKeepAlive;
function onActivated(e, t) {
  registerKeepAliveHook(e, 'a', t);
}
function onDeactivated(e, t) {
  registerKeepAliveHook(e, 'da', t);
}
function registerKeepAliveHook(e, t, s = currentInstance) {
  const r =
    e.__wdc ||
    (e.__wdc = () => {
      let n = s;
      for (; n; ) {
        if (n.isDeactivated) return;
        n = n.parent;
      }
      return e();
    });
  if ((injectHook(t, r, s), s)) {
    let n = s.parent;
    for (; n && n.parent; )
      (isKeepAlive(n.parent.vnode) && injectToKeepAliveRoot(r, t, s, n),
        (n = n.parent));
  }
}
function injectToKeepAliveRoot(e, t, s, r) {
  const n = injectHook(t, e, r, !0);
  onUnmounted(() => {
    remove(r[t], n);
  }, s);
}
function injectHook(e, t, s = currentInstance, r = !1) {
  if (s) {
    const n = s[e] || (s[e] = []),
      i =
        t.__weh ||
        (t.__weh = (...a) => {
          pauseTracking();
          const o = setCurrentInstance(s),
            l = callWithAsyncErrorHandling(t, s, e, a);
          return (o(), resetTracking(), l);
        });
    return (r ? n.unshift(i) : n.push(i), i);
  }
}
const createHook =
    (e) =>
    (t, s = currentInstance) => {
      (!isInSSRComponentSetup || e === 'sp') &&
        injectHook(e, (...r) => t(...r), s);
    },
  onBeforeMount = createHook('bm'),
  onMounted = createHook('m'),
  onBeforeUpdate = createHook('bu'),
  onUpdated = createHook('u'),
  onBeforeUnmount = createHook('bum'),
  onUnmounted = createHook('um'),
  onServerPrefetch = createHook('sp'),
  onRenderTriggered = createHook('rtg'),
  onRenderTracked = createHook('rtc');
function onErrorCaptured(e, t = currentInstance) {
  injectHook('ec', e, t);
}
const COMPONENTS = 'components';
function resolveComponent(e, t) {
  return resolveAsset(COMPONENTS, e, !0, t) || e;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for('v-ndc');
function resolveAsset(e, t, s = !0, r = !1) {
  const n = currentRenderingInstance || currentInstance;
  if (n) {
    const i = n.type;
    {
      const o = getComponentName(i, !1);
      if (o && (o === t || o === camelize(t) || o === capitalize(camelize(t))))
        return i;
    }
    const a = resolve(n[e] || i[e], t) || resolve(n.appContext[e], t);
    return !a && r ? i : a;
  }
}
function resolve(e, t) {
  return e && (e[t] || e[camelize(t)] || e[capitalize(camelize(t))]);
}
function renderList(e, t, s, r) {
  let n;
  const i = s,
    a = isArray(e);
  if (a || isString(e)) {
    const o = a && isReactive(e);
    let l = !1,
      d = !1;
    (o && ((l = !isShallow(e)), (d = isReadonly(e)), (e = shallowReadArray(e))),
      (n = new Array(e.length)));
    for (let c = 0, f = e.length; c < f; c++)
      n[c] = t(
        l ? (d ? toReadonly(toReactive(e[c])) : toReactive(e[c])) : e[c],
        c,
        void 0,
        i,
      );
  } else if (typeof e == 'number')
    if (!Number.isInteger(e) || e < 0) n = [];
    else {
      n = new Array(e);
      for (let o = 0; o < e; o++) n[o] = t(o + 1, o, void 0, i);
    }
  else if (isObject(e))
    if (e[Symbol.iterator]) n = Array.from(e, (o, l) => t(o, l, void 0, i));
    else {
      const o = Object.keys(e);
      n = new Array(o.length);
      for (let l = 0, d = o.length; l < d; l++) {
        const c = o[l];
        n[l] = t(e[c], c, l, i);
      }
    }
  else n = [];
  return n;
}
function renderSlot(e, t, s, r, n, i) {
  if (
    (s == null && (s = {}),
    currentRenderingInstance.ce ||
      (currentRenderingInstance.parent &&
        isAsyncWrapper(currentRenderingInstance.parent) &&
        currentRenderingInstance.parent.ce))
  ) {
    const d = s,
      c = Object.keys(d).length > 0;
    return (
      t !== 'default' && (d.name = t),
      openBlock(),
      createBlock(
        Fragment,
        null,
        [createVNode('slot', d, r && r())],
        c ? -2 : 64,
      )
    );
  }
  let a = e[t];
  a && a._c && (a._d = !1);
  const o = blockStack.length;
  openBlock();
  let l;
  try {
    const d = a && ensureValidVNode(a(s)),
      c = s.key || i || (d && d.key);
    l = createBlock(
      Fragment,
      { key: (c && !isSymbol(c) ? c : `_${t}`) + (!d && r ? '_fb' : '') },
      d || (r ? r() : []),
      d && e._ === 1 ? 64 : -2,
    );
  } catch (d) {
    for (let c = blockStack.length; c > o; c--) closeBlock();
    throw d;
  } finally {
    a && a._c && (a._d = !0);
  }
  return (l.scopeId && (l.slotScopeIds = [l.scopeId + '-s']), l);
}
function ensureValidVNode(e) {
  return e.some((t) =>
    isVNode(t)
      ? !(
          t.type === Comment ||
          (t.type === Fragment && !ensureValidVNode(t.children))
        )
      : !0,
  )
    ? e
    : null;
}
const getPublicInstance = (e) =>
    e
      ? isStatefulComponent(e)
        ? getComponentPublicInstance(e)
        : getPublicInstance(e.parent)
      : null,
  publicPropertiesMap = extend(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => getPublicInstance(e.parent),
    $root: (e) => getPublicInstance(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => resolveMergedOptions(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        queueJob(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = nextTick.bind(e.proxy)),
    $watch: (e) => instanceWatch.bind(e),
  }),
  hasSetupBinding = (e, t) =>
    e !== EMPTY_OBJ && !e.__isScriptSetup && hasOwn(e, t),
  PublicInstanceProxyHandlers = {
    get({ _: e }, t) {
      if (t === '__v_skip') return !0;
      const {
        ctx: s,
        setupState: r,
        data: n,
        props: i,
        accessCache: a,
        type: o,
        appContext: l,
      } = e;
      if (t[0] !== '$') {
        const v = a[t];
        if (v !== void 0)
          switch (v) {
            case 1:
              return r[t];
            case 2:
              return n[t];
            case 4:
              return s[t];
            case 3:
              return i[t];
          }
        else {
          if (hasSetupBinding(r, t)) return ((a[t] = 1), r[t]);
          if (n !== EMPTY_OBJ && hasOwn(n, t)) return ((a[t] = 2), n[t]);
          if (hasOwn(i, t)) return ((a[t] = 3), i[t]);
          if (s !== EMPTY_OBJ && hasOwn(s, t)) return ((a[t] = 4), s[t]);
          shouldCacheAccess && (a[t] = 0);
        }
      }
      const d = publicPropertiesMap[t];
      let c, f;
      if (d) return (t === '$attrs' && track(e.attrs, 'get', ''), d(e));
      if ((c = o.__cssModules) && (c = c[t])) return c;
      if (s !== EMPTY_OBJ && hasOwn(s, t)) return ((a[t] = 4), s[t]);
      if (((f = l.config.globalProperties), hasOwn(f, t))) return f[t];
    },
    set({ _: e }, t, s) {
      const { data: r, setupState: n, ctx: i } = e;
      return hasSetupBinding(n, t)
        ? ((n[t] = s), !0)
        : r !== EMPTY_OBJ && hasOwn(r, t)
          ? ((r[t] = s), !0)
          : hasOwn(e.props, t) || (t[0] === '$' && t.slice(1) in e)
            ? !1
            : ((i[t] = s), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: s,
          ctx: r,
          appContext: n,
          props: i,
          type: a,
        },
      },
      o,
    ) {
      let l;
      return !!(
        s[o] ||
        (e !== EMPTY_OBJ && o[0] !== '$' && hasOwn(e, o)) ||
        hasSetupBinding(t, o) ||
        hasOwn(i, o) ||
        hasOwn(r, o) ||
        hasOwn(publicPropertiesMap, o) ||
        hasOwn(n.config.globalProperties, o) ||
        ((l = a.__cssModules) && l[o])
      );
    },
    defineProperty(e, t, s) {
      return (
        s.get != null
          ? (e._.accessCache[t] = 0)
          : hasOwn(s, 'value') && this.set(e, t, s.value, null),
        Reflect.defineProperty(e, t, s)
      );
    },
  };
function normalizePropsOrEmits(e) {
  return isArray(e) ? e.reduce((t, s) => ((t[s] = null), t), {}) : e;
}
let shouldCacheAccess = !0;
function applyOptions(e) {
  const t = resolveMergedOptions(e),
    s = e.proxy,
    r = e.ctx;
  ((shouldCacheAccess = !1),
    t.beforeCreate && callHook(t.beforeCreate, e, 'bc'));
  const {
    data: n,
    computed: i,
    methods: a,
    watch: o,
    provide: l,
    inject: d,
    created: c,
    beforeMount: f,
    mounted: v,
    beforeUpdate: M,
    updated: P,
    activated: B,
    deactivated: $,
    beforeDestroy: I,
    beforeUnmount: O,
    destroyed: j,
    unmounted: E,
    render: F,
    renderTracked: q,
    renderTriggered: z,
    errorCaptured: G,
    serverPrefetch: ee,
    expose: J,
    inheritAttrs: te,
    components: ne,
    directives: ie,
    filters: ce,
  } = t;
  if ((d && resolveInjections(d, r, null), a))
    for (const H in a) {
      const x = a[H];
      isFunction(x) && (r[H] = x.bind(s));
    }
  if (n) {
    const H = n.call(s, s);
    isObject(H) && (e.data = reactive(H));
  }
  if (((shouldCacheAccess = !0), i))
    for (const H in i) {
      const x = i[H],
        X = isFunction(x)
          ? x.bind(s, s)
          : isFunction(x.get)
            ? x.get.bind(s, s)
            : NOOP,
        se = !isFunction(x) && isFunction(x.set) ? x.set.bind(s) : NOOP,
        Q = computed({ get: X, set: se });
      Object.defineProperty(r, H, {
        enumerable: !0,
        configurable: !0,
        get: () => Q.value,
        set: (K) => (Q.value = K),
      });
    }
  if (o) for (const H in o) createWatcher(o[H], r, s, H);
  if (l) {
    const H = isFunction(l) ? l.call(s) : l;
    Reflect.ownKeys(H).forEach((x) => {
      provide(x, H[x]);
    });
  }
  c && callHook(c, e, 'c');
  function L(H, x) {
    isArray(x) ? x.forEach((X) => H(X.bind(s))) : x && H(x.bind(s));
  }
  if (
    (L(onBeforeMount, f),
    L(onMounted, v),
    L(onBeforeUpdate, M),
    L(onUpdated, P),
    L(onActivated, B),
    L(onDeactivated, $),
    L(onErrorCaptured, G),
    L(onRenderTracked, q),
    L(onRenderTriggered, z),
    L(onBeforeUnmount, O),
    L(onUnmounted, E),
    L(onServerPrefetch, ee),
    isArray(J))
  )
    if (J.length) {
      const H = e.exposed || (e.exposed = {});
      J.forEach((x) => {
        Object.defineProperty(H, x, {
          get: () => s[x],
          set: (X) => (s[x] = X),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  (F && e.render === NOOP && (e.render = F),
    te != null && (e.inheritAttrs = te),
    ne && (e.components = ne),
    ie && (e.directives = ie),
    ee && markAsyncBoundary(e));
}
function resolveInjections(e, t, s = NOOP) {
  isArray(e) && (e = normalizeInject(e));
  for (const r in e) {
    const n = e[r];
    let i;
    (isObject(n)
      ? 'default' in n
        ? (i = inject(n.from || r, n.default, !0))
        : (i = inject(n.from || r))
      : (i = inject(n)),
      isRef(i)
        ? Object.defineProperty(t, r, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: (a) => (i.value = a),
          })
        : (t[r] = i));
  }
}
function callHook(e, t, s) {
  callWithAsyncErrorHandling(
    isArray(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy),
    t,
    s,
  );
}
function createWatcher(e, t, s, r) {
  let n = r.includes('.') ? createPathGetter(s, r) : () => s[r];
  if (isString(e)) {
    const i = t[e];
    isFunction(i) && watch(n, i);
  } else if (isFunction(e)) watch(n, e.bind(s));
  else if (isObject(e))
    if (isArray(e)) e.forEach((i) => createWatcher(i, t, s, r));
    else {
      const i = isFunction(e.handler) ? e.handler.bind(s) : t[e.handler];
      isFunction(i) && watch(n, i, e);
    }
}
function resolveMergedOptions(e) {
  const t = e.type,
    { mixins: s, extends: r } = t,
    {
      mixins: n,
      optionsCache: i,
      config: { optionMergeStrategies: a },
    } = e.appContext,
    o = i.get(t);
  let l;
  return (
    o
      ? (l = o)
      : !n.length && !s && !r
        ? (l = t)
        : ((l = {}),
          n.length && n.forEach((d) => mergeOptions(l, d, a, !0)),
          mergeOptions(l, t, a)),
    isObject(t) && i.set(t, l),
    l
  );
}
function mergeOptions(e, t, s, r = !1) {
  const { mixins: n, extends: i } = t;
  (i && mergeOptions(e, i, s, !0),
    n && n.forEach((a) => mergeOptions(e, a, s, !0)));
  for (const a in t)
    if (!(r && a === 'expose')) {
      const o = internalOptionMergeStrats[a] || (s && s[a]);
      e[a] = o ? o(e[a], t[a]) : t[a];
    }
  return e;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject,
};
function mergeDataFn(e, t) {
  return t
    ? e
      ? function () {
          return extend(
            isFunction(e) ? e.call(this, this) : e,
            isFunction(t) ? t.call(this, this) : t,
          );
        }
      : t
    : e;
}
function mergeInject(e, t) {
  return mergeObjectOptions(normalizeInject(e), normalizeInject(t));
}
function normalizeInject(e) {
  if (isArray(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++) t[e[s]] = e[s];
    return t;
  }
  return e;
}
function mergeAsArray(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function mergeObjectOptions(e, t) {
  return e ? extend(Object.create(null), e, t) : t;
}
function mergeEmitsOrPropsOptions(e, t) {
  return e
    ? isArray(e) && isArray(t)
      ? [...new Set([...e, ...t])]
      : extend(
          Object.create(null),
          normalizePropsOrEmits(e),
          normalizePropsOrEmits(t ?? {}),
        )
    : t;
}
function mergeWatchOptions(e, t) {
  if (!e) return t;
  if (!t) return e;
  const s = extend(Object.create(null), e);
  for (const r in t) s[r] = mergeAsArray(e[r], t[r]);
  return s;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let uid$1 = 0;
function createAppAPI(e, t) {
  return function (r, n = null) {
    (isFunction(r) || (r = extend({}, r)),
      n != null && !isObject(n) && (n = null));
    const i = createAppContext(),
      a = new WeakSet(),
      o = [];
    let l = !1;
    const d = (i.app = {
      _uid: uid$1++,
      _component: r,
      _props: n,
      _container: null,
      _context: i,
      _instance: null,
      version,
      get config() {
        return i.config;
      },
      set config(c) {},
      use(c, ...f) {
        return (
          a.has(c) ||
            (c && isFunction(c.install)
              ? (a.add(c), c.install(d, ...f))
              : isFunction(c) && (a.add(c), c(d, ...f))),
          d
        );
      },
      mixin(c) {
        return (i.mixins.includes(c) || i.mixins.push(c), d);
      },
      component(c, f) {
        return f ? ((i.components[c] = f), d) : i.components[c];
      },
      directive(c, f) {
        return f ? ((i.directives[c] = f), d) : i.directives[c];
      },
      mount(c, f, v) {
        if (!l) {
          const M = d._ceVNode || createVNode(r, n);
          return (
            (M.appContext = i),
            v === !0 ? (v = 'svg') : v === !1 && (v = void 0),
            e(M, c, v),
            (l = !0),
            (d._container = c),
            (c.__vue_app__ = d),
            getComponentPublicInstance(M.component)
          );
        }
      },
      onUnmount(c) {
        o.push(c);
      },
      unmount() {
        l &&
          (callWithAsyncErrorHandling(o, d._instance, 16),
          e(null, d._container),
          delete d._container.__vue_app__);
      },
      provide(c, f) {
        return ((i.provides[c] = f), d);
      },
      runWithContext(c) {
        const f = currentApp;
        currentApp = d;
        try {
          return c();
        } finally {
          currentApp = f;
        }
      },
    });
    return d;
  };
}
let currentApp = null;
const getModelModifiers = (e, t) =>
  t === 'modelValue' || t === 'model-value'
    ? e.modelModifiers
    : e[`${t}Modifiers`] ||
      e[`${camelize(t)}Modifiers`] ||
      e[`${hyphenate(t)}Modifiers`];
function emit(e, t, ...s) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || EMPTY_OBJ;
  let n = s;
  const i = t.startsWith('update:'),
    a = i && getModelModifiers(r, t.slice(7));
  a &&
    (a.trim && (n = s.map((c) => (isString(c) ? c.trim() : c))),
    a.number && (n = n.map(looseToNumber)));
  let o,
    l = r[(o = toHandlerKey(t))] || r[(o = toHandlerKey(camelize(t)))];
  (!l && i && (l = r[(o = toHandlerKey(hyphenate(t)))]),
    l && callWithAsyncErrorHandling(l, e, 6, n));
  const d = r[o + 'Once'];
  if (d) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[o]) return;
    ((e.emitted[o] = !0), callWithAsyncErrorHandling(d, e, 6, n));
  }
}
const mixinEmitsCache = new WeakMap();
function normalizeEmitsOptions(e, t, s = !1) {
  const r = s ? mixinEmitsCache : t.emitsCache,
    n = r.get(e);
  if (n !== void 0) return n;
  const i = e.emits;
  let a = {},
    o = !1;
  if (!isFunction(e)) {
    const l = (d) => {
      const c = normalizeEmitsOptions(d, t, !0);
      c && ((o = !0), extend(a, c));
    };
    (!s && t.mixins.length && t.mixins.forEach(l),
      e.extends && l(e.extends),
      e.mixins && e.mixins.forEach(l));
  }
  return !i && !o
    ? (isObject(e) && r.set(e, null), null)
    : (isArray(i) ? i.forEach((l) => (a[l] = null)) : extend(a, i),
      isObject(e) && r.set(e, a),
      a);
}
function isEmitListener(e, t) {
  return !e || !isOn(t)
    ? !1
    : ((t = t.slice(2)),
      (t = t === 'Once' ? t : t.replace(/Once$/, '')),
      hasOwn(e, t[0].toLowerCase() + t.slice(1)) ||
        hasOwn(e, hyphenate(t)) ||
        hasOwn(e, t));
}
function markAttrsAccessed() {}
function renderComponentRoot(e) {
  const {
      type: t,
      vnode: s,
      proxy: r,
      withProxy: n,
      propsOptions: [i],
      slots: a,
      attrs: o,
      emit: l,
      render: d,
      renderCache: c,
      props: f,
      data: v,
      setupState: M,
      ctx: P,
      inheritAttrs: B,
    } = e,
    $ = setCurrentRenderingInstance(e);
  let I, O;
  try {
    if (s.shapeFlag & 4) {
      const E = n || r,
        F = E;
      ((I = normalizeVNode(d.call(F, E, c, f, M, v, P))), (O = o));
    } else {
      const E = t;
      ((I = normalizeVNode(
        E.length > 1 ? E(f, { attrs: o, slots: a, emit: l }) : E(f, null),
      )),
        (O = t.props ? o : getFunctionalFallthrough(o)));
    }
  } catch (E) {
    ((blockStack.length = 0), handleError(E, e, 1), (I = createVNode(Comment)));
  }
  let j = I;
  if (O && B !== !1) {
    const E = Object.keys(O),
      { shapeFlag: F } = j;
    E.length &&
      F & 7 &&
      (i && E.some(isModelListener) && (O = filterModelListeners(O, i)),
      (j = cloneVNode(j, O, !1, !0)));
  }
  if (
    (s.dirs &&
      ((j = cloneVNode(j, null, !1, !0)),
      (j.dirs = j.dirs ? j.dirs.concat(s.dirs) : s.dirs)),
    s.transition)
  ) {
    const E = (isTeleport(j.type) && getInnerChild$1(j)) || j;
    setTransitionHooks(E, s.transition);
  }
  return ((I = j), setCurrentRenderingInstance($), I);
}
function filterSingleRoot(e, t = !0) {
  let s;
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    if (isVNode(n)) {
      if (n.type !== Comment || n.children === 'v-if') {
        if (s) return;
        s = n;
      }
    } else return;
  }
  return s;
}
const getFunctionalFallthrough = (e) => {
    let t;
    for (const s in e)
      (s === 'class' || s === 'style' || isOn(s)) &&
        ((t || (t = {}))[s] = e[s]);
    return t;
  },
  filterModelListeners = (e, t) => {
    const s = {};
    for (const r in e)
      (!isModelListener(r) || !(r.slice(9) in t)) && (s[r] = e[r]);
    return s;
  };
function shouldUpdateComponent(e, t, s) {
  const { props: r, children: n, component: i } = e,
    { props: a, children: o, patchFlag: l } = t,
    d = i.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (s && l >= 0) {
    if (l & 1024) return !0;
    if (l & 16) return r ? hasPropsChanged(r, a, d) : !!a;
    if (l & 8) {
      const c = t.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        const v = c[f];
        if (hasPropValueChanged(a, r, v) && !isEmitListener(d, v)) return !0;
      }
    }
  } else
    return (n || o) && (!o || !o.$stable)
      ? !0
      : r === a
        ? !1
        : r
          ? a
            ? hasPropsChanged(r, a, d)
            : !0
          : !!a;
  return !1;
}
function hasPropsChanged(e, t, s) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length) return !0;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (
      !hasOwn(e, i) ||
      (hasPropValueChanged(t, e, i) && !isEmitListener(s, i))
    )
      return !0;
  }
  return !1;
}
function hasPropValueChanged(e, t, s) {
  const r = e[s],
    n = t[s];
  return s === 'style' && isObject(r) && isObject(n)
    ? !looseEqual(r, n)
    : r !== n;
}
function updateHOCHostEl({ vnode: e, parent: t, suspense: s }, r) {
  for (; t; ) {
    const n = t.subTree;
    if (
      (n.suspense &&
        n.suspense.activeBranch === e &&
        ((n.suspense.vnode.el = n.el = r), (e = n)),
      n === e)
    )
      (((e = t.vnode).el = r), (t = t.parent));
    else break;
  }
  s && s.activeBranch === e && (s.vnode.el = r);
}
const internalObjectProto = {},
  createInternalObject = () => Object.create(internalObjectProto),
  isInternalObject = (e) => Object.getPrototypeOf(e) === internalObjectProto;
function initProps(e, t, s, r = !1) {
  const n = {},
    i = createInternalObject();
  ((e.propsDefaults = Object.create(null)), setFullProps(e, t, n, i));
  for (const a in e.propsOptions[0]) a in n || (n[a] = void 0);
  (s
    ? (e.props = r ? n : shallowReactive(n))
    : e.type.props
      ? (e.props = n)
      : (e.props = i),
    (e.attrs = i));
}
function updateProps(e, t, s, r) {
  const {
      props: n,
      attrs: i,
      vnode: { patchFlag: a },
    } = e,
    o = toRaw(n),
    [l] = e.propsOptions;
  let d = !1;
  if ((r || a > 0) && !(a & 16)) {
    if (a & 8) {
      const c = e.vnode.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        let v = c[f];
        if (isEmitListener(e.emitsOptions, v)) continue;
        const M = t[v];
        if (l)
          if (hasOwn(i, v)) M !== i[v] && ((i[v] = M), (d = !0));
          else {
            const P = camelize(v);
            n[P] = resolvePropValue(l, o, P, M, e, !1);
          }
        else M !== i[v] && ((i[v] = M), (d = !0));
      }
    }
  } else {
    setFullProps(e, t, n, i) && (d = !0);
    let c;
    for (const f in o)
      (!t || (!hasOwn(t, f) && ((c = hyphenate(f)) === f || !hasOwn(t, c)))) &&
        (l
          ? s &&
            (s[f] !== void 0 || s[c] !== void 0) &&
            (n[f] = resolvePropValue(l, o, f, void 0, e, !0))
          : delete n[f]);
    if (i !== o)
      for (const f in i) (!t || !hasOwn(t, f)) && (delete i[f], (d = !0));
  }
  d && trigger(e.attrs, 'set', '');
}
function setFullProps(e, t, s, r) {
  const [n, i] = e.propsOptions;
  let a = !1,
    o;
  if (t)
    for (let l in t) {
      if (isReservedProp(l)) continue;
      const d = t[l];
      let c;
      n && hasOwn(n, (c = camelize(l)))
        ? !i || !i.includes(c)
          ? (s[c] = d)
          : ((o || (o = {}))[c] = d)
        : isEmitListener(e.emitsOptions, l) ||
          ((!(l in r) || d !== r[l]) && ((r[l] = d), (a = !0)));
    }
  if (i) {
    const l = toRaw(s),
      d = o || EMPTY_OBJ;
    for (let c = 0; c < i.length; c++) {
      const f = i[c];
      s[f] = resolvePropValue(n, l, f, d[f], e, !hasOwn(d, f));
    }
  }
  return a;
}
function resolvePropValue(e, t, s, r, n, i) {
  const a = e[s];
  if (a != null) {
    const o = hasOwn(a, 'default');
    if (o && r === void 0) {
      const l = a.default;
      if (a.type !== Function && !a.skipFactory && isFunction(l)) {
        const { propsDefaults: d } = n;
        if (s in d) r = d[s];
        else {
          const c = setCurrentInstance(n);
          ((r = d[s] = l.call(null, t)), c());
        }
      } else r = l;
      n.ce && n.ce._setProp(s, r);
    }
    a[0] &&
      (i && !o
        ? (r = !1)
        : a[1] && (r === '' || r === hyphenate(s)) && (r = !0));
  }
  return r;
}
const mixinPropsCache = new WeakMap();
function normalizePropsOptions(e, t, s = !1) {
  const r = s ? mixinPropsCache : t.propsCache,
    n = r.get(e);
  if (n) return n;
  const i = e.props,
    a = {},
    o = [];
  let l = !1;
  if (!isFunction(e)) {
    const c = (f) => {
      l = !0;
      const [v, M] = normalizePropsOptions(f, t, !0);
      (extend(a, v), M && o.push(...M));
    };
    (!s && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c));
  }
  if (!i && !l) return (isObject(e) && r.set(e, EMPTY_ARR), EMPTY_ARR);
  if (isArray(i))
    for (let c = 0; c < i.length; c++) {
      const f = camelize(i[c]);
      validatePropName(f) && (a[f] = EMPTY_OBJ);
    }
  else if (i)
    for (const c in i) {
      const f = camelize(c);
      if (validatePropName(f)) {
        const v = i[c],
          M = (a[f] =
            isArray(v) || isFunction(v) ? { type: v } : extend({}, v)),
          P = M.type;
        let B = !1,
          $ = !0;
        if (isArray(P))
          for (let I = 0; I < P.length; ++I) {
            const O = P[I],
              j = isFunction(O) && O.name;
            if (j === 'Boolean') {
              B = !0;
              break;
            } else j === 'String' && ($ = !1);
          }
        else B = isFunction(P) && P.name === 'Boolean';
        ((M[0] = B), (M[1] = $), (B || hasOwn(M, 'default')) && o.push(f));
      }
    }
  const d = [a, o];
  return (isObject(e) && r.set(e, d), d);
}
function validatePropName(e) {
  return e[0] !== '$' && !isReservedProp(e);
}
const isInternalKey = (e) => e === '_' || e === '_ctx' || e === '$stable',
  normalizeSlotValue = (e) =>
    isArray(e) ? e.map(normalizeVNode) : [normalizeVNode(e)],
  normalizeSlot = (e, t, s) => {
    if (t._n) return t;
    const r = withCtx((...n) => normalizeSlotValue(t(...n)), s);
    return ((r._c = !1), r);
  },
  normalizeObjectSlots = (e, t, s) => {
    const r = e._ctx;
    for (const n in e) {
      if (isInternalKey(n)) continue;
      const i = e[n];
      if (isFunction(i)) t[n] = normalizeSlot(n, i, r);
      else if (i != null) {
        const a = normalizeSlotValue(i);
        t[n] = () => a;
      }
    }
  },
  normalizeVNodeSlots = (e, t) => {
    const s = normalizeSlotValue(t);
    e.slots.default = () => s;
  },
  assignSlots = (e, t, s) => {
    for (const r in t) (s || !isInternalKey(r)) && (e[r] = t[r]);
  },
  initSlots = (e, t, s) => {
    const r = (e.slots = createInternalObject());
    if (e.vnode.shapeFlag & 32) {
      const n = t._;
      n
        ? (assignSlots(r, t, s), s && def(r, '_', n, !0))
        : normalizeObjectSlots(t, r);
    } else t && normalizeVNodeSlots(e, t);
  },
  updateSlots = (e, t, s) => {
    const { vnode: r, slots: n } = e;
    let i = !0,
      a = EMPTY_OBJ;
    if (r.shapeFlag & 32) {
      const o = t._;
      (o
        ? s && o === 1
          ? (i = !1)
          : assignSlots(n, t, s)
        : ((i = !t.$stable), normalizeObjectSlots(t, n)),
        (a = t));
    } else t && (normalizeVNodeSlots(e, t), (a = { default: 1 }));
    if (i) for (const o in n) !isInternalKey(o) && a[o] == null && delete n[o];
  },
  queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(e) {
  return baseCreateRenderer(e);
}
function baseCreateRenderer(e, t) {
  const s = getGlobalThis();
  s.__VUE__ = !0;
  const {
      insert: r,
      remove: n,
      patchProp: i,
      createElement: a,
      createText: o,
      createComment: l,
      setText: d,
      setElementText: c,
      parentNode: f,
      nextSibling: v,
      setScopeId: M = NOOP,
      insertStaticContent: P,
    } = e,
    B = (
      u,
      m,
      y,
      S = null,
      D = null,
      k = null,
      V = void 0,
      w = null,
      _ = !!m.dynamicChildren,
    ) => {
      if (u === m) return;
      (u && !isSameVNodeType(u, m) && ((S = T(u)), K(u, D, k, !0), (u = null)),
        m.patchFlag === -2 && ((_ = !1), (m.dynamicChildren = null)),
        m.dynamicChildren &&
          u &&
          u.dynamicChildren &&
          u.dynamicChildren.hasOnce &&
          (m.dynamicChildren === EMPTY_ARR && (m.dynamicChildren = []),
          (m.dynamicChildren.hasOnce = !0)));
      const { type: b, ref: A, shapeFlag: N } = m;
      switch (b) {
        case Text:
          $(u, m, y, S);
          break;
        case Comment:
          I(u, m, y, S);
          break;
        case Static:
          u == null && O(m, y, S, V);
          break;
        case Fragment:
          ne(u, m, y, S, D, k, V, w, _);
          break;
        default:
          N & 1
            ? F(u, m, y, S, D, k, V, w, _)
            : N & 6
              ? ie(u, m, y, S, D, k, V, w, _)
              : (N & 64 || N & 128) && b.process(u, m, y, S, D, k, V, w, _, pe);
      }
      A != null && D
        ? setRef(A, u && u.ref, k, m || u, !m)
        : A == null && u && u.ref != null && setRef(u.ref, null, k, u, !0);
    },
    $ = (u, m, y, S) => {
      if (u == null) r((m.el = o(m.children)), y, S);
      else {
        const D = (m.el = u.el);
        m.children !== u.children && d(D, m.children);
      }
    },
    I = (u, m, y, S) => {
      u == null ? r((m.el = l(m.children || '')), y, S) : (m.el = u.el);
    },
    O = (u, m, y, S) => {
      [u.el, u.anchor] = P(u.children, m, y, S, u.el, u.anchor);
    },
    j = ({ el: u, anchor: m }, y, S) => {
      let D;
      for (; u && u !== m; ) ((D = v(u)), r(u, y, S), (u = D));
      r(m, y, S);
    },
    E = ({ el: u, anchor: m }) => {
      let y;
      for (; u && u !== m; ) ((y = v(u)), n(u), (u = y));
      n(m);
    },
    F = (u, m, y, S, D, k, V, w, _) => {
      if (
        (m.type === 'svg' ? (V = 'svg') : m.type === 'math' && (V = 'mathml'),
        u == null)
      )
        q(m, y, S, D, k, V, w, _);
      else {
        const b = u.el && u.el._isVueCE ? u.el : null;
        try {
          (b && b._beginPatch(), ee(u, m, D, k, V, w, _));
        } finally {
          b && b._endPatch();
        }
      }
    },
    q = (u, m, y, S, D, k, V, w) => {
      let _, b;
      const { props: A, shapeFlag: N, transition: C, dirs: h } = u;
      if (
        ((_ = u.el = a(u.type, k, A && A.is, A)),
        N & 8
          ? c(_, u.children)
          : N & 16 &&
            G(u.children, _, null, S, D, resolveChildrenNamespace(u, k), V, w),
        h && invokeDirectiveHook(u, null, S, 'created'),
        z(_, u, u.scopeId, V, S),
        A)
      ) {
        for (const R in A)
          R !== 'value' && !isReservedProp(R) && i(_, R, null, A[R], k, S);
        ('value' in A && i(_, 'value', null, A.value, k),
          (b = A.onVnodeBeforeMount) && invokeVNodeHook(b, S, u));
      }
      h && invokeDirectiveHook(u, null, S, 'beforeMount');
      const g = needTransition(D, C);
      (g && C.beforeEnter(_),
        r(_, m, y),
        ((b = A && A.onVnodeMounted) || g || h) &&
          queuePostRenderEffect(() => {
            (b && invokeVNodeHook(b, S, u),
              g && C.enter(_),
              h && invokeDirectiveHook(u, null, S, 'mounted'));
          }, D));
    },
    z = (u, m, y, S, D) => {
      if ((y && M(u, y), S)) for (let k = 0; k < S.length; k++) M(u, S[k]);
      if (D) {
        let k = D.subTree;
        if (
          m === k ||
          (isSuspense(k.type) && (k.ssContent === m || k.ssFallback === m))
        ) {
          const V = D.vnode;
          z(u, V, V.scopeId, V.slotScopeIds, D.parent);
        }
      }
    },
    G = (u, m, y, S, D, k, V, w, _ = 0) => {
      for (let b = _; b < u.length; b++) {
        const A = (u[b] = w ? cloneIfMounted(u[b]) : normalizeVNode(u[b]));
        B(null, A, m, y, S, D, k, V, w);
      }
    },
    ee = (u, m, y, S, D, k, V) => {
      const w = (m.el = u.el);
      let { patchFlag: _, dynamicChildren: b, dirs: A } = m;
      _ |= u.patchFlag & 16;
      const N = u.props || EMPTY_OBJ,
        C = m.props || EMPTY_OBJ;
      let h;
      if (
        (y && toggleRecurse(y, !1),
        (h = C.onVnodeBeforeUpdate) && invokeVNodeHook(h, y, m, u),
        A && invokeDirectiveHook(m, u, y, 'beforeUpdate'),
        y && toggleRecurse(y, !0),
        b &&
          (!u.dynamicChildren || u.dynamicChildren.length !== b.length) &&
          ((_ = 0), (V = !1), (b = null)),
        ((N.innerHTML && C.innerHTML == null) ||
          (N.textContent && C.textContent == null)) &&
          c(w, ''),
        b
          ? J(u.dynamicChildren, b, w, y, S, resolveChildrenNamespace(m, D), k)
          : V || x(u, m, w, null, y, S, resolveChildrenNamespace(m, D), k, !1),
        _ > 0)
      ) {
        if (_ & 16) te(w, N, C, y, D);
        else if (
          (_ & 2 && N.class !== C.class && i(w, 'class', null, C.class, D),
          _ & 4 && i(w, 'style', N.style, C.style, D),
          _ & 8)
        ) {
          const g = m.dynamicProps;
          for (let R = 0; R < g.length; R++) {
            const Y = g[R],
              W = N[Y],
              U = C[Y];
            (U !== W || Y === 'value') && i(w, Y, W, U, D, y);
          }
        }
        _ & 1 && u.children !== m.children && c(w, m.children);
      } else !V && b == null && te(w, N, C, y, D);
      ((h = C.onVnodeUpdated) || A) &&
        queuePostRenderEffect(() => {
          (h && invokeVNodeHook(h, y, m, u),
            A && invokeDirectiveHook(m, u, y, 'updated'));
        }, S);
    },
    J = (u, m, y, S, D, k, V) => {
      for (let w = 0; w < m.length; w++) {
        const _ = u[w],
          b = m[w],
          A = _.el || resolveAsyncComponentPlaceholder(_),
          N =
            A &&
            (_.type === Fragment || !isSameVNodeType(_, b) || _.shapeFlag & 198)
              ? f(A)
              : y;
        B(_, b, N, null, S, D, k, V, !0);
      }
    },
    te = (u, m, y, S, D) => {
      if (m !== y) {
        if (m !== EMPTY_OBJ)
          for (const k in m)
            !isReservedProp(k) && !(k in y) && i(u, k, m[k], null, D, S);
        for (const k in y) {
          if (isReservedProp(k)) continue;
          const V = y[k],
            w = m[k];
          V !== w && k !== 'value' && i(u, k, w, V, D, S);
        }
        'value' in y && i(u, 'value', m.value, y.value, D);
      }
    },
    ne = (u, m, y, S, D, k, V, w, _) => {
      const b = (m.el = u ? u.el : o('')),
        A = (m.anchor = u ? u.anchor : o(''));
      let { patchFlag: N, dynamicChildren: C, slotScopeIds: h } = m;
      (h && (w = w ? w.concat(h) : h),
        u == null
          ? (r(b, y, S), r(A, y, S), G(m.children || [], y, A, D, k, V, w, _))
          : N > 0 &&
              N & 64 &&
              C &&
              u.dynamicChildren &&
              u.dynamicChildren.length === C.length
            ? (J(u.dynamicChildren, C, y, D, k, V, w),
              (m.key != null || (D && m === D.subTree)) &&
                traverseStaticChildren(u, m, !0))
            : x(u, m, y, A, D, k, V, w, _));
    },
    ie = (u, m, y, S, D, k, V, w, _) => {
      ((m.slotScopeIds = w),
        u == null
          ? m.shapeFlag & 512
            ? D.ctx.activate(m, y, S, V, _)
            : ce(m, y, S, D, k, V, _)
          : ue(u, m, _));
    },
    ce = (u, m, y, S, D, k, V) => {
      const w = (u.component = createComponentInstance(u, S, D));
      if (
        (isKeepAlive(u) && (w.ctx.renderer = pe),
        setupComponent(w, !1, V),
        w.asyncDep)
      ) {
        if ((D && D.registerDep(w, L, V, k), !u.el)) {
          const _ = (w.subTree = createVNode(Comment));
          (I(null, _, m, y), (u.placeholder = _.el));
        }
      } else L(w, u, m, y, D, k, V);
    },
    ue = (u, m, y) => {
      const S = (m.component = u.component);
      if (shouldUpdateComponent(u, m, y))
        if (S.asyncDep && !S.asyncResolved) {
          ((m.el = u.el), (m.placeholder = u.placeholder), H(S, m, y));
          return;
        } else ((S.next = m), S.update());
      else ((m.el = u.el), (m.placeholder = u.placeholder), (S.vnode = m));
    },
    L = (u, m, y, S, D, k, V) => {
      const w = () => {
        if (u.isMounted) {
          let { next: N, bu: C, u: h, parent: g, vnode: R } = u;
          {
            const oe = locateNonHydratedAsyncRoot(u);
            if (oe) {
              (N && ((N.el = R.el), H(u, N, V)),
                oe.asyncDep.then(() => {
                  queuePostRenderEffect(() => {
                    u.isUnmounted || b();
                  }, D);
                }));
              return;
            }
          }
          let Y = N,
            W;
          (toggleRecurse(u, !1),
            N ? ((N.el = R.el), H(u, N, V)) : (N = R),
            C && invokeArrayFns(C),
            (W = N.props && N.props.onVnodeBeforeUpdate) &&
              invokeVNodeHook(W, g, N, R),
            toggleRecurse(u, !0));
          const U = renderComponentRoot(u),
            ae = u.subTree;
          ((u.subTree = U),
            B(ae, U, f(ae.el), T(ae), u, D, k),
            (N.el = U.el),
            Y === null && updateHOCHostEl(u, U.el),
            h && queuePostRenderEffect(h, D),
            (W = N.props && N.props.onVnodeUpdated) &&
              queuePostRenderEffect(() => invokeVNodeHook(W, g, N, R), D));
        } else {
          let N;
          const { el: C, props: h } = m,
            { bm: g, m: R, parent: Y, root: W, type: U } = u,
            ae = isAsyncWrapper(m);
          (toggleRecurse(u, !1),
            g && invokeArrayFns(g),
            !ae && (N = h && h.onVnodeBeforeMount) && invokeVNodeHook(N, Y, m),
            toggleRecurse(u, !0));
          {
            W.ce &&
              W.ce._hasShadowRoot() &&
              W.ce._injectChildStyle(U, u.parent ? u.parent.type : void 0);
            const oe = (u.subTree = renderComponentRoot(u));
            (B(null, oe, y, S, u, D, k), (m.el = oe.el));
          }
          if (
            (R && queuePostRenderEffect(R, D),
            !ae && (N = h && h.onVnodeMounted))
          ) {
            const oe = m;
            queuePostRenderEffect(() => invokeVNodeHook(N, Y, oe), D);
          }
          ((m.shapeFlag & 256 ||
            (Y && isAsyncWrapper(Y.vnode) && Y.vnode.shapeFlag & 256)) &&
            u.a &&
            queuePostRenderEffect(u.a, D),
            (u.isMounted = !0),
            (m = y = S = null));
        }
      };
      u.scope.on();
      const _ = (u.effect = new ReactiveEffect(w));
      u.scope.off();
      const b = (u.update = _.run.bind(_)),
        A = (u.job = _.runIfDirty.bind(_));
      ((A.i = u),
        (A.id = u.uid),
        (_.scheduler = () => queueJob(A)),
        toggleRecurse(u, !0),
        b());
    },
    H = (u, m, y) => {
      m.component = u;
      const S = u.vnode.props;
      ((u.vnode = m),
        (u.next = null),
        updateProps(u, m.props, S, y),
        updateSlots(u, m.children, y),
        pauseTracking(),
        flushPreFlushCbs(u),
        resetTracking());
    },
    x = (u, m, y, S, D, k, V, w, _ = !1) => {
      const b = u && u.children,
        A = u ? u.shapeFlag : 0,
        N = m.children,
        { patchFlag: C, shapeFlag: h } = m;
      if (C > 0) {
        if (C & 128) {
          se(b, N, y, S, D, k, V, w, _);
          return;
        } else if (C & 256) {
          X(b, N, y, S, D, k, V, w, _);
          return;
        }
      }
      h & 8
        ? (A & 16 && re(b, D, k), N !== b && c(y, N))
        : A & 16
          ? h & 16
            ? se(b, N, y, S, D, k, V, w, _)
            : re(b, D, k, !0)
          : (A & 8 && c(y, ''), h & 16 && G(N, y, S, D, k, V, w, _));
    },
    X = (u, m, y, S, D, k, V, w, _) => {
      ((u = u || EMPTY_ARR), (m = m || EMPTY_ARR));
      const b = u.length,
        A = m.length,
        N = Math.min(b, A);
      let C;
      for (C = 0; C < N; C++) {
        const h = (m[C] = _ ? cloneIfMounted(m[C]) : normalizeVNode(m[C]));
        B(u[C], h, y, null, D, k, V, w, _);
      }
      b > A ? re(u, D, k, !0, !1, N) : G(m, y, S, D, k, V, w, _, N);
    },
    se = (u, m, y, S, D, k, V, w, _) => {
      let b = 0;
      const A = m.length;
      let N = u.length - 1,
        C = A - 1;
      for (; b <= N && b <= C; ) {
        const h = u[b],
          g = (m[b] = _ ? cloneIfMounted(m[b]) : normalizeVNode(m[b]));
        if (isSameVNodeType(h, g)) B(h, g, y, null, D, k, V, w, _);
        else break;
        b++;
      }
      for (; b <= N && b <= C; ) {
        const h = u[N],
          g = (m[C] = _ ? cloneIfMounted(m[C]) : normalizeVNode(m[C]));
        if (isSameVNodeType(h, g)) B(h, g, y, null, D, k, V, w, _);
        else break;
        (N--, C--);
      }
      if (b > N) {
        if (b <= C) {
          const h = C + 1,
            g = h < A ? m[h].el : S;
          for (; b <= C; )
            (B(
              null,
              (m[b] = _ ? cloneIfMounted(m[b]) : normalizeVNode(m[b])),
              y,
              g,
              D,
              k,
              V,
              w,
              _,
            ),
              b++);
        }
      } else if (b > C) for (; b <= N; ) (K(u[b], D, k, !0), b++);
      else {
        const h = b,
          g = b,
          R = new Map();
        for (b = g; b <= C; b++) {
          const Z = (m[b] = _ ? cloneIfMounted(m[b]) : normalizeVNode(m[b]));
          Z.key != null && R.set(Z.key, b);
        }
        let Y,
          W = 0;
        const U = C - g + 1;
        let ae = !1,
          oe = 0;
        const me = new Array(U);
        for (b = 0; b < U; b++) me[b] = 0;
        for (b = h; b <= N; b++) {
          const Z = u[b];
          if (W >= U) {
            K(Z, D, k, !0);
            continue;
          }
          let le;
          if (Z.key != null) le = R.get(Z.key);
          else
            for (Y = g; Y <= C; Y++)
              if (me[Y - g] === 0 && isSameVNodeType(Z, m[Y])) {
                le = Y;
                break;
              }
          le === void 0
            ? K(Z, D, k, !0)
            : ((me[le - g] = b + 1),
              le >= oe ? (oe = le) : (ae = !0),
              B(Z, m[le], y, null, D, k, V, w, _),
              W++);
        }
        const ve = ae ? getSequence(me) : EMPTY_ARR;
        for (Y = ve.length - 1, b = U - 1; b >= 0; b--) {
          const Z = g + b,
            le = m[Z],
            be = m[Z + 1],
            De = Z + 1 < A ? be.el || resolveAsyncComponentPlaceholder(be) : S;
          me[b] === 0
            ? B(null, le, y, De, D, k, V, w, _)
            : ae && (Y < 0 || b !== ve[Y] ? Q(le, y, De, 2) : Y--);
        }
      }
    },
    Q = (u, m, y, S, D = null) => {
      const { el: k, type: V, transition: w, children: _, shapeFlag: b } = u;
      if (b & 6) {
        Q(u.component.subTree, m, y, S);
        return;
      }
      if (b & 128) {
        u.suspense.move(m, y, S);
        return;
      }
      if (b & 64) {
        V.move(u, m, y, pe);
        return;
      }
      if (V === Fragment) {
        r(k, m, y);
        for (let N = 0; N < _.length; N++) Q(_[N], m, y, S);
        r(u.anchor, m, y);
        return;
      }
      if (V === Static) {
        j(u, m, y);
        return;
      }
      if (S !== 2 && b & 1 && w)
        if (S === 0)
          w.persisted && !k[leaveCbKey]
            ? r(k, m, y)
            : (w.beforeEnter(k),
              r(k, m, y),
              queuePostRenderEffect(() => w.enter(k), D));
        else {
          const { leave: N, delayLeave: C, afterLeave: h } = w,
            g = () => {
              u.ctx.isUnmounted ? n(k) : r(k, m, y);
            },
            R = () => {
              const Y = k._isLeaving || !!k[leaveCbKey];
              (k._isLeaving && k[leaveCbKey](!0),
                w.persisted && !Y
                  ? g()
                  : N(k, () => {
                      (g(), h && h());
                    }));
            };
          C ? C(k, g, R) : R();
        }
      else r(k, m, y);
    },
    K = (u, m, y, S = !1, D = !1) => {
      const {
        type: k,
        props: V,
        ref: w,
        children: _,
        dynamicChildren: b,
        shapeFlag: A,
        patchFlag: N,
        dirs: C,
        cacheIndex: h,
        memo: g,
      } = u;
      if (
        ((N === -2 || (b && b.hasOnce)) && (D = !1),
        w != null &&
          (pauseTracking(), setRef(w, null, y, u, !0), resetTracking()),
        h != null && (!u.ctx || u.ctx === m) && (m.renderCache[h] = void 0),
        A & 256)
      ) {
        m.ctx.deactivate(u);
        return;
      }
      const R = A & 1 && C,
        Y = !isAsyncWrapper(u);
      let W;
      if (
        (Y && (W = V && V.onVnodeBeforeUnmount) && invokeVNodeHook(W, m, u),
        A & 6)
      )
        fe(u.component, y, S);
      else {
        if (A & 128) {
          u.suspense.unmount(y, S);
          return;
        }
        (R && invokeDirectiveHook(u, null, m, 'beforeUnmount'),
          A & 64
            ? u.type.remove(u, m, y, pe, S)
            : b && !b.hasOnce && (k !== Fragment || (N > 0 && N & 64))
              ? re(b, m, y, !1, !0)
              : ((k === Fragment && N & 384) || (!D && A & 16)) && re(_, m, y),
          S && de(u));
      }
      const U = g != null && h == null;
      ((Y && (W = V && V.onVnodeUnmounted)) || R || U) &&
        queuePostRenderEffect(() => {
          (W && invokeVNodeHook(W, m, u),
            R && invokeDirectiveHook(u, null, m, 'unmounted'),
            U && (u.el = null));
        }, y);
    },
    de = (u) => {
      const { type: m, el: y, anchor: S, transition: D } = u,
        k = m === Fragment;
      if (k && !D) {
        he(y, S);
        return;
      }
      if (m === Static) {
        (E(u), D && !D.persisted && D.afterLeave && D.afterLeave());
        return;
      }
      const V = k ? getTransitionRoot(u) : u,
        w = () => {
          (k ? f(y) && he(y, S) : n(y),
            D && !D.persisted && D.afterLeave && D.afterLeave());
        };
      if (V && V.shapeFlag & 1 && D && !D.persisted) {
        const { leave: _, delayLeave: b } = D,
          A = V.el,
          N = () => _(A, w);
        b ? b(A, w, N) : N();
      } else w();
    },
    he = (u, m) => {
      let y;
      for (; u !== m; ) ((y = v(u)), n(u), (u = y));
      n(m);
    },
    fe = (u, m, y) => {
      const { bum: S, scope: D, job: k, subTree: V, um: w, m: _, a: b } = u;
      (invalidateMount(_),
        invalidateMount(b),
        S && invokeArrayFns(S),
        D.stop(),
        k
          ? ((k.flags |= 8), K(V, u, m, y))
          : u.vnode.el &&
            V &&
            ((V.transition = u.vnode.transition), K(V, u, m, y)),
        w && queuePostRenderEffect(w, m),
        queuePostRenderEffect(() => {
          u.isUnmounted = !0;
        }, m));
    },
    re = (u, m, y, S = !1, D = !1, k = 0) => {
      for (let V = k; V < u.length; V++) K(u[V], m, y, S, D);
    },
    T = (u) => {
      if (u.shapeFlag & 6) return T(u.component.subTree);
      if (u.shapeFlag & 128) return u.suspense.next();
      const m = v(u.anchor || u.el),
        y = m && m[TeleportEndKey];
      return y ? v(y) : m;
    },
    ge = (u, m, y) => {
      const S =
        u && m._vnode
          ? void 0
          : u && u.component
            ? u.component.uid
            : getNextUid();
      flushOnAppMount(() => {
        (u == null
          ? m._vnode && K(m._vnode, null, null, !0)
          : B(m._vnode || null, u, m, null, null, null, y),
          (m._vnode = u));
      }, S);
    },
    pe = { p: B, um: K, m: Q, r: de, mt: ce, mc: G, pc: x, pbc: J, n: T, o: e };
  return { render: ge, hydrate: void 0, createApp: createAppAPI(ge) };
}
function resolveChildrenNamespace({ type: e, props: t }, s) {
  return (s === 'svg' && e === 'foreignObject') ||
    (s === 'mathml' &&
      e === 'annotation-xml' &&
      t &&
      t.encoding &&
      t.encoding.includes('html'))
    ? void 0
    : s;
}
function toggleRecurse({ effect: e, job: t }, s) {
  s ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function needTransition(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function traverseStaticChildren(e, t, s = !1) {
  const r = e.children,
    n = t.children;
  if (isArray(r) && isArray(n))
    for (let i = 0; i < r.length; i++) {
      const a = r[i];
      let o = n[i];
      (o.shapeFlag & 1 &&
        !o.dynamicChildren &&
        ((o.patchFlag <= 0 || o.patchFlag === 32) &&
          ((o = n[i] = cloneIfMounted(n[i])), (o.el = a.el)),
        !s && o.patchFlag !== -2 && traverseStaticChildren(a, o)),
        o.type === Text &&
          (o.patchFlag === -1 && (o = n[i] = cloneIfMounted(o)), (o.el = a.el)),
        o.type === Comment && !o.el && (o.el = a.el));
    }
}
function getSequence(e) {
  const t = e.slice(),
    s = [0];
  let r, n, i, a, o;
  const l = e.length;
  for (r = 0; r < l; r++) {
    const d = e[r];
    if (d !== 0) {
      if (((n = s[s.length - 1]), e[n] < d)) {
        ((t[r] = n), s.push(r));
        continue;
      }
      for (i = 0, a = s.length - 1; i < a; )
        ((o = (i + a) >> 1), e[s[o]] < d ? (i = o + 1) : (a = o));
      d < e[s[i]] && (i > 0 && (t[r] = s[i - 1]), (s[i] = r));
    }
  }
  for (i = s.length, a = s[i - 1]; i-- > 0; ) ((s[i] = a), (a = t[a]));
  return s;
}
function locateNonHydratedAsyncRoot(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : locateNonHydratedAsyncRoot(t);
}
function invalidateMount(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function resolveAsyncComponentPlaceholder(e) {
  if (e.placeholder) return e.placeholder;
  const t = e.component;
  return t ? resolveAsyncComponentPlaceholder(t.subTree) : null;
}
const isSuspense = (e) => e.__isSuspense;
function queueEffectWithSuspense(e, t) {
  t && t.pendingBranch
    ? isArray(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : queuePostFlushCb(e);
}
const Fragment = Symbol.for('v-fgt'),
  Text = Symbol.for('v-txt'),
  Comment = Symbol.for('v-cmt'),
  Static = Symbol.for('v-stc'),
  blockStack = [];
let currentBlock = null;
function openBlock(e = !1) {
  blockStack.push((currentBlock = e ? null : []));
}
function closeBlock() {
  (blockStack.pop(),
    (currentBlock = blockStack[blockStack.length - 1] || null));
}
let isBlockTreeEnabled = 1;
function setBlockTracking(e, t = !1) {
  ((isBlockTreeEnabled += e),
    e < 0 && currentBlock && t && (currentBlock.hasOnce = !0));
}
function setupBlock(e) {
  return (
    (e.dynamicChildren =
      isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null),
    closeBlock(),
    isBlockTreeEnabled > 0 && currentBlock && currentBlock.push(e),
    e
  );
}
function createElementBlock(e, t, s, r, n, i) {
  return setupBlock(createBaseVNode(e, t, s, r, n, i, !0));
}
function createBlock(e, t, s, r, n) {
  return setupBlock(createVNode(e, t, s, r, n, !0));
}
function isVNode(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function isSameVNodeType(e, t) {
  return e.type === t.type && e.key === t.key;
}
const normalizeKey = ({ key: e }) => e ?? null,
  normalizeRef = ({ ref: e, ref_key: t, ref_for: s }) => (
    typeof e == 'number' && (e = '' + e),
    e != null
      ? isString(e) || isRef(e) || isFunction(e)
        ? { i: currentRenderingInstance, r: e, k: t, f: !!s }
        : e
      : null
  );
function createBaseVNode(
  e,
  t = null,
  s = null,
  r = 0,
  n = null,
  i = e === Fragment ? 0 : 1,
  a = !1,
  o = !1,
) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && normalizeKey(t),
    ref: t && normalizeRef(t),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children: s,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: r,
    dynamicProps: n,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance,
  };
  return (
    o
      ? (normalizeChildren(l, s), i & 128 && e.normalize(l))
      : s && (l.shapeFlag |= isString(s) ? 8 : 16),
    isBlockTreeEnabled > 0 &&
      !a &&
      currentBlock &&
      (l.patchFlag > 0 || i & 6) &&
      l.patchFlag !== 32 &&
      currentBlock.push(l),
    l
  );
}
const createVNode = _createVNode;
function _createVNode(e, t = null, s = null, r = 0, n = null, i = !1) {
  if (((!e || e === NULL_DYNAMIC_COMPONENT) && (e = Comment), isVNode(e))) {
    const o = cloneVNode(e, t, !0);
    return (
      s && normalizeChildren(o, s),
      isBlockTreeEnabled > 0 &&
        !i &&
        currentBlock &&
        (o.shapeFlag & 6
          ? (currentBlock[currentBlock.indexOf(e)] = o)
          : currentBlock.push(o)),
      (o.patchFlag = -2),
      o
    );
  }
  if ((isClassComponent(e) && (e = e.__vccOpts), t)) {
    t = guardReactiveProps(t);
    let { class: o, style: l } = t;
    (o && !isString(o) && (t.class = normalizeClass(o)),
      isObject(l) &&
        (isProxy(l) && !isArray(l) && (l = extend({}, l)),
        (t.style = normalizeStyle(l))));
  }
  const a = isString(e)
    ? 1
    : isSuspense(e)
      ? 128
      : isTeleport(e)
        ? 64
        : isObject(e)
          ? 4
          : isFunction(e)
            ? 2
            : 0;
  return createBaseVNode(e, t, s, r, n, a, i, !0);
}
function guardReactiveProps(e) {
  return e ? (isProxy(e) || isInternalObject(e) ? extend({}, e) : e) : null;
}
function cloneVNode(e, t, s = !1, r = !1) {
  const { props: n, ref: i, patchFlag: a, children: o, transition: l } = e,
    d = t ? mergeProps(n || {}, t) : n,
    c = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: d,
      key: d && normalizeKey(d),
      ref:
        t && t.ref
          ? s && i
            ? isArray(i)
              ? i.concat(normalizeRef(t))
              : [i, normalizeRef(t)]
            : normalizeRef(t)
          : i,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: o,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== Fragment ? (a === -1 ? 16 : a | 16) : a,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: l,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && cloneVNode(e.ssContent),
      ssFallback: e.ssFallback && cloneVNode(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce,
      cacheIndex: e.cacheIndex,
    };
  return (l && r && setTransitionHooks(c, l.clone(c)), c);
}
function createTextVNode(e = ' ', t = 0) {
  return createVNode(Text, null, e, t);
}
function createStaticVNode(e, t) {
  const s = createVNode(Static, null, e);
  return ((s.staticCount = t), s);
}
function createCommentVNode(e = '', t = !1) {
  return t
    ? (openBlock(), createBlock(Comment, null, e))
    : createVNode(Comment, null, e);
}
function normalizeVNode(e) {
  return e == null || typeof e == 'boolean'
    ? createVNode(Comment)
    : isArray(e)
      ? createVNode(Fragment, null, e.slice())
      : isVNode(e)
        ? cloneIfMounted(e)
        : createVNode(Text, null, String(e));
}
function cloneIfMounted(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : cloneVNode(e);
}
function normalizeChildren(e, t) {
  let s = 0;
  const { shapeFlag: r } = e;
  if (t == null) t = null;
  else if (isArray(t)) s = 16;
  else if (typeof t == 'object')
    if (r & 65) {
      const n = t.default;
      n &&
        (n._c && (n._d = !1), normalizeChildren(e, n()), n._c && (n._d = !0));
      return;
    } else {
      s = 32;
      const n = t._;
      !n && !isInternalObject(t)
        ? (t._ctx = currentRenderingInstance)
        : n === 3 &&
          currentRenderingInstance &&
          (currentRenderingInstance.slots._ === 1
            ? (t._ = 1)
            : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else if (isFunction(t)) {
    if (r & 65) {
      normalizeChildren(e, { default: t });
      return;
    }
    ((t = { default: t, _ctx: currentRenderingInstance }), (s = 32));
  } else
    ((t = String(t)),
      r & 64 ? ((s = 16), (t = [createTextVNode(t)])) : (s = 8));
  ((e.children = t), (e.shapeFlag |= s));
}
function mergeProps(...e) {
  const t = {};
  for (let s = 0; s < e.length; s++) {
    const r = e[s];
    for (const n in r)
      if (n === 'class')
        t.class !== r.class && (t.class = normalizeClass([t.class, r.class]));
      else if (n === 'style') t.style = normalizeStyle([t.style, r.style]);
      else if (isOn(n)) {
        const i = t[n],
          a = r[n];
        a && i !== a && !(isArray(i) && i.includes(a))
          ? (t[n] = i ? [].concat(i, a) : a)
          : a == null && i == null && !isModelListener(n) && (t[n] = a);
      } else n !== '' && (t[n] = r[n]);
  }
  return t;
}
function invokeVNodeHook(e, t, s, r = null) {
  callWithAsyncErrorHandling(e, t, 7, [s, r]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function getNextUid() {
  return uid;
}
function createComponentInstance(e, t, s) {
  const r = e.type,
    n = (t ? t.appContext : e.appContext) || emptyAppContext,
    i = {
      uid: uid++,
      vnode: e,
      type: r,
      parent: t,
      appContext: n,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new EffectScope(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(n.provides),
      ids: t ? t.ids : ['', 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: normalizePropsOptions(r, n),
      emitsOptions: normalizeEmitsOptions(r, n),
      emit: null,
      emitted: null,
      propsDefaults: EMPTY_OBJ,
      inheritAttrs: r.inheritAttrs,
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      suspense: s,
      suspenseId: s ? s.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (i.ctx = { _: i }),
    (i.root = t ? t.root : i),
    (i.emit = emit.bind(null, i)),
    e.ce && e.ce(i),
    i
  );
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance, setInSSRSetupState;
{
  const e = getGlobalThis(),
    t = (s, r) => {
      let n;
      return (
        (n = e[s]) || (n = e[s] = []),
        n.push(r),
        (i) => {
          n.length > 1 ? n.forEach((a) => a(i)) : n[0](i);
        }
      );
    };
  ((internalSetCurrentInstance = t(
    '__VUE_INSTANCE_SETTERS__',
    (s) => (currentInstance = s),
  )),
    (setInSSRSetupState = t(
      '__VUE_SSR_SETTERS__',
      (s) => (isInSSRComponentSetup = s),
    )));
}
const setCurrentInstance = (e) => {
    const t = currentInstance;
    return (
      internalSetCurrentInstance(e),
      e.scope.on(),
      () => {
        (e.scope.off(), internalSetCurrentInstance(t));
      }
    );
  },
  unsetCurrentInstance = () => {
    (currentInstance && currentInstance.scope.off(),
      internalSetCurrentInstance(null));
  };
function isStatefulComponent(e) {
  return e.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = !1;
function setupComponent(e, t = !1, s = !1) {
  t && setInSSRSetupState(t);
  const { props: r, children: n } = e.vnode,
    i = isStatefulComponent(e);
  (initProps(e, r, i, t), initSlots(e, n, s || t));
  const a = i ? setupStatefulComponent(e, t) : void 0;
  return (t && setInSSRSetupState(!1), a);
}
function setupStatefulComponent(e, t) {
  const s = e.type;
  ((e.accessCache = Object.create(null)),
    (e.proxy = new Proxy(e.ctx, PublicInstanceProxyHandlers)));
  const { setup: r } = s;
  if (r) {
    pauseTracking();
    const n = (e.setupContext = r.length > 1 ? createSetupContext(e) : null),
      i = setCurrentInstance(e),
      a = callWithErrorHandling(r, e, 0, [e.props, n]),
      o = isPromise(a);
    if (
      (resetTracking(),
      i(),
      (o || e.sp) && !isAsyncWrapper(e) && markAsyncBoundary(e),
      o)
    ) {
      if ((a.then(unsetCurrentInstance, unsetCurrentInstance), t))
        return a
          .then((l) => {
            setInSSRSetupState(!0);
            try {
              handleSetupResult(e, l, t);
            } finally {
              setInSSRSetupState(!1);
            }
          })
          .catch((l) => {
            handleError(l, e, 0);
          });
      e.asyncDep = a;
    } else handleSetupResult(e, a);
  } else finishComponentSetup(e);
}
function handleSetupResult(e, t, s) {
  (isFunction(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : isObject(t) && (e.setupState = proxyRefs(t)),
    finishComponentSetup(e));
}
function finishComponentSetup(e, t, s) {
  const r = e.type;
  e.render || (e.render = r.render || NOOP);
  {
    const n = setCurrentInstance(e);
    pauseTracking();
    try {
      applyOptions(e);
    } finally {
      (resetTracking(), n());
    }
  }
}
const attrsProxyHandlers = {
  get(e, t) {
    return (track(e, 'get', ''), e[t]);
  },
};
function createSetupContext(e) {
  const t = (s) => {
    e.exposed = s || {};
  };
  return {
    attrs: new Proxy(e.attrs, attrsProxyHandlers),
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function getComponentPublicInstance(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(proxyRefs(markRaw(e.exposed)), {
          get(t, s) {
            if (s in t) return t[s];
            if (s in publicPropertiesMap) return publicPropertiesMap[s](e);
          },
          has(t, s) {
            return s in t || s in publicPropertiesMap;
          },
        }))
    : e.proxy;
}
const classifyRE = /(?:^|[-_])\w/g,
  classify = (e) =>
    e.replace(classifyRE, (t) => t.toUpperCase()).replace(/[-_]/g, '');
function getComponentName(e, t = !0) {
  return isFunction(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function formatComponentName(e, t, s = !1) {
  let r = getComponentName(t);
  if (!r && t.__file) {
    const n = t.__file.match(/([^/\\]+)\.\w+$/);
    n && (r = n[1]);
  }
  if (!r && e) {
    const n = (i) => {
      for (const a in i) if (i[a] === t) return a;
    };
    r =
      n(e.components) ||
      (e.parent && n(e.parent.type.components)) ||
      n(e.appContext.components);
  }
  return r ? classify(r) : s ? 'App' : 'Anonymous';
}
function isClassComponent(e) {
  return isFunction(e) && '__vccOpts' in e;
}
const computed = (e, t) => computed$1(e, t, isInSSRComponentSetup),
  version = '3.5.44';
let policy;
const tt = typeof window < 'u' && window.trustedTypes;
if (tt)
  try {
    policy = tt.createPolicy('vue', { createHTML: (e) => e });
  } catch {}
const unsafeToTrustedHTML = policy ? (e) => policy.createHTML(e) : (e) => e,
  svgNS = 'http://www.w3.org/2000/svg',
  mathmlNS = 'http://www.w3.org/1998/Math/MathML',
  doc = typeof document < 'u' ? document : null,
  templateContainer = doc && doc.createElement('template'),
  nodeOps = {
    insert: (e, t, s) => {
      t.insertBefore(e, s || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, s, r) => {
      const n =
        t === 'svg'
          ? doc.createElementNS(svgNS, e)
          : t === 'mathml'
            ? doc.createElementNS(mathmlNS, e)
            : s
              ? doc.createElement(e, { is: s })
              : doc.createElement(e);
      return (
        e === 'select' &&
          r &&
          r.multiple != null &&
          n.setAttribute('multiple', r.multiple),
        n
      );
    },
    createText: (e) => doc.createTextNode(e),
    createComment: (e) => doc.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => doc.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, '');
    },
    insertStaticContent(e, t, s, r, n, i) {
      const a = s ? s.previousSibling : t.lastChild;
      if (n && (n === i || n.nextSibling))
        for (
          ;
          t.insertBefore(n.cloneNode(!0), s),
            !(n === i || !(n = n.nextSibling));

        );
      else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          r === 'svg'
            ? `<svg>${e}</svg>`
            : r === 'mathml'
              ? `<math>${e}</math>`
              : e,
        );
        const o = templateContainer.content;
        if (r === 'svg' || r === 'mathml') {
          const l = o.firstChild;
          for (; l.firstChild; ) o.appendChild(l.firstChild);
          o.removeChild(l);
        }
        t.insertBefore(o, s);
      }
      return [
        a ? a.nextSibling : t.firstChild,
        s ? s.previousSibling : t.lastChild,
      ];
    },
  },
  vtcKey = Symbol('_vtc');
function patchClass(e, t, s) {
  const r = e[vtcKey];
  (r && (t = (t ? [t, ...r] : [...r]).join(' ')),
    t == null
      ? e.removeAttribute('class')
      : s
        ? e.setAttribute('class', t)
        : (e.className = t));
}
const vShowOriginalDisplay = Symbol('_vod'),
  vShowHidden = Symbol('_vsh'),
  vShow = {
    name: 'show',
    beforeMount(e, { value: t }, { transition: s }) {
      ((e[vShowOriginalDisplay] =
        e.style.display === 'none' ? '' : e.style.display),
        s && t ? s.beforeEnter(e) : setDisplay(e, t));
    },
    mounted(e, { value: t }, { transition: s }) {
      s && t && s.enter(e);
    },
    updated(e, { value: t, oldValue: s }, { transition: r }) {
      !t != !s &&
        (r
          ? t
            ? (r.beforeEnter(e), setDisplay(e, !0), r.enter(e))
            : r.leave(e, () => {
                setDisplay(e, !1);
              })
          : setDisplay(e, t));
    },
    beforeUnmount(e, { value: t }) {
      setDisplay(e, t);
    },
  };
function setDisplay(e, t) {
  ((e.style.display = t ? e[vShowOriginalDisplay] : 'none'),
    (e[vShowHidden] = !t));
}
const CSS_VAR_TEXT = Symbol(''),
  displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(e, t, s) {
  const r = e.style,
    n = isString(s);
  let i = !1;
  if (s && !n) {
    if (t)
      if (isString(t))
        for (const a of t.split(';')) {
          const o = a.slice(0, a.indexOf(':')).trim();
          s[o] == null && setStyle(r, o, '');
        }
      else for (const a in t) s[a] == null && setStyle(r, a, '');
    for (const a in s) {
      a === 'display' && (i = !0);
      const o = s[a];
      o != null
        ? shouldPreserveTextareaResizeStyle(
            e,
            a,
            !isString(t) && t ? t[a] : void 0,
            o,
          ) || setStyle(r, a, o)
        : setStyle(r, a, '');
    }
  } else if (n) {
    if (t !== s) {
      const a = r[CSS_VAR_TEXT];
      (a && (s += ';' + a), (r.cssText = s), (i = displayRE.test(s)));
    }
  } else t && e.removeAttribute('style');
  vShowOriginalDisplay in e &&
    ((!n || t !== s) && (e[vShowOriginalDisplay] = i ? r.display : ''),
    e[vShowHidden] && (r.display = 'none'));
}
const importantRE = /\s*!important$/;
function setStyle(e, t, s) {
  if (isArray(s)) s.forEach((r) => setStyle(e, t, r));
  else if ((s == null && (s = ''), t.startsWith('--')))
    importantRE.test(s)
      ? e.setProperty(t, s.replace(importantRE, ''), 'important')
      : e.setProperty(t, s);
  else {
    const r = autoPrefix(e, t);
    importantRE.test(s)
      ? e.setProperty(hyphenate(r), s.replace(importantRE, ''), 'important')
      : (e[r] = s);
  }
}
const prefixes = ['Webkit', 'Moz', 'ms'],
  prefixCache = {};
function autoPrefix(e, t) {
  const s = prefixCache[t];
  if (s) return s;
  let r = camelize(t);
  if (r !== 'filter' && r in e) return (prefixCache[t] = r);
  r = capitalize(r);
  for (let n = 0; n < prefixes.length; n++) {
    const i = prefixes[n] + r;
    if (i in e) return (prefixCache[t] = i);
  }
  return t;
}
function shouldPreserveTextareaResizeStyle(e, t, s, r) {
  return (
    e.tagName === 'TEXTAREA' &&
    (t === 'width' || t === 'height') &&
    isString(r) &&
    s === r
  );
}
const xlinkNS = 'http://www.w3.org/1999/xlink';
function patchAttr(e, t, s, r, n, i = isSpecialBooleanAttr(t)) {
  r && t.startsWith('xlink:')
    ? s == null
      ? e.removeAttributeNS(xlinkNS, t.slice(6, t.length))
      : e.setAttributeNS(xlinkNS, t, s)
    : s == null || (i && !includeBooleanAttr(s))
      ? e.removeAttribute(t)
      : e.setAttribute(t, i ? '' : isSymbol(s) ? String(s) : s);
}
function patchDOMProp(e, t, s, r, n) {
  if (t === 'innerHTML' || t === 'textContent') {
    s != null && (e[t] = t === 'innerHTML' ? unsafeToTrustedHTML(s) : s);
    return;
  }
  const i = e.tagName;
  if (t === 'value' && i !== 'PROGRESS' && !i.includes('-')) {
    const o = i === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      l = s == null ? (e.type === 'checkbox' ? 'on' : '') : String(s);
    ((o !== l || !('_value' in e)) && (e.value = l),
      s == null && e.removeAttribute(t),
      (e._value = s));
    return;
  }
  let a = !1;
  if (s === '' || s == null) {
    const o = typeof e[t];
    o === 'boolean'
      ? (s = includeBooleanAttr(s))
      : s == null && o === 'string'
        ? ((s = ''), (a = !0))
        : o === 'number' && ((s = 0), (a = !0));
  }
  try {
    e[t] = s;
  } catch {}
  a && e.removeAttribute(n || t);
}
function addEventListener(e, t, s, r) {
  e.addEventListener(t, s, r);
}
function removeEventListener(e, t, s, r) {
  e.removeEventListener(t, s, r);
}
const veiKey = Symbol('_vei');
function patchEvent(e, t, s, r, n = null) {
  const i = e[veiKey] || (e[veiKey] = {}),
    a = i[t];
  if (r && a) a.value = r;
  else {
    const [o, l] = parseName(t);
    if (r) {
      const d = (i[t] = createInvoker(r, n));
      addEventListener(e, o, d, l);
    } else a && (removeEventListener(e, o, a, l), (i[t] = void 0));
  }
}
const optionsModifierRE = /(Once|Passive|Capture)$/,
  optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(e) {
  let t, s;
  for (; (s = e.match(optionsModifierRE)) && !optionsModifierEventRE.test(e); )
    (t || (t = {}),
      (e = e.slice(0, e.length - s[1].length)),
      (t[s[1].toLowerCase()] = !0));
  return [e[2] === ':' ? e.slice(3) : hyphenate(e.slice(2)), t];
}
let cachedNow = 0;
const p = Promise.resolve(),
  getNow = () =>
    cachedNow || (p.then(() => (cachedNow = 0)), (cachedNow = Date.now()));
function createInvoker(e, t) {
  const s = (r) => {
    if (!r._vts) r._vts = Date.now();
    else if (r._vts <= s.attached) return;
    const n = s.value;
    if (isArray(n)) {
      const i = r.stopImmediatePropagation;
      r.stopImmediatePropagation = () => {
        (i.call(r), (r._stopped = !0));
      };
      const a = n.slice(),
        o = [r];
      for (let l = 0; l < a.length && !r._stopped; l++) {
        const d = a[l];
        d && callWithAsyncErrorHandling(d, t, 5, o);
      }
    } else callWithAsyncErrorHandling(n, t, 5, [r]);
  };
  return ((s.value = e), (s.attached = getNow()), s);
}
const isNativeOn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  patchProp = (e, t, s, r, n, i) => {
    const a = n === 'svg';
    t === 'class'
      ? patchClass(e, r, a)
      : t === 'style'
        ? patchStyle(e, s, r)
        : isOn(t)
          ? isModelListener(t) || patchEvent(e, t, s, r, i)
          : (
                t[0] === '.'
                  ? ((t = t.slice(1)), !0)
                  : t[0] === '^'
                    ? ((t = t.slice(1)), !1)
                    : shouldSetAsProp(e, t, r, a)
              )
            ? (patchDOMProp(e, t, r),
              !e.tagName.includes('-') &&
                (t === 'value' || t === 'checked' || t === 'selected') &&
                patchAttr(e, t, r, a, i, t !== 'value'))
            : e._isVueCE &&
                (shouldSetAsPropForVueCE(e, t) ||
                  (e._def.__asyncLoader && (/[A-Z]/.test(t) || !isString(r))))
              ? patchDOMProp(e, camelize(t), r, i, t)
              : (t === 'true-value'
                  ? (e._trueValue = r)
                  : t === 'false-value' && (e._falseValue = r),
                patchAttr(e, t, r, a));
  };
function shouldSetAsProp(e, t, s, r) {
  if (r)
    return !!(
      t === 'innerHTML' ||
      t === 'textContent' ||
      (t in e && isNativeOn(t) && isFunction(s))
    );
  if (
    t === 'spellcheck' ||
    t === 'draggable' ||
    t === 'translate' ||
    t === 'autocorrect' ||
    (t === 'sandbox' && e.tagName === 'IFRAME') ||
    t === 'form' ||
    (t === 'list' && e.tagName === 'INPUT') ||
    (t === 'type' && e.tagName === 'TEXTAREA')
  )
    return !1;
  if (t === 'width' || t === 'height') {
    const n = e.tagName;
    if (n === 'IMG' || n === 'VIDEO' || n === 'CANVAS' || n === 'SOURCE')
      return !1;
  }
  return isNativeOn(t) && isString(s) ? !1 : t in e;
}
function shouldSetAsPropForVueCE(e, t) {
  const s = e._def.props;
  if (!s) return !1;
  const r = camelize(t);
  return Array.isArray(s)
    ? s.some((n) => camelize(n) === r)
    : Object.keys(s).some((n) => camelize(n) === r);
}
const getModelAssigner = (e) => {
  const t = e.props['onUpdate:modelValue'] || !1;
  return isArray(t) ? (s) => invokeArrayFns(t, s) : t;
};
function onCompositionStart(e) {
  e.target.composing = !0;
}
function onCompositionEnd(e) {
  const t = e.target;
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event('input')));
}
const assignKey = Symbol('_assign'),
  initialValueKey = Symbol('_initialValue');
function castValue(e, t, s) {
  return (t && (e = e.trim()), s && (e = looseToNumber(e)), e);
}
const vModelText = {
    created(e, { modifiers: { lazy: t, trim: s, number: r } }, n) {
      (e.parentNode &&
        (e.type === 'text'
          ? (e[initialValueKey] = e.defaultValue.replace(/[\r\n]/g, ''))
          : e.type === 'textarea' &&
            (e[initialValueKey] = e.defaultValue.replace(
              /\r\n?/g,
              `
`,
            ))),
        (e[assignKey] = getModelAssigner(n)));
      const i = r || (n.props && n.props.type === 'number');
      (addEventListener(e, t ? 'change' : 'input', (a) => {
        a.target.composing || e[assignKey](castValue(e.value, s, i));
      }),
        (s || i) &&
          addEventListener(e, 'change', () => {
            e.value = castValue(e.value, s, i);
          }),
        t ||
          (addEventListener(e, 'compositionstart', onCompositionStart),
          addEventListener(e, 'compositionend', onCompositionEnd),
          addEventListener(e, 'change', onCompositionEnd)));
    },
    mounted(e, { value: t, modifiers: { trim: s, number: r } }) {
      const n = t ?? '',
        i = e[initialValueKey];
      (delete e[initialValueKey],
        i !== void 0 &&
        (e.type === 'text' || e.type === 'textarea') &&
        e.value !== i
          ? e[assignKey](castValue(e.value, s, r))
          : (e.value = n));
    },
    beforeUpdate(
      e,
      { value: t, oldValue: s, modifiers: { lazy: r, trim: n, number: i } },
      a,
    ) {
      if (((e[assignKey] = getModelAssigner(a)), e.composing)) return;
      const o =
          (i || e.type === 'number') && !/^0\d/.test(e.value)
            ? looseToNumber(e.value)
            : e.value,
        l = t ?? '';
      if (o === l) return;
      const d = e.getRootNode();
      ((d instanceof Document || d instanceof ShadowRoot) &&
        d.activeElement === e &&
        e.type !== 'range' &&
        ((r && t === s) || (n && e.value.trim() === l))) ||
        (e.value = l);
    },
  },
  vModelCheckbox = {
    deep: !0,
    created(e, t, s) {
      ((e[assignKey] = getModelAssigner(s)),
        addEventListener(e, 'change', () => {
          const r = e._modelValue,
            n = getValue(e),
            i = e.checked,
            a = e[assignKey];
          if (isArray(r)) {
            const o = looseIndexOf(r, n),
              l = o !== -1;
            if (i && !l) a(r.concat(n));
            else if (!i && l) {
              const d = [...r];
              (d.splice(o, 1), a(d));
            }
          } else if (isSet(r)) {
            const o = new Set(r);
            (i ? o.add(n) : o.delete(n), a(o));
          } else a(getCheckboxValue(e, i));
        }));
    },
    mounted: setChecked,
    beforeUpdate(e, t, s) {
      ((e[assignKey] = getModelAssigner(s)), setChecked(e, t, s));
    },
  };
function setChecked(e, { value: t, oldValue: s }, r) {
  e._modelValue = t;
  let n;
  if (isArray(t)) n = looseIndexOf(t, r.props.value) > -1;
  else if (isSet(t)) n = t.has(r.props.value);
  else {
    if (t === s) return;
    n = looseEqual(t, getCheckboxValue(e, !0));
  }
  e.checked !== n && (e.checked = n);
}
const vModelRadio = {
    created(e, { value: t }, s) {
      ((e.checked = looseEqual(t, s.props.value)),
        (e[assignKey] = getModelAssigner(s)),
        addEventListener(e, 'change', () => {
          e[assignKey](getValue(e));
        }));
    },
    beforeUpdate(e, { value: t, oldValue: s }, r) {
      ((e[assignKey] = getModelAssigner(r)),
        t !== s && (e.checked = looseEqual(t, r.props.value)));
    },
  },
  vModelSelect = {
    deep: !0,
    created(e, { value: t, modifiers: { number: s } }, r) {
      ((e._modelValue = t),
        addEventListener(e, 'change', () => {
          const n = Array.prototype.filter
              .call(e.options, (l) => l.selected)
              .map((l) => (s ? looseToNumber(getValue(l)) : getValue(l))),
            i = e.multiple,
            a = i ? (isSet(e._modelValue) ? new Set(n) : n) : n[0],
            o = (e._pendingValue = [i, i ? (isArray(a) ? n.slice() : n) : a]);
          try {
            e[assignKey](a);
          } finally {
            nextTick(() => {
              e._pendingValue === o && (e._pendingValue = void 0);
            });
          }
        }),
        (e[assignKey] = getModelAssigner(r)));
    },
    mounted(e, { value: t }) {
      setSelected(e, t);
    },
    beforeUpdate(e, { value: t }, s) {
      ((e._modelValue = t), (e[assignKey] = getModelAssigner(s)));
    },
    updated(e, { value: t }) {
      const s = e._pendingValue;
      ((e._pendingValue = void 0),
        (!s || s[0] !== e.multiple || !isSameSelectValue(t, s[1], s[0])) &&
          setSelected(e, t));
    },
  };
function isSameSelectValue(e, t, s) {
  if (!s || isArray(e)) return looseEqual(e, t);
  if (isSet(e)) {
    if (e.size !== t.length) return !1;
    for (const r of t) if (!e.has(r)) return !1;
    return !0;
  }
  return !1;
}
function setSelected(e, t) {
  const s = e.multiple,
    r = isArray(t);
  if (!(s && !r && !isSet(t))) {
    for (let n = 0, i = e.options.length; n < i; n++) {
      const a = e.options[n],
        o = getValue(a);
      if (s)
        if (r) {
          const l = typeof o;
          l === 'string' || l === 'number'
            ? (a.selected = t.some((d) => String(d) === String(o)))
            : (a.selected = looseIndexOf(t, o) > -1);
        } else a.selected = t.has(o);
      else if (looseEqual(getValue(a), t)) {
        e.selectedIndex !== n && (e.selectedIndex = n);
        return;
      }
    }
    !s && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function getValue(e) {
  return '_value' in e ? e._value : e.value;
}
function getCheckboxValue(e, t) {
  const s = t ? '_trueValue' : '_falseValue';
  return s in e ? e[s] : t;
}
const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'],
  modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => 'button' in e && e.button !== 0,
    middle: (e) => 'button' in e && e.button !== 1,
    right: (e) => 'button' in e && e.button !== 2,
    exact: (e, t) =>
      systemModifiers.some((s) => e[`${s}Key`] && !t.includes(s)),
  },
  withModifiers = (e, t) => {
    if (!e) return e;
    const s = e._withMods || (e._withMods = {}),
      r = t.join('.');
    return (
      s[r] ||
      (s[r] = (n, ...i) => {
        for (let a = 0; a < t.length; a++) {
          const o = modifierGuards[t[a]];
          if (o && o(n, t)) return;
        }
        return e(n, ...i);
      })
    );
  },
  keyNames = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace',
  },
  withKeys = (e, t) => {
    const s = e._withKeys || (e._withKeys = {}),
      r = t.join('.');
    return (
      s[r] ||
      (s[r] = (n) => {
        if (!('key' in n)) return;
        const i = hyphenate(n.key);
        if (t.some((a) => a === i || keyNames[a] === i)) return e(n);
      })
    );
  },
  rendererOptions = extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...e) => {
  const t = ensureRenderer().createApp(...e),
    { mount: s } = t;
  return (
    (t.mount = (r) => {
      const n = normalizeContainer(r);
      if (!n) return;
      const i = t._component;
      (!isFunction(i) && !i.render && !i.template && (i.template = n.innerHTML),
        n.nodeType === 1 && (n.textContent = ''));
      const a = s(n, !1, resolveRootNamespace(n));
      return (
        n instanceof Element &&
          (n.removeAttribute('v-cloak'), n.setAttribute('data-v-app', '')),
        a
      );
    }),
    t
  );
};
function resolveRootNamespace(e) {
  if (e instanceof SVGElement) return 'svg';
  if (typeof MathMLElement == 'function' && e instanceof MathMLElement)
    return 'mathml';
}
function normalizeContainer(e) {
  return isString(e) ? document.querySelector(e) : e;
}
function getDefaultExportFromCjs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default')
    ? e.default
    : e;
}
var PersianDate_min = { exports: {} },
  hasRequiredPersianDate_min;
function requirePersianDate_min() {
  if (hasRequiredPersianDate_min) return PersianDate_min.exports;
  hasRequiredPersianDate_min = 1;
  var CALENDAR = {
      jalali: {
        months: {
          1: 'فروردین',
          2: 'اردیبهشت',
          3: 'خرداد',
          4: 'تیر',
          5: 'مرداد',
          6: 'شهریور',
          7: 'مهر',
          8: 'آبان',
          9: 'آذر',
          10: 'دی',
          11: 'بهمن',
          12: 'اسفند',
        },
        days: {
          label: {
            6: 'شنبه',
            0: 'یکشنبه',
            1: 'دوشنبه',
            2: 'سه‌شنبه',
            3: 'چهارشنبه',
            4: 'پنجشنبه',
            5: 'جمعه',
          },
          weekNumber: { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 },
        },
        ordinalNumbers: function (e, t) {
          var s = {
              1: 'یک',
              2: 'دو',
              3: 'سو',
              4: 'چهار',
              5: 'پنج',
              6: 'شش',
              7: 'هفت',
              8: 'هشت',
              9: 'نه',
              10: 'ده',
              11: 'یازده',
              12: 'دوازده',
              13: 'سیزده',
              14: 'چهارده',
              15: 'پانزده',
              16: 'شانزده',
              17: 'هفده',
              18: 'هجده',
              19: 'نوزده',
              20: 'بیست',
              30: 'سی‌',
              40: 'چهل',
              50: 'پنجاه',
              60: 'شصت',
              70: 'هفتاد',
              80: 'هشتاد',
              90: 'نود',
              100: 'صد',
              200: 'دویست',
              300: 'سیصد',
            },
            r = '';
          if (e == 1) r = 'اول';
          else if (s[e]) r = s[e] + (e == 30 ? 'ام' : 'م');
          else {
            var n = e % 100;
            ((s[n] || (n = e % 10)) && (r = s[n] + 'م'),
              (n = (e - n) % 100) &&
                (r = s[n] + (r ? ' و ' + r : n == 30 ? 'ام ' : 'م')),
              (n = 100 * Math.floor(e / 100)) &&
                (r = s[n] + (r ? ' و ' + r : 'م')));
          }
          return (t == 2 && (r += 'ین'), r);
        },
      },
      gregorian: {
        months: {
          1: 'January',
          2: 'February',
          3: 'March',
          4: 'April',
          5: 'May',
          6: 'June',
          7: 'July',
          8: 'August',
          9: 'September',
          10: 'October',
          11: 'November',
          12: 'December',
        },
        days: {
          label: {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
          },
          weekNumber: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 },
        },
        ordinalNumbers: function (e) {
          return e == 1 || (e % 10 == 1 && e != 11)
            ? e + 'st'
            : e == 2 || (e % 10 == 2 && e != 12)
              ? e + 'nd'
              : e == 3 || (e % 10 == 3 && e != 13)
                ? e + 'rd'
                : e + 'th';
        },
      },
    },
    REGEX = {
      format:
        /j*(YYYY|YY|y|Qo|QO|Q|MMMM|MMM|MM|Mo|MO|M|DDDD|DDDo|DDDO|DDD|DD|Do|DO|D|dddd|ddd|dd|do|dO|de|d|ww|WW|wo|Wo|wO|WO|w|W|HH|hh|H|h|kk|k|mm|m|ss|s|CCCC|CCC|c|t|aa|a|A)/g,
      isNumeric: /^\d+$/,
      separators: '\\/| |-|\\.|,|:',
      betweenBacktick: /`(.*?)`/g,
    },
    TIMETYPE = function (e, t) {
      return e >= 0 && e < 12
        ? t == 'a'
          ? 'am'
          : t == 'aa'
            ? 'A.M.'
            : t == 'A'
              ? 'AM'
              : t == 'ja'
                ? 'ق ظ'
                : t == 'jaa'
                  ? 'ق.ظ'
                  : t == 'jA'
                    ? 'قبل از ظهر'
                    : 'ق.ظ'
        : e >= 12 && e < 24
          ? t == 'a'
            ? 'pm'
            : t == 'aa'
              ? 'P.M.'
              : t == 'A'
                ? 'PM'
                : t == 'ja'
                  ? 'ب ظ'
                  : t == 'jaa'
                    ? 'ب.ظ'
                    : t == 'jA'
                      ? 'بعد از ظهر'
                      : 'ب.ظ'
          : void 0;
    },
    isDate = function (e) {
      return e instanceof Date;
    },
    jalali$4 = function (e) {
      return (
        e > 1342 ? [1, 5, 9, 13, 17, 22, 26, 30] : [1, 5, 9, 13, 17, 21, 26, 30]
      ).includes(e % 33);
    },
    gregorian$4 = function (e) {
      return (e % 4 == 0 && e % 100 != 0) || e % 400 == 0;
    },
    isLeapYear = function (e, t) {
      return e[0] === 'j' ? jalali$4(t) : gregorian$4(t);
    },
    isPersianDate = function (e) {
      return e instanceof PersianDate;
    },
    isValid = function (e, t, s, r, n, i, a, o) {
      return isValidDate(e, t, s, r) && isValidTime(n, i, a, o);
    },
    jalali$3 = function (e, t, s) {
      return (
        !(t >= 7 && t <= 11 && s == 31) &&
        (t != 12 || s != 31) &&
        !(t == 12 && s == 30 && !isLeapYear('j', e))
      );
    },
    gregorian$3 = function (e, t, s) {
      return (
        (![2, 4, 6, 9, 11].includes(t) || s != 31) &&
        !(t == 2 && (s == 30 || (s == 29 && !isLeapYear('g', e))))
      );
    },
    isValidDate = function (e, t, s, r) {
      return [t, s, r].some(function (n) {
        return String(n).search(/null|NaN/) != -1;
      }) ||
        t < 0 ||
        s > 12 ||
        s < 1 ||
        r > 31 ||
        r < 1
        ? !1
        : e[0] === 'j'
          ? jalali$3(t, s, r)
          : gregorian$3(t, s, r);
    },
    isValidTime = function (e, t, s, r) {
      return (
        ![e, t, s, r].some(function (n) {
          return String(n).search(/null|NaN/) != -1;
        }) &&
        !(e < 0 || e > 23) &&
        !(t < 0 || t > 59) &&
        !(s < 0 || s > 59) &&
        !(r < 0 || r > 999)
      );
    };
  function isSame() {
    var e = typesToArray.apply(
      void 0,
      [this.c].concat(Array.prototype.slice.call(arguments)),
    );
    return (
      (e = this.toArray().map(function (t, s) {
        return REGEX.isNumeric.test(e[s]) ? e[s] : t;
      })),
      compare.call(this, e, '==')
    );
  }
  function _setPrototypeOf(e, t) {
    return (_setPrototypeOf =
      Object.setPrototypeOf ||
      function (s, r) {
        return ((s.__proto__ = r), s);
      })(e, t);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham)
      return !1;
    if (typeof Proxy == 'function') return !0;
    try {
      return (
        Boolean.prototype.valueOf.call(
          Reflect.construct(Boolean, [], function () {}),
        ),
        !0
      );
    } catch {
      return !1;
    }
  }
  function _construct(e, t, s) {
    return (_construct = _isNativeReflectConstruct()
      ? Reflect.construct
      : function (r, n, i) {
          var a = [null];
          a.push.apply(a, n);
          var o = new (Function.bind.apply(r, a))();
          return (i && _setPrototypeOf(o, i.prototype), o);
        }).apply(null, arguments);
  }
  function _slicedToArray(e, t) {
    return (
      _arrayWithHoles(e) ||
      _iterableToArrayLimit(e, t) ||
      _unsupportedIterableToArray(e, t) ||
      _nonIterableRest()
    );
  }
  function _toConsumableArray(e) {
    return (
      _arrayWithoutHoles(e) ||
      _iterableToArray(e) ||
      _unsupportedIterableToArray(e) ||
      _nonIterableSpread()
    );
  }
  function _arrayWithoutHoles(e) {
    if (Array.isArray(e)) return _arrayLikeToArray(e);
  }
  function _arrayWithHoles(e) {
    if (Array.isArray(e)) return e;
  }
  function _iterableToArray(e) {
    if (
      (typeof Symbol < 'u' && e[Symbol.iterator] != null) ||
      e['@@iterator'] != null
    )
      return Array.from(e);
  }
  function _iterableToArrayLimit(e, t) {
    var s =
      e && ((typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator']);
    if (s != null) {
      var r,
        n,
        i = [],
        a = !0,
        o = !1;
      try {
        for (
          s = s.call(e);
          !(a = (r = s.next()).done) && (i.push(r.value), !t || i.length !== t);
          a = !0
        );
      } catch (l) {
        ((o = !0), (n = l));
      } finally {
        try {
          a || s.return == null || s.return();
        } finally {
          if (o) throw n;
        }
      }
      return i;
    }
  }
  function _unsupportedIterableToArray(e, t) {
    if (e) {
      if (typeof e == 'string') return _arrayLikeToArray(e, t);
      var s = Object.prototype.toString.call(e).slice(8, -1);
      return (
        s === 'Object' && e.constructor && (s = e.constructor.name),
        s === 'Map' || s === 'Set'
          ? Array.from(e)
          : s === 'Arguments' ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)
            ? _arrayLikeToArray(e, t)
            : void 0
      );
    }
  }
  function _arrayLikeToArray(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var s = 0, r = new Array(t); s < t; s++) r[s] = e[s];
    return r;
  }
  function _nonIterableSpread() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function _nonIterableRest() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function _createForOfIteratorHelper(e, t) {
    var s = (typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator'];
    if (!s) {
      if (Array.isArray(e) || (s = _unsupportedIterableToArray(e)) || t) {
        s && (e = s);
        var r = 0,
          n = function () {};
        return {
          s: n,
          n: function () {
            return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
          },
          e: function (l) {
            throw l;
          },
          f: n,
        };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var i,
      a = !0,
      o = !1;
    return {
      s: function () {
        s = s.call(e);
      },
      n: function () {
        var l = s.next();
        return ((a = l.done), l);
      },
      e: function (l) {
        ((o = !0), (i = l));
      },
      f: function () {
        try {
          a || s.return == null || s.return();
        } finally {
          if (o) throw i;
        }
      },
    };
  }
  var matchingDate = function (e, t) {
    return (
      t.year(e[0] || t.year()),
      t.month(e[1] || t.month()),
      t.date(e[2] || t.date()),
      t.hour(e[3] || t.hour()),
      t.minute(e[4] || t.minute()),
      t.second(e[5] || t.second()),
      t.millisecond(e[6] || t.millisecond()),
      t.toArray()
    );
  };
  function isBetween(e, t, s) {
    return (
      (e = typesToArray(this.c, e)),
      (e = matchingDate(e, this.clone())),
      (t = typesToArray(this.c, t)),
      (t = matchingDate(t, this.clone())),
      !(
        !this.isValid.apply(this, _toConsumableArray(e)) ||
        !this.isValid.apply(this, _toConsumableArray(t))
      ) &&
        compare.call(this, e, s[0] === '[' ? '>=' : '>') &&
        compare.call(this, t, s[1] === ']' ? '<=' : '<')
    );
  }
  function isInArray(e) {
    var t = this;
    return e.some(function (s) {
      return isSame.call(t, s);
    });
  }
  var gtj = function (e, t, s, r, n, i, a) {
      var o, l;
      ((s = (o = e
        ? isDate(e)
          ? e
          : new Date(
              REGEX.isNumeric.test(e) ? e : 0,
              REGEX.isNumeric.test(t) ? t : 0,
              REGEX.isNumeric.test(s) ? s : 1,
              REGEX.isNumeric.test(r) ? r : 0,
              REGEX.isNumeric.test(n) ? n : 0,
              REGEX.isNumeric.test(i) ? i : 0,
              REGEX.isNumeric.test(a) ? a : 0,
            )
        : new Date()).getDate()),
        (t = o.getMonth() + 1),
        (e = o.getFullYear()),
        (r = o.getHours()),
        (n = o.getMinutes()),
        (i = o.getSeconds()),
        (a = o.getMilliseconds()),
        e > 1600 ? ((l = 979), (e -= 1600)) : ((l = 0), (e -= 621)));
      var d = t > 2 ? e + 1 : e,
        c =
          365 * e +
          parseInt((d + 3) / 4) -
          parseInt((d + 99) / 100) +
          parseInt((d + 399) / 400) -
          80 +
          s +
          [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][t - 1];
      return (
        (l += 33 * parseInt(c / 12053)),
        (c %= 12053),
        (l += 4 * parseInt(c / 1461)),
        (c %= 1461) > 365 &&
          ((l += parseInt((c - 1) / 365)), (c = (c - 1) % 365)),
        [
          l,
          c < 186 ? 1 + parseInt(c / 31) : 7 + parseInt((c - 186) / 30),
          1 + (c < 186 ? c % 31 : (c - 186) % 30),
          r,
          n,
          i,
          a,
        ]
      );
    },
    jtg = function (e, t, s, r, n, i, a) {
      var o, l, d;
      ((e = REGEX.isNumeric.test(e) ? +e : 1),
        (t = REGEX.isNumeric.test(t) ? +t : 1),
        (s = REGEX.isNumeric.test(s) ? +s : 1),
        (r = REGEX.isNumeric.test(r) ? +r : 0),
        (n = REGEX.isNumeric.test(n) ? +n : 0),
        (i = REGEX.isNumeric.test(i) ? +i : 0),
        (a = REGEX.isNumeric.test(a) ? +a : 0),
        e > 979 ? ((o = 1600), (e -= 979)) : (o = 621));
      var c =
        365 * e +
        8 * parseInt(e / 33) +
        parseInt(((e % 33) + 3) / 4) +
        78 +
        s +
        (t < 7 ? 31 * (t - 1) : 30 * (t - 7) + 186);
      ((o += 400 * parseInt(c / 146097)),
        (c %= 146097) > 36524 &&
          ((o += 100 * parseInt(--c / 36524)), (c %= 36524) >= 365 && c++),
        (o += 4 * parseInt(c / 1461)),
        (c %= 1461) > 365 &&
          ((o += parseInt((c - 1) / 365)), (c = (c - 1) % 365)),
        (d = c + 1));
      var f = [
        0,
        31,
        isLeapYear('gregorian', o) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];
      for (l = 0; l < 13; l++) {
        var v = f[l];
        if (d <= v) break;
        d -= v;
      }
      return new Date(o, l - 1, d, r, n, i, a);
    },
    warn = function (e) {
      console.warn(e);
    },
    error = function (e) {
      console.error(e);
    },
    invalid = function (e) {
      return (delete this.d, (this.error = e), this);
    },
    typesToArray = function (e, t, s, r, n, i, a, o) {
      return (
        t || (t = new Date()),
        typeof t == 'string' && t.search(REGEX.separators) != -1
          ? t.split(/[/ -.,:\\]/)
          : Array.isArray(t)
            ? t
            : PersianDate.isPersianDate(t)
              ? t.clone().calendar(e).toArray()
              : PersianDate.isDate(t)
                ? new PersianDate(t).calendar(e).toArray()
                : Object.prototype.toString.call(t) === '[object Object]'
                  ? [
                      t.y || t.year || t.years,
                      t.M || t.month || t.months || 1,
                      t.d || t.day || t.days || t.date || 1,
                      t.h || t.hour || t.hours || 0,
                      t.m || t.minute || t.minutes || 0,
                      t.s || t.second || t.seconds || 0,
                      t.ms || t.millisecond || t.milliseconds || 0,
                    ]
                  : [t, s, r, n, i, a, o]
      );
    },
    ordinalNumber = function (e) {
      var t =
          arguments.length > 1 && arguments[1] !== void 0
            ? arguments[1]
            : 'jalali',
        s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
      return CALENDAR[t].ordinalNumbers(e, s);
    },
    addPrefix = function (e, t) {
      var s =
        arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '0';
      return s.repeat(t - String(e).length) + e;
    },
    setJalaliDate = function (e) {
      var t = _slicedToArray(gtj(e), 7);
      ((this.d.year = t[0]),
        (this.d.month = t[1]),
        (this.d.date = t[2]),
        (this.d.hour = t[3]),
        (this.d.minute = t[4]),
        (this.d.second = t[5]),
        (this.d.millisecond = t[6]));
    },
    setGregorianDate = function (e) {
      this.d = {
        year: e.getFullYear(),
        month: e.getMonth() + 1,
        date: e.getDate(),
        hour: e.getHours(),
        minute: e.getMinutes(),
        second: e.getSeconds(),
        millisecond: e.getMilliseconds(),
      };
    },
    getDayLabel = function () {
      var e =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : new Date(),
        t =
          arguments.length > 1 && arguments[1] !== void 0
            ? arguments[1]
            : 'jalali';
      return isDate(e)
        ? CALENDAR[t].days.label[e.getDay()]
        : error('the first param must be instance of Date.');
    },
    getDayOfWeek = function () {
      var e =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : new Date(),
        t =
          arguments.length > 1 && arguments[1] !== void 0
            ? arguments[1]
            : 'jalali',
        s =
          arguments.length > 2 && arguments[2] !== void 0
            ? arguments[2]
            : 'standard';
      return isDate(e)
        ? CALENDAR[t].days.weekNumber[e.getDay()] + (s != 'standard' ? 0 : 1)
        : error('the first param must be instance of Date.');
    },
    getDefaultFormat$4 = function (e) {
      return e[0] === 'j' ? 'jy' : 'y';
    };
  function year(e) {
    if (((e = String(e).trim()), REGEX.isNumeric.test(e)))
      return (
        (this.d.year = +e),
        this.isValidDate() ? this : this.subDay(1, !1)
      );
    e || (e = getDefaultFormat$4(this.c));
    var t = this.c == 'jalali' ? this.d.year : gtj(this.toDate())[0];
    if (e == 'jy' || e == 'jYYYY') return t;
    if (e == 'jYY') return String(t).slice(-2);
    var s = this.c == 'gregorian' ? this.d.year : this.toDate().getFullYear();
    return e == 'y' || e == 'YYYY' ? s : e == 'YY' ? String(s).slice(-2) : t;
  }
  var getDefaultFormat$3 = function (e) {
    return e[0] === 'j' ? 'jQ' : 'Q';
  };
  function quarter(e) {
    if (((e = String(e).trim()), REGEX.isNumeric.test(e))) {
      for (
        e < 1
          ? ((this.d.month = 1), this.subQuarter(e - 1, !1))
          : e > 4
            ? ((this.d.month = 12), this.addQuarter(e - 4, !1))
            : (this.d.month = 3 * +e - 2);
        !this.isValidDate();

      )
        this.subDay(1, !1);
      return this;
    }
    e || (e = getDefaultFormat$3(this.c));
    var t = Math.ceil(
      (this.c == 'jalali' ? this.d.month : gtj(this.toDate())[1]) / 3,
    );
    if (e == 'jQ') return t;
    if (e == 'jQo') return ordinalNumber(t);
    if (e == 'jQO') return ordinalNumber(t, 'jalali', 2);
    var s = Math.ceil(
      (this.c == 'gregorian' ? this.d.month : this.toDate().getMonth() + 1) / 3,
    );
    return e == 'Q'
      ? s
      : e == 'Qo' || e == 'QO'
        ? ordinalNumber(s, 'gregorian')
        : t;
  }
  var getDefaultFormat$2 = function (e) {
    return e[0] === 'j' ? 'jM' : 'M';
  };
  function month(e) {
    if (((e = String(e).trim()), REGEX.isNumeric.test(e))) {
      for (
        e < 1
          ? ((this.d.month = 1), this.subMonth(e - 1, !1))
          : e > 12
            ? ((this.d.month = 12), this.addMonth(e - 12, !1))
            : (this.d.month = +e);
        !this.isValidDate();

      )
        this.subDay(1, !1);
      return this;
    }
    e || (e = getDefaultFormat$2(this.c));
    var t = this.c == 'jalali' ? this.d.month : gtj(this.toDate())[1];
    if (e == 'jMM') return addPrefix(t, 2);
    if (e == 'jM') return t;
    if (e == 'jMMMM' || e == 'jMMM') return CALENDAR.jalali.months[t];
    if (e == 'jMo') return ordinalNumber(t);
    if (e == 'jMO') return ordinalNumber(t, 'jalali', 2);
    var s = this.c == 'gregorian' ? this.d.month : this.toDate().getMonth() + 1;
    return e == 'M'
      ? s
      : e == 'MM'
        ? addPrefix(s, 2)
        : e == 'MMMM'
          ? CALENDAR.gregorian.months[s]
          : e == 'Mo' || e == 'MO'
            ? ordinalNumber(s, 'gregorian')
            : e == 'MMM'
              ? CALENDAR.gregorian.months[s].slice(0, 3)
              : t;
  }
  var getDefaultFormat$1 = function (e) {
    return e[0] === 'j' ? 'jw' : 'w';
  };
  function week(e) {
    if (((e = String(e).trim()), REGEX.isNumeric.test(e))) {
      var t = this.getWeeksInYear();
      if (e < 1) (this.week(1), this.subWeek(e - 1, !1));
      else if (e > t) (this.week(t), this.addWeek(e - t, !1));
      else {
        var s = getWeekOfYear.call(
          this,
          this.d.year,
          this.d.month,
          this.d.date,
          this.c,
        );
        this.addWeek(+e - s);
      }
      for (; !this.isValidDate(); ) this.subDay(1, !1);
      return this;
    }
    e || (e = getDefaultFormat$1(this.c));
    var r = getWeekOfYear.call(
      this,
      this.year('jy'),
      this.month('jM'),
      this.date('jD'),
      this.c,
    );
    if (e == 'jw' || e == 'jW') return r;
    if (e == 'jww' || e == 'jWW') return addPrefix(r, 2);
    if (e == 'jwo' || e == 'jWo') return ordinalNumber(r);
    if (e == 'jwO' || e == 'jWO') return ordinalNumber(r, 'jalali', 2);
    var n = getWeekOfYear.call(
      this,
      this.year('y'),
      this.month('M'),
      this.date('D'),
      'gregorian',
    );
    return e == 'w' || e == 'W'
      ? n
      : e == 'ww' || e == 'WW'
        ? addPrefix(n, 2)
        : e == 'wo' || e == 'Wo' || e == 'wO' || e == 'WO'
          ? ordinalNumber(n, 'gregorian')
          : r;
  }
  var getDefaultFormat = function (e) {
    return e[0] === 'j' ? 'jD' : 'D';
  };
  function date(e) {
    if (((e = String(e).trim()), REGEX.isNumeric.test(e))) {
      var t = this.getDaysInMonth();
      return (
        e < 1
          ? ((this.d.date = 1), this.subDay(e - 1))
          : e > t
            ? ((this.d.date = t), this.addDay(e - t))
            : (this.d.date = +e),
        this
      );
    }
    e || (e = getDefaultFormat(this.c));
    var s = this.c == 'jalali' ? this.d.date : gtj(this.toDate())[2];
    if (e == 'jDD') return addPrefix(s, 2);
    if (e == 'jD') return s;
    if (e == 'jDo') return ordinalNumber(s);
    if (e == 'jDO') return ordinalNumber(s, 'jalali', 2);
    var r = this.toDate();
    if (e == 'jdddd' || e == 'jddd') return getDayLabel(r);
    if (e == 'jdd') return getDayLabel(r).slice(0, 1);
    var n = getDayOfWeek(r);
    if (e == 'jdo') return ordinalNumber(n);
    if (e == 'jdO') return ordinalNumber(n, 'jalali', 2);
    if (e == 'jd') return getDayOfWeek(r, 'jalali', 'array');
    if (e == 'jde') return n;
    var i = getDayOfYear(this.year('jy'), this.month('jM'), s, 'j');
    return e == 'jDDDD'
      ? addPrefix(i, 3)
      : e == 'jDDD'
        ? i
        : e == 'jDDDo'
          ? ordinalNumber(i)
          : e == 'jDDDO'
            ? ordinalNumber(i, 'jalali', 2)
            : e == 'DD'
              ? addPrefix(r.getDate(), 2)
              : e == 'D'
                ? r.getDate()
                : e == 'Do' || e == 'DO'
                  ? ordinalNumber(r.getDate(), 'gregorian')
                  : e == 'dddd'
                    ? getDayLabel(r, 'gregorian')
                    : e == 'ddd'
                      ? getDayLabel(r, 'gregorian').slice(0, 3)
                      : e == 'dd'
                        ? getDayLabel(r, 'gregorian').slice(0, 2)
                        : ((n = getDayOfWeek(r, 'gregorian')),
                          e == 'do' || e == 'dO'
                            ? ordinalNumber(n, 'gregorian')
                            : e == 'd'
                              ? n - 1
                              : e == 'de'
                                ? n
                                : ((i = getDayOfYear(
                                    r.getFullYear(),
                                    r.getMonth() + 1,
                                    r.getDate(),
                                    'g',
                                  )),
                                  e == 'DDDD'
                                    ? addPrefix(i, 3)
                                    : e == 'DDD'
                                      ? i
                                      : e == 'DDDo' || e == 'DDDO'
                                        ? ordinalNumber(i, 'gregorian')
                                        : s));
  }
  function hour(e) {
    if (((e = String(e).trim()), REGEX.isNumeric.test(e)))
      return (
        e < 0
          ? ((this.d.hour = 0), this.subHour(e))
          : e > 23
            ? ((this.d.hour = 23), this.addHour(e - 23))
            : (this.d.hour = +e),
        this
      );
    var t = this.d.hour;
    return e == 'H'
      ? t
      : e == 'HH'
        ? addPrefix(t, 2)
        : e == 'k'
          ? t || 24
          : e == 'kk'
            ? addPrefix(t || 24, 2)
            : ((t = t > 12 ? t - 12 : t),
              e == 'h' ? t : e == 'hh' ? addPrefix(t, 2) : t);
  }
  function minute(e) {
    return (
      (e = String(e).trim()),
      REGEX.isNumeric.test(e)
        ? (e < 0
            ? ((this.d.minute = 0), this.subMinute(e))
            : e > 23
              ? ((this.d.minute = 23), this.addMinute(e - 23))
              : (this.d.minute = +e),
          this)
        : e == 'm'
          ? this.d.minute
          : e == 'mm'
            ? addPrefix(this.d.minute, 2)
            : this.d.minute
    );
  }
  function second(e) {
    return (
      (e = String(e).trim()),
      REGEX.isNumeric.test(e)
        ? (e < 0
            ? ((this.d.second = 0), this.subSecond(e))
            : e > 23
              ? ((this.d.second = 23), this.addSecond(e - 23))
              : (this.d.second = +e),
          this)
        : e == 's'
          ? this.d.second
          : e == 'ss'
            ? addPrefix(this.d.second, 2)
            : this.d.second
    );
  }
  function millisecond(e) {
    return (
      (e = String(e).trim()),
      REGEX.isNumeric.test(e)
        ? (e < 0
            ? ((this.d.millisecond = 0), this.subMillisecond(e))
            : e > 23
              ? ((this.d.millisecond = 23), this.addMillisecond(e - 23))
              : (this.d.millisecond = +e),
          this)
        : e == 'CCC' || e == 'c'
          ? this.d.millisecond
          : e == 'CCCC'
            ? addPrefix(this.d.millisecond, 3)
            : this.d.millisecond
    );
  }
  function timestamp(e) {
    return e ? this.fromGregorian(+String(e).trim()) : this.toDate().getTime();
  }
  var jalali$2 = function (e, t, s) {
      return s >= 1 && s <= 6
        ? 31
        : (s > 6 && s <= 11) || isLeapYear(e, t)
          ? 30
          : 29;
    },
    gregorian$2 = function (e, t, s) {
      return [1, 3, 5, 7, 8, 10, 12].includes(s)
        ? 31
        : s != 2
          ? 30
          : isLeapYear(e, t)
            ? 29
            : 28;
    },
    getDaysInMonth = function (e, t, s) {
      return e[0] === 'j' ? jalali$2(e, t, s) : gregorian$2(e, t, s);
    },
    getDayOfYearFormat = function (e) {
      return e[0] === 'j' ? 'jd' : 'd';
    };
  function getWeeksInYear(e) {
    var t = getDayOfYearFormat(this.c),
      s = this.clone().parse(e),
      r = s.date(t),
      n = s.clone().endOf('year').startOf('day'),
      i = n.date(t);
    return (
      r > 3 ? s.addDay(7 - r) : s.subDay(r),
      i > 3 ? n.addDay(7 - i) : n.subDay(i),
      Math.ceil(n.diff(s, 'date') / 7)
    );
  }
  function startOf(e) {
    return (
      (this.d.millisecond = 0),
      e[0] == 's'
        ? this
        : ((this.d.second = 0),
          e == 'm' || e == 'minute'
            ? this
            : ((this.d.minute = 0),
              e[0] == 'h'
                ? this
                : ((this.d.hour = 0),
                  e[0] == 'd'
                    ? this
                    : e[0] == 'w'
                      ? this.subDay(
                          getDayOfWeek(this.toDate(), this.c, 'array'),
                        )
                      : ((this.d.date = 1),
                        e[0] == 'q'
                          ? this.quarter(this.quarter())
                          : e == 'M' || e == 'month'
                            ? this
                            : ((this.d.month = 1),
                              e[0] == 'y' ? this : void 0)))))
    );
  }
  function endOf(e) {
    return (
      (this.d.millisecond = 999),
      e[0] == 's'
        ? this
        : ((this.d.second = 59),
          e == 'm' || e == 'minute'
            ? this
            : ((this.d.minute = 59),
              e[0] == 'h'
                ? this
                : ((this.d.hour = 23),
                  e[0] == 'd'
                    ? this
                    : e[0] == 'w'
                      ? this.addDay(7 - getDayOfWeek(this.toDate(), this.c))
                      : e[0] == 'q'
                        ? (this.quarter(this.quarter()).addMonth(2),
                          (this.d.date = this.getDaysInMonth()),
                          this)
                        : ((this.d.date = this.getDaysInMonth()),
                          e == 'M' || e == 'month'
                            ? this
                            : ((this.d.month = 12),
                              (this.d.date = this.getDaysInMonth()),
                              e[0] == 'y' ? this : void 0)))))
    );
  }
  function time() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
      t[s] = arguments[s];
    if (!t.length) return this.toArray().slice(3);
    var r = [];
    return (
      (r = isPersianDate(t[0])
        ? t[0].time()
        : isDate(t[0])
          ? [
              t[0].getHours(),
              t[0].getMinutes(),
              t[0].getSeconds(),
              t[0].getMilliseconds(),
            ]
          : Object.prototype.toString.call(t[0]) === '[object Object]'
            ? [
                t[0].h || t[0].hour || t[0].hours || 0,
                t[0].m || t[0].minute || t[0].minutes || 0,
                t[0].s || t[0].second || t[0].seconds || 0,
                t[0].ms || t[0].millisecond || t[0].milliseconds || 0,
              ]
            : typesToArray.apply(void 0, [this.c].concat(t))),
      this.isValidTime.apply(this, _toConsumableArray(r))
        ? this.hour(r[0] || 0)
            .minute(r[1] || 0)
            .second(r[2] || 0)
            .millisecond(r[3] || 0)
        : 'زمان نامعتبر'
    );
  }
  var getDayOfYear = function (e, t, s, r) {
      for (t = +t, s = +s; --t != 0; ) s += getDaysInMonth(r, e, t);
      return s;
    },
    dayOfYearFormat = function (e) {
      return e[0] === 'j' ? 'jd' : 'd';
    },
    getWeekOfYear = function (e, t, s, r) {
      var n = this.clone().calendar(r).parse(e),
        i = n.date(dayOfYearFormat(r)),
        a = n.clone().parse(e, t, s);
      i > 3 && n.addDay(7 - i);
      var o = Math.ceil(a.diff(n, 'date', !0) / 7),
        l = a.clone().getWeeksInYear();
      return o > l ? l : o;
    },
    compare = function compare(date, operator) {
      return (
        (date = typesToArray.apply(
          void 0,
          [this.c].concat(_toConsumableArray(date)),
        )),
        !!this.isValid.apply(this, _toConsumableArray(date)) &&
          eval(
            'this.timestamp()' +
              operator +
              'this.clone().parse(...date).timestamp()',
          )
      );
    },
    mathOperation = function (e, t) {
      var s = this;
      if (!e.length) return !1;
      var r = _toConsumableArray(e),
        n = r.map(function (i) {
          var a;
          return (
            (i = typesToArray(s.c, i)),
            !!s.isValid.apply(s, _toConsumableArray(i)) &&
              (a = s.clone()).parse.apply(a, _toConsumableArray(i)).timestamp()
          );
        });
      return (
        !n.includes(!1) &&
        r[n.indexOf(Math[t].apply(Math, _toConsumableArray(n)))]
      );
    },
    isTimestamp = function (e) {
      return !isNaN(e) && Math.floor(e / 1e4) > 0;
    };
  function now() {
    var e = new Date();
    return (
      this.c == 'jalali'
        ? setJalaliDate.call(this, e)
        : setGregorianDate.call(this, e),
      this
    );
  }
  function parse() {
    return this.c == 'jalali'
      ? this.fromJalali.apply(this, arguments)
      : this.fromGregorian.apply(this, arguments);
  }
  function clone() {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      JSON.parse(JSON.stringify(this)),
    );
  }
  function fromJalali() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
      t[s] = arguments[s];
    return (
      (t = t.length
        ? typesToArray.apply(void 0, ['jalali'].concat(_toConsumableArray(t)))
        : gtj()),
      this.c == 'jalali'
        ? ((this.d.year = +t[0]),
          (this.d.month = +t[1] || 1),
          (this.d.date = +t[2] || 1),
          (this.d.hour = +t[3] || 0),
          (this.d.minute = +t[4] || 0),
          (this.d.second = +t[5] || 0),
          (this.d.millisecond = +t[6] || 0))
        : setGregorianDate.call(this, jtg.apply(void 0, _toConsumableArray(t))),
      this.isValid() ? this : invalid.call(this, 'تاریخ نامعتبر')
    );
  }
  function fromGregorian() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
      t[s] = arguments[s];
    if (
      (t.length
        ? this.isPersianDate(t[0])
          ? (t = t[0].clone().calendar('g').toArray())
          : isTimestamp(t[0]) ||
            (((t = typesToArray.apply(
              void 0,
              ['gregorian'].concat(_toConsumableArray(t)),
            ))[6] = +t[6] || 0),
            (t[5] = +t[5] || 0),
            (t[4] = +t[4] || 0),
            (t[3] = +t[3] || 0),
            (t[2] = +t[2] || 1),
            (t[1] = +t[1] || 1),
            (t[0] = +t[0]))
        : (t[0] = new Date().getTime()),
      t.length > 1)
    ) {
      if (!isValid.apply(void 0, ['gregorian'].concat(_toConsumableArray(t))))
        return invalid.call(this, 'تاریخ نامعتبر');
      --t[1];
    }
    return (t = _construct(Date, _toConsumableArray(t))) == 'Invalid Date'
      ? invalid.call(this, 'تاریخ نامعتبر')
      : (this.c == 'jalali'
          ? setJalaliDate.call(this, t)
          : setGregorianDate.call(this, t),
        this);
  }
  function calendar(e) {
    return e
      ? (e[0] == 'j' && this.c[0] != 'j'
          ? (this.error || setJalaliDate.call(this, this.toDate()),
            (this.c = 'jalali'))
          : e[0] == 'g' &&
            this.c[0] != 'g' &&
            (this.error || setGregorianDate.call(this, this.toDate()),
            (this.c = 'gregorian')),
        this)
      : this.c;
  }
  function addYear(e, t) {
    if (e < 0) return this.subYear(Math.abs(e));
    for (this.d.year += +e; t && !this.isValidDate(); ) this.subDay(1, !1);
    return this;
  }
  function addQuarter(e, t) {
    return e < 0 ? this.subQuarter(Math.abs(e)) : this.addMonth(3 * +e, t);
  }
  function addMonth(e, t) {
    if (e < 0) return this.subMonth(Math.abs(e));
    e = +e;
    var s = 12 - this.d.month + 1;
    if (s > e) this.d.month += e;
    else {
      for (this.addYear(1, !1), this.d.month = 1, e -= s; e >= 12; )
        ((e -= 12), this.addYear(1, !1));
      e != 0 && (this.d.month += e);
    }
    for (; t && !this.isValidDate(); ) this.subDay(1, !1);
    return this;
  }
  function addWeek(e, t) {
    return e < 0 ? this.subWeek(Math.abs(e)) : this.addDay(7 * +e, t);
  }
  function addDay(e) {
    if (e < 0) return this.subDay(Math.abs(e));
    e = +e;
    var t = this.getDaysInMonth() - this.d.date + 1;
    if (t > e) this.d.date += e;
    else {
      (this.addMonth(1, !1), (this.d.date = 1), (e -= t));
      for (var s = this.getDaysInMonth(); e >= s; )
        ((e -= s), this.addMonth(1, !1), (s = this.getDaysInMonth()));
      e != 0 && (this.d.date += e);
    }
    return this;
  }
  function addHour(e) {
    if (e < 0) return this.subHour(Math.abs(e));
    for (e = +e; e >= 24; ) ((e -= 24), this.addDay(1, !1));
    var t = 24 - this.d.hour;
    return (
      e >= t
        ? (this.addDay(1, !1), (e -= t), (this.d.hour = e))
        : (this.d.hour += e),
      this
    );
  }
  function addMinute(e) {
    if (e < 0) return this.subMinute(Math.abs(e));
    for (e = +e; e >= 60; ) (this.addHour(1, !1), (e -= 60));
    var t = 60 - this.d.minute;
    return (
      e >= t
        ? (this.addHour(1, !1), (e -= t), (this.d.minute = e))
        : (this.d.minute += e),
      this
    );
  }
  function addSecond(e) {
    if (e < 0) return this.subSecond(Math.abs(e));
    for (e = +e; e >= 60; ) (this.addMinute(1, !1), (e -= 60));
    var t = 60 - this.d.second;
    return (
      e >= t
        ? (this.addMinute(1, !1), (e -= t), (this.d.second = e))
        : (this.d.second += e),
      this
    );
  }
  function addMillisecond(e) {
    if (e < 0) return this.subMillisecond(Math.abs(e));
    for (e = +e; e >= 1e3; ) (this.addSecond(1, !1), (e -= 1e3));
    var t = 1e3 - this.d.millisecond;
    return (
      e >= t
        ? (this.addSecond(1, !1), (e -= t), (this.d.millisecond = e))
        : (this.d.millisecond += e),
      this
    );
  }
  function subYear(e, t) {
    for (this.d.year -= Math.abs(e); t && !this.isValidDate(); )
      this.subDay(1, !1);
    return this;
  }
  function subQuarter(e, t) {
    return ((e = Math.abs(e)), this.subMonth(3 * e, t));
  }
  function subMonth(e, t) {
    e = Math.abs(e);
    var s = this.d.month;
    if (s > e) this.d.month -= e;
    else {
      for (this.subYear(1, !1), this.d.month = 12, e -= s; e >= 12; )
        (this.subYear(1, !1), (e -= 12));
      e != 0 && (this.d.month -= e);
    }
    for (; t && !this.isValidDate(); ) this.subDay(1, !1);
    return this;
  }
  function subWeek(e, t) {
    return ((e = Math.abs(e)), this.subDay(7 * e, t));
  }
  function subDay(e) {
    e = Math.abs(e);
    var t = this.d.date;
    if (t > e) this.d.date -= e;
    else {
      this.subMonth(1, !1);
      var s = this.getDaysInMonth();
      for (this.d.date = s, e -= t; e >= s; )
        ((e -= s), this.subMonth(1, !1), (s = this.getDaysInMonth()));
      this.d.date = s - e;
    }
    return this;
  }
  function subHour(e) {
    for (e = Math.abs(e); e >= 24; ) ((e -= 24), this.subDay(1, !1));
    var t = this.d.hour;
    return (
      e > t
        ? (this.subDay(1, !1), (e -= t), (this.d.hour = 24 - e))
        : (this.d.hour -= e),
      this
    );
  }
  function subMinute(e) {
    for (e = Math.abs(e); e >= 60; ) ((e -= 60), this.subHour(1, !1));
    var t = this.d.minute;
    return (
      e > t
        ? (this.subHour(1, !1), (e -= t), (this.d.minute = 60 - e))
        : (this.d.minute -= e),
      this
    );
  }
  function subSecond(e) {
    for (e = Math.abs(e); e >= 60; ) ((e -= 60), this.subMinute(1, !1));
    var t = this.d.second;
    return (
      e > t
        ? (this.subMinute(1, !1), (e -= t), (this.d.second = 60 - e))
        : (this.d.second -= e),
      this
    );
  }
  function subMillisecond(e) {
    for (e = Math.abs(e); e >= 1e3; ) ((e -= 1e3), this.subSecond(1, !1));
    var t = this.d.millisecond;
    return (
      e > t
        ? (this.subSecond(1, !1), (e -= t), (this.d.millisecond = 1e3 - e))
        : (this.d.millisecond -= e),
      this
    );
  }
  var jalali$1 = function (e) {
      return e
        .replace(/\?/g, 'j')
        .replace(/datetime/gi, 'jYYYY/jMM/jDD HH:mm')
        .replace(/date/gi, 'jYYYY/jMM/jDD')
        .replace(/time/gi, 'HH:mm');
    },
    gregorian$1 = function (e) {
      return e
        .replace(/\?/g, '')
        .replace(/datetime/gi, 'YYYY-MM-DD HH:mm')
        .replace(/date/gi, 'YYYY-MM-DD')
        .replace(/time/gi, 'HH:mm');
    };
  function toString(e) {
    var t = [];
    ((e = e.replace(REGEX.betweenBacktick, function (o, l) {
      return (t.push(l), '###');
    })),
    this.c[0]) === 'j'
      ? (e = jalali$1(e))
      : (e = gregorian$1(e));
    var s,
      r = '',
      n = _createForOfIteratorHelper(e.match(REGEX.format));
    try {
      for (n.s(); !(s = n.n()).done; ) {
        var i = s.value;
        ((r += e.substring(0, e.indexOf(i))),
          i.search(/Y|y/) != -1
            ? (r += this.year(i))
            : i.search(/M/) != -1
              ? (r += this.month(i))
              : i.search(/Q/) != -1
                ? (r += this.quarter(i))
                : i.search(/D|d/) != -1
                  ? (r += this.date(i))
                  : i.search(/W|w/) != -1
                    ? (r += this.week(i))
                    : i.search(/H|h|k/) != -1
                      ? (r += this.hour(i))
                      : i.search(/m/) != -1
                        ? (r += this.minute(i))
                        : i.search(/s/) != -1
                          ? (r += this.second(i))
                          : i.search(/c|C/) != -1
                            ? (r += this.millisecond(i))
                            : i.search(/t/) != -1
                              ? (r += this.timestamp())
                              : i.search(/a|A/) != -1 &&
                                (r += TIMETYPE(this.d.hour, i)),
          (e = e.substr(e.indexOf(i) + i.length)));
      }
    } catch (o) {
      n.e(o);
    } finally {
      n.f();
    }
    r += e;
    for (var a = 0; a < t.length; a++) r = r.replace('###', t[a]);
    return String(r);
  }
  function toArray() {
    if (!arguments.length) return Object.values(this.d);
    var e = typesToArray.apply(
      void 0,
      [this.c].concat(Array.prototype.slice.call(arguments)),
    );
    return [
      this.year(e[0]),
      this.month(e[1]),
      this.date(e[2]),
      this.hour(e[3]),
      this.minute(e[4]),
      this.second(e[5]),
      this.millisecond(e[6]),
    ];
  }
  function toObject() {
    if (!arguments.length) return this.d;
    var e = typesToArray.apply(
      void 0,
      [this.c].concat(Array.prototype.slice.call(arguments)),
    );
    return {
      year: this.year(e[0]),
      month: this.month(e[1]),
      date: this.date(e[2]),
      hour: this.hour(e[3]),
      minute: this.minute(e[4]),
      second: this.second(e[5]),
      millisecond: this.millisecond(e[6]),
    };
  }
  var jalali = function (e) {
      return jtg.apply(void 0, _toConsumableArray(e));
    },
    gregorian = function (e) {
      return (--e[1], _construct(Date, _toConsumableArray(e)));
    };
  function toDate() {
    return this.c[0] === 'j'
      ? jalali(this.toArray())
      : gregorian(this.toArray());
  }
  function diff(e, t, s) {
    var r;
    if (
      ((e = typesToArray(this.c, e)),
      !this.isValid.apply(this, _toConsumableArray(e)))
    )
      return 'تاریخ نامعتبر';
    var n =
      this.timestamp() -
      (r = this.clone()).parse.apply(r, _toConsumableArray(e)).timestamp();
    switch (t) {
      case 'y':
      case 'year':
      case 'years':
        n = this.d.year - e[0];
        break;
      case 'M':
      case 'month':
      case 'months':
        n = 12 * this.d.year + this.d.month - (12 * +e[0] + +e[1]);
        break;
      case 'd':
      case 'date':
      case 'day':
      case 'days':
        n = Math.ceil(n / 1e3 / 60 / 60 / 24);
        break;
      case 'h':
      case 'hour':
      case 'hours':
        n = Math.ceil(n / 1e3 / 60 / 60);
        break;
      case 'm':
      case 'minute':
      case 'minutes':
        n = Math.ceil(n / 1e3 / 60);
        break;
      case 's':
      case 'second':
      case 'seconds':
        n = Math.ceil(n / 1e3);
    }
    return s ? n + (n >= 0 ? 1 : -1) : n;
  }
  function diffForHumans(e, t) {
    var s = this.diff(e, 's');
    if (typeof s == 'string') return 'تاریخ نامعتبر';
    var r = t && (s > 0 ? 'آینده' : 'پیش');
    return (s = Math.abs(s)) == 0
      ? 'هم اکنون'
      : (s =
          s < 45
            ? 'لحظات'
            : (s /= 60) < 45
              ? Math.round(s) + ' دقیقه'
              : (s /= 60) < 23.5
                ? Math.round(s) + ' ساعت'
                : (s /= 24) < 26
                  ? Math.round(s) + ' روز'
                  : s < 320
                    ? Math.round(s / 30) + ' ماه'
                    : Math.round(s / 365) + ' سال') + (t ? ' ' + r : '');
  }
  var PersianDate = function e(t, s) {
    ((this.d = {}),
      (this.c = 'jalali'),
      (e.prototype.now = function () {
        return (
          this.error && (delete this.error, (this.d = {})),
          now.call(this)
        );
      }),
      (e.prototype.setDate = function () {
        return (
          warn(`"setDate" function is deprecated! use "fromGregorian" function instead.
https://alireza-ab.ir/persian-date/create-and-parse#from-gregorian-date`),
          this.fromGregorian.apply(this, arguments)
        );
      }),
      (e.prototype.parse = function () {
        return parse.call.apply(
          parse,
          [this].concat(Array.prototype.slice.call(arguments)),
        );
      }),
      (e.prototype.clone = function () {
        return clone.call(this);
      }),
      (e.prototype.fromJalali = function () {
        return (
          this.error && (delete this.error, (this.d = {})),
          fromJalali.call.apply(
            fromJalali,
            [this].concat(Array.prototype.slice.call(arguments)),
          )
        );
      }),
      (e.prototype.fromGregorian = function () {
        return (
          this.error && (delete this.error, (this.d = {})),
          fromGregorian.call.apply(
            fromGregorian,
            [this].concat(Array.prototype.slice.call(arguments)),
          )
        );
      }),
      (e.prototype.calendar = function (r) {
        return calendar.call(this, r);
      }),
      (e.prototype.year = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : year.call(this, r);
      }),
      (e.prototype.month = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : month.call(this, r);
      }),
      (e.prototype.date = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : date.call(this, r);
      }),
      (e.prototype.quarter = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : quarter.call(this, r);
      }),
      (e.prototype.week = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : week.call(this, r);
      }),
      (e.prototype.hour = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'H';
        return this.error ? this.error : hour.call(this, r);
      }),
      (e.prototype.minute = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'm';
        return this.error ? this.error : minute.call(this, r);
      }),
      (e.prototype.second = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 's';
        return this.error ? this.error : second.call(this, r);
      }),
      (e.prototype.millisecond = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'c';
        return this.error ? this.error : millisecond.call(this, r);
      }),
      (e.prototype.timestamp = function (r) {
        return this.error ? this.error : timestamp.call(this, r);
      }),
      (e.prototype.valueOf = function () {
        return this.timestamp();
      }),
      (e.prototype.getDaysInMonth = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0
              ? arguments[0]
              : this.d.year,
          n =
            arguments.length > 1 && arguments[1] !== void 0
              ? arguments[1]
              : this.d.month;
        return this.error ? this.error : getDaysInMonth(this.c, r, n);
      }),
      (e.prototype.getWeeksInYear = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : this.d.year;
        return this.error ? this.error : getWeeksInYear.call(this, r);
      }),
      (e.prototype.startOf = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : 'year';
        return startOf.call(this, r);
      }),
      (e.prototype.endOf = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : 'year';
        return endOf.call(this, r);
      }),
      (e.prototype.time = function () {
        return this.error
          ? this.error
          : time.call.apply(
              time,
              [this].concat(Array.prototype.slice.call(arguments)),
            );
      }),
      (e.prototype.addYear = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addYear.call(this, r, n) : this;
      }),
      (e.prototype.addMonth = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addMonth.call(this, r, n) : this;
      }),
      (e.prototype.addDay = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addDay.call(this, r, n) : this;
      }),
      (e.prototype.addQuarter = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addQuarter.call(this, r, n) : this;
      }),
      (e.prototype.addWeek = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addWeek.call(this, r, n) : this;
      }),
      (e.prototype.addHour = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addHour.call(this, r, n) : this;
      }),
      (e.prototype.addMinute = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addMinute.call(this, r, n) : this;
      }),
      (e.prototype.addSecond = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? addSecond.call(this, r, n) : this;
      }),
      (e.prototype.addMillisecond = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error
          ? this.error
          : r
            ? addMillisecond.call(this, r, n)
            : this;
      }),
      (e.prototype.subYear = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subYear.call(this, r, n) : this;
      }),
      (e.prototype.subMonth = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subMonth.call(this, r, n) : this;
      }),
      (e.prototype.subDay = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subDay.call(this, r, n) : this;
      }),
      (e.prototype.subQuarter = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subQuarter.call(this, r, n) : this;
      }),
      (e.prototype.subWeek = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subWeek.call(this, r, n) : this;
      }),
      (e.prototype.subHour = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subHour.call(this, r, n) : this;
      }),
      (e.prototype.subMinute = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subMinute.call(this, r, n) : this;
      }),
      (e.prototype.subSecond = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : r ? subSecond.call(this, r, n) : this;
      }),
      (e.prototype.subMillisecond = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error
          ? this.error
          : r
            ? subMillisecond.call(this, r, n)
            : this;
      }),
      (e.prototype.toString = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : 'date';
        return this.error ? this.error : toString.call(this, r);
      }),
      (e.prototype.toArray = function () {
        return this.error
          ? this.error
          : toArray.call.apply(
              toArray,
              [this].concat(Array.prototype.slice.call(arguments)),
            );
      }),
      (e.prototype.toObject = function () {
        return this.error
          ? this.error
          : toObject.call.apply(
              toObject,
              [this].concat(Array.prototype.slice.call(arguments)),
            );
      }),
      (e.prototype.toDate = function () {
        return this.error ? this.error : toDate.call(this);
      }),
      (e.prototype.diff = function (r, n) {
        var i = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
        return this.error ? this.error : diff.call(this, r, n, i);
      }),
      (e.prototype.diffForHumans = function (r) {
        var n =
          !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : diffForHumans.call(this, r, n);
      }),
      (e.prototype.min = function () {
        return mathOperation.call(this, arguments, 'min');
      }),
      (e.prototype.max = function () {
        return mathOperation.call(this, arguments, 'max');
      }),
      (e.prototype.isLeapYear = function () {
        var r =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : this.d.year;
        return !this.error && isLeapYear(this.c, r);
      }),
      (e.prototype.isValid = function (r, n, i, a, o, l, d) {
        return (
          !this.error &&
          this.isValidDate(r, n, i) &&
          this.isValidTime(a, o, l, d)
        );
      }),
      (e.prototype.isValidDate = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0
              ? arguments[0]
              : this.d.year,
          n =
            arguments.length > 1 && arguments[1] !== void 0
              ? arguments[1]
              : this.d.month,
          i =
            arguments.length > 2 && arguments[2] !== void 0
              ? arguments[2]
              : this.d.date;
        return !this.error && isValidDate(this.c, r, n, i);
      }),
      (e.prototype.isValidTime = function () {
        var r =
            arguments.length > 0 && arguments[0] !== void 0
              ? arguments[0]
              : this.d.hour,
          n =
            arguments.length > 1 && arguments[1] !== void 0
              ? arguments[1]
              : this.d.minute,
          i =
            arguments.length > 2 && arguments[2] !== void 0
              ? arguments[2]
              : this.d.second,
          a =
            arguments.length > 3 && arguments[3] !== void 0
              ? arguments[3]
              : this.d.millisecond;
        return !this.error && isValidTime(r, n, i, a);
      }),
      (e.prototype.isSame = function () {
        return (
          !this.error &&
          isSame.call.apply(
            isSame,
            [this].concat(Array.prototype.slice.call(arguments)),
          )
        );
      }),
      (e.prototype.isBefore = function () {
        return !this.error && compare.call(this, arguments, '<');
      }),
      (e.prototype.isAfter = function () {
        return !this.error && compare.call(this, arguments, '>');
      }),
      (e.prototype.isSameOrBefore = function () {
        return !this.error && compare.call(this, arguments, '<=');
      }),
      (e.prototype.isSameOrAfter = function () {
        return !this.error && compare.call(this, arguments, '>=');
      }),
      (e.prototype.isBetween = function (r, n) {
        var i =
          arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '()';
        return !this.error && isBetween.call(this, r, n, i);
      }),
      (e.prototype.isInArray = function (r) {
        return !this.error && isInArray.call(this, r);
      }),
      (e.prototype.isDate = isDate),
      (e.prototype.isPersianDate = isPersianDate),
      s && this.calendar(s),
      t
        ? s && s[0] == 'j'
          ? this.fromJalali(t)
          : this.fromGregorian(t)
        : this.now());
  };
  return (
    (PersianDate.isLeapYear = isLeapYear),
    (PersianDate.isDate = isDate),
    (PersianDate.isPersianDate = isPersianDate),
    (PersianDate.isValid = isValid),
    (PersianDate.isValidDate = isValidDate),
    (PersianDate.isValidTime = isValidTime),
    (PersianDate.getDaysInMonth = getDaysInMonth),
    (PersianDate_min.exports = PersianDate),
    PersianDate_min.exports
  );
}
var PersianDate_minExports = requirePersianDate_min();
const PersianDate = getDefaultExportFromCjs(PersianDate_minExports),
  Core = {
    langs: {
      fa: {
        calendar: 'jalali',
        weekdays: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
        months: [
          'فروردین',
          'اردیبهشت',
          'خرداد',
          'تیر',
          'مرداد',
          'شهریور',
          'مهر',
          'آبان',
          'آذر',
          'دی',
          'بهمن',
          'اسفند',
        ],
        dir: { input: 'rtl', picker: 'rtl' },
        translations: {
          label: 'شمسی',
          text: 'تقویم شمسی',
          prevMonth: 'ماه قبل',
          nextMonth: 'ماه بعد',
          now: 'هم اکنون',
          submit: 'تایید',
          yesterday: 'دیروز',
          tomorrow: 'فردا',
          firstOfWeek: 'اول هفته',
          lastOfWeek: 'آخر هفته',
          thisWeek: 'این هفته',
          prevWeek: 'هفته قبل',
          nextWeek: 'هفته بعد',
          thisMonth: 'این ماه',
          oneHourAgo: 'یک ساعت قبل',
          oneHourLater: 'یک ساعت بعد',
          midnight: 'نیمه شب',
          midday: 'نیمروز',
          thisHour: 'این ساعت',
          prevHour: 'ساعت قبل',
          nextHour: 'ساعت بعد',
          allDay: 'تمام روز',
        },
        inputFormat: '',
        displayFormat: '',
      },
      en: {
        calendar: 'gregorian',
        weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        dir: { input: 'rtl', picker: 'ltr' },
        translations: {
          label: 'میلادی',
          text: 'Gregorian Calendar',
          prevMonth: 'Previous Month',
          nextMonth: 'Next Month',
          now: 'Now',
          submit: 'Submit',
          yesterday: 'Yesterday',
          tomorrow: 'Tomorrow',
          firstOfWeek: 'First of Week',
          lastOfWeek: 'Last of Week',
          thisWeek: 'This Week',
          prevWeek: 'Previous Week',
          nextWeek: 'Next Week',
          thisMonth: 'This Month',
          oneHourAgo: 'One Hour ago',
          oneHourLater: 'One Hour later',
          midnight: 'Midnight',
          midday: 'Midday',
          thisHour: 'This Hour',
          prevHour: 'Previous Hour',
          nextHour: 'Next Hour',
          allDay: 'All Day',
        },
        inputFormat: '',
        displayFormat: '',
      },
    },
    mergeObject: function (e, t) {
      const s = new Set(['__proto__', 'prototype', 'constructor']),
        r = (a) => {
          if (Object.prototype.toString.call(a) !== '[object Object]')
            return !1;
          const o = Object.getPrototypeOf(a);
          return o === Object.prototype || o === null;
        },
        n = (a) => {
          if (Array.isArray(a)) return a.map(n);
          if (!r(a)) return a;
          const o = {};
          for (const l of Object.keys(a)) s.has(l) || (o[l] = n(a[l]));
          return o;
        },
        i = n(e);
      if (!t) return i;
      for (const a of Object.keys(t)) {
        if (s.has(a)) continue;
        const o = t[a];
        r(i[a]) && r(o) ? (i[a] = this.mergeObject(i[a], o)) : (i[a] = n(o));
      }
      return i;
    },
    setStyles: function (e, t) {
      for (const s in e) t.style.setProperty('--' + s, e[s]);
    },
    setColor: function (e, t) {
      if (!e) return;
      let s = {};
      switch (e) {
        case 'red':
          s = {
            'primary-color': '#c7004c',
            'secondary-color': '#ffaaaa',
            'in-range-background': '#ffd2d2',
          };
          break;
        case 'pink':
          s = {
            'primary-color': '#e56ab3',
            'secondary-color': '#ef87be',
            'in-range-background': '#fcbcd7',
          };
          break;
        case 'orange':
          s = {
            'primary-color': '#ffa500',
            'secondary-color': '#ffbe47',
            'in-range-background': '#ffe0a6',
          };
          break;
        case 'green':
          s = {
            'primary-color': '#38a169',
            'secondary-color': '#89dda3',
            'in-range-background': '#c6f6d5',
          };
          break;
        case 'purple':
          s = {
            'primary-color': '#7825d0',
            'secondary-color': '#c196ed',
            'in-range-background': '#d4baf3',
          };
          break;
        case 'gray':
          s = {
            'primary-color': '#494848',
            'secondary-color': '#909090',
            'in-range-background': '#b4b4b4',
          };
          break;
      }
      this.setStyles(s, t);
    },
    getLastUnit: function (e, t) {
      switch (e.split(/[/ \-.,:\\]/).length + (t == 'time' ? 3 : 0)) {
        case 1:
          return 'year';
        case 2:
          return 'month';
        case 3:
          return 'date';
        case 4:
          return 'hour';
        case 5:
          return 'minute';
        case 6:
          return 'second';
        default:
          return 'millisecond';
      }
    },
    getShortcuts(e, t, s) {
      const r = () => e.clone();
      switch (t) {
        case 'date-single':
          return {
            [s.now]: [r()],
            [s.yesterday]: [r().subDay()],
            [s.tomorrow]: [r().addDay()],
            [s.firstOfWeek]: [r().startOf('week')],
            [s.lastOfWeek]: [r().endOf('week')],
          };
        case 'date-range':
          return {
            [s.thisWeek]: [r().startOf('week'), r().endOf('week')],
            [s.prevWeek]: [
              r().subWeek().startOf('week'),
              r().subWeek().endOf('week'),
            ],
            [s.nextWeek]: [
              r().addWeek().startOf('week'),
              r().addWeek().endOf('week'),
            ],
            [s.thisMonth]: [r().startOf('month'), r().endOf('month')],
            [s.prevMonth]: [
              r().subMonth().startOf('month'),
              r().subMonth().endOf('month'),
            ],
            [s.nextMonth]: [
              r().addMonth().startOf('month'),
              r().addMonth().endOf('month'),
            ],
          };
        case 'time-single':
          return {
            [s.now]: [r()],
            [s.oneHourAgo]: [r().subHour()],
            [s.oneHourLater]: [r().addHour()],
            [s.midnight]: [r().startOf('date')],
            [s.midday]: [r().time(12)],
          };
        case 'time-range':
          return {
            [s.thisHour]: [r().startOf('hour'), r().endOf('hour')],
            [s.prevHour]: [
              r().subHour().startOf('hour'),
              r().subHour().endOf('hour'),
            ],
            [s.nextHour]: [
              r().addHour().startOf('hour'),
              r().addHour().endOf('hour'),
            ],
            [s.allDay]: [r().startOf('date'), r().endOf('date')],
          };
        default:
          return {};
      }
    },
    isString: function (e) {
      return typeof e == 'string';
    },
    isNumber: function (e) {
      return typeof e == 'number';
    },
    isFunction: function (e) {
      return typeof e == 'function';
    },
    isPersianDate: function (e) {
      return PersianDate.isPersianDate(e);
    },
  };
Core.langs.ar = {
  ...Core.langs.en,
  calendar: 'gregorian',
  dir: { input: 'rtl', picker: 'rtl' },
  weekdays: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  translations: {
    ...Core.langs.en.translations,
    label: 'هجري',
    text: 'التقويم الهجري',
    prevMonth: 'الشهر السابق',
    nextMonth: 'الشهر التالي',
    now: 'الآن',
    submit: 'تأكيد',
  },
};
Core.langs.he = {
  ...Core.langs.en,
  calendar: 'hebrew',
  dir: { input: 'ltr', picker: 'ltr' },
  weekdays: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
  translations: {
    ...Core.langs.en.translations,
    label: 'עברי',
    text: 'לוח שנה עברי',
    prevMonth: 'חודש קודם',
    nextMonth: 'חודש הבא',
    now: 'היום',
    submit: 'אישור',
  },
};
Core.langs.th = {
  ...Core.langs.en,
  calendar: 'buddhist',
  dir: { input: 'ltr', picker: 'ltr' },
  weekdays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
  translations: {
    ...Core.langs.en.translations,
    label: 'พุทธศักราช',
    text: 'ปฏิทินพุทธศักราช',
    prevMonth: 'เดือนก่อน',
    nextMonth: 'เดือนถัดไป',
    now: 'วันนี้',
    submit: 'ยืนยัน',
  },
};
Core.langs.zh = {
  ...Core.langs.en,
  calendar: 'chinese',
  dir: { input: 'ltr', picker: 'ltr' },
  weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  translations: {
    ...Core.langs.en.translations,
    label: '农历',
    text: '中国农历',
    prevMonth: '上个月',
    nextMonth: '下个月',
    now: '今天',
    submit: '确定',
  },
};
const calendarNames = {
    gregorian: 'gregory',
    hijri: 'islamic-umalqura',
    hebrew: 'hebrew',
    buddhist: 'buddhist',
    chinese: 'chinese',
  },
  dayMilliseconds$1 = 864e5;
function parsePart(e) {
  return Number.parseInt(e || '0', 10);
}
function isHebrewLeapYear(e) {
  return (7 * e + 1) % 19 < 7;
}
function parseHebrewMonth(e, t) {
  const s = e || '',
    n = (
      isHebrewLeapYear(t)
        ? [
            'Tishri',
            'Heshvan',
            'Kislev',
            'Tevet',
            'Shevat',
            'Adar I',
            'Adar II',
            'Nisan',
            'Iyar',
            'Sivan',
            'Tamuz',
            'Av',
            'Elul',
          ]
        : [
            'Tishri',
            'Heshvan',
            'Kislev',
            'Tevet',
            'Shevat',
            'Adar',
            'Nisan',
            'Iyar',
            'Sivan',
            'Tamuz',
            'Av',
            'Elul',
          ]
    ).findIndex((i) => s.toLowerCase() === i.toLowerCase());
  return n >= 0 ? n + 1 : parsePart(e);
}
function parseChineseMonth(e) {
  const t = (e || '').toLowerCase().replace(/\s+/g, ' ').trim(),
    s = [
      'first month',
      'second month',
      'third month',
      'fourth month',
      'fifth month',
      'sixth month',
      'seventh month',
      'eighth month',
      'ninth month',
      'tenth month',
      'eleventh month',
      'twelfth month',
    ],
    r = t.endsWith('bis'),
    n = r ? t.slice(0, -3).trim() : t,
    i = s.indexOf(n);
  return { month: i >= 0 ? i + 1 : parsePart(e), leapMonth: r };
}
function sameDate(e, t) {
  return (
    e.year === t.year &&
    e.month === t.month &&
    e.day === t.day &&
    !!e.leapMonth == !!t.leapMonth
  );
}
function compareDateParts(e, t) {
  const s = [e.year, e.month, e.leapMonth ? 1 : 0, e.day],
    r = [t.year, t.month, t.leapMonth ? 1 : 0, t.day];
  for (let n = 0; n < s.length; n++)
    if (s[n] !== r[n]) return s[n] < r[n] ? -1 : 1;
  return 0;
}
function formatParts(e, t) {
  const s = Object.fromEntries(
      e.formatToParts(t).map(({ type: a, value: o }) => [a, o]),
    ),
    r = parsePart(s.year || s.relatedYear),
    n = e.resolvedOptions().calendar,
    i = n === 'chinese' ? parseChineseMonth(s.month) : void 0;
  return {
    year: r,
    month:
      n === 'hebrew'
        ? parseHebrewMonth(s.month, r)
        : i?.month || parsePart(s.month),
    day: parsePart(s.day),
    ...(i?.leapMonth ? { leapMonth: !0 } : {}),
    hour: t.getUTCHours(),
    minute: t.getUTCMinutes(),
    second: t.getUTCSeconds(),
    millisecond: t.getUTCMilliseconds(),
  };
}
function createFormatter(e) {
  const t = new Intl.DateTimeFormat(`en-u-ca-${e}-nu-latn`, {
    timeZone: 'UTC',
    year: 'numeric',
    month: e === 'chinese' ? 'long' : 'numeric',
    day: 'numeric',
  });
  if (t.resolvedOptions().calendar !== e)
    throw new Error(`Calendar is not supported by this runtime: ${e}`);
  return t;
}
function estimateGregorianYear(e, t) {
  switch (e) {
    case 'hijri':
      return Math.floor((t - 1) * 0.970224 + 622);
    case 'hebrew':
      return t - 3760;
    case 'buddhist':
      return t - 543;
    default:
      return t;
  }
}
function findGregorianDate(e, t, s) {
  const r = new Date(
      Date.UTC(
        estimateGregorianYear(t, s.year),
        Math.max(0, s.month - 1),
        Math.max(1, s.day),
      ),
    ),
    n = t === 'hijri' ? 900 : 450,
    i = r.getTime() - n * dayMilliseconds$1,
    a = r.getTime() + n * dayMilliseconds$1,
    o = formatParts(e, new Date(i)),
    l = formatParts(e, new Date(a));
  if (compareDateParts(o, s) > 0 || compareDateParts(l, s) < 0)
    throw new RangeError(
      `Unable to convert ${s.year}/${s.month}/${s.day} from ${t}`,
    );
  let d = i,
    c = a;
  for (; d <= c; ) {
    const f =
        d + Math.floor((c - d) / (2 * dayMilliseconds$1)) * dayMilliseconds$1,
      v = new Date(f),
      M = compareDateParts(formatParts(e, v), s);
    if (M === 0) return v;
    M < 0 ? (d = f + dayMilliseconds$1) : (c = f - dayMilliseconds$1);
  }
  throw new RangeError(
    `Unable to convert ${s.year}/${s.month}/${s.day} from ${t}`,
  );
}
function createIntlAdapter(e, t = 'ummalqura') {
  if (e === 'hijri' && t !== 'ummalqura')
    throw new Error(`Hijri provider is not implemented yet: ${t}`);
  const s = createFormatter(calendarNames[e]);
  return {
    id: e,
    ...(e === 'hijri' ? { provider: t } : {}),
    getParts(r) {
      return formatParts(s, r);
    },
    fromParts(r) {
      const n = findGregorianDate(s, e, r);
      return (
        n.setUTCHours(
          r.hour || 0,
          r.minute || 0,
          r.second || 0,
          r.millisecond || 0,
        ),
        n
      );
    },
    addDays(r, n) {
      return new Date(r.getTime() + n * dayMilliseconds$1);
    },
    addMonths(r, n) {
      const i = formatParts(s, r);
      let a = i.year,
        o = i.month;
      const l = (f) => (e === 'hebrew' && isHebrewLeapYear(f) ? 13 : 12),
        d = n < 0 ? -1 : 1;
      for (let f = 0; f < Math.abs(n); f++)
        ((o += d),
          o > l(a) ? ((o = 1), (a += 1)) : o < 1 && ((a -= 1), (o = l(a))));
      const c = Math.min(
        i.day,
        (() => {
          const f = findGregorianDate(s, e, { year: a, month: o, day: 1 });
          let v = 1;
          for (
            ;
            sameDate(
              formatParts(s, new Date(f.getTime() + v * dayMilliseconds$1)),
              { year: a, month: o, day: v + 1 },
            );

          )
            v += 1;
          return v;
        })(),
      );
      return findGregorianDate(s, e, { ...i, year: a, month: o, day: c });
    },
    daysInMonth(r, n) {
      const i = findGregorianDate(s, e, { year: r, month: n, day: 1 });
      let a = 1;
      for (
        ;
        sameDate(
          formatParts(s, new Date(i.getTime() + a * dayMilliseconds$1)),
          { year: r, month: n, day: a + 1 },
        );

      )
        a += 1;
      return a;
    },
  };
}
const dayMilliseconds = 864e5,
  islamicEpoch = 19484395e-1;
function islamicToJulianDay(e, t, s) {
  return (
    s +
    Math.ceil(29.5 * (t - 1)) +
    (e - 1) * 354 +
    Math.floor((3 + 11 * e) / 30) +
    islamicEpoch -
    1
  );
}
function julianDayToGregorian(e) {
  return new Date((e - 24405875e-1) * dayMilliseconds);
}
function gregorianToJulianDay(e) {
  return e.getTime() / dayMilliseconds + 24405875e-1;
}
function gregorianToIslamic(e) {
  const t = Math.floor(gregorianToJulianDay(e)) + 0.5,
    s = Math.floor((30 * (t - islamicEpoch) + 10646) / 10631),
    r = Math.min(
      12,
      Math.ceil((t - (29 + islamicToJulianDay(s, 1, 1))) / 29.5) + 1,
    ),
    n = Math.floor(t - islamicToJulianDay(s, r, 1) + 1);
  return {
    year: s,
    month: r,
    day: n,
    hour: e.getUTCHours(),
    minute: e.getUTCMinutes(),
    second: e.getUTCSeconds(),
    millisecond: e.getUTCMilliseconds(),
  };
}
function createTabularHijriAdapter() {
  return {
    id: 'hijri',
    provider: 'tabular',
    getParts: gregorianToIslamic,
    fromParts(e) {
      const t = julianDayToGregorian(
        islamicToJulianDay(e.year, e.month, e.day),
      );
      return (
        t.setUTCHours(
          e.hour || 0,
          e.minute || 0,
          e.second || 0,
          e.millisecond || 0,
        ),
        t
      );
    },
    addDays(e, t) {
      return new Date(e.getTime() + t * dayMilliseconds);
    },
    addMonths(e, t) {
      const s = gregorianToIslamic(e),
        r = s.year * 12 + s.month - 1 + t,
        n = Math.floor(r / 12),
        i = (((r % 12) + 12) % 12) + 1,
        a = i % 2 === 1 ? 30 : 29;
      return this.fromParts({
        ...s,
        year: n,
        month: i,
        day: Math.min(s.day, a),
      });
    },
    daysInMonth(e, t) {
      return t % 2 === 1
        ? 30
        : t !== 12
          ? 29
          : (e * 11 + 14) % 30 < 11
            ? 30
            : 29;
    },
  };
}
function createCalendarAdapter(e, t = {}) {
  return e === 'hijri' && t.hijriProvider === 'tabular'
    ? createTabularHijriAdapter()
    : createIntlAdapter(e, t.hijriProvider);
}
const _hoisted_1$3 = ['transform'],
  _sfc_main$4 = defineComponent({
    __name: 'PDPArrow',
    props: {
      direction: { default: 'up', type: String },
      inverse: { default: !1, type: Boolean },
    },
    setup(e) {
      const t = e,
        { direction: s, inverse: r } = toRefs(t),
        n = computed(
          () =>
            `rotate(${{ up: -90, down: 90, right: 0, left: 180 }[s.value] + (r.value ? 180 : 0)} 0 0)`,
        );
      return (i, a) => (
        openBlock(),
        createElementBlock(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            viewBox:
              '314.6749267578125 199.97494506835938 370.62506103515625 600.050048828125',
            transform: n.value,
          },
          [
            ...(a[0] ||
              (a[0] = [
                createBaseVNode('metadata', null, 'Arrow icon', -1),
                createBaseVNode(
                  'path',
                  {
                    d: 'M419.9 785.6l251.10000000000002-251c9.600000000000023-9.600000000000023 14.299999999999955-22.100000000000023 14.299999999999955-34.60000000000002s-4.7999999999999545-25.100000000000023-14.299999999999955-34.60000000000002l-251.10000000000002-251.09999999999997c-19.099999999999966-19.100000000000023-50.099999999999966-19.100000000000023-69.29999999999995 0l-21.600000000000023 21.599999999999994c-19.100000000000023 19.099999999999994-19.100000000000023 50.099999999999994 0 69.29999999999998l160.2 160.2c9.600000000000023 9.600000000000023 14.300000000000011 22.100000000000023 14.300000000000011 34.60000000000002s-4.800000000000011 25.100000000000023-14.300000000000011 34.60000000000002l-160.2 160.29999999999995c-19.100000000000023 19.100000000000023-19.100000000000023 50.10000000000002 0 69.30000000000007l21.600000000000023 21.59999999999991c19.19999999999999 19 50.19999999999999 19 69.29999999999995-0.1999999999999318z',
                  },
                  null,
                  -1,
                ),
              ])),
          ],
          8,
          _hoisted_1$3,
        )
      );
    },
  }),
  __default__ = { inheritAttrs: !1 },
  _sfc_main$3 = defineComponent({
    ...__default__,
    __name: 'PDPIcon',
    props: { icon: { type: String, required: !0 } },
    setup(e) {
      const t = e,
        { icon: s } = toRefs(t);
      return (r, n) =>
        unref(s) === 'clear'
          ? (openBlock(),
            createElementBlock(
              'svg',
              mergeProps(
                {
                  key: 0,
                  viewBox: '0 0 512 512',
                  width: '1rem',
                  xmlns: 'http://www.w3.org/2000/svg',
                },
                r.$attrs,
              ),
              [
                ...(n[0] ||
                  (n[0] = [
                    createBaseVNode('metadata', null, 'Clear icon', -1),
                    createBaseVNode(
                      'path',
                      {
                        d: 'M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z',
                      },
                      null,
                      -1,
                    ),
                  ])),
              ],
              16,
            ))
          : unref(s) === 'date'
            ? (openBlock(),
              createElementBlock(
                'svg',
                mergeProps(
                  {
                    key: 1,
                    version: '1.1',
                    viewBox:
                      '20.711000442504883 19.33300018310547 51.29999542236328 53.48200225830078',
                    xmlns: 'http://www.w3.org/2000/svg',
                  },
                  r.$attrs,
                  { 'xmlns:xlink': 'http://www.w3.org/1999/xlink' },
                ),
                [
                  ...(n[1] ||
                    (n[1] = [
                      createStaticVNode(
                        '<metadata>Calendar icon</metadata><g><path d="M30.35,19.333v2.76h-9.639V32.79v3.4v36.625h44.781c3.595,0,6.519-2.926,6.519-6.52V36.19v-3.4V22.093h-9.64v-2.76h-3.399   v2.76H48.061v-2.76h-3.399v2.76H33.75v-2.76H30.35z M68.61,66.296c0,1.719-1.398,3.119-3.118,3.119H24.111V36.19H68.61V66.296z    M44.661,25.493v2.906h3.399v-2.906h10.911v2.906h3.399v-2.906h6.239v7.297H24.111v-7.297h6.239v2.906h3.4v-2.906H44.661z"></path><path d="M38.073,40.157H27.448v10.625h10.625V40.157z M34.673,47.382h-3.825v-3.824h3.825V47.382z"></path><path d="M51.673,40.157H41.048v10.625h10.625V40.157z M48.273,47.382h-3.825v-3.824h3.825V47.382z"></path><path d="M65.273,40.157H54.648v10.625h10.625V40.157z M61.873,47.382h-3.825v-3.824h3.825V47.382z"></path><path d="M38.073,54.476H27.448v10.625h10.625V54.476z M34.673,61.7h-3.825v-3.826h3.825V61.7z"></path><path d="M51.673,54.476H41.048v10.625h10.625V54.476z M48.273,61.7h-3.825v-3.826h3.825V61.7z"></path><path d="M65.273,54.476H54.648v10.625h10.625V54.476z M61.873,61.7h-3.825v-3.826h3.825V61.7z"></path></g>',
                        2,
                      ),
                    ])),
                ],
                16,
              ))
            : unref(s) === 'datetime'
              ? (openBlock(),
                createElementBlock(
                  'svg',
                  mergeProps(
                    {
                      key: 2,
                      'xmlns:svg': 'http://www.w3.org/2000/svg',
                      xmlns: 'http://www.w3.org/2000/svg',
                    },
                    r.$attrs,
                    {
                      viewBox:
                        '7.146755218505859 47.93895721435547 195.70648193359375 201.1220703125',
                      version: '1.1',
                    },
                  ),
                  [
                    ...(n[2] ||
                      (n[2] = [
                        createBaseVNode(
                          'metadata',
                          null,
                          'Calendar And Clock Icon',
                          -1,
                        ),
                        createBaseVNode(
                          'g',
                          {
                            id: 'g915',
                            'inkscape:label': 'calendar',
                            'inkscape:groupmode': 'layer',
                            style: { display: 'inline' },
                          },
                          [
                            createBaseVNode(
                              'g',
                              {
                                id: 'g907',
                                transform:
                                  'matrix(3.2971191,0,0,3.2971191,-61.13988,-15.80425)',
                              },
                              [
                                createBaseVNode('path', {
                                  id: 'path893',
                                  d: 'm 30.35,19.333 v 2.76 h -9.639 v 10.697 3.4 36.625 h 44.781 c 3.595,0 6.519,-2.926 6.519,-6.52 V 36.19 32.79 22.093 h -9.64 v -2.76 h -3.399 v 2.76 H 48.061 v -2.76 h -3.399 v 2.76 H 33.75 v -2.76 z m 38.26,46.963 c 0,1.719 -1.398,3.119 -3.118,3.119 H 24.111 V 36.19 H 68.61 Z M 44.661,25.493 v 2.906 h 3.399 v -2.906 h 10.911 v 2.906 h 3.399 v -2.906 h 6.239 V 32.79 H 24.111 v -7.297 h 6.239 v 2.906 h 3.4 v -2.906 z',
                                }),
                                createBaseVNode('path', {
                                  id: 'path895',
                                  d: 'M 38.073,40.157 H 27.448 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z',
                                }),
                                createBaseVNode('path', {
                                  id: 'path897',
                                  d: 'M 51.673,40.157 H 41.048 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z',
                                }),
                                createBaseVNode('path', {
                                  id: 'path899',
                                  d: 'M 65.273,40.157 H 54.648 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z',
                                }),
                                createBaseVNode('path', {
                                  id: 'path901',
                                  d: 'M 38.073,54.476 H 27.448 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z',
                                }),
                                createBaseVNode('path', {
                                  id: 'path903',
                                  d: 'M 51.673,54.476 H 41.048 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z',
                                }),
                                createBaseVNode('path', {
                                  id: 'path905',
                                  d: 'M 65.273,54.476 H 54.648 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z',
                                }),
                              ],
                            ),
                          ],
                          -1,
                        ),
                        createBaseVNode(
                          'g',
                          { 'inkscape:groupmode': 'layer' },
                          [
                            createBaseVNode('circle', {
                              id: 'path918',
                              style: {
                                fill: '#ffffff',
                                'fill-opacity': '1',
                                'stroke-width': '2.46968',
                              },
                              cx: '156.58038',
                              cy: '201.26753',
                              r: '44.96637',
                            }),
                          ],
                          -1,
                        ),
                        createBaseVNode(
                          'g',
                          { 'inkscape:groupmode': 'layer' },
                          [
                            createBaseVNode(
                              'g',
                              {
                                id: 'g932',
                                style: {
                                  'clip-rule': 'evenodd',
                                  'fill-rule': 'evenodd',
                                },
                                transform:
                                  'matrix(3.8598712,0,0,3.8598712,110.21634,156.42414)',
                              },
                              [
                                createBaseVNode('path', {
                                  id: 'path921',
                                  d: 'M 12,0 C 18.623,0 24,5.377 24,12 24,18.623 18.623,24 12,24 5.377,24 0,18.623 0,12 0,5.377 5.377,0 12,0 Z m 0,1 C 18.071,1 23,5.929 23,12 23,18.071 18.071,23 12,23 5.929,23 1,18.071 1,12 1,5.929 5.929,1 12,1 Z m 0,11 h 6 v 1 H 11 V 4 h 1 z',
                                }),
                              ],
                            ),
                          ],
                          -1,
                        ),
                      ])),
                  ],
                  16,
                ))
              : unref(s) === 'time'
                ? (openBlock(),
                  createElementBlock(
                    'svg',
                    mergeProps(
                      { key: 3, xmlns: 'http://www.w3.org/2000/svg' },
                      r.$attrs,
                      {
                        'fill-rule': 'evenodd',
                        'clip-rule': 'evenodd',
                        viewBox: '0 0 24 24',
                      },
                    ),
                    [
                      ...(n[3] ||
                        (n[3] = [
                          createBaseVNode('metadata', null, 'Clock Icon', -1),
                          createBaseVNode(
                            'path',
                            {
                              d: 'M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z',
                            },
                            null,
                            -1,
                          ),
                        ])),
                    ],
                    16,
                  ))
                : createCommentVNode('', !0);
    },
  }),
  _hoisted_1$2 = ['name', 'value'],
  _hoisted_2$2 = ['name', 'value'],
  _sfc_main$2 = defineComponent({
    __name: 'PDPAlt',
    props: {
      name: { type: String, required: !0 },
      format: { type: String, required: !0 },
      dates: { type: Array, required: !0 },
    },
    setup(e) {
      return (t, s) =>
        e.name.endsWith('[]')
          ? (openBlock(!0),
            createElementBlock(
              Fragment,
              { key: 0 },
              renderList(
                e.dates,
                (r, n) => (
                  openBlock(),
                  createElementBlock(
                    'input',
                    {
                      key: n,
                      type: 'hidden',
                      name: e.name,
                      value: r.toString(e.format),
                    },
                    null,
                    8,
                    _hoisted_1$2,
                  )
                ),
              ),
              128,
            ))
          : (openBlock(),
            createElementBlock(
              'input',
              {
                key: 1,
                type: 'hidden',
                name: e.name,
                value: e.dates.map((r) => r.toString(e.format)),
              },
              null,
              8,
              _hoisted_2$2,
            ));
    },
  }),
  isClient = typeof window < 'u',
  jalaliDisableFormats = {
    date: 'jYYYY/jM/jD',
    datetime: 'jYYYY/jM/jD H:m',
    time: 'H:m',
  },
  _sfc_main$1 = defineComponent({
    components: {
      PDPArrow: _sfc_main$4,
      PDPIcon: _sfc_main$3,
      PDPAlt: _sfc_main$2,
    },
    inheritAttrs: !1,
    props: {
      format: { type: String },
      inputFormat: { type: String },
      inputMask: { type: [String, Object] },
      displayFormat: { type: String },
      type: {
        type: String,
        default: 'date',
        validator: (e) => ['date', 'time', 'datetime'].includes(e),
      },
      from: { type: String, default: (e) => (e.type === 'time' ? '' : '1300') },
      to: {
        type: String,
        default: (e) => (e.type === 'time' ? '23:59' : '1499'),
      },
      show: { default: !1, type: Boolean },
      clickOn: {
        default: 'all',
        type: String,
        validator: (e) => ['all', 'input', 'icon', 'none'].includes(e),
      },
      modal: { default: !1, type: Boolean },
      label: { type: String },
      column: { default: () => ({ 576: 1 }), type: [Number, Object] },
      minuteStep: { default: () => 1, type: [Number] },
      hourStep: { default: () => 1, type: [Number] },
      autoSubmit: { default: !0, type: Boolean },
      mode: {
        default: 'range',
        type: String,
        validator: (e) => ['single', 'range'].includes(e),
      },
      locale: { default: void 0, type: String },
      calendar: {
        type: String,
        validator: (e) =>
          [
            'jalali',
            'gregorian',
            'hijri',
            'hebrew',
            'buddhist',
            'chinese',
          ].includes(e),
      },
      modelCalendar: {
        type: String,
        default: 'active',
        validator: (e) =>
          e === 'active' ||
          [
            'jalali',
            'gregorian',
            'hijri',
            'hebrew',
            'buddhist',
            'chinese',
          ].includes(e),
      },
      weekStartsOn: { type: [Number, String], default: 'auto' },
      weekendDays: { type: Array },
      hijriProvider: {
        type: String,
        default: 'ummalqura',
        validator: (e) => ['ummalqura', 'tabular'].includes(e),
      },
      clearable: { default: !1, type: Boolean },
      disable: { type: [Array, String, Function, RegExp] },
      localeConfig: { type: Object },
      styles: { type: Object },
      color: {
        type: String,
        validator: (e) =>
          ['blue', 'red', 'pink', 'orange', 'green', 'purple', 'gray'].includes(
            e,
          ),
      },
      dualInput: { type: Boolean, default: !1 },
      iconInside: { type: Boolean, default: !1 },
      shortcut: { type: [Boolean, Object], default: !1 },
    },
    emits: ['open', 'close', 'select', 'submit', 'clear', 'update:modelValue'],
    data() {
      return {
        core: new PersianDate(),
        onDisplay: void 0,
        fromDate: void 0,
        toDate: void 0,
        selectedDates: [],
        selectedTimes: [],
        showDatePicker: !1,
        showYearSelect: !1,
        showMonthSelect: !1,
        showTopOfInput: !1,
        displayValue: [],
        inputName: 'firstInput',
        pickerPlace: {},
        documentWidth: isClient ? window.innerWidth : 1 / 0,
        langs: Core.langs,
        currentLocale: (
          this.locale || this.defaultLocaleForCalendar(this.calendar)
        ).split(',')[0],
        interval: null,
        resizeHandler: null,
        submitedValue: [],
      };
    },
    computed: {
      lang() {
        return this.langs[this.currentLocale] || this.langs.en;
      },
      effectiveLocale() {
        return this.locale || this.defaultLocaleForCalendar(this.calendar);
      },
      activeCalendar() {
        return this.calendar || this.lang.calendar;
      },
      calendarLang() {
        return this.lang;
      },
      calendarWeekStart() {
        if (this.weekStartsOn !== 'auto') return Number(this.weekStartsOn);
        switch (this.activeCalendar) {
          case 'jalali':
          case 'hijri':
            return 6;
          default:
            return 0;
        }
      },
      calendarWeekendDays() {
        if (this.weekendDays) return this.weekendDays;
        switch (this.activeCalendar) {
          case 'jalali':
            return [5];
          case 'hijri':
            return [5, 6];
          case 'hebrew':
            return [6];
          default:
            return [0, 6];
        }
      },
      orderedWeekdays() {
        const e = this.calendarLang.weekdays,
          t = this.currentLocale === 'fa' ? 6 : 0;
        return Array.from(
          { length: 7 },
          (s, r) => e[(this.calendarWeekStart - t + r + 7) % 7],
        );
      },
      calendarMonthNames() {
        const e = this.onDisplay
          ? this.getCalendarParts(this.onDisplay).year
          : void 0;
        return this.monthNamesForYear(e);
      },
      calendarAdapter() {
        if (
          !(
            this.activeCalendar === 'jalali' ||
            this.activeCalendar === 'gregorian'
          )
        )
          return createCalendarAdapter(this.activeCalendar, {
            hijriProvider: this.hijriProvider,
          });
      },
      attrs() {
        const e = {
          div: { class: 'pdp-group' },
          label: { class: 'pdp-label' },
          alt: {},
          picker: { class: 'pdp-picker' },
          firstInput: { class: 'pdp-input' },
          secondInput: { class: 'pdp-input' },
        };
        for (const t in this.$attrs)
          try {
            const [, s, r] = t.match(
              /(div|label|alt|picker|firstInput|secondInput)-(.*)/,
            );
            e[s][r] = this.$attrs[t];
          } catch {
            e.firstInput[t] = this.$attrs[t];
          }
        return (
          (e.picker.class = [
            e.picker.class,
            {
              'pdp-top': this.pickerPlace.top,
              'pdp-left': this.pickerPlace.left,
              'pdp-right': this.pickerPlace.right,
            },
            this.lang.dir.picker,
          ]),
          this.mode == 'single' &&
            this.dualInput &&
            (e.secondInput.disabled = 'disabled'),
          this.showDatePicker && (e[this.inputName].class += ' pdp-focus'),
          e
        );
      },
      altDates() {
        return this.submitedValue;
      },
      displayDate() {
        return this.onDisplay || this.core;
      },
      years() {
        let e = this.displayYear(this.fromDate);
        const t = this.displayYear(this.toDate);
        return Array(t - e + 1)
          .fill(null)
          .map(() => e++);
      },
      columnCount() {
        let e = 2;
        if (Core.isNumber(this.column)) e = this.column;
        else {
          const t = Object.keys(this.column)
            .sort((s, r) => +s - +r)
            .find((s) => this.documentWidth <= +s);
          t && (e = this.column[t]);
        }
        if (this.type.includes('time')) {
          const t = e / (this.mode == 'single' ? 1 : 2);
          this.$refs.root.style.setProperty(
            '--time-scale',
            (t > 1 ? t : 1) + '',
          );
        }
        return e;
      },
      minuteStepCount() {
        let e = 1;
        return (Core.isNumber(this.minuteStep) && (e = this.minuteStep), e);
      },
      hourStepCount() {
        let e = 1;
        return (Core.isNumber(this.hourStep) && (e = this.hourStep), e);
      },
      monthDays() {
        const e = [];
        for (let t = 0; t < this.columnCount; t++) {
          let s;
          const r = this.calendarMonthDate(this.onDisplay, t),
            n = this.getCalendarParts(r),
            i = n.year,
            a = n.month,
            o = this.calendarDayDate(r, 1);
          s = this.calendarWeekdayOffset(o);
          let l = this.calendarDaysInMonth(i, a);
          const d = Math.ceil((l + s) / 7),
            c = [];
          let f = 1;
          for (let v = 0; v < d; v++) {
            c[v] = [];
            for (let M = 0; M < 7; M++)
              if (s) ((c[v][M] = { empty: !0 }), --s);
              else if (l) {
                const P = this.calendarDayDate(r, f);
                ((c[v][M] = {
                  friday: this.calendarWeekendDays.includes(
                    new Date(this.getDateTimestamp(P)).getUTCDay(),
                  ),
                  weekend: this.calendarWeekendDays.includes(
                    new Date(this.getDateTimestamp(P)).getUTCDay(),
                  ),
                  raw: P,
                  startRange:
                    this.selectedDates[0] &&
                    this.isSameCalendarDate(this.selectedDates[0], P),
                  endRange:
                    this.selectedDates[1] &&
                    this.isSameCalendarDate(this.selectedDates[1], P),
                  inRange:
                    this.selectedDates.length == 2 &&
                    this.isBetweenSelectedDates(P),
                  disabled: !this.checkDate(P, 'date') || this.isInDisable(P),
                  today: this.isToday(P),
                  val: f++,
                }),
                  --l);
              } else c[v][M] = { empty: !0 };
          }
          e.push(c);
        }
        return e;
      },
      months() {
        const e = {},
          t =
            this.activeCalendar === 'hebrew'
              ? this.calendarMonthNames.length
              : 12;
        for (let s = 1; s <= t; s++)
          e[s] = {
            label: this.calendarMonthNames[s - 1] || `Month ${s}`,
            selected: this.displayMonth(this.onDisplay) == s,
            disabled: !this.checkDate(
              this.calendarMonthDate(
                this.onDisplay,
                s - this.displayMonth(this.onDisplay),
              ),
              'month',
            ),
          };
        return e;
      },
      nextLocale() {
        const e = this.effectiveLocale.split(','),
          t = e.indexOf(this.currentLocale),
          s = e[t + 1] || e[0];
        return this.langs[s].translations.label;
      },
      formats() {
        const e = {
            date: '?D ?MMMM',
            datetime: '?D ?MMMM HH:mm',
            time: 'HH:mm',
          },
          t = {
            date: 'YYYY-MM-DD',
            datetime: 'YYYY-MM-DD HH:mm',
            time: 'HH:mm',
          };
        return {
          model: this.format || t[this.type],
          input:
            this.inputFormat ||
            this.lang.inputFormat ||
            (this.calendarAdapter ? t[this.type] : this.type),
          display:
            this.displayFormat || this.lang.displayFormat || e[this.type],
          alt: this.attrs.alt.format || this.format || t[this.type],
        };
      },
      defaultDate() {
        const e =
          this.type === 'time' ? this.core.toString('jYYYY/jMM/jDD') + ' ' : '';
        return { from: e + this.from, to: e + this.to };
      },
      inputs() {
        return this.dualInput ? ['firstInput', 'secondInput'] : ['firstInput'];
      },
      tabIndex() {
        return (
          +(this.attrs.secondInput.tabindex || this.attrs.firstInput.tabindex) +
            1 || void 0
        );
      },
      shortcuts() {
        if (!this.shortcut) return !1;
        const e = {},
          t = this.type.includes('date') ? 'date' : 'time';
        let s = this.core.clone().now();
        t == 'time' &&
          !this.validate(s, t) &&
          (s = this.toDate.clone().subDay().now());
        const r = (i) =>
            this.mode === 'single'
              ? this.validate(i[0], t)
              : i.some((a) => this.validate(a, t)) &&
                !this.isDisableBetween(...i),
          n = (i, a = !1) => {
            for (const o in i) {
              const l = a
                ? i[o].map((d) =>
                    t == 'date' ? s.clone().fromJalali(d) : s.clone().time(d),
                  )
                : i[o];
              r(l) &&
                (e[o] =
                  this.type == 'date' ? l.map((d) => d.startOf('date')) : l);
            }
          };
        return (
          this.shortcut === !0
            ? n(
                Core.getShortcuts(
                  s,
                  `${t}-${this.mode}`,
                  this.lang.translations,
                ),
              )
            : n(this.shortcut, !0),
          e
        );
      },
    },
    watch: {
      show: {
        handler: function (e) {
          this.showDatePicker = e;
        },
      },
      calendar: {
        handler: function (e) {
          this.locale ||
            (this.currentLocale = this.defaultLocaleForCalendar(e));
        },
      },
      showDatePicker: {
        handler: function (e) {
          e
            ? this.$emit('open')
            : (this.modal ||
                document.removeEventListener('scroll', this.locate),
              this.$emit('close'));
        },
      },
      from: {
        handler: function (e) {
          this.fromDate = this.parseCalendarDate(e);
        },
      },
      to: {
        handler: function (e) {
          this.toDate = this.normalizeEndDate(
            this.parseCalendarDate(e),
            Core.getLastUnit(this.to, this.type),
          );
        },
      },
      mode: {
        handler: function (e) {
          e == 'single' &&
            this.selectedDates.length == 2 &&
            this.selectedDates.pop();
        },
      },
      locale: {
        handler: function (e, t) {
          const s = e || this.defaultLocaleForCalendar(this.calendar),
            n = (t || this.effectiveLocale)
              .split(',')
              .indexOf(this.currentLocale);
          ((this.currentLocale = s.split(',')[n] || s.split(',')[0]),
            this.langs[this.currentLocale] || (this.currentLocale = 'en'));
        },
      },
      localeConfig: {
        handler: function (e) {
          this.langs = Core.mergeObject(this.langs, e);
        },
        deep: !0,
      },
      styles: {
        handler: function (e) {
          Core.setStyles(e, this.$refs.root);
        },
        deep: !0,
      },
      color: {
        handler: function (e) {
          Core.setColor(e, this.$refs.root);
        },
      },
    },
    beforeMount() {
      this.langs = Core.mergeObject(this.langs, this.localeConfig);
    },
    mounted() {
      (Core.setColor(this.color, this.$refs.root),
        Core.setStyles(this.styles, this.$refs.root));
      const e = this.activeCalendar,
        t = this.calendarAdapter ? 'gregorian' : e;
      ((this.fromDate = this.parseCalendarDate(this.defaultDate.from)),
        (this.toDate = this.normalizeEndDate(
          this.parseCalendarDate(this.defaultDate.to),
          Core.getLastUnit(this.to, this.type),
        ).calendar(t)),
        this.core.calendar(t));
      const s = this.$attrs.modelValue;
      if (s) this.setDate(s);
      else {
        const r = this.core.clone();
        (this.type == 'date' && r.startOf('date'),
          this.checkDate(r, 'date')
            ? (this.onDisplay = r)
            : (this.onDisplay = this.nearestDate(r).startOf('date')));
      }
      ((this.resizeHandler = () => {
        this.documentWidth = window.innerWidth;
      }),
        window.addEventListener('resize', this.resizeHandler),
        this.type != 'date' && this.onDisplay.time(this.core),
        (this.showDatePicker = this.show));
    },
    beforeUnmount() {
      (this.resizeHandler &&
        (window.removeEventListener('resize', this.resizeHandler),
        (this.resizeHandler = null)),
        document.removeEventListener('scroll', this.locate),
        this.$refs.pdpMain &&
          this.$refs.pdpMain.removeEventListener(
            'mouseover',
            this.selectInRangeDate,
          ),
        this.stopChangeTime());
    },
    methods: {
      defaultLocaleForCalendar(e) {
        switch (e) {
          case 'jalali':
            return 'fa';
          case 'hijri':
            return 'ar';
          case 'hebrew':
            return 'he';
          case 'buddhist':
            return 'th';
          case 'chinese':
            return 'zh';
          case 'gregorian':
            return 'en';
          default:
            return 'fa';
        }
      },
      isHebrewLeapYear(e) {
        return (7 * e + 1) % 19 < 7;
      },
      monthNamesForYear(e) {
        if (this.activeCalendar === 'jalali') return this.lang.months;
        const t = {
          hijri:
            this.currentLocale === 'ar'
              ? [
                  'محرم',
                  'صفر',
                  'ربيع الأول',
                  'ربيع الثاني',
                  'جمادى الأولى',
                  'جمادى الثانية',
                  'رجب',
                  'شعبان',
                  'رمضان',
                  'شوال',
                  'ذو القعدة',
                  'ذو الحجة',
                ]
              : [
                  'Muharram',
                  'Safar',
                  'Rabi al-awwal',
                  'Rabi al-thani',
                  'Jumada al-awwal',
                  'Jumada al-thani',
                  'Rajab',
                  'Sha’ban',
                  'Ramadan',
                  'Shawwal',
                  'Dhu al-Qadah',
                  'Dhu al-Hijjah',
                ],
          hebrew: this.isHebrewLeapYear(e || 5785)
            ? this.currentLocale === 'he'
              ? [
                  'תשרי',
                  'חשוון',
                  'כסלו',
                  'טבת',
                  'שבט',
                  'אדר א׳',
                  'אדר',
                  'ניסן',
                  'אייר',
                  'סיוון',
                  'תמוז',
                  'אב',
                  'אלול',
                ]
              : [
                  'Tishri',
                  'Cheshvan',
                  'Kislev',
                  'Tevet',
                  'Shevat',
                  'Adar I',
                  'Adar II',
                  'Nisan',
                  'Iyar',
                  'Sivan',
                  'Tammuz',
                  'Av',
                  'Elul',
                ]
            : this.currentLocale === 'he'
              ? [
                  'תשרי',
                  'חשוון',
                  'כסלו',
                  'טבת',
                  'שבט',
                  'אדר',
                  'ניסן',
                  'אייר',
                  'סיוון',
                  'תמוז',
                  'אב',
                  'אלול',
                ]
              : [
                  'Tishri',
                  'Cheshvan',
                  'Kislev',
                  'Tevet',
                  'Shevat',
                  'Adar',
                  'Nisan',
                  'Iyar',
                  'Sivan',
                  'Tammuz',
                  'Av',
                  'Elul',
                ],
        };
        if (this.activeCalendar === 'hijri') return t.hijri;
        if (this.activeCalendar === 'chinese') {
          if (this.currentLocale === 'zh')
            return [
              '正月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '冬月',
              '腊月',
            ];
          const l =
            this.currentLocale === 'fa'
              ? 'ماه'
              : this.currentLocale === 'ar'
                ? 'الشهر'
                : 'Month';
          return Array.from({ length: 12 }, (d, c) => `${l} ${c + 1}`);
        }
        const s = this.activeCalendar === 'hebrew' ? t.hebrew.length : 12,
          r = this.localeConfig?.[this.currentLocale]?.months;
        if (Array.isArray(r) && r.length >= s) return r;
        const n = [],
          i =
            this.activeCalendar === 'buddhist'
              ? 'buddhist'
              : this.activeCalendar === 'hebrew'
                ? 'hebrew'
                : 'gregory',
          a = `${this.currentLocale}-u-ca-${i}-nu-latn`,
          o = new Intl.DateTimeFormat(a, { month: 'long', timeZone: 'UTC' });
        for (let l = 1; l <= s; l++)
          try {
            const d = this.calendarAdapter
              ? this.calendarAdapter.fromParts({
                  year: e || 1,
                  month: l,
                  day: 1,
                })
              : new Date(
                  Date.UTC(
                    (e || 1970) -
                      (this.activeCalendar === 'buddhist' ? 543 : 0),
                    l - 1,
                    1,
                  ),
                );
            n.push(o.format(d));
          } catch {
            break;
          }
        return n.length ? n : t.hebrew || this.lang.months;
      },
      usesCalendarAdapter() {
        return this.activeCalendar !== 'jalali';
      },
      getCalendarParts(e) {
        const t = e;
        if (this.calendarAdapter)
          return this.calendarAdapter.getParts(
            new Date(this.getDateTimestamp(t)),
          );
        const s = t
          .clone()
          .calendar(
            this.activeCalendar === 'gregorian' ? 'gregorian' : 'jalali',
          );
        return {
          year: s.year(),
          month: s.month(),
          day: s.date(),
          hour: s.hour(),
          minute: s.minute(),
          second: s.second(),
          millisecond: s.millisecond(),
        };
      },
      getDateTimestamp(e) {
        const t = e,
          s = Number(t.valueOf());
        if (Number.isFinite(s)) return s;
        const r = t.toDate();
        return Number.isFinite(Number(r)) ? Number(r) : Date.parse(String(r));
      },
      getDayTimestamp(e) {
        return Math.floor(this.getDateTimestamp(e) / 864e5) * 864e5;
      },
      normalizeEndDate(e, t) {
        return markRaw(
          new PersianDate().fromGregorian(this.getDateTimestamp(e)).endOf(t),
        );
      },
      fromCalendarParts(e) {
        if (this.calendarAdapter)
          return markRaw(
            new PersianDate().fromGregorian(
              this.calendarAdapter.fromParts(e).getTime(),
            ),
          );
        const t = [
          e.year,
          e.month,
          e.day,
          e.hour || 0,
          e.minute || 0,
          e.second || 0,
          e.millisecond || 0,
        ];
        return markRaw(
          this.activeCalendar === 'gregorian'
            ? this.core.clone().fromGregorian(t)
            : this.core.clone().fromJalali(t),
        );
      },
      displayYear(e) {
        return this.getCalendarParts(e).year;
      },
      displayMonth(e) {
        return this.getCalendarParts(e).month;
      },
      displayDay(e) {
        return this.getCalendarParts(e).day;
      },
      calendarMonthDate(e, t) {
        const s = e;
        return this.calendarAdapter
          ? markRaw(
              new PersianDate().fromGregorian(
                this.calendarAdapter
                  .addMonths(new Date(this.getDateTimestamp(s)), t)
                  .getTime(),
              ),
            )
          : markRaw(s.clone().addMonth(t));
      },
      calendarDayDate(e, t) {
        const s = e;
        return this.calendarAdapter
          ? this.fromCalendarParts({ ...this.getCalendarParts(e), day: t })
          : markRaw(s.clone().date(t));
      },
      calendarAddDays(e, t) {
        return this.calendarAdapter
          ? markRaw(
              new PersianDate().fromGregorian(
                this.calendarAdapter
                  .addDays(new Date(this.getDateTimestamp(e)), t)
                  .getTime(),
              ),
            )
          : markRaw(e.clone().addDay(t));
      },
      calendarMonthKey(e) {
        const t = this.getCalendarParts(e);
        return `${t.year}-${t.month}-${t.leapMonth ? 'leap' : 'normal'}`;
      },
      calendarDaysInMonth(e, t) {
        return this.calendarAdapter
          ? this.calendarAdapter.daysInMonth(e, t)
          : this.core.getDaysInMonth(e, t);
      },
      calendarWeekdayOffset(e) {
        return (
          (new Date(this.getDateTimestamp(e)).getUTCDay() -
            this.calendarWeekStart +
            7) %
          7
        );
      },
      isToday(e) {
        return this.getDayTimestamp(e) === this.getDayTimestamp(this.core);
      },
      isSameCalendarDate(e, t) {
        const s = this.getCalendarParts(e),
          r = this.getCalendarParts(t);
        return (
          s.year === r.year &&
          s.month === r.month &&
          s.day === r.day &&
          !!s.leapMonth == !!r.leapMonth
        );
      },
      isBetweenSelectedDates(e) {
        if (this.selectedDates.length !== 2) return !1;
        const t = this.getDayTimestamp(e),
          s = this.getDayTimestamp(this.selectedDates[0]),
          r = this.getDayTimestamp(this.selectedDates[1]);
        return t > Math.min(s, r) && t < Math.max(s, r);
      },
      formatDateValue(e, t) {
        const s = e;
        if (!this.calendarAdapter) return s.toString(t);
        const r = this.getCalendarParts(e),
          n = (c, f = 2) => String(c).padStart(f, '0'),
          i = this.activeCalendar === 'chinese' && r.leapMonth ? 'bis' : '',
          a = i ? '__LEAP__' : '',
          o = this.monthNamesForYear(r.year)[r.month - 1] || `Month ${r.month}`,
          l = `${n(r.month)}${a}`,
          d = `${r.month}${a}`;
        return t
          .replace('?D', String(r.day))
          .replace('?MMMM', o)
          .replace('MMMM', o)
          .replace('YYYY', String(r.year))
          .replace('YY', String(r.year).slice(-2))
          .replace('MM', l)
          .replace('M', d)
          .replace('DD', n(r.day))
          .replace('D', String(r.day))
          .replace('HH', n(r.hour || 0))
          .replace('H', String(r.hour || 0))
          .replace('mm', n(r.minute || 0))
          .replace('m', String(r.minute || 0))
          .replace('ss', n(r.second || 0))
          .replace('s', String(r.second || 0))
          .replace(/__LEAP__/g, i);
      },
      formatModelValue(e) {
        const t =
          this.modelCalendar === 'active'
            ? this.activeCalendar
            : this.modelCalendar;
        if (!t || t === this.activeCalendar)
          return this.formatDateValue(e, this.formats.model);
        const s = e,
          r = this.getDateTimestamp(s);
        if (t === 'jalali' || t === 'gregorian')
          return new PersianDate()
            .fromGregorian(r)
            .calendar(t)
            .toString(this.formats.model);
        const i = createCalendarAdapter(t, {
            hijriProvider: this.hijriProvider,
          }).getParts(new Date(r)),
          a = (d, c = 2) => String(d).padStart(c, '0'),
          o = t === 'chinese' && i.leapMonth ? 'bis' : '',
          l = o ? '__LEAP__' : '';
        return this.formats.model
          .replace('YYYY', String(i.year))
          .replace('YY', String(i.year).slice(-2))
          .replace('MM', `${a(i.month)}${l}`)
          .replace('M', `${i.month}${l}`)
          .replace('DD', a(i.day))
          .replace('D', String(i.day))
          .replace('HH', a(i.hour || 0))
          .replace('H', String(i.hour || 0))
          .replace('mm', a(i.minute || 0))
          .replace('m', String(i.minute || 0))
          .replace('ss', a(i.second || 0))
          .replace('s', String(i.second || 0))
          .replace(/__LEAP__/g, o);
      },
      parseCalendarParts(e) {
        const t = e.split(/[-/ .,\\:]/).filter(Boolean),
          s = t[1] || '1',
          r = this.activeCalendar === 'chinese' && /bis$/i.test(s),
          n = Number.parseInt(s.replace(/bis$/i, ''), 10);
        return {
          year: Number(t[0]),
          month: n || 1,
          day: Number(t[2]) || 1,
          hour: Number(t[3]) || 0,
          minute: Number(t[4]) || 0,
          second: Number(t[5]) || 0,
          ...(r ? { leapMonth: !0 } : {}),
        };
      },
      parseCalendarDate(e) {
        if (this.calendarAdapter)
          return this.fromCalendarParts(this.parseCalendarParts(e));
        const t = this.core.clone(),
          s =
            this.calendar === 'gregorian' ||
            (e.includes('-') && !e.includes('/'))
              ? 'gregorian'
              : 'jalali';
        return /[-/ ]/.test(e)
          ? (s === 'gregorian' ? t.fromGregorian(e) : t.fromJalali(e)).calendar(
              this.activeCalendar,
            )
          : t.calendar(s).parse(e).calendar(this.activeCalendar);
      },
      showPart(e) {
        e == 'year'
          ? ((this.showMonthSelect = !1),
            (this.showYearSelect = !this.showYearSelect),
            this.showYearSelect &&
              this.$nextTick(() => {
                const t =
                  this.$refs.pdpSelectYear.querySelector(
                    'li.selected',
                  ).offsetTop;
                this.$refs.pdpSelectYear.scroll({ top: t, behavior: 'smooth' });
              }))
          : e == 'month' &&
            ((this.showYearSelect = !1),
            (this.showMonthSelect = !this.showMonthSelect));
      },
      changeSelectedMonth(e) {
        const t = this.onDisplay.clone();
        if (e == 'add')
          this.onDisplay = this.calendarMonthDate(this.onDisplay, 1);
        else if (e == 'sub')
          this.onDisplay = this.calendarMonthDate(this.onDisplay, -1);
        else {
          const s = this.getCalendarParts(this.onDisplay);
          this.onDisplay = this.fromCalendarParts({
            ...s,
            month: e,
            day: Math.min(s.day, this.calendarDaysInMonth(s.year, e)),
          });
        }
        this.checkDate(this.onDisplay, 'month')
          ? (this.showMonthSelect = !1)
          : (this.onDisplay = t);
      },
      changeSelectedYear(e) {
        const t = this.getCalendarParts(this.onDisplay);
        ((this.onDisplay = this.fromCalendarParts({
          ...t,
          year: e,
          day: Math.min(t.day, this.calendarDaysInMonth(e, t.month)),
        })),
          this.checkDate(this.onDisplay, 'date') ||
            (this.onDisplay = this.nearestDate(this.onDisplay)),
          (this.showYearSelect = !1));
      },
      validate(e, t) {
        return !(!this.checkDate(e, t) || this.isInDisable(e));
      },
      isDisableBetween(e, t) {
        if (!this.disable) return !1;
        if (this.calendarAdapter) {
          const s = this.getDateTimestamp(e),
            r = this.getDateTimestamp(t),
            n = Math.min(s, r),
            i = Math.max(s, r),
            a = (l) =>
              this.type === 'date'
                ? this.getDayTimestamp(l)
                : this.getDateTimestamp(l);
          if (
            (typeof this.disable == 'string'
              ? [this.disable]
              : Array.isArray(this.disable)
                ? this.disable.filter((l) => typeof l == 'string')
                : []
            ).some((l) => {
              const d =
                  this.type === 'time'
                    ? t.clone().time(l)
                    : this.parseCalendarDate(l),
                c = a(d);
              return c > n && c < i;
            })
          )
            return !0;
          if (this.type !== 'time') {
            let l = new Date(i);
            for (
              ;
              (l = this.calendarAdapter.addDays(l, -1)), !(l.getTime() <= n);

            )
              if (
                this.isInDisable(
                  this.fromCalendarParts(this.calendarAdapter.getParts(l)),
                )
              )
                return !0;
          }
          return !1;
        }
        if (this.type != 'datetime' && Core.isString(this.disable)) {
          const s =
            this.type == 'time' ? t.clone().time(this.disable) : this.disable;
          return this.core
            .clone()
            .parse(s)
            .isBetween(e.toString(), t.toString());
        } else {
          if (
            this.type != 'datetime' &&
            Array.isArray(this.disable) &&
            this.disable.some((s) => Core.isString(s))
          )
            return this.disable.some(
              (s) => (
                this.type == 'time' && (s = t.clone().time(s).toString()),
                this.core.clone().parse(s).isBetween(e, t)
              ),
            );
          if (this.type != 'time') {
            const s = t.clone().startOf('date').subDay();
            for (; !s.isSameOrBefore(e); ) {
              if (this.isInDisable(s)) return !0;
              s.subDay();
            }
          }
        }
        return !1;
      },
      selectDate(e, t) {
        let s = this.validate(e, t);
        if (s) {
          if (
            this.mode == 'range' &&
            this.selectedDates.length == 1 &&
            ((s = !this.isDisableBetween(this.selectedDates[0], e)), !s)
          )
            return -2;
        } else return -1;
        return (
          this.type == 'date' && !this.calendarAdapter && e.startOf('date'),
          this.mode == 'single'
            ? (this.selectedDates = [e])
            : this.mode == 'range' &&
              (this.$refs.pdpMain.addEventListener(
                'mouseover',
                this.selectInRangeDate,
              ),
              this.selectedDates.length === 0
                ? ((this.selectedDates[0] = e),
                  (this.inputName = 'secondInput'))
                : this.inputName === 'secondInput'
                  ? ((this.inputName = 'firstInput'),
                    e.isBefore(this.selectedDates[0])
                      ? this.selectedDates.length === 1
                        ? this.selectedDates.unshift(e)
                        : ((this.selectedDates = [e]),
                          (this.inputName = 'secondInput'))
                      : (this.selectedDates[1] = e))
                  : ((this.selectedDates = [e]),
                    (this.inputName = 'secondInput')),
              this.selectedDates.length == 2 &&
                this.$refs.pdpMain.removeEventListener(
                  'mouseover',
                  this.selectInRangeDate,
                )),
          this.type == 'datetime' &&
            (this.selectedDates = this.selectedDates.map(
              (r, n) => (
                this.selectedTimes[n] && r.time(this.selectedTimes[n]),
                (this.selectedTimes[n] = r),
                r
              ),
            )),
          this.$emit('select', e),
          this.autoSubmit &&
          (this.mode !== 'range' ||
            (this.mode === 'range' && this.selectedDates.length == 2))
            ? (this.submitDate(), 1)
            : 0
        );
      },
      setModel(e) {
        (e === void 0 &&
          ((e = this.selectedDates.map((t) => this.formatModelValue(t))),
          this.mode == 'single' && (e = e[0])),
          this.$emit('update:modelValue', e));
      },
      goToToday() {
        if (
          ((this.showMonthSelect = this.showYearSelect = !1),
          (this.onDisplay = this.core.now().clone()),
          this.type.includes('time') && this.selectedDates.length)
        ) {
          const e = this.selectedDates.length - 1,
            t = this.selectedDates[e];
          (t.time(this.onDisplay),
            this.selectedTimes[e] && (this.selectedTimes[e] = t.clone()),
            this.autoSubmit &&
              this.checkDate(t, 'time') &&
              !this.isInDisable(t) &&
              this.submitDate(!1));
        }
        this.type.includes('date') &&
          this.$nextTick(() => {
            const t = this.$refs.root?.querySelector('.pdp-day.today');
            t &&
              (t.classList.add('tada'),
              setTimeout(() => {
                t.classList.remove('tada');
              }, 1e3));
          });
      },
      checkDate(e, t) {
        if (this.calendarAdapter) {
          const n = Core.isPersianDate(e) ? e : this.parseCalendarDate(e),
            i = this.getDateTimestamp(n),
            a = this.getDateTimestamp(this.fromDate),
            o = this.getDateTimestamp(this.toDate);
          if (t === 'year' || t === 'month' || t === 'date') {
            const l = this.getDayTimestamp(n);
            return (
              l <= this.getDayTimestamp(this.toDate) &&
              l >= this.getDayTimestamp(this.fromDate)
            );
          }
          return i >= a && i <= o;
        }
        let s, r;
        switch (
          (Core.isPersianDate(e) || (e = this.core.clone().parse(e)), t)
        ) {
          case 'year':
            ((s = this.fromDate.toString('?YYYY')),
              (r = this.toDate.toString('?YYYY')));
            break;
          case 'month':
            ((s = this.fromDate.toString('?YYYY/?MM')),
              (r = this.toDate.toString('?YYYY/?MM')));
            break;
          case 'date':
            ((s = this.fromDate.toString()), (r = this.toDate.toString()));
            break;
          case 'time':
            ((s = this.fromDate.toString(
              this.type.includes('time') ? 'datetime' : 'date',
            )),
              (r = this.toDate.toString(
                this.type.includes('time') ? 'datetime' : 'date',
              )));
            break;
        }
        return e.isBetween(s, r, '[]');
      },
      isInDisable(e, t) {
        if (!this.disable) return !1;
        t = t || this.disable;
        const s = e,
          r = Core.isPersianDate(s) ? s.clone() : this.core.clone().parse(s);
        return Core.isString(t)
          ? this.isSameDisabledValue(r, t)
          : t instanceof RegExp
            ? this.testDisableRegex(t, this.formatDisableValue(r))
            : Core.isFunction(t)
              ? t(r)
              : Array.isArray(t)
                ? t.some((n) => {
                    if (Core.isString(n)) return this.isSameDisabledValue(r, n);
                    if (n instanceof RegExp)
                      return this.testDisableRegex(
                        n,
                        this.formatDisableValue(r),
                      );
                  })
                : !1;
      },
      selectedTimeValue(e) {
        const t = this.selectedTimes[e];
        if (!t) return;
        const s = this.selectedDates[e];
        return s
          ? s
              .clone()
              .hour(t.hour())
              .minute(t.minute())
              .second(t.second())
              .millisecond(t.millisecond())
          : t;
      },
      isSelectedTimeDisabled(e) {
        const t = this.selectedTimeValue(e);
        return !!t && (!this.checkDate(t, 'time') || this.isInDisable(t));
      },
      isSameDisabledValue(e, t) {
        const s = this.parseDisabledValue(
          this.type === 'time' && !/[\s/-]/.test(t)
            ? `${e.toString('YYYY-MM-DD')} ${t}`
            : t,
        );
        if (!this.calendarAdapter && !this.calendar && t.includes('/')) {
          const r = e.clone().calendar('jalali'),
            n = s.clone().calendar('jalali'),
            i =
              r.year() === n.year() &&
              r.month() === n.month() &&
              r.date() === n.date();
          if (this.type === 'date' || !/\s/.test(t)) return i;
          if (this.type === 'datetime')
            return i && r.hour() === n.hour() && r.minute() === n.minute();
        }
        return this.type === 'time'
          ? e.hour() === s.hour() && e.minute() === s.minute()
          : this.type === 'date' || !/[\s:]/.test(t)
            ? e.clone().startOf('date').isSame(s.clone().startOf('date'))
            : e.isSame(s);
      },
      parseDisabledValue(e) {
        return !this.calendarAdapter && !this.calendar && e.includes('/')
          ? this.core.clone().calendar('jalali').parse(e)
          : this.parseCalendarDate(e);
      },
      testDisableRegex(e, t) {
        e.lastIndex = 0;
        const s = e.test(t);
        return ((e.lastIndex = 0), s);
      },
      formatDisableValue(e) {
        return this.calendarAdapter
          ? this.formatDateValue(e, this.formats.input)
          : e.toString(jalaliDisableFormats[this.type]);
      },
      inputSlotProps(e) {
        const t = this.inputs[e];
        return {
          value: this.displayValue[e] || '',
          inputAttrs: {
            ...this.attrs[t],
            ref: 'inputs',
            type: 'text',
            autocomplete: 'off',
            placeholder:
              this.inputMaskConfig().placeholder || this.attrs[t].placeholder,
          },
          open: () => this.showPicker('input', e),
          clear: () => this.clear(t),
          onInput: (s) => {
            const r = s.target;
            ((this.displayValue[e] = r.value), this.sanitizeInput(e, s));
          },
          onBlur: () => {
            (this.sanitizeInput(e), this.commitInput(e));
          },
          onKeydown: (s) => this.selectWithArrow(s),
        };
      },
      showPicker(e, t) {
        if (this.clickOn == 'all' || this.clickOn == e) {
          const s = this.inputs[t];
          (this.dualInput && (this.inputName = s),
            this.$refs.inputs?.[t]?.focus(),
            (this.showDatePicker = !0),
            this.modal ||
              (this.$nextTick(() => {
                this.locate();
              }),
              document.addEventListener('scroll', this.locate)));
        }
      },
      async selectWithArrow(e) {
        if (
          ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)
        ) {
          let s = { ArrowLeft: 1, ArrowUp: -7, ArrowRight: -1, ArrowDown: 7 }[
            e.key
          ];
          this.lang.dir.picker == 'ltr' &&
            ['ArrowLeft', 'ArrowRight'].includes(e.key) &&
            (s = -s);
          const r = this.$refs.root;
          let n = r.querySelectorAll('.pdp .pdp-day.hover');
          n.length ||
            (n = r.querySelectorAll(
              '.pdp .pdp-day.start-range,.pdp .pdp-day.end-range',
            ));
          let i = n[n.length - 1];
          if (i) {
            let a = Number(this.getColumn(i));
            i.classList.remove('hover');
            const o = this.calendarMonthDate(this.onDisplay, a),
              l = this.calendarDayDate(o, Number(i.innerText)),
              d = this.calendarAddDays(l, s);
            if (!this.checkDate(d, 'date')) return i.classList.add('hover');
            const c = this.calendarMonthKey(d);
            a = -1;
            for (let f = 0; f < this.columnCount; f++)
              if (
                this.calendarMonthKey(
                  this.calendarMonthDate(this.onDisplay, f),
                ) === c
              ) {
                a = f;
                break;
              }
            if (a < 0) {
              const f = this.calendarMonthDate(this.onDisplay, 0);
              this.getDateTimestamp(d) < this.getDateTimestamp(f)
                ? ((this.onDisplay = this.calendarMonthDate(
                    this.onDisplay,
                    -this.columnCount,
                  )),
                  (a = this.columnCount - 1))
                : ((this.onDisplay = this.calendarMonthDate(
                    this.onDisplay,
                    this.columnCount,
                  )),
                  (a = 0));
            }
            (await this.$nextTick(),
              (i = r.querySelector(
                `.pdp .pdp-main .pdp-column[data-column='${a}'] .pdp-day[value='${this.displayDay(d)}']`,
              )),
              i && i.classList.add('hover'));
          } else
            ((i = r.querySelector('.pdp .pdp-day:not(.empty):not(.disabled)')),
              i ||
                (i = r.querySelector(
                  `.pdp .pdp-main .pdp-column[data-column="0"] .pdp-day[value="${this.fromDate.date()}"]`,
                )),
              i.classList.add('hover'));
          this.mode === 'range' &&
            this.selectedDates.length == 1 &&
            this.selectInRangeDate({ target: i });
        } else if (e.key == 'Enter') {
          e.preventDefault();
          const t = this.$refs.root.querySelector('.pdp .pdp-day.hover');
          t
            ? this.selectDate(
                this.calendarDayDate(
                  this.calendarMonthDate(
                    this.onDisplay,
                    Number(this.getColumn(t) || 0),
                  ),
                  Number(t.innerText),
                ),
                'date',
              )
            : this.displayValue.forEach((s, r) => {
                this.commitInput(r);
              });
        }
      },
      commitInput(e) {
        const s = this.$refs.inputs?.[e],
          r = this.displayValue[e] || s?.value || '',
          n = this.dualInput
            ? this.selectedDates[e]
              ? this.formatDateValue(this.selectedDates[e], this.formats.input)
              : ''
            : this.selectedDates
                .map((c) => this.formatDateValue(c, this.formats.input))
                .join(' - ');
        if (r === n) return;
        const i = this.inputMask ? r : this.sanitizeInputValue(r);
        if (!i) return;
        i !== r && (s && (s.value = i), (this.displayValue[e] = i));
        const a = this.normalizeInputDigits(i);
        let o;
        if (this.type === 'time') {
          const c = a.split(/[/ -.,:\\]/);
          ((o = this.checkDate(this.core.clone(), 'time')
            ? this.core.clone()
            : this.fromDate.clone()),
            o.time(c));
        } else
          o = this.calendarAdapter
            ? this.parseCalendarDate(a)
            : this.core.clone().parse(a);
        const l = this.type === 'date' ? 'date' : 'time',
          d = this.selectDate(o, l);
        if (!(!o.isValid() || d < 0)) {
          if (this.mode === 'single' && this.type.includes('date'))
            this.onDisplay = o.clone();
          else {
            const c = o.diff(this.onDisplay, 'month');
            (c < 0 || c >= this.columnCount) && (this.onDisplay = o.clone());
          }
          d === 0 && (this.displayValue[e] = '');
        }
      },
      inputMaskPattern() {
        let t = this.inputMaskConfig().pattern;
        return (
          (!t || t === 'calendar-default') &&
            (t = this.defaultInputMaskPattern()),
          t === 'date' || t === 'datetime' || t === 'time'
            ? this.calendarAdapter
              ? t === 'date'
                ? 'YYYY-MM-DD'
                : t === 'datetime'
                  ? 'YYYY-MM-DD HH:mm'
                  : 'HH:mm'
              : t === 'date'
                ? 'jYYYY/jMM/jDD'
                : t === 'datetime'
                  ? 'jYYYY/jMM/jDD HH:mm'
                  : 'HH:mm'
            : t
        );
      },
      defaultInputMaskPattern() {
        const e =
          this.activeCalendar === 'jalali' ? 'jYYYY/jMM/jDD' : 'YYYY-MM-DD';
        return this.type === 'date'
          ? e
          : this.type === 'datetime'
            ? `${e} HH:mm`
            : 'HH:mm';
      },
      inputMaskConfig() {
        const e = this.inputMask;
        if (!e)
          return {
            pattern: this.defaultInputMaskPattern(),
            autoInsert: !0,
            allowedDigits:
              this.activeCalendar === 'jalali' || this.lang.dir.input === 'rtl'
                ? 'both'
                : 'latin',
            strict: !0,
          };
        if (typeof e == 'string') return { pattern: e, autoInsert: !0 };
        if (
          'pattern' in e ||
          'allowedDigits' in e ||
          'strict' in e ||
          'autoInsert' in e ||
          'blocks' in e
        )
          return e;
        const t = e[this.type];
        return typeof t == 'string' ? { pattern: t } : t || {};
      },
      normalizeInputDigits(e) {
        return Array.from(e)
          .map((t) => {
            const s = t.codePointAt(0) || 0;
            return s >= 1776 && s <= 1785
              ? String(s - 1776)
              : s >= 1632 && s <= 1641
                ? String(s - 1632)
                : t;
          })
          .join('');
      },
      isInputDigit(e) {
        return /[0-9۰-۹٠-٩]/.test(e);
      },
      maskTokens(e) {
        const t = [],
          s = /j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g;
        let r = 0,
          n;
        for (; (n = s.exec(e)); )
          (n.index > r && t.push({ literal: e.slice(r, n.index) }),
            t.push({ token: n[0] }),
            (r = n.index + n[0].length));
        return (r < e.length && t.push({ literal: e.slice(r) }), t);
      },
      maskTokenMaximum(e) {
        const t = e.replace(/^j/, ''),
          s =
            this.inputMaskConfig().blocks?.[e] ||
            this.inputMaskConfig().blocks?.[t] ||
            this.inputMaskConfig().blocks?.[`j${t}`];
        if (s?.to !== void 0) return s.to;
        if (['M', 'MM'].includes(t)) return 12;
        if (['D', 'DD'].includes(t)) return 31;
        if (['H', 'HH'].includes(t)) return 23;
        if (['m', 'mm', 's', 'ss'].includes(t)) return 59;
      },
      maskTokenMinimum(e) {
        const t = e.replace(/^j/, '');
        return (
          this.inputMaskConfig().blocks?.[e] ||
          this.inputMaskConfig().blocks?.[t] ||
          this.inputMaskConfig().blocks?.[`j${t}`]
        )?.from;
      },
      maskTokenSize(e) {
        return e.replace(/^j/, '') === 'YYYY' ? 4 : 2;
      },
      sanitizeMaskToken(e, t) {
        const s = this.maskTokenMaximum(e),
          r = this.maskTokenMinimum(e);
        if ((s === void 0 && r === void 0) || t.length < 1) return t;
        const n = this.maskTokenSize(e);
        if (t.length < n) return t;
        const i = Number(t.slice(0, n));
        return (s !== void 0 && i > s) || (r !== void 0 && i < r)
          ? t.slice(0, n - 1)
          : t.slice(0, n);
      },
      maskedInputValue(e) {
        if (this.inputMaskConfig().autoInsert === !1) return e;
        const s = e.split(/\s+-\s+/);
        if (s.length > 1)
          return s.map((f) => this.maskedInputValue(f)).join(' - ');
        const r = this.inputMaskPattern(),
          n = this.maskTokens(r);
        if (n.some((f) => f.token && /MMMM|MMM/.test(f.token))) return e;
        const a = Array.from(e).filter((f) => this.isInputDigit(f)),
          o = n.reduce(
            (f, v) => f + (v.token ? this.maskTokenSize(v.token) : 0),
            0,
          ),
          l = a.slice(0, o);
        let d = 0,
          c = '';
        return (
          n.forEach((f, v) => {
            if (f.literal) return;
            const M = f.token.replace(/^j/, ''),
              P = this.maskTokenSize(M),
              B = l.slice(d, d + P).join(''),
              $ = this.sanitizeMaskToken(f.token, B);
            if (((c += $), (d += B.length), B.length < P)) return;
            const I = n[v + 1];
            I?.literal && (c += I.literal);
          }),
          c
        );
      },
      maskedCursorPosition(e, t) {
        if (!t) return 0;
        let s = 0;
        for (let r = 0; r < e.length; r++)
          if (this.isInputDigit(e[r]) && (s++, s === t)) {
            let n = r + 1;
            for (; n < e.length && !this.isInputDigit(e[n]); ) n++;
            return n;
          }
        return e.length;
      },
      sanitizeInput(e, t) {
        const s = t?.target,
          r = s?.value ?? this.displayValue[e];
        if (!r) {
          this.displayValue[e] = '';
          return;
        }
        const n = s?.selectionStart ?? r.length,
          i = Array.from(r.slice(0, n)).filter((o) =>
            this.isInputDigit(o),
          ).length,
          a = this.sanitizeInputValue(r);
        if (
          ((this.displayValue[e] = a),
          a !== r && (s && (s.value = a), s && s === document.activeElement))
        ) {
          const o = this.maskedCursorPosition(a, i);
          s.setSelectionRange(o, o);
        }
      },
      sanitizeInputValue(e) {
        const t = this.inputMaskPattern(),
          s = this.inputMaskConfig().allowedDigits || 'latin',
          r = /\s-\s/.test(e),
          n = t
            .replace(/j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g, '')
            .split(''),
          i = /MMMM|MMM/.test(t),
          a = Array.from(e)
            .filter((v) => {
              const M = /[0-9]/.test(v),
                P = /[۰-۹٠-٩]/.test(v);
              return (s === 'latin' && M) ||
                (s === 'locale' && P) ||
                (s === 'both' && (M || P)) ||
                n.includes(v) ||
                /\s/.test(v) ||
                (r && v === '-')
                ? !0
                : i && new RegExp('\\p{L}', 'u').test(v);
            })
            .join('')
            .replace(/\s{2,}/g, ' ')
            .replace(/([/:.,-])\1+/g, '$1');
        if (this.inputMaskConfig().autoInsert === !1) return a;
        const o = this.maskedInputValue(a),
          l = this.maskTokens(t),
          d = l.reduce(
            (v, M) => v + (M.token ? this.maskTokenSize(M.token) : 0),
            0,
          ),
          c =
            l.some((v) => v.literal) &&
            Array.from(a).filter((v) => this.isInputDigit(v)).length === d,
          f = Array.from(a).filter((v) => this.isInputDigit(v)).length > d;
        return o === a || o.startsWith(a) || c || f || !/\D/.test(a) ? o : a;
      },
      selectInRangeDate(e) {
        const t = e.target;
        if (!t.classList.contains('pdp-day')) return;
        const s = this.$refs.root;
        s.querySelectorAll('.pdp .pdp-day').forEach((l) => {
          l.classList.remove('in-range');
        });
        let r = this.getColumn(t);
        const n = this.onDisplay
            .clone()
            .startOf('date')
            .addMonth(r)
            .date(t.innerText),
          i = this.selectedDates[0].clone().startOf('date'),
          a = n.isAfter(i) ? 1 : -1,
          o = s.querySelector('.pdp-day.start-range,.pdp-day.end-range');
        for (
          o
            ? ((r = +this.getColumn(o)),
              o.classList.replace(
                ...(n.isBefore(i)
                  ? ['start-range', 'end-range']
                  : ['end-range', 'start-range']),
              ))
            : (i.parse(this.onDisplay),
              a === 1
                ? (i.startOf('month').subDay(), (r = -1))
                : (i
                    .addMonth(this.columnCount - 1)
                    .endOf('month')
                    .addDay()
                    .startOf('date'),
                  (r = this.columnCount)));
          !n.isSame(i);

        ) {
          const l = i.month();
          if (
            (i.addDay(a),
            l != i.month() && (r += a),
            this.checkDate(i, 'date') && !this.isInDisable(i))
          )
            s.querySelector(
              `.pdp-column[data-column='${r}'] .pdp-day[value='${i.date()}']`,
            ).classList.add('in-range');
          else break;
        }
      },
      submitDate(e = !0) {
        const t = this.selectedDates.map((s) =>
          this.formatDateValue(s, this.formats.input),
        );
        (this.dualInput
          ? (this.displayValue = t)
          : (this.displayValue[0] = t.join(' - ')),
          (this.submitedValue = this.selectedDates.slice()),
          this.setModel(),
          this.$emit(
            'submit',
            this.mode === 'range' ? this.selectedDates : this.selectedDates[0],
          ),
          e && (this.showDatePicker = !1));
      },
      getColumn({ parentNode: e }) {
        return e.parentNode.parentNode.dataset.column;
      },
      nearestDate(e) {
        return Math.abs(e.diff(this.fromDate)) <= Math.abs(e.diff(this.toDate))
          ? this.fromDate.clone()
          : this.toDate.clone();
      },
      locate() {
        const e = this.$refs.inputs;
        e?.[0] &&
          ((this.pickerPlace = { top: !1, left: !1, right: !1 }),
          this.$nextTick(() => {
            const t = e[0],
              s = t.offsetHeight + t.getBoundingClientRect().top,
              r = this.$refs.pdpPicker,
              n = r.offsetHeight + 10,
              i = r.getBoundingClientRect();
            this.pickerPlace = {
              top: s >= n && window.innerHeight - (s + n) < 0,
              left: i.left <= 0,
              right: window.innerWidth - (i.left + i.width) <= 0,
            };
          }));
      },
      changeLocale() {
        const e = this.effectiveLocale.split(','),
          t = e.indexOf(this.currentLocale);
        this.currentLocale = e[t + 1] || e[0];
        const s = this.activeCalendar,
          r = this.calendarAdapter ? 'gregorian' : s;
        (this.core.calendar(r),
          this.fromDate.calendar(r),
          this.toDate.calendar(r),
          this.onDisplay.calendar(r));
        for (const n of this.selectedDates) n.calendar(r);
        for (const n of this.selectedTimes) n.calendar(r);
        this.submitDate(!1);
      },
      clear(e) {
        const t = e === 'firstInput' ? 0 : 1;
        if (
          ((this.displayValue[t] = ''), this.$emit('clear'), this.dualInput)
        ) {
          const s = this.$attrs.value;
          if (s && Array.isArray(s))
            return this.setModel(s.map((r, n) => (n == t ? null : r)));
        }
        this.setModel('');
      },
      startChangeTime(e, t, s) {
        let r = this.selectedTimes[e];
        (r ||
          ((r = this.core.clone()),
          this.checkDate(r, 'time') ||
            (r = this.toDate.clone().subDay().time(this.core)),
          e == 1 &&
            !this.selectedTimes.length &&
            this.selectedTimes.push(r.clone()),
          this.selectedTimes.push(r)),
          this.stopChangeTime());
        const n = t == 'hour' ? 23 : 59;
        let i = r[t](),
          a = t == 'hour' ? this.hourStepCount : this.minuteStepCount;
        const o = () => {
          (s == 'add'
            ? ((i = i + a), i > n && (i = 0))
            : ((i = i - a), i < 0 && (i = n)),
            this.checkDate(r[t](i), 'time')
              ? this.selectedTimes.length == 2 &&
                this.selectedTimes[0].isAfter(this.selectedTimes[1]) &&
                r.parse(e == 0 ? this.selectedTimes[1] : this.selectedTimes[0])
              : r.parse(
                  r.isSameOrAfter(this.toDate.clone())
                    ? this.toDate.clone()
                    : this.fromDate.clone(),
                ));
          const l = this.selectedDates[e]
            ? this.selectedDates[e]
                .clone()
                .hour(r.hour())
                .minute(r.minute())
                .second(r.second())
                .millisecond(r.millisecond())
            : r;
          ((this.selectedTimes[e] = r.clone()),
            this.isInDisable(l) ||
              (this.type == 'time'
                ? (this.selectedDates[e] = r)
                : this.selectedDates[e] && this.selectedDates[e].time(r),
              this.$emit('select', r),
              this.autoSubmit &&
                !this.selectedTimes.some((d, c) =>
                  this.isSelectedTimeDisabled(c),
                ) &&
                this.submitDate(!1)));
        };
        (o(), (this.interval = setInterval(o, 300)));
      },
      stopChangeTime() {
        clearInterval(this.interval);
      },
      selectShorcut(e) {
        ((this.selectedDates = e.map(
          (t, s) => (
            s == 0 && (this.onDisplay = t.clone()),
            this.$emit('select', t),
            t.clone()
          ),
        )),
          this.autoSubmit && this.submitDate());
      },
      setDate(e) {
        e &&
          (this.mode == 'single' && typeof e == 'string' && (e = [e]),
          (this.selectedDates = []),
          e.some((t, s) => {
            const r = this.parseCalendarDate(
              (this.type == 'time'
                ? this.core.toString('YYYY-MM-DD') + ' '
                : '') + t,
            );
            if (r)
              (this.selectedDates.push(markRaw(r.clone())),
                this.selectedTimes.push(markRaw(r.clone())),
                s == 0 && (this.onDisplay = markRaw(r.clone())));
            else return ((this.selectedDates = this.selectedTimes = []), !0);
          }),
          this.selectedDates.length && this.submitDate());
      },
    },
  }),
  _export_sfc = (e, t) => {
    const s = e.__vccOpts || e;
    for (const [r, n] of t) s[r] = n;
    return s;
  },
  _hoisted_1$1 = ['for'],
  _hoisted_2$1 = ['onClick'],
  _hoisted_3$1 = ['value', 'placeholder', 'onFocus', 'onInput', 'onBlur'],
  _hoisted_4$1 = ['onClick'],
  _hoisted_5$1 = { key: 1 },
  _hoisted_6$1 = { class: 'pdp-auto' },
  _hoisted_7$1 = { key: 0 },
  _hoisted_8$1 = { class: 'pdp-select-month' },
  _hoisted_9$1 = ['onClick'],
  _hoisted_10$1 = { ref: 'pdpSelectYear', class: 'pdp-select-year' },
  _hoisted_11$1 = ['onClick'],
  _hoisted_12$1 = { key: 1, class: 'pdp-header' },
  _hoisted_13$1 = { key: 0, class: 'top' },
  _hoisted_14$1 = ['tabindex'],
  _hoisted_15$1 = { class: 'bottom' },
  _hoisted_16$1 = ['title'],
  _hoisted_17$1 = ['title'],
  _hoisted_18$1 = { ref: 'pdpMain', class: 'pdp-main' },
  _hoisted_19$1 = { key: 0, class: 'pdp-date' },
  _hoisted_20$1 = ['data-column'],
  _hoisted_21$1 = { class: 'pdp-week' },
  _hoisted_22$1 = { class: 'pdp-days' },
  _hoisted_23$1 = ['value', 'onClick'],
  _hoisted_24$1 = { key: 1, class: 'pdp-time inline' },
  _hoisted_25$1 = { key: 0, class: 'pdp-column' },
  _hoisted_26$1 = { class: 'hour' },
  _hoisted_27$1 = ['onTouchstart', 'onMousedown', 'onKeydown'],
  _hoisted_28$1 = ['onTouchstart', 'onMousedown', 'onKeydown'],
  _hoisted_29$1 = { class: 'minute' },
  _hoisted_30$1 = ['onTouchstart', 'onMousedown', 'onKeydown'],
  _hoisted_31$1 = ['onTouchstart', 'onMousedown', 'onKeydown'],
  _hoisted_32$1 = { class: 'pdp-footer' },
  _hoisted_33$1 = { key: 0 },
  _hoisted_34$1 = { key: 1 },
  _hoisted_35$1 = ['tabindex'],
  _hoisted_36$1 = ['tabindex'],
  _hoisted_37$1 = { key: 0, class: 'pdp-shortcut' },
  _hoisted_38$1 = ['onClick'];
function _sfc_render(e, t, s, r, n, i) {
  const a = resolveComponent('PDPIcon'),
    o = resolveComponent('PDPAlt'),
    l = resolveComponent('PDPArrow');
  return (
    openBlock(),
    createElementBlock(
      'div',
      {
        ref: 'root',
        class: normalizeClass([
          'pdp',
          { 'pdp-range': e.mode === 'range' },
          { 'pdp-modal': e.modal },
          { 'pdp-dual': e.dualInput },
          { 'pdp-open': e.showDatePicker },
          e.lang.dir.input,
        ]),
      },
      [
        renderSlot(e.$slots, 'before', {}, () => [
          e.label
            ? (openBlock(),
              createElementBlock(
                'label',
                mergeProps(
                  { key: 0, for: e.attrs.firstInput.id },
                  e.attrs.label,
                ),
                toDisplayString(e.label),
                17,
                _hoisted_1$1,
              ))
            : createCommentVNode('', !0),
        ]),
        createBaseVNode(
          'div',
          normalizeProps(guardReactiveProps(e.attrs.div)),
          [
            (openBlock(!0),
            createElementBlock(
              Fragment,
              null,
              renderList(
                e.inputs,
                (d, c) => (
                  openBlock(),
                  createElementBlock(
                    Fragment,
                    { key: d },
                    [
                      !e.$slots.hasOwnProperty('icon') ||
                      e.$slots?.icon?.()?.length
                        ? (openBlock(),
                          createElementBlock(
                            'div',
                            {
                              key: `icon-${d}`,
                              class: normalizeClass([
                                'pdp-icon',
                                {
                                  'pdp-pointer': ['all', 'icon'].includes(
                                    e.clickOn,
                                  ),
                                },
                                { 'pdp-inside': e.iconInside },
                              ]),
                              onClick: (f) => e.showPicker('icon', c),
                            },
                            [
                              renderSlot(e.$slots, 'icon', {}, () => [
                                createVNode(
                                  a,
                                  { icon: e.type, width: '23', height: '23' },
                                  null,
                                  8,
                                  ['icon'],
                                ),
                              ]),
                            ],
                            10,
                            _hoisted_2$1,
                          ))
                        : createCommentVNode('', !0),
                      renderSlot(
                        e.$slots,
                        'input',
                        mergeProps({ ref_for: !0 }, e.inputSlotProps(c)),
                        () => [
                          createBaseVNode(
                            'input',
                            mergeProps(
                              {
                                ref_for: !0,
                                ref: 'inputs',
                                value: e.displayValue[c] || '',
                                type: 'text',
                                autocomplete: 'off',
                              },
                              { ref_for: !0 },
                              e.attrs[d],
                              {
                                placeholder:
                                  e.inputMaskConfig().placeholder ||
                                  e.attrs[d].placeholder,
                                onFocus: (f) => e.showPicker('input', c),
                                onInput: (f) => e.sanitizeInput(c, f),
                                onBlur: (f) => {
                                  (e.sanitizeInput(c, f), e.commitInput(c));
                                },
                                onKeydown:
                                  t[0] ||
                                  (t[0] = (...f) =>
                                    e.selectWithArrow &&
                                    e.selectWithArrow(...f)),
                              },
                            ),
                            null,
                            16,
                            _hoisted_3$1,
                          ),
                        ],
                      ),
                      e.clearable
                        ? (openBlock(),
                          createElementBlock(
                            'button',
                            {
                              key: `clear-${d}`,
                              class: 'pdp-clear',
                              type: 'button',
                              onClick: (f) => e.clear(d),
                            },
                            [
                              renderSlot(e.$slots, 'clear', {}, () => [
                                createVNode(a, { icon: 'clear' }),
                              ]),
                            ],
                            8,
                            _hoisted_4$1,
                          ))
                        : createCommentVNode('', !0),
                    ],
                    64,
                  )
                ),
              ),
              128,
            )),
          ],
          16,
        ),
        renderSlot(e.$slots, 'after'),
        e.attrs.alt.name
          ? (openBlock(),
            createBlock(
              o,
              {
                key: 0,
                name: e.attrs.alt.name,
                format: e.formats.alt,
                dates: e.altDates,
              },
              null,
              8,
              ['name', 'format', 'dates'],
            ))
          : createCommentVNode('', !0),
        e.showDatePicker
          ? (openBlock(),
            createElementBlock('div', _hoisted_5$1, [
              createBaseVNode('div', {
                class: 'pdp-overlay',
                onClick: t[1] || (t[1] = (d) => (e.showDatePicker = !1)),
              }),
              createBaseVNode(
                'div',
                mergeProps(e.attrs.picker, { ref: 'pdpPicker' }),
                [
                  createBaseVNode('div', _hoisted_6$1, [
                    e.type.includes('date')
                      ? (openBlock(),
                        createElementBlock('div', _hoisted_7$1, [
                          withDirectives(
                            createBaseVNode(
                              'ul',
                              _hoisted_8$1,
                              [
                                (openBlock(!0),
                                createElementBlock(
                                  Fragment,
                                  null,
                                  renderList(
                                    e.months,
                                    (d, c) => (
                                      openBlock(),
                                      createElementBlock(
                                        'li',
                                        {
                                          key: c,
                                          class: normalizeClass([
                                            { selected: d.selected },
                                            { disabled: d.disabled },
                                          ]),
                                          onClick: (f) =>
                                            e.changeSelectedMonth(c),
                                        },
                                        toDisplayString(d.label),
                                        11,
                                        _hoisted_9$1,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ],
                              512,
                            ),
                            [[vShow, e.showMonthSelect]],
                          ),
                          withDirectives(
                            createBaseVNode(
                              'ul',
                              _hoisted_10$1,
                              [
                                (openBlock(!0),
                                createElementBlock(
                                  Fragment,
                                  null,
                                  renderList(
                                    e.years,
                                    (d, c) => (
                                      openBlock(),
                                      createElementBlock(
                                        'li',
                                        {
                                          key: c,
                                          class: normalizeClass({
                                            selected:
                                              e.displayYear(e.displayDate) == d,
                                          }),
                                          onClick: (f) =>
                                            e.changeSelectedYear(d),
                                        },
                                        toDisplayString(d),
                                        11,
                                        _hoisted_11$1,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ],
                              512,
                            ),
                            [[vShow, e.showYearSelect]],
                          ),
                        ]))
                      : createCommentVNode('', !0),
                    e.type.includes('date')
                      ? (openBlock(),
                        createElementBlock('div', _hoisted_12$1, [
                          e.effectiveLocale.includes(',')
                            ? (openBlock(),
                              createElementBlock('div', _hoisted_13$1, [
                                createBaseVNode(
                                  'div',
                                  null,
                                  toDisplayString(e.lang.translations.text),
                                  1,
                                ),
                                createBaseVNode(
                                  'button',
                                  {
                                    type: 'button',
                                    tabindex: e.tabIndex,
                                    onClick:
                                      t[2] ||
                                      (t[2] = (...d) =>
                                        e.changeLocale && e.changeLocale(...d)),
                                  },
                                  toDisplayString(e.nextLocale),
                                  9,
                                  _hoisted_14$1,
                                ),
                              ]))
                            : createCommentVNode('', !0),
                          createBaseVNode('div', _hoisted_15$1, [
                            createBaseVNode(
                              'button',
                              {
                                tabindex: '-1',
                                type: 'button',
                                class: normalizeClass([
                                  'pdp-arrow',
                                  {
                                    disabled: !e.checkDate(
                                      e.calendarMonthDate(e.displayDate, -1),
                                      'month',
                                    ),
                                  },
                                ]),
                                title: e.lang.translations.prevMonth,
                                onClick:
                                  t[3] ||
                                  (t[3] = (d) => e.changeSelectedMonth('sub')),
                              },
                              [
                                renderSlot(e.$slots, 'right-arrow', {}, () => [
                                  createVNode(
                                    l,
                                    {
                                      direction: 'right',
                                      width: '10',
                                      height: '10',
                                      inverse: e.lang.dir.picker == 'ltr',
                                    },
                                    null,
                                    8,
                                    ['inverse'],
                                  ),
                                ]),
                              ],
                              10,
                              _hoisted_16$1,
                            ),
                            createBaseVNode('div', null, [
                              (openBlock(!0),
                              createElementBlock(
                                Fragment,
                                null,
                                renderList(
                                  e.columnCount,
                                  (d, c) => (
                                    openBlock(),
                                    createElementBlock('div', { key: c }, [
                                      createBaseVNode(
                                        'button',
                                        {
                                          class: 'pdp-month',
                                          type: 'button',
                                          tabindex: '-1',
                                          onClick:
                                            t[4] ||
                                            (t[4] = (f) => e.showPart('month')),
                                        },
                                        toDisplayString(
                                          e.months[
                                            e.displayMonth(
                                              e.calendarMonthDate(
                                                e.displayDate,
                                                c,
                                              ),
                                            )
                                          ].label,
                                        ),
                                        1,
                                      ),
                                      createBaseVNode(
                                        'button',
                                        {
                                          class: 'pdp-year',
                                          type: 'button',
                                          tabindex: '-1',
                                          onClick:
                                            t[5] ||
                                            (t[5] = (f) => e.showPart('year')),
                                        },
                                        toDisplayString(
                                          e.displayYear(
                                            e.calendarMonthDate(
                                              e.displayDate,
                                              c,
                                            ),
                                          ),
                                        ),
                                        1,
                                      ),
                                    ])
                                  ),
                                ),
                                128,
                              )),
                            ]),
                            createBaseVNode(
                              'button',
                              {
                                tabindex: '-1',
                                type: 'button',
                                class: normalizeClass([
                                  'pdp-arrow',
                                  {
                                    disabled: !e.checkDate(
                                      e.calendarMonthDate(e.displayDate, 1),
                                      'month',
                                    ),
                                  },
                                ]),
                                title: e.lang.translations.nextMonth,
                                onClick:
                                  t[6] ||
                                  (t[6] = (d) => e.changeSelectedMonth('add')),
                              },
                              [
                                renderSlot(e.$slots, 'left-arrow', {}, () => [
                                  createVNode(
                                    l,
                                    {
                                      direction: 'left',
                                      width: '10',
                                      height: '10',
                                      inverse: e.lang.dir.picker == 'ltr',
                                    },
                                    null,
                                    8,
                                    ['inverse'],
                                  ),
                                ]),
                              ],
                              10,
                              _hoisted_17$1,
                            ),
                          ]),
                        ]))
                      : createCommentVNode('', !0),
                    createBaseVNode(
                      'div',
                      _hoisted_18$1,
                      [
                        e.type.includes('date')
                          ? (openBlock(),
                            createElementBlock('div', _hoisted_19$1, [
                              (openBlock(!0),
                              createElementBlock(
                                Fragment,
                                null,
                                renderList(
                                  e.columnCount,
                                  (d, c) => (
                                    openBlock(),
                                    createElementBlock(
                                      'div',
                                      {
                                        key: c,
                                        class: 'pdp-column',
                                        'data-column': c,
                                      },
                                      [
                                        createBaseVNode('div', _hoisted_21$1, [
                                          (openBlock(!0),
                                          createElementBlock(
                                            Fragment,
                                            null,
                                            renderList(
                                              e.orderedWeekdays,
                                              (f, v) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'div',
                                                  {
                                                    key: v,
                                                    class: 'pdp-weekday',
                                                  },
                                                  toDisplayString(f),
                                                  1,
                                                )
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                        createBaseVNode('div', _hoisted_22$1, [
                                          (openBlock(!0),
                                          createElementBlock(
                                            Fragment,
                                            null,
                                            renderList(
                                              e.monthDays[c],
                                              (f, v) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'div',
                                                  { key: v },
                                                  [
                                                    (openBlock(!0),
                                                    createElementBlock(
                                                      Fragment,
                                                      null,
                                                      renderList(
                                                        f,
                                                        (M) => (
                                                          openBlock(),
                                                          createElementBlock(
                                                            'div',
                                                            {
                                                              key: M.raw
                                                                ? M.raw.toString()
                                                                : void 0,
                                                              class:
                                                                normalizeClass([
                                                                  'pdp-day',
                                                                  {
                                                                    empty:
                                                                      M.empty,
                                                                  },
                                                                  {
                                                                    friday:
                                                                      M.friday,
                                                                  },
                                                                  {
                                                                    weekend:
                                                                      M.weekend,
                                                                  },
                                                                  {
                                                                    today:
                                                                      M.today,
                                                                  },
                                                                  {
                                                                    'start-range':
                                                                      M.startRange,
                                                                  },
                                                                  {
                                                                    'end-range':
                                                                      M.endRange,
                                                                  },
                                                                  {
                                                                    disabled:
                                                                      M.disabled,
                                                                  },
                                                                  {
                                                                    'in-range':
                                                                      M.inRange,
                                                                  },
                                                                ]),
                                                              value: M.val,
                                                              onClick: (P) =>
                                                                M.raw &&
                                                                e.selectDate(
                                                                  M.raw,
                                                                  'date',
                                                                ),
                                                            },
                                                            toDisplayString(
                                                              M.val,
                                                            ),
                                                            11,
                                                            _hoisted_23$1,
                                                          )
                                                        ),
                                                      ),
                                                      128,
                                                    )),
                                                  ],
                                                )
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                      ],
                                      8,
                                      _hoisted_20$1,
                                    )
                                  ),
                                ),
                                128,
                              )),
                            ]))
                          : createCommentVNode('', !0),
                        e.type.includes('time')
                          ? (openBlock(),
                            createElementBlock('div', _hoisted_24$1, [
                              e.type == 'time'
                                ? (openBlock(),
                                  createElementBlock('div', _hoisted_25$1, [
                                    (openBlock(!0),
                                    createElementBlock(
                                      Fragment,
                                      null,
                                      renderList(
                                        e.columnCount,
                                        (d, c) => (
                                          openBlock(),
                                          createElementBlock('div', { key: c })
                                        ),
                                      ),
                                      128,
                                    )),
                                  ]))
                                : createCommentVNode('', !0),
                              createBaseVNode(
                                'div',
                                {
                                  class: normalizeClass([
                                    'pdp-moment',
                                    {
                                      'column-direction':
                                        e.mode == 'range' && e.columnCount == 1,
                                    },
                                  ]),
                                },
                                [
                                  (openBlock(!0),
                                  createElementBlock(
                                    Fragment,
                                    null,
                                    renderList(
                                      e.mode == 'range' ? 2 : 1,
                                      (d, c) => (
                                        openBlock(),
                                        createElementBlock(
                                          'div',
                                          {
                                            key: d,
                                            class: normalizeClass([
                                              {
                                                disabled:
                                                  e.selectedTimes[c] &&
                                                  e.isSelectedTimeDisabled(c),
                                              },
                                            ]),
                                          },
                                          [
                                            createBaseVNode(
                                              'div',
                                              _hoisted_26$1,
                                              [
                                                createBaseVNode(
                                                  'button',
                                                  {
                                                    type: 'button',
                                                    onTouchstart: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (f) =>
                                                          e.startChangeTime(
                                                            c,
                                                            'hour',
                                                            'add',
                                                          ),
                                                        ['prevent'],
                                                      ),
                                                      ['enter'],
                                                    ),
                                                    onTouchend:
                                                      t[7] ||
                                                      (t[7] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[8] ||
                                                      (t[8] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[9] ||
                                                      (t[9] = withKeys(
                                                        withModifiers(
                                                          (...f) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...f,
                                                            ),
                                                          ['prevent'],
                                                        ),
                                                        ['enter'],
                                                      )),
                                                  },
                                                  [
                                                    renderSlot(
                                                      e.$slots,
                                                      'up-arrow',
                                                      {},
                                                      () => [createVNode(l)],
                                                    ),
                                                  ],
                                                  40,
                                                  _hoisted_27$1,
                                                ),
                                                createTextVNode(
                                                  toDisplayString(
                                                    e.selectedTimes[c]
                                                      ? e.selectedTimes[c].hour(
                                                          'HH',
                                                        )
                                                      : e.core.hour('HH'),
                                                  ),
                                                  1,
                                                ),
                                                createBaseVNode(
                                                  'button',
                                                  {
                                                    type: 'button',
                                                    onTouchstart: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (f) =>
                                                          e.startChangeTime(
                                                            c,
                                                            'hour',
                                                            'sub',
                                                          ),
                                                        ['prevent'],
                                                      ),
                                                      ['enter'],
                                                    ),
                                                    onTouchend:
                                                      t[10] ||
                                                      (t[10] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[11] ||
                                                      (t[11] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[12] ||
                                                      (t[12] = withKeys(
                                                        withModifiers(
                                                          (...f) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...f,
                                                            ),
                                                          ['prevent'],
                                                        ),
                                                        ['enter'],
                                                      )),
                                                  },
                                                  [
                                                    renderSlot(
                                                      e.$slots,
                                                      'down-arrow',
                                                      {},
                                                      () => [
                                                        createVNode(l, {
                                                          direction: 'down',
                                                        }),
                                                      ],
                                                    ),
                                                  ],
                                                  40,
                                                  _hoisted_28$1,
                                                ),
                                              ],
                                            ),
                                            t[21] ||
                                              (t[21] = createTextVNode(
                                                ' : ',
                                                -1,
                                              )),
                                            createBaseVNode(
                                              'div',
                                              _hoisted_29$1,
                                              [
                                                createBaseVNode(
                                                  'button',
                                                  {
                                                    type: 'button',
                                                    onTouchstart: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (f) =>
                                                          e.startChangeTime(
                                                            c,
                                                            'minute',
                                                            'add',
                                                          ),
                                                        ['prevent'],
                                                      ),
                                                      ['enter'],
                                                    ),
                                                    onTouchend:
                                                      t[13] ||
                                                      (t[13] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[14] ||
                                                      (t[14] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[15] ||
                                                      (t[15] = withKeys(
                                                        withModifiers(
                                                          (...f) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...f,
                                                            ),
                                                          ['prevent'],
                                                        ),
                                                        ['enter'],
                                                      )),
                                                  },
                                                  [
                                                    renderSlot(
                                                      e.$slots,
                                                      'up-arrow',
                                                      {},
                                                      () => [createVNode(l)],
                                                    ),
                                                  ],
                                                  40,
                                                  _hoisted_30$1,
                                                ),
                                                createTextVNode(
                                                  toDisplayString(
                                                    e.selectedTimes[c]
                                                      ? e.selectedTimes[
                                                          c
                                                        ].minute('mm')
                                                      : e.core.minute('mm'),
                                                  ),
                                                  1,
                                                ),
                                                createBaseVNode(
                                                  'button',
                                                  {
                                                    type: 'button',
                                                    onTouchstart: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (f) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (f) =>
                                                          e.startChangeTime(
                                                            c,
                                                            'minute',
                                                            'sub',
                                                          ),
                                                        ['prevent'],
                                                      ),
                                                      ['enter'],
                                                    ),
                                                    onTouchend:
                                                      t[16] ||
                                                      (t[16] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[17] ||
                                                      (t[17] = withModifiers(
                                                        (...f) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...f,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[18] ||
                                                      (t[18] = withKeys(
                                                        withModifiers(
                                                          (...f) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...f,
                                                            ),
                                                          ['prevent'],
                                                        ),
                                                        ['enter'],
                                                      )),
                                                  },
                                                  [
                                                    renderSlot(
                                                      e.$slots,
                                                      'down-arrow',
                                                      {},
                                                      () => [
                                                        createVNode(l, {
                                                          direction: 'down',
                                                        }),
                                                      ],
                                                    ),
                                                  ],
                                                  40,
                                                  _hoisted_31$1,
                                                ),
                                              ],
                                            ),
                                          ],
                                          2,
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                ],
                                2,
                              ),
                            ]))
                          : createCommentVNode('', !0),
                      ],
                      512,
                    ),
                    createBaseVNode('div', _hoisted_32$1, [
                      createBaseVNode('div', null, [
                        renderSlot(e.$slots, 'footer'),
                        e.selectedDates[0]
                          ? (openBlock(),
                            createElementBlock(
                              'small',
                              _hoisted_33$1,
                              toDisplayString(
                                e.formatDateValue(
                                  e.selectedDates[0],
                                  e.formats.display,
                                ),
                              ),
                              1,
                            ))
                          : createCommentVNode('', !0),
                        e.selectedDates.length == 2
                          ? (openBlock(),
                            createElementBlock(
                              'small',
                              _hoisted_34$1,
                              ' - ' +
                                toDisplayString(
                                  e.formatDateValue(
                                    e.selectedDates[1],
                                    e.formats.display,
                                  ),
                                ),
                              1,
                            ))
                          : createCommentVNode('', !0),
                      ]),
                      createBaseVNode('div', null, [
                        e.checkDate(e.core, 'date')
                          ? (openBlock(),
                            createElementBlock(
                              'button',
                              {
                                key: 0,
                                class: 'pdp-today',
                                type: 'button',
                                tabindex: e.tabIndex,
                                onClick:
                                  t[19] ||
                                  (t[19] = (...d) =>
                                    e.goToToday && e.goToToday(...d)),
                              },
                              toDisplayString(e.lang.translations.now),
                              9,
                              _hoisted_35$1,
                            ))
                          : createCommentVNode('', !0),
                        !e.autoSubmit &&
                        !e.selectedDates.some((d) => e.isInDisable(d))
                          ? (openBlock(),
                            createElementBlock(
                              'button',
                              {
                                key: 1,
                                class: 'pdp-submit',
                                type: 'button',
                                tabindex: e.tabIndex,
                                onClick:
                                  t[20] || (t[20] = (d) => e.submitDate()),
                              },
                              toDisplayString(e.lang.translations.submit),
                              9,
                              _hoisted_36$1,
                            ))
                          : createCommentVNode('', !0),
                      ]),
                    ]),
                  ]),
                  e.shortcuts && Object.keys(e.shortcuts).length > 0
                    ? (openBlock(),
                      createElementBlock('ul', _hoisted_37$1, [
                        (openBlock(!0),
                        createElementBlock(
                          Fragment,
                          null,
                          renderList(
                            e.shortcuts,
                            (d, c) => (
                              openBlock(),
                              createElementBlock(
                                'li',
                                {
                                  key: c,
                                  class: normalizeClass({
                                    selected: !d.some(
                                      (f, v) =>
                                        !f.isSame(
                                          e.selectedDates[v] &&
                                            e.selectedDates[v].toString(
                                              'datetime',
                                            ),
                                        ),
                                    ),
                                  }),
                                  onClick: (f) => e.selectShorcut(d),
                                },
                                toDisplayString(c),
                                11,
                                _hoisted_38$1,
                              )
                            ),
                          ),
                          128,
                        )),
                      ]))
                    : createCommentVNode('', !0),
                ],
                16,
              ),
            ]))
          : createCommentVNode('', !0),
      ],
      2,
    )
  );
}
const DatePicker = _export_sfc(_sfc_main$1, [['render', _sfc_render]]),
  _hoisted_1 = ['dir'],
  _hoisted_2 = { class: 'language-switcher', 'aria-label': 'Language' },
  _hoisted_3 = ['onClick'],
  _hoisted_4 = { class: 'hero' },
  _hoisted_5 = { class: 'hero-copy' },
  _hoisted_6 = { class: 'eyebrow' },
  _hoisted_7 = { class: 'hero-tags' },
  _hoisted_8 = { class: 'workspace', 'aria-labelledby': 'playground-title' },
  _hoisted_9 = { class: 'section-heading' },
  _hoisted_10 = { id: 'playground-title' },
  _hoisted_11 = { class: 'playground-grid' },
  _hoisted_12 = { class: 'control-panel' },
  _hoisted_13 = { class: 'control-block' },
  _hoisted_14 = { for: 'calendar-select' },
  _hoisted_15 = ['value'],
  _hoisted_16 = { key: 0, class: 'control-block' },
  _hoisted_17 = { for: 'hijri-provider' },
  _hoisted_18 = { class: 'control-block mode-fieldset' },
  _hoisted_19 = { class: 'radio-option' },
  _hoisted_20 = { class: 'radio-option' },
  _hoisted_21 = { class: 'radio-option' },
  _hoisted_22 = { class: 'control-block mode-fieldset' },
  _hoisted_23 = { class: 'radio-option' },
  _hoisted_24 = { class: 'radio-option' },
  _hoisted_25 = { class: 'advanced-options' },
  _hoisted_26 = { class: 'advanced-fields' },
  _hoisted_27 = { value: 'active' },
  _hoisted_28 = ['value'],
  _hoisted_29 = ['placeholder'],
  _hoisted_30 = ['placeholder'],
  _hoisted_31 = { class: 'format-label' },
  _hoisted_32 = ['aria-label'],
  _hoisted_33 = { class: 'field-tooltip', role: 'tooltip' },
  _hoisted_34 = { class: 'format-label' },
  _hoisted_35 = ['aria-label'],
  _hoisted_36 = { class: 'field-tooltip', role: 'tooltip' },
  _hoisted_37 = { class: 'format-label' },
  _hoisted_38 = ['aria-label'],
  _hoisted_39 = { class: 'field-tooltip', role: 'tooltip' },
  _hoisted_40 = { class: 'format-label' },
  _hoisted_41 = ['aria-label'],
  _hoisted_42 = { class: 'field-tooltip', role: 'tooltip' },
  _hoisted_43 = { class: 'advanced-group' },
  _hoisted_44 = { class: 'check-option' },
  _hoisted_45 = { class: 'check-option' },
  _hoisted_46 = { class: 'check-option' },
  _hoisted_47 = { class: 'advanced-group behavior-group' },
  _hoisted_48 = { class: 'check-option' },
  _hoisted_49 = { class: 'check-option' },
  _hoisted_50 = { class: 'check-option' },
  _hoisted_51 = { class: 'check-option' },
  _hoisted_52 = { class: 'check-option' },
  _hoisted_53 = { class: 'check-option' },
  _hoisted_54 = { class: 'check-option' },
  _hoisted_55 = { class: 'check-option' },
  _hoisted_56 = { class: 'check-option' },
  _hoisted_57 = { class: 'check-option' },
  _hoisted_58 = ['placeholder'],
  _hoisted_59 = { value: 'default' },
  _hoisted_60 = { value: 'purple' },
  _hoisted_61 = { class: 'check-option advanced-toggle' },
  _hoisted_62 = { class: 'main-preview' },
  _hoisted_63 = { class: 'preview-topline' },
  _hoisted_64 = { class: 'preview-icon' },
  _hoisted_65 = { class: 'preview-label' },
  _hoisted_66 = { class: 'status-pill' },
  _hoisted_67 = ['dir'],
  _hoisted_68 = { class: 'value-panel' },
  _hoisted_69 = { class: 'playground-hint' },
  _hoisted_70 = { class: 'generated-code' },
  _hoisted_71 = { class: 'prop-guide', 'aria-labelledby': 'props-title' },
  _hoisted_72 = { class: 'section-heading' },
  _hoisted_73 = { class: 'section-kicker' },
  _hoisted_74 = { id: 'props-title' },
  _hoisted_75 = { class: 'prop-guide-grid' },
  _hoisted_76 = { class: 'prop-card-heading' },
  _hoisted_77 = { class: 'prop-examples' },
  _hoisted_78 = { class: 'gallery', 'aria-labelledby': 'gallery-title' },
  _hoisted_79 = { class: 'section-heading gallery-heading' },
  _hoisted_80 = { id: 'gallery-title' },
  _hoisted_81 = { class: 'calendar-grid' },
  _hoisted_82 = ['dir'],
  _hoisted_83 = { class: 'card-header' },
  _hoisted_84 = { class: 'card-title' },
  _hoisted_85 = { class: 'card-icon' },
  _hoisted_86 = { class: 'card-picker' },
  _hoisted_87 = { class: 'card-actions' },
  _hoisted_88 = { class: 'card-value' },
  _hoisted_89 = ['onClick'],
  _hoisted_90 = { class: 'gallery' },
  _hoisted_91 = { class: 'section-heading gallery-heading' },
  _hoisted_92 = { class: 'calendar-grid' },
  _hoisted_93 = { class: 'card-header' },
  _hoisted_94 = { class: 'card-title' },
  _hoisted_95 = { class: 'card-icon' },
  _hoisted_96 = { class: 'card-picker' },
  _hoisted_97 = ['onClick'],
  _hoisted_98 = { class: 'demo-footer' },
  _hoisted_99 = ['aria-label'],
  _hoisted_100 = { class: 'modal-header' },
  _hoisted_101 = ['aria-label'],
  _hoisted_102 = { class: 'code-tabs single-code' },
  _hoisted_103 = { class: 'modal-actions' },
  _sfc_main = defineComponent({
    __name: 'App',
    setup(e) {
      const t = [
          {
            id: 'jalali',
            title: { fa: 'شمسی', en: 'Jalali', ar: 'شمسي' },
            subtitle: 'Jalali / Persian',
            icon: '☼',
            direction: 'rtl',
            sample: '1404/01/15',
            from: '1300/01/01',
            to: '1499/01/01',
          },
          {
            id: 'gregorian',
            title: { fa: 'میلادی', en: 'Gregorian', ar: 'ميلادي' },
            subtitle: 'Gregorian',
            icon: '◷',
            direction: 'ltr',
            sample: '2025-04-04',
            from: '1900-01-01',
            to: '2100-01-01',
          },
          {
            id: 'hijri',
            title: { fa: 'قمری / هجری', en: 'Hijri', ar: 'هجري' },
            subtitle: 'Umm al-Qura / Tabular',
            icon: '☾',
            direction: 'rtl',
            sample: '1446-10-06',
            from: '1400-01-01',
            to: '1500-01-01',
          },
          {
            id: 'hebrew',
            title: { fa: 'عبری', en: 'Hebrew', ar: 'عبري' },
            subtitle: 'Hebrew calendar',
            icon: '✡',
            direction: 'ltr',
            sample: '5785-07-06',
            from: '5780-01-01',
            to: '5790-01-01',
          },
          {
            id: 'buddhist',
            title: {
              fa: 'بودایی تایلندی',
              en: 'Thai Buddhist',
              ar: 'البوذي التايلندي',
            },
            subtitle: 'Buddhist Era',
            icon: '◉',
            direction: 'ltr',
            sample: '2568-04-04',
            from: '2500-01-01',
            to: '2600-01-01',
          },
          {
            id: 'chinese',
            title: { fa: 'چینی', en: 'Chinese', ar: 'الصيني' },
            subtitle: 'Chinese calendar',
            icon: '中',
            direction: 'ltr',
            sample: '2025-03-07',
            from: '1900-01-01',
            to: '2100-01-01',
          },
        ],
        s = [
          {
            name: 'calendar',
            type: 'Calendar',
            defaultValue: 'locale-based',
            description: {
              fa: 'تقویم فعال برای تبدیل، نمایش و حرکت بین تاریخ‌ها.',
              en: 'Calendar used to parse, display, and navigate dates.',
              ar: 'التقويم المستخدم لتحليل التواريخ وعرضها والتنقل بينها.',
            },
            examples: ['calendar="jalali"', 'calendar="gregorian"'],
          },
          {
            name: 'modelCalendar',
            type: 'Calendar | active',
            defaultValue: 'active',
            description: {
              fa: 'تقویم مستقل برای سریال‌سازی مقدار v-model، بدون تغییر تقویم نمایشی.',
              en: 'Calendar used to serialize v-model without changing the visible calendar.',
              ar: 'تقويم مستقل لتسلسل قيمة v-model دون تغيير التقويم المعروض.',
            },
            examples: ['model-calendar="gregorian"', 'model-calendar="active"'],
          },
          {
            name: 'type',
            type: 'date | time | datetime',
            defaultValue: 'date',
            description: {
              fa: 'نوع مقداری که کاربر انتخاب می‌کند: تاریخ، زمان یا هر دو.',
              en: 'Value selected by the user: date, time, or both.',
              ar: 'نوع القيمة التي يحددها المستخدم: تاريخ أو وقت أو كلاهما.',
            },
            examples: ['type="date"', 'type="datetime"'],
          },
          {
            name: 'mode',
            type: 'single | range',
            defaultValue: 'range',
            description: {
              fa: 'انتخاب یک مقدار یا یک بازه‌ی شروع و پایان.',
              en: 'Select one value or a start/end range.',
              ar: 'اختيار قيمة واحدة أو نطاق ببداية ونهاية.',
            },
            examples: ['mode="single"', 'mode="range"'],
          },
          {
            name: 'locale',
            type: 'String',
            defaultValue: 'calendar-aware',
            description: {
              fa: 'زبان متن‌ها و برچسب‌های تقویم؛ می‌تواند فهرستی با fallback کاما جدا باشد.',
              en: 'UI language and labels; comma-separated fallback locales are supported.',
              ar: 'لغة الواجهة والتسميات، مع دعم قائمة لغات بديلة مفصولة بفواصل.',
            },
            examples: ['locale="fa"', 'locale="en,fa"'],
          },
          {
            name: 'hijriProvider',
            type: 'ummalqura | tabular',
            defaultValue: 'ummalqura',
            description: {
              fa: 'روش محاسبه‌ی تاریخ هجری را انتخاب می‌کند.',
              en: 'Chooses the Hijri calculation method.',
              ar: 'يحدد طريقة حساب التاريخ الهجري.',
            },
            examples: [
              'hijri-provider="ummalqura"',
              'hijri-provider="tabular"',
            ],
          },
          {
            name: 'format',
            type: 'String',
            defaultValue: 'type-based',
            description: {
              fa: 'فقط شکل رشته‌ی v-model را تعیین می‌کند؛ متن input و footer را تغییر نمی‌دهد.',
              en: 'Controls only the serialized v-model string; it does not format the input text or footer.',
              ar: 'يحدد شكل سلسلة v-model فقط، ولا يغير نص الإدخال أو التسمية السفلية.',
            },
            examples: ['format="YYYY-MM-DD"', 'format="jYYYY/jMM/jDD"'],
          },
          {
            name: 'inputFormat',
            type: 'String',
            defaultValue: 'type-based',
            description: {
              fa: 'قالب نمایش و parse شدن متن داخل فیلد ورودی؛ روی رشته‌ی v-model اثر ندارد.',
              en: 'Displays and parses the input text; it does not change the serialized v-model string.',
              ar: 'يعرض نص الإدخال ويحلله، ولا يغير سلسلة v-model الناتجة.',
            },
            examples: [
              'input-format="DD.MM.YYYY"',
              'input-format="jYY/jMM/jDD"',
            ],
          },
          {
            name: 'displayFormat',
            type: 'String',
            defaultValue: 'type-based',
            description: {
              fa: 'فقط برچسب خوانای پایین تقویم باز را تغییر می‌دهد؛ روی input و v-model اثر ندارد.',
              en: 'Changes only the readable footer label; it does not change the input or v-model.',
              ar: 'يغير التسمية أسفل التقويم المفتوح فقط، ولا يغير الإدخال أو v-model.',
            },
            examples: [
              'display-format="D MMMM YYYY"',
              'display-format="jYY/jMM/jDD"',
            ],
          },
          {
            name: 'inputMask',
            type: 'String | Object',
            defaultValue: 'calendar-based',
            description: {
              fa: 'کاراکترها، ترتیب و جداکننده‌های تایپ را کنترل می‌کند؛ blocks بازه‌ی هر token را تعیین می‌کند و مقدار v-model را قالب‌بندی نمی‌کند.',
              en: 'Restricts typed characters, order, and separators; blocks define per-token ranges and it does not serialize v-model.',
              ar: 'يقيد أحرف وترتيب وفواصل الإدخال؛ تحدد blocks نطاق كل token ولا تقوم بتسلسل v-model.',
            },
            examples: [
              'input-mask="YYYY/MM/DD"',
              `:input-mask="{ pattern: 'jYY/jMM-jDD', autoInsert: true }"`,
              `:input-mask="{ pattern: 'YYYY/MM/DD HH:mm', blocks: { YYYY: { from: 1970, to: 2030 }, MM: { from: 1, to: 12 }, DD: { from: 1, to: 31 }, HH: { from: 0, to: 23 }, mm: { from: 0, to: 59 } } }"`,
            ],
          },
          {
            name: 'from / to',
            type: 'String',
            defaultValue: '1300 / 1499',
            description: {
              fa: 'حداقل و حداکثر تاریخ یا زمان قابل انتخاب را مشخص می‌کنند.',
              en: 'Set the minimum and maximum selectable date or time.',
              ar: 'يحددان أدنى وأقصى تاريخ أو وقت يمكن اختياره.',
            },
            examples: [
              'from="1400/01/01" to="1410/12/29"',
              'from="09:00" to="18:00"',
            ],
          },
          {
            name: 'column',
            type: 'Number | Record',
            defaultValue: '{ 576: 1 }',
            description: {
              fa: 'تعداد ستون‌های تقویم را ثابت یا بر اساس breakpoint تنظیم می‌کند.',
              en: 'Sets visible calendar columns directly or by responsive breakpoint.',
              ar: 'يضبط عدد أعمدة التقويم مباشرة أو حسب نقاط التوقف responsive.',
            },
            examples: [':column="2"', ':column="{ 576: 2, 900: 3 }"'],
          },
          {
            name: 'weekStartsOn',
            type: 'Number | auto',
            defaultValue: 'auto',
            description: {
              fa: 'روز شروع هفته را از ۰ تا ۶ یا به‌صورت پیش‌فرض تقویم تعیین می‌کند.',
              en: 'Sets the first weekday from 0 to 6 or uses the calendar default.',
              ar: 'يحدد أول يوم في الأسبوع من 0 إلى 6 أو يستخدم إعداد التقويم.',
            },
            examples: [':week-starts-on="1"', 'week-starts-on="auto"'],
          },
          {
            name: 'weekendDays',
            type: 'Number[]',
            defaultValue: 'calendar-aware',
            description: {
              fa: 'روزهای تعطیل هفتگی را برای رنگ‌بندی و رفتار تقویم مشخص می‌کند.',
              en: 'Defines weekly holidays used for calendar styling and behavior.',
              ar: 'يحدد العطلات الأسبوعية المستخدمة في تنسيق التقويم وسلوكه.',
            },
            examples: [':weekend-days="[5, 6]"', ':weekend-days="[0]"'],
          },
          {
            name: 'minuteStep / hourStep',
            type: 'Number',
            defaultValue: '1 / 1',
            description: {
              fa: 'گام افزایش دقیقه و ساعت در انتخاب‌گر زمان.',
              en: 'Minute and hour increments in the time picker.',
              ar: 'مقدار زيادة الدقائق والساعات في منتقي الوقت.',
            },
            examples: [':minute-step="5"', ':hour-step="2"'],
          },
          {
            name: 'autoSubmit',
            type: 'Boolean',
            defaultValue: 'true',
            description: {
              fa: 'پس از کامل شدن انتخاب، مقدار را خودکار ثبت می‌کند یا منتظر دکمه submit می‌ماند.',
              en: 'Submits after a complete selection or waits for the submit action.',
              ar: 'يرسل القيمة بعد اكتمال الاختيار أو ينتظر إجراء الإرسال.',
            },
            examples: ['auto-submit', ':auto-submit="false"'],
          },
          {
            name: 'clearable',
            type: 'Boolean',
            defaultValue: 'false',
            description: {
              fa: 'دکمه‌ی پاک‌کردن مقدار را نمایش می‌دهد.',
              en: 'Shows a control for clearing the selected value.',
              ar: 'يعرض زرًا لمسح القيمة المحددة.',
            },
            examples: ['clearable', ':clearable="false"'],
          },
          {
            name: 'clickOn',
            type: 'all | input | icon | none',
            defaultValue: 'all',
            description: {
              fa: 'مشخص می‌کند کلیک روی کدام بخش picker را باز کند.',
              en: 'Chooses which area opens the picker.',
              ar: 'يحدد الجزء الذي يفتح منتقي التاريخ عند النقر.',
            },
            examples: ['click-on="input"', 'click-on="icon"'],
          },
          {
            name: 'modal / show',
            type: 'Boolean',
            defaultValue: 'false',
            description: {
              fa: 'modal نحوه‌ی نمایش را modal می‌کند؛ show باز یا بسته بودن را کنترل می‌کند.',
              en: 'modal changes presentation; show controls whether the picker is open.',
              ar: 'modal يغير طريقة العرض، و show يتحكم في فتح المنتقي.',
            },
            examples: ['modal', ':show="isOpen"'],
          },
          {
            name: 'label',
            type: 'String',
            defaultValue: '—',
            description: {
              fa: 'برچسب دسترس‌پذیر و قابل نمایش برای فیلد ورودی.',
              en: 'Visible and accessible label for the input field.',
              ar: 'تسمية مرئية وميسرة لحقل الإدخال.',
            },
            examples: ['label="Start date"', 'label="تاریخ شروع"'],
          },
          {
            name: 'dualInput',
            type: 'Boolean',
            defaultValue: 'false',
            description: {
              fa: 'در حالت range دو فیلد جدا برای شروع و پایان نمایش می‌دهد.',
              en: 'Renders separate start and end inputs in range mode.',
              ar: 'يعرض حقلي بداية ونهاية منفصلين في وضع النطاق.',
            },
            examples: ['dual-input', ':dual-input="false"'],
          },
          {
            name: 'iconInside',
            type: 'Boolean',
            defaultValue: 'false',
            description: {
              fa: 'آیکن تقویم را داخل کادر input قرار می‌دهد.',
              en: 'Places the calendar icon inside the input box.',
              ar: 'يضع أيقونة التقويم داخل حقل الإدخال.',
            },
            examples: ['icon-inside', ':icon-inside="false"'],
          },
          {
            name: 'shortcut',
            type: 'Boolean | Object',
            defaultValue: 'false',
            description: {
              fa: 'میانبرهای تاریخ و زمان را فعال یا با object سفارشی می‌کند.',
              en: 'Enables date/time shortcuts or configures custom shortcuts with an object.',
              ar: 'يفعل اختصارات التاريخ والوقت أو يخصصها بكائن.',
            },
            examples: ['shortcut', ':shortcut="{ today: true }"'],
          },
          {
            name: 'disable',
            type: 'Array | String | Function | RegExp',
            defaultValue: '—',
            description: {
              fa: 'روزها یا زمان‌های غیرقابل انتخاب را با چند نوع قانون مشخص می‌کند.',
              en: 'Disables dates or times using a list, string, function, or regular expression.',
              ar: 'يعطل تواريخ أو أوقاتًا باستخدام قائمة أو نص أو دالة أو تعبير منتظم.',
            },
            examples: [
              'disable="1404/01/01"',
              ':disable="date => date.day() === 5"',
            ],
          },
          {
            name: 'localeConfig',
            type: 'Object',
            defaultValue: '—',
            description: {
              fa: 'رشته‌های ترجمه و تنظیمات زبان را اضافه یا override می‌کند.',
              en: 'Adds or overrides localized strings and locale settings.',
              ar: 'يضيف أو يستبدل النصوص وإعدادات اللغة.',
            },
            examples: [
              `:locale-config="{ today: 'Now' }"`,
              ':locale-config="customLocale"',
            ],
          },
          {
            name: 'styles',
            type: 'Object',
            defaultValue: '—',
            description: {
              fa: 'استایل‌های داخلی کامپوننت را برای ظاهر سفارشی override می‌کند.',
              en: 'Overrides internal component styles for visual customization.',
              ar: 'يستبدل أنماط المكوّن الداخلية للتخصيص البصري.',
            },
            examples: [
              `:styles="{ primaryColor: '#7c3aed' }"`,
              ':styles="themeStyles"',
            ],
          },
          {
            name: 'color',
            type: 'String',
            defaultValue: 'theme default',
            description: {
              fa: 'رنگ آماده‌ی رابط را از بین blue، red، pink، orange، green، purple و gray انتخاب می‌کند.',
              en: 'Selects a preset UI color: blue, red, pink, orange, green, purple, or gray.',
              ar: 'يختار لون الواجهة من blue أو red أو pink أو orange أو green أو purple أو gray.',
            },
            examples: ['color="blue"', 'color="purple"'],
          },
        ],
        r = {
          fa: {
            eyebrow: 'Vue 3 · انتخاب‌گر تاریخ عمومی',
            title: 'یک datepicker، برای همه‌ی تقویم‌ها',
            intro:
              'نمونه‌ی تعاملی کتابخانه را ببینید، تنظیمات را تغییر دهید و کد هر نمونه را کپی کنید.',
            playground: 'آزمایش تعاملی',
            reset: 'بازنشانی',
            active: 'تقویم فعال',
            provider: 'روش محاسبه قمری',
            single: 'یک مقدار',
            range: 'بازه',
            type: 'نوع ورودی',
            date: 'تاریخ',
            time: 'زمان',
            datetime: 'تاریخ و زمان',
            gallery: 'نمونه‌های تقویم',
            galleryHint: 'هر کارت یک نمونه‌ی مستقل و قابل کپی است.',
            output: 'خروجی',
            value: 'مقدار v-model',
            ready: 'آماده‌ی تست',
            code: 'نمایش کد',
            close: 'بستن',
            copy: 'کپی کد',
            copied: 'کپی شد',
            timeSamples: 'نمونه‌های زمان و بازه',
            formatGuide: 'راهنمای فرمت‌ها',
            formatInput: 'فرمت ورودی',
            formatMask: 'ماسک ورودی',
            formatDisplay: 'فرمت نمایش',
            formatGuideIntro:
              'این سه تنظیم جدا از هم کار می‌کنند: مقدار v-model، متن ورودی و برچسب پایین تقویم.',
            inputFormatGuide:
              'قالبی است که کاربر در فیلد متنی وارد می‌کند. مثال: jYY/jMM/jDD برای تاریخ جلالی.',
            inputMaskGuide:
              'ورودی را به کاراکترها و ترتیب مجاز محدود می‌کند؛ blocks برای بازه‌ی هر token، روز ۰۱ تا ۳۱، ماه ۰۱ تا ۱۲ و strict برای بررسی تاریخ کامل است.',
            displayFormatGuide:
              'فقط برچسب خوانای پایین تقویم باز را تغییر می‌دهد و مقدار input یا v-model را تغییر نمی‌دهد.',
            formatExample: 'مثال',
            propsGuide: 'راهنمای کامل پراپ‌ها',
            propsGuideKicker: 'راهنمای پراپ‌ها',
            propsGuideIntro:
              'همه‌ی پراپ‌های ورودی کامپوننت را با کاربرد، مقدار پیش‌فرض و چند مثال ببینید.',
            defaultValue: 'پیش‌فرض',
            examples: 'مثال‌ها',
            modelCalendar: 'تقویم v-model',
            modelCalendarActive: 'تقویم فعال',
            format: 'فرمت v-model',
            modelFormatGuide:
              'فقط شکل رشته‌ی v-model را تعیین می‌کند؛ متن input و برچسب پایین تقویم را تغییر نمی‌دهد.',
            modal: 'نمایش modal',
            show: 'باز بودن اجباری',
            label: 'برچسب ورودی',
            shortcut: 'میانبرها',
            localeConfig: 'سفارشی‌سازی ترجمه',
            styles: 'استایل سفارشی',
            stylesDefault: 'پیش‌فرض',
            stylesPurple: 'تم بنفش',
            liveHint:
              'تاریخ را دستی وارد کنید؛ پس از blur، مقدار تقویم و ماه نمایشی همگام می‌شوند.',
          },
          en: {
            eyebrow: 'Vue 3 · Universal datepicker',
            title: 'One datepicker for every calendar',
            intro:
              'Try the library interactively, change its settings, and copy the code for each example.',
            playground: 'Interactive playground',
            reset: 'Reset',
            active: 'Active calendar',
            provider: 'Hijri calculation',
            single: 'Single',
            range: 'Range',
            type: 'Input type',
            date: 'Date',
            time: 'Time',
            datetime: 'Date & time',
            gallery: 'Calendar gallery',
            galleryHint: 'Each card is an independent, copyable example.',
            output: 'Output',
            value: 'v-model value',
            ready: 'Ready to test',
            code: 'View code',
            close: 'Close',
            copy: 'Copy code',
            copied: 'Copied',
            timeSamples: 'Time and range examples',
            formatGuide: 'Format guide',
            formatInput: 'Input format',
            formatMask: 'Input mask',
            formatDisplay: 'Display format',
            formatGuideIntro:
              'These three settings have separate jobs: the v-model value, the text input, and the label at the bottom of the open calendar.',
            inputFormatGuide:
              'Controls the text the user enters. Example: jYY/jMM/jDD for a Jalali date.',
            inputMaskGuide:
              'Restricts characters and order; blocks define token ranges, day is 01–31, month 01–12, and strict validates the complete date.',
            displayFormatGuide:
              'Changes only the readable label at the bottom of the open calendar; it does not change the input or v-model.',
            formatExample: 'Example',
            propsGuide: 'Complete props guide',
            propsGuideKicker: 'PROPS GUIDE',
            propsGuideIntro:
              'Review every component input prop with its purpose, default value, and multiple examples.',
            defaultValue: 'Default',
            examples: 'Examples',
            modelCalendar: 'v-model calendar',
            modelCalendarActive: 'Active calendar',
            format: 'v-model format',
            modelFormatGuide:
              'Controls only the serialized v-model string; it does not format the input text or the calendar footer.',
            modal: 'Modal presentation',
            show: 'Force open',
            label: 'Input label',
            shortcut: 'Shortcuts',
            localeConfig: 'Custom translations',
            styles: 'Custom styles',
            stylesDefault: 'Default',
            stylesPurple: 'Purple theme',
            liveHint:
              'Type a date manually; on blur, the model and visible calendar stay in sync.',
          },
          ar: {
            eyebrow: 'Vue 3 · منتقي تواريخ شامل',
            title: 'منتقي واحد لكل التقاويم',
            intro: 'جرّب المكتبة تفاعلياً، غيّر الإعدادات وانسخ كود كل مثال.',
            playground: 'التجربة التفاعلية',
            reset: 'إعادة الضبط',
            active: 'التقويم النشط',
            provider: 'حساب هجري',
            single: 'قيمة واحدة',
            range: 'نطاق',
            type: 'نوع الإدخال',
            date: 'تاريخ',
            time: 'وقت',
            datetime: 'تاريخ ووقت',
            gallery: 'معرض التقاويم',
            galleryHint: 'كل بطاقة مثال مستقل وقابل للنسخ.',
            output: 'الناتج',
            value: 'قيمة v-model',
            ready: 'جاهز للاختبار',
            code: 'عرض الكود',
            close: 'إغلاق',
            copy: 'نسخ الكود',
            copied: 'تم النسخ',
            timeSamples: 'أمثلة الوقت والنطاق',
            formatGuide: 'دليل التنسيقات',
            formatInput: 'تنسيق الإدخال',
            formatMask: 'قناع الإدخال',
            formatDisplay: 'تنسيق العرض',
            formatGuideIntro:
              'تعمل هذه الإعدادات الثلاثة بشكل مستقل: قيمة v-model، وحقل الإدخال، والتسمية أسفل التقويم المفتوح.',
            inputFormatGuide:
              'يحدد النص الذي يدخله المستخدم. مثال: jYY/jMM/jDD للتاريخ الجلالي.',
            inputMaskGuide:
              'يقيد الأحرف والترتيب؛ blocks تحدد نطاق كل token، واليوم 01–31 والشهر 01–12، وstrict يحقق التاريخ الكامل.',
            displayFormatGuide:
              'يغير التسمية المقروءة أسفل التقويم المفتوح فقط، ولا يغير حقل الإدخال أو v-model.',
            formatExample: 'مثال',
            propsGuide: 'الدليل الكامل للخصائص',
            propsGuideKicker: 'دليل الخصائص',
            propsGuideIntro:
              'راجع كل خاصية إدخال مع وظيفتها وقيمتها الافتراضية وأمثلة متعددة.',
            defaultValue: 'الافتراضي',
            examples: 'أمثلة',
            modelCalendar: 'تقويم v-model',
            modelCalendarActive: 'التقويم النشط',
            format: 'تنسيق v-model',
            modelFormatGuide:
              'يحدد شكل سلسلة v-model فقط، ولا يغير نص الإدخال أو تسمية أسفل التقويم.',
            modal: 'عرض مشروط',
            show: 'فتح إجباري',
            label: 'تسمية الإدخال',
            shortcut: 'الاختصارات',
            localeConfig: 'ترجمات مخصصة',
            styles: 'أنماط مخصصة',
            stylesDefault: 'الافتراضي',
            stylesPurple: 'سمة بنفسجية',
            liveHint:
              'أدخل التاريخ يدوياً؛ بعد مغادرة الحقل يتزامن النموذج والشهر المعروض.',
          },
        },
        n = ref('en'),
        i = ref('jalali'),
        a = ref('ummalqura'),
        o = ref('single'),
        l = ref('date'),
        d = ref('1404/01/15'),
        c = ref('1404/01/15'),
        f = reactive(Object.fromEntries(t.map((C) => [C.id, C.sample]))),
        v = ref(null),
        M = ref(!1),
        P = ref('blue'),
        B = ref(''),
        $ = ref(''),
        I = ref('auto'),
        O = ref([]),
        j = ref(''),
        E = ref('active'),
        F = ref('2025-04-04'),
        q = ref(''),
        z = ref(''),
        G = ref(''),
        ee = ref(''),
        J = ref(1),
        te = ref(!0),
        ne = ref(!0),
        ie = ref(!0),
        ce = ref(!0),
        ue = ref(!1),
        L = ref(!1),
        H = ref(!1),
        x = ref(!1),
        X = ref(!1),
        se = ref(''),
        Q = ref(!1),
        K = ref(!1),
        de = ref('default'),
        he = ref(1),
        fe = ref(1),
        re = ref('all'),
        T = computed(() => r[n.value]),
        ge = computed(() =>
          de.value === 'purple'
            ? {
                'primary-color': '#7c3aed',
                'secondary-color': '#ddd6fe',
                'in-range-background': '#ede9fe',
              }
            : void 0,
        ),
        pe = computed(() =>
          K.value
            ? {
                en: { translations: { today: 'Now' } },
                fa: { translations: { today: 'اکنون' } },
                ar: { translations: { today: 'الآن' } },
              }
            : void 0,
        ),
        ye = {
          YYYY: { from: 1970, to: 2030 },
          MM: { from: 1, to: 12 },
          DD: { from: 1, to: 31 },
          HH: { from: 0, to: 23 },
          mm: { from: 0, to: 59 },
        },
        u = computed(() => t.find((C) => C.id === i.value) || t[0]),
        m = computed(() => (n.value === 'en' ? 'ltr' : 'rtl')),
        y = {
          jalali: 'fa',
          gregorian: 'en',
          hijri: 'ar',
          hebrew: 'he',
          buddhist: 'th',
          chinese: 'zh',
        };
      function S(C) {
        return n.value === 'en' ? y[C] : n.value;
      }
      const D = computed(() => [
          {
            title: T.value.time,
            type: 'time',
            mode: 'single',
            value: '14:30',
            icon: '◷',
          },
          {
            title: T.value.range,
            type: 'time',
            mode: 'range',
            value: '09:00 - 17:30',
            icon: '↔',
          },
          {
            title: T.value.datetime,
            type: 'datetime',
            mode: 'single',
            value: '2025-04-04 14:30',
            icon: '◫',
          },
        ]),
        k = (C, h = 'date', g = 'single') => ({
          title: `${C.title[n.value]} · ${h}`,
          html: `<DatePicker
  v-model="value"
  calendar="${C.id}"
  type="${h}"
  mode="${g}"
  ${
    C.id === 'hijri'
      ? `hijri-provider="ummalqura"
  `
      : ''
  }/>`,
        }),
        V = computed(() => {
          const C = u.value;
          return [
            '<DatePicker',
            '  v-model="value"',
            `  calendar="${C.id}"`,
            `  type="${l.value}"`,
            `  mode="${o.value}"`,
            `  locale="${j.value || S(C.id)}"`,
            E.value !== 'active' ? `  model-calendar="${E.value}"` : '',
            `  :column="${J.value}"`,
            `  color="${P.value}"`,
            `  week-starts-on="${I.value}"`,
            `  click-on="${re.value}"`,
            `  :minute-step="${he.value}"`,
            `  :hour-step="${fe.value}"`,
            te.value ? '  clearable' : '  :clearable="false"',
            ne.value ? '  auto-submit' : '  :auto-submit="false"',
            q.value ? `  format="${q.value}"` : '',
            z.value ? `  input-format="${z.value}"` : '',
            G.value
              ? `  :input-mask="{ pattern: '${G.value}', autoInsert: ${ie.value}, strict: ${ce.value}${ue.value ? ', blocks: { YYYY: { from: 1970, to: 2030 }, MM: { from: 1, to: 12 }, DD: { from: 1, to: 31 }, HH: { from: 0, to: 23 }, mm: { from: 0, to: 59 } }' : ''} }"`
              : '',
            ee.value ? `  display-format="${ee.value}"` : '',
            L.value ? '  icon-inside' : '',
            H.value ? '  dual-input' : '',
            x.value ? '  modal' : '',
            X.value ? '  show' : '',
            se.value ? `  label="${se.value}"` : '',
            Q.value ? '  shortcut' : '',
            K.value
              ? `  :locale-config="{ en: { translations: { today: 'Now' } } }"`
              : '',
            de.value === 'purple'
              ? `  :styles="{ 'primary-color': '#7c3aed' }"`
              : '',
            B.value ? `  from="${B.value}"` : '',
            $.value ? `  to="${$.value}"` : '',
            O.value.length ? `  :weekend-days="[${O.value.join(', ')}]"` : '',
            C.id === 'hijri' ? '  hijri-provider="ummalqura"' : '',
            '/>',
          ].filter(Boolean).join(`
`);
        });
      function w(C) {
        d.value = o.value === 'range' ? [C, C] : C;
      }
      function _() {
        return l.value === 'time'
          ? '14:30'
          : l.value === 'datetime'
            ? `${c.value} 14:30`
            : c.value;
      }
      (watch(i, (C) => {
        const h = t.find((g) => g.id === C).sample;
        ((c.value = h),
          w(h),
          (l.value = 'date'),
          (B.value = ''),
          ($.value = ''),
          (I.value = 'auto'),
          (O.value = []));
      }),
        watch(a, () => {
          i.value === 'hijri' && ((c.value = '1446-10-06'), w('1446-10-06'));
        }),
        watch(l, (C) => {
          let h = c.value;
          (C === 'time'
            ? (h = '14:30')
            : C === 'datetime' && (h = `${c.value} 14:30`),
            C === 'time' && o.value === 'range' ? (d.value = void 0) : w(h));
        }),
        watch(o, (C) => {
          if (C === 'range') {
            if (l.value === 'time') d.value = void 0;
            else if (!Array.isArray(d.value)) {
              const h = d.value ?? _();
              d.value = [h, h];
            }
          } else Array.isArray(d.value) && (d.value = d.value[0] ?? _());
        }));
      function b(C) {
        ((v.value = C), (M.value = !1));
      }
      async function A() {
        v.value &&
          (await navigator.clipboard?.writeText(v.value.html), (M.value = !0));
      }
      function N() {
        ((n.value = 'en'),
          (i.value = 'jalali'),
          (a.value = 'ummalqura'),
          (o.value = 'single'),
          (l.value = 'date'),
          (c.value = '1404/01/15'),
          (d.value = '1404/01/15'),
          (P.value = 'blue'),
          (B.value = ''),
          ($.value = ''),
          (I.value = 'auto'),
          (O.value = []),
          (j.value = ''),
          (E.value = 'active'),
          (F.value = '2025-04-04'),
          (q.value = ''),
          (z.value = ''),
          (G.value = ''),
          (ee.value = ''),
          (J.value = 1),
          (te.value = !0),
          (ne.value = !0),
          (ie.value = !0),
          (ce.value = !0),
          (ue.value = !1),
          (L.value = !1),
          (H.value = !1),
          (x.value = !1),
          (X.value = !1),
          (se.value = ''),
          (Q.value = !1),
          (K.value = !1),
          (de.value = 'default'),
          (he.value = 1),
          (fe.value = 1),
          (re.value = 'all'));
      }
      return (C, h) => (
        openBlock(),
        createElementBlock(
          'main',
          { class: 'demo-shell', dir: m.value },
          [
            createBaseVNode('nav', _hoisted_2, [
              (openBlock(),
              createElementBlock(
                Fragment,
                null,
                renderList(['fa', 'en', 'ar'], (g) =>
                  createBaseVNode(
                    'button',
                    {
                      key: g,
                      type: 'button',
                      class: normalizeClass({ selected: n.value === g }),
                      onClick: (R) => (n.value = g),
                    },
                    toDisplayString(
                      g === 'fa' ? 'فارسی' : g === 'en' ? 'English' : 'العربية',
                    ),
                    11,
                    _hoisted_3,
                  ),
                ),
                64,
              )),
            ]),
            createBaseVNode('section', _hoisted_4, [
              createBaseVNode('div', _hoisted_5, [
                createBaseVNode('div', _hoisted_6, [
                  h[43] ||
                    (h[43] = createBaseVNode(
                      'span',
                      { class: 'eyebrow-dot' },
                      null,
                      -1,
                    )),
                  createTextVNode(toDisplayString(T.value.eyebrow), 1),
                ]),
                createBaseVNode('h1', null, toDisplayString(T.value.title), 1),
                createBaseVNode('p', null, [
                  createTextVNode(toDisplayString(T.value.intro) + ' ', 1),
                  h[44] ||
                    (h[44] = createBaseVNode(
                      'code',
                      null,
                      '@h-sanadgol/vue3-multi-calendar-datepicker',
                      -1,
                    )),
                ]),
                createBaseVNode('div', _hoisted_7, [
                  (openBlock(),
                  createElementBlock(
                    Fragment,
                    null,
                    renderList(t, (g) =>
                      createBaseVNode(
                        'span',
                        { key: g.id },
                        toDisplayString(g.title[n.value]),
                        1,
                      ),
                    ),
                    64,
                  )),
                ]),
              ]),
              h[45] ||
                (h[45] = createBaseVNode(
                  'div',
                  { class: 'hero-mark', 'aria-hidden': 'true' },
                  [
                    createBaseVNode('div', { class: 'orbit orbit-one' }),
                    createBaseVNode('div', { class: 'orbit orbit-two' }),
                    createBaseVNode('div', { class: 'sun' }, '◐'),
                  ],
                  -1,
                )),
            ]),
            createBaseVNode('section', _hoisted_8, [
              createBaseVNode('div', _hoisted_9, [
                createBaseVNode('div', null, [
                  h[46] ||
                    (h[46] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'PLAYGROUND',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    _hoisted_10,
                    toDisplayString(T.value.playground),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'button',
                  { class: 'reset-button', type: 'button', onClick: N },
                  toDisplayString(T.value.reset),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_11, [
                createBaseVNode('aside', _hoisted_12, [
                  createBaseVNode('div', _hoisted_13, [
                    createBaseVNode(
                      'label',
                      _hoisted_14,
                      toDisplayString(T.value.active),
                      1,
                    ),
                    withDirectives(
                      createBaseVNode(
                        'select',
                        {
                          id: 'calendar-select',
                          'onUpdate:modelValue':
                            h[0] || (h[0] = (g) => (i.value = g)),
                        },
                        [
                          (openBlock(),
                          createElementBlock(
                            Fragment,
                            null,
                            renderList(t, (g) =>
                              createBaseVNode(
                                'option',
                                { key: g.id, value: g.id },
                                toDisplayString(g.title[n.value]) +
                                  ' — ' +
                                  toDisplayString(g.subtitle),
                                9,
                                _hoisted_15,
                              ),
                            ),
                            64,
                          )),
                        ],
                        512,
                      ),
                      [[vModelSelect, i.value]],
                    ),
                  ]),
                  i.value === 'hijri'
                    ? (openBlock(),
                      createElementBlock('div', _hoisted_16, [
                        createBaseVNode(
                          'label',
                          _hoisted_17,
                          toDisplayString(T.value.provider),
                          1,
                        ),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              id: 'hijri-provider',
                              'onUpdate:modelValue':
                                h[1] || (h[1] = (g) => (a.value = g)),
                            },
                            [
                              ...(h[47] ||
                                (h[47] = [
                                  createBaseVNode(
                                    'option',
                                    { value: 'ummalqura' },
                                    'Umm al-Qura',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 'tabular' },
                                    'Tabular',
                                    -1,
                                  ),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, a.value]],
                        ),
                      ]))
                    : createCommentVNode('', !0),
                  createBaseVNode('fieldset', _hoisted_18, [
                    createBaseVNode(
                      'legend',
                      null,
                      toDisplayString(T.value.type),
                      1,
                    ),
                    createBaseVNode('label', _hoisted_19, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              h[2] || (h[2] = (g) => (l.value = g)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'date',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, l.value]],
                      ),
                      createTextVNode(toDisplayString(T.value.date), 1),
                    ]),
                    createBaseVNode('label', _hoisted_20, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              h[3] || (h[3] = (g) => (l.value = g)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'time',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, l.value]],
                      ),
                      createTextVNode(toDisplayString(T.value.time), 1),
                    ]),
                    createBaseVNode('label', _hoisted_21, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              h[4] || (h[4] = (g) => (l.value = g)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'datetime',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, l.value]],
                      ),
                      createTextVNode(toDisplayString(T.value.datetime), 1),
                    ]),
                  ]),
                  createBaseVNode('fieldset', _hoisted_22, [
                    createBaseVNode(
                      'legend',
                      null,
                      toDisplayString(T.value.playground),
                      1,
                    ),
                    createBaseVNode('label', _hoisted_23, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              h[5] || (h[5] = (g) => (o.value = g)),
                            name: 'playground-mode',
                            type: 'radio',
                            value: 'single',
                            onChange:
                              h[6] || (h[6] = (g) => (o.value = 'single')),
                          },
                          null,
                          544,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(T.value.single), 1),
                    ]),
                    createBaseVNode('label', _hoisted_24, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              h[7] || (h[7] = (g) => (o.value = g)),
                            name: 'playground-mode',
                            type: 'radio',
                            value: 'range',
                            onChange:
                              h[8] || (h[8] = (g) => (o.value = 'range')),
                          },
                          null,
                          544,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(T.value.range), 1),
                    ]),
                  ]),
                  createBaseVNode('details', _hoisted_25, [
                    h[74] ||
                      (h[74] = createBaseVNode(
                        'summary',
                        null,
                        'ADVANCED PROPS',
                        -1,
                      )),
                    createBaseVNode('div', _hoisted_26, [
                      createBaseVNode('label', null, [
                        h[49] || (h[49] = createTextVNode('Color', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[9] || (h[9] = (g) => (P.value = g)),
                            },
                            [
                              ...(h[48] ||
                                (h[48] = [
                                  createBaseVNode('option', null, 'blue', -1),
                                  createBaseVNode('option', null, 'red', -1),
                                  createBaseVNode('option', null, 'green', -1),
                                  createBaseVNode('option', null, 'purple', -1),
                                  createBaseVNode('option', null, 'gray', -1),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, P.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[51] || (h[51] = createTextVNode('Locale', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[10] || (h[10] = (g) => (j.value = g)),
                            },
                            [
                              ...(h[50] ||
                                (h[50] = [
                                  createStaticVNode(
                                    '<option value="">Calendar default</option><option value="en">English</option><option value="fa">فارسی</option><option value="ar">العربية</option><option value="he">עברית</option><option value="th">ไทย</option><option value="zh">中文</option>',
                                    7,
                                  ),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, j.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        createTextVNode(
                          toDisplayString(T.value.modelCalendar),
                          1,
                        ),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[11] || (h[11] = (g) => (E.value = g)),
                            },
                            [
                              createBaseVNode(
                                'option',
                                _hoisted_27,
                                toDisplayString(T.value.modelCalendarActive),
                                1,
                              ),
                              (openBlock(),
                              createElementBlock(
                                Fragment,
                                null,
                                renderList(t, (g) =>
                                  createBaseVNode(
                                    'option',
                                    { key: g.id, value: g.id },
                                    toDisplayString(g.title[n.value]),
                                    9,
                                    _hoisted_28,
                                  ),
                                ),
                                64,
                              )),
                            ],
                            512,
                          ),
                          [[vModelSelect, E.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[52] || (h[52] = createTextVNode('From', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[12] || (h[12] = (g) => (B.value = g)),
                              placeholder: u.value.from,
                            },
                            null,
                            8,
                            _hoisted_29,
                          ),
                          [[vModelText, B.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[53] || (h[53] = createTextVNode('To', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[13] || (h[13] = (g) => ($.value = g)),
                              placeholder: u.value.to,
                            },
                            null,
                            8,
                            _hoisted_30,
                          ),
                          [[vModelText, $.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        createBaseVNode('span', _hoisted_31, [
                          createTextVNode(toDisplayString(T.value.format), 1),
                          createBaseVNode(
                            'button',
                            {
                              type: 'button',
                              class: 'format-info',
                              'aria-label': `${T.value.format} ${T.value.formatExample}`,
                            },
                            ' ?',
                            8,
                            _hoisted_32,
                          ),
                          createBaseVNode(
                            'span',
                            _hoisted_33,
                            toDisplayString(T.value.modelFormatGuide),
                            1,
                          ),
                        ]),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[14] || (h[14] = (g) => (q.value = g)),
                              placeholder: 'YYYY-MM-DD',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, q.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        createBaseVNode('span', _hoisted_34, [
                          createTextVNode(
                            toDisplayString(T.value.formatInput),
                            1,
                          ),
                          createBaseVNode(
                            'button',
                            {
                              type: 'button',
                              class: 'format-info',
                              'aria-label': `${T.value.formatInput} ${T.value.formatExample}`,
                            },
                            ' ?',
                            8,
                            _hoisted_35,
                          ),
                          createBaseVNode(
                            'span',
                            _hoisted_36,
                            toDisplayString(T.value.inputFormatGuide),
                            1,
                          ),
                        ]),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[15] || (h[15] = (g) => (z.value = g)),
                              placeholder: 'YYYY-MM-DD',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, z.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        createBaseVNode('span', _hoisted_37, [
                          createTextVNode(
                            toDisplayString(T.value.formatMask),
                            1,
                          ),
                          createBaseVNode(
                            'button',
                            {
                              type: 'button',
                              class: 'format-info',
                              'aria-label': `${T.value.formatMask} ${T.value.formatExample}`,
                            },
                            ' ?',
                            8,
                            _hoisted_38,
                          ),
                          createBaseVNode(
                            'span',
                            _hoisted_39,
                            toDisplayString(T.value.inputMaskGuide),
                            1,
                          ),
                        ]),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[16] || (h[16] = (g) => (G.value = g)),
                              placeholder: 'calendar-default',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, G.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        createBaseVNode('span', _hoisted_40, [
                          createTextVNode(
                            toDisplayString(T.value.formatDisplay),
                            1,
                          ),
                          createBaseVNode(
                            'button',
                            {
                              type: 'button',
                              class: 'format-info',
                              'aria-label': `${T.value.formatDisplay} ${T.value.formatExample}`,
                            },
                            ' ?',
                            8,
                            _hoisted_41,
                          ),
                          createBaseVNode(
                            'span',
                            _hoisted_42,
                            toDisplayString(T.value.displayFormatGuide),
                            1,
                          ),
                        ]),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[17] || (h[17] = (g) => (ee.value = g)),
                              placeholder: 'YY-MM-DD',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, ee.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[55] || (h[55] = createTextVNode('Months shown', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[18] || (h[18] = (g) => (J.value = g)),
                            },
                            [
                              ...(h[54] ||
                                (h[54] = [
                                  createBaseVNode(
                                    'option',
                                    { value: 1 },
                                    '1 month',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 2 },
                                    '2 months',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 3 },
                                    '3 months',
                                    -1,
                                  ),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, J.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[57] || (h[57] = createTextVNode('Week starts', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[19] || (h[19] = (g) => (I.value = g)),
                            },
                            [
                              ...(h[56] ||
                                (h[56] = [
                                  createBaseVNode(
                                    'option',
                                    { value: 'auto' },
                                    'Calendar default',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 0 },
                                    'Sunday',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 1 },
                                    'Monday',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 6 },
                                    'Saturday',
                                    -1,
                                  ),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, I.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[59] || (h[59] = createTextVNode('Click on', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[20] || (h[20] = (g) => (re.value = g)),
                            },
                            [
                              ...(h[58] ||
                                (h[58] = [
                                  createBaseVNode(
                                    'option',
                                    { value: 'all' },
                                    'Input and icon',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 'input' },
                                    'Input only',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 'icon' },
                                    'Icon only',
                                    -1,
                                  ),
                                  createBaseVNode(
                                    'option',
                                    { value: 'none' },
                                    'Disabled',
                                    -1,
                                  ),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, re.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[60] || (h[60] = createTextVNode('Minute step', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[21] || (h[21] = (g) => (he.value = g)),
                              type: 'number',
                              min: '1',
                              max: '60',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, he.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        h[61] || (h[61] = createTextVNode('Hour step', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[22] || (h[22] = (g) => (fe.value = g)),
                              type: 'number',
                              min: '1',
                              max: '24',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, fe.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      createBaseVNode('fieldset', _hoisted_43, [
                        h[65] ||
                          (h[65] = createBaseVNode(
                            'legend',
                            null,
                            'Weekly holidays',
                            -1,
                          )),
                        createBaseVNode('label', _hoisted_44, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[23] || (h[23] = (g) => (O.value = g)),
                                type: 'checkbox',
                                value: 0,
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, O.value]],
                          ),
                          h[62] || (h[62] = createTextVNode('Sunday', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_45, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[24] || (h[24] = (g) => (O.value = g)),
                                type: 'checkbox',
                                value: 5,
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, O.value]],
                          ),
                          h[63] || (h[63] = createTextVNode('Friday', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_46, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[25] || (h[25] = (g) => (O.value = g)),
                                type: 'checkbox',
                                value: 6,
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, O.value]],
                          ),
                          h[64] || (h[64] = createTextVNode('Saturday', -1)),
                        ]),
                      ]),
                      createBaseVNode('fieldset', _hoisted_47, [
                        h[73] ||
                          (h[73] = createBaseVNode(
                            'legend',
                            null,
                            'Behavior',
                            -1,
                          )),
                        createBaseVNode('label', _hoisted_48, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[26] || (h[26] = (g) => (te.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, te.value]],
                          ),
                          h[66] || (h[66] = createTextVNode('Clearable', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_49, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[27] || (h[27] = (g) => (ne.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, ne.value]],
                          ),
                          h[67] || (h[67] = createTextVNode('Auto submit', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_50, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[28] || (h[28] = (g) => (ie.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, ie.value]],
                          ),
                          h[68] ||
                            (h[68] = createTextVNode(
                              'Auto mask separators',
                              -1,
                            )),
                        ]),
                        createBaseVNode('label', _hoisted_51, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[29] || (h[29] = (g) => (ce.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, ce.value]],
                          ),
                          h[69] ||
                            (h[69] = createTextVNode('Strict mask dates', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_52, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[30] || (h[30] = (g) => (ue.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, ue.value]],
                          ),
                          h[70] ||
                            (h[70] = createTextVNode('Custom mask blocks', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_53, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[31] || (h[31] = (g) => (L.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, L.value]],
                          ),
                          h[71] || (h[71] = createTextVNode('Icon inside', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_54, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[32] || (h[32] = (g) => (H.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, H.value]],
                          ),
                          h[72] || (h[72] = createTextVNode('Dual input', -1)),
                        ]),
                        createBaseVNode('label', _hoisted_55, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[33] || (h[33] = (g) => (x.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, x.value]],
                          ),
                          createTextVNode(toDisplayString(T.value.modal), 1),
                        ]),
                        createBaseVNode('label', _hoisted_56, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[34] || (h[34] = (g) => (X.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, X.value]],
                          ),
                          createTextVNode(toDisplayString(T.value.show), 1),
                        ]),
                        createBaseVNode('label', _hoisted_57, [
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue':
                                  h[35] || (h[35] = (g) => (Q.value = g)),
                                type: 'checkbox',
                              },
                              null,
                              512,
                            ),
                            [[vModelCheckbox, Q.value]],
                          ),
                          createTextVNode(toDisplayString(T.value.shortcut), 1),
                        ]),
                      ]),
                      createBaseVNode('label', null, [
                        createTextVNode(toDisplayString(T.value.label), 1),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[36] || (h[36] = (g) => (se.value = g)),
                              placeholder: T.value.active,
                            },
                            null,
                            8,
                            _hoisted_58,
                          ),
                          [[vModelText, se.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        createTextVNode(toDisplayString(T.value.styles), 1),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                h[37] || (h[37] = (g) => (de.value = g)),
                            },
                            [
                              createBaseVNode(
                                'option',
                                _hoisted_59,
                                toDisplayString(T.value.stylesDefault),
                                1,
                              ),
                              createBaseVNode(
                                'option',
                                _hoisted_60,
                                toDisplayString(T.value.stylesPurple),
                                1,
                              ),
                            ],
                            512,
                          ),
                          [[vModelSelect, de.value]],
                        ),
                      ]),
                      createBaseVNode('label', _hoisted_61, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                h[38] || (h[38] = (g) => (K.value = g)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, K.value]],
                        ),
                        createTextVNode(
                          toDisplayString(T.value.localeConfig),
                          1,
                        ),
                      ]),
                    ]),
                  ]),
                ]),
                createBaseVNode('div', _hoisted_62, [
                  createBaseVNode('div', _hoisted_63, [
                    createBaseVNode('div', null, [
                      createBaseVNode(
                        'span',
                        _hoisted_64,
                        toDisplayString(u.value.icon),
                        1,
                      ),
                      createBaseVNode('div', null, [
                        createBaseVNode(
                          'span',
                          _hoisted_65,
                          toDisplayString(T.value.active),
                          1,
                        ),
                        createBaseVNode(
                          'h3',
                          null,
                          toDisplayString(u.value.title[n.value]),
                          1,
                        ),
                      ]),
                    ]),
                    createBaseVNode('span', _hoisted_66, [
                      h[75] || (h[75] = createBaseVNode('i', null, null, -1)),
                      createTextVNode(toDisplayString(T.value.ready), 1),
                    ]),
                  ]),
                  createBaseVNode(
                    'div',
                    { class: 'picker-wrap', dir: u.value.direction },
                    [
                      (openBlock(),
                      createBlock(
                        DatePicker,
                        {
                          key: `${i.value}-${a.value}-${o.value}-${l.value}-${n.value}`,
                          modelValue: d.value,
                          'onUpdate:modelValue':
                            h[39] || (h[39] = (g) => (d.value = g)),
                          calendar: i.value,
                          'model-calendar': E.value,
                          format:
                            q.value ||
                            (i.value === 'jalali' ? 'jYYYY/jMM/jDD' : void 0),
                          'input-format': z.value || void 0,
                          'input-mask': G.value
                            ? {
                                pattern: G.value,
                                autoInsert: ie.value,
                                strict: ce.value,
                                blocks: ue.value ? ye : void 0,
                              }
                            : void 0,
                          'display-format': ee.value || void 0,
                          'hijri-provider': a.value,
                          mode: o.value,
                          type: l.value,
                          locale: j.value || S(i.value),
                          column: J.value,
                          from: B.value || u.value.from,
                          to: $.value || u.value.to,
                          'week-starts-on': I.value,
                          'weekend-days': O.value.length ? O.value : void 0,
                          color: P.value,
                          'click-on': re.value,
                          'minute-step': he.value,
                          'hour-step': fe.value,
                          'icon-inside': L.value,
                          'dual-input': H.value,
                          'auto-submit': ne.value,
                          clearable: te.value,
                          modal: x.value,
                          show: X.value,
                          label:
                            se.value ||
                            `${T.value.active} ${u.value.title[n.value]}`,
                          shortcut: Q.value,
                          'locale-config': pe.value,
                          styles: ge.value,
                        },
                        null,
                        8,
                        [
                          'modelValue',
                          'calendar',
                          'model-calendar',
                          'format',
                          'input-format',
                          'input-mask',
                          'display-format',
                          'hijri-provider',
                          'mode',
                          'type',
                          'locale',
                          'column',
                          'from',
                          'to',
                          'week-starts-on',
                          'weekend-days',
                          'color',
                          'click-on',
                          'minute-step',
                          'hour-step',
                          'icon-inside',
                          'dual-input',
                          'auto-submit',
                          'clearable',
                          'modal',
                          'show',
                          'label',
                          'shortcut',
                          'locale-config',
                          'styles',
                        ],
                      )),
                    ],
                    8,
                    _hoisted_67,
                  ),
                  createBaseVNode('div', _hoisted_68, [
                    createBaseVNode(
                      'span',
                      null,
                      toDisplayString(T.value.value),
                      1,
                    ),
                    createBaseVNode(
                      'code',
                      null,
                      toDisplayString(d.value || '—'),
                      1,
                    ),
                  ]),
                  createBaseVNode(
                    'p',
                    _hoisted_69,
                    toDisplayString(T.value.liveHint),
                    1,
                  ),
                  createBaseVNode('div', _hoisted_70, [
                    h[76] || (h[76] = createBaseVNode('h4', null, 'HTML', -1)),
                    createBaseVNode('pre', null, [
                      createBaseVNode(
                        'code',
                        null,
                        toDisplayString(V.value),
                        1,
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ]),
            createBaseVNode('section', _hoisted_71, [
              createBaseVNode('div', _hoisted_72, [
                createBaseVNode('div', null, [
                  createBaseVNode(
                    'span',
                    _hoisted_73,
                    toDisplayString(T.value.propsGuideKicker),
                    1,
                  ),
                  createBaseVNode(
                    'h2',
                    _hoisted_74,
                    toDisplayString(T.value.propsGuide),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'p',
                  null,
                  toDisplayString(T.value.propsGuideIntro),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_75, [
                (openBlock(),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(s, (g) =>
                    createBaseVNode(
                      'article',
                      { key: g.name, class: 'prop-card' },
                      [
                        createBaseVNode('div', _hoisted_76, [
                          createBaseVNode(
                            'code',
                            null,
                            toDisplayString(g.name),
                            1,
                          ),
                          createBaseVNode(
                            'span',
                            null,
                            toDisplayString(g.type),
                            1,
                          ),
                        ]),
                        createBaseVNode(
                          'p',
                          null,
                          toDisplayString(g.description[n.value]),
                          1,
                        ),
                        createBaseVNode(
                          'small',
                          null,
                          toDisplayString(T.value.defaultValue) +
                            ': ' +
                            toDisplayString(g.defaultValue),
                          1,
                        ),
                        createBaseVNode('div', _hoisted_77, [
                          createBaseVNode(
                            'strong',
                            null,
                            toDisplayString(T.value.examples),
                            1,
                          ),
                          (openBlock(!0),
                          createElementBlock(
                            Fragment,
                            null,
                            renderList(
                              g.examples,
                              (R) => (
                                openBlock(),
                                createElementBlock(
                                  'code',
                                  { key: R },
                                  toDisplayString(R),
                                  1,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ],
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            createBaseVNode('section', _hoisted_78, [
              createBaseVNode('div', _hoisted_79, [
                createBaseVNode('div', null, [
                  h[77] ||
                    (h[77] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'CALENDAR GALLERY',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    _hoisted_80,
                    toDisplayString(T.value.gallery),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'p',
                  null,
                  toDisplayString(T.value.galleryHint),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_81, [
                (openBlock(),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(t, (g) =>
                    createBaseVNode(
                      'article',
                      { key: g.id, class: 'calendar-card', dir: g.direction },
                      [
                        createBaseVNode('div', _hoisted_83, [
                          createBaseVNode('div', _hoisted_84, [
                            createBaseVNode(
                              'span',
                              _hoisted_85,
                              toDisplayString(g.icon),
                              1,
                            ),
                            createBaseVNode('div', null, [
                              createBaseVNode(
                                'h3',
                                null,
                                toDisplayString(g.title[n.value]),
                                1,
                              ),
                              createBaseVNode(
                                'p',
                                null,
                                toDisplayString(g.subtitle),
                                1,
                              ),
                            ]),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_86, [
                          (openBlock(),
                          createBlock(
                            DatePicker,
                            {
                              key: `${g.id}-${n.value}`,
                              modelValue: f[g.id],
                              'onUpdate:modelValue': (R) => (f[g.id] = R),
                              calendar: g.id,
                              from: g.from,
                              to: g.to,
                              'hijri-provider': a.value,
                              locale: S(g.id),
                              column: 1,
                              mode: 'single',
                              label: '',
                            },
                            null,
                            8,
                            [
                              'modelValue',
                              'onUpdate:modelValue',
                              'calendar',
                              'from',
                              'to',
                              'hijri-provider',
                              'locale',
                            ],
                          )),
                        ]),
                        createBaseVNode('div', _hoisted_87, [
                          createBaseVNode('div', _hoisted_88, [
                            createBaseVNode(
                              'span',
                              null,
                              toDisplayString(T.value.output),
                              1,
                            ),
                            createBaseVNode(
                              'code',
                              null,
                              toDisplayString(g.sample),
                              1,
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: (R) => b(k(g)),
                            },
                            toDisplayString(T.value.code) + ' · HTML ',
                            9,
                            _hoisted_89,
                          ),
                        ]),
                      ],
                      8,
                      _hoisted_82,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            createBaseVNode('section', _hoisted_90, [
              createBaseVNode('div', _hoisted_91, [
                createBaseVNode('div', null, [
                  h[78] ||
                    (h[78] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'TIME & RANGE',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    null,
                    toDisplayString(T.value.timeSamples),
                    1,
                  ),
                ]),
              ]),
              createBaseVNode('div', _hoisted_92, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    D.value,
                    (g) => (
                      openBlock(),
                      createElementBlock(
                        'article',
                        { key: g.title, class: 'calendar-card' },
                        [
                          createBaseVNode('div', _hoisted_93, [
                            createBaseVNode('div', _hoisted_94, [
                              createBaseVNode(
                                'span',
                                _hoisted_95,
                                toDisplayString(g.icon),
                                1,
                              ),
                              createBaseVNode('div', null, [
                                createBaseVNode(
                                  'h3',
                                  null,
                                  toDisplayString(g.title),
                                  1,
                                ),
                                createBaseVNode(
                                  'p',
                                  null,
                                  toDisplayString(
                                    g.mode === 'range'
                                      ? T.value.range
                                      : T.value.single,
                                  ),
                                  1,
                                ),
                              ]),
                            ]),
                          ]),
                          createBaseVNode('div', _hoisted_96, [
                            createVNode(
                              DatePicker,
                              {
                                type: g.type,
                                mode: g.mode,
                                'model-value': g.value,
                                locale: 'en',
                                'minute-step': 5,
                                'hour-step': 1,
                                column: 1,
                                clearable: '',
                              },
                              null,
                              8,
                              ['type', 'mode', 'model-value'],
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: (R) => b(k(u.value, g.type, g.mode)),
                            },
                            toDisplayString(T.value.code),
                            9,
                            _hoisted_97,
                          ),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            createBaseVNode('footer', _hoisted_98, [
              createBaseVNode('span', null, toDisplayString(T.value.title), 1),
              h[79] ||
                (h[79] = createBaseVNode(
                  'code',
                  null,
                  '@h-sanadgol/vue3-multi-calendar-datepicker',
                  -1,
                )),
            ]),
            v.value
              ? (openBlock(),
                createElementBlock(
                  'div',
                  {
                    key: 0,
                    class: 'code-modal-backdrop',
                    role: 'presentation',
                    onClick:
                      h[42] ||
                      (h[42] = withModifiers(
                        (g) => (v.value = null),
                        ['self'],
                      )),
                  },
                  [
                    createBaseVNode(
                      'section',
                      {
                        class: 'code-modal',
                        role: 'dialog',
                        'aria-modal': 'true',
                        'aria-label': v.value.title,
                      },
                      [
                        createBaseVNode('div', _hoisted_100, [
                          createBaseVNode('div', null, [
                            h[80] ||
                              (h[80] = createBaseVNode(
                                'span',
                                { class: 'section-kicker' },
                                'CODE SAMPLE',
                                -1,
                              )),
                            createBaseVNode(
                              'h2',
                              null,
                              toDisplayString(v.value.title),
                              1,
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'modal-close',
                              type: 'button',
                              'aria-label': T.value.close,
                              onClick:
                                h[40] || (h[40] = (g) => (v.value = null)),
                            },
                            ' × ',
                            8,
                            _hoisted_101,
                          ),
                        ]),
                        createBaseVNode('div', _hoisted_102, [
                          createBaseVNode('div', null, [
                            h[81] ||
                              (h[81] = createBaseVNode('h3', null, 'HTML', -1)),
                            createBaseVNode('pre', null, [
                              createBaseVNode(
                                'code',
                                null,
                                toDisplayString(v.value.html),
                                1,
                              ),
                            ]),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_103, [
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: A,
                            },
                            toDisplayString(
                              M.value ? T.value.copied : T.value.copy,
                            ),
                            1,
                          ),
                          createBaseVNode(
                            'button',
                            {
                              class: 'reset-button',
                              type: 'button',
                              onClick:
                                h[41] || (h[41] = (g) => (v.value = null)),
                            },
                            toDisplayString(T.value.close),
                            1,
                          ),
                        ]),
                      ],
                      8,
                      _hoisted_99,
                    ),
                  ],
                ))
              : createCommentVNode('', !0),
          ],
          8,
          _hoisted_1,
        )
      );
    },
  });
createApp(_sfc_main).mount('#app');
