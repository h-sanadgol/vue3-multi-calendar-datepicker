(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === 'childList')
        for (const a of i.addedNodes)
          a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(n) {
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
  function s(n) {
    if (n.ep) return;
    n.ep = !0;
    const i = r(n);
    fetch(n.href, i);
  }
})();
function makeMap(e) {
  const t = Object.create(null);
  for (const r of e.split(',')) t[r] = 1;
  return (r) => r in t;
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
    const r = e.indexOf(t);
    r > -1 && e.splice(r, 1);
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
    return (r) => t[r] || (t[r] = e(r));
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
    for (let r = 0; r < e.length; r++) e[r](...t);
  },
  def = (e, t, r, s = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: s,
      value: r,
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
    for (let r = 0; r < e.length; r++) {
      const s = e[r],
        n = isString(s) ? parseStringStyle(s) : normalizeStyle(s);
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
      .replace(styleCommentRE, (r) => (r.startsWith('/*') ? '' : r))
      .split(listDelimiterRE)
      .forEach((r) => {
        if (r) {
          const s = r.split(propertyDelimiterRE);
          s.length > 1 && (t[s[0].trim()] = s[1].trim());
        }
      }),
    t
  );
}
function normalizeClass(e) {
  let t = '';
  if (isString(e)) t = e;
  else if (isArray(e))
    for (let r = 0; r < e.length; r++) {
      const s = normalizeClass(e[r]);
      s && (t += s + ' ');
    }
  else if (isObject(e)) for (const r in e) e[r] && (t += r + ' ');
  return t.trim();
}
function normalizeProps(e) {
  if (!e) return null;
  let { class: t, style: r } = e;
  return (
    t && !isString(t) && (e.class = normalizeClass(t)),
    r && (e.style = normalizeStyle(r)),
    e
  );
}
const specialBooleanAttrs =
    'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly',
  isSpecialBooleanAttr = makeMap(specialBooleanAttrs);
