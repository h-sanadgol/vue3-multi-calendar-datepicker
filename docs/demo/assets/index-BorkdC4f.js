(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === 'childList')
        for (const o of i.addedNodes)
          o.tagName === 'LINK' && o.rel === 'modulepreload' && s(o);
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
/**
 * @vue/shared v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function makeMap(e) {
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
  styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(e) {
  const t = {};
  return (
    e
      .replace(styleCommentRE, '')
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
    'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
  isSpecialBooleanAttr = makeMap(specialBooleanAttrs);
function includeBooleanAttr(e) {
  return !!e || e === '';
}
function looseCompareArrays(e, t) {
  if (e.length !== t.length) return !1;
  let r = !0;
  for (let s = 0; r && s < e.length; s++) r = looseEqual(e[s], t[s]);
  return r;
}
function looseEqual(e, t) {
  if (e === t) return !0;
  let r = isDate(e),
    s = isDate(t);
  if (r || s) return r && s ? e.getTime() === t.getTime() : !1;
  if (((r = isSymbol(e)), (s = isSymbol(t)), r || s)) return e === t;
  if (((r = isArray(e)), (s = isArray(t)), r || s))
    return r && s ? looseCompareArrays(e, t) : !1;
  if (((r = isObject(e)), (s = isObject(t)), r || s)) {
    if (!r || !s) return !1;
    const n = Object.keys(e).length,
      i = Object.keys(t).length;
    if (n !== i) return !1;
    for (const o in e) {
      const a = e.hasOwnProperty(o),
        l = t.hasOwnProperty(o);
      if ((a && !l) || (!a && l) || !looseEqual(e[o], t[o])) return !1;
    }
  }
  return String(e) === String(t);
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
/**
 * @vue/reactivity v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let activeEffectScope;
class EffectScope {
  constructor(t = !1) {
    ((this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = activeEffectScope),
      !t &&
        activeEffectScope &&
        (this.index =
          (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
            this,
          ) - 1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, r;
      if (this.scopes)
        for (t = 0, r = this.scopes.length; t < r; t++) this.scopes[t].pause();
      for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, r;
      if (this.scopes)
        for (t = 0, r = this.scopes.length; t < r; t++) this.scopes[t].resume();
      for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].resume();
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
    this._on > 0 &&
      --this._on === 0 &&
      ((activeEffectScope = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let r, s;
      for (r = 0, s = this.effects.length; r < s; r++) this.effects[r].stop();
      for (this.effects.length = 0, r = 0, s = this.cleanups.length; r < s; r++)
        this.cleanups[r]();
      if (((this.cleanups.length = 0), this.scopes)) {
        for (r = 0, s = this.scopes.length; r < s; r++) this.scopes[r].stop(!0);
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
        activeEffectScope.active &&
        activeEffectScope.effects.push(this));
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
  const o = targetMap.get(e);
  if (!o) {
    globalVersion++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if ((startBatch(), t === 'clear')) o.forEach(a);
  else {
    const l = isArray(e),
      d = l && isIntegerKey(r);
    if (l && r === 'length') {
      const c = Number(s);
      o.forEach((f, w) => {
        (w === 'length' ||
          w === ARRAY_ITERATE_KEY ||
          (!isSymbol(w) && w >= c)) &&
          a(f);
      });
    } else
      switch (
        ((r !== void 0 || o.has(void 0)) && a(o.get(r)),
        d && a(o.get(ARRAY_ITERATE_KEY)),
        t)
      ) {
        case 'add':
          l
            ? d && a(o.get('length'))
            : (a(o.get(ITERATE_KEY)),
              isMap(e) && a(o.get(MAP_KEY_ITERATE_KEY)));
          break;
        case 'delete':
          l ||
            (a(o.get(ITERATE_KEY)), isMap(e) && a(o.get(MAP_KEY_ITERATE_KEY)));
          break;
        case 'set':
          isMap(e) && a(o.get(ITERATE_KEY));
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
  return t === e
    ? t
    : (track(t, 'iterate', ARRAY_ITERATE_KEY),
      isShallow(e) ? t : t.map(toReactive));
}
function shallowReadArray(e) {
  return (track((e = toRaw(e)), 'iterate', ARRAY_ITERATE_KEY), e);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive);
  },
  concat(...e) {
    return reactiveReadArray(this).concat(
      ...e.map((t) => (isArray(t) ? reactiveReadArray(t) : t)),
    );
  },
  entries() {
    return iterator(this, 'entries', (e) => ((e[1] = toReactive(e[1])), e));
  },
  every(e, t) {
    return apply(this, 'every', e, t, void 0, arguments);
  },
  filter(e, t) {
    return apply(this, 'filter', e, t, (r) => r.map(toReactive), arguments);
  },
  find(e, t) {
    return apply(this, 'find', e, t, toReactive, arguments);
  },
  findIndex(e, t) {
    return apply(this, 'findIndex', e, t, void 0, arguments);
  },
  findLast(e, t) {
    return apply(this, 'findLast', e, t, toReactive, arguments);
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
    return iterator(this, 'values', toReactive);
  },
};
function iterator(e, t, r) {
  const s = shallowReadArray(e),
    n = s[t]();
  return (
    s !== e &&
      !isShallow(e) &&
      ((n._next = n.next),
      (n.next = () => {
        const i = n._next();
        return (i.done || (i.value = r(i.value)), i);
      })),
    n
  );
}
const arrayProto = Array.prototype;
function apply(e, t, r, s, n, i) {
  const o = shallowReadArray(e),
    a = o !== e && !isShallow(e),
    l = o[t];
  if (l !== arrayProto[t]) {
    const f = l.apply(e, i);
    return a ? toReactive(f) : f;
  }
  let d = r;
  o !== e &&
    (a
      ? (d = function (f, w) {
          return r.call(this, toReactive(f), w, e);
        })
      : r.length > 2 &&
        (d = function (f, w) {
          return r.call(this, f, w, e);
        }));
  const c = l.call(o, d, s);
  return a && n ? n(c) : c;
}
function reduce(e, t, r, s) {
  const n = shallowReadArray(e);
  let i = r;
  return (
    n !== e &&
      (isShallow(e)
        ? r.length > 3 &&
          (i = function (o, a, l) {
            return r.call(this, o, a, l, e);
          })
        : (i = function (o, a, l) {
            return r.call(this, o, toReactive(a), l, e);
          })),
    n[t](i, ...s)
  );
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
    const o = isArray(t);
    if (!n) {
      let l;
      if (o && (l = arrayInstrumentations[r])) return l;
      if (r === 'hasOwnProperty') return hasOwnProperty;
    }
    const a = Reflect.get(t, r, isRef(t) ? t : s);
    if (
      (isSymbol(r) ? builtInSymbols.has(r) : isNonTrackableKeys(r)) ||
      (n || track(t, 'get', r), i)
    )
      return a;
    if (isRef(a)) {
      const l = o && isIntegerKey(r) ? a : a.value;
      return n && isObject(l) ? readonly(l) : l;
    }
    return isObject(a) ? (n ? readonly(a) : reactive(a)) : a;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, r, s, n) {
    let i = t[r];
    if (!this._isShallow) {
      const l = isReadonly(i);
      if (
        (!isShallow(s) && !isReadonly(s) && ((i = toRaw(i)), (s = toRaw(s))),
        !isArray(t) && isRef(i) && !isRef(s))
      )
        return (l || (i.value = s), !0);
    }
    const o =
        isArray(t) && isIntegerKey(r) ? Number(r) < t.length : hasOwn(t, r),
      a = Reflect.set(t, r, s, isRef(t) ? t : n);
    return (
      t === toRaw(n) &&
        (o
          ? hasChanged(s, i) && trigger(t, 'set', r, s)
          : trigger(t, 'add', r, s)),
      a
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
      o = isMap(i),
      a = e === 'entries' || (e === Symbol.iterator && o),
      l = e === 'keys' && o,
      d = n[e](...s),
      c = r ? toShallow : t ? toReadonly : toReactive;
    return (
      !t && track(i, 'iterate', l ? MAP_KEY_ITERATE_KEY : ITERATE_KEY),
      {
        next() {
          const { value: f, done: w } = d.next();
          return w
            ? { value: f, done: w }
            : { value: a ? [c(f[0]), c(f[1])] : c(f), done: w };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
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
        o = toRaw(i),
        a = toRaw(n);
      e || (hasChanged(n, a) && track(o, 'get', n), track(o, 'get', a));
      const { has: l } = getProto(o),
        d = t ? toShallow : e ? toReadonly : toReactive;
      if (l.call(o, n)) return d(i.get(n));
      if (l.call(o, a)) return d(i.get(a));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return (!e && track(toRaw(n), 'iterate', ITERATE_KEY), n.size);
    },
    has(n) {
      const i = this.__v_raw,
        o = toRaw(i),
        a = toRaw(n);
      return (
        e || (hasChanged(n, a) && track(o, 'has', n), track(o, 'has', a)),
        n === a ? i.has(n) : i.has(n) || i.has(a)
      );
    },
    forEach(n, i) {
      const o = this,
        a = o.__v_raw,
        l = toRaw(a),
        d = t ? toShallow : e ? toReadonly : toReactive;
      return (
        !e && track(l, 'iterate', ITERATE_KEY),
        a.forEach((c, f) => n.call(i, d(c), d(f), o))
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
              !t && !isShallow(n) && !isReadonly(n) && (n = toRaw(n));
              const i = toRaw(this);
              return (
                getProto(i).has.call(i, n) ||
                  (i.add(n), trigger(i, 'add', n, n)),
                this
              );
            },
            set(n, i) {
              !t && !isShallow(i) && !isReadonly(i) && (i = toRaw(i));
              const o = toRaw(this),
                { has: a, get: l } = getProto(o);
              let d = a.call(o, n);
              d || ((n = toRaw(n)), (d = a.call(o, n)));
              const c = l.call(o, n);
              return (
                o.set(n, i),
                d
                  ? hasChanged(i, c) && trigger(o, 'set', n, i)
                  : trigger(o, 'add', n, i),
                this
              );
            },
            delete(n) {
              const i = toRaw(this),
                { has: o, get: a } = getProto(i);
              let l = o.call(i, n);
              (l || ((n = toRaw(n)), (l = o.call(i, n))), a && a.call(i, n));
              const d = i.delete(n);
              return (l && trigger(i, 'delete', n, void 0), d);
            },
            clear() {
              const n = toRaw(this),
                i = n.size !== 0,
                o = n.clear();
              return (i && trigger(n, 'clear', void 0, void 0), o);
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
function getTargetType(e) {
  return e.__v_skip || !Object.isExtensible(e)
    ? 0
    : targetTypeMap(toRawType(e));
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
  if (!isObject(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const i = getTargetType(e);
  if (i === 0) return e;
  const o = n.get(e);
  if (o) return o;
  const a = new Proxy(e, i === 2 ? s : r);
  return (n.set(e, a), a);
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
      (this._key = r),
      (this._defaultValue = s),
      (this.__v_isRef = !0),
      (this._value = void 0));
  }
  get value() {
    const t = this._object[this._key];
    return (this._value = t === void 0 ? this._defaultValue : t);
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
function propertyToRef(e, t, r) {
  const s = e[t];
  return isRef(s) ? s : new ObjectRefImpl(e, t, r);
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
      scheduler: o,
      augmentJob: a,
      call: l,
    } = r,
    d = (V) =>
      n
        ? V
        : isShallow(V) || n === !1 || n === 0
          ? traverse(V, 1)
          : traverse(V);
  let c,
    f,
    w,
    k,
    N = !1,
    R = !1;
  if (
    (isRef(e)
      ? ((f = () => e.value), (N = isShallow(e)))
      : isReactive(e)
        ? ((f = () => d(e)), (N = !0))
        : isArray(e)
          ? ((R = !0),
            (N = e.some((V) => isReactive(V) || isShallow(V))),
            (f = () =>
              e.map((V) => {
                if (isRef(V)) return V.value;
                if (isReactive(V)) return d(V);
                if (isFunction(V)) return l ? l(V, 2) : V();
              })))
          : isFunction(e)
            ? t
              ? (f = l ? () => l(e, 2) : e)
              : (f = () => {
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
                    return l ? l(e, 3, [k]) : e(k);
                  } finally {
                    activeWatcher = V;
                  }
                })
            : (f = NOOP),
    t && n)
  ) {
    const V = f,
      Y = n === !0 ? 1 / 0 : n;
    f = () => traverse(V(), Y);
  }
  const K = getCurrentScope(),
    O = () => {
      (c.stop(), K && K.active && remove(K.effects, c));
    };
  if (i && t) {
    const V = t;
    t = (...Y) => {
      (V(...Y), O());
    };
  }
  let j = R
    ? new Array(e.length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE;
  const W = (V) => {
    if (!(!(c.flags & 1) || (!c.dirty && !V)))
      if (t) {
        const Y = c.run();
        if (
          n ||
          N ||
          (R ? Y.some((G, U) => hasChanged(G, j[U])) : hasChanged(Y, j))
        ) {
          w && w();
          const G = activeWatcher;
          activeWatcher = c;
          try {
            const U = [
              Y,
              j === INITIAL_WATCHER_VALUE
                ? void 0
                : R && j[0] === INITIAL_WATCHER_VALUE
                  ? []
                  : j,
              k,
            ];
            ((j = Y), l ? l(t, 3, U) : t(...U));
          } finally {
            activeWatcher = G;
          }
        }
      } else c.run();
  };
  return (
    a && a(W),
    (c = new ReactiveEffect(f)),
    (c.scheduler = o ? () => o(W, !1) : W),
    (k = (V) => onWatcherCleanup(V, !1, c)),
    (w = c.onStop =
      () => {
        const V = cleanupMap.get(c);
        if (V) {
          if (l) l(V, 4);
          else for (const Y of V) Y();
          cleanupMap.delete(c);
        }
      }),
    t ? (s ? W(!0) : (j = c.run())) : o ? o(W.bind(null, !0), !0) : c.run(),
    (O.pause = c.pause.bind(c)),
    (O.resume = c.resume.bind(c)),
    (O.stop = O),
    O
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
/**
 * @vue/runtime-core v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const stack = [];
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
            var o, a;
            return (a = (o = i.toString) == null ? void 0 : o.call(i)) != null
              ? a
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
    { errorHandler: i, throwUnhandledErrorInProduction: o } =
      (t && t.appContext.config) || EMPTY_OBJ;
  if (t) {
    let a = t.parent;
    const l = t.proxy,
      d = `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; a; ) {
      const c = a.ec;
      if (c) {
        for (let f = 0; f < c.length; f++) if (c[f](e, l, d) === !1) return;
      }
      a = a.parent;
    }
    if (i) {
      (pauseTracking(),
        callWithErrorHandling(i, null, 10, [e, l, d]),
        resetTracking());
      return;
    }
  }
  logError(e, r, n, s, o);
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
  (isArray(e)
    ? pendingPostFlushCbs.push(...e)
    : activePostFlushCbs && e.id === -1
      ? activePostFlushCbs.splice(postFlushIndex + 1, 0, e)
      : e.flags & 1 || (pendingPostFlushCbs.push(e), (e.flags |= 1)),
    queueFlush());
}
function flushPreFlushCbs(e, t, r = flushIndex + 1) {
  for (; r < queue.length; r++) {
    const s = queue[r];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid) continue;
      (queue.splice(r, 1),
        r--,
        s.flags & 4 && (s.flags &= -2),
        s(),
        s.flags & 4 || (s.flags &= -2));
    }
  }
}
function flushPostFlushCbs(e) {
  if (pendingPostFlushCbs.length) {
    const t = [...new Set(pendingPostFlushCbs)].sort(
      (r, s) => getId(r) - getId(s),
    );
    if (((pendingPostFlushCbs.length = 0), activePostFlushCbs)) {
      activePostFlushCbs.push(...t);
      return;
    }
    for (
      activePostFlushCbs = t, postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      const r = activePostFlushCbs[postFlushIndex];
      (r.flags & 4 && (r.flags &= -2), r.flags & 8 || r(), (r.flags &= -2));
    }
    ((activePostFlushCbs = null), (postFlushIndex = 0));
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
    const i = setCurrentRenderingInstance(t);
    let o;
    try {
      o = e(...n);
    } finally {
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
    let [i, o, a, l = EMPTY_OBJ] = t[n];
    i &&
      (isFunction(i) && (i = { mounted: i, updated: i }),
      i.deep && traverse(o),
      s.push({
        dir: i,
        instance: r,
        value: o,
        oldValue: void 0,
        arg: a,
        modifiers: l,
      }));
  }
  return e;
}
function invokeDirectiveHook(e, t, r, s) {
  const n = e.dirs,
    i = t && t.dirs;
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    i && (a.oldValue = i[o].value);
    let l = a.dir[s];
    l &&
      (pauseTracking(),
      callWithAsyncErrorHandling(l, r, 8, [e.el, a, e, t]),
      resetTracking());
  }
}
const TeleportEndKey = Symbol('_vte'),
  isTeleport = (e) => e.__isTeleport,
  leaveCbKey = Symbol('_leaveCb');
function setTransitionHooks(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), setTransitionHooks(e.component.subTree, t))
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)),
        (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t);
}
function defineComponent(e, t) {
  return isFunction(e) ? extend({ name: e.name }, t, { setup: e }) : e;
}
function markAsyncBoundary(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + '-', 0, 0];
}
const pendingSetRefMap = new WeakMap();
function setRef(e, t, r, s, n = !1) {
  if (isArray(e)) {
    e.forEach((N, R) => setRef(N, t && (isArray(t) ? t[R] : t), r, s, n));
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
    o = n ? null : i,
    { i: a, r: l } = e,
    d = t && t.r,
    c = a.refs === EMPTY_OBJ ? (a.refs = {}) : a.refs,
    f = a.setupState,
    w = toRaw(f),
    k = f === EMPTY_OBJ ? NO : (N) => hasOwn(w, N);
  if (d != null && d !== l) {
    if ((invalidatePendingSetRef(t), isString(d)))
      ((c[d] = null), k(d) && (f[d] = null));
    else if (isRef(d)) {
      d.value = null;
      const N = t;
      N.k && (c[N.k] = null);
    }
  }
  if (isFunction(l)) callWithErrorHandling(l, a, 12, [o, c]);
  else {
    const N = isString(l),
      R = isRef(l);
    if (N || R) {
      const K = () => {
        if (e.f) {
          const O = N ? (k(l) ? f[l] : c[l]) : l.value;
          if (n) isArray(O) && remove(O, i);
          else if (isArray(O)) O.includes(i) || O.push(i);
          else if (N) ((c[l] = [i]), k(l) && (f[l] = c[l]));
          else {
            const j = [i];
            ((l.value = j), e.k && (c[e.k] = j));
          }
        } else
          N
            ? ((c[l] = o), k(l) && (f[l] = o))
            : R && ((l.value = o), e.k && (c[e.k] = o));
      };
      if (o) {
        const O = () => {
          (K(), pendingSetRefMap.delete(e));
        };
        ((O.id = -1), pendingSetRefMap.set(e, O), queuePostRenderEffect(O, r));
      } else (invalidatePendingSetRef(e), K());
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
        (t.__weh = (...o) => {
          pauseTracking();
          const a = setCurrentInstance(r),
            l = callWithAsyncErrorHandling(t, r, e, o);
          return (a(), resetTracking(), l);
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
      const a = getComponentName(i, !1);
      if (a && (a === t || a === camelize(t) || a === capitalize(camelize(t))))
        return i;
    }
    const o = resolve(n[e] || i[e], t) || resolve(n.appContext[e], t);
    return !o && s ? i : o;
  }
}
function resolve(e, t) {
  return e && (e[t] || e[camelize(t)] || e[capitalize(camelize(t))]);
}
function renderList(e, t, r, s) {
  let n;
  const i = r,
    o = isArray(e);
  if (o || isString(e)) {
    const a = o && isReactive(e);
    let l = !1,
      d = !1;
    (a && ((l = !isShallow(e)), (d = isReadonly(e)), (e = shallowReadArray(e))),
      (n = new Array(e.length)));
    for (let c = 0, f = e.length; c < f; c++)
      n[c] = t(
        l ? (d ? toReadonly(toReactive(e[c])) : toReactive(e[c])) : e[c],
        c,
        void 0,
        i,
      );
  } else if (typeof e == 'number') {
    n = new Array(e);
    for (let a = 0; a < e; a++) n[a] = t(a + 1, a, void 0, i);
  } else if (isObject(e))
    if (e[Symbol.iterator]) n = Array.from(e, (a, l) => t(a, l, void 0, i));
    else {
      const a = Object.keys(e);
      n = new Array(a.length);
      for (let l = 0, d = a.length; l < d; l++) {
        const c = a[l];
        n[l] = t(e[c], c, l, i);
      }
    }
  else n = [];
  return n;
}
function renderSlot(e, t, r = {}, s, n) {
  if (
    currentRenderingInstance.ce ||
    (currentRenderingInstance.parent &&
      isAsyncWrapper(currentRenderingInstance.parent) &&
      currentRenderingInstance.parent.ce)
  ) {
    const d = Object.keys(r).length > 0;
    return (
      t !== 'default' && (r.name = t),
      openBlock(),
      createBlock(
        Fragment,
        null,
        [createVNode('slot', r, s && s())],
        d ? -2 : 64,
      )
    );
  }
  let i = e[t];
  (i && i._c && (i._d = !1), openBlock());
  const o = i && ensureValidVNode(i(r)),
    a = r.key || (o && o.key),
    l = createBlock(
      Fragment,
      { key: (a && !isSymbol(a) ? a : `_${t}`) + (!o && s ? '_fb' : '') },
      o || (s ? s() : []),
      o && e._ === 1 ? 64 : -2,
    );
  return (
    l.scopeId && (l.slotScopeIds = [l.scopeId + '-s']),
    i && i._c && (i._d = !0),
    l
  );
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
        accessCache: o,
        type: a,
        appContext: l,
      } = e;
      let d;
      if (t[0] !== '$') {
        const k = o[t];
        if (k !== void 0)
          switch (k) {
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
          if (hasSetupBinding(s, t)) return ((o[t] = 1), s[t]);
          if (n !== EMPTY_OBJ && hasOwn(n, t)) return ((o[t] = 2), n[t]);
          if ((d = e.propsOptions[0]) && hasOwn(d, t))
            return ((o[t] = 3), i[t]);
          if (r !== EMPTY_OBJ && hasOwn(r, t)) return ((o[t] = 4), r[t]);
          shouldCacheAccess && (o[t] = 0);
        }
      }
      const c = publicPropertiesMap[t];
      let f, w;
      if (c) return (t === '$attrs' && track(e.attrs, 'get', ''), c(e));
      if ((f = a.__cssModules) && (f = f[t])) return f;
      if (r !== EMPTY_OBJ && hasOwn(r, t)) return ((o[t] = 4), r[t]);
      if (((w = l.config.globalProperties), hasOwn(w, t))) return w[t];
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
          propsOptions: i,
          type: o,
        },
      },
      a,
    ) {
      let l, d;
      return !!(
        r[a] ||
        (e !== EMPTY_OBJ && a[0] !== '$' && hasOwn(e, a)) ||
        hasSetupBinding(t, a) ||
        ((l = i[0]) && hasOwn(l, a)) ||
        hasOwn(s, a) ||
        hasOwn(publicPropertiesMap, a) ||
        hasOwn(n.config.globalProperties, a) ||
        ((d = o.__cssModules) && d[a])
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
    methods: o,
    watch: a,
    provide: l,
    inject: d,
    created: c,
    beforeMount: f,
    mounted: w,
    beforeUpdate: k,
    updated: N,
    activated: R,
    deactivated: K,
    beforeDestroy: O,
    beforeUnmount: j,
    destroyed: W,
    unmounted: V,
    render: Y,
    renderTracked: G,
    renderTriggered: U,
    errorCaptured: J,
    serverPrefetch: se,
    expose: Z,
    inheritAttrs: re,
    components: P,
    directives: q,
    filters: de,
  } = t;
  if ((d && resolveInjections(d, s, null), o))
    for (const L in o) {
      const x = o[L];
      isFunction(x) && (s[L] = x.bind(r));
    }
  if (n) {
    const L = n.call(r, r);
    isObject(L) && (e.data = reactive(L));
  }
  if (((shouldCacheAccess = !0), i))
    for (const L in i) {
      const x = i[L],
        ae = isFunction(x)
          ? x.bind(r, r)
          : isFunction(x.get)
            ? x.get.bind(r, r)
            : NOOP,
        ce = !isFunction(x) && isFunction(x.set) ? x.set.bind(r) : NOOP,
        le = computed({ get: ae, set: ce });
      Object.defineProperty(s, L, {
        enumerable: !0,
        configurable: !0,
        get: () => le.value,
        set: (ee) => (le.value = ee),
      });
    }
  if (a) for (const L in a) createWatcher(a[L], s, r, L);
  if (l) {
    const L = isFunction(l) ? l.call(r) : l;
    Reflect.ownKeys(L).forEach((x) => {
      provide(x, L[x]);
    });
  }
  c && callHook(c, e, 'c');
  function z(L, x) {
    isArray(x) ? x.forEach((ae) => L(ae.bind(r))) : x && L(x.bind(r));
  }
  if (
    (z(onBeforeMount, f),
    z(onMounted, w),
    z(onBeforeUpdate, k),
    z(onUpdated, N),
    z(onActivated, R),
    z(onDeactivated, K),
    z(onErrorCaptured, J),
    z(onRenderTracked, G),
    z(onRenderTriggered, U),
    z(onBeforeUnmount, j),
    z(onUnmounted, V),
    z(onServerPrefetch, se),
    isArray(Z))
  )
    if (Z.length) {
      const L = e.exposed || (e.exposed = {});
      Z.forEach((x) => {
        Object.defineProperty(L, x, {
          get: () => r[x],
          set: (ae) => (r[x] = ae),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  (Y && e.render === NOOP && (e.render = Y),
    re != null && (e.inheritAttrs = re),
    P && (e.components = P),
    q && (e.directives = q),
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
            set: (o) => (i.value = o),
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
      config: { optionMergeStrategies: o },
    } = e.appContext,
    a = i.get(t);
  let l;
  return (
    a
      ? (l = a)
      : !n.length && !r && !s
        ? (l = t)
        : ((l = {}),
          n.length && n.forEach((d) => mergeOptions(l, d, o, !0)),
          mergeOptions(l, t, o)),
    isObject(t) && i.set(t, l),
    l
  );
}
function mergeOptions(e, t, r, s = !1) {
  const { mixins: n, extends: i } = t;
  (i && mergeOptions(e, i, r, !0),
    n && n.forEach((o) => mergeOptions(e, o, r, !0)));
  for (const o in t)
    if (!(s && o === 'expose')) {
      const a = internalOptionMergeStrats[o] || (r && r[o]);
      e[o] = a ? a(e[o], t[o]) : t[o];
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
      o = new WeakSet(),
      a = [];
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
      use(c, ...f) {
        return (
          o.has(c) ||
            (c && isFunction(c.install)
              ? (o.add(c), c.install(d, ...f))
              : isFunction(c) && (o.add(c), c(d, ...f))),
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
      mount(c, f, w) {
        if (!l) {
          const k = d._ceVNode || createVNode(s, n);
          return (
            (k.appContext = i),
            w === !0 ? (w = 'svg') : w === !1 && (w = void 0),
            e(k, c, w),
            (l = !0),
            (d._container = c),
            (c.__vue_app__ = d),
            getComponentPublicInstance(k.component)
          );
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        l &&
          (callWithAsyncErrorHandling(a, d._instance, 16),
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
const internalObjectProto = {},
  createInternalObject = () => Object.create(internalObjectProto),
  isInternalObject = (e) => Object.getPrototypeOf(e) === internalObjectProto;
function initProps(e, t, r, s = !1) {
  const n = {},
    i = createInternalObject();
  ((e.propsDefaults = Object.create(null)), setFullProps(e, t, n, i));
  for (const o in e.propsOptions[0]) o in n || (n[o] = void 0);
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
      vnode: { patchFlag: o },
    } = e,
    a = toRaw(n),
    [l] = e.propsOptions;
  let d = !1;
  if ((s || o > 0) && !(o & 16)) {
    if (o & 8) {
      const c = e.vnode.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        let w = c[f];
        if (isEmitListener(e.emitsOptions, w)) continue;
        const k = t[w];
        if (l)
          if (hasOwn(i, w)) k !== i[w] && ((i[w] = k), (d = !0));
          else {
            const N = camelize(w);
            n[N] = resolvePropValue(l, a, N, k, e, !1);
          }
        else k !== i[w] && ((i[w] = k), (d = !0));
      }
    }
  } else {
    setFullProps(e, t, n, i) && (d = !0);
    let c;
    for (const f in a)
      (!t || (!hasOwn(t, f) && ((c = hyphenate(f)) === f || !hasOwn(t, c)))) &&
        (l
          ? r &&
            (r[f] !== void 0 || r[c] !== void 0) &&
            (n[f] = resolvePropValue(l, a, f, void 0, e, !0))
          : delete n[f]);
    if (i !== a)
      for (const f in i) (!t || !hasOwn(t, f)) && (delete i[f], (d = !0));
  }
  d && trigger(e.attrs, 'set', '');
}
function setFullProps(e, t, r, s) {
  const [n, i] = e.propsOptions;
  let o = !1,
    a;
  if (t)
    for (let l in t) {
      if (isReservedProp(l)) continue;
      const d = t[l];
      let c;
      n && hasOwn(n, (c = camelize(l)))
        ? !i || !i.includes(c)
          ? (r[c] = d)
          : ((a || (a = {}))[c] = d)
        : isEmitListener(e.emitsOptions, l) ||
          ((!(l in s) || d !== s[l]) && ((s[l] = d), (o = !0)));
    }
  if (i) {
    const l = toRaw(r),
      d = a || EMPTY_OBJ;
    for (let c = 0; c < i.length; c++) {
      const f = i[c];
      r[f] = resolvePropValue(n, l, f, d[f], e, !hasOwn(d, f));
    }
  }
  return o;
}
function resolvePropValue(e, t, r, s, n, i) {
  const o = e[r];
  if (o != null) {
    const a = hasOwn(o, 'default');
    if (a && s === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && isFunction(l)) {
        const { propsDefaults: d } = n;
        if (r in d) s = d[r];
        else {
          const c = setCurrentInstance(n);
          ((s = d[r] = l.call(null, t)), c());
        }
      } else s = l;
      n.ce && n.ce._setProp(r, s);
    }
    o[0] &&
      (i && !a
        ? (s = !1)
        : o[1] && (s === '' || s === hyphenate(r)) && (s = !0));
  }
  return s;
}
const mixinPropsCache = new WeakMap();
function normalizePropsOptions(e, t, r = !1) {
  const s = r ? mixinPropsCache : t.propsCache,
    n = s.get(e);
  if (n) return n;
  const i = e.props,
    o = {},
    a = [];
  let l = !1;
  if (!isFunction(e)) {
    const c = (f) => {
      l = !0;
      const [w, k] = normalizePropsOptions(f, t, !0);
      (extend(o, w), k && a.push(...k));
    };
    (!r && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c));
  }
  if (!i && !l) return (isObject(e) && s.set(e, EMPTY_ARR), EMPTY_ARR);
  if (isArray(i))
    for (let c = 0; c < i.length; c++) {
      const f = camelize(i[c]);
      validatePropName(f) && (o[f] = EMPTY_OBJ);
    }
  else if (i)
    for (const c in i) {
      const f = camelize(c);
      if (validatePropName(f)) {
        const w = i[c],
          k = (o[f] =
            isArray(w) || isFunction(w) ? { type: w } : extend({}, w)),
          N = k.type;
        let R = !1,
          K = !0;
        if (isArray(N))
          for (let O = 0; O < N.length; ++O) {
            const j = N[O],
              W = isFunction(j) && j.name;
            if (W === 'Boolean') {
              R = !0;
              break;
            } else W === 'String' && (K = !1);
          }
        else R = isFunction(N) && N.name === 'Boolean';
        ((k[0] = R), (k[1] = K), (R || hasOwn(k, 'default')) && a.push(f));
      }
    }
  const d = [o, a];
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
        const o = normalizeSlotValue(i);
        t[n] = () => o;
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
      o = EMPTY_OBJ;
    if (s.shapeFlag & 32) {
      const a = t._;
      (a
        ? r && a === 1
          ? (i = !1)
          : assignSlots(n, t, r)
        : ((i = !t.$stable), normalizeObjectSlots(t, n)),
        (o = t));
    } else t && (normalizeVNodeSlots(e, t), (o = { default: 1 }));
    if (i) for (const a in n) !isInternalKey(a) && o[a] == null && delete n[a];
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
      createElement: o,
      createText: a,
      createComment: l,
      setText: d,
      setElementText: c,
      parentNode: f,
      nextSibling: w,
      setScopeId: k = NOOP,
      insertStaticContent: N,
    } = e,
    R = (
      u,
      h,
      g,
      D = null,
      v = null,
      b = null,
      C = void 0,
      _ = null,
      M = !!h.dynamicChildren,
    ) => {
      if (u === h) return;
      (u && !isSameVNodeType(u, h) && ((D = y(u)), ee(u, v, b, !0), (u = null)),
        h.patchFlag === -2 && ((M = !1), (h.dynamicChildren = null)));
      const { type: S, ref: E, shapeFlag: T } = h;
      switch (S) {
        case Text:
          K(u, h, g, D);
          break;
        case Comment:
          O(u, h, g, D);
          break;
        case Static:
          u == null && j(h, g, D, C);
          break;
        case Fragment:
          P(u, h, g, D, v, b, C, _, M);
          break;
        default:
          T & 1
            ? Y(u, h, g, D, v, b, C, _, M)
            : T & 6
              ? q(u, h, g, D, v, b, C, _, M)
              : (T & 64 || T & 128) && S.process(u, h, g, D, v, b, C, _, M, he);
      }
      E != null && v
        ? setRef(E, u && u.ref, b, h || u, !h)
        : E == null && u && u.ref != null && setRef(u.ref, null, b, u, !0);
    },
    K = (u, h, g, D) => {
      if (u == null) s((h.el = a(h.children)), g, D);
      else {
        const v = (h.el = u.el);
        h.children !== u.children && d(v, h.children);
      }
    },
    O = (u, h, g, D) => {
      u == null ? s((h.el = l(h.children || '')), g, D) : (h.el = u.el);
    },
    j = (u, h, g, D) => {
      [u.el, u.anchor] = N(u.children, h, g, D, u.el, u.anchor);
    },
    W = ({ el: u, anchor: h }, g, D) => {
      let v;
      for (; u && u !== h; ) ((v = w(u)), s(u, g, D), (u = v));
      s(h, g, D);
    },
    V = ({ el: u, anchor: h }) => {
      let g;
      for (; u && u !== h; ) ((g = w(u)), n(u), (u = g));
      n(h);
    },
    Y = (u, h, g, D, v, b, C, _, M) => {
      (h.type === 'svg' ? (C = 'svg') : h.type === 'math' && (C = 'mathml'),
        u == null ? G(h, g, D, v, b, C, _, M) : se(u, h, v, b, C, _, M));
    },
    G = (u, h, g, D, v, b, C, _) => {
      let M, S;
      const { props: E, shapeFlag: T, transition: A, dirs: B } = u;
      if (
        ((M = u.el = o(u.type, b, E && E.is, E)),
        T & 8
          ? c(M, u.children)
          : T & 16 &&
            J(u.children, M, null, D, v, resolveChildrenNamespace(u, b), C, _),
        B && invokeDirectiveHook(u, null, D, 'created'),
        U(M, u, u.scopeId, C, D),
        E)
      ) {
        for (const F in E)
          F !== 'value' && !isReservedProp(F) && i(M, F, null, E[F], b, D);
        ('value' in E && i(M, 'value', null, E.value, b),
          (S = E.onVnodeBeforeMount) && invokeVNodeHook(S, D, u));
      }
      B && invokeDirectiveHook(u, null, D, 'beforeMount');
      const I = needTransition(v, A);
      (I && A.beforeEnter(M),
        s(M, h, g),
        ((S = E && E.onVnodeMounted) || I || B) &&
          queuePostRenderEffect(() => {
            (S && invokeVNodeHook(S, D, u),
              I && A.enter(M),
              B && invokeDirectiveHook(u, null, D, 'mounted'));
          }, v));
    },
    U = (u, h, g, D, v) => {
      if ((g && k(u, g), D)) for (let b = 0; b < D.length; b++) k(u, D[b]);
      if (v) {
        let b = v.subTree;
        if (
          h === b ||
          (isSuspense(b.type) && (b.ssContent === h || b.ssFallback === h))
        ) {
          const C = v.vnode;
          U(u, C, C.scopeId, C.slotScopeIds, v.parent);
        }
      }
    },
    J = (u, h, g, D, v, b, C, _, M = 0) => {
      for (let S = M; S < u.length; S++) {
        const E = (u[S] = _ ? cloneIfMounted(u[S]) : normalizeVNode(u[S]));
        R(null, E, h, g, D, v, b, C, _);
      }
    },
    se = (u, h, g, D, v, b, C) => {
      const _ = (h.el = u.el);
      let { patchFlag: M, dynamicChildren: S, dirs: E } = h;
      M |= u.patchFlag & 16;
      const T = u.props || EMPTY_OBJ,
        A = h.props || EMPTY_OBJ;
      let B;
      if (
        (g && toggleRecurse(g, !1),
        (B = A.onVnodeBeforeUpdate) && invokeVNodeHook(B, g, h, u),
        E && invokeDirectiveHook(h, u, g, 'beforeUpdate'),
        g && toggleRecurse(g, !0),
        ((T.innerHTML && A.innerHTML == null) ||
          (T.textContent && A.textContent == null)) &&
          c(_, ''),
        S
          ? Z(u.dynamicChildren, S, _, g, D, resolveChildrenNamespace(h, v), b)
          : C || x(u, h, _, null, g, D, resolveChildrenNamespace(h, v), b, !1),
        M > 0)
      ) {
        if (M & 16) re(_, T, A, g, v);
        else if (
          (M & 2 && T.class !== A.class && i(_, 'class', null, A.class, v),
          M & 4 && i(_, 'style', T.style, A.style, v),
          M & 8)
        ) {
          const I = h.dynamicProps;
          for (let F = 0; F < I.length; F++) {
            const H = I[F],
              X = T[H],
              Q = A[H];
            (Q !== X || H === 'value') && i(_, H, X, Q, v, g);
          }
        }
        M & 1 && u.children !== h.children && c(_, h.children);
      } else !C && S == null && re(_, T, A, g, v);
      ((B = A.onVnodeUpdated) || E) &&
        queuePostRenderEffect(() => {
          (B && invokeVNodeHook(B, g, h, u),
            E && invokeDirectiveHook(h, u, g, 'updated'));
        }, D);
    },
    Z = (u, h, g, D, v, b, C) => {
      for (let _ = 0; _ < h.length; _++) {
        const M = u[_],
          S = h[_],
          E =
            M.el &&
            (M.type === Fragment || !isSameVNodeType(M, S) || M.shapeFlag & 198)
              ? f(M.el)
              : g;
        R(M, S, E, null, D, v, b, C, !0);
      }
    },
    re = (u, h, g, D, v) => {
      if (h !== g) {
        if (h !== EMPTY_OBJ)
          for (const b in h)
            !isReservedProp(b) && !(b in g) && i(u, b, h[b], null, v, D);
        for (const b in g) {
          if (isReservedProp(b)) continue;
          const C = g[b],
            _ = h[b];
          C !== _ && b !== 'value' && i(u, b, _, C, v, D);
        }
        'value' in g && i(u, 'value', h.value, g.value, v);
      }
    },
    P = (u, h, g, D, v, b, C, _, M) => {
      const S = (h.el = u ? u.el : a('')),
        E = (h.anchor = u ? u.anchor : a(''));
      let { patchFlag: T, dynamicChildren: A, slotScopeIds: B } = h;
      (B && (_ = _ ? _.concat(B) : B),
        u == null
          ? (s(S, g, D), s(E, g, D), J(h.children || [], g, E, v, b, C, _, M))
          : T > 0 && T & 64 && A && u.dynamicChildren
            ? (Z(u.dynamicChildren, A, g, v, b, C, _),
              (h.key != null || (v && h === v.subTree)) &&
                traverseStaticChildren(u, h, !0))
            : x(u, h, g, E, v, b, C, _, M));
    },
    q = (u, h, g, D, v, b, C, _, M) => {
      ((h.slotScopeIds = _),
        u == null
          ? h.shapeFlag & 512
            ? v.ctx.activate(h, g, D, C, M)
            : de(h, g, D, v, b, C, M)
          : pe(u, h, M));
    },
    de = (u, h, g, D, v, b, C) => {
      const _ = (u.component = createComponentInstance(u, D, v));
      if (
        (isKeepAlive(u) && (_.ctx.renderer = he),
        setupComponent(_, !1, C),
        _.asyncDep)
      ) {
        if ((v && v.registerDep(_, z, C), !u.el)) {
          const M = (_.subTree = createVNode(Comment));
          (O(null, M, h, g), (u.placeholder = M.el));
        }
      } else z(_, u, h, g, v, b, C);
    },
    pe = (u, h, g) => {
      const D = (h.component = u.component);
      if (shouldUpdateComponent(u, h, g))
        if (D.asyncDep && !D.asyncResolved) {
          L(D, h, g);
          return;
        } else ((D.next = h), D.update());
      else ((h.el = u.el), (D.vnode = h));
    },
    z = (u, h, g, D, v, b, C) => {
      const _ = () => {
        if (u.isMounted) {
          let { next: T, bu: A, u: B, parent: I, vnode: F } = u;
          {
            const ie = locateNonHydratedAsyncRoot(u);
            if (ie) {
              (T && ((T.el = F.el), L(u, T, C)),
                ie.asyncDep.then(() => {
                  u.isUnmounted || _();
                }));
              return;
            }
          }
          let H = T,
            X;
          (toggleRecurse(u, !1),
            T ? ((T.el = F.el), L(u, T, C)) : (T = F),
            A && invokeArrayFns(A),
            (X = T.props && T.props.onVnodeBeforeUpdate) &&
              invokeVNodeHook(X, I, T, F),
            toggleRecurse(u, !0));
          const Q = renderComponentRoot(u),
            ne = u.subTree;
          ((u.subTree = Q),
            R(ne, Q, f(ne.el), y(ne), u, v, b),
            (T.el = Q.el),
            H === null && updateHOCHostEl(u, Q.el),
            B && queuePostRenderEffect(B, v),
            (X = T.props && T.props.onVnodeUpdated) &&
              queuePostRenderEffect(() => invokeVNodeHook(X, I, T, F), v));
        } else {
          let T;
          const { el: A, props: B } = h,
            { bm: I, m: F, parent: H, root: X, type: Q } = u,
            ne = isAsyncWrapper(h);
          (toggleRecurse(u, !1),
            I && invokeArrayFns(I),
            !ne && (T = B && B.onVnodeBeforeMount) && invokeVNodeHook(T, H, h),
            toggleRecurse(u, !0));
          {
            X.ce && X.ce._def.shadowRoot !== !1 && X.ce._injectChildStyle(Q);
            const ie = (u.subTree = renderComponentRoot(u));
            (R(null, ie, g, D, u, v, b), (h.el = ie.el));
          }
          if (
            (F && queuePostRenderEffect(F, v),
            !ne && (T = B && B.onVnodeMounted))
          ) {
            const ie = h;
            queuePostRenderEffect(() => invokeVNodeHook(T, H, ie), v);
          }
          ((h.shapeFlag & 256 ||
            (H && isAsyncWrapper(H.vnode) && H.vnode.shapeFlag & 256)) &&
            u.a &&
            queuePostRenderEffect(u.a, v),
            (u.isMounted = !0),
            (h = g = D = null));
        }
      };
      u.scope.on();
      const M = (u.effect = new ReactiveEffect(_));
      u.scope.off();
      const S = (u.update = M.run.bind(M)),
        E = (u.job = M.runIfDirty.bind(M));
      ((E.i = u),
        (E.id = u.uid),
        (M.scheduler = () => queueJob(E)),
        toggleRecurse(u, !0),
        S());
    },
    L = (u, h, g) => {
      h.component = u;
      const D = u.vnode.props;
      ((u.vnode = h),
        (u.next = null),
        updateProps(u, h.props, D, g),
        updateSlots(u, h.children, g),
        pauseTracking(),
        flushPreFlushCbs(u),
        resetTracking());
    },
    x = (u, h, g, D, v, b, C, _, M = !1) => {
      const S = u && u.children,
        E = u ? u.shapeFlag : 0,
        T = h.children,
        { patchFlag: A, shapeFlag: B } = h;
      if (A > 0) {
        if (A & 128) {
          ce(S, T, g, D, v, b, C, _, M);
          return;
        } else if (A & 256) {
          ae(S, T, g, D, v, b, C, _, M);
          return;
        }
      }
      B & 8
        ? (E & 16 && m(S, v, b), T !== S && c(g, T))
        : E & 16
          ? B & 16
            ? ce(S, T, g, D, v, b, C, _, M)
            : m(S, v, b, !0)
          : (E & 8 && c(g, ''), B & 16 && J(T, g, D, v, b, C, _, M));
    },
    ae = (u, h, g, D, v, b, C, _, M) => {
      ((u = u || EMPTY_ARR), (h = h || EMPTY_ARR));
      const S = u.length,
        E = h.length,
        T = Math.min(S, E);
      let A;
      for (A = 0; A < T; A++) {
        const B = (h[A] = M ? cloneIfMounted(h[A]) : normalizeVNode(h[A]));
        R(u[A], B, g, null, v, b, C, _, M);
      }
      S > E ? m(u, v, b, !0, !1, T) : J(h, g, D, v, b, C, _, M, T);
    },
    ce = (u, h, g, D, v, b, C, _, M) => {
      let S = 0;
      const E = h.length;
      let T = u.length - 1,
        A = E - 1;
      for (; S <= T && S <= A; ) {
        const B = u[S],
          I = (h[S] = M ? cloneIfMounted(h[S]) : normalizeVNode(h[S]));
        if (isSameVNodeType(B, I)) R(B, I, g, null, v, b, C, _, M);
        else break;
        S++;
      }
      for (; S <= T && S <= A; ) {
        const B = u[T],
          I = (h[A] = M ? cloneIfMounted(h[A]) : normalizeVNode(h[A]));
        if (isSameVNodeType(B, I)) R(B, I, g, null, v, b, C, _, M);
        else break;
        (T--, A--);
      }
      if (S > T) {
        if (S <= A) {
          const B = A + 1,
            I = B < E ? h[B].el : D;
          for (; S <= A; )
            (R(
              null,
              (h[S] = M ? cloneIfMounted(h[S]) : normalizeVNode(h[S])),
              g,
              I,
              v,
              b,
              C,
              _,
              M,
            ),
              S++);
        }
      } else if (S > A) for (; S <= T; ) (ee(u[S], v, b, !0), S++);
      else {
        const B = S,
          I = S,
          F = new Map();
        for (S = I; S <= A; S++) {
          const te = (h[S] = M ? cloneIfMounted(h[S]) : normalizeVNode(h[S]));
          te.key != null && F.set(te.key, S);
        }
        let H,
          X = 0;
        const Q = A - I + 1;
        let ne = !1,
          ie = 0;
        const fe = new Array(Q);
        for (S = 0; S < Q; S++) fe[S] = 0;
        for (S = B; S <= T; S++) {
          const te = u[S];
          if (X >= Q) {
            ee(te, v, b, !0);
            continue;
          }
          let oe;
          if (te.key != null) oe = F.get(te.key);
          else
            for (H = I; H <= A; H++)
              if (fe[H - I] === 0 && isSameVNodeType(te, h[H])) {
                oe = H;
                break;
              }
          oe === void 0
            ? ee(te, v, b, !0)
            : ((fe[oe - I] = S + 1),
              oe >= ie ? (ie = oe) : (ne = !0),
              R(te, h[oe], g, null, v, b, C, _, M),
              X++);
        }
        const ve = ne ? getSequence(fe) : EMPTY_ARR;
        for (H = ve.length - 1, S = Q - 1; S >= 0; S--) {
          const te = I + S,
            oe = h[te],
            be = h[te + 1],
            De = te + 1 < E ? be.el || be.placeholder : D;
          fe[S] === 0
            ? R(null, oe, g, De, v, b, C, _, M)
            : ne && (H < 0 || S !== ve[H] ? le(oe, g, De, 2) : H--);
        }
      }
    },
    le = (u, h, g, D, v = null) => {
      const { el: b, type: C, transition: _, children: M, shapeFlag: S } = u;
      if (S & 6) {
        le(u.component.subTree, h, g, D);
        return;
      }
      if (S & 128) {
        u.suspense.move(h, g, D);
        return;
      }
      if (S & 64) {
        C.move(u, h, g, he);
        return;
      }
      if (C === Fragment) {
        s(b, h, g);
        for (let T = 0; T < M.length; T++) le(M[T], h, g, D);
        s(u.anchor, h, g);
        return;
      }
      if (C === Static) {
        W(u, h, g);
        return;
      }
      if (D !== 2 && S & 1 && _)
        if (D === 0)
          (_.beforeEnter(b),
            s(b, h, g),
            queuePostRenderEffect(() => _.enter(b), v));
        else {
          const { leave: T, delayLeave: A, afterLeave: B } = _,
            I = () => {
              u.ctx.isUnmounted ? n(b) : s(b, h, g);
            },
            F = () => {
              (b._isLeaving && b[leaveCbKey](!0),
                T(b, () => {
                  (I(), B && B());
                }));
            };
          A ? A(b, I, F) : F();
        }
      else s(b, h, g);
    },
    ee = (u, h, g, D = !1, v = !1) => {
      const {
        type: b,
        props: C,
        ref: _,
        children: M,
        dynamicChildren: S,
        shapeFlag: E,
        patchFlag: T,
        dirs: A,
        cacheIndex: B,
      } = u;
      if (
        (T === -2 && (v = !1),
        _ != null &&
          (pauseTracking(), setRef(_, null, g, u, !0), resetTracking()),
        B != null && (h.renderCache[B] = void 0),
        E & 256)
      ) {
        h.ctx.deactivate(u);
        return;
      }
      const I = E & 1 && A,
        F = !isAsyncWrapper(u);
      let H;
      if (
        (F && (H = C && C.onVnodeBeforeUnmount) && invokeVNodeHook(H, h, u),
        E & 6)
      )
        $(u.component, g, D);
      else {
        if (E & 128) {
          u.suspense.unmount(g, D);
          return;
        }
        (I && invokeDirectiveHook(u, null, h, 'beforeUnmount'),
          E & 64
            ? u.type.remove(u, h, g, he, D)
            : S && !S.hasOnce && (b !== Fragment || (T > 0 && T & 64))
              ? m(S, h, g, !1, !0)
              : ((b === Fragment && T & 384) || (!v && E & 16)) && m(M, h, g),
          D && me(u));
      }
      ((F && (H = C && C.onVnodeUnmounted)) || I) &&
        queuePostRenderEffect(() => {
          (H && invokeVNodeHook(H, h, u),
            I && invokeDirectiveHook(u, null, h, 'unmounted'));
        }, g);
    },
    me = (u) => {
      const { type: h, el: g, anchor: D, transition: v } = u;
      if (h === Fragment) {
        ge(g, D);
        return;
      }
      if (h === Static) {
        V(u);
        return;
      }
      const b = () => {
        (n(g), v && !v.persisted && v.afterLeave && v.afterLeave());
      };
      if (u.shapeFlag & 1 && v && !v.persisted) {
        const { leave: C, delayLeave: _ } = v,
          M = () => C(g, b);
        _ ? _(u.el, b, M) : M();
      } else b();
    },
    ge = (u, h) => {
      let g;
      for (; u !== h; ) ((g = w(u)), n(u), (u = g));
      n(h);
    },
    $ = (u, h, g) => {
      const { bum: D, scope: v, job: b, subTree: C, um: _, m: M, a: S } = u;
      (invalidateMount(M),
        invalidateMount(S),
        D && invokeArrayFns(D),
        v.stop(),
        b && ((b.flags |= 8), ee(C, u, h, g)),
        _ && queuePostRenderEffect(_, h),
        queuePostRenderEffect(() => {
          u.isUnmounted = !0;
        }, h));
    },
    m = (u, h, g, D = !1, v = !1, b = 0) => {
      for (let C = b; C < u.length; C++) ee(u[C], h, g, D, v);
    },
    y = (u) => {
      if (u.shapeFlag & 6) return y(u.component.subTree);
      if (u.shapeFlag & 128) return u.suspense.next();
      const h = w(u.anchor || u.el),
        g = h && h[TeleportEndKey];
      return g ? w(g) : h;
    };
  let ue = !1;
  const ye = (u, h, g) => {
      (u == null
        ? h._vnode && ee(h._vnode, null, null, !0)
        : R(h._vnode || null, u, h, null, null, null, g),
        (h._vnode = u),
        ue || ((ue = !0), flushPreFlushCbs(), flushPostFlushCbs(), (ue = !1)));
    },
    he = {
      p: R,
      um: ee,
      m: le,
      r: me,
      mt: de,
      mc: J,
      pc: x,
      pbc: Z,
      n: y,
      o: e,
    };
  return { render: ye, hydrate: void 0, createApp: createAppAPI(ye) };
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
      const o = s[i];
      let a = n[i];
      (a.shapeFlag & 1 &&
        !a.dynamicChildren &&
        ((a.patchFlag <= 0 || a.patchFlag === 32) &&
          ((a = n[i] = cloneIfMounted(n[i])), (a.el = o.el)),
        !r && a.patchFlag !== -2 && traverseStaticChildren(o, a)),
        a.type === Text && a.patchFlag !== -1 && (a.el = o.el),
        a.type === Comment && !a.el && (a.el = o.el));
    }
}
function getSequence(e) {
  const t = e.slice(),
    r = [0];
  let s, n, i, o, a;
  const l = e.length;
  for (s = 0; s < l; s++) {
    const d = e[s];
    if (d !== 0) {
      if (((n = r[r.length - 1]), e[n] < d)) {
        ((t[s] = n), r.push(s));
        continue;
      }
      for (i = 0, o = r.length - 1; i < o; )
        ((a = (i + o) >> 1), e[r[a]] < d ? (i = a + 1) : (o = a));
      d < e[r[i]] && (i > 0 && (t[s] = r[i - 1]), (r[i] = s));
    }
  }
  for (i = r.length, o = r[i - 1]; i-- > 0; ) ((r[i] = o), (o = t[o]));
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
const ssrContextKey = Symbol.for('v-scx'),
  useSSRContext = () => inject(ssrContextKey);
function watch(e, t, r) {
  return doWatch(e, t, r);
}
function doWatch(e, t, r = EMPTY_OBJ) {
  const { immediate: s, deep: n, flush: i, once: o } = r,
    a = extend({}, r),
    l = (t && s) || (!t && i !== 'post');
  let d;
  if (isInSSRComponentSetup) {
    if (i === 'sync') {
      const k = useSSRContext();
      d = k.__watcherHandles || (k.__watcherHandles = []);
    } else if (!l) {
      const k = () => {};
      return ((k.stop = NOOP), (k.resume = NOOP), (k.pause = NOOP), k);
    }
  }
  const c = currentInstance;
  a.call = (k, N, R) => callWithAsyncErrorHandling(k, c, N, R);
  let f = !1;
  (i === 'post'
    ? (a.scheduler = (k) => {
        queuePostRenderEffect(k, c && c.suspense);
      })
    : i !== 'sync' &&
      ((f = !0),
      (a.scheduler = (k, N) => {
        N ? k() : queueJob(k);
      })),
    (a.augmentJob = (k) => {
      (t && (k.flags |= 4),
        f && ((k.flags |= 2), c && ((k.id = c.uid), (k.i = c))));
    }));
  const w = watch$1(e, t, a);
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
  const o = setCurrentInstance(this),
    a = doWatch(n, i.bind(s), r);
  return (o(), a);
}
function createPathGetter(e, t) {
  const r = t.split('.');
  return () => {
    let s = e;
    for (let n = 0; n < r.length && s; n++) s = s[r[n]];
    return s;
  };
}
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
    o = i && getModelModifiers(s, t.slice(7));
  o &&
    (o.trim && (n = r.map((c) => (isString(c) ? c.trim() : c))),
    o.number && (n = r.map(looseToNumber)));
  let a,
    l = s[(a = toHandlerKey(t))] || s[(a = toHandlerKey(camelize(t)))];
  (!l && i && (l = s[(a = toHandlerKey(hyphenate(t)))]),
    l && callWithAsyncErrorHandling(l, e, 6, n));
  const d = s[a + 'Once'];
  if (d) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[a]) return;
    ((e.emitted[a] = !0), callWithAsyncErrorHandling(d, e, 6, n));
  }
}
const mixinEmitsCache = new WeakMap();
function normalizeEmitsOptions(e, t, r = !1) {
  const s = r ? mixinEmitsCache : t.emitsCache,
    n = s.get(e);
  if (n !== void 0) return n;
  const i = e.emits;
  let o = {},
    a = !1;
  if (!isFunction(e)) {
    const l = (d) => {
      const c = normalizeEmitsOptions(d, t, !0);
      c && ((a = !0), extend(o, c));
    };
    (!r && t.mixins.length && t.mixins.forEach(l),
      e.extends && l(e.extends),
      e.mixins && e.mixins.forEach(l));
  }
  return !i && !a
    ? (isObject(e) && s.set(e, null), null)
    : (isArray(i) ? i.forEach((l) => (o[l] = null)) : extend(o, i),
      isObject(e) && s.set(e, o),
      o);
}
function isEmitListener(e, t) {
  return !e || !isOn(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, '')),
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
      slots: o,
      attrs: a,
      emit: l,
      render: d,
      renderCache: c,
      props: f,
      data: w,
      setupState: k,
      ctx: N,
      inheritAttrs: R,
    } = e,
    K = setCurrentRenderingInstance(e);
  let O, j;
  try {
    if (r.shapeFlag & 4) {
      const V = n || s,
        Y = V;
      ((O = normalizeVNode(d.call(Y, V, c, f, k, w, N))), (j = a));
    } else {
      const V = t;
      ((O = normalizeVNode(
        V.length > 1 ? V(f, { attrs: a, slots: o, emit: l }) : V(f, null),
      )),
        (j = t.props ? a : getFunctionalFallthrough(a)));
    }
  } catch (V) {
    ((blockStack.length = 0), handleError(V, e, 1), (O = createVNode(Comment)));
  }
  let W = O;
  if (j && R !== !1) {
    const V = Object.keys(j),
      { shapeFlag: Y } = W;
    V.length &&
      Y & 7 &&
      (i && V.some(isModelListener) && (j = filterModelListeners(j, i)),
      (W = cloneVNode(W, j, !1, !0)));
  }
  return (
    r.dirs &&
      ((W = cloneVNode(W, null, !1, !0)),
      (W.dirs = W.dirs ? W.dirs.concat(r.dirs) : r.dirs)),
    r.transition && setTransitionHooks(W, r.transition),
    (O = W),
    setCurrentRenderingInstance(K),
    O
  );
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
    { props: o, children: a, patchFlag: l } = t,
    d = i.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (r && l >= 0) {
    if (l & 1024) return !0;
    if (l & 16) return s ? hasPropsChanged(s, o, d) : !!o;
    if (l & 8) {
      const c = t.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        const w = c[f];
        if (o[w] !== s[w] && !isEmitListener(d, w)) return !0;
      }
    }
  } else
    return (n || a) && (!a || !a.$stable)
      ? !0
      : s === o
        ? !1
        : s
          ? o
            ? hasPropsChanged(s, o, d)
            : !0
          : !!o;
  return !1;
}
function hasPropsChanged(e, t, r) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let n = 0; n < s.length; n++) {
    const i = s[n];
    if (t[i] !== e[i] && !isEmitListener(r, i)) return !0;
  }
  return !1;
}
function updateHOCHostEl({ vnode: e, parent: t }, r) {
  for (; t; ) {
    const s = t.subTree;
    if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
      (((e = t.vnode).el = r), (t = t.parent));
    else break;
  }
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
  o = !1,
  a = !1,
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
    a
      ? (normalizeChildren(l, r), i & 128 && e.normalize(l))
      : r && (l.shapeFlag |= isString(r) ? 8 : 16),
    isBlockTreeEnabled > 0 &&
      !o &&
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
    const a = cloneVNode(e, t, !0);
    return (
      r && normalizeChildren(a, r),
      isBlockTreeEnabled > 0 &&
        !i &&
        currentBlock &&
        (a.shapeFlag & 6
          ? (currentBlock[currentBlock.indexOf(e)] = a)
          : currentBlock.push(a)),
      (a.patchFlag = -2),
      a
    );
  }
  if ((isClassComponent(e) && (e = e.__vccOpts), t)) {
    t = guardReactiveProps(t);
    let { class: a, style: l } = t;
    (a && !isString(a) && (t.class = normalizeClass(a)),
      isObject(l) &&
        (isProxy(l) && !isArray(l) && (l = extend({}, l)),
        (t.style = normalizeStyle(l))));
  }
  const o = isString(e)
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
  return createBaseVNode(e, t, r, s, n, o, i, !0);
}
function guardReactiveProps(e) {
  return e ? (isProxy(e) || isInternalObject(e) ? extend({}, e) : e) : null;
}
function cloneVNode(e, t, r = !1, s = !1) {
  const { props: n, ref: i, patchFlag: o, children: a, transition: l } = e,
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
      children: a,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== Fragment ? (o === -1 ? 16 : o | 16) : o,
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
  else
    isFunction(t)
      ? ((t = { default: t, _ctx: currentRenderingInstance }), (r = 32))
      : ((t = String(t)),
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
          o = s[n];
        o &&
          i !== o &&
          !(isArray(i) && i.includes(o)) &&
          (t[n] = i ? [].concat(i, o) : o);
      } else n !== '' && (t[n] = s[n]);
  }
  return t;
}
function invokeVNodeHook(e, t, r, s = null) {
  callWithAsyncErrorHandling(e, t, 7, [r, s]);
}
const emptyAppContext = createAppContext();
let uid = 0;
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
          n.length > 1 ? n.forEach((o) => o(i)) : n[0](i);
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
  const o = i ? setupStatefulComponent(e, t) : void 0;
  return (t && setInSSRSetupState(!1), o);
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
      o = callWithErrorHandling(s, e, 0, [e.props, n]),
      a = isPromise(o);
    if (
      (resetTracking(),
      i(),
      (a || e.sp) && !isAsyncWrapper(e) && markAsyncBoundary(e),
      a)
    ) {
      if ((o.then(unsetCurrentInstance, unsetCurrentInstance), t))
        return o
          .then((l) => {
            handleSetupResult(e, l);
          })
          .catch((l) => {
            handleError(l, e, 0);
          });
      e.asyncDep = o;
    } else handleSetupResult(e, o);
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
  if (!s && e && e.parent) {
    const n = (i) => {
      for (const o in i) if (i[o] === t) return o;
    };
    s =
      n(e.components || e.parent.type.components) || n(e.appContext.components);
  }
  return s ? classify(s) : r ? 'App' : 'Anonymous';
}
function isClassComponent(e) {
  return isFunction(e) && '__vccOpts' in e;
}
const computed = (e, t) => computed$1(e, t, isInSSRComponentSetup),
  version = '3.5.22';
/**
 * @vue/runtime-dom v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let policy;
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
      const o = r ? r.previousSibling : t.lastChild;
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
        const a = templateContainer.content;
        if (s === 'svg' || s === 'mathml') {
          const l = a.firstChild;
          for (; l.firstChild; ) a.appendChild(l.firstChild);
          a.removeChild(l);
        }
        t.insertBefore(a, r);
      }
      return [
        o ? o.nextSibling : t.firstChild,
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
        for (const o of t.split(';')) {
          const a = o.slice(0, o.indexOf(':')).trim();
          r[a] == null && setStyle(s, a, '');
        }
      else for (const o in t) r[o] == null && setStyle(s, o, '');
    for (const o in r) (o === 'display' && (i = !0), setStyle(s, o, r[o]));
  } else if (n) {
    if (t !== r) {
      const o = s[CSS_VAR_TEXT];
      (o && (r += ';' + o), (s.cssText = r), (i = displayRE.test(r)));
    }
  } else t && e.removeAttribute('style');
  vShowOriginalDisplay in e &&
    ((e[vShowOriginalDisplay] = i ? s.display : ''),
    e[vShowHidden] && (s.display = 'none'));
}
const importantRE = /\s*!important$/;
function setStyle(e, t, r) {
  if (isArray(r)) r.forEach((s) => setStyle(e, t, s));
  else if ((r == null && (r = ''), t.startsWith('--'))) e.setProperty(t, r);
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
    const a = i === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      l = r == null ? (e.type === 'checkbox' ? 'on' : '') : String(r);
    ((a !== l || !('_value' in e)) && (e.value = l),
      r == null && e.removeAttribute(t),
      (e._value = r));
    return;
  }
  let o = !1;
  if (r === '' || r == null) {
    const a = typeof e[t];
    a === 'boolean'
      ? (r = includeBooleanAttr(r))
      : r == null && a === 'string'
        ? ((r = ''), (o = !0))
        : a === 'number' && ((r = 0), (o = !0));
  }
  try {
    e[t] = r;
  } catch {}
  o && e.removeAttribute(n || t);
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
    o = i[t];
  if (s && o) o.value = s;
  else {
    const [a, l] = parseName(t);
    if (s) {
      const d = (i[t] = createInvoker(s, n));
      addEventListener(e, a, d, l);
    } else o && (removeEventListener(e, a, o, l), (i[t] = void 0));
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(e) {
  let t;
  if (optionsModifierRE.test(e)) {
    t = {};
    let s;
    for (; (s = e.match(optionsModifierRE)); )
      ((e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0));
  }
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
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(s, r.value),
      t,
      5,
      [s],
    );
  };
  return ((r.value = e), (r.attached = getNow()), r);
}
function patchStopImmediatePropagation(e, t) {
  if (isArray(t)) {
    const r = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        (r.call(e), (e._stopped = !0));
      }),
      t.map((s) => (n) => !n._stopped && s && s(n))
    );
  } else return t;
}
const isNativeOn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  patchProp = (e, t, r, s, n, i) => {
    const o = n === 'svg';
    t === 'class'
      ? patchClass(e, s, o)
      : t === 'style'
        ? patchStyle(e, r, s)
        : isOn(t)
          ? isModelListener(t) || patchEvent(e, t, r, s, i)
          : (
                t[0] === '.'
                  ? ((t = t.slice(1)), !0)
                  : t[0] === '^'
                    ? ((t = t.slice(1)), !1)
                    : shouldSetAsProp(e, t, s, o)
              )
            ? (patchDOMProp(e, t, s),
              !e.tagName.includes('-') &&
                (t === 'value' || t === 'checked' || t === 'selected') &&
                patchAttr(e, t, s, o, i, t !== 'value'))
            : e._isVueCE && (/[A-Z]/.test(t) || !isString(s))
              ? patchDOMProp(e, camelize(t), s, i, t)
              : (t === 'true-value'
                  ? (e._trueValue = s)
                  : t === 'false-value' && (e._falseValue = s),
                patchAttr(e, t, s, o));
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
  vModelText = {
    created(e, { modifiers: { lazy: t, trim: r, number: s } }, n) {
      e[assignKey] = getModelAssigner(n);
      const i = s || (n.props && n.props.type === 'number');
      (addEventListener(e, t ? 'change' : 'input', (o) => {
        if (o.target.composing) return;
        let a = e.value;
        (r && (a = a.trim()), i && (a = looseToNumber(a)), e[assignKey](a));
      }),
        r &&
          addEventListener(e, 'change', () => {
            e.value = e.value.trim();
          }),
        t ||
          (addEventListener(e, 'compositionstart', onCompositionStart),
          addEventListener(e, 'compositionend', onCompositionEnd),
          addEventListener(e, 'change', onCompositionEnd)));
    },
    mounted(e, { value: t }) {
      e.value = t ?? '';
    },
    beforeUpdate(
      e,
      { value: t, oldValue: r, modifiers: { lazy: s, trim: n, number: i } },
      o,
    ) {
      if (((e[assignKey] = getModelAssigner(o)), e.composing)) return;
      const a =
          (i || e.type === 'number') && !/^0\d/.test(e.value)
            ? looseToNumber(e.value)
            : e.value,
        l = t ?? '';
      a !== l &&
        ((document.activeElement === e &&
          e.type !== 'range' &&
          ((s && t === r) || (n && e.value.trim() === l))) ||
          (e.value = l));
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
            o = e[assignKey];
          if (isArray(s)) {
            const a = looseIndexOf(s, n),
              l = a !== -1;
            if (i && !l) o(s.concat(n));
            else if (!i && l) {
              const d = [...s];
              (d.splice(a, 1), o(d));
            }
          } else if (isSet(s)) {
            const a = new Set(s);
            (i ? a.add(n) : a.delete(n), o(a));
          } else o(getCheckboxValue(e, i));
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
      const n = isSet(t);
      (addEventListener(e, 'change', () => {
        const i = Array.prototype.filter
          .call(e.options, (o) => o.selected)
          .map((o) => (r ? looseToNumber(getValue(o)) : getValue(o)));
        (e[assignKey](e.multiple ? (n ? new Set(i) : i) : i[0]),
          (e._assigning = !0),
          nextTick(() => {
            e._assigning = !1;
          }));
      }),
        (e[assignKey] = getModelAssigner(s)));
    },
    mounted(e, { value: t }) {
      setSelected(e, t);
    },
    beforeUpdate(e, t, r) {
      e[assignKey] = getModelAssigner(r);
    },
    updated(e, { value: t }) {
      e._assigning || setSelected(e, t);
    },
  };
function setSelected(e, t) {
  const r = e.multiple,
    s = isArray(t);
  if (!(r && !s && !isSet(t))) {
    for (let n = 0, i = e.options.length; n < i; n++) {
      const o = e.options[n],
        a = getValue(o);
      if (r)
        if (s) {
          const l = typeof a;
          l === 'string' || l === 'number'
            ? (o.selected = t.some((d) => String(d) === String(a)))
            : (o.selected = looseIndexOf(t, a) > -1);
        } else o.selected = t.has(a);
      else if (looseEqual(getValue(o), t)) {
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
    const r = e._withMods || (e._withMods = {}),
      s = t.join('.');
    return (
      r[s] ||
      (r[s] = (n, ...i) => {
        for (let o = 0; o < t.length; o++) {
          const a = modifierGuards[t[o]];
          if (a && a(n, t)) return;
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
        if (t.some((o) => o === i || keyNames[o] === i)) return e(n);
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
      const o = r(n, !1, resolveRootNamespace(n));
      return (
        n instanceof Element &&
          (n.removeAttribute('v-cloak'), n.setAttribute('data-v-app', '')),
        o
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
      switch (e[0]) {
        case 'j':
          return jalali$4(t);
        default:
          return gregorian$4(t);
      }
    },
    isPersianDate = function (e) {
      return e instanceof PersianDate;
    },
    isValid = function (e, t, r, s, n, i, o, a) {
      return isValidDate(e, t, r, s) && isValidTime(n, i, o, a);
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
      if (
        [t, r, s].some(function (n) {
          return String(n).search(/null|NaN/) != -1;
        }) ||
        t < 0 ||
        r > 12 ||
        r < 1 ||
        s > 31 ||
        s < 1
      )
        return !1;
      switch (e[0]) {
        case 'j':
          return jalali$3(t, r, s);
        default:
          return gregorian$3(t, r, s);
      }
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
          var o = [null];
          o.push.apply(o, n);
          var a = new (Function.bind.apply(s, o))();
          return (i && _setPrototypeOf(a, i.prototype), a);
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
        o = !0,
        a = !1;
      try {
        for (
          r = r.call(e);
          !(o = (s = r.next()).done) && (i.push(s.value), !t || i.length !== t);
          o = !0
        );
      } catch (l) {
        ((a = !0), (n = l));
      } finally {
        try {
          o || r.return == null || r.return();
        } finally {
          if (a) throw n;
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
      o = !0,
      a = !1;
    return {
      s: function () {
        r = r.call(e);
      },
      n: function () {
        var l = r.next();
        return ((o = l.done), l);
      },
      e: function (l) {
        ((a = !0), (i = l));
      },
      f: function () {
        try {
          o || r.return == null || r.return();
        } finally {
          if (a) throw i;
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
  var gtj = function (e, t, r, s, n, i, o) {
      var a, l;
      ((r = (a = e
        ? isDate(e)
          ? e
          : new Date(
              REGEX.isNumeric.test(e) ? e : 0,
              REGEX.isNumeric.test(t) ? t : 0,
              REGEX.isNumeric.test(r) ? r : 1,
              REGEX.isNumeric.test(s) ? s : 0,
              REGEX.isNumeric.test(n) ? n : 0,
              REGEX.isNumeric.test(i) ? i : 0,
              REGEX.isNumeric.test(o) ? o : 0,
            )
        : new Date()).getDate()),
        (t = a.getMonth() + 1),
        (e = a.getFullYear()),
        (s = a.getHours()),
        (n = a.getMinutes()),
        (i = a.getSeconds()),
        (o = a.getMilliseconds()),
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
          o,
        ]
      );
    },
    jtg = function (e, t, r, s, n, i, o) {
      var a, l, d;
      ((e = REGEX.isNumeric.test(e) ? +e : 1),
        (t = REGEX.isNumeric.test(t) ? +t : 1),
        (r = REGEX.isNumeric.test(r) ? +r : 1),
        (s = REGEX.isNumeric.test(s) ? +s : 0),
        (n = REGEX.isNumeric.test(n) ? +n : 0),
        (i = REGEX.isNumeric.test(i) ? +i : 0),
        (o = REGEX.isNumeric.test(o) ? +o : 0),
        e > 979 ? ((a = 1600), (e -= 979)) : (a = 621));
      var c =
        365 * e +
        8 * parseInt(e / 33) +
        parseInt(((e % 33) + 3) / 4) +
        78 +
        r +
        (t < 7 ? 31 * (t - 1) : 30 * (t - 7) + 186);
      ((a += 400 * parseInt(c / 146097)),
        (c %= 146097) > 36524 &&
          ((a += 100 * parseInt(--c / 36524)), (c %= 36524) >= 365 && c++),
        (a += 4 * parseInt(c / 1461)),
        (c %= 1461) > 365 &&
          ((a += parseInt((c - 1) / 365)), (c = (c - 1) % 365)),
        (d = c + 1));
      var f = [
        0,
        31,
        isLeapYear('gregorian', a) ? 29 : 28,
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
        var w = f[l];
        if (d <= w) break;
        d -= w;
      }
      return new Date(a, l - 1, d, s, n, i, o);
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
    typesToArray = function (e, t, r, s, n, i, o, a) {
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
                  : [t, r, s, n, i, o, a]
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
      switch (e[0]) {
        case 'j':
          return 'jy';
        default:
          return 'y';
      }
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
    switch (e[0]) {
      case 'j':
        return 'jQ';
      default:
        return 'Q';
    }
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
    switch (e[0]) {
      case 'j':
        return 'jM';
      default:
        return 'M';
    }
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
    switch (e[0]) {
      case 'j':
        return 'jw';
      default:
        return 'w';
    }
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
    switch (e[0]) {
      case 'j':
        return 'jD';
      default:
        return 'D';
    }
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
      switch (e[0]) {
        case 'j':
          return jalali$2(e, t, r);
        default:
          return gregorian$2(e, t, r);
      }
    },
    getDayOfYearFormat = function (e) {
      switch (e[0]) {
        case 'j':
          return 'jd';
        default:
          return 'd';
      }
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
      switch (e[0]) {
        case 'j':
          return 'jd';
        default:
          return 'd';
      }
    },
    getWeekOfYear = function (e, t, r, s) {
      var n = this.clone().calendar(s).parse(e),
        i = n.date(dayOfYearFormat(s)),
        o = n.clone().parse(e, t, r);
      i > 3 && n.addDay(7 - i);
      var a = Math.ceil(o.diff(n, 'date', !0) / 7),
        l = o.clone().getWeeksInYear();
      return a > l ? l : a;
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
          var o;
          return (
            (i = typesToArray(r.c, i)),
            !!r.isValid.apply(r, _toConsumableArray(i)) &&
              (o = r.clone()).parse.apply(o, _toConsumableArray(i)).timestamp()
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
    switch (
      ((e = e.replace(REGEX.betweenBacktick, function (a, l) {
        return (t.push(l), '###');
      })),
      this.c[0])
    ) {
      case 'j':
        e = jalali$1(e);
        break;
      default:
        e = gregorian$1(e);
    }
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
    } catch (a) {
      n.e(a);
    } finally {
      n.f();
    }
    s += e;
    for (var o = 0; o < t.length; o++) s = s.replace('###', t[o]);
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
    switch (this.c[0]) {
      case 'j':
        return jalali(this.toArray());
      default:
        return gregorian(this.toArray());
    }
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
      (e.prototype.isValid = function (s, n, i, o, a, l, d) {
        return (
          !this.error &&
          this.isValidDate(s, n, i) &&
          this.isValidTime(o, a, l, d)
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
          o =
            arguments.length > 3 && arguments[3] !== void 0
              ? arguments[3]
              : this.d.millisecond;
        return !this.error && isValidTime(s, n, i, o);
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
      const r = JSON.parse(JSON.stringify(e));
      for (const s in t)
        e[s] && Object.prototype.toString.call(t[s]) === '[object Object]'
          ? (r[s] = this.mergeObject(e[s], t[s]))
          : (r[s] = t[s]);
      return r;
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
            'Cheshvan',
            'Kislev',
            'Tevet',
            'Shevat',
            'Adar I',
            'Adar',
            'Nisan',
            'Iyar',
            'Sivan',
            'Tammuz',
            'Av',
            'Elul',
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
          ]
    ).findIndex((i) => r.toLowerCase() === i.toLowerCase());
  return n >= 0 ? n + 1 : parsePart(e);
}
function sameDate(e, t) {
  return e.year === t.year && e.month === t.month && e.day === t.day;
}
function formatParts(e, t) {
  const r = Object.fromEntries(
      e.formatToParts(t).map(({ type: n, value: i }) => [n, i]),
    ),
    s = parsePart(r.year || r.relatedYear);
  return {
    year: s,
    month:
      e.resolvedOptions().calendar === 'hebrew'
        ? parseHebrewMonth(r.month, s)
        : parsePart(r.month),
    day: parsePart(r.day),
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
    month: 'numeric',
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
    o = s.getTime() + n * dayMilliseconds$1;
  for (let a = i; a <= o; a += dayMilliseconds$1) {
    const l = new Date(a);
    if (sameDate(formatParts(e, l), r)) return l;
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
      const i = formatParts(r, s),
        o = i.month + n,
        a = i.year + Math.floor((o - 1) / 12),
        l = ((((o - 1) % 12) + 12) % 12) + 1,
        d = Math.min(
          i.day,
          (() => {
            const c = findGregorianDate(r, e, { year: a, month: l, day: 1 });
            let f = 1;
            for (
              ;
              sameDate(
                formatParts(r, new Date(c.getTime() + f * dayMilliseconds$1)),
                { year: a, month: l, day: f + 1 },
              );

            )
              f += 1;
            return f;
          })(),
        );
      return findGregorianDate(r, e, { ...i, year: a, month: l, day: d });
    },
    daysInMonth(s, n) {
      const i = findGregorianDate(r, e, { year: s, month: n, day: 1 });
      let o = 1;
      for (
        ;
        sameDate(
          formatParts(r, new Date(i.getTime() + o * dayMilliseconds$1)),
          { year: s, month: n, day: o + 1 },
        );

      )
        o += 1;
      return o;
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
        o = i % 2 === 1 ? 30 : 29;
      return this.fromParts({
        ...r,
        year: n,
        month: i,
        day: Math.min(r.day, o),
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
      return (i, o) => (
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
            ...(o[0] ||
              (o[0] = [
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
        currentLocale:
          this.locale || this.defaultLocaleForCalendar(this.calendar),
        interval: null,
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
            o = n.month,
            a = this.calendarDayDate(s, 1);
          r = this.calendarWeekdayOffset(a);
          let l = this.calendarDaysInMonth(i, o);
          const d = Math.ceil((l + r) / 7),
            c = [];
          let f = 1;
          for (let w = 0; w < d; w++) {
            c[w] = [];
            for (let k = 0; k < 7; k++)
              if (r) ((c[w][k] = { empty: !0 }), --r);
              else if (l) {
                const N = this.calendarDayDate(s, f);
                ((c[w][k] = {
                  friday: this.calendarWeekendDays.includes(
                    new Date(this.getDateTimestamp(N)).getDay(),
                  ),
                  weekend: this.calendarWeekendDays.includes(
                    new Date(this.getDateTimestamp(N)).getDay(),
                  ),
                  raw: N,
                  startRange:
                    this.selectedDates[0] &&
                    this.isSameCalendarDate(this.selectedDates[0], N),
                  endRange:
                    this.selectedDates[1] &&
                    this.isSameCalendarDate(this.selectedDates[1], N),
                  inRange:
                    this.selectedDates.length == 2 &&
                    this.isBetweenSelectedDates(N),
                  disabled: !this.checkDate(N, 'date') || this.isInDisable(N),
                  today: this.isToday(N),
                  val: f++,
                }),
                  --l);
              } else c[w][k] = { empty: !0 };
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
              : i.some((o) => this.validate(o, t)) &&
                !this.isDisableBetween(...i),
          n = (i, o = !1) => {
            for (const a in i) {
              const l = o
                ? i[a].map((d) =>
                    t == 'date' ? r.clone().fromJalali(d) : r.clone().time(d),
                  )
                : i[a];
              s(l) &&
                (e[a] =
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
      (window.addEventListener('resize', () => {
        this.documentWidth = window.innerWidth;
      }),
        this.type != 'date' && this.onDisplay.time(this.core),
        (this.showDatePicker = this.show));
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
                  'Adar',
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
          const a =
            this.currentLocale === 'fa'
              ? 'ماه'
              : this.currentLocale === 'ar'
                ? 'الشهر'
                : 'Month';
          return Array.from({ length: 12 }, (l, d) => `${a} ${d + 1}`);
        }
        const r = this.activeCalendar === 'hebrew' ? t.hebrew.length : 12,
          s = [],
          n =
            this.activeCalendar === 'buddhist'
              ? 'buddhist'
              : this.activeCalendar === 'hebrew'
                ? 'hebrew'
                : 'gregory',
          i = `${this.currentLocale}-u-ca-${n}-nu-latn`,
          o = new Intl.DateTimeFormat(i, { month: 'long', timeZone: 'UTC' });
        for (let a = 1; a <= r; a++)
          try {
            const l = this.calendarAdapter
              ? this.calendarAdapter.fromParts({
                  year: e || 1,
                  month: a,
                  day: 1,
                })
              : new Date(
                  Date.UTC(
                    (e || 1970) -
                      (this.activeCalendar === 'buddhist' ? 543 : 0),
                    a - 1,
                    1,
                  ),
                );
            s.push(o.format(l));
          } catch {
            break;
          }
        return s.length ? s : t.hebrew || this.lang.months;
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
      calendarDaysInMonth(e, t) {
        return this.calendarAdapter
          ? this.calendarAdapter.daysInMonth(e, t)
          : this.core.getDaysInMonth(e, t);
      },
      calendarWeekdayOffset(e) {
        return (
          (new Date(this.getDateTimestamp(e)).getDay() -
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
        return r.year === s.year && r.month === s.month && r.day === s.day;
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
          n = (o, a = 2) => String(o).padStart(a, '0'),
          i = this.monthNamesForYear(s.year)[s.month - 1] || `Month ${s.month}`;
        return t
          .replace('?MMMM', i)
          .replace('MMMM', i)
          .replace('YYYY', String(s.year))
          .replace('YY', String(s.year).slice(-2))
          .replace('MM', n(s.month))
          .replace('M', String(s.month))
          .replace('DD', n(s.day))
          .replace('D', String(s.day))
          .replace('HH', n(s.hour || 0))
          .replace('H', String(s.hour || 0))
          .replace('mm', n(s.minute || 0))
          .replace('m', String(s.minute || 0))
          .replace('ss', n(s.second || 0))
          .replace('s', String(s.second || 0));
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
          o = (a, l = 2) => String(a).padStart(l, '0');
        return this.formats.model
          .replace('YYYY', String(i.year))
          .replace('YY', String(i.year).slice(-2))
          .replace('MM', o(i.month))
          .replace('M', String(i.month))
          .replace('DD', o(i.day))
          .replace('D', String(i.day))
          .replace('HH', o(i.hour || 0))
          .replace('H', String(i.hour || 0))
          .replace('mm', o(i.minute || 0))
          .replace('m', String(i.minute || 0))
          .replace('ss', o(i.second || 0))
          .replace('s', String(i.second || 0));
      },
      parseCalendarParts(e) {
        const t = e
          .split(/[-/ .,\\:]/)
          .filter(Boolean)
          .map(Number);
        return {
          year: t[0],
          month: t[1] || 1,
          day: t[2] || 1,
          hour: t[3] || 0,
          minute: t[4] || 0,
          second: t[5] || 0,
        };
      },
      parseCalendarDate(e) {
        if (this.calendarAdapter)
          return this.fromCalendarParts(this.parseCalendarParts(e));
        const t = this.core.clone(),
          r = this.calendar === 'gregorian' ? 'gregorian' : 'jalali';
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
            (document.querySelector('.pdp-day.today').classList.add('tada'),
              setTimeout(() => {
                document
                  .querySelector('.pdp-day.today')
                  .classList.remove('tada');
              }, 1e3));
          });
      },
      checkDate(e, t) {
        if (this.calendarAdapter) {
          const n = Core.isPersianDate(e) ? e : this.parseCalendarDate(e),
            i = this.getDateTimestamp(n),
            o = this.getDateTimestamp(this.fromDate),
            a = this.getDateTimestamp(this.toDate);
          if (t === 'year' || t === 'month' || t === 'date') {
            const l = this.getDayTimestamp(n);
            return (
              l <= this.getDayTimestamp(this.toDate) &&
              l >= this.getDayTimestamp(this.fromDate)
            );
          }
          return i >= o && i <= a;
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
        if (
          ((t = t || this.disable),
          (e = Core.isPersianDate(e) ? e.clone() : this.core.clone().parse(e)),
          this.calendarAdapter && Core.isString(t))
        ) {
          const r = this.parseCalendarDate(t);
          return this.type === 'time'
            ? e.hour() === r.hour() && e.minute() === r.minute()
            : e.clone().startOf('date').isSame(r.clone().startOf('date'));
        }
        if (Core.isString(t))
          return (
            this.type == 'time' && (t = e.toString() + ' ' + t),
            e.calendar('jalali').isSame(t)
          );
        if (t instanceof RegExp) {
          if (this.calendarAdapter)
            return t.test(this.formatDateValue(e, this.formats.input));
          const r = {
            date: 'jYYYY/jM/jD',
            datetime: 'jYYYY/jM/jD H:m',
            time: 'H:m',
          };
          return t.test(e.toString(r[this.type]));
        } else
          return Core.isFunction(t)
            ? t(e)
            : Array.isArray(t)
              ? t.some((r) => {
                  if (Core.isString(r))
                    return this.calendarAdapter
                      ? this.isSameCalendarDate(e, this.parseCalendarDate(r))
                      : (this.type == 'time' && (r = e.toString() + ' ' + r),
                        e.calendar('jalali').isSame(r));
                  if (r instanceof RegExp) {
                    if (this.calendarAdapter)
                      return r.test(
                        this.formatDateValue(e, this.formats.input),
                      );
                    const s = {
                      date: 'jYYYY/jM/jD',
                      datetime: 'jYYYY/jM/jD H:m',
                      time: 'H:m',
                    };
                    return r.test(e.toString(s[this.type]));
                  }
                })
              : !1;
      },
      showPicker(e, t) {
        if (this.clickOn == 'all' || this.clickOn == e) {
          const r = this.inputs[t];
          (this.dualInput && (this.inputName = r),
            this.$refs.inputs[t].focus(),
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
          let s = document.querySelectorAll('.pdp .pdp-day.hover');
          if (
            (s.length ||
              (s = document.querySelectorAll(
                '.pdp .pdp-day.start-range,.pdp .pdp-day.end-range',
              )),
            (s = s[s.length - 1]),
            s)
          ) {
            let n = this.getColumn(s);
            s.classList.remove('hover');
            const i = this.onDisplay.toString(),
              o = this.onDisplay.clone().addMonth(n);
            let a = o.date(s.innerText).addDay(r);
            if (!this.checkDate(a, 'date')) return s.classList.add('hover');
            ((a = a.date()),
              (n = o.diff(i, 'month')),
              n < 0
                ? (this.onDisplay.subMonth(this.columnCount),
                  (n = this.columnCount - 1))
                : n >= this.columnCount &&
                  (this.onDisplay.addMonth(this.columnCount), (n = 0)),
              await this.$nextTick(),
              (s = document.querySelector(
                `.pdp .pdp-main .pdp-column[data-column='${n}'] .pdp-day[value='${a}']`,
              )),
              s.classList.add('hover'));
          } else
            ((s = document.querySelector(
              '.pdp .pdp-day:not(.empty):not(.disabled)',
            )),
              s ||
                (s = document.querySelector(
                  `.pdp .pdp-main .pdp-column[data-column="0"] .pdp-day[value="${this.fromDate.date()}"]`,
                )),
              s.classList.add('hover'));
          this.mode === 'range' &&
            this.selectedDates.length == 1 &&
            this.selectInRangeDate({ target: s });
        } else if (e.key == 'Enter') {
          e.preventDefault();
          const t = document.querySelector('.pdp .pdp-day.hover');
          if (t)
            this.selectDate(
              this.onDisplay
                .clone()
                .addMonth(this.getColumn(t) || 0)
                .date(t.innerText),
              'date',
            );
          else {
            let r;
            this.displayValue.forEach((s, n) => {
              if (!s) return !1;
              if (this.type == 'time') {
                const i = s.split(/[/ -.,:\\]/);
                (this.checkDate(this.core.clone(), 'time')
                  ? (r = this.core.clone())
                  : (r = this.fromDate.clone()),
                  r.time(i));
              } else r = this.core.clone().parse(s);
              if (this.selectDate(r, 'time') === 0) {
                const i = r.diff(this.onDisplay, 'month');
                ((i < 0 || i >= this.columnCount) &&
                  (this.onDisplay = r.clone()),
                  (this.displayValue[n] = ''));
              }
            });
          }
        }
      },
      selectInRangeDate(e) {
        const t = e.target;
        if (!t.classList.contains('pdp-day')) return;
        document.querySelectorAll('.pdp .pdp-day').forEach((a) => {
          a.classList.remove('in-range');
        });
        let r = this.getColumn(t);
        const s = this.onDisplay
            .clone()
            .startOf('date')
            .addMonth(r)
            .date(t.innerText),
          n = this.selectedDates[0].clone().startOf('date'),
          i = s.isAfter(n) ? 1 : -1,
          o = document.querySelector('.pdp-day.start-range,.pdp-day.end-range');
        for (
          o
            ? ((r = +this.getColumn(o)),
              o.classList.replace(
                ...(s.isBefore(n)
                  ? ['start-range', 'end-range']
                  : ['end-range', 'start-range']),
              ))
            : (n.parse(this.onDisplay),
              i === 1
                ? (n.startOf('month').subDay(), (r = -1))
                : (n
                    .addMonth(this.columnCount - 1)
                    .endOf('month')
                    .addDay()
                    .startOf('date'),
                  (r = this.columnCount)));
          !s.isSame(n);

        ) {
          const a = n.month();
          if (
            (n.addDay(i),
            a != n.month() && (r += i),
            this.checkDate(n, 'date') && !this.isInDisable(n))
          )
            document
              .querySelector(
                `.pdp-column[data-column='${r}'] .pdp-day[value='${n.date()}']`,
              )
              .classList.add('in-range');
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
        ((this.pickerPlace = { top: !1, left: !1, right: !1 }),
          this.$nextTick(() => {
            const e = this.$refs.inputs[0],
              t = e.offsetHeight + e.getBoundingClientRect().top,
              r = this.$refs.pdpPicker,
              s = r.offsetHeight + 10,
              n = r.getBoundingClientRect();
            this.pickerPlace = {
              top: t >= s && window.innerHeight - (t + s) < 0,
              left: n.left <= 0,
              right: window.innerWidth - (n.left + n.width) <= 0,
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
          o = t == 'hour' ? this.hourStepCount : this.minuteStepCount;
        const a = () => {
          (r == 'add'
            ? ((i = i + o), i > n && (i = 0))
            : ((i = i - o), i < 0 && (i = n)),
            this.checkDate(s[t](i), 'time')
              ? this.selectedTimes.length == 2 &&
                this.selectedTimes[0].isAfter(this.selectedTimes[1]) &&
                s.parse(e == 0 ? this.selectedTimes[1] : this.selectedTimes[0])
              : s.parse(
                  s.isSameOrAfter(this.toDate.clone())
                    ? this.toDate.clone()
                    : this.fromDate.clone(),
                ),
            this.isInDisable(s) ||
              (this.type == 'time'
                ? (this.selectedDates[e] = s)
                : this.selectedDates[e] && this.selectedDates[e].time(s),
              this.$emit('select', s),
              this.autoSubmit &&
                !this.selectedTimes.some((l) => this.isInDisable(l)) &&
                this.submitDate(!1)));
        };
        (a(), (this.interval = setInterval(a, 300)));
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
  _hoisted_3$1 = ['onUpdate:modelValue', 'onFocus'],
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
  const o = resolveComponent('PDPIcon'),
    a = resolveComponent('PDPAlt'),
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
                                  o,
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
                      withDirectives(
                        createBaseVNode(
                          'input',
                          mergeProps(
                            {
                              ref_for: !0,
                              ref: 'inputs',
                              'onUpdate:modelValue': (f) =>
                                (e.displayValue[c] = f),
                              type: 'text',
                              autocomplete: 'off',
                            },
                            { ref_for: !0 },
                            e.attrs[d],
                            {
                              onFocus: (f) => e.showPicker('input', c),
                              onKeydown:
                                t[0] ||
                                (t[0] = (...f) =>
                                  e.selectWithArrow && e.selectWithArrow(...f)),
                            },
                          ),
                          null,
                          16,
                          _hoisted_3$1,
                        ),
                        [[vModelText, e.displayValue[c]]],
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
                                createVNode(o, { icon: 'clear' }),
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
              a,
              {
                key: 0,
                name: e.attrs.alt.name,
                format: e.formats.alt,
                dates: e.submitedValue,
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
                                              e.displayYear(e.onDisplay) == d,
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
                                      e.calendarMonthDate(e.onDisplay, -1),
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
                                                e.onDisplay,
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
                                            e.calendarMonthDate(e.onDisplay, c),
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
                                      e.calendarMonthDate(e.onDisplay, 1),
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
                                              (f, w) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'div',
                                                  {
                                                    key: w,
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
                                              (f, w) => (
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
                                                        f,
                                                        (k) => (
                                                          openBlock(),
                                                          createElementBlock(
                                                            'div',
                                                            {
                                                              key: k.raw
                                                                ? k.raw.toString()
                                                                : void 0,
                                                              class:
                                                                normalizeClass([
                                                                  'pdp-day',
                                                                  {
                                                                    empty:
                                                                      k.empty,
                                                                  },
                                                                  {
                                                                    friday:
                                                                      k.friday,
                                                                  },
                                                                  {
                                                                    weekend:
                                                                      k.weekend,
                                                                  },
                                                                  {
                                                                    today:
                                                                      k.today,
                                                                  },
                                                                  {
                                                                    'start-range':
                                                                      k.startRange,
                                                                  },
                                                                  {
                                                                    'end-range':
                                                                      k.endRange,
                                                                  },
                                                                  {
                                                                    disabled:
                                                                      k.disabled,
                                                                  },
                                                                  {
                                                                    'in-range':
                                                                      k.inRange,
                                                                  },
                                                                ]),
                                                              value: k.val,
                                                              onClick: (N) =>
                                                                e.selectDate(
                                                                  k.raw,
                                                                  'date',
                                                                ),
                                                            },
                                                            toDisplayString(
                                                              k.val,
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
                                                  (!e.checkDate(
                                                    e.selectedTimes[c],
                                                    'time',
                                                  ) ||
                                                    e.isInDisable(
                                                      e.selectedTimes[c],
                                                    )),
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
                                      (f, w) =>
                                        !f.isSame(
                                          e.selectedDates[w] &&
                                            e.selectedDates[w].toString(
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
  _hoisted_44 = { class: 'generated-code' },
  _hoisted_45 = { class: 'gallery', 'aria-labelledby': 'gallery-title' },
  _hoisted_46 = { class: 'section-heading gallery-heading' },
  _hoisted_47 = { id: 'gallery-title' },
  _hoisted_48 = { class: 'calendar-grid' },
  _hoisted_49 = ['dir'],
  _hoisted_50 = { class: 'card-header' },
  _hoisted_51 = { class: 'card-title' },
  _hoisted_52 = { class: 'card-icon' },
  _hoisted_53 = { class: 'card-picker' },
  _hoisted_54 = { class: 'card-actions' },
  _hoisted_55 = { class: 'card-value' },
  _hoisted_56 = ['onClick'],
  _hoisted_57 = { class: 'gallery' },
  _hoisted_58 = { class: 'section-heading gallery-heading' },
  _hoisted_59 = { class: 'calendar-grid' },
  _hoisted_60 = { class: 'card-header' },
  _hoisted_61 = { class: 'card-title' },
  _hoisted_62 = { class: 'card-icon' },
  _hoisted_63 = { class: 'card-picker' },
  _hoisted_64 = ['onClick'],
  _hoisted_65 = { class: 'demo-footer' },
  _hoisted_66 = ['aria-label'],
  _hoisted_67 = { class: 'modal-header' },
  _hoisted_68 = ['aria-label'],
  _hoisted_69 = { class: 'code-tabs single-code' },
  _hoisted_70 = { class: 'modal-actions' },
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
          },
        },
        s = ref('en'),
        n = ref('jalali'),
        i = ref('ummalqura'),
        o = ref('single'),
        a = ref('date'),
        l = ref('1404/01/15'),
        d = ref('1404/01/15'),
        c = reactive(Object.fromEntries(t.map(($) => [$.id, $.sample]))),
        f = ref(null),
        w = ref(!1),
        k = ref('blue'),
        N = ref(''),
        R = ref(''),
        K = ref('auto'),
        O = ref([]),
        j = ref(''),
        W = ref('2025-04-04'),
        V = ref(1),
        Y = ref(!0),
        G = ref(!0),
        U = ref(!1),
        J = ref(!1),
        se = ref(1),
        Z = ref(1),
        re = ref('all'),
        P = computed(() => r[s.value]),
        q = computed(() => t.find(($) => $.id === n.value)),
        de = computed(() => (s.value === 'en' ? 'ltr' : 'rtl')),
        pe = {
          jalali: 'fa',
          gregorian: 'en',
          hijri: 'ar',
          hebrew: 'he',
          buddhist: 'th',
          chinese: 'zh',
        };
      function z($) {
        return s.value === 'en' ? pe[$] : s.value;
      }
      const L = computed(() => [
          {
            title: P.value.time,
            type: 'time',
            mode: 'single',
            value: '14:30',
            icon: '◷',
          },
          {
            title: P.value.range,
            type: 'time',
            mode: 'range',
            value: '09:00 - 17:30',
            icon: '↔',
          },
          {
            title: P.value.datetime,
            type: 'datetime',
            mode: 'single',
            value: '2025-04-04 14:30',
            icon: '◫',
          },
        ]),
        x = ($, m = 'date', y = 'single') => ({
          title: `${$.title[s.value]} · ${m}`,
          html: `<DatePicker
  v-model="value"
  calendar="${$.id}"
  type="${m}"
  mode="${y}"
  ${
    $.id === 'hijri'
      ? `hijri-provider="ummalqura"
  `
      : ''
  }/>`,
        }),
        ae = computed(() => {
          const $ = q.value;
          return [
            '<DatePicker',
            '  v-model="value"',
            `  calendar="${$.id}"`,
            `  type="${a.value}"`,
            `  mode="${o.value}"`,
            `  locale="${j.value || z($.id)}"`,
            `  :column="${V.value}"`,
            `  color="${k.value}"`,
            `  week-starts-on="${K.value}"`,
            `  click-on="${re.value}"`,
            `  :minute-step="${se.value}"`,
            `  :hour-step="${Z.value}"`,
            Y.value ? '  clearable' : '  :clearable="false"',
            G.value ? '  auto-submit' : '  :auto-submit="false"',
            U.value ? '  icon-inside' : '',
            J.value ? '  dual-input' : '',
            N.value ? `  from="${N.value}"` : '',
            R.value ? `  to="${R.value}"` : '',
            O.value.length ? `  :weekend-days="[${O.value.join(', ')}]"` : '',
            $.id === 'hijri' ? '  hijri-provider="ummalqura"' : '',
            '/>',
          ].filter(Boolean).join(`
`);
        });
      function ce($) {
        l.value = o.value === 'range' ? [$, $] : $;
      }
      function le() {
        return a.value === 'time'
          ? '14:30'
          : a.value === 'datetime'
            ? `${d.value} 14:30`
            : d.value;
      }
      (watch(n, ($) => {
        const m = t.find((y) => y.id === $).sample;
        ((d.value = m),
          ce(m),
          (a.value = 'date'),
          (N.value = ''),
          (R.value = ''),
          (K.value = 'auto'),
          (O.value = []));
      }),
        watch(i, () => {
          n.value === 'hijri' && ((d.value = '1446-10-06'), ce('1446-10-06'));
        }),
        watch(a, ($) => {
          let m = d.value;
          ($ === 'time'
            ? (m = '14:30')
            : $ === 'datetime' && (m = `${d.value} 14:30`),
            $ === 'time' && o.value === 'range' ? (l.value = void 0) : ce(m));
        }),
        watch(o, ($) => {
          $ === 'range'
            ? a.value === 'time'
              ? (l.value = void 0)
              : Array.isArray(l.value) || (l.value = [l.value, l.value])
            : Array.isArray(l.value) && (l.value = l.value[0] || le());
        }));
      function ee($) {
        ((f.value = $), (w.value = !1));
      }
      async function me() {
        f.value &&
          (await navigator.clipboard?.writeText(f.value.html), (w.value = !0));
      }
      function ge() {
        ((s.value = 'en'),
          (n.value = 'jalali'),
          (i.value = 'ummalqura'),
          (o.value = 'single'),
          (a.value = 'date'),
          (d.value = '1404/01/15'),
          (l.value = '1404/01/15'),
          (k.value = 'blue'),
          (N.value = ''),
          (R.value = ''),
          (K.value = 'auto'),
          (O.value = []),
          (j.value = ''),
          (W.value = '2025-04-04'),
          (V.value = 1),
          (Y.value = !0),
          (G.value = !0),
          (U.value = !1),
          (J.value = !1),
          (se.value = 1),
          (Z.value = 1),
          (re.value = 'all'));
      }
      return ($, m) => (
        openBlock(),
        createElementBlock(
          'main',
          { class: 'demo-shell', dir: de.value },
          [
            createBaseVNode('nav', _hoisted_2, [
              (openBlock(),
              createElementBlock(
                Fragment,
                null,
                renderList(['fa', 'en', 'ar'], (y) =>
                  createBaseVNode(
                    'button',
                    {
                      key: y,
                      type: 'button',
                      class: normalizeClass({ selected: s.value === y }),
                      onClick: (ue) => (s.value = y),
                    },
                    toDisplayString(
                      y === 'fa' ? 'فارسی' : y === 'en' ? 'English' : 'العربية',
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
                  m[29] ||
                    (m[29] = createBaseVNode(
                      'span',
                      { class: 'eyebrow-dot' },
                      null,
                      -1,
                    )),
                  createTextVNode(toDisplayString(P.value.eyebrow), 1),
                ]),
                createBaseVNode('h1', null, toDisplayString(P.value.title), 1),
                createBaseVNode('p', null, [
                  createTextVNode(toDisplayString(P.value.intro) + ' ', 1),
                  m[30] ||
                    (m[30] = createBaseVNode(
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
                    renderList(t, (y) =>
                      createBaseVNode(
                        'span',
                        { key: y.id },
                        toDisplayString(y.title[s.value]),
                        1,
                      ),
                    ),
                    64,
                  )),
                ]),
              ]),
              m[31] ||
                (m[31] = createBaseVNode(
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
                  m[32] ||
                    (m[32] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'PLAYGROUND',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    _hoisted_10,
                    toDisplayString(P.value.playground),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'button',
                  { class: 'reset-button', type: 'button', onClick: ge },
                  toDisplayString(P.value.reset),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_11, [
                createBaseVNode('aside', _hoisted_12, [
                  createBaseVNode('div', _hoisted_13, [
                    createBaseVNode(
                      'label',
                      _hoisted_14,
                      toDisplayString(P.value.active),
                      1,
                    ),
                    withDirectives(
                      createBaseVNode(
                        'select',
                        {
                          id: 'calendar-select',
                          'onUpdate:modelValue':
                            m[0] || (m[0] = (y) => (n.value = y)),
                        },
                        [
                          (openBlock(),
                          createElementBlock(
                            Fragment,
                            null,
                            renderList(t, (y) =>
                              createBaseVNode(
                                'option',
                                { key: y.id, value: y.id },
                                toDisplayString(y.title[s.value]) +
                                  ' — ' +
                                  toDisplayString(y.subtitle),
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
                          toDisplayString(P.value.provider),
                          1,
                        ),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              id: 'hijri-provider',
                              'onUpdate:modelValue':
                                m[1] || (m[1] = (y) => (i.value = y)),
                            },
                            [
                              ...(m[33] ||
                                (m[33] = [
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
                      toDisplayString(P.value.type),
                      1,
                    ),
                    createBaseVNode('label', _hoisted_19, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[2] || (m[2] = (y) => (a.value = y)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'date',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, a.value]],
                      ),
                      createTextVNode(toDisplayString(P.value.date), 1),
                    ]),
                    createBaseVNode('label', _hoisted_20, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[3] || (m[3] = (y) => (a.value = y)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'time',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, a.value]],
                      ),
                      createTextVNode(toDisplayString(P.value.time), 1),
                    ]),
                    createBaseVNode('label', _hoisted_21, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[4] || (m[4] = (y) => (a.value = y)),
                            name: 'picker-type',
                            type: 'radio',
                            value: 'datetime',
                          },
                          null,
                          512,
                        ),
                        [[vModelRadio, a.value]],
                      ),
                      createTextVNode(toDisplayString(P.value.datetime), 1),
                    ]),
                  ]),
                  createBaseVNode('fieldset', _hoisted_22, [
                    createBaseVNode(
                      'legend',
                      null,
                      toDisplayString(P.value.playground),
                      1,
                    ),
                    createBaseVNode('label', _hoisted_23, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[5] || (m[5] = (y) => (o.value = y)),
                            name: 'playground-mode',
                            type: 'radio',
                            value: 'single',
                            onChange:
                              m[6] || (m[6] = (y) => (o.value = 'single')),
                          },
                          null,
                          544,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(P.value.single), 1),
                    ]),
                    createBaseVNode('label', _hoisted_24, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue':
                              m[7] || (m[7] = (y) => (o.value = y)),
                            name: 'playground-mode',
                            type: 'radio',
                            value: 'range',
                            onChange:
                              m[8] || (m[8] = (y) => (o.value = 'range')),
                          },
                          null,
                          544,
                        ),
                        [[vModelRadio, o.value]],
                      ),
                      createTextVNode(toDisplayString(P.value.range), 1),
                    ]),
                  ]),
                  createBaseVNode('details', _hoisted_25, [
                    m[56] ||
                      (m[56] = createBaseVNode(
                        'summary',
                        null,
                        'ADVANCED PROPS',
                        -1,
                      )),
                    createBaseVNode('div', _hoisted_26, [
                      createBaseVNode('label', null, [
                        m[35] || (m[35] = createTextVNode('Color', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[9] || (m[9] = (y) => (k.value = y)),
                            },
                            [
                              ...(m[34] ||
                                (m[34] = [
                                  createBaseVNode('option', null, 'blue', -1),
                                  createBaseVNode('option', null, 'red', -1),
                                  createBaseVNode('option', null, 'green', -1),
                                  createBaseVNode('option', null, 'purple', -1),
                                  createBaseVNode('option', null, 'gray', -1),
                                ])),
                            ],
                            512,
                          ),
                          [[vModelSelect, k.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[37] || (m[37] = createTextVNode('Locale', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[10] || (m[10] = (y) => (j.value = y)),
                            },
                            [
                              ...(m[36] ||
                                (m[36] = [
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
                        m[38] || (m[38] = createTextVNode('From', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[11] || (m[11] = (y) => (N.value = y)),
                              placeholder: q.value.from,
                            },
                            null,
                            8,
                            _hoisted_27,
                          ),
                          [[vModelText, N.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[39] || (m[39] = createTextVNode('To', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[12] || (m[12] = (y) => (R.value = y)),
                              placeholder: q.value.to,
                            },
                            null,
                            8,
                            _hoisted_28,
                          ),
                          [[vModelText, R.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[41] || (m[41] = createTextVNode('Months shown', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[13] || (m[13] = (y) => (V.value = y)),
                            },
                            [
                              ...(m[40] ||
                                (m[40] = [
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
                          [[vModelSelect, V.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[43] || (m[43] = createTextVNode('Week starts', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[14] || (m[14] = (y) => (K.value = y)),
                            },
                            [
                              ...(m[42] ||
                                (m[42] = [
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
                          [[vModelSelect, K.value]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[45] || (m[45] = createTextVNode('Click on', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue':
                                m[15] || (m[15] = (y) => (re.value = y)),
                            },
                            [
                              ...(m[44] ||
                                (m[44] = [
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
                        m[46] || (m[46] = createTextVNode('Minute step', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[16] || (m[16] = (y) => (se.value = y)),
                              type: 'number',
                              min: '1',
                              max: '60',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, se.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      createBaseVNode('label', null, [
                        m[47] || (m[47] = createTextVNode('Hour step', -1)),
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[17] || (m[17] = (y) => (Z.value = y)),
                              type: 'number',
                              min: '1',
                              max: '24',
                            },
                            null,
                            512,
                          ),
                          [[vModelText, Z.value, void 0, { number: !0 }]],
                        ),
                      ]),
                      m[55] ||
                        (m[55] = createBaseVNode(
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
                                m[18] || (m[18] = (y) => (O.value = y)),
                              type: 'checkbox',
                              value: 0,
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, O.value]],
                        ),
                        m[48] || (m[48] = createTextVNode('Sunday', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_30, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[19] || (m[19] = (y) => (O.value = y)),
                              type: 'checkbox',
                              value: 5,
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, O.value]],
                        ),
                        m[49] || (m[49] = createTextVNode('Friday', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_31, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[20] || (m[20] = (y) => (O.value = y)),
                              type: 'checkbox',
                              value: 6,
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, O.value]],
                        ),
                        m[50] || (m[50] = createTextVNode('Saturday', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_32, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[21] || (m[21] = (y) => (Y.value = y)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, Y.value]],
                        ),
                        m[51] || (m[51] = createTextVNode('Clearable', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_33, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[22] || (m[22] = (y) => (G.value = y)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, G.value]],
                        ),
                        m[52] || (m[52] = createTextVNode('Auto submit', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_34, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[23] || (m[23] = (y) => (U.value = y)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, U.value]],
                        ),
                        m[53] || (m[53] = createTextVNode('Icon inside', -1)),
                      ]),
                      createBaseVNode('label', _hoisted_35, [
                        withDirectives(
                          createBaseVNode(
                            'input',
                            {
                              'onUpdate:modelValue':
                                m[24] || (m[24] = (y) => (J.value = y)),
                              type: 'checkbox',
                            },
                            null,
                            512,
                          ),
                          [[vModelCheckbox, J.value]],
                        ),
                        m[54] || (m[54] = createTextVNode('Dual input', -1)),
                      ]),
                    ]),
                  ]),
                  createBaseVNode('div', _hoisted_36, [
                    m[57] ||
                      (m[57] = createBaseVNode('strong', null, 'API', -1)),
                    createBaseVNode('p', null, toDisplayString(P.value.api), 1),
                  ]),
                ]),
                createBaseVNode('div', _hoisted_37, [
                  createBaseVNode('div', _hoisted_38, [
                    createBaseVNode('div', null, [
                      createBaseVNode(
                        'span',
                        _hoisted_39,
                        toDisplayString(q.value.icon),
                        1,
                      ),
                      createBaseVNode('div', null, [
                        createBaseVNode(
                          'span',
                          _hoisted_40,
                          toDisplayString(P.value.active),
                          1,
                        ),
                        createBaseVNode(
                          'h3',
                          null,
                          toDisplayString(q.value.title[s.value]),
                          1,
                        ),
                      ]),
                    ]),
                    createBaseVNode('span', _hoisted_41, [
                      m[58] || (m[58] = createBaseVNode('i', null, null, -1)),
                      createTextVNode(toDisplayString(P.value.ready), 1),
                    ]),
                  ]),
                  createBaseVNode(
                    'div',
                    { class: 'picker-wrap', dir: q.value.direction },
                    [
                      (openBlock(),
                      createBlock(
                        DatePicker,
                        {
                          key: `${n.value}-${i.value}-${o.value}-${a.value}-${s.value}`,
                          modelValue: l.value,
                          'onUpdate:modelValue':
                            m[25] || (m[25] = (y) => (l.value = y)),
                          calendar: n.value,
                          format:
                            n.value === 'jalali' ? 'jYYYY/jMM/jDD' : void 0,
                          'hijri-provider': i.value,
                          mode: o.value,
                          type: a.value,
                          locale: j.value || z(n.value),
                          column: V.value,
                          from: N.value || q.value.from,
                          to: R.value || q.value.to,
                          'week-starts-on': K.value,
                          'weekend-days': O.value.length ? O.value : void 0,
                          color: k.value,
                          'click-on': re.value,
                          'minute-step': se.value,
                          'hour-step': Z.value,
                          'icon-inside': U.value,
                          'dual-input': J.value,
                          'auto-submit': G.value,
                          clearable: Y.value,
                          label: `${P.value.active} ${q.value.title[s.value]}`,
                        },
                        null,
                        8,
                        [
                          'modelValue',
                          'calendar',
                          'format',
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
                      toDisplayString(P.value.value),
                      1,
                    ),
                    createBaseVNode(
                      'code',
                      null,
                      toDisplayString(l.value || '—'),
                      1,
                    ),
                  ]),
                  createBaseVNode('div', _hoisted_44, [
                    m[59] || (m[59] = createBaseVNode('h4', null, 'HTML', -1)),
                    createBaseVNode('pre', null, [
                      createBaseVNode(
                        'code',
                        null,
                        toDisplayString(ae.value),
                        1,
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ]),
            createBaseVNode('section', _hoisted_45, [
              createBaseVNode('div', _hoisted_46, [
                createBaseVNode('div', null, [
                  m[60] ||
                    (m[60] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'CALENDAR GALLERY',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    _hoisted_47,
                    toDisplayString(P.value.gallery),
                    1,
                  ),
                ]),
                createBaseVNode(
                  'p',
                  null,
                  toDisplayString(P.value.galleryHint),
                  1,
                ),
              ]),
              createBaseVNode('div', _hoisted_48, [
                (openBlock(),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(t, (y) =>
                    createBaseVNode(
                      'article',
                      { key: y.id, class: 'calendar-card', dir: y.direction },
                      [
                        createBaseVNode('div', _hoisted_50, [
                          createBaseVNode('div', _hoisted_51, [
                            createBaseVNode(
                              'span',
                              _hoisted_52,
                              toDisplayString(y.icon),
                              1,
                            ),
                            createBaseVNode('div', null, [
                              createBaseVNode(
                                'h3',
                                null,
                                toDisplayString(y.title[s.value]),
                                1,
                              ),
                              createBaseVNode(
                                'p',
                                null,
                                toDisplayString(y.subtitle),
                                1,
                              ),
                            ]),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_53, [
                          (openBlock(),
                          createBlock(
                            DatePicker,
                            {
                              key: `${y.id}-${s.value}`,
                              modelValue: c[y.id],
                              'onUpdate:modelValue': (ue) => (c[y.id] = ue),
                              calendar: y.id,
                              from: y.from,
                              to: y.to,
                              'hijri-provider': i.value,
                              locale: z(y.id),
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
                        createBaseVNode('div', _hoisted_54, [
                          createBaseVNode('div', _hoisted_55, [
                            createBaseVNode(
                              'span',
                              null,
                              toDisplayString(P.value.output),
                              1,
                            ),
                            createBaseVNode(
                              'code',
                              null,
                              toDisplayString(y.sample),
                              1,
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: (ue) => ee(x(y)),
                            },
                            toDisplayString(P.value.code) + ' · HTML ',
                            9,
                            _hoisted_56,
                          ),
                        ]),
                      ],
                      8,
                      _hoisted_49,
                    ),
                  ),
                  64,
                )),
              ]),
            ]),
            createBaseVNode('section', _hoisted_57, [
              createBaseVNode('div', _hoisted_58, [
                createBaseVNode('div', null, [
                  m[61] ||
                    (m[61] = createBaseVNode(
                      'span',
                      { class: 'section-kicker' },
                      'TIME & RANGE',
                      -1,
                    )),
                  createBaseVNode(
                    'h2',
                    null,
                    toDisplayString(P.value.timeSamples),
                    1,
                  ),
                ]),
              ]),
              createBaseVNode('div', _hoisted_59, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    L.value,
                    (y) => (
                      openBlock(),
                      createElementBlock(
                        'article',
                        { key: y.title, class: 'calendar-card' },
                        [
                          createBaseVNode('div', _hoisted_60, [
                            createBaseVNode('div', _hoisted_61, [
                              createBaseVNode(
                                'span',
                                _hoisted_62,
                                toDisplayString(y.icon),
                                1,
                              ),
                              createBaseVNode('div', null, [
                                createBaseVNode(
                                  'h3',
                                  null,
                                  toDisplayString(y.title),
                                  1,
                                ),
                                createBaseVNode(
                                  'p',
                                  null,
                                  toDisplayString(
                                    y.mode === 'range'
                                      ? P.value.range
                                      : P.value.single,
                                  ),
                                  1,
                                ),
                              ]),
                            ]),
                          ]),
                          createBaseVNode('div', _hoisted_63, [
                            createVNode(
                              DatePicker,
                              {
                                type: y.type,
                                mode: y.mode,
                                'model-value': y.value,
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
                              onClick: (ue) => ee(x(q.value, y.type, y.mode)),
                            },
                            toDisplayString(P.value.code),
                            9,
                            _hoisted_64,
                          ),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            createBaseVNode('footer', _hoisted_65, [
              createBaseVNode('span', null, toDisplayString(P.value.title), 1),
              m[62] ||
                (m[62] = createBaseVNode(
                  'code',
                  null,
                  '@h-sanadgol/vue3-multi-calendar-datepicker',
                  -1,
                )),
            ]),
            f.value
              ? (openBlock(),
                createElementBlock(
                  'div',
                  {
                    key: 0,
                    class: 'code-modal-backdrop',
                    role: 'presentation',
                    onClick:
                      m[28] ||
                      (m[28] = withModifiers(
                        (y) => (f.value = null),
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
                        'aria-label': f.value.title,
                      },
                      [
                        createBaseVNode('div', _hoisted_67, [
                          createBaseVNode('div', null, [
                            m[63] ||
                              (m[63] = createBaseVNode(
                                'span',
                                { class: 'section-kicker' },
                                'CODE SAMPLE',
                                -1,
                              )),
                            createBaseVNode(
                              'h2',
                              null,
                              toDisplayString(f.value.title),
                              1,
                            ),
                          ]),
                          createBaseVNode(
                            'button',
                            {
                              class: 'modal-close',
                              type: 'button',
                              'aria-label': P.value.close,
                              onClick:
                                m[26] || (m[26] = (y) => (f.value = null)),
                            },
                            ' × ',
                            8,
                            _hoisted_68,
                          ),
                        ]),
                        createBaseVNode('div', _hoisted_69, [
                          createBaseVNode('div', null, [
                            m[64] ||
                              (m[64] = createBaseVNode('h3', null, 'HTML', -1)),
                            createBaseVNode('pre', null, [
                              createBaseVNode(
                                'code',
                                null,
                                toDisplayString(f.value.html),
                                1,
                              ),
                            ]),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_70, [
                          createBaseVNode(
                            'button',
                            {
                              class: 'code-button',
                              type: 'button',
                              onClick: me,
                            },
                            toDisplayString(
                              w.value ? P.value.copied : P.value.copy,
                            ),
                            1,
                          ),
                          createBaseVNode(
                            'button',
                            {
                              class: 'reset-button',
                              type: 'button',
                              onClick:
                                m[27] || (m[27] = (y) => (f.value = null)),
                            },
                            toDisplayString(P.value.close),
                            1,
                          ),
                        ]),
                      ],
                      8,
                      _hoisted_66,
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