function includeBooleanAttr(e) {
  return !!e || e === '';
}
function looseCompareArrays(e, t, r) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let n = 0; s && n < e.length; n++) s = looseEqual(e[n], t[n], r);
  return s;
}
function looseCompareCollections(e, t, r) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t),
    n = new Uint8Array(s.length);
  for (const i of e) {
    let a = -1;
    for (let o = 0; o < s.length; o++)
      if (!n[o] && looseEqual(i, s[o], r)) {
        a = o;
        break;
      }
    if (a < 0) return !1;
    n[a] = 1;
  }
  return !0;
}
function looseCompareObjects(e, t, r) {
  let s = isMap(e),
    n = isMap(t);
  if (s || n || ((s = isSet(e)), (n = isSet(t)), s || n))
    return s && n ? looseCompareCollections(e, t, r) : !1;
  const i = Object.keys(e).length,
    a = Object.keys(t).length;
  if (i !== a) return !1;
  for (const o in e) {
    const l = e.hasOwnProperty(o),
      d = t.hasOwnProperty(o);
    if ((l && !d) || (!l && d) || !looseEqual(e[o], t[o], r)) return !1;
  }
  return String(e) === String(t);
}
function looseCompareNested(e, t, r, s) {
  r || (r = [new Map(), new Map()]);
  const [n, i] = r;
  if (n.has(e) || i.has(t)) return n.get(e) === t && i.get(t) === e;
  (n.set(e, t), i.set(t, e));
  const a = s(e, t, r);
  return (n.delete(e), i.delete(t), a);
}
function looseEqual(e, t, r) {
  if (e === t) return !0;
  let s = isDate(e),
    n = isDate(t);
  return s || n
    ? s && n
      ? e.getTime() === t.getTime()
      : !1
    : ((s = isSymbol(e)),
      (n = isSymbol(t)),
      s || n
        ? e === t
        : ((s = isArray(e)),
          (n = isArray(t)),
          s || n
            ? s && n
              ? looseCompareNested(e, t, r, looseCompareArrays)
              : !1
            : ((s = isObject(e)),
              (n = isObject(t)),
              s || n
                ? !s || !n
                  ? !1
                  : looseCompareNested(e, t, r, looseCompareObjects)
                : String(e) === String(t))));
}
function looseIndexOf(e, t) {
  return e.findIndex((r) => looseEqual(r, t));
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
              (r, [s, n], i) => ((r[stringifySymbol(s, i) + ' =>'] = n), r),
              {},
            ),
          }
        : isSet(t)
          ? {
              [`Set(${t.size})`]: [...t.values()].map((r) =>
                stringifySymbol(r),
              ),
            }
          : isSymbol(t)
            ? stringifySymbol(t)
            : isObject(t) && !isArray(t) && !isPlainObject(t)
              ? String(t)
              : t,
  stringifySymbol = (e, t = '') => {
    var r;
    return isSymbol(e) ? `Symbol(${(r = e.description) != null ? r : t})` : e;
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
      let t, r;
      if (this.scopes) {
        const s = this.scopes.slice();
        for (t = 0, r = s.length; t < r; t++) s[t].pause();
      }
      for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, r;
      if (this.scopes) {
        const n = this.scopes.slice();
        for (t = 0, r = n.length; t < r; t++) n[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, r = s.length; t < r; t++) s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const r = activeEffectScope;
      try {
        return ((activeEffectScope = this), t());
      } finally {
        activeEffectScope = r;
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
      let r, s;
      for (r = 0, s = this.effects.length; r < s; r++) this.effects[r].stop();
      for (this.effects.length = 0, r = 0, s = this.cleanups.length; r < s; r++)
        this.cleanups[r]();
      if (((this.cleanups.length = 0), this.scopes)) {
        const n = this.scopes.slice();
        for (r = 0, s = n.length; r < s; r++) n[r].stop(!0);
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
      r = shouldTrack;
    ((activeSub = this), (shouldTrack = !0));
    try {
      return this.fn();
    } finally {
      (cleanupDeps(this),
        (activeSub = t),
        (shouldTrack = r),
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
      const r = t.next;
      ((t.next = void 0), (t.flags &= -9), (t = r));
    }
  }
  let e;
  for (; batchedSub; ) {
    let t = batchedSub;
    for (batchedSub = void 0; t; ) {
      const r = t.next;
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = r;
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
    r = e.depsTail,
    s = r;
  for (; s; ) {
    const n = s.prevDep;
    (s.version === -1
      ? (s === r && (r = n), removeSub(s), removeDep(s))
      : (t = s),
      (s.dep.activeLink = s.prevActiveLink),
      (s.prevActiveLink = void 0),
      (s = n));
  }
  ((e.deps = t), (e.depsTail = r));
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
    r = activeSub,
    s = shouldTrack;
  ((activeSub = e), (shouldTrack = !0));
  try {
    prepareDeps(e);
    const n = e.fn(e._value);
    (t.version === 0 || hasChanged(n, e._value)) &&
      ((e.flags |= 128), (e._value = n), t.version++);
  } catch (n) {
    throw (t.version++, n);
  } finally {
    ((activeSub = r), (shouldTrack = s), cleanupDeps(e), (e.flags &= -3));
  }
}
function removeSub(e, t = !1) {
  const { dep: r, prevSub: s, nextSub: n } = e;
  if (
    (s && ((s.nextSub = n), (e.prevSub = void 0)),
    n && ((n.prevSub = s), (e.nextSub = void 0)),
    r.subs === e && ((r.subs = s), !s && r.computed))
  ) {
    r.computed.flags &= -5;
    for (let i = r.computed.deps; i; i = i.nextDep) removeSub(i, !0);
  }
  !t && !--r.sc && r.map && r.map.delete(r.key);
}
function removeDep(e) {
  const { prevDep: t, nextDep: r } = e;
  (t && ((t.nextDep = r), (e.prevDep = void 0)),
    r && ((r.prevDep = t), (e.nextDep = void 0)));
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
    const r = activeSub;
    activeSub = void 0;
    try {
      t();
    } finally {
      activeSub = r;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(t, r) {
    ((this.sub = t),
      (this.dep = r),
      (this.version = r.version),
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
    let r = this.activeLink;
    if (r === void 0 || r.sub !== activeSub)
      ((r = this.activeLink = new Link(activeSub, this)),
        activeSub.deps
          ? ((r.prevDep = activeSub.depsTail),
            (activeSub.depsTail.nextDep = r),
            (activeSub.depsTail = r))
          : (activeSub.deps = activeSub.depsTail = r),
        addSub(r));
    else if (r.version === -1 && ((r.version = this.version), r.nextDep)) {
      const s = r.nextDep;
      ((s.prevDep = r.prevDep),
        r.prevDep && (r.prevDep.nextDep = s),
        (r.prevDep = activeSub.depsTail),
        (r.nextDep = void 0),
        (activeSub.depsTail.nextDep = r),
        (activeSub.depsTail = r),
        activeSub.deps === r && (activeSub.deps = s));
    }
    return r;
  }
  trigger(t) {
    (this.version++, globalVersion++, this.notify(t));
  }
  notify(t) {
    startBatch();
    try {
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
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
      for (let s = t.deps; s; s = s.nextDep) addSub(s);
    }
    const r = e.dep.subs;
    (r !== e && ((e.prevSub = r), r && (r.nextSub = e)), (e.dep.subs = e));
  }
}
const targetMap = new WeakMap(),
  ITERATE_KEY = Symbol(''),
  MAP_KEY_ITERATE_KEY = Symbol(''),
  ARRAY_ITERATE_KEY = Symbol('');
function track(e, t, r) {
  if (shouldTrack && activeSub) {
    let s = targetMap.get(e);
    s || targetMap.set(e, (s = new Map()));
    let n = s.get(r);
    (n || (s.set(r, (n = new Dep())), (n.map = s), (n.key = r)), n.track());
  }
}
function trigger(e, t, r, s, n, i) {
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
      d = l && isIntegerKey(r);
    if (l && r === 'length') {
      const c = Number(s);
      a.forEach((h, w) => {
        (w === 'length' ||
          w === ARRAY_ITERATE_KEY ||
          (!isSymbol(w) && w >= c)) &&
          o(h);
      });
    } else
      switch (
        ((r !== void 0 || a.has(void 0)) && o(a.get(r)),
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
  const r = targetMap.get(e);
  return r && r.get(t);
}
function reactiveReadArray(e) {
  const t = toRaw(e);
  return t === e || (track(t, 'iterate', ARRAY_ITERATE_KEY), isShallow(e))
    ? t
    : isReadonly(e)
      ? isReactive(e)
        ? t.map((r) => toReadonly(toReactive(r)))
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
      (r) => r.map((s) => toWrapped(this, s)),
      arguments,
    );
  },
  find(e, t) {
    return apply(this, 'find', e, t, (r) => toWrapped(this, r), arguments);
  },
  findIndex(e, t) {
    return apply(this, 'findIndex', e, t, void 0, arguments);
  },
  findLast(e, t) {
    return apply(this, 'findLast', e, t, (r) => toWrapped(this, r), arguments);
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
function iterator(e, t, r) {
  const s = shallowReadArray(e),
    n = s[t],
    i = n.call(s);
  if (s !== e && !isShallow(e)) {
    if (i[Symbol.toStringTag] === 'Array Iterator') {
      const a = Object.create(Object.getPrototypeOf(i));
      return (
        (a.next = () => wrapResult(i.next(), r)),
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
    ((i._next = i.next), (i.next = () => wrapResult(i._next(), r)));
  }
  return i;
}
function wrapResult(e, t) {
  return (e.done || (e.value = t(e.value)), e);
}
const arrayProto = Array.prototype;
function apply(e, t, r, s, n, i) {
  const a = shallowReadArray(e),
    o = a !== e && !isShallow(e),
    l = a[t];
  if (l !== arrayProto[t]) {
    const h = l.apply(e, i);
    return o ? toReactive(h) : h;
  }
  let d = r;
  a !== e &&
    (o
      ? (d = function (h, w) {
          return r.call(this, toWrapped(e, h), w, e);
        })
      : r.length > 2 &&
        (d = function (h, w) {
          return r.call(this, h, w, e);
        }));
  const c = l.call(a, d, s);
  return o && n ? n(c) : c;
}
function reduce(e, t, r, s) {
  const n = shallowReadArray(e),
    i = n !== e && !isShallow(e);
  let a = r,
    o = !1;
  n !== e &&
    (i
      ? ((o = s.length === 0),
        (a = function (d, c, h) {
          return (
            o && ((o = !1), (d = toWrapped(e, d))),
            r.call(this, d, toWrapped(e, c), h, e)
          );
        }))
      : r.length > 3 &&
        (a = function (d, c, h) {
          return r.call(this, d, c, h, e);
        }));
  const l = n[t](a, ...s);
  return o ? toWrapped(e, l) : l;
}
function searchProxy(e, t, r) {
  const s = toRaw(e);
  track(s, 'iterate', ARRAY_ITERATE_KEY);
  const n = s[t](...r);
  return (n === -1 || n === !1) && isProxy(r[0])
    ? ((r[0] = toRaw(r[0])), s[t](...r))
    : n;
}
function noTracking(e, t, r = []) {
  (pauseTracking(), startBatch());
  const s = toRaw(e)[t].apply(e, r);
  return (endBatch(), resetTracking(), s);
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
  constructor(t = !1, r = !1) {
    ((this._isReadonly = t), (this._isShallow = r));
  }
  get(t, r, s) {
    if (r === '__v_skip') return t.__v_skip;
    const n = this._isReadonly,
      i = this._isShallow;
    if (r === '__v_isReactive') return !n;
    if (r === '__v_isReadonly') return n;
    if (r === '__v_isShallow') return i;
    if (r === '__v_raw')
      return s ===
        (n
          ? i
            ? shallowReadonlyMap
            : readonlyMap
          : i
            ? shallowReactiveMap
            : reactiveMap
        ).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
        ? t
        : void 0;
    const a = isArray(t);
    if (!n) {
      let l;
      if (a && (l = arrayInstrumentations[r])) return l;
      if (r === 'hasOwnProperty') return hasOwnProperty;
    }
    const o = Reflect.get(t, r, isRef(t) ? t : s);
    if (
      (isSymbol(r) ? builtInSymbols.has(r) : isNonTrackableKeys(r)) ||
      (n || track(t, 'get', r), i)
    )
      return o;
    if (isRef(o)) {
      const l = a && isIntegerKey(r) ? o : o.value;
      return n && isObject(l) ? readonly(l) : l;
    }
    return isObject(o) ? (n ? readonly(o) : reactive(o)) : o;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    const a = isArray(t) && isIntegerKey(r);
    if (!this._isShallow) {
      const d = isReadonly(i);
      if (
        (!isShallow(s) && !isReadonly(s) && ((i = toRaw(i)), (s = toRaw(s))),
        !a && isRef(i) && !isRef(s))
      )
        return (d || (i.value = s), !0);
    }
    const o = a ? Number(r) < t.length : hasOwn(t, r),
      l = Reflect.set(t, r, s, isRef(t) ? t : n);
    return (
      t === toRaw(n) &&
        l &&
        (o
          ? hasChanged(s, i) && trigger(t, 'set', r, s)
          : trigger(t, 'add', r, s)),
      l
    );
  }
  deleteProperty(t, r) {
    const s = hasOwn(t, r);
    t[r];
    const n = Reflect.deleteProperty(t, r);
    return (n && s && trigger(t, 'delete', r, void 0), n);
  }
  has(t, r) {
    const s = Reflect.has(t, r);
    return ((!isSymbol(r) || !builtInSymbols.has(r)) && track(t, 'has', r), s);
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
  set(t, r) {
    return !0;
  }
  deleteProperty(t, r) {
    return !0;
  }
}
const mutableHandlers = new MutableReactiveHandler(),
  readonlyHandlers = new ReadonlyReactiveHandler(),
  shallowReactiveHandlers = new MutableReactiveHandler(!0),
  shallowReadonlyHandlers = new ReadonlyReactiveHandler(!0),
  toShallow = (e) => e,
  getProto = (e) => Reflect.getPrototypeOf(e);
function createIterableMethod(e, t, r) {
  return function (...s) {
    const n = this.__v_raw,
      i = toRaw(n),
      a = isMap(i),
      o = e === 'entries' || (e === Symbol.iterator && a),
      l = e === 'keys' && a,
      d = n[e](...s),
      c = r ? toShallow : t ? toReadonly : toReactive;
    return (
      !t && track(i, 'iterate', l ? MAP_KEY_ITERATE_KEY : ITERATE_KEY),
      extend(Object.create(d), {
        next() {
          const { value: h, done: w } = d.next();
          return w
            ? { value: h, done: w }
            : { value: o ? [c(h[0]), c(h[1])] : c(h), done: w };
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
  const r = {
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
        o.forEach((c, h) => n.call(i, d(c), d(h), a))
      );
    },
  };
  return (
    extend(
      r,
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
      r[n] = createIterableMethod(n, e, t);
    }),
    r
  );
}
function createInstrumentationGetter(e, t) {
  const r = createInstrumentations(e, t);
  return (s, n, i) =>
    n === '__v_isReactive'
      ? !e
      : n === '__v_isReadonly'
        ? e
        : n === '__v_isShallow'
          ? t
          : n === '__v_raw'
            ? s
            : Reflect.get(hasOwn(r, n) && n in s ? r : s, n, i);
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
function createReactiveObject(e, t, r, s, n) {
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
  const o = new Proxy(e, a === 2 ? s : r);
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
  constructor(t, r) {
    ((this.dep = new Dep()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = r ? t : toRaw(t)),
      (this._value = r ? t : toReactive(t)),
      (this.__v_isShallow = r));
  }
  get value() {
    return (this.dep.track(), this._value);
  }
  set value(t) {
    const r = this._rawValue,
      s = this.__v_isShallow || isShallow(t) || isReadonly(t);
    ((t = s ? t : toRaw(t)),
      hasChanged(t, r) &&
        ((this._rawValue = t),
        (this._value = s ? t : toReactive(t)),
        this.dep.trigger()));
  }
}
function unref(e) {
  return isRef(e) ? e.value : e;
}
const shallowUnwrapHandlers = {
  get: (e, t, r) => (t === '__v_raw' ? e : unref(Reflect.get(e, t, r))),
  set: (e, t, r, s) => {
    const n = e[t];
    return isRef(n) && !isRef(r)
      ? ((n.value = r), !0)
      : Reflect.set(e, t, r, s);
  },
};
function proxyRefs(e) {
  return isReactive(e) ? e : new Proxy(e, shallowUnwrapHandlers);
}
function toRefs(e) {
  const t = isArray(e) ? new Array(e.length) : {};
  for (const r in e) t[r] = propertyToRef(e, r);
  return t;
}
class ObjectRefImpl {
  constructor(t, r, s) {
    ((this._object = t),
      (this._defaultValue = s),
      (this.__v_isRef = !0),
      (this._value = void 0),
      (this._key = isSymbol(r) ? r : String(r)),
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
      const r = this._object[this._key];
      if (isRef(r)) {
        r.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return getDepFromReactive(this._raw, this._key);
  }
}
function propertyToRef(e, t, r) {
  return new ObjectRefImpl(e, t, r);
}
class ComputedRefImpl {
  constructor(t, r, s) {
    ((this.fn = t),
      (this.setter = r),
      (this._value = void 0),
      (this.dep = new Dep(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = globalVersion - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !r),
      (this.isSSR = s));
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
function computed$1(e, t, r = !1) {
  let s, n;
  return (
    isFunction(e) ? (s = e) : ((s = e.get), (n = e.set)),
    new ComputedRefImpl(s, n, r)
  );
}
const INITIAL_WATCHER_VALUE = {},
  cleanupMap = new WeakMap();
let activeWatcher;
function onWatcherCleanup(e, t = !1, r = activeWatcher) {
  if (r) {
    let s = cleanupMap.get(r);
    (s || cleanupMap.set(r, (s = [])), s.push(e));
  }
}
function watch$1(e, t, r = EMPTY_OBJ) {
  const {
      immediate: s,
      deep: n,
      once: i,
      scheduler: a,
      augmentJob: o,
      call: l,
    } = r,
    d = (V) =>
      n
        ? V
        : isShallow(V) || n === !1 || n === 0
          ? traverse(V, 1)
          : traverse(V);
  let c,
    h,
    w,
    M,
    P = !1,
    E = !1;
  if (
    (isRef(e)
      ? ((h = () => e.value), (P = isShallow(e)))
      : isReactive(e)
        ? ((h = () => d(e)), (P = !0))
        : isArray(e)
          ? ((E = !0),
            (P = e.some((V) => isReactive(V) || isShallow(V))),
            (h = () =>
              e.map((V) => {
                if (isRef(V)) return V.value;
                if (isReactive(V)) return d(V);
                if (isFunction(V)) return l ? l(V, 2) : V();
              })))
          : isFunction(e)
            ? t
              ? (h = l ? () => l(e, 2) : e)
              : (h = () => {
                  if (w) {
                    pauseTracking();
                    try {
                      w();
                    } finally {
                      resetTracking();
                    }
                  }
                  const V = activeWatcher;
                  activeWatcher = c;
                  try {
                    return l ? l(e, 3, [M]) : e(M);
                  } finally {
                    activeWatcher = V;
                  }
                })
            : (h = NOOP),
    t && n)
  ) {
    const V = h,
      L = n === !0 ? 1 / 0 : n;
    h = () => traverse(V(), L);
  }
  const Y = getCurrentScope(),
    I = () => {
      (c.stop(), Y && Y.active && remove(Y.effects, c));
    };
  if (i && t) {
    const V = t;
    t = (...L) => {
      try {
        return V(...L);
      } finally {
        I();
      }
    };
  }
  let B = E
    ? new Array(e.length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE;
  const H = (V) => {
    if (!(!(c.flags & 1) || (!c.dirty && !V)))
      if (t) {
        const L = c.run();
        if (
          V ||
          n ||
          P ||
          (E ? L.some((G, J) => hasChanged(G, B[J])) : hasChanged(L, B))
        ) {
          const G = activeWatcher;
          pauseTracking();
          try {
            (w && w(), (activeWatcher = c));
            const J = [
              L,
              B === INITIAL_WATCHER_VALUE
                ? void 0
                : E && B[0] === INITIAL_WATCHER_VALUE
                  ? []
                  : B,
              M,
            ];
            ((B = L), l ? l(t, 3, J) : t(...J));
          } finally {
            ((activeWatcher = G), resetTracking());
          }
        }
      } else c.run();
  };
  return (
    o && o(H),
    (c = new ReactiveEffect(h)),
    (c.scheduler = a ? () => a(H, !1) : H),
    (M = (V) => onWatcherCleanup(V, !1, c)),
    (w = c.onStop =
      () => {
        const V = cleanupMap.get(c);
        if (V) {
          if (l) l(V, 4);
          else for (const L of V) L();
          cleanupMap.delete(c);
        }
      }),
    t ? (s ? H(!0) : (B = c.run())) : a ? a(H.bind(null, !0), !0) : c.run(),
    (I.pause = c.pause.bind(c)),
    (I.resume = c.resume.bind(c)),
    (I.stop = I),
    I
  );
}
function traverse(e, t = 1 / 0, r) {
  if (
    t <= 0 ||
    !isObject(e) ||
    e.__v_skip ||
    ((r = r || new Map()), (r.get(e) || 0) >= t)
  )
    return e;
  if ((r.set(e, t), t--, isRef(e))) traverse(e.value, t, r);
  else if (isArray(e)) for (let s = 0; s < e.length; s++) traverse(e[s], t, r);
  else if (isSet(e) || isMap(e))
    e.forEach((s) => {
      traverse(s, t, r);
    });
  else if (isPlainObject(e)) {
    for (const s in e) traverse(e[s], t, r);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && traverse(e[s], t, r);
  }
  return e;
}
const stack = [];
let isWarning = !1;
function warn$1(e, ...t) {
  if (isWarning) return;
  ((isWarning = !0), pauseTracking());
  const r = stack.length ? stack[stack.length - 1].component : null,
    s = r && r.appContext.config.warnHandler,
    n = getComponentTrace();
  if (s)
    callWithErrorHandling(s, r, 11, [
      e +
        t
          .map((i) => {
            var a, o;
            return (o = (a = i.toString) == null ? void 0 : a.call(i)) != null
              ? o
              : JSON.stringify(i);
          })
          .join(''),
      r && r.proxy,
      n.map(({ vnode: i }) => `at <${formatComponentName(r, i.type)}>`).join(`
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
    const r = t[0];
    r && r.vnode === e
      ? r.recurseCount++
      : t.push({ vnode: e, recurseCount: 0 });
    const s = e.component && e.component.parent;
    e = s && s.vnode;
  }
  return t;
}
function formatTrace(e) {
  const t = [];
  return (
    e.forEach((r, s) => {
      t.push(
        ...(s === 0
          ? []
          : [
              `
`,
            ]),
        ...formatTraceEntry(r),
      );
    }),
    t
  );
}
function formatTraceEntry({ vnode: e, recurseCount: t }) {
  const r = t > 0 ? `... (${t} recursive calls)` : '',
    s = e.component ? e.component.parent == null : !1,
    n = ` at <${formatComponentName(e.component, e.type, s)}`,
    i = '>' + r;
  return e.props ? [n, ...formatProps(e.props), i] : [n + i];
}
function formatProps(e) {
  const t = [],
    r = Object.keys(e);
  return (
    r.slice(0, 3).forEach((s) => {
      t.push(...formatProp(s, e[s]));
    }),
    r.length > 3 && t.push(' ...'),
    t
  );
}
function formatProp(e, t, r) {
  return isString(t)
    ? ((t = JSON.stringify(t)), r ? t : [`${e}=${t}`])
    : typeof t == 'number' || typeof t == 'boolean' || t == null
      ? r
        ? t
        : [`${e}=${t}`]
      : isRef(t)
        ? ((t = formatProp(e, toRaw(t.value), !0)),
          r ? t : [`${e}=Ref<`, t, '>'])
        : isFunction(t)
          ? [`${e}=fn${t.name ? `<${t.name}>` : ''}`]
          : ((t = toRaw(t)), r ? t : [`${e}=`, t]);
}
function callWithErrorHandling(e, t, r, s) {
  try {
    return s ? e(...s) : e();
  } catch (n) {
    handleError(n, t, r);
  }
}
function callWithAsyncErrorHandling(e, t, r, s) {
  if (isFunction(e)) {
    const n = callWithErrorHandling(e, t, r, s);
    return (
      n &&
        isPromise(n) &&
        n.catch((i) => {
          handleError(i, t, r);
        }),
      n
    );
  }
  if (isArray(e)) {
    const n = [];
    for (let i = 0; i < e.length; i++)
      n.push(callWithAsyncErrorHandling(e[i], t, r, s));
    return n;
  }
}
function handleError(e, t, r, s = !0) {
  const n = t ? t.vnode : null,
    { errorHandler: i, throwUnhandledErrorInProduction: a } =
      (t && t.appContext.config) || EMPTY_OBJ;
  if (t) {
    let o = t.parent;
    const l = t.proxy,
      d = `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; o; ) {
      const c = o.ec;
      if (c) {
        for (let h = 0; h < c.length; h++) if (c[h](e, l, d) === !1) return;
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
  logError(e, r, n, s, a);
}
function logError(e, t, r, s = !0, n = !1) {
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
    r = queue.length;
  for (; t < r; ) {
    const s = (t + r) >>> 1,
      n = queue[s],
      i = getId(n);
    i < e || (i === e && n.flags & 2) ? (t = s + 1) : (r = s);
  }
  return t;
}
function queueJob(e) {
  if (!(e.flags & 1)) {
    const t = getId(e),
      r = queue[queue.length - 1];
    (!r || (!(e.flags & 2) && t >= getId(r))
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
function flushPreFlushCbs(e, t, r, s = flushIndex + 1) {
  for (; s < queue.length; s++) {
    const n = queue[s];
    if (n && n.flags & 2) {
      if ((e && n.id !== e.uid) || (t !== void 0 && !(n.id >= t))) continue;
      (queue.splice(s, 1),
        (s = e ? s - 1 : flushIndex),
        n.flags & 4 && (n.flags &= -2),
        n(),
        n.flags & 4 || (n.flags &= -2));
    }
  }
}
function flushPostFlushCbs(e, t, r = 0) {
  if (pendingPostFlushCbs.length) {
    let s = pendingPostFlushCbs,
      n = 0;
    if (t) {
      s = [];
      for (let a = 0; a < pendingPostFlushCbs.length; a++) {
        const o = pendingPostFlushCbs[a];
        (o.i !== void 0 ? !o.i || o.i.uid < r : t.has(o))
          ? (pendingPostFlushCbs[n++] = o)
          : s.push(o);
      }
    }
    const i = [...new Set(s)].sort((a, o) => getId(a) - getId(o));
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
  const r = t === void 0 ? void 0 : new Set(pendingPostFlushCbs);
  (e(), (isFlushing = !0));
  try {
    (flushPreFlushCbs(void 0, t), flushPostFlushCbs(void 0, r, t));
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
function withCtx(e, t = currentRenderingInstance, r) {
  if (!t || e._n) return e;
  const s = (...n) => {
    s._d && setBlockTracking(-1);
    const i = setCurrentRenderingInstance(t),
      a = blockStack.length;
    let o;
    try {
      o = e(...n);
    } finally {
      for (let l = blockStack.length; l > a; l--) closeBlock();
      (setCurrentRenderingInstance(i), s._d && setBlockTracking(1));
    }
    return o;
  };
  return ((s._n = !0), (s._c = !0), (s._d = !0), s);
}
function withDirectives(e, t) {
  if (currentRenderingInstance === null) return e;
  const r = getComponentPublicInstance(currentRenderingInstance),
    s = e.dirs || (e.dirs = []);
  for (let n = 0; n < t.length; n++) {
    let [i, a, o, l = EMPTY_OBJ] = t[n];
    i &&
      (isFunction(i) && (i = { mounted: i, updated: i }),
      i.deep && traverse(a),
      s.push({
        dir: i,
        instance: r,
        value: a,
        oldValue: void 0,
        arg: o,
        modifiers: l,
      }));
  }
  return e;
}
function invokeDirectiveHook(e, t, r, s) {
  const n = e.dirs,
    i = t && t.dirs;
  for (let a = 0; a < n.length; a++) {
    const o = n[a];
    i && (o.oldValue = i[a].value);
    let l = o.dir[s];
    l &&
      (pauseTracking(),
      callWithAsyncErrorHandling(l, r, 8, [e.el, o, e, t]),
      resetTracking());
  }
}
function provide(e, t) {
  if (currentInstance) {
    let r = currentInstance.provides;
    const s = currentInstance.parent && currentInstance.parent.provides;
    (s === r && (r = currentInstance.provides = Object.create(s)), (r[e] = t));
  }
}
function inject(e, t, r = !1) {
  const s = getCurrentInstance();
  if (s || currentApp) {
    let n = currentApp
      ? currentApp._context.provides
      : s
        ? s.parent == null || s.ce
          ? s.vnode.appContext && s.vnode.appContext.provides
          : s.parent.provides
        : void 0;
    if (n && e in n) return n[e];
    if (arguments.length > 1)
      return r && isFunction(t) ? t.call(s && s.proxy) : t;
  }
}
const ssrContextKey = Symbol.for('v-scx'),
  useSSRContext = () => inject(ssrContextKey);
function watch(e, t, r) {
  return doWatch(e, t, r);
}
function doWatch(e, t, r = EMPTY_OBJ) {
  const { immediate: s, deep: n, flush: i, once: a } = r,
    o = extend({}, r),
    l = (t && s) || (!t && i !== 'post');
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
  o.call = (M, P, E) => callWithAsyncErrorHandling(M, c, P, E);
  let h = !1;
  (i === 'post'
    ? (o.scheduler = (M) => {
        ((M.i = c), queuePostRenderEffect(M, c && c.suspense));
      })
    : i !== 'sync' &&
      ((h = !0),
      (o.scheduler = (M, P) => {
        P ? M() : queueJob(M);
      })),
    (o.augmentJob = (M) => {
      (t && (M.flags |= 4),
        h && ((M.flags |= 2), c && ((M.id = c.uid), (M.i = c))));
    }));
  const w = watch$1(e, t, o);
  return (isInSSRComponentSetup && (d ? d.push(w) : l && w()), w);
}
function instanceWatch(e, t, r) {
  const s = this.proxy,
    n = isString(e)
      ? e.includes('.')
        ? createPathGetter(s, e)
        : () => s[e]
      : e.bind(s, s);
  let i;
  isFunction(t) ? (i = t) : ((i = t.handler), (r = t));
  const a = setCurrentInstance(this),
    o = doWatch(n, i.bind(s), r);
  return (a(), o);
}
function createPathGetter(e, t) {
  const r = t.split('.');
  return () => {
    let s = e;
    for (let n = 0; n < r.length && s; n++) s = s[r[n]];
    return s;
  };
}
const TeleportEndKey = Symbol('_vte'),
  isTeleport = (e) => e.__isTeleport,
  leaveCbKey = Symbol('_leaveCb');
function findNonCommentChild(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const r of e)
      if (r.type !== Comment) {
        t = r;
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
  const { shapeFlag: t, children: r } = e;
  if (r) {
    if (t & 16) return r[0];
    if (t & 32 && isFunction(r.default)) return r.default();
  }
}
function setTransitionHooks(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const r = e.component.subTree;
    setTransitionHooks((isTeleport(r.type) && getInnerChild$1(r)) || r, t);
  } else if (e.shapeFlag & 128)
    ((e.ssContent.transition = t.clone(e.ssContent)),
      (e.ssFallback.transition = t.clone(e.ssFallback)));
  else if (((e.transition = t), e.type === Fragment && isArray(e.children))) {
    const r = filterSingleRoot(e.children, !1);
    r && setTransitionHooks(r, t);
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
  let r;
  return !!((r = Object.getOwnPropertyDescriptor(e, t)) && !r.configurable);
}
const pendingSetRefMap = new WeakMap();
function setRef(e, t, r, s, n = !1) {
  if (isArray(e)) {
    e.forEach((E, Y) => setRef(E, t && (isArray(t) ? t[Y] : t), r, s, n));
    return;
  }
  if (isAsyncWrapper(s) && !n) {
    s.shapeFlag & 512 &&
      s.type.__asyncResolved &&
      s.component.subTree.component &&
      setRef(e, t, r, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? getComponentPublicInstance(s.component) : s.el,
    a = n ? null : i,
    { i: o, r: l } = e,
    d = t && t.r,
    c = o.refs === EMPTY_OBJ ? (o.refs = {}) : o.refs,
    h = o.setupState,
    w = toRaw(h),
    M =
      h === EMPTY_OBJ
        ? NO
        : (E) => (isTemplateRefKey(c, E) ? !1 : hasOwn(w, E)),
    P = (E, Y) => !(Y && isTemplateRefKey(c, Y));
  if (d != null && d !== l) {
    if ((invalidatePendingSetRef(t), isString(d)))
      ((c[d] = null), M(d) && (h[d] = null));
    else if (isRef(d)) {
      const E = t;
      (P(d, E.k) && (d.value = null), E.k && (c[E.k] = null));
    }
  }
  if (isFunction(l)) callWithErrorHandling(l, o, 12, [a, c]);
  else {
    const E = isString(l),
      Y = isRef(l);
    if (E || Y) {
      const I = () => {
        if (e.f) {
          const B = E ? (M(l) ? h[l] : c[l]) : P() || !e.k ? l.value : c[e.k];
          if (n) isArray(B) && remove(B, i);
          else if (isArray(B)) B.includes(i) || B.push(i);
          else if (E) ((c[l] = [i]), M(l) && (h[l] = c[l]));
          else {
            const H = [i];
            (P(l, e.k) && (l.value = H), e.k && (c[e.k] = H));
          }
        } else
          E
            ? ((c[l] = a), M(l) && (h[l] = a))
            : Y && (P(l, e.k) && (l.value = a), e.k && (c[e.k] = a));
      };
      if (a) {
        const B = () => {
          (I(), pendingSetRefMap.delete(e));
        };
        ((B.id = -1), pendingSetRefMap.set(e, B), queuePostRenderEffect(B, r));
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
function registerKeepAliveHook(e, t, r = currentInstance) {
  const s =
    e.__wdc ||
    (e.__wdc = () => {
      let n = r;
      for (; n; ) {
        if (n.isDeactivated) return;
        n = n.parent;
      }
      return e();
    });
  if ((injectHook(t, s, r), r)) {
    let n = r.parent;
    for (; n && n.parent; )
      (isKeepAlive(n.parent.vnode) && injectToKeepAliveRoot(s, t, r, n),
        (n = n.parent));
  }
}
function injectToKeepAliveRoot(e, t, r, s) {
  const n = injectHook(t, e, s, !0);
  onUnmounted(() => {
    remove(s[t], n);
  }, r);
}
function injectHook(e, t, r = currentInstance, s = !1) {
  if (r) {
    const n = r[e] || (r[e] = []),
      i =
        t.__weh ||
        (t.__weh = (...a) => {
          pauseTracking();
          const o = setCurrentInstance(r),
            l = callWithAsyncErrorHandling(t, r, e, a);
          return (o(), resetTracking(), l);
        });
    return (s ? n.unshift(i) : n.push(i), i);
  }
}
const createHook =
    (e) =>
    (t, r = currentInstance) => {
      (!isInSSRComponentSetup || e === 'sp') &&
        injectHook(e, (...s) => t(...s), r);
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
function resolveAsset(e, t, r = !0, s = !1) {
  const n = currentRenderingInstance || currentInstance;
  if (n) {
    const i = n.type;
    {
      const o = getComponentName(i, !1);
      if (o && (o === t || o === camelize(t) || o === capitalize(camelize(t))))
        return i;
    }
    const a = resolve(n[e] || i[e], t) || resolve(n.appContext[e], t);
    return !a && s ? i : a;
  }
}
function resolve(e, t) {
  return e && (e[t] || e[camelize(t)] || e[capitalize(camelize(t))]);
}
function renderList(e, t, r, s) {
  let n;
  const i = r,
    a = isArray(e);
  if (a || isString(e)) {
    const o = a && isReactive(e);
    let l = !1,
      d = !1;
    (o && ((l = !isShallow(e)), (d = isReadonly(e)), (e = shallowReadArray(e))),
      (n = new Array(e.length)));
    for (let c = 0, h = e.length; c < h; c++)
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
function renderSlot(e, t, r, s, n, i) {
  if (
    (r == null && (r = {}),
    currentRenderingInstance.ce ||
      (currentRenderingInstance.parent &&
        isAsyncWrapper(currentRenderingInstance.parent) &&
        currentRenderingInstance.parent.ce))
  ) {
    const d = r,
      c = Object.keys(d).length > 0;
    return (
      t !== 'default' && (d.name = t),
      openBlock(),
      createBlock(
        Fragment,
        null,
        [createVNode('slot', d, s && s())],
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
    const d = a && ensureValidVNode(a(r)),
      c = r.key || i || (d && d.key);
    l = createBlock(
      Fragment,
      { key: (c && !isSymbol(c) ? c : `_${t}`) + (!d && s ? '_fb' : '') },
      d || (s ? s() : []),
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
        ctx: r,
        setupState: s,
        data: n,
        props: i,
        accessCache: a,
        type: o,
        appContext: l,
      } = e;
      if (t[0] !== '$') {
        const w = a[t];
        if (w !== void 0)
          switch (w) {
            case 1:
              return s[t];
            case 2:
              return n[t];
            case 4:
              return r[t];
            case 3:
              return i[t];
          }
        else {
          if (hasSetupBinding(s, t)) return ((a[t] = 1), s[t]);
          if (n !== EMPTY_OBJ && hasOwn(n, t)) return ((a[t] = 2), n[t]);
          if (hasOwn(i, t)) return ((a[t] = 3), i[t]);
          if (r !== EMPTY_OBJ && hasOwn(r, t)) return ((a[t] = 4), r[t]);
          shouldCacheAccess && (a[t] = 0);
        }
      }
      const d = publicPropertiesMap[t];
      let c, h;
      if (d) return (t === '$attrs' && track(e.attrs, 'get', ''), d(e));
      if ((c = o.__cssModules) && (c = c[t])) return c;
      if (r !== EMPTY_OBJ && hasOwn(r, t)) return ((a[t] = 4), r[t]);
      if (((h = l.config.globalProperties), hasOwn(h, t))) return h[t];
    },
    set({ _: e }, t, r) {
      const { data: s, setupState: n, ctx: i } = e;
      return hasSetupBinding(n, t)
        ? ((n[t] = r), !0)
        : s !== EMPTY_OBJ && hasOwn(s, t)
          ? ((s[t] = r), !0)
          : hasOwn(e.props, t) || (t[0] === '$' && t.slice(1) in e)
            ? !1
            : ((i[t] = r), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: r,
          ctx: s,
          appContext: n,
          props: i,
          type: a,
        },
      },
      o,
    ) {
      let l;
      return !!(
        r[o] ||
        (e !== EMPTY_OBJ && o[0] !== '$' && hasOwn(e, o)) ||
        hasSetupBinding(t, o) ||
        hasOwn(i, o) ||
        hasOwn(s, o) ||
        hasOwn(publicPropertiesMap, o) ||
        hasOwn(n.config.globalProperties, o) ||
        ((l = a.__cssModules) && l[o])
      );
    },
    defineProperty(e, t, r) {
      return (
        r.get != null
          ? (e._.accessCache[t] = 0)
          : hasOwn(r, 'value') && this.set(e, t, r.value, null),
        Reflect.defineProperty(e, t, r)
      );
    },
  };
function normalizePropsOrEmits(e) {
  return isArray(e) ? e.reduce((t, r) => ((t[r] = null), t), {}) : e;
}
let shouldCacheAccess = !0;
function applyOptions(e) {
  const t = resolveMergedOptions(e),
    r = e.proxy,
    s = e.ctx;
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
    beforeMount: h,
    mounted: w,
    beforeUpdate: M,
    updated: P,
    activated: E,
    deactivated: Y,
    beforeDestroy: I,
    beforeUnmount: B,
    destroyed: H,
    unmounted: V,
    render: L,
    renderTracked: G,
    renderTriggered: J,
    errorCaptured: X,
    serverPrefetch: se,
    expose: Q,
    inheritAttrs: te,
    components: ne,
    directives: ie,
    filters: ue,
  } = t;
  if ((d && resolveInjections(d, s, null), a))
    for (const K in a) {
      const x = a[K];
      isFunction(x) && (s[K] = x.bind(r));
    }
  if (n) {
    const K = n.call(r, r);
    isObject(K) && (e.data = reactive(K));
  }
  if (((shouldCacheAccess = !0), i))
    for (const K in i) {
      const x = i[K],
        re = isFunction(x)
          ? x.bind(r, r)
          : isFunction(x.get)
            ? x.get.bind(r, r)
            : NOOP,
        he = !isFunction(x) && isFunction(x.set) ? x.set.bind(r) : NOOP,
        ae = computed({ get: re, set: he });
      Object.defineProperty(s, K, {
        enumerable: !0,
        configurable: !0,
        get: () => ae.value,
        set: (Z) => (ae.value = Z),
      });
    }
  if (o) for (const K in o) createWatcher(o[K], s, r, K);
  if (l) {
    const K = isFunction(l) ? l.call(r) : l;
    Reflect.ownKeys(K).forEach((x) => {
      provide(x, K[x]);
    });
  }
  c && callHook(c, e, 'c');
  function z(K, x) {
    isArray(x) ? x.forEach((re) => K(re.bind(r))) : x && K(x.bind(r));
  }
  if (
    (z(onBeforeMount, h),
    z(onMounted, w),
    z(onBeforeUpdate, M),
    z(onUpdated, P),
    z(onActivated, E),
    z(onDeactivated, Y),
    z(onErrorCaptured, X),
    z(onRenderTracked, G),
    z(onRenderTriggered, J),
    z(onBeforeUnmount, B),
    z(onUnmounted, V),
    z(onServerPrefetch, se),
    isArray(Q))
  )
    if (Q.length) {
      const K = e.exposed || (e.exposed = {});
      Q.forEach((x) => {
        Object.defineProperty(K, x, {
          get: () => r[x],
          set: (re) => (r[x] = re),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  (L && e.render === NOOP && (e.render = L),
    te != null && (e.inheritAttrs = te),
    ne && (e.components = ne),
    ie && (e.directives = ie),
    se && markAsyncBoundary(e));
}
function resolveInjections(e, t, r = NOOP) {
  isArray(e) && (e = normalizeInject(e));
  for (const s in e) {
    const n = e[s];
    let i;
    (isObject(n)
      ? 'default' in n
        ? (i = inject(n.from || s, n.default, !0))
        : (i = inject(n.from || s))
      : (i = inject(n)),
      isRef(i)
        ? Object.defineProperty(t, s, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: (a) => (i.value = a),
          })
        : (t[s] = i));
  }
}
function callHook(e, t, r) {
  callWithAsyncErrorHandling(
    isArray(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    r,
  );
}
function createWatcher(e, t, r, s) {
  let n = s.includes('.') ? createPathGetter(r, s) : () => r[s];
  if (isString(e)) {
    const i = t[e];
    isFunction(i) && watch(n, i);
  } else if (isFunction(e)) watch(n, e.bind(r));
  else if (isObject(e))
    if (isArray(e)) e.forEach((i) => createWatcher(i, t, r, s));
    else {
      const i = isFunction(e.handler) ? e.handler.bind(r) : t[e.handler];
      isFunction(i) && watch(n, i, e);
    }
}
function resolveMergedOptions(e) {
  const t = e.type,
    { mixins: r, extends: s } = t,
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
      : !n.length && !r && !s
        ? (l = t)
        : ((l = {}),
          n.length && n.forEach((d) => mergeOptions(l, d, a, !0)),
          mergeOptions(l, t, a)),
    isObject(t) && i.set(t, l),
    l
  );
}
function mergeOptions(e, t, r, s = !1) {
  const { mixins: n, extends: i } = t;
  (i && mergeOptions(e, i, r, !0),
    n && n.forEach((a) => mergeOptions(e, a, r, !0)));
  for (const a in t)
    if (!(s && a === 'expose')) {
      const o = internalOptionMergeStrats[a] || (r && r[a]);
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
    for (let r = 0; r < e.length; r++) t[e[r]] = e[r];
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
  const r = extend(Object.create(null), e);
  for (const s in t) r[s] = mergeAsArray(e[s], t[s]);
  return r;
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
  return function (s, n = null) {
    (isFunction(s) || (s = extend({}, s)),
      n != null && !isObject(n) && (n = null));
    const i = createAppContext(),
      a = new WeakSet(),
      o = [];
    let l = !1;
    const d = (i.app = {
      _uid: uid$1++,
      _component: s,
      _props: n,
      _container: null,
      _context: i,
      _instance: null,
      version,
      get config() {
        return i.config;
      },
      set config(c) {},
      use(c, ...h) {
        return (
          a.has(c) ||
            (c && isFunction(c.install)
              ? (a.add(c), c.install(d, ...h))
              : isFunction(c) && (a.add(c), c(d, ...h))),
          d
        );
      },
      mixin(c) {
        return (i.mixins.includes(c) || i.mixins.push(c), d);
      },
      component(c, h) {
        return h ? ((i.components[c] = h), d) : i.components[c];
      },
      directive(c, h) {
        return h ? ((i.directives[c] = h), d) : i.directives[c];
      },
      mount(c, h, w) {
        if (!l) {
          const M = d._ceVNode || createVNode(s, n);
          return (
            (M.appContext = i),
            w === !0 ? (w = 'svg') : w === !1 && (w = void 0),
            e(M, c, w),
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
      provide(c, h) {
        return ((i.provides[c] = h), d);
      },
      runWithContext(c) {
        const h = currentApp;
        currentApp = d;
        try {
          return c();
        } finally {
          currentApp = h;
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
function emit(e, t, ...r) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || EMPTY_OBJ;
  let n = r;
  const i = t.startsWith('update:'),
    a = i && getModelModifiers(s, t.slice(7));
  a &&
    (a.trim && (n = r.map((c) => (isString(c) ? c.trim() : c))),
    a.number && (n = n.map(looseToNumber)));
  let o,
    l = s[(o = toHandlerKey(t))] || s[(o = toHandlerKey(camelize(t)))];
  (!l && i && (l = s[(o = toHandlerKey(hyphenate(t)))]),
    l && callWithAsyncErrorHandling(l, e, 6, n));
  const d = s[o + 'Once'];
  if (d) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[o]) return;
    ((e.emitted[o] = !0), callWithAsyncErrorHandling(d, e, 6, n));
  }
}
const mixinEmitsCache = new WeakMap();
function normalizeEmitsOptions(e, t, r = !1) {
  const s = r ? mixinEmitsCache : t.emitsCache,
    n = s.get(e);
  if (n !== void 0) return n;
  const i = e.emits;
  let a = {},
    o = !1;
  if (!isFunction(e)) {
    const l = (d) => {
      const c = normalizeEmitsOptions(d, t, !0);
      c && ((o = !0), extend(a, c));
    };
    (!r && t.mixins.length && t.mixins.forEach(l),
      e.extends && l(e.extends),
      e.mixins && e.mixins.forEach(l));
  }
  return !i && !o
    ? (isObject(e) && s.set(e, null), null)
    : (isArray(i) ? i.forEach((l) => (a[l] = null)) : extend(a, i),
      isObject(e) && s.set(e, a),
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
      vnode: r,
      proxy: s,
      withProxy: n,
      propsOptions: [i],
      slots: a,
      attrs: o,
      emit: l,
      render: d,
      renderCache: c,
      props: h,
      data: w,
      setupState: M,
      ctx: P,
      inheritAttrs: E,
    } = e,
    Y = setCurrentRenderingInstance(e);
  let I, B;
  try {
    if (r.shapeFlag & 4) {
      const V = n || s,
        L = V;
      ((I = normalizeVNode(d.call(L, V, c, h, M, w, P))), (B = o));
    } else {
      const V = t;
      ((I = normalizeVNode(
        V.length > 1 ? V(h, { attrs: o, slots: a, emit: l }) : V(h, null),
      )),
        (B = t.props ? o : getFunctionalFallthrough(o)));
    }
  } catch (V) {
    ((blockStack.length = 0), handleError(V, e, 1), (I = createVNode(Comment)));
  }
  let H = I;
  if (B && E !== !1) {
    const V = Object.keys(B),
      { shapeFlag: L } = H;
    V.length &&
      L & 7 &&
      (i && V.some(isModelListener) && (B = filterModelListeners(B, i)),
      (H = cloneVNode(H, B, !1, !0)));
  }
  if (
    (r.dirs &&
      ((H = cloneVNode(H, null, !1, !0)),
      (H.dirs = H.dirs ? H.dirs.concat(r.dirs) : r.dirs)),
    r.transition)
  ) {
    const V = (isTeleport(H.type) && getInnerChild$1(H)) || H;
    setTransitionHooks(V, r.transition);
  }
  return ((I = H), setCurrentRenderingInstance(Y), I);
}
function filterSingleRoot(e, t = !0) {
  let r;
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    if (isVNode(n)) {
      if (n.type !== Comment || n.children === 'v-if') {
        if (r) return;
        r = n;
      }
    } else return;
  }
  return r;
}
const getFunctionalFallthrough = (e) => {
    let t;
    for (const r in e)
      (r === 'class' || r === 'style' || isOn(r)) &&
        ((t || (t = {}))[r] = e[r]);
    return t;
  },
  filterModelListeners = (e, t) => {
    const r = {};
    for (const s in e)
      (!isModelListener(s) || !(s.slice(9) in t)) && (r[s] = e[s]);
    return r;
  };
function shouldUpdateComponent(e, t, r) {
  const { props: s, children: n, component: i } = e,
    { props: a, children: o, patchFlag: l } = t,
    d = i.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (r && l >= 0) {
    if (l & 1024) return !0;
    if (l & 16) return s ? hasPropsChanged(s, a, d) : !!a;
    if (l & 8) {
      const c = t.dynamicProps;
      for (let h = 0; h < c.length; h++) {
        const w = c[h];
        if (hasPropValueChanged(a, s, w) && !isEmitListener(d, w)) return !0;
      }
    }
  } else
    return (n || o) && (!o || !o.$stable)
      ? !0
      : s === a
        ? !1
        : s
          ? a
            ? hasPropsChanged(s, a, d)
            : !0
          : !!a;
  return !1;
}
function hasPropsChanged(e, t, r) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let n = 0; n < s.length; n++) {
    const i = s[n];
    if (
      !hasOwn(e, i) ||
      (hasPropValueChanged(t, e, i) && !isEmitListener(r, i))
    )
      return !0;
  }
  return !1;
}
function hasPropValueChanged(e, t, r) {
  const s = e[r],
    n = t[r];
  return r === 'style' && isObject(s) && isObject(n)
    ? !looseEqual(s, n)
    : s !== n;
}
function updateHOCHostEl({ vnode: e, parent: t, suspense: r }, s) {
  for (; t; ) {
    const n = t.subTree;
    if (
      (n.suspense &&
        n.suspense.activeBranch === e &&
        ((n.suspense.vnode.el = n.el = s), (e = n)),
      n === e)
    )
      (((e = t.vnode).el = s), (t = t.parent));
    else break;
  }
  r && r.activeBranch === e && (r.vnode.el = s);
}
const internalObjectProto = {},
  createInternalObject = () => Object.create(internalObjectProto),
  isInternalObject = (e) => Object.getPrototypeOf(e) === internalObjectProto;
function initProps(e, t, r, s = !1) {
  const n = {},
    i = createInternalObject();
  ((e.propsDefaults = Object.create(null)), setFullProps(e, t, n, i));
  for (const a in e.propsOptions[0]) a in n || (n[a] = void 0);
  (r
    ? (e.props = s ? n : shallowReactive(n))
    : e.type.props
      ? (e.props = n)
      : (e.props = i),
    (e.attrs = i));
}
function updateProps(e, t, r, s) {
  const {
      props: n,
      attrs: i,
      vnode: { patchFlag: a },
    } = e,
    o = toRaw(n),
    [l] = e.propsOptions;
  let d = !1;
  if ((s || a > 0) && !(a & 16)) {
    if (a & 8) {
      const c = e.vnode.dynamicProps;
      for (let h = 0; h < c.length; h++) {
        let w = c[h];
        if (isEmitListener(e.emitsOptions, w)) continue;
        const M = t[w];
        if (l)
          if (hasOwn(i, w)) M !== i[w] && ((i[w] = M), (d = !0));
          else {
            const P = camelize(w);
            n[P] = resolvePropValue(l, o, P, M, e, !1);
          }
        else M !== i[w] && ((i[w] = M), (d = !0));
      }
    }
  } else {
    setFullProps(e, t, n, i) && (d = !0);
    let c;
    for (const h in o)
      (!t || (!hasOwn(t, h) && ((c = hyphenate(h)) === h || !hasOwn(t, c)))) &&
        (l
          ? r &&
            (r[h] !== void 0 || r[c] !== void 0) &&
            (n[h] = resolvePropValue(l, o, h, void 0, e, !0))
          : delete n[h]);
    if (i !== o)
      for (const h in i) (!t || !hasOwn(t, h)) && (delete i[h], (d = !0));
  }
  d && trigger(e.attrs, 'set', '');
}
function setFullProps(e, t, r, s) {
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
          ? (r[c] = d)
          : ((o || (o = {}))[c] = d)
        : isEmitListener(e.emitsOptions, l) ||
          ((!(l in s) || d !== s[l]) && ((s[l] = d), (a = !0)));
    }
  if (i) {
    const l = toRaw(r),
      d = o || EMPTY_OBJ;
    for (let c = 0; c < i.length; c++) {
      const h = i[c];
      r[h] = resolvePropValue(n, l, h, d[h], e, !hasOwn(d, h));
    }
  }
  return a;
}
function resolvePropValue(e, t, r, s, n, i) {
  const a = e[r];
  if (a != null) {
    const o = hasOwn(a, 'default');
    if (o && s === void 0) {
      const l = a.default;
      if (a.type !== Function && !a.skipFactory && isFunction(l)) {
        const { propsDefaults: d } = n;
        if (r in d) s = d[r];
        else {
          const c = setCurrentInstance(n);
          ((s = d[r] = l.call(null, t)), c());
        }
      } else s = l;
      n.ce && n.ce._setProp(r, s);
    }
    a[0] &&
      (i && !o
        ? (s = !1)
        : a[1] && (s === '' || s === hyphenate(r)) && (s = !0));
  }
  return s;
}
const mixinPropsCache = new WeakMap();
function normalizePropsOptions(e, t, r = !1) {
  const s = r ? mixinPropsCache : t.propsCache,
    n = s.get(e);
  if (n) return n;
  const i = e.props,
    a = {},
    o = [];
  let l = !1;
  if (!isFunction(e)) {
    const c = (h) => {
      l = !0;
      const [w, M] = normalizePropsOptions(h, t, !0);
      (extend(a, w), M && o.push(...M));
    };
    (!r && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c));
  }
  if (!i && !l) return (isObject(e) && s.set(e, EMPTY_ARR), EMPTY_ARR);
  if (isArray(i))
    for (let c = 0; c < i.length; c++) {
      const h = camelize(i[c]);
      validatePropName(h) && (a[h] = EMPTY_OBJ);
    }
  else if (i)
    for (const c in i) {
      const h = camelize(c);
      if (validatePropName(h)) {
        const w = i[c],
          M = (a[h] =
            isArray(w) || isFunction(w) ? { type: w } : extend({}, w)),
          P = M.type;
        let E = !1,
          Y = !0;
        if (isArray(P))
          for (let I = 0; I < P.length; ++I) {
            const B = P[I],
              H = isFunction(B) && B.name;
            if (H === 'Boolean') {
              E = !0;
              break;
            } else H === 'String' && (Y = !1);
          }
        else E = isFunction(P) && P.name === 'Boolean';
        ((M[0] = E), (M[1] = Y), (E || hasOwn(M, 'default')) && o.push(h));
      }
    }
  const d = [a, o];
  return (isObject(e) && s.set(e, d), d);
}
function validatePropName(e) {
  return e[0] !== '$' && !isReservedProp(e);
}
const isInternalKey = (e) => e === '_' || e === '_ctx' || e === '$stable',
  normalizeSlotValue = (e) =>
    isArray(e) ? e.map(normalizeVNode) : [normalizeVNode(e)],
  normalizeSlot = (e, t, r) => {
    if (t._n) return t;
    const s = withCtx((...n) => normalizeSlotValue(t(...n)), r);
    return ((s._c = !1), s);
  },
  normalizeObjectSlots = (e, t, r) => {
    const s = e._ctx;
    for (const n in e) {
      if (isInternalKey(n)) continue;
      const i = e[n];
      if (isFunction(i)) t[n] = normalizeSlot(n, i, s);
      else if (i != null) {
        const a = normalizeSlotValue(i);
        t[n] = () => a;
      }
    }
  },
  normalizeVNodeSlots = (e, t) => {
    const r = normalizeSlotValue(t);
    e.slots.default = () => r;
  },
  assignSlots = (e, t, r) => {
    for (const s in t) (r || !isInternalKey(s)) && (e[s] = t[s]);
  },
  initSlots = (e, t, r) => {
    const s = (e.slots = createInternalObject());
    if (e.vnode.shapeFlag & 32) {
      const n = t._;
      n
        ? (assignSlots(s, t, r), r && def(s, '_', n, !0))
        : normalizeObjectSlots(t, s);
    } else t && normalizeVNodeSlots(e, t);
  },
  updateSlots = (e, t, r) => {
    const { vnode: s, slots: n } = e;
    let i = !0,
      a = EMPTY_OBJ;
    if (s.shapeFlag & 32) {
      const o = t._;
      (o
        ? r && o === 1
          ? (i = !1)
          : assignSlots(n, t, r)
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
  const r = getGlobalThis();
  r.__VUE__ = !0;
  const {
      insert: s,
      remove: n,
      patchProp: i,
      createElement: a,
      createText: o,
      createComment: l,
      setText: d,
      setElementText: c,
      parentNode: h,
      nextSibling: w,
      setScopeId: M = NOOP,
      insertStaticContent: P,
    } = e,
    E = (
      u,
      f,
      g,
      S = null,
      v = null,
      b = null,
      _ = void 0,
      C = null,
      k = !!f.dynamicChildren,
    ) => {
      if (u === f) return;
      (u && !isSameVNodeType(u, f) && ((S = pe(u)), Z(u, v, b, !0), (u = null)),
        f.patchFlag === -2 && ((k = !1), (f.dynamicChildren = null)),
        f.dynamicChildren &&
          u &&
          u.dynamicChildren &&
          u.dynamicChildren.hasOnce &&
          (f.dynamicChildren === EMPTY_ARR && (f.dynamicChildren = []),
          (f.dynamicChildren.hasOnce = !0)));
      const { type: y, ref: N, shapeFlag: T } = f;
      switch (y) {
        case Text:
          Y(u, f, g, S);
          break;
        case Comment:
          I(u, f, g, S);
          break;
        case Static:
          u == null && B(f, g, S, _);
          break;
        case Fragment:
          ne(u, f, g, S, v, b, _, C, k);
          break;
        default:
          T & 1
            ? L(u, f, g, S, v, b, _, C, k)
            : T & 6
              ? ie(u, f, g, S, v, b, _, C, k)
              : (T & 64 || T & 128) && y.process(u, f, g, S, v, b, _, C, k, m);
      }
      N != null && v
        ? setRef(N, u && u.ref, b, f || u, !f)
        : N == null && u && u.ref != null && setRef(u.ref, null, b, u, !0);
    },
    Y = (u, f, g, S) => {
      if (u == null) s((f.el = o(f.children)), g, S);
      else {
        const v = (f.el = u.el);
        f.children !== u.children && d(v, f.children);
      }
    },
    I = (u, f, g, S) => {
      u == null ? s((f.el = l(f.children || '')), g, S) : (f.el = u.el);
    },
    B = (u, f, g, S) => {
      [u.el, u.anchor] = P(u.children, f, g, S, u.el, u.anchor);
    },
    H = ({ el: u, anchor: f }, g, S) => {
      let v;
      for (; u && u !== f; ) ((v = w(u)), s(u, g, S), (u = v));
      s(f, g, S);
    },
    V = ({ el: u, anchor: f }) => {
      let g;
      for (; u && u !== f; ) ((g = w(u)), n(u), (u = g));
      n(f);
    },
    L = (u, f, g, S, v, b, _, C, k) => {
      if (
        (f.type === 'svg' ? (_ = 'svg') : f.type === 'math' && (_ = 'mathml'),
        u == null)
      )
        G(f, g, S, v, b, _, C, k);
      else {
        const y = u.el && u.el._isVueCE ? u.el : null;
        try {
          (y && y._beginPatch(), se(u, f, v, b, _, C, k));
        } finally {
          y && y._endPatch();
        }
      }
    },
    G = (u, f, g, S, v, b, _, C) => {
      let k, y;
      const { props: N, shapeFlag: T, transition: A, dirs: O } = u;
      if (
        ((k = u.el = a(u.type, b, N && N.is, N)),
        T & 8
          ? c(k, u.children)
          : T & 16 &&
            X(u.children, k, null, S, v, resolveChildrenNamespace(u, b), _, C),
        O && invokeDirectiveHook(u, null, S, 'created'),
        J(k, u, u.scopeId, _, S),
        N)
      ) {
        for (const W in N)
          W !== 'value' && !isReservedProp(W) && i(k, W, null, N[W], b, S);
        ('value' in N && i(k, 'value', null, N.value, b),
          (y = N.onVnodeBeforeMount) && invokeVNodeHook(y, S, u));
      }
      O && invokeDirectiveHook(u, null, S, 'beforeMount');
      const j = needTransition(v, A);
      (j && A.beforeEnter(k),
        s(k, f, g),
        ((y = N && N.onVnodeMounted) || j || O) &&
          queuePostRenderEffect(() => {
            (y && invokeVNodeHook(y, S, u),
              j && A.enter(k),
              O && invokeDirectiveHook(u, null, S, 'mounted'));
          }, v));
    },
    J = (u, f, g, S, v) => {
      if ((g && M(u, g), S)) for (let b = 0; b < S.length; b++) M(u, S[b]);
      if (v) {
        let b = v.subTree;
        if (
          f === b ||
          (isSuspense(b.type) && (b.ssContent === f || b.ssFallback === f))
        ) {
          const _ = v.vnode;
          J(u, _, _.scopeId, _.slotScopeIds, v.parent);
        }
      }
    },
    X = (u, f, g, S, v, b, _, C, k = 0) => {
      for (let y = k; y < u.length; y++) {
        const N = (u[y] = C ? cloneIfMounted(u[y]) : normalizeVNode(u[y]));
        E(null, N, f, g, S, v, b, _, C);
      }
    },
    se = (u, f, g, S, v, b, _) => {
      const C = (f.el = u.el);
      let { patchFlag: k, dynamicChildren: y, dirs: N } = f;
      k |= u.patchFlag & 16;
      const T = u.props || EMPTY_OBJ,
        A = f.props || EMPTY_OBJ;
      let O;
      if (
        (g && toggleRecurse(g, !1),
        (O = A.onVnodeBeforeUpdate) && invokeVNodeHook(O, g, f, u),
        N && invokeDirectiveHook(f, u, g, 'beforeUpdate'),
        g && toggleRecurse(g, !0),
        y &&
          (!u.dynamicChildren || u.dynamicChildren.length !== y.length) &&
          ((k = 0), (_ = !1), (y = null)),
        ((T.innerHTML && A.innerHTML == null) ||
          (T.textContent && A.textContent == null)) &&
          c(C, ''),
        y
          ? Q(u.dynamicChildren, y, C, g, S, resolveChildrenNamespace(f, v), b)
          : _ || x(u, f, C, null, g, S, resolveChildrenNamespace(f, v), b, !1),
        k > 0)
      ) {
        if (k & 16) te(C, T, A, g, v);
        else if (
          (k & 2 && T.class !== A.class && i(C, 'class', null, A.class, v),
          k & 4 && i(C, 'style', T.style, A.style, v),
          k & 8)
        ) {
          const j = f.dynamicProps;
          for (let W = 0; W < j.length; W++) {
            const F = j[W],
              U = T[F],
              q = A[F];
            (q !== U || F === 'value') && i(C, F, U, q, v, g);
          }
        }
        k & 1 && u.children !== f.children && c(C, f.children);
      } else !_ && y == null && te(C, T, A, g, v);
      ((O = A.onVnodeUpdated) || N) &&
        queuePostRenderEffect(() => {
          (O && invokeVNodeHook(O, g, f, u),
            N && invokeDirectiveHook(f, u, g, 'updated'));
        }, S);
    },
    Q = (u, f, g, S, v, b, _) => {
      for (let C = 0; C < f.length; C++) {
        const k = u[C],
          y = f[C],
          N = k.el || resolveAsyncComponentPlaceholder(k),
          T =
            N &&
            (k.type === Fragment || !isSameVNodeType(k, y) || k.shapeFlag & 198)
              ? h(N)
              : g;
        E(k, y, T, null, S, v, b, _, !0);
      }
    },
    te = (u, f, g, S, v) => {
      if (f !== g) {
        if (f !== EMPTY_OBJ)
          for (const b in f)
            !isReservedProp(b) && !(b in g) && i(u, b, f[b], null, v, S);
        for (const b in g) {
          if (isReservedProp(b)) continue;
          const _ = g[b],
            C = f[b];
          _ !== C && b !== 'value' && i(u, b, C, _, v, S);
        }
        'value' in g && i(u, 'value', f.value, g.value, v);
      }
    },
    ne = (u, f, g, S, v, b, _, C, k) => {
      const y = (f.el = u ? u.el : o('')),
        N = (f.anchor = u ? u.anchor : o(''));
      let { patchFlag: T, dynamicChildren: A, slotScopeIds: O } = f;
      (O && (C = C ? C.concat(O) : O),
        u == null
          ? (s(y, g, S), s(N, g, S), X(f.children || [], g, N, v, b, _, C, k))
          : T > 0 &&
              T & 64 &&
              A &&
              u.dynamicChildren &&
              u.dynamicChildren.length === A.length
            ? (Q(u.dynamicChildren, A, g, v, b, _, C),
              (f.key != null || (v && f === v.subTree)) &&
                traverseStaticChildren(u, f, !0))
            : x(u, f, g, N, v, b, _, C, k));
    },
    ie = (u, f, g, S, v, b, _, C, k) => {
      ((f.slotScopeIds = C),
        u == null
          ? f.shapeFlag & 512
            ? v.ctx.activate(f, g, S, _, k)
            : ue(f, g, S, v, b, _, k)
          : R(u, f, k));
    },
    ue = (u, f, g, S, v, b, _) => {
      const C = (u.component = createComponentInstance(u, S, v));
      if (
        (isKeepAlive(u) && (C.ctx.renderer = m),
        setupComponent(C, !1, _),
        C.asyncDep)
      ) {
        if ((v && v.registerDep(C, z, _, b), !u.el)) {
          const k = (C.subTree = createVNode(Comment));
          (I(null, k, f, g), (u.placeholder = k.el));
        }
      } else z(C, u, f, g, v, b, _);
    },
    R = (u, f, g) => {
      const S = (f.component = u.component);
      if (shouldUpdateComponent(u, f, g))
        if (S.asyncDep && !S.asyncResolved) {
          ((f.el = u.el), (f.placeholder = u.placeholder), K(S, f, g));
          return;
        } else ((S.next = f), S.update());
      else ((f.el = u.el), (f.placeholder = u.placeholder), (S.vnode = f));
    },
    z = (u, f, g, S, v, b, _) => {
      const C = () => {
        if (u.isMounted) {
          let { next: T, bu: A, u: O, parent: j, vnode: W } = u;
          {
            const le = locateNonHydratedAsyncRoot(u);
            if (le) {
              (T && ((T.el = W.el), K(u, T, _)),
                le.asyncDep.then(() => {
                  queuePostRenderEffect(() => {
                    u.isUnmounted || y();
                  }, v);
                }));
              return;
            }
          }
          let F = T,
            U;
          (toggleRecurse(u, !1),
            T ? ((T.el = W.el), K(u, T, _)) : (T = W),
            A && invokeArrayFns(A),
            (U = T.props && T.props.onVnodeBeforeUpdate) &&
              invokeVNodeHook(U, j, T, W),
            toggleRecurse(u, !0));
          const q = renderComponentRoot(u),
            oe = u.subTree;
          ((u.subTree = q),
            E(oe, q, h(oe.el), pe(oe), u, v, b),
            (T.el = q.el),
            F === null && updateHOCHostEl(u, q.el),
            O && queuePostRenderEffect(O, v),
            (U = T.props && T.props.onVnodeUpdated) &&
              queuePostRenderEffect(() => invokeVNodeHook(U, j, T, W), v));
        } else {
          let T;
          const { el: A, props: O } = f,
            { bm: j, m: W, parent: F, root: U, type: q } = u,
            oe = isAsyncWrapper(f);
          (toggleRecurse(u, !1),
            j && invokeArrayFns(j),
            !oe && (T = O && O.onVnodeBeforeMount) && invokeVNodeHook(T, F, f),
            toggleRecurse(u, !0));
          {
            U.ce &&
              U.ce._hasShadowRoot() &&
              U.ce._injectChildStyle(q, u.parent ? u.parent.type : void 0);
            const le = (u.subTree = renderComponentRoot(u));
            (E(null, le, g, S, u, v, b), (f.el = le.el));
          }
          if (
            (W && queuePostRenderEffect(W, v),
            !oe && (T = O && O.onVnodeMounted))
          ) {
            const le = f;
            queuePostRenderEffect(() => invokeVNodeHook(T, F, le), v);
          }
          ((f.shapeFlag & 256 ||
            (F && isAsyncWrapper(F.vnode) && F.vnode.shapeFlag & 256)) &&
            u.a &&
            queuePostRenderEffect(u.a, v),
            (u.isMounted = !0),
            (f = g = S = null));
        }
      };
      u.scope.on();
      const k = (u.effect = new ReactiveEffect(C));
      u.scope.off();
      const y = (u.update = k.run.bind(k)),
        N = (u.job = k.runIfDirty.bind(k));
      ((N.i = u),
        (N.id = u.uid),
        (k.scheduler = () => queueJob(N)),
        toggleRecurse(u, !0),
        y());
    },
    K = (u, f, g) => {
      f.component = u;
      const S = u.vnode.props;
      ((u.vnode = f),
        (u.next = null),
        updateProps(u, f.props, S, g),
        updateSlots(u, f.children, g),
        pauseTracking(),
        flushPreFlushCbs(u),
        resetTracking());
    },
    x = (u, f, g, S, v, b, _, C, k = !1) => {
      const y = u && u.children,
        N = u ? u.shapeFlag : 0,
        T = f.children,
        { patchFlag: A, shapeFlag: O } = f;
      if (A > 0) {
        if (A & 128) {
          he(y, T, g, S, v, b, _, C, k);
          return;
        } else if (A & 256) {
          re(y, T, g, S, v, b, _, C, k);
          return;
        }
      }
      O & 8
        ? (N & 16 && de(y, v, b), T !== y && c(g, T))
        : N & 16
          ? O & 16
            ? he(y, T, g, S, v, b, _, C, k)
            : de(y, v, b, !0)
          : (N & 8 && c(g, ''), O & 16 && X(T, g, S, v, b, _, C, k));
    },
    re = (u, f, g, S, v, b, _, C, k) => {
      ((u = u || EMPTY_ARR), (f = f || EMPTY_ARR));
      const y = u.length,
        N = f.length,
        T = Math.min(y, N);
      let A;
      for (A = 0; A < T; A++) {
        const O = (f[A] = k ? cloneIfMounted(f[A]) : normalizeVNode(f[A]));
        E(u[A], O, g, null, v, b, _, C, k);
      }
      y > N ? de(u, v, b, !0, !1, T) : X(f, g, S, v, b, _, C, k, T);
    },
    he = (u, f, g, S, v, b, _, C, k) => {
      let y = 0;
      const N = f.length;
      let T = u.length - 1,
        A = N - 1;
      for (; y <= T && y <= A; ) {
        const O = u[y],
          j = (f[y] = k ? cloneIfMounted(f[y]) : normalizeVNode(f[y]));
        if (isSameVNodeType(O, j)) E(O, j, g, null, v, b, _, C, k);
        else break;
        y++;
      }
      for (; y <= T && y <= A; ) {
        const O = u[T],
          j = (f[A] = k ? cloneIfMounted(f[A]) : normalizeVNode(f[A]));
        if (isSameVNodeType(O, j)) E(O, j, g, null, v, b, _, C, k);
        else break;
        (T--, A--);
      }
      if (y > T) {
        if (y <= A) {
          const O = A + 1,
            j = O < N ? f[O].el : S;
          for (; y <= A; )
            (E(
              null,
              (f[y] = k ? cloneIfMounted(f[y]) : normalizeVNode(f[y])),
              g,
              j,
              v,
              b,
              _,
              C,
              k,
            ),
              y++);
        }
      } else if (y > A) for (; y <= T; ) (Z(u[y], v, b, !0), y++);
      else {
        const O = y,
          j = y,
          W = new Map();
        for (y = j; y <= A; y++) {
          const ee = (f[y] = k ? cloneIfMounted(f[y]) : normalizeVNode(f[y]));
          ee.key != null && W.set(ee.key, y);
        }
        let F,
          U = 0;
        const q = A - j + 1;
        let oe = !1,
          le = 0;
        const ge = new Array(q);
        for (y = 0; y < q; y++) ge[y] = 0;
        for (y = O; y <= T; y++) {
          const ee = u[y];
          if (U >= q) {
            Z(ee, v, b, !0);
            continue;
          }
          let ce;
          if (ee.key != null) ce = W.get(ee.key);
          else
            for (F = j; F <= A; F++)
              if (ge[F - j] === 0 && isSameVNodeType(ee, f[F])) {
                ce = F;
                break;
              }
          ce === void 0
            ? Z(ee, v, b, !0)
            : ((ge[ce - j] = y + 1),
              ce >= le ? (le = ce) : (oe = !0),
              E(ee, f[ce], g, null, v, b, _, C, k),
              U++);
        }
        const ve = oe ? getSequence(ge) : EMPTY_ARR;
        for (F = ve.length - 1, y = q - 1; y >= 0; y--) {
          const ee = j + y,
            ce = f[ee],
            be = f[ee + 1],
            De = ee + 1 < N ? be.el || resolveAsyncComponentPlaceholder(be) : S;
          ge[y] === 0
            ? E(null, ce, g, De, v, b, _, C, k)
            : oe && (F < 0 || y !== ve[F] ? ae(ce, g, De, 2) : F--);
        }
      }
    },
    ae = (u, f, g, S, v = null) => {
      const { el: b, type: _, transition: C, children: k, shapeFlag: y } = u;
      if (y & 6) {
        ae(u.component.subTree, f, g, S);
        return;
      }
      if (y & 128) {
        u.suspense.move(f, g, S);
        return;
      }
      if (y & 64) {
        _.move(u, f, g, m);
        return;
      }
      if (_ === Fragment) {
        s(b, f, g);
        for (let T = 0; T < k.length; T++) ae(k[T], f, g, S);
        s(u.anchor, f, g);
        return;
      }
      if (_ === Static) {
        H(u, f, g);
        return;
      }
      if (S !== 2 && y & 1 && C)
        if (S === 0)
          C.persisted && !b[leaveCbKey]
            ? s(b, f, g)
            : (C.beforeEnter(b),
              s(b, f, g),
              queuePostRenderEffect(() => C.enter(b), v));
        else {
          const { leave: T, delayLeave: A, afterLeave: O } = C,
            j = () => {
              u.ctx.isUnmounted ? n(b) : s(b, f, g);
            },
            W = () => {
              const F = b._isLeaving || !!b[leaveCbKey];
              (b._isLeaving && b[leaveCbKey](!0),
                C.persisted && !F
                  ? j()
                  : T(b, () => {
                      (j(), O && O());
                    }));
            };
          A ? A(b, j, W) : W();
        }
      else s(b, f, g);
    },
    Z = (u, f, g, S = !1, v = !1) => {
      const {
        type: b,
        props: _,
        ref: C,
        children: k,
        dynamicChildren: y,
        shapeFlag: N,
        patchFlag: T,
        dirs: A,
        cacheIndex: O,
        memo: j,
      } = u;
      if (
        ((T === -2 || (y && y.hasOnce)) && (v = !1),
        C != null &&
          (pauseTracking(), setRef(C, null, g, u, !0), resetTracking()),
        O != null && (!u.ctx || u.ctx === f) && (f.renderCache[O] = void 0),
        N & 256)
      ) {
        f.ctx.deactivate(u);
        return;
      }
      const W = N & 1 && A,
        F = !isAsyncWrapper(u);
      let U;
      if (
        (F && (U = _ && _.onVnodeBeforeUnmount) && invokeVNodeHook(U, f, u),
        N & 6)
      )
        ye(u.component, g, S);
      else {
        if (N & 128) {
          u.suspense.unmount(g, S);
          return;
        }
        (W && invokeDirectiveHook(u, null, f, 'beforeUnmount'),
          N & 64
            ? u.type.remove(u, f, g, m, S)
            : y && !y.hasOnce && (b !== Fragment || (T > 0 && T & 64))
              ? de(y, f, g, !1, !0)
              : ((b === Fragment && T & 384) || (!v && N & 16)) && de(k, f, g),
          S && fe(u));
      }
      const q = j != null && O == null;
      ((F && (U = _ && _.onVnodeUnmounted)) || W || q) &&
        queuePostRenderEffect(() => {
          (U && invokeVNodeHook(U, f, u),
            W && invokeDirectiveHook(u, null, f, 'unmounted'),
            q && (u.el = null));
        }, g);
    },
    fe = (u) => {
      const { type: f, el: g, anchor: S, transition: v } = u,
        b = f === Fragment;
      if (b && !v) {
        me(g, S);
        return;
      }
      if (f === Static) {
        (V(u), v && !v.persisted && v.afterLeave && v.afterLeave());
        return;
      }
      const _ = b ? getTransitionRoot(u) : u,
        C = () => {
          (b ? h(g) && me(g, S) : n(g),
            v && !v.persisted && v.afterLeave && v.afterLeave());
        };
      if (_ && _.shapeFlag & 1 && v && !v.persisted) {
        const { leave: k, delayLeave: y } = v,
          N = _.el,
          T = () => k(N, C);
        y ? y(N, C, T) : T();
      } else C();
    },
    me = (u, f) => {
      let g;
      for (; u !== f; ) ((g = w(u)), n(u), (u = g));
      n(f);
    },
    ye = (u, f, g) => {
      const { bum: S, scope: v, job: b, subTree: _, um: C, m: k, a: y } = u;
      (invalidateMount(k),
        invalidateMount(y),
        S && invokeArrayFns(S),
        v.stop(),
        b
          ? ((b.flags |= 8), Z(_, u, f, g))
          : u.vnode.el &&
            _ &&
            ((_.transition = u.vnode.transition), Z(_, u, f, g)),
        C && queuePostRenderEffect(C, f),
        queuePostRenderEffect(() => {
          u.isUnmounted = !0;
        }, f));
    },
    de = (u, f, g, S = !1, v = !1, b = 0) => {
      for (let _ = b; _ < u.length; _++) Z(u[_], f, g, S, v);
    },
    pe = (u) => {
      if (u.shapeFlag & 6) return pe(u.component.subTree);
      if (u.shapeFlag & 128) return u.suspense.next();
      const f = w(u.anchor || u.el),
        g = f && f[TeleportEndKey];
      return g ? w(g) : f;
    },
    $ = (u, f, g) => {
      const S =
        u && f._vnode
          ? void 0
          : u && u.component
            ? u.component.uid
            : getNextUid();
      flushOnAppMount(() => {
        (u == null
          ? f._vnode && Z(f._vnode, null, null, !0)
          : E(f._vnode || null, u, f, null, null, null, g),
          (f._vnode = u));
      }, S);
    },
    m = {
      p: E,
      um: Z,
      m: ae,
      r: fe,
      mt: ue,
      mc: X,
      pc: x,
      pbc: Q,
      n: pe,
      o: e,
    };
  return { render: $, hydrate: void 0, createApp: createAppAPI($) };
}
function resolveChildrenNamespace({ type: e, props: t }, r) {
  return (r === 'svg' && e === 'foreignObject') ||
    (r === 'mathml' &&
      e === 'annotation-xml' &&
      t &&
      t.encoding &&
      t.encoding.includes('html'))
    ? void 0
    : r;
}
function toggleRecurse({ effect: e, job: t }, r) {
  r ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function needTransition(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function traverseStaticChildren(e, t, r = !1) {
  const s = e.children,
    n = t.children;
  if (isArray(s) && isArray(n))
    for (let i = 0; i < s.length; i++) {
      const a = s[i];
      let o = n[i];
      (o.shapeFlag & 1 &&
        !o.dynamicChildren &&
        ((o.patchFlag <= 0 || o.patchFlag === 32) &&
          ((o = n[i] = cloneIfMounted(n[i])), (o.el = a.el)),
        !r && o.patchFlag !== -2 && traverseStaticChildren(a, o)),
        o.type === Text &&
          (o.patchFlag === -1 && (o = n[i] = cloneIfMounted(o)), (o.el = a.el)),
        o.type === Comment && !o.el && (o.el = a.el));
    }
}
function getSequence(e) {
  const t = e.slice(),
    r = [0];
  let s, n, i, a, o;
  const l = e.length;
  for (s = 0; s < l; s++) {
    const d = e[s];
    if (d !== 0) {
      if (((n = r[r.length - 1]), e[n] < d)) {
        ((t[s] = n), r.push(s));
        continue;
      }
      for (i = 0, a = r.length - 1; i < a; )
        ((o = (i + a) >> 1), e[r[o]] < d ? (i = o + 1) : (a = o));
      d < e[r[i]] && (i > 0 && (t[s] = r[i - 1]), (r[i] = s));
    }
  }
  for (i = r.length, a = r[i - 1]; i-- > 0; ) ((r[i] = a), (a = t[a]));
  return r;
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
function createElementBlock(e, t, r, s, n, i) {
  return setupBlock(createBaseVNode(e, t, r, s, n, i, !0));
}
function createBlock(e, t, r, s, n) {
  return setupBlock(createVNode(e, t, r, s, n, !0));
}
function isVNode(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function isSameVNodeType(e, t) {
  return e.type === t.type && e.key === t.key;
}
const normalizeKey = ({ key: e }) => e ?? null,
  normalizeRef = ({ ref: e, ref_key: t, ref_for: r }) => (
    typeof e == 'number' && (e = '' + e),
    e != null
      ? isString(e) || isRef(e) || isFunction(e)
        ? { i: currentRenderingInstance, r: e, k: t, f: !!r }
        : e
      : null
  );
function createBaseVNode(
  e,
  t = null,
  r = null,
  s = 0,
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
    children: r,
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
    patchFlag: s,
    dynamicProps: n,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance,
  };
  return (
    o
      ? (normalizeChildren(l, r), i & 128 && e.normalize(l))
      : r && (l.shapeFlag |= isString(r) ? 8 : 16),
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
function _createVNode(e, t = null, r = null, s = 0, n = null, i = !1) {
  if (((!e || e === NULL_DYNAMIC_COMPONENT) && (e = Comment), isVNode(e))) {
    const o = cloneVNode(e, t, !0);
    return (
      r && normalizeChildren(o, r),
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
  return createBaseVNode(e, t, r, s, n, a, i, !0);
}
function guardReactiveProps(e) {
  return e ? (isProxy(e) || isInternalObject(e) ? extend({}, e) : e) : null;
}
function cloneVNode(e, t, r = !1, s = !1) {
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
          ? r && i
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
  return (l && s && setTransitionHooks(c, l.clone(c)), c);
}
function createTextVNode(e = ' ', t = 0) {
  return createVNode(Text, null, e, t);
}
function createStaticVNode(e, t) {
  const r = createVNode(Static, null, e);
  return ((r.staticCount = t), r);
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
  let r = 0;
  const { shapeFlag: s } = e;
  if (t == null) t = null;
  else if (isArray(t)) r = 16;
  else if (typeof t == 'object')
    if (s & 65) {
      const n = t.default;
      n &&
        (n._c && (n._d = !1), normalizeChildren(e, n()), n._c && (n._d = !0));
      return;
    } else {
      r = 32;
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
    if (s & 65) {
      normalizeChildren(e, { default: t });
      return;
    }
    ((t = { default: t, _ctx: currentRenderingInstance }), (r = 32));
  } else
    ((t = String(t)),
      s & 64 ? ((r = 16), (t = [createTextVNode(t)])) : (r = 8));
  ((e.children = t), (e.shapeFlag |= r));
}
function mergeProps(...e) {
  const t = {};
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    for (const n in s)
      if (n === 'class')
        t.class !== s.class && (t.class = normalizeClass([t.class, s.class]));
      else if (n === 'style') t.style = normalizeStyle([t.style, s.style]);
      else if (isOn(n)) {
        const i = t[n],
          a = s[n];
        a && i !== a && !(isArray(i) && i.includes(a))
          ? (t[n] = i ? [].concat(i, a) : a)
          : a == null && i == null && !isModelListener(n) && (t[n] = a);
      } else n !== '' && (t[n] = s[n]);
  }
  return t;
}
function invokeVNodeHook(e, t, r, s = null) {
  callWithAsyncErrorHandling(e, t, 7, [r, s]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function getNextUid() {
  return uid;
}
function createComponentInstance(e, t, r) {
  const s = e.type,
    n = (t ? t.appContext : e.appContext) || emptyAppContext,
    i = {
      uid: uid++,
      vnode: e,
      type: s,
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
      propsOptions: normalizePropsOptions(s, n),
      emitsOptions: normalizeEmitsOptions(s, n),
      emit: null,
      emitted: null,
      propsDefaults: EMPTY_OBJ,
      inheritAttrs: s.inheritAttrs,
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      suspense: r,
      suspenseId: r ? r.pendingId : 0,
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
    t = (r, s) => {
      let n;
      return (
        (n = e[r]) || (n = e[r] = []),
        n.push(s),
        (i) => {
          n.length > 1 ? n.forEach((a) => a(i)) : n[0](i);
        }
      );
    };
  ((internalSetCurrentInstance = t(
    '__VUE_INSTANCE_SETTERS__',
    (r) => (currentInstance = r),
  )),
    (setInSSRSetupState = t(
      '__VUE_SSR_SETTERS__',
      (r) => (isInSSRComponentSetup = r),
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
function setupComponent(e, t = !1, r = !1) {
  t && setInSSRSetupState(t);
  const { props: s, children: n } = e.vnode,
    i = isStatefulComponent(e);
  (initProps(e, s, i, t), initSlots(e, n, r || t));
  const a = i ? setupStatefulComponent(e, t) : void 0;
  return (t && setInSSRSetupState(!1), a);
}
function setupStatefulComponent(e, t) {
  const r = e.type;
  ((e.accessCache = Object.create(null)),
    (e.proxy = new Proxy(e.ctx, PublicInstanceProxyHandlers)));
  const { setup: s } = r;
  if (s) {
    pauseTracking();
    const n = (e.setupContext = s.length > 1 ? createSetupContext(e) : null),
      i = setCurrentInstance(e),
      a = callWithErrorHandling(s, e, 0, [e.props, n]),
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
function handleSetupResult(e, t, r) {
  (isFunction(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : isObject(t) && (e.setupState = proxyRefs(t)),
    finishComponentSetup(e));
}
function finishComponentSetup(e, t, r) {
  const s = e.type;
  e.render || (e.render = s.render || NOOP);
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
  const t = (r) => {
    e.exposed = r || {};
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
          get(t, r) {
            if (r in t) return t[r];
            if (r in publicPropertiesMap) return publicPropertiesMap[r](e);
          },
          has(t, r) {
            return r in t || r in publicPropertiesMap;
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
function formatComponentName(e, t, r = !1) {
  let s = getComponentName(t);
  if (!s && t.__file) {
    const n = t.__file.match(/([^/\\]+)\.\w+$/);
    n && (s = n[1]);
  }
  if (!s && e) {
    const n = (i) => {
      for (const a in i) if (i[a] === t) return a;
    };
    s =
      n(e.components) ||
      (e.parent && n(e.parent.type.components)) ||
      n(e.appContext.components);
  }
  return s ? classify(s) : r ? 'App' : 'Anonymous';
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
    insert: (e, t, r) => {
      t.insertBefore(e, r || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, r, s) => {
      const n =
        t === 'svg'
          ? doc.createElementNS(svgNS, e)
          : t === 'mathml'
            ? doc.createElementNS(mathmlNS, e)
            : r
              ? doc.createElement(e, { is: r })
              : doc.createElement(e);
      return (
        e === 'select' &&
          s &&
          s.multiple != null &&
          n.setAttribute('multiple', s.multiple),
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
    insertStaticContent(e, t, r, s, n, i) {
      const a = r ? r.previousSibling : t.lastChild;
      if (n && (n === i || n.nextSibling))
        for (
          ;
          t.insertBefore(n.cloneNode(!0), r),
            !(n === i || !(n = n.nextSibling));

        );
      else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          s === 'svg'
            ? `<svg>${e}</svg>`
            : s === 'mathml'
              ? `<math>${e}</math>`
              : e,
        );
        const o = templateContainer.content;
        if (s === 'svg' || s === 'mathml') {
          const l = o.firstChild;
          for (; l.firstChild; ) o.appendChild(l.firstChild);
          o.removeChild(l);
        }
        t.insertBefore(o, r);
      }
      return [
        a ? a.nextSibling : t.firstChild,
        r ? r.previousSibling : t.lastChild,
      ];
    },
  },
  vtcKey = Symbol('_vtc');
function patchClass(e, t, r) {
  const s = e[vtcKey];
  (s && (t = (t ? [t, ...s] : [...s]).join(' ')),
    t == null
      ? e.removeAttribute('class')
      : r
        ? e.setAttribute('class', t)
        : (e.className = t));
}
const vShowOriginalDisplay = Symbol('_vod'),
  vShowHidden = Symbol('_vsh'),
  vShow = {
    name: 'show',
    beforeMount(e, { value: t }, { transition: r }) {
      ((e[vShowOriginalDisplay] =
        e.style.display === 'none' ? '' : e.style.display),
        r && t ? r.beforeEnter(e) : setDisplay(e, t));
    },
    mounted(e, { value: t }, { transition: r }) {
      r && t && r.enter(e);
    },
    updated(e, { value: t, oldValue: r }, { transition: s }) {
      !t != !r &&
        (s
          ? t
            ? (s.beforeEnter(e), setDisplay(e, !0), s.enter(e))
            : s.leave(e, () => {
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
function patchStyle(e, t, r) {
  const s = e.style,
    n = isString(r);
  let i = !1;
  if (r && !n) {
    if (t)
      if (isString(t))
        for (const a of t.split(';')) {
          const o = a.slice(0, a.indexOf(':')).trim();
          r[o] == null && setStyle(s, o, '');
        }
      else for (const a in t) r[a] == null && setStyle(s, a, '');
    for (const a in r) {
      a === 'display' && (i = !0);
      const o = r[a];
      o != null
        ? shouldPreserveTextareaResizeStyle(
            e,
            a,
            !isString(t) && t ? t[a] : void 0,
            o,
          ) || setStyle(s, a, o)
        : setStyle(s, a, '');
    }
  } else if (n) {
    if (t !== r) {
      const a = s[CSS_VAR_TEXT];
      (a && (r += ';' + a), (s.cssText = r), (i = displayRE.test(r)));
    }
  } else t && e.removeAttribute('style');
  vShowOriginalDisplay in e &&
    ((!n || t !== r) && (e[vShowOriginalDisplay] = i ? s.display : ''),
    e[vShowHidden] && (s.display = 'none'));
}
const importantRE = /\s*!important$/;
function setStyle(e, t, r) {
  if (isArray(r)) r.forEach((s) => setStyle(e, t, s));
  else if ((r == null && (r = ''), t.startsWith('--')))
    importantRE.test(r)
      ? e.setProperty(t, r.replace(importantRE, ''), 'important')
      : e.setProperty(t, r);
  else {
    const s = autoPrefix(e, t);
    importantRE.test(r)
      ? e.setProperty(hyphenate(s), r.replace(importantRE, ''), 'important')
      : (e[s] = r);
  }
}
const prefixes = ['Webkit', 'Moz', 'ms'],
  prefixCache = {};
function autoPrefix(e, t) {
  const r = prefixCache[t];
  if (r) return r;
  let s = camelize(t);
  if (s !== 'filter' && s in e) return (prefixCache[t] = s);
  s = capitalize(s);
  for (let n = 0; n < prefixes.length; n++) {
    const i = prefixes[n] + s;
    if (i in e) return (prefixCache[t] = i);
  }
  return t;
}
function shouldPreserveTextareaResizeStyle(e, t, r, s) {
  return (
    e.tagName === 'TEXTAREA' &&
    (t === 'width' || t === 'height') &&
    isString(s) &&
    r === s
  );
}
const xlinkNS = 'http://www.w3.org/1999/xlink';
function patchAttr(e, t, r, s, n, i = isSpecialBooleanAttr(t)) {
  s && t.startsWith('xlink:')
    ? r == null
      ? e.removeAttributeNS(xlinkNS, t.slice(6, t.length))
      : e.setAttributeNS(xlinkNS, t, r)
    : r == null || (i && !includeBooleanAttr(r))
      ? e.removeAttribute(t)
      : e.setAttribute(t, i ? '' : isSymbol(r) ? String(r) : r);
}
function patchDOMProp(e, t, r, s, n) {
  if (t === 'innerHTML' || t === 'textContent') {
    r != null && (e[t] = t === 'innerHTML' ? unsafeToTrustedHTML(r) : r);
    return;
  }
  const i = e.tagName;
  if (t === 'value' && i !== 'PROGRESS' && !i.includes('-')) {
    const o = i === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      l = r == null ? (e.type === 'checkbox' ? 'on' : '') : String(r);
    ((o !== l || !('_value' in e)) && (e.value = l),
      r == null && e.removeAttribute(t),
      (e._value = r));
    return;
  }
  let a = !1;
  if (r === '' || r == null) {
    const o = typeof e[t];
    o === 'boolean'
      ? (r = includeBooleanAttr(r))
      : r == null && o === 'string'
        ? ((r = ''), (a = !0))
        : o === 'number' && ((r = 0), (a = !0));
  }
  try {
    e[t] = r;
  } catch {}
  a && e.removeAttribute(n || t);
}
function addEventListener(e, t, r, s) {
  e.addEventListener(t, r, s);
}
function removeEventListener(e, t, r, s) {
  e.removeEventListener(t, r, s);
}
const veiKey = Symbol('_vei');
function patchEvent(e, t, r, s, n = null) {
  const i = e[veiKey] || (e[veiKey] = {}),
    a = i[t];
  if (s && a) a.value = s;
  else {
    const [o, l] = parseName(t);
    if (s) {
      const d = (i[t] = createInvoker(s, n));
      addEventListener(e, o, d, l);
    } else a && (removeEventListener(e, o, a, l), (i[t] = void 0));
  }
}
const optionsModifierRE = /(Once|Passive|Capture)$/,
  optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(e) {
  let t, r;
  for (; (r = e.match(optionsModifierRE)) && !optionsModifierEventRE.test(e); )
    (t || (t = {}),
      (e = e.slice(0, e.length - r[1].length)),
      (t[r[1].toLowerCase()] = !0));
  return [e[2] === ':' ? e.slice(3) : hyphenate(e.slice(2)), t];
}
let cachedNow = 0;
const p = Promise.resolve(),
  getNow = () =>
    cachedNow || (p.then(() => (cachedNow = 0)), (cachedNow = Date.now()));
function createInvoker(e, t) {
  const r = (s) => {
    if (!s._vts) s._vts = Date.now();
    else if (s._vts <= r.attached) return;
    const n = r.value;
    if (isArray(n)) {
      const i = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        (i.call(s), (s._stopped = !0));
      };
      const a = n.slice(),
        o = [s];
      for (let l = 0; l < a.length && !s._stopped; l++) {
        const d = a[l];
        d && callWithAsyncErrorHandling(d, t, 5, o);
      }
    } else callWithAsyncErrorHandling(n, t, 5, [s]);
  };
  return ((r.value = e), (r.attached = getNow()), r);
}
const isNativeOn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  patchProp = (e, t, r, s, n, i) => {
    const a = n === 'svg';
    t === 'class'
      ? patchClass(e, s, a)
      : t === 'style'
        ? patchStyle(e, r, s)
        : isOn(t)
          ? isModelListener(t) || patchEvent(e, t, r, s, i)
          : (
                t[0] === '.'
                  ? ((t = t.slice(1)), !0)
                  : t[0] === '^'
                    ? ((t = t.slice(1)), !1)
                    : shouldSetAsProp(e, t, s, a)
              )
            ? (patchDOMProp(e, t, s),
              !e.tagName.includes('-') &&
                (t === 'value' || t === 'checked' || t === 'selected') &&
                patchAttr(e, t, s, a, i, t !== 'value'))
            : e._isVueCE &&
                (shouldSetAsPropForVueCE(e, t) ||
                  (e._def.__asyncLoader && (/[A-Z]/.test(t) || !isString(s))))
              ? patchDOMProp(e, camelize(t), s, i, t)
              : (t === 'true-value'
                  ? (e._trueValue = s)
                  : t === 'false-value' && (e._falseValue = s),
                patchAttr(e, t, s, a));
  };
function shouldSetAsProp(e, t, r, s) {
  if (s)
    return !!(
      t === 'innerHTML' ||
      t === 'textContent' ||
      (t in e && isNativeOn(t) && isFunction(r))
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
  return isNativeOn(t) && isString(r) ? !1 : t in e;
}
function shouldSetAsPropForVueCE(e, t) {
  const r = e._def.props;
  if (!r) return !1;
  const s = camelize(t);
  return Array.isArray(r)
    ? r.some((n) => camelize(n) === s)
    : Object.keys(r).some((n) => camelize(n) === s);
}
const getModelAssigner = (e) => {
  const t = e.props['onUpdate:modelValue'] || !1;
  return isArray(t) ? (r) => invokeArrayFns(t, r) : t;
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
function castValue(e, t, r) {
  return (t && (e = e.trim()), r && (e = looseToNumber(e)), e);
}
const vModelText = {
    created(e, { modifiers: { lazy: t, trim: r, number: s } }, n) {
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
      const i = s || (n.props && n.props.type === 'number');
      (addEventListener(e, t ? 'change' : 'input', (a) => {
        a.target.composing || e[assignKey](castValue(e.value, r, i));
      }),
        (r || i) &&
          addEventListener(e, 'change', () => {
            e.value = castValue(e.value, r, i);
          }),
        t ||
          (addEventListener(e, 'compositionstart', onCompositionStart),
          addEventListener(e, 'compositionend', onCompositionEnd),
          addEventListener(e, 'change', onCompositionEnd)));
    },
    mounted(e, { value: t, modifiers: { trim: r, number: s } }) {
      const n = t ?? '',
        i = e[initialValueKey];
      (delete e[initialValueKey],
        i !== void 0 &&
        (e.type === 'text' || e.type === 'textarea') &&
        e.value !== i
          ? e[assignKey](castValue(e.value, r, s))
          : (e.value = n));
    },
    beforeUpdate(
      e,
      { value: t, oldValue: r, modifiers: { lazy: s, trim: n, number: i } },
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
        ((s && t === r) || (n && e.value.trim() === l))) ||
        (e.value = l);
    },
  },
  vModelCheckbox = {
    deep: !0,
    created(e, t, r) {
      ((e[assignKey] = getModelAssigner(r)),
        addEventListener(e, 'change', () => {
          const s = e._modelValue,
            n = getValue(e),
            i = e.checked,
            a = e[assignKey];
          if (isArray(s)) {
            const o = looseIndexOf(s, n),
              l = o !== -1;
            if (i && !l) a(s.concat(n));
            else if (!i && l) {
              const d = [...s];
              (d.splice(o, 1), a(d));
            }
          } else if (isSet(s)) {
            const o = new Set(s);
            (i ? o.add(n) : o.delete(n), a(o));
          } else a(getCheckboxValue(e, i));
        }));
    },
    mounted: setChecked,
    beforeUpdate(e, t, r) {
      ((e[assignKey] = getModelAssigner(r)), setChecked(e, t, r));
    },
  };
function setChecked(e, { value: t, oldValue: r }, s) {
  e._modelValue = t;
  let n;
  if (isArray(t)) n = looseIndexOf(t, s.props.value) > -1;
  else if (isSet(t)) n = t.has(s.props.value);
  else {
    if (t === r) return;
    n = looseEqual(t, getCheckboxValue(e, !0));
  }
  e.checked !== n && (e.checked = n);
}
const vModelRadio = {
    created(e, { value: t }, r) {
      ((e.checked = looseEqual(t, r.props.value)),
        (e[assignKey] = getModelAssigner(r)),
        addEventListener(e, 'change', () => {
          e[assignKey](getValue(e));
        }));
    },
    beforeUpdate(e, { value: t, oldValue: r }, s) {
      ((e[assignKey] = getModelAssigner(s)),
        t !== r && (e.checked = looseEqual(t, s.props.value)));
    },
  },
  vModelSelect = {
    deep: !0,
    created(e, { value: t, modifiers: { number: r } }, s) {
      ((e._modelValue = t),
        addEventListener(e, 'change', () => {
          const n = Array.prototype.filter
              .call(e.options, (l) => l.selected)
              .map((l) => (r ? looseToNumber(getValue(l)) : getValue(l))),
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
        (e[assignKey] = getModelAssigner(s)));
    },
    mounted(e, { value: t }) {
      setSelected(e, t);
    },
    beforeUpdate(e, { value: t }, r) {
      ((e._modelValue = t), (e[assignKey] = getModelAssigner(r)));
    },
    updated(e, { value: t }) {
      const r = e._pendingValue;
      ((e._pendingValue = void 0),
        (!r || r[0] !== e.multiple || !isSameSelectValue(t, r[1], r[0])) &&
          setSelected(e, t));
    },
  };
function isSameSelectValue(e, t, r) {
  if (!r || isArray(e)) return looseEqual(e, t);
  if (isSet(e)) {
    if (e.size !== t.length) return !1;
    for (const s of t) if (!e.has(s)) return !1;
    return !0;
  }
  return !1;
}
function setSelected(e, t) {
  const r = e.multiple,
    s = isArray(t);
  if (!(r && !s && !isSet(t))) {
    for (let n = 0, i = e.options.length; n < i; n++) {
      const a = e.options[n],
        o = getValue(a);
      if (r)
        if (s) {
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
    !r && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function getValue(e) {
  return '_value' in e ? e._value : e.value;
}
function getCheckboxValue(e, t) {
  const r = t ? '_trueValue' : '_falseValue';
  return r in e ? e[r] : t;
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
      systemModifiers.some((r) => e[`${r}Key`] && !t.includes(r)),
  },
  withModifiers = (e, t) => {
    if (!e) return e;
    const r = e._withMods || (e._withMods = {}),
      s = t.join('.');
    return (
      r[s] ||
      (r[s] = (n, ...i) => {
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
    const r = e._withKeys || (e._withKeys = {}),
      s = t.join('.');
    return (
      r[s] ||
      (r[s] = (n) => {
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
    { mount: r } = t;
  return (
    (t.mount = (s) => {
      const n = normalizeContainer(s);
      if (!n) return;
      const i = t._component;
      (!isFunction(i) && !i.render && !i.template && (i.template = n.innerHTML),
        n.nodeType === 1 && (n.textContent = ''));
      const a = r(n, !1, resolveRootNamespace(n));
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
          var r = {
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
            s = '';
          if (e == 1) s = 'اول';
          else if (r[e]) s = r[e] + (e == 30 ? 'ام' : 'م');
          else {
            var n = e % 100;
            ((r[n] || (n = e % 10)) && (s = r[n] + 'م'),
              (n = (e - n) % 100) &&
                (s = r[n] + (s ? ' و ' + s : n == 30 ? 'ام ' : 'م')),
              (n = 100 * Math.floor(e / 100)) &&
                (s = r[n] + (s ? ' و ' + s : 'م')));
          }
          return (t == 2 && (s += 'ین'), s);
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
    isValid = function (e, t, r, s, n, i, a, o) {
      return isValidDate(e, t, r, s) && isValidTime(n, i, a, o);
    },
    jalali$3 = function (e, t, r) {
      return (
        !(t >= 7 && t <= 11 && r == 31) &&
        (t != 12 || r != 31) &&
        !(t == 12 && r == 30 && !isLeapYear('j', e))
      );
    },
    gregorian$3 = function (e, t, r) {
      return (
        (![2, 4, 6, 9, 11].includes(t) || r != 31) &&
        !(t == 2 && (r == 30 || (r == 29 && !isLeapYear('g', e))))
      );
    },
    isValidDate = function (e, t, r, s) {
      return [t, r, s].some(function (n) {
        return String(n).search(/null|NaN/) != -1;
      }) ||
        t < 0 ||
        r > 12 ||
        r < 1 ||
        s > 31 ||
        s < 1
        ? !1
        : e[0] === 'j'
          ? jalali$3(t, r, s)
          : gregorian$3(t, r, s);
    },
    isValidTime = function (e, t, r, s) {
      return (
        ![e, t, r, s].some(function (n) {
          return String(n).search(/null|NaN/) != -1;
        }) &&
        !(e < 0 || e > 23) &&
        !(t < 0 || t > 59) &&
        !(r < 0 || r > 59) &&
        !(s < 0 || s > 999)
      );
    };
  function isSame() {
    var e = typesToArray.apply(
      void 0,
      [this.c].concat(Array.prototype.slice.call(arguments)),
    );
    return (
      (e = this.toArray().map(function (t, r) {
        return REGEX.isNumeric.test(e[r]) ? e[r] : t;
      })),
      compare.call(this, e, '==')
    );
  }
  function _setPrototypeOf(e, t) {
    return (_setPrototypeOf =
      Object.setPrototypeOf ||
      function (r, s) {
        return ((r.__proto__ = s), r);
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
  function _construct(e, t, r) {
    return (_construct = _isNativeReflectConstruct()
      ? Reflect.construct
      : function (s, n, i) {
          var a = [null];
          a.push.apply(a, n);
          var o = new (Function.bind.apply(s, a))();
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
    var r =
      e && ((typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator']);
    if (r != null) {
      var s,
        n,
        i = [],
        a = !0,
        o = !1;
      try {
        for (
          r = r.call(e);
          !(a = (s = r.next()).done) && (i.push(s.value), !t || i.length !== t);
          a = !0
        );
      } catch (l) {
        ((o = !0), (n = l));
      } finally {
        try {
          a || r.return == null || r.return();
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
      var r = Object.prototype.toString.call(e).slice(8, -1);
      return (
        r === 'Object' && e.constructor && (r = e.constructor.name),
        r === 'Map' || r === 'Set'
          ? Array.from(e)
          : r === 'Arguments' ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
            ? _arrayLikeToArray(e, t)
            : void 0
      );
    }
  }
  function _arrayLikeToArray(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var r = 0, s = new Array(t); r < t; r++) s[r] = e[r];
    return s;
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
    var r = (typeof Symbol < 'u' && e[Symbol.iterator]) || e['@@iterator'];
    if (!r) {
      if (Array.isArray(e) || (r = _unsupportedIterableToArray(e)) || t) {
        r && (e = r);
        var s = 0,
          n = function () {};
        return {
          s: n,
          n: function () {
            return s >= e.length ? { done: !0 } : { done: !1, value: e[s++] };
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
        r = r.call(e);
      },
      n: function () {
        var l = r.next();
        return ((a = l.done), l);
      },
      e: function (l) {
        ((o = !0), (i = l));
      },
      f: function () {
        try {
          a || r.return == null || r.return();
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
  function isBetween(e, t, r) {
    return (
      (e = typesToArray(this.c, e)),
      (e = matchingDate(e, this.clone())),
      (t = typesToArray(this.c, t)),
      (t = matchingDate(t, this.clone())),
      !(
        !this.isValid.apply(this, _toConsumableArray(e)) ||
        !this.isValid.apply(this, _toConsumableArray(t))
      ) &&
        compare.call(this, e, r[0] === '[' ? '>=' : '>') &&
        compare.call(this, t, r[1] === ']' ? '<=' : '<')
    );
  }
  function isInArray(e) {
    var t = this;
    return e.some(function (r) {
      return isSame.call(t, r);
    });
  }
  var gtj = function (e, t, r, s, n, i, a) {
      var o, l;
      ((r = (o = e
        ? isDate(e)
          ? e
          : new Date(
              REGEX.isNumeric.test(e) ? e : 0,
              REGEX.isNumeric.test(t) ? t : 0,
              REGEX.isNumeric.test(r) ? r : 1,
              REGEX.isNumeric.test(s) ? s : 0,
              REGEX.isNumeric.test(n) ? n : 0,
              REGEX.isNumeric.test(i) ? i : 0,
              REGEX.isNumeric.test(a) ? a : 0,
            )
        : new Date()).getDate()),
        (t = o.getMonth() + 1),
        (e = o.getFullYear()),
        (s = o.getHours()),
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
          r +
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
          s,
          n,
          i,
          a,
        ]
      );
    },
    jtg = function (e, t, r, s, n, i, a) {
      var o, l, d;
      ((e = REGEX.isNumeric.test(e) ? +e : 1),
        (t = REGEX.isNumeric.test(t) ? +t : 1),
        (r = REGEX.isNumeric.test(r) ? +r : 1),
        (s = REGEX.isNumeric.test(s) ? +s : 0),
        (n = REGEX.isNumeric.test(n) ? +n : 0),
        (i = REGEX.isNumeric.test(i) ? +i : 0),
        (a = REGEX.isNumeric.test(a) ? +a : 0),
        e > 979 ? ((o = 1600), (e -= 979)) : (o = 621));
      var c =
        365 * e +
        8 * parseInt(e / 33) +
        parseInt(((e % 33) + 3) / 4) +
        78 +
        r +
        (t < 7 ? 31 * (t - 1) : 30 * (t - 7) + 186);
      ((o += 400 * parseInt(c / 146097)),
        (c %= 146097) > 36524 &&
          ((o += 100 * parseInt(--c / 36524)), (c %= 36524) >= 365 && c++),
        (o += 4 * parseInt(c / 1461)),
        (c %= 1461) > 365 &&
          ((o += parseInt((c - 1) / 365)), (c = (c - 1) % 365)),
        (d = c + 1));
      var h = [
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
        var w = h[l];
        if (d <= w) break;
        d -= w;
      }
      return new Date(o, l - 1, d, s, n, i, a);
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
    typesToArray = function (e, t, r, s, n, i, a, o) {
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
                  : [t, r, s, n, i, a, o]
      );
    },
    ordinalNumber = function (e) {
      var t =
          arguments.length > 1 && arguments[1] !== void 0
            ? arguments[1]
            : 'jalali',
        r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
      return CALENDAR[t].ordinalNumbers(e, r);
    },
    addPrefix = function (e, t) {
      var r =
        arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '0';
      return r.repeat(t - String(e).length) + e;
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
        r =
          arguments.length > 2 && arguments[2] !== void 0
            ? arguments[2]
            : 'standard';
      return isDate(e)
        ? CALENDAR[t].days.weekNumber[e.getDay()] + (r != 'standard' ? 0 : 1)
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
    var r = this.c == 'gregorian' ? this.d.year : this.toDate().getFullYear();
    return e == 'y' || e == 'YYYY' ? r : e == 'YY' ? String(r).slice(-2) : t;
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
    var r = Math.ceil(
      (this.c == 'gregorian' ? this.d.month : this.toDate().getMonth() + 1) / 3,
    );
    return e == 'Q'
      ? r
      : e == 'Qo' || e == 'QO'
        ? ordinalNumber(r, 'gregorian')
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
    var r = this.c == 'gregorian' ? this.d.month : this.toDate().getMonth() + 1;
    return e == 'M'
      ? r
      : e == 'MM'
        ? addPrefix(r, 2)
        : e == 'MMMM'
          ? CALENDAR.gregorian.months[r]
          : e == 'Mo' || e == 'MO'
            ? ordinalNumber(r, 'gregorian')
            : e == 'MMM'
              ? CALENDAR.gregorian.months[r].slice(0, 3)
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
        var r = getWeekOfYear.call(
          this,
          this.d.year,
          this.d.month,
          this.d.date,
          this.c,
        );
        this.addWeek(+e - r);
      }
      for (; !this.isValidDate(); ) this.subDay(1, !1);
      return this;
    }
    e || (e = getDefaultFormat$1(this.c));
    var s = getWeekOfYear.call(
      this,
      this.year('jy'),
      this.month('jM'),
      this.date('jD'),
      this.c,
    );
    if (e == 'jw' || e == 'jW') return s;
    if (e == 'jww' || e == 'jWW') return addPrefix(s, 2);
    if (e == 'jwo' || e == 'jWo') return ordinalNumber(s);
    if (e == 'jwO' || e == 'jWO') return ordinalNumber(s, 'jalali', 2);
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
          : s;
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
    var r = this.c == 'jalali' ? this.d.date : gtj(this.toDate())[2];
    if (e == 'jDD') return addPrefix(r, 2);
    if (e == 'jD') return r;
    if (e == 'jDo') return ordinalNumber(r);
    if (e == 'jDO') return ordinalNumber(r, 'jalali', 2);
    var s = this.toDate();
    if (e == 'jdddd' || e == 'jddd') return getDayLabel(s);
    if (e == 'jdd') return getDayLabel(s).slice(0, 1);
    var n = getDayOfWeek(s);
    if (e == 'jdo') return ordinalNumber(n);
    if (e == 'jdO') return ordinalNumber(n, 'jalali', 2);
    if (e == 'jd') return getDayOfWeek(s, 'jalali', 'array');
    if (e == 'jde') return n;
    var i = getDayOfYear(this.year('jy'), this.month('jM'), r, 'j');
    return e == 'jDDDD'
      ? addPrefix(i, 3)
      : e == 'jDDD'
        ? i
        : e == 'jDDDo'
          ? ordinalNumber(i)
          : e == 'jDDDO'
            ? ordinalNumber(i, 'jalali', 2)
            : e == 'DD'
              ? addPrefix(s.getDate(), 2)
              : e == 'D'
                ? s.getDate()
                : e == 'Do' || e == 'DO'
                  ? ordinalNumber(s.getDate(), 'gregorian')
                  : e == 'dddd'
                    ? getDayLabel(s, 'gregorian')
                    : e == 'ddd'
                      ? getDayLabel(s, 'gregorian').slice(0, 3)
                      : e == 'dd'
                        ? getDayLabel(s, 'gregorian').slice(0, 2)
                        : ((n = getDayOfWeek(s, 'gregorian')),
                          e == 'do' || e == 'dO'
                            ? ordinalNumber(n, 'gregorian')
                            : e == 'd'
                              ? n - 1
                              : e == 'de'
                                ? n
                                : ((i = getDayOfYear(
                                    s.getFullYear(),
                                    s.getMonth() + 1,
                                    s.getDate(),
                                    'g',
                                  )),
                                  e == 'DDDD'
                                    ? addPrefix(i, 3)
                                    : e == 'DDD'
                                      ? i
                                      : e == 'DDDo' || e == 'DDDO'
                                        ? ordinalNumber(i, 'gregorian')
                                        : r));
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
  var jalali$2 = function (e, t, r) {
      return r >= 1 && r <= 6
        ? 31
        : (r > 6 && r <= 11) || isLeapYear(e, t)
          ? 30
          : 29;
    },
    gregorian$2 = function (e, t, r) {
      return [1, 3, 5, 7, 8, 10, 12].includes(r)
        ? 31
        : r != 2
          ? 30
          : isLeapYear(e, t)
            ? 29
            : 28;
    },
    getDaysInMonth = function (e, t, r) {
      return e[0] === 'j' ? jalali$2(e, t, r) : gregorian$2(e, t, r);
    },
    getDayOfYearFormat = function (e) {
      return e[0] === 'j' ? 'jd' : 'd';
    };
  function getWeeksInYear(e) {
    var t = getDayOfYearFormat(this.c),
      r = this.clone().parse(e),
      s = r.date(t),
      n = r.clone().endOf('year').startOf('day'),
      i = n.date(t);
    return (
      s > 3 ? r.addDay(7 - s) : r.subDay(s),
      i > 3 ? n.addDay(7 - i) : n.subDay(i),
      Math.ceil(n.diff(r, 'date') / 7)
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
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    if (!t.length) return this.toArray().slice(3);
    var s = [];
    return (
      (s = isPersianDate(t[0])
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
      this.isValidTime.apply(this, _toConsumableArray(s))
        ? this.hour(s[0] || 0)
            .minute(s[1] || 0)
            .second(s[2] || 0)
            .millisecond(s[3] || 0)
        : 'زمان نامعتبر'
    );
  }
  var getDayOfYear = function (e, t, r, s) {
      for (t = +t, r = +r; --t != 0; ) r += getDaysInMonth(s, e, t);
      return r;
    },
    dayOfYearFormat = function (e) {
      return e[0] === 'j' ? 'jd' : 'd';
    },
    getWeekOfYear = function (e, t, r, s) {
      var n = this.clone().calendar(s).parse(e),
        i = n.date(dayOfYearFormat(s)),
        a = n.clone().parse(e, t, r);
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
      var r = this;
      if (!e.length) return !1;
      var s = _toConsumableArray(e),
        n = s.map(function (i) {
          var a;
          return (
            (i = typesToArray(r.c, i)),
            !!r.isValid.apply(r, _toConsumableArray(i)) &&
              (a = r.clone()).parse.apply(a, _toConsumableArray(i)).timestamp()
          );
        });
      return (
        !n.includes(!1) &&
        s[n.indexOf(Math[t].apply(Math, _toConsumableArray(n)))]
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
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
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
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
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
    var r = 12 - this.d.month + 1;
    if (r > e) this.d.month += e;
    else {
      for (this.addYear(1, !1), this.d.month = 1, e -= r; e >= 12; )
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
      for (var r = this.getDaysInMonth(); e >= r; )
        ((e -= r), this.addMonth(1, !1), (r = this.getDaysInMonth()));
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
    var r = this.d.month;
    if (r > e) this.d.month -= e;
    else {
      for (this.subYear(1, !1), this.d.month = 12, e -= r; e >= 12; )
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
      var r = this.getDaysInMonth();
      for (this.d.date = r, e -= t; e >= r; )
        ((e -= r), this.subMonth(1, !1), (r = this.getDaysInMonth()));
      this.d.date = r - e;
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
    var r,
      s = '',
      n = _createForOfIteratorHelper(e.match(REGEX.format));
    try {
      for (n.s(); !(r = n.n()).done; ) {
        var i = r.value;
        ((s += e.substring(0, e.indexOf(i))),
          i.search(/Y|y/) != -1
            ? (s += this.year(i))
            : i.search(/M/) != -1
              ? (s += this.month(i))
              : i.search(/Q/) != -1
                ? (s += this.quarter(i))
                : i.search(/D|d/) != -1
                  ? (s += this.date(i))
                  : i.search(/W|w/) != -1
                    ? (s += this.week(i))
                    : i.search(/H|h|k/) != -1
                      ? (s += this.hour(i))
                      : i.search(/m/) != -1
                        ? (s += this.minute(i))
                        : i.search(/s/) != -1
                          ? (s += this.second(i))
                          : i.search(/c|C/) != -1
                            ? (s += this.millisecond(i))
                            : i.search(/t/) != -1
                              ? (s += this.timestamp())
                              : i.search(/a|A/) != -1 &&
                                (s += TIMETYPE(this.d.hour, i)),
          (e = e.substr(e.indexOf(i) + i.length)));
      }
    } catch (o) {
      n.e(o);
    } finally {
      n.f();
    }
    s += e;
    for (var a = 0; a < t.length; a++) s = s.replace('###', t[a]);
    return String(s);
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
  function diff(e, t, r) {
    var s;
    if (
      ((e = typesToArray(this.c, e)),
      !this.isValid.apply(this, _toConsumableArray(e)))
    )
      return 'تاریخ نامعتبر';
    var n =
      this.timestamp() -
      (s = this.clone()).parse.apply(s, _toConsumableArray(e)).timestamp();
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
    return r ? n + (n >= 0 ? 1 : -1) : n;
  }
  function diffForHumans(e, t) {
    var r = this.diff(e, 's');
    if (typeof r == 'string') return 'تاریخ نامعتبر';
    var s = t && (r > 0 ? 'آینده' : 'پیش');
    return (r = Math.abs(r)) == 0
      ? 'هم اکنون'
      : (r =
          r < 45
            ? 'لحظات'
            : (r /= 60) < 45
              ? Math.round(r) + ' دقیقه'
              : (r /= 60) < 23.5
                ? Math.round(r) + ' ساعت'
                : (r /= 24) < 26
                  ? Math.round(r) + ' روز'
                  : r < 320
                    ? Math.round(r / 30) + ' ماه'
                    : Math.round(r / 365) + ' سال') + (t ? ' ' + s : '');
  }
  var PersianDate = function e(t, r) {
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
      (e.prototype.calendar = function (s) {
        return calendar.call(this, s);
      }),
      (e.prototype.year = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : year.call(this, s);
      }),
      (e.prototype.month = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : month.call(this, s);
      }),
      (e.prototype.date = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : date.call(this, s);
      }),
      (e.prototype.quarter = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : quarter.call(this, s);
      }),
      (e.prototype.week = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        return this.error ? this.error : week.call(this, s);
      }),
      (e.prototype.hour = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'H';
        return this.error ? this.error : hour.call(this, s);
      }),
      (e.prototype.minute = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'm';
        return this.error ? this.error : minute.call(this, s);
      }),
      (e.prototype.second = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 's';
        return this.error ? this.error : second.call(this, s);
      }),
      (e.prototype.millisecond = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'c';
        return this.error ? this.error : millisecond.call(this, s);
      }),
      (e.prototype.timestamp = function (s) {
        return this.error ? this.error : timestamp.call(this, s);
      }),
      (e.prototype.valueOf = function () {
        return this.timestamp();
      }),
      (e.prototype.getDaysInMonth = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0
              ? arguments[0]
              : this.d.year,
          n =
            arguments.length > 1 && arguments[1] !== void 0
              ? arguments[1]
              : this.d.month;
        return this.error ? this.error : getDaysInMonth(this.c, s, n);
      }),
      (e.prototype.getWeeksInYear = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : this.d.year;
        return this.error ? this.error : getWeeksInYear.call(this, s);
      }),
      (e.prototype.startOf = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : 'year';
        return startOf.call(this, s);
      }),
      (e.prototype.endOf = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : 'year';
        return endOf.call(this, s);
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
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addYear.call(this, s, n) : this;
      }),
      (e.prototype.addMonth = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addMonth.call(this, s, n) : this;
      }),
      (e.prototype.addDay = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addDay.call(this, s, n) : this;
      }),
      (e.prototype.addQuarter = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addQuarter.call(this, s, n) : this;
      }),
      (e.prototype.addWeek = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addWeek.call(this, s, n) : this;
      }),
      (e.prototype.addHour = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addHour.call(this, s, n) : this;
      }),
      (e.prototype.addMinute = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addMinute.call(this, s, n) : this;
      }),
      (e.prototype.addSecond = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? addSecond.call(this, s, n) : this;
      }),
      (e.prototype.addMillisecond = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error
          ? this.error
          : s
            ? addMillisecond.call(this, s, n)
            : this;
      }),
      (e.prototype.subYear = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subYear.call(this, s, n) : this;
      }),
      (e.prototype.subMonth = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subMonth.call(this, s, n) : this;
      }),
      (e.prototype.subDay = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subDay.call(this, s, n) : this;
      }),
      (e.prototype.subQuarter = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subQuarter.call(this, s, n) : this;
      }),
      (e.prototype.subWeek = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subWeek.call(this, s, n) : this;
      }),
      (e.prototype.subHour = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subHour.call(this, s, n) : this;
      }),
      (e.prototype.subMinute = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subMinute.call(this, s, n) : this;
      }),
      (e.prototype.subSecond = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : s ? subSecond.call(this, s, n) : this;
      }),
      (e.prototype.subMillisecond = function () {
        var s =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1,
          n =
            !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error
          ? this.error
          : s
            ? subMillisecond.call(this, s, n)
            : this;
      }),
      (e.prototype.toString = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : 'date';
        return this.error ? this.error : toString.call(this, s);
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
      (e.prototype.diff = function (s, n) {
        var i = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
        return this.error ? this.error : diff.call(this, s, n, i);
      }),
      (e.prototype.diffForHumans = function (s) {
        var n =
          !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
        return this.error ? this.error : diffForHumans.call(this, s, n);
      }),
      (e.prototype.min = function () {
        return mathOperation.call(this, arguments, 'min');
      }),
      (e.prototype.max = function () {
        return mathOperation.call(this, arguments, 'max');
      }),
      (e.prototype.isLeapYear = function () {
        var s =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : this.d.year;
        return !this.error && isLeapYear(this.c, s);
      }),
      (e.prototype.isValid = function (s, n, i, a, o, l, d) {
        return (
          !this.error &&
          this.isValidDate(s, n, i) &&
          this.isValidTime(a, o, l, d)
        );
      }),
      (e.prototype.isValidDate = function () {
        var s =
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
        return !this.error && isValidDate(this.c, s, n, i);
      }),
      (e.prototype.isValidTime = function () {
        var s =
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
        return !this.error && isValidTime(s, n, i, a);
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
      (e.prototype.isBetween = function (s, n) {
        var i =
          arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '()';
        return !this.error && isBetween.call(this, s, n, i);
      }),
      (e.prototype.isInArray = function (s) {
        return !this.error && isInArray.call(this, s);
      }),
      (e.prototype.isDate = isDate),
      (e.prototype.isPersianDate = isPersianDate),
      r && this.calendar(r),
      t
        ? r && r[0] == 'j'
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
      const r = new Set(['__proto__', 'prototype', 'constructor']),
        s = (a) => {
          if (Object.prototype.toString.call(a) !== '[object Object]')
            return !1;
          const o = Object.getPrototypeOf(a);
          return o === Object.prototype || o === null;
        },
        n = (a) => {
          if (Array.isArray(a)) return a.map(n);
          if (!s(a)) return a;
          const o = {};
          for (const l of Object.keys(a)) r.has(l) || (o[l] = n(a[l]));
          return o;
        },
        i = n(e);
      if (!t) return i;
      for (const a of Object.keys(t)) {
        if (r.has(a)) continue;
        const o = t[a];
        s(i[a]) && s(o) ? (i[a] = this.mergeObject(i[a], o)) : (i[a] = n(o));
      }
      return i;
    },
    setStyles: function (e, t) {
      for (const r in e) t.style.setProperty('--' + r, e[r]);
    },
    setColor: function (e, t) {
      if (!e) return;
      let r = {};
      switch (e) {
        case 'red':
          r = {
            'primary-color': '#c7004c',
            'secondary-color': '#ffaaaa',
            'in-range-background': '#ffd2d2',
          };
          break;
        case 'pink':
          r = {
            'primary-color': '#e56ab3',
            'secondary-color': '#ef87be',
            'in-range-background': '#fcbcd7',
          };
          break;
        case 'orange':
          r = {
            'primary-color': '#ffa500',
            'secondary-color': '#ffbe47',
            'in-range-background': '#ffe0a6',
          };
          break;
        case 'green':
          r = {
            'primary-color': '#38a169',
            'secondary-color': '#89dda3',
            'in-range-background': '#c6f6d5',
          };
          break;
        case 'purple':
          r = {
            'primary-color': '#7825d0',
            'secondary-color': '#c196ed',
            'in-range-background': '#d4baf3',
          };
          break;
        case 'gray':
          r = {
            'primary-color': '#494848',
            'secondary-color': '#909090',
            'in-range-background': '#b4b4b4',
          };
          break;
      }
      this.setStyles(r, t);
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
    getShortcuts(e, t, r) {
      const s = () => e.clone();
      switch (t) {
        case 'date-single':
          return {
            [r.now]: [s()],
            [r.yesterday]: [s().subDay()],
            [r.tomorrow]: [s().addDay()],
            [r.firstOfWeek]: [s().startOf('week')],
            [r.lastOfWeek]: [s().endOf('week')],
          };
        case 'date-range':
          return {
            [r.thisWeek]: [s().startOf('week'), s().endOf('week')],
            [r.prevWeek]: [
              s().subWeek().startOf('week'),
              s().subWeek().endOf('week'),
            ],
            [r.nextWeek]: [
              s().addWeek().startOf('week'),
              s().addWeek().endOf('week'),
            ],
            [r.thisMonth]: [s().startOf('month'), s().endOf('month')],
            [r.prevMonth]: [
              s().subMonth().startOf('month'),
              s().subMonth().endOf('month'),
            ],
            [r.nextMonth]: [
              s().addMonth().startOf('month'),
              s().addMonth().endOf('month'),
            ],
          };
        case 'time-single':
          return {
            [r.now]: [s()],
            [r.oneHourAgo]: [s().subHour()],
            [r.oneHourLater]: [s().addHour()],
            [r.midnight]: [s().startOf('date')],
            [r.midday]: [s().time(12)],
          };
        case 'time-range':
          return {
            [r.thisHour]: [s().startOf('hour'), s().endOf('hour')],
            [r.prevHour]: [
              s().subHour().startOf('hour'),
              s().subHour().endOf('hour'),
            ],
            [r.nextHour]: [
              s().addHour().startOf('hour'),
              s().addHour().endOf('hour'),
            ],
            [r.allDay]: [s().startOf('date'), s().endOf('date')],
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
  const r = e || '',
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
    ).findIndex((i) => r.toLowerCase() === i.toLowerCase());
  return n >= 0 ? n + 1 : parsePart(e);
}
function parseChineseMonth(e) {
  const t = (e || '').toLowerCase().replace(/\s+/g, ' ').trim(),
    r = [
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
    s = t.endsWith('bis'),
    n = s ? t.slice(0, -3).trim() : t,
    i = r.indexOf(n);
  return { month: i >= 0 ? i + 1 : parsePart(e), leapMonth: s };
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
  const r = [e.year, e.month, e.leapMonth ? 1 : 0, e.day],
    s = [t.year, t.month, t.leapMonth ? 1 : 0, t.day];
  for (let n = 0; n < r.length; n++)
    if (r[n] !== s[n]) return r[n] < s[n] ? -1 : 1;
  return 0;
}
function formatParts(e, t) {
  const r = Object.fromEntries(
      e.formatToParts(t).map(({ type: a, value: o }) => [a, o]),
    ),
    s = parsePart(r.year || r.relatedYear),
    n = e.resolvedOptions().calendar,
    i = n === 'chinese' ? parseChineseMonth(r.month) : void 0;
  return {
    year: s,
    month:
      n === 'hebrew'
        ? parseHebrewMonth(r.month, s)
        : i?.month || parsePart(r.month),
    day: parsePart(r.day),
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
function findGregorianDate(e, t, r) {
  const s = new Date(
      Date.UTC(
        estimateGregorianYear(t, r.year),
        Math.max(0, r.month - 1),
        Math.max(1, r.day),
      ),
    ),
    n = t === 'hijri' ? 900 : 450,
    i = s.getTime() - n * dayMilliseconds$1,
    a = s.getTime() + n * dayMilliseconds$1,
    o = formatParts(e, new Date(i)),
    l = formatParts(e, new Date(a));
  if (compareDateParts(o, r) > 0 || compareDateParts(l, r) < 0)
    throw new RangeError(
      `Unable to convert ${r.year}/${r.month}/${r.day} from ${t}`,
    );
  let d = i,
    c = a;
  for (; d <= c; ) {
    const h =
        d + Math.floor((c - d) / (2 * dayMilliseconds$1)) * dayMilliseconds$1,
      w = new Date(h),
      M = compareDateParts(formatParts(e, w), r);
    if (M === 0) return w;
    M < 0 ? (d = h + dayMilliseconds$1) : (c = h - dayMilliseconds$1);
  }
  throw new RangeError(
    `Unable to convert ${r.year}/${r.month}/${r.day} from ${t}`,
  );
}
function createIntlAdapter(e, t = 'ummalqura') {
  if (e === 'hijri' && t !== 'ummalqura')
    throw new Error(`Hijri provider is not implemented yet: ${t}`);
  const r = createFormatter(calendarNames[e]);
  return {
    id: e,
    ...(e === 'hijri' ? { provider: t } : {}),
    getParts(s) {
      return formatParts(r, s);
    },
    fromParts(s) {
      const n = findGregorianDate(r, e, s);
      return (
        n.setUTCHours(
          s.hour || 0,
          s.minute || 0,
          s.second || 0,
          s.millisecond || 0,
        ),
        n
      );
    },
    addDays(s, n) {
      return new Date(s.getTime() + n * dayMilliseconds$1);
    },
    addMonths(s, n) {
      const i = formatParts(r, s);
      let a = i.year,
        o = i.month;
      const l = (h) => (e === 'hebrew' && isHebrewLeapYear(h) ? 13 : 12),
        d = n < 0 ? -1 : 1;
      for (let h = 0; h < Math.abs(n); h++)
        ((o += d),
          o > l(a) ? ((o = 1), (a += 1)) : o < 1 && ((a -= 1), (o = l(a))));
      const c = Math.min(
        i.day,
        (() => {
          const h = findGregorianDate(r, e, { year: a, month: o, day: 1 });
          let w = 1;
          for (
            ;
            sameDate(
              formatParts(r, new Date(h.getTime() + w * dayMilliseconds$1)),
              { year: a, month: o, day: w + 1 },
            );

          )
            w += 1;
          return w;
        })(),
      );
      return findGregorianDate(r, e, { ...i, year: a, month: o, day: c });
    },
    daysInMonth(s, n) {
      const i = findGregorianDate(r, e, { year: s, month: n, day: 1 });
      let a = 1;
      for (
        ;
        sameDate(
          formatParts(r, new Date(i.getTime() + a * dayMilliseconds$1)),
          { year: s, month: n, day: a + 1 },
        );

      )
        a += 1;
      return a;
    },
  };
}
const dayMilliseconds = 864e5,
  islamicEpoch = 19484395e-1;
function islamicToJulianDay(e, t, r) {
  return (
    r +
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
    r = Math.floor((30 * (t - islamicEpoch) + 10646) / 10631),
    s = Math.min(
      12,
      Math.ceil((t - (29 + islamicToJulianDay(r, 1, 1))) / 29.5) + 1,
    ),
    n = Math.floor(t - islamicToJulianDay(r, s, 1) + 1);
  return {
    year: r,
    month: s,
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
      const r = gregorianToIslamic(e),
        s = r.year * 12 + r.month - 1 + t,
        n = Math.floor(s / 12),
        i = (((s % 12) + 12) % 12) + 1,
        a = i % 2 === 1 ? 30 : 29;
      return this.fromParts({
        ...r,
        year: n,
        month: i,
        day: Math.min(r.day, a),
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
        { direction: r, inverse: s } = toRefs(t),
        n = computed(
          () =>
            `rotate(${{ up: -90, down: 90, right: 0, left: 180 }[r.value] + (s.value ? 180 : 0)} 0 0)`,
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
        { icon: r } = toRefs(t);
      return (s, n) =>
        unref(r) === 'clear'
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
                s.$attrs,
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
          : unref(r) === 'date'
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
                  s.$attrs,
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
            : unref(r) === 'datetime'
              ? (openBlock(),
                createElementBlock(
                  'svg',
                  mergeProps(
                    {
                      key: 2,
                      'xmlns:svg': 'http://www.w3.org/2000/svg',
                      xmlns: 'http://www.w3.org/2000/svg',
                    },
                    s.$attrs,
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
              : unref(r) === 'time'
                ? (openBlock(),
                  createElementBlock(
                    'svg',
                    mergeProps(
                      { key: 3, xmlns: 'http://www.w3.org/2000/svg' },
                      s.$attrs,
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
      return (t, r) =>
        e.name.endsWith('[]')
          ? (openBlock(!0),
            createElementBlock(
              Fragment,
              { key: 0 },
              renderList(
                e.dates,
                (s, n) => (
                  openBlock(),
                  createElementBlock(
                    'input',
                    {
                      key: n,
                      type: 'hidden',
                      name: e.name,
                      value: s.toString(e.format),
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
                value: e.dates.map((s) => s.toString(e.format)),
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
          (r, s) => e[(this.calendarWeekStart - t + s + 7) % 7],
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
            const [, r, s] = t.match(
              /(div|label|alt|picker|firstInput|secondInput)-(.*)/,
            );
            e[r][s] = this.$attrs[t];
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
            .sort((r, s) => +r - +s)
            .find((r) => this.documentWidth <= +r);
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
          let r;
          const s = this.calendarMonthDate(this.onDisplay, t),
            n = this.getCalendarParts(s),
            i = n.year,
            a = n.month,
            o = this.calendarDayDate(s, 1);
          r = this.calendarWeekdayOffset(o);
          let l = this.calendarDaysInMonth(i, a);
          const d = Math.ceil((l + r) / 7),
            c = [];
          let h = 1;
          for (let w = 0; w < d; w++) {
            c[w] = [];
            for (let M = 0; M < 7; M++)
              if (r) ((c[w][M] = { empty: !0 }), --r);
              else if (l) {
                const P = this.calendarDayDate(s, h);
                ((c[w][M] = {
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
                  val: h++,
                }),
                  --l);
              } else c[w][M] = { empty: !0 };
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
        for (let r = 1; r <= t; r++)
          e[r] = {
            label: this.calendarMonthNames[r - 1] || `Month ${r}`,
            selected: this.displayMonth(this.onDisplay) == r,
            disabled: !this.checkDate(
              this.calendarMonthDate(
                this.onDisplay,
                r - this.displayMonth(this.onDisplay),
              ),
              'month',
            ),
          };
        return e;
      },
      nextLocale() {
        const e = this.effectiveLocale.split(','),
          t = e.indexOf(this.currentLocale),
          r = e[t + 1] || e[0];
        return this.langs[r].translations.label;
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
        let r = this.core.clone().now();
        t == 'time' &&
          !this.validate(r, t) &&
          (r = this.toDate.clone().subDay().now());
        const s = (i) =>
            this.mode === 'single'
              ? this.validate(i[0], t)
              : i.some((a) => this.validate(a, t)) &&
                !this.isDisableBetween(...i),
          n = (i, a = !1) => {
            for (const o in i) {
              const l = a
                ? i[o].map((d) =>
                    t == 'date' ? r.clone().fromJalali(d) : r.clone().time(d),
                  )
                : i[o];
              s(l) &&
                (e[o] =
                  this.type == 'date' ? l.map((d) => d.startOf('date')) : l);
            }
          };
        return (
          this.shortcut === !0
            ? n(
                Core.getShortcuts(
                  r,
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
          const r = e || this.defaultLocaleForCalendar(this.calendar),
            n = (t || this.effectiveLocale)
              .split(',')
              .indexOf(this.currentLocale);
          ((this.currentLocale = r.split(',')[n] || r.split(',')[0]),
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
      const r = this.$attrs.modelValue;
      if (r) this.setDate(r);
      else {
        const s = this.core.clone();
        (this.type == 'date' && s.startOf('date'),
          this.checkDate(s, 'date')
            ? (this.onDisplay = s)
            : (this.onDisplay = this.nearestDate(s).startOf('date')));
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
        const r = this.activeCalendar === 'hebrew' ? t.hebrew.length : 12,
          s = this.localeConfig?.[this.currentLocale]?.months;
        if (Array.isArray(s) && s.length >= r) return s;
        const n = [],
          i =
            this.activeCalendar === 'buddhist'
              ? 'buddhist'
              : this.activeCalendar === 'hebrew'
                ? 'hebrew'
                : 'gregory',
          a = `${this.currentLocale}-u-ca-${i}-nu-latn`,
          o = new Intl.DateTimeFormat(a, { month: 'long', timeZone: 'UTC' });
        for (let l = 1; l <= r; l++)
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
        const r = t
          .clone()
          .calendar(
            this.activeCalendar === 'gregorian' ? 'gregorian' : 'jalali',
          );
        return {
          year: r.year(),
          month: r.month(),
          day: r.date(),
          hour: r.hour(),
          minute: r.minute(),
          second: r.second(),
          millisecond: r.millisecond(),
        };
      },
      getDateTimestamp(e) {
        const t = e,
          r = Number(t.valueOf());
        if (Number.isFinite(r)) return r;
        const s = t.toDate();
        return Number.isFinite(Number(s)) ? Number(s) : Date.parse(String(s));
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
        const r = e;
        return this.calendarAdapter
          ? markRaw(
              new PersianDate().fromGregorian(
                this.calendarAdapter
                  .addMonths(new Date(this.getDateTimestamp(r)), t)
                  .getTime(),
              ),
            )
          : markRaw(r.clone().addMonth(t));
      },
      calendarDayDate(e, t) {
        const r = e;
        return this.calendarAdapter
          ? this.fromCalendarParts({ ...this.getCalendarParts(e), day: t })
          : markRaw(r.clone().date(t));
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
        const r = this.getCalendarParts(e),
          s = this.getCalendarParts(t);
        return (
          r.year === s.year &&
          r.month === s.month &&
          r.day === s.day &&
          !!r.leapMonth == !!s.leapMonth
        );
      },
      isBetweenSelectedDates(e) {
        if (this.selectedDates.length !== 2) return !1;
        const t = this.getDayTimestamp(e),
          r = this.getDayTimestamp(this.selectedDates[0]),
          s = this.getDayTimestamp(this.selectedDates[1]);
        return t > Math.min(r, s) && t < Math.max(r, s);
      },
      formatDateValue(e, t) {
        const r = e;
        if (!this.calendarAdapter) return r.toString(t);
        const s = this.getCalendarParts(e),
          n = (c, h = 2) => String(c).padStart(h, '0'),
          i = this.activeCalendar === 'chinese' && s.leapMonth ? 'bis' : '',
          a = i ? '__LEAP__' : '',
          o = this.monthNamesForYear(s.year)[s.month - 1] || `Month ${s.month}`,
          l = `${n(s.month)}${a}`,
          d = `${s.month}${a}`;
        return t
          .replace('?D', String(s.day))
          .replace('?MMMM', o)
          .replace('MMMM', o)
          .replace('YYYY', String(s.year))
          .replace('YY', String(s.year).slice(-2))
          .replace('MM', l)
          .replace('M', d)
          .replace('DD', n(s.day))
          .replace('D', String(s.day))
          .replace('HH', n(s.hour || 0))
          .replace('H', String(s.hour || 0))
          .replace('mm', n(s.minute || 0))
          .replace('m', String(s.minute || 0))
          .replace('ss', n(s.second || 0))
          .replace('s', String(s.second || 0))
          .replace(/__LEAP__/g, i);
      },
      formatModelValue(e) {
        const t =
          this.modelCalendar === 'active'
            ? this.activeCalendar
            : this.modelCalendar;
        if (!t || t === this.activeCalendar)
          return this.formatDateValue(e, this.formats.model);
        const r = e,
          s = this.getDateTimestamp(r);
        if (t === 'jalali' || t === 'gregorian')
          return new PersianDate()
            .fromGregorian(s)
            .calendar(t)
            .toString(this.formats.model);
        const i = createCalendarAdapter(t, {
            hijriProvider: this.hijriProvider,
          }).getParts(new Date(s)),
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
          r = t[1] || '1',
          s = this.activeCalendar === 'chinese' && /bis$/i.test(r),
          n = Number.parseInt(r.replace(/bis$/i, ''), 10);
        return {
          year: Number(t[0]),
          month: n || 1,
          day: Number(t[2]) || 1,
          hour: Number(t[3]) || 0,
          minute: Number(t[4]) || 0,
          second: Number(t[5]) || 0,
          ...(s ? { leapMonth: !0 } : {}),
        };
      },
      parseCalendarDate(e) {
        if (this.calendarAdapter)
          return this.fromCalendarParts(this.parseCalendarParts(e));
        const t = this.core.clone(),
          r =
            this.calendar === 'gregorian' ||
            (e.includes('-') && !e.includes('/'))
              ? 'gregorian'
              : 'jalali';
        return /[-/ ]/.test(e)
          ? (r === 'gregorian' ? t.fromGregorian(e) : t.fromJalali(e)).calendar(
              this.activeCalendar,
            )
          : t.calendar(r).parse(e).calendar(this.activeCalendar);
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
          const r = this.getCalendarParts(this.onDisplay);
          this.onDisplay = this.fromCalendarParts({
            ...r,
            month: e,
            day: Math.min(r.day, this.calendarDaysInMonth(r.year, e)),
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
          const r = this.getDateTimestamp(e),
            s = this.getDateTimestamp(t),
            n = Math.min(r, s),
            i = Math.max(r, s),
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
          const r =
            this.type == 'time' ? t.clone().time(this.disable) : this.disable;
          return this.core
            .clone()
            .parse(r)
            .isBetween(e.toString(), t.toString());
        } else {
          if (
            this.type != 'datetime' &&
            Array.isArray(this.disable) &&
            this.disable.some((r) => Core.isString(r))
          )
            return this.disable.some(
              (r) => (
                this.type == 'time' && (r = t.clone().time(r).toString()),
                this.core.clone().parse(r).isBetween(e, t)
              ),
            );
          if (this.type != 'time') {
            const r = t.clone().startOf('date').subDay();
            for (; !r.isSameOrBefore(e); ) {
              if (this.isInDisable(r)) return !0;
              r.subDay();
            }
          }
        }
        return !1;
      },
      selectDate(e, t) {
        let r = this.validate(e, t);
        if (r) {
          if (
            this.mode == 'range' &&
            this.selectedDates.length == 1 &&
            ((r = !this.isDisableBetween(this.selectedDates[0], e)), !r)
          )
            return -2;
        } else return -1;
        return (
          this.type == 'date' && e.startOf('date'),
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
              (s, n) => (
                this.selectedTimes[n] && s.time(this.selectedTimes[n]),
                (this.selectedTimes[n] = s),
                s
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
        let r, s;
        switch (
          (Core.isPersianDate(e) || (e = this.core.clone().parse(e)), t)
        ) {
          case 'year':
            ((r = this.fromDate.toString('?YYYY')),
              (s = this.toDate.toString('?YYYY')));
            break;
          case 'month':
            ((r = this.fromDate.toString('?YYYY/?MM')),
              (s = this.toDate.toString('?YYYY/?MM')));
            break;
          case 'date':
            ((r = this.fromDate.toString()), (s = this.toDate.toString()));
            break;
          case 'time':
            ((r = this.fromDate.toString(
              this.type.includes('time') ? 'datetime' : 'date',
            )),
              (s = this.toDate.toString(
                this.type.includes('time') ? 'datetime' : 'date',
              )));
            break;
        }
        return e.isBetween(r, s, '[]');
      },
      isInDisable(e, t) {
        if (!this.disable) return !1;
        t = t || this.disable;
        const r = e,
          s = Core.isPersianDate(r) ? r.clone() : this.core.clone().parse(r);
        return Core.isString(t)
          ? this.isSameDisabledValue(s, t)
          : t instanceof RegExp
            ? this.testDisableRegex(t, this.formatDisableValue(s))
            : Core.isFunction(t)
              ? t(s)
              : Array.isArray(t)
                ? t.some((n) => {
                    if (Core.isString(n)) return this.isSameDisabledValue(s, n);
                    if (n instanceof RegExp)
                      return this.testDisableRegex(
                        n,
                        this.formatDisableValue(s),
                      );
                  })
                : !1;
      },
      selectedTimeValue(e) {
        const t = this.selectedTimes[e];
        if (!t) return;
        const r = this.selectedDates[e];
        return r
          ? r
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
        const r = this.parseDisabledValue(
          this.type === 'time' && !/[\s/-]/.test(t)
            ? `${e.toString('YYYY-MM-DD')} ${t}`
            : t,
        );
        if (!this.calendarAdapter && !this.calendar && t.includes('/')) {
          const s = e.clone().calendar('jalali'),
            n = r.clone().calendar('jalali'),
            i =
              s.year() === n.year() &&
              s.month() === n.month() &&
              s.date() === n.date();
          if (this.type === 'date' || !/\s/.test(t)) return i;
          if (this.type === 'datetime')
            return i && s.hour() === n.hour() && s.minute() === n.minute();
        }
        return this.type === 'time'
          ? e.hour() === r.hour() && e.minute() === r.minute()
          : this.type === 'date' || !/[\s:]/.test(t)
            ? e.clone().startOf('date').isSame(r.clone().startOf('date'))
            : e.isSame(r);
      },
      parseDisabledValue(e) {
        return !this.calendarAdapter && !this.calendar && e.includes('/')
          ? this.core.clone().calendar('jalali').parse(e)
          : this.parseCalendarDate(e);
      },
      testDisableRegex(e, t) {
        e.lastIndex = 0;
        const r = e.test(t);
        return ((e.lastIndex = 0), r);
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
          onInput: (r) => {
            const s = r.target;
            ((this.displayValue[e] = s.value), this.sanitizeInput(e, r));
          },
          onBlur: () => {
            (this.sanitizeInput(e), this.commitInput(e));
          },
          onKeydown: (r) => this.selectWithArrow(r),
        };
      },
      showPicker(e, t) {
        if (this.clickOn == 'all' || this.clickOn == e) {
          const r = this.inputs[t];
          (this.dualInput && (this.inputName = r),
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
          let r = { ArrowLeft: 1, ArrowUp: -7, ArrowRight: -1, ArrowDown: 7 }[
            e.key
          ];
          this.lang.dir.picker == 'ltr' &&
            ['ArrowLeft', 'ArrowRight'].includes(e.key) &&
            (r = -r);
          const s = this.$refs.root;
          let n = s.querySelectorAll('.pdp .pdp-day.hover');
          n.length ||
            (n = s.querySelectorAll(
              '.pdp .pdp-day.start-range,.pdp .pdp-day.end-range',
            ));
          let i = n[n.length - 1];
          if (i) {
            let a = Number(this.getColumn(i));
            i.classList.remove('hover');
            const o = this.calendarMonthDate(this.onDisplay, a),
              l = this.calendarDayDate(o, Number(i.innerText)),
              d = this.calendarAddDays(l, r);
            if (!this.checkDate(d, 'date')) return i.classList.add('hover');
            const c = this.calendarMonthKey(d);
            a = -1;
            for (let h = 0; h < this.columnCount; h++)
              if (
                this.calendarMonthKey(
                  this.calendarMonthDate(this.onDisplay, h),
                ) === c
              ) {
                a = h;
                break;
              }
            if (a < 0) {
              const h = this.calendarMonthDate(this.onDisplay, 0);
              this.getDateTimestamp(d) < this.getDateTimestamp(h)
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
              (i = s.querySelector(
                `.pdp .pdp-main .pdp-column[data-column='${a}'] .pdp-day[value='${this.displayDay(d)}']`,
              )),
              i && i.classList.add('hover'));
          } else
            ((i = s.querySelector('.pdp .pdp-day:not(.empty):not(.disabled)')),
              i ||
                (i = s.querySelector(
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
            : this.displayValue.forEach((r, s) => {
                this.commitInput(s);
              });
        }
      },
      commitInput(e) {
        const r = this.$refs.inputs?.[e],
          s = r?.value ?? this.displayValue[e],
          n = this.dualInput
            ? this.selectedDates[e]
              ? this.formatDateValue(this.selectedDates[e], this.formats.input)
              : ''
            : this.selectedDates
                .map((d) => this.formatDateValue(d, this.formats.input))
                .join(' - ');
        if (s === n) return;
        const i = this.inputMask ? s : this.sanitizeInputValue(s);
        if (!i) return;
        i !== s && (r && (r.value = i), (this.displayValue[e] = i));
        const a = this.normalizeInputDigits(i);
        let o;
        if (this.type === 'time') {
          const d = a.split(/[/ -.,:\\]/);
          ((o = this.checkDate(this.core.clone(), 'time')
            ? this.core.clone()
            : this.fromDate.clone()),
            o.time(d));
        } else
          o = this.calendarAdapter
            ? this.parseCalendarDate(a)
            : this.core.clone().parse(a);
        const l = this.type === 'time' ? 'time' : 'date';
        if (!(!o.isValid() || this.selectDate(o, l) !== 0)) {
          if (this.mode === 'single' && this.type.includes('date'))
            this.onDisplay = o.clone();
          else {
            const d = o.diff(this.onDisplay, 'month');
            (d < 0 || d >= this.columnCount) && (this.onDisplay = o.clone());
          }
          this.displayValue[e] = '';
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
            allowedDigits:
              this.activeCalendar === 'jalali' || this.lang.dir.input === 'rtl'
                ? 'both'
                : 'latin',
            strict: !0,
          };
        if (typeof e == 'string') return { pattern: e };
        if ('pattern' in e || 'allowedDigits' in e || 'strict' in e) return e;
        const t = e[this.type];
        return typeof t == 'string' ? { pattern: t } : t || {};
      },
      normalizeInputDigits(e) {
        return Array.from(e)
          .map((t) => {
            const r = t.codePointAt(0) || 0;
            return r >= 1776 && r <= 1785
              ? String(r - 1776)
              : r >= 1632 && r <= 1641
                ? String(r - 1632)
                : t;
          })
          .join('');
      },
      sanitizeInput(e, t) {
        const r = t?.target,
          s = r?.value ?? this.displayValue[e];
        if (!s) return;
        const n = this.sanitizeInputValue(s);
        n !== s && (r && (r.value = n), (this.displayValue[e] = n));
      },
      sanitizeInputValue(e) {
        const t = this.inputMaskPattern(),
          r = this.inputMaskConfig().allowedDigits || 'latin',
          s = t
            .replace(/j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g, '')
            .split(''),
          n = /MMMM|MMM/.test(t);
        return Array.from(e)
          .filter((i) => {
            const a = /[0-9]/.test(i),
              o = /[۰-۹٠-٩]/.test(i);
            return (r === 'latin' && a) ||
              (r === 'locale' && o) ||
              (r === 'both' && (a || o)) ||
              s.includes(i) ||
              /\s/.test(i)
              ? !0
              : n && new RegExp('\\p{L}', 'u').test(i);
          })
          .join('');
      },
      selectInRangeDate(e) {
        const t = e.target;
        if (!t.classList.contains('pdp-day')) return;
        const r = this.$refs.root;
        r.querySelectorAll('.pdp .pdp-day').forEach((l) => {
          l.classList.remove('in-range');
        });
        let s = this.getColumn(t);
        const n = this.onDisplay
            .clone()
            .startOf('date')
            .addMonth(s)
            .date(t.innerText),
          i = this.selectedDates[0].clone().startOf('date'),
          a = n.isAfter(i) ? 1 : -1,
          o = r.querySelector('.pdp-day.start-range,.pdp-day.end-range');
        for (
          o
            ? ((s = +this.getColumn(o)),
              o.classList.replace(
                ...(n.isBefore(i)
                  ? ['start-range', 'end-range']
                  : ['end-range', 'start-range']),
              ))
            : (i.parse(this.onDisplay),
              a === 1
                ? (i.startOf('month').subDay(), (s = -1))
                : (i
                    .addMonth(this.columnCount - 1)
                    .endOf('month')
                    .addDay()
                    .startOf('date'),
                  (s = this.columnCount)));
          !n.isSame(i);

        ) {
          const l = i.month();
          if (
            (i.addDay(a),
            l != i.month() && (s += a),
            this.checkDate(i, 'date') && !this.isInDisable(i))
          )
            r.querySelector(
              `.pdp-column[data-column='${s}'] .pdp-day[value='${i.date()}']`,
            ).classList.add('in-range');
          else break;
        }
      },
      submitDate(e = !0) {
        const t = this.selectedDates.map((r) =>
          this.formatDateValue(r, this.formats.input),
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
              r = t.offsetHeight + t.getBoundingClientRect().top,
              s = this.$refs.pdpPicker,
              n = s.offsetHeight + 10,
              i = s.getBoundingClientRect();
            this.pickerPlace = {
              top: r >= n && window.innerHeight - (r + n) < 0,
              left: i.left <= 0,
              right: window.innerWidth - (i.left + i.width) <= 0,
            };
          }));
      },
      changeLocale() {
        const e = this.effectiveLocale.split(','),
          t = e.indexOf(this.currentLocale);
        this.currentLocale = e[t + 1] || e[0];
        const r = this.activeCalendar,
          s = this.calendarAdapter ? 'gregorian' : r;
        (this.core.calendar(s),
          this.fromDate.calendar(s),
          this.toDate.calendar(s),
          this.onDisplay.calendar(s));
        for (const n of this.selectedDates) n.calendar(s);
        for (const n of this.selectedTimes) n.calendar(s);
        this.submitDate(!1);
      },
      clear(e) {
        const t = e === 'firstInput' ? 0 : 1;
        if (
          ((this.displayValue[t] = ''), this.$emit('clear'), this.dualInput)
        ) {
          const r = this.$attrs.value;
          if (r && Array.isArray(r))
            return this.setModel(r.map((s, n) => (n == t ? null : s)));
        }
        this.setModel('');
      },
      startChangeTime(e, t, r) {
        let s = this.selectedTimes[e];
        (s ||
          ((s = this.core.clone()),
          this.checkDate(s, 'time') ||
            (s = this.toDate.clone().subDay().time(this.core)),
          e == 1 &&
            !this.selectedTimes.length &&
            this.selectedTimes.push(s.clone()),
          this.selectedTimes.push(s)),
          this.stopChangeTime());
        const n = t == 'hour' ? 23 : 59;
        let i = s[t](),
          a = t == 'hour' ? this.hourStepCount : this.minuteStepCount;
        const o = () => {
          (r == 'add'
            ? ((i = i + a), i > n && (i = 0))
            : ((i = i - a), i < 0 && (i = n)),
            this.checkDate(s[t](i), 'time')
              ? this.selectedTimes.length == 2 &&
                this.selectedTimes[0].isAfter(this.selectedTimes[1]) &&
                s.parse(e == 0 ? this.selectedTimes[1] : this.selectedTimes[0])
              : s.parse(
                  s.isSameOrAfter(this.toDate.clone())
                    ? this.toDate.clone()
                    : this.fromDate.clone(),
                ));
          const l = this.selectedDates[e]
            ? this.selectedDates[e]
                .clone()
                .hour(s.hour())
                .minute(s.minute())
                .second(s.second())
                .millisecond(s.millisecond())
            : s;
          ((this.selectedTimes[e] = s.clone()),
            this.isInDisable(l) ||
              (this.type == 'time'
                ? (this.selectedDates[e] = s)
                : this.selectedDates[e] && this.selectedDates[e].time(s),
              this.$emit('select', s),
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
          (t, r) => (
            r == 0 && (this.onDisplay = t.clone()),
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
          e.some((t, r) => {
            const s = this.parseCalendarDate(
              (this.type == 'time'
                ? this.core.toString('YYYY-MM-DD') + ' '
                : '') + t,
            );
            if (s)
              (this.selectedDates.push(markRaw(s.clone())),
                this.selectedTimes.push(markRaw(s.clone())),
                r == 0 && (this.onDisplay = markRaw(s.clone())));
            else return ((this.selectedDates = this.selectedTimes = []), !0);
          }),
          this.selectedDates.length && this.submitDate());
      },
    },
  }),
  _export_sfc = (e, t) => {
    const r = e.__vccOpts || e;
    for (const [s, n] of t) r[s] = n;
    return r;
  },
  _hoisted_1$1 = ['for'],
  _hoisted_2$1 = ['onClick'],
  _hoisted_3$1 = [
    'onUpdate:modelValue',
    'placeholder',
    'onFocus',
    'onInput',
    'onBlur',
  ],
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
function _sfc_render(e, t, r, s, n, i) {
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
                              onClick: (h) => e.showPicker('icon', c),
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
                          withDirectives(
                            createBaseVNode(
                              'input',
                              mergeProps(
                                {
                                  ref_for: !0,
                                  ref: 'inputs',
                                  'onUpdate:modelValue': (h) =>
                                    (e.displayValue[c] = h),
                                  type: 'text',
                                  autocomplete: 'off',
                                },
                                { ref_for: !0 },
                                e.attrs[d],
                                {
                                  placeholder:
                                    e.inputMaskConfig().placeholder ||
                                    e.attrs[d].placeholder,
                                  onFocus: (h) => e.showPicker('input', c),
                                  onInput: (h) => e.sanitizeInput(c, h),
                                  onBlur: (h) => {
                                    (e.sanitizeInput(c, h), e.commitInput(c));
                                  },
                                  onKeydown:
                                    t[0] ||
                                    (t[0] = (...h) =>
                                      e.selectWithArrow &&
                                      e.selectWithArrow(...h)),
                                },
                              ),
                              null,
                              16,
                              _hoisted_3$1,
                            ),
                            [[vModelText, e.displayValue[c]]],
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
                              onClick: (h) => e.clear(d),
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
                                          onClick: (h) =>
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
                                          onClick: (h) =>
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
                                            (t[4] = (h) => e.showPart('month')),
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
                                            (t[5] = (h) => e.showPart('year')),
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
                                              (h, w) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'div',
                                                  {
                                                    key: w,
                                                    class: 'pdp-weekday',
                                                  },
                                                  toDisplayString(h),
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
                                              (h, w) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'div',
                                                  { key: w },
                                                  [
                                                    (openBlock(!0),
                                                    createElementBlock(
                                                      Fragment,
                                                      null,
                                                      renderList(
                                                        h,
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
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (h) =>
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
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[8] ||
                                                      (t[8] = withModifiers(
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[9] ||
                                                      (t[9] = withKeys(
                                                        withModifiers(
                                                          (...h) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...h,
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
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'hour',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (h) =>
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
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[11] ||
                                                      (t[11] = withModifiers(
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[12] ||
                                                      (t[12] = withKeys(
                                                        withModifiers(
                                                          (...h) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...h,
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
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'add',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (h) =>
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
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[14] ||
                                                      (t[14] = withModifiers(
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[15] ||
                                                      (t[15] = withKeys(
                                                        withModifiers(
                                                          (...h) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...h,
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
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onMousedown: withModifiers(
                                                      (h) =>
                                                        e.startChangeTime(
                                                          c,
                                                          'minute',
                                                          'sub',
                                                        ),
                                                      ['prevent'],
                                                    ),
                                                    onKeydown: withKeys(
                                                      withModifiers(
                                                        (h) =>
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
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onMouseup:
                                                      t[17] ||
                                                      (t[17] = withModifiers(
                                                        (...h) =>
                                                          e.stopChangeTime &&
                                                          e.stopChangeTime(
                                                            ...h,
                                                          ),
                                                        ['prevent'],
                                                      )),
                                                    onKeyup:
                                                      t[18] ||
                                                      (t[18] = withKeys(
                                                        withModifiers(
                                                          (...h) =>
                                                            e.stopChangeTime &&
                                                            e.stopChangeTime(
                                                              ...h,
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
                                      (h, w) =>
                                        !h.isSame(
                                          e.selectedDates[w] &&
                                            e.selectedDates[w].toString(
                                              'datetime',
                                            ),
                                        ),
                                    ),
                                  }),
                                  onClick: (h) => e.selectShorcut(d),
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
  _hoisted_27 = ['placeholder'],
  _hoisted_28 = ['placeholder'],
  _hoisted_29 = { class: 'check-option' },
  _hoisted_30 = { class: 'check-option' },
  _hoisted_31 = { class: 'check-option' },
  _hoisted_32 = { class: 'check-option' },
  _hoisted_33 = { class: 'check-option' },
  _hoisted_34 = { class: 'check-option' },
  _hoisted_35 = { class: 'check-option' },
  _hoisted_36 = { class: 'api-note' },
  _hoisted_37 = { class: 'main-preview' },
  _hoisted_38 = { class: 'preview-topline' },
  _hoisted_39 = { class: 'preview-icon' },
  _hoisted_40 = { class: 'preview-label' },
  _hoisted_41 = { class: 'status-pill' },
  _hoisted_42 = ['dir'],
  _hoisted_43 = { class: 'value-panel' },
  _hoisted_44 = { class: 'playground-hint' },
  _hoisted_45 = { class: 'generated-code' },
  _hoisted_46 = { class: 'gallery', 'aria-labelledby': 'gallery-title' },
  _hoisted_47 = { class: 'section-heading gallery-heading' },
  _hoisted_48 = { id: 'gallery-title' },
  _hoisted_49 = { class: 'calendar-grid' },
  _hoisted_50 = ['dir'],
  _hoisted_51 = { class: 'card-header' },
  _hoisted_52 = { class: 'card-title' },
  _hoisted_53 = { class: 'card-icon' },
  _hoisted_54 = { class: 'card-picker' },
  _hoisted_55 = { class: 'card-actions' },
  _hoisted_56 = { class: 'card-value' },
  _hoisted_57 = ['onClick'],
  _hoisted_58 = { class: 'gallery' },
  _hoisted_59 = { class: 'section-heading gallery-heading' },
  _hoisted_60 = { class: 'calendar-grid' },
  _hoisted_61 = { class: 'card-header' },
  _hoisted_62 = { class: 'card-title' },
  _hoisted_63 = { class: 'card-icon' },
  _hoisted_64 = { class: 'card-picker' },
  _hoisted_65 = ['onClick'],
  _hoisted_66 = { class: 'demo-footer' },
  _hoisted_67 = ['aria-label'],
  _hoisted_68 = { class: 'modal-header' },
  _hoisted_69 = ['aria-label'],
  _hoisted_70 = { class: 'code-tabs single-code' },
  _hoisted_71 = { class: 'modal-actions' },
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
            api: 'با propهای calendar، mode و hijri-provider رفتار کامپوننت را کنترل کنید.',
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
            api: 'Control the component with calendar, mode, and hijri-provider props.',
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
            api: 'تحكم في المكوّن عبر calendar و mode و hijri-provider.',
            liveHint:
              'أدخل التاريخ يدوياً؛ بعد مغادرة الحقل يتزامن النموذج والشهر المعروض.',
          },
        },
        s = ref('en'),
        n = ref('jalali'),
        i = ref('ummalqura'),
        a = ref('single'),
        o = ref('date'),
        l = ref('1404/01/15'),
        d = ref('1404/01/15'),
        c = reactive(Object.fromEntries(t.map(($) => [$.id, $.sample]))),
        h = ref(null),
        w = ref(!1),
        M = ref('blue'),
        P = ref(''),
        E = ref(''),
        Y = ref('auto'),
        I = ref([]),
        B = ref(''),
        H = ref('2025-04-04'),
        V = ref(''),
        L = ref(''),
        G = ref(''),
        J = ref(1),
        X = ref(!0),
        se = ref(!0),
        Q = ref(!1),
        te = ref(!1),
        ne = ref(1),
        ie = ref(1),
        ue = ref('all'),
        R = computed(() => r[s.value]),
        z = computed(() => t.find(($) => $.id === n.value) || t[0]),
        K = computed(() => (s.value === 'en' ? 'ltr' : 'rtl')),
        x = {
          jalali: 'fa',
          gregorian: 'en',
          hijri: 'ar',
          hebrew: 'he',
          buddhist: 'th',
          chinese: 'zh',
        };
      function re($) {
        return s.value === 'en' ? x[$] : s.value;
      }
      const he = computed(() => [
          {
            title: R.value.time,
            type: 'time',
            mode: 'single',
            value: '14:30',
            icon: '◷',
          },
          {
            title: R.value.range,
            type: 'time',
            mode: 'range',
            value: '09:00 - 17:30',
            icon: '↔',
          },
          {
            title: R.value.datetime,
            type: 'datetime',
            mode: 'single',
            value: '2025-04-04 14:30',
            icon: '◫',
          },
        ]),
        ae = ($, m = 'date', D = 'single') => ({
          title: `${$.title[s.value]} · ${m}`,
          html: `<DatePicker
  v-model="value"
  calendar="${$.id}"
  type="${m}"
  mode="${D}"
  ${
    $.id === 'hijri'
      ? `hijri-provider="ummalqura"
  `
      : ''
  }/>`,
        }),
        Z = computed(() => {
          const $ = z.value;
          return [
            '<DatePicker',
            '  v-model="value"',
            `  calendar="${$.id}"`,
            `  type="${o.value}"`,
            `  mode="${a.value}"`,
            `  locale="${B.value || re($.id)}"`,
            `  :column="${J.value}"`,
            `  color="${M.value}"`,
            `  week-starts-on="${Y.value}"`,
            `  click-on="${ue.value}"`,
            `  :minute-step="${ne.value}"`,
            `  :hour-step="${ie.value}"`,
            X.value ? '  clearable' : '  :clearable="false"',
            se.value ? '  auto-submit' : '  :auto-submit="false"',
            V.value ? `  input-format="${V.value}"` : '',
            L.value ? `  input-mask="${L.value}"` : '',
            G.value ? `  display-format="${G.value}"` : '',
            Q.value ? '  icon-inside' : '',
            te.value ? '  dual-input' : '',
            P.value ? `  from="${P.value}"` : '',
            E.value ? `  to="${E.value}"` : '',
            I.value.length ? `  :weekend-days="[${I.value.join(', ')}]"` : '',
            $.id === 'hijri' ? '  hijri-provider="ummalqura"' : '',
            '/>',
          ].filter(Boolean).join(`
`);
        });
      function fe($) {
        l.value = a.value === 'range' ? [$, $] : $;
      }
      function me() {
        return o.value === 'time'
          ? '14:30'
          : o.value === 'datetime'
            ? `${d.value} 14:30`
            : d.value;
      }
      (watch(n, ($) => {
        const m = t.find((D) => D.id === $).sample;
        ((d.value = m),
          fe(m),
          (o.value = 'date'),
          (P.value = ''),
          (E.value = ''),
          (Y.value = 'auto'),
          (I.value = []));
      }),
        watch(i, () => {
          n.value === 'hijri' && ((d.value = '1446-10-06'), fe('1446-10-06'));
        }),
        watch(o, ($) => {
          let m = d.value;
          ($ === 'time'
            ? (m = '14:30')
            : $ === 'datetime' && (m = `${d.value} 14:30`),
            $ === 'time' && a.value === 'range' ? (l.value = void 0) : fe(m));
        }),
        watch(a, ($) => {
          if ($ === 'range') {
            if (o.value === 'time') l.value = void 0;
            else if (!Array.isArray(l.value)) {
              const m = l.value ?? me();
              l.value = [m, m];
            }
          } else Array.isArray(l.value) && (l.value = l.value[0] ?? me());
        }));
      function ye($) {
        ((h.value = $), (w.value = !1));
      }
      async function de() {
        h.value &&
          (await navigator.clipboard?.writeText(h.value.html), (w.value = !0));
      }
      function pe() {
        ((s.value = 'en'),
          (n.value = 'jalali'),
          (i.value = 'ummalqura'),
          (a.value = 'single'),
          (o.value = 'date'),
          (d.value = '1404/01/15'),
          (l.value = '1404/01/15'),
          (M.value = 'blue'),
          (P.value = ''),
          (E.value = ''),
          (Y.value = 'auto'),
          (I.value = []),
          (B.value = ''),
          (H.value = '2025-04-04'),
          (V.value = ''),
          (L.value = ''),
          (G.value = ''),
          (J.value = 1),
          (X.value = !0),
          (se.value = !0),
          (Q.value = !1),
          (te.value = !1),
          (ne.value = 1),
          (ie.value = 1),
          (ue.value = 'all'));
      }
      return ($, m) => (
        openBlock(),
        createElementBlock(
          'main',
          { class: 'demo-shell', dir: K.value },
          [
            createBaseVNode('nav', _hoisted_2, [
              (openBlock(),
              createElementBlock(
                Fragment,
                null,
                renderList(['fa', 'en', 'ar'], (D) =>
                  createBaseVNode(
                    'button',
                    {
                      key: D,
                      type: 'button',
                      class: normalizeClass({ selected: s.value === D }),
                      onClick: (u) => (s.value = D),
                    },
                    toDisplayString(
                      D === 'fa' ? 'فارسی' : D === 'en' ? 'English' : 'العربية',
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
                  m[32] ||
                    (m[32] = createBaseVNode(
                      'span',
                      { class: 'eyebrow-dot' },
                      null,
                      -1,
                    )),
                  createTextVNode(toDisplayString(R.value.eyebrow), 1),
                ]),
                createBaseVNode('h1', null, toDisplayString(R.value.title), 1),
                createBaseVNode('p', null, [
                  createTextVNode(toDisplayString(R.value.intro) + ' ', 1),
                  m[33] ||
                    (m[33] = createBaseVNode(
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
                    renderList(t, (D) =>
                      createBaseVNode(
                        'span',
                        { key: D.id },
                        toDisplayString(D.title[s.value]),
                        1,
                      ),
                    ),
                    64,
                  )),
                ]),
              ]),
              m[34] ||
                (m[34] = createBaseVNode(
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
                  m[35] ||
                    (m[35] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'PLAYGROUND',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    _hoisted_10,
                    toDisplayString(R.value.playground),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'button',
                  { class: 'reset-button', type: 'button', onClick: pe },
                  toDisplayString(R.value.reset),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_11, [
                createBaseVNode('aside', _hoisted_12, [
                  createBaseVNode('div', _hoisted_13, [
                    createBaseVNode(
                      'label',
                      _hoisted_14,
                      toDisplayString(R.value.active),
                      1,
                    ),
                    withDirectives(
                      createBaseVNode(
                        'select',
                        {
                          id: 'calendar-select',
                          'onUpdate:modelValue':
                            m[0] || (m[0] = (D) => (n.value = D)),
                        },
                        [
                          (openBlock(),
                          createElementBlock(
                            Fragment,
                            null,
                            renderList(t, (D) =>
                              createBaseVNode(
                                'option',
                                { key: D.id, value: D.id },
                                toDisplayString(D.title[s.value]) +
                                  ' — ' +
                                  toDisplayString(D.subtitle),
                                9,
                                _hoisted_15,
                              ),
                            ),
                            64,
                          )),
                        ],
                        512,
                      ),
                      [[vModelSelect, n.value]],
                    ),
                  ]),
                  n.value === 'hijri'
                    ? (openBlock(),
                      createElementBlock('div', _hoisted_16, [
                        createBaseVNode(
                          'label',
                          _hoisted_17,
                          toDisplayString(R.value.provider),
                          1,
                        ),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              id: 'hijri-provider',
                              'onUpdate:modelValue':
                                m[1] || (m[1] = (D) => (i.value = D)),
                            },
                            [
                              ...(m[36] ||
                                (m[36] = [
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
                          [[vModelSelect, i.value]],
                        ),
                      ]))
                    : createCommentVNode('', !0),
                  createBaseVNode('fieldset', _hoisted_18, [
                    createBaseVNode(
                      'legend',
                      null,
                      toDisplayString(R.value.type),
                      1,
                    ),
                    createBaseVNode('label', _hoisted_19, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[2] || (m[2] = (D) => (o.value = D)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'date',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(R.value.date), 1),
                    ]),
                    createBaseVNode('label', _hoisted_20, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[3] || (m[3] = (D) => (o.value = D)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'time',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(R.value.time), 1),
                    ]),
                    createBaseVNode('label', _hoisted_21, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[4] || (m[4] = (D) => (o.value = D)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'datetime',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(R.value.datetime), 1),
                    ]),
                  ]),
                  createBaseVNode('fieldset', _hoisted_22, [
                    createBaseVNode(
                      'legend',
                      null,
                      toDisplayString(R.value.playground),
                      1,
                    ),
                    createBaseVNode('label', _hoisted_23, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[5] || (m[5] = (D) => (a.value = D)),
                            name: 'playground-mode',
                            type: 'radio',
                            value: 'single',
                            onChange:
                              m[6] || (m[6] = (D) => (a.value = 'single')),
                          },
                          null,
                          544,
                        ),
                        [[vModelRadio, a.value]],
                      ),
                      createTextVNode(toDisplayString(R.value.single), 1),
                    ]),
                    createBaseVNode('label', _hoisted_24, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[7] || (m[7] = (D) => (a.value = D)),
                            name: 'playground-mode',
                            type: 'radio',
                            value: 'range',
                            onChange:
                              m[8] || (m[8] = (D) => (a.value = 'range')),
                          },
                          null,
                          544,
                        ),
                        [[vModelRadio, a.value]],
                      ),
                      createTextVNode(toDisplayString(R.value.range), 1),
                    ]),
                  ]),
                  createBaseVNode('details', _hoisted_25, [
                    m[62] ||
                      (m[62] = createBaseVNode(
                        'summary',
                        null,
                        'ADVANCED PROPS',
                        -1,
                      )),
                    createBaseVNode('div', _hoisted_26, [
                      createBaseVNode('label', null, [
                        m[38] || (m[38] = createTextVNode('Color', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[9] || (m[9] = (D) => (M.value = D)),
                            },
                            [
                              ...(m[37] ||
                                (m[37] = [
                                  createBaseVNode('option', null, 'blue', -1),
                                  createBaseVNode('option', null, 'red', -1),
                                  createBaseVNode('option', null, 'green', -1),
                                  createBaseVNode('option', null, 'purple', -1),
                                  createBaseVNode('option', null, 'gray', -1),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, M.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[40] || (m[40] = createTextVNode('Locale', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[10] || (m[10] = (D) => (B.value = D)),
                            },
                            [
                              ...(m[39] ||
                                (m[39] = [
                                  createStaticVNode(
                                    '<option value="">Calendar default</option><option value="en">English</option><option value="fa">فارسی</option><option value="ar">العربية</option><option value="he">עברית</option><option value="th">ไทย</option><option value="zh">中文</option>',
                                    7,
                                  ),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, B.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[41] || (m[41] = createTextVNode('From', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[11] || (m[11] = (D) => (P.value = D)),
                              placeholder: z.value.from,
                            },
                            null,
                            8,
                            _hoisted_27,
                          ),
                          [[vModelText, P.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[42] || (m[42] = createTextVNode('To', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[12] || (m[12] = (D) => (E.value = D)),
                              placeholder: z.value.to,
                            },
                            null,
                            8,
                            _hoisted_28,
                          ),
                          [[vModelText, E.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[43] || (m[43] = createTextVNode('Input format', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[13] || (m[13] = (D) => (V.value = D)),
                              placeholder: 'YYYY-MM-DD',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, V.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[44] || (m[44] = createTextVNode('Input mask', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[14] || (m[14] = (D) => (L.value = D)),
                              placeholder: 'calendar-default',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, L.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[45] ||
                          (m[45] = createTextVNode('Display format', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[15] || (m[15] = (D) => (G.value = D)),
                              placeholder: '?D ?MMMM',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, G.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[47] || (m[47] = createTextVNode('Months shown', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[16] || (m[16] = (D) => (J.value = D)),
                            },
                            [
                              ...(m[46] ||
                                (m[46] = [
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
                        m[49] || (m[49] = createTextVNode('Week starts', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[17] || (m[17] = (D) => (Y.value = D)),
                            },
                            [
                              ...(m[48] ||
                                (m[48] = [
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
                          [[vModelSelect, Y.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[51] || (m[51] = createTextVNode('Click on', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[18] || (m[18] = (D) => (ue.value = D)),
                            },
                            [
                              ...(m[50] ||
                                (m[50] = [
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
                          [[vModelSelect, ue.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[52] || (m[52] = createTextVNode('Minute step', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[19] || (m[19] = (D) => (ne.value = D)),
                              type: 'number',
                              min: '1',
                              max: '60',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, ne.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[53] || (m[53] = createTextVNode('Hour step', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[20] || (m[20] = (D) => (ie.value = D)),
                              type: 'number',
                              min: '1',
                              max: '24',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, ie.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      m[61] ||
                        (m[61] = createBaseVNode(
                          'span',
                          { class: 'advanced-label weekly-label' },
                          'Weekly holidays',
                          -1,
                        )),
                      createBaseVNode('label', _hoisted_29, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[21] || (m[21] = (D) => (I.value = D)),
                              type: 'checkbox',
                              value: 0,
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, I.value]],
                        ),
                        m[54] || (m[54] = createTextVNode('Sunday', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_30, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[22] || (m[22] = (D) => (I.value = D)),
                              type: 'checkbox',
                              value: 5,
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, I.value]],
                        ),
                        m[55] || (m[55] = createTextVNode('Friday', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_31, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[23] || (m[23] = (D) => (I.value = D)),
                              type: 'checkbox',
                              value: 6,
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, I.value]],
                        ),
                        m[56] || (m[56] = createTextVNode('Saturday', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_32, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[24] || (m[24] = (D) => (X.value = D)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, X.value]],
                        ),
                        m[57] || (m[57] = createTextVNode('Clearable', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_33, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[25] || (m[25] = (D) => (se.value = D)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, se.value]],
                        ),
                        m[58] || (m[58] = createTextVNode('Auto submit', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_34, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[26] || (m[26] = (D) => (Q.value = D)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, Q.value]],
                        ),
                        m[59] || (m[59] = createTextVNode('Icon inside', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_35, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[27] || (m[27] = (D) => (te.value = D)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, te.value]],
                        ),
                        m[60] || (m[60] = createTextVNode('Dual input', -1)),
                      ]),
                    ]),
                  ]),
                  createBaseVNode('div', _hoisted_36, [
                    m[63] ||
                      (m[63] = createBaseVNode('strong', null, 'API', -1)),
                    createBaseVNode('p', null, toDisplayString(R.value.api), 1),
                  ]),
                ]),
                createBaseVNode('div', _hoisted_37, [
                  createBaseVNode('div', _hoisted_38, [
                    createBaseVNode('div', null, [
                      createBaseVNode(
                        'span',
                        _hoisted_39,
                        toDisplayString(z.value.icon),
                        1,
                      ),
                      createBaseVNode('div', null, [
                        createBaseVNode(
                          'span',
                          _hoisted_40,
                          toDisplayString(R.value.active),
                          1,
                        ),
                        createBaseVNode(
                          'h3',
                          null,
                          toDisplayString(z.value.title[s.value]),
                          1,
                        ),
                      ]),
                    ]),
                    createBaseVNode('span', _hoisted_41, [
                      m[64] || (m[64] = createBaseVNode('i', null, null, -1)),
                      createTextVNode(toDisplayString(R.value.ready), 1),
                    ]),
                  ]),
                  createBaseVNode(
                    'div',
                    { class: 'picker-wrap', dir: z.value.direction },
                    [
                      (openBlock(),
                      createBlock(
                        DatePicker,
                        {
                          key: `${n.value}-${i.value}-${a.value}-${o.value}-${s.value}-${V.value}-${L.value}-${G.value}`,
                          modelValue: l.value,
                          'onUpdate:modelValue':
                            m[28] || (m[28] = (D) => (l.value = D)),
                          calendar: n.value,
                          format:
                            n.value === 'jalali' ? 'jYYYY/jMM/jDD' : void 0,
                          'input-format': V.value || void 0,
                          'input-mask': L.value || void 0,
                          'display-format': G.value || void 0,
                          'hijri-provider': i.value,
                          mode: a.value,
                          type: o.value,
                          locale: B.value || re(n.value),
                          column: J.value,
                          from: P.value || z.value.from,
                          to: E.value || z.value.to,
                          'week-starts-on': Y.value,
                          'weekend-days': I.value.length ? I.value : void 0,
                          color: M.value,
                          'click-on': ue.value,
                          'minute-step': ne.value,
                          'hour-step': ie.value,
                          'icon-inside': Q.value,
                          'dual-input': te.value,
                          'auto-submit': se.value,
                          clearable: X.value,
                          label: `${R.value.active} ${z.value.title[s.value]}`,
                        },
                        null,
                        8,
                        [
                          'modelValue',
                          'calendar',
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
                          'label',
                        ],
                      )),
                    ],
                    8,
                    _hoisted_42,
                  ),
                  createBaseVNode('div', _hoisted_43, [
                    createBaseVNode(
                      'span',
                      null,
                      toDisplayString(R.value.value),
                      1,
                    ),
                    createBaseVNode(
                      'code',
                      null,
                      toDisplayString(l.value || '—'),
                      1,
                    ),
                  ]),
                  createBaseVNode(
                    'p',
                    _hoisted_44,
                    toDisplayString(R.value.liveHint),
                    1,
                  ),
                  createBaseVNode('div', _hoisted_45, [
                    m[65] || (m[65] = createBaseVNode('h4', null, 'HTML', -1)),
                    createBaseVNode('pre', null, [
                      createBaseVNode(
                        'code',
                        null,
                        toDisplayString(Z.value),
                        1,
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ]),
            createBaseVNode('section', _hoisted_46, [
              createBaseVNode('div', _hoisted_47, [
                createBaseVNode('div', null, [
                  m[66] ||
                    (m[66] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'CALENDAR GALLERY',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    _hoisted_48,
                    toDisplayString(R.value.gallery),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'p',
                  null,
                  toDisplayString(R.value.galleryHint),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_49, [
                (openBlock(),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(t, (D) =>
                    createBaseVNode(
                      'article',
                      { key: D.id, class: 'calendar-card', dir: D.direction },
                      [
                        createBaseVNode('div', _hoisted_51, [
                          createBaseVNode('div', _hoisted_52, [
                            createBaseVNode(
                              'span',
                              _hoisted_53,
                              toDisplayString(D.icon),
                              1,
                            ),
                            createBaseVNode('div', null, [
                              createBaseVNode(
                                'h3',
                                null,
                                toDisplayString(D.title[s.value]),
                                1,
                              ),
                              createBaseVNode(
                                'p',
                                null,
                                toDisplayString(D.subtitle),
                                1,
                              ),
                            ]),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_54, [
                          (openBlock(),
                          createBlock(
                            DatePicker,
                            {
                              key: `${D.id}-${s.value}`,
                              modelValue: c[D.id],
                              'onUpdate:modelValue': (u) => (c[D.id] = u),
                              calendar: D.id,
                              from: D.from,
                              to: D.to,
                              'hijri-provider': i.value,
                              locale: re(D.id),
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
                        createBaseVNode('div', _hoisted_55, [
                          createBaseVNode('div', _hoisted_56, [
                            createBaseVNode(
                              'span',
                              null,
                              toDisplayString(R.value.output),
                              1,
                            ),
                            createBaseVNode(
                              'code',
                              null,
                              toDisplayString(D.sample),
                              1,
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: (u) => ye(ae(D)),
                            },
                            toDisplayString(R.value.code) + ' · HTML ',
                            9,
                            _hoisted_57,
                          ),
                        ]),
                      ],
                      8,
                      _hoisted_50,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            createBaseVNode('section', _hoisted_58, [
              createBaseVNode('div', _hoisted_59, [
                createBaseVNode('div', null, [
                  m[67] ||
                    (m[67] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'TIME & RANGE',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    null,
                    toDisplayString(R.value.timeSamples),
                    1,
                  ),
                ]),
              ]),
              createBaseVNode('div', _hoisted_60, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    he.value,
                    (D) => (
                      openBlock(),
                      createElementBlock(
                        'article',
                        { key: D.title, class: 'calendar-card' },
                        [
                          createBaseVNode('div', _hoisted_61, [
                            createBaseVNode('div', _hoisted_62, [
                              createBaseVNode(
                                'span',
                                _hoisted_63,
                                toDisplayString(D.icon),
                                1,
                              ),
                              createBaseVNode('div', null, [
                                createBaseVNode(
                                  'h3',
                                  null,
                                  toDisplayString(D.title),
                                  1,
                                ),
                                createBaseVNode(
                                  'p',
                                  null,
                                  toDisplayString(
                                    D.mode === 'range'
                                      ? R.value.range
                                      : R.value.single,
                                  ),
                                  1,
                                ),
                              ]),
                            ]),
                          ]),
                          createBaseVNode('div', _hoisted_64, [
                            createVNode(
                              DatePicker,
                              {
                                type: D.type,
                                mode: D.mode,
                                'model-value': D.value,
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
                              onClick: (u) => ye(ae(z.value, D.type, D.mode)),
                            },
                            toDisplayString(R.value.code),
                            9,
                            _hoisted_65,
                          ),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            createBaseVNode('footer', _hoisted_66, [
              createBaseVNode('span', null, toDisplayString(R.value.title), 1),
              m[68] ||
                (m[68] = createBaseVNode(
                  'code',
                  null,
                  '@h-sanadgol/vue3-multi-calendar-datepicker',
                  -1,
                )),
            ]),
            h.value
              ? (openBlock(),
                createElementBlock(
                  'div',
                  {
                    key: 0,
                    class: 'code-modal-backdrop',
                    role: 'presentation',
                    onClick:
                      m[31] ||
                      (m[31] = withModifiers(
                        (D) => (h.value = null),
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
                        'aria-label': h.value.title,
                      },
                      [
                        createBaseVNode('div', _hoisted_68, [
                          createBaseVNode('div', null, [
                            m[69] ||
                              (m[69] = createBaseVNode(
                                'span',
                                { class: 'section-kicker' },
                                'CODE SAMPLE',
                                -1,
                              )),
                            createBaseVNode(
                              'h2',
                              null,
                              toDisplayString(h.value.title),
                              1,
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'modal-close',
                              type: 'button',
                              'aria-label': R.value.close,
                              onClick:
                                m[29] || (m[29] = (D) => (h.value = null)),
                            },
                            ' × ',
                            8,
                            _hoisted_69,
                          ),
                        ]),
                        createBaseVNode('div', _hoisted_70, [
                          createBaseVNode('div', null, [
                            m[70] ||
                              (m[70] = createBaseVNode('h3', null, 'HTML', -1)),
                            createBaseVNode('pre', null, [
                              createBaseVNode(
                                'code',
                                null,
                                toDisplayString(h.value.html),
                                1,
                              ),
                            ]),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_71, [
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: de,
                            },
                            toDisplayString(
                              w.value ? R.value.copied : R.value.copy,
                            ),
                            1,
                          ),
                          createBaseVNode(
                            'button',
                            {
                              class: 'reset-button',
                              type: 'button',
                              onClick:
                                m[30] || (m[30] = (D) => (h.value = null)),
                            },
                            toDisplayString(R.value.close),
                            1,
                          ),
                        ]),
                      ],
                      8,
                      _hoisted_67,
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
