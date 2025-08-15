/* esm.sh - esbuild bundle(react-dom@19.1.1/client) */
import {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
} from "react";
var pe = Object.create;
var G = Object.defineProperty;
var fe = Object.getOwnPropertyDescriptor;
var he = Object.getOwnPropertyNames;
var me = Object.getPrototypeOf, ge = Object.prototype.hasOwnProperty;
var ye = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var ve = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of he(t))
      !ge.call(e, o) && o !== n && G(e, o, { get: () => t[o], enumerable: !(r = fe(t, o)) || r.enumerable });
  return e;
};
var we = (e, t, n) => (n = e != null ? pe(me(e)) : {}, ve(t || !e || !e.__esModule ? G(n, "default", { value: e, enumerable: !0 }) : n, e));
var ke = ye((e, t) => {
  t.exports = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
});
var I = {};
G(I, "createPortal", {
  enumerable: !0,
  get: () => Te
});
G(I, "createRoot", {
  enumerable: !0,
  get: () => Ee
});
G(I, "findDOMNode", {
  enumerable: !0,
  get: () => Se
});
G(I, "flushSync", {
  enumerable: !0,
  get: () => xe
});
G(I, "hydrateRoot", {
  enumerable: !0,
  get: () => Ce
});
G(I, "unstable_batchedUpdates", {
  enumerable: !0,
  get: () => Oe
});
G(I, "unstable_createPortal", {
  enumerable: !0,
  get: () => Re
});
G(I, "unstable_renderSubtreeIntoContainer", {
  enumerable: !0,
  get: () => _e
});
G(I, "version", {
  enumerable: !0,
  get: () => Pe
});
var d, c, f, p, m, g;
function k(e) {
  return e;
}
var w = "function" === typeof Bun && Bun.version ? k : function(e, t) {
  return e.length === t.length ? !1 : !0;
}, S = k(function(e) {
  return w(e, e);
});
var C = Object.assign;
var E = "function" === typeof Bun && Bun.version ? k : function(e, t) {
  return Object.is(e, t) || Object.is(e, NaN) && Object.is(t, NaN);
}, L = we(ke()), A = L.default;
A = A.ReactCurrentDispatcher;
var T = L.default;
T = T.ReactCurrentBatchConfig;
var M = L.default;
M = M.ReactCurrentOwner;
var O = L.default;
O = O.ReactDebugCurrentFrame;
var R = L.default;
R = R.ContextRegistry;
function _(e) {
  return e;
}
var P = Object.is, D = _, U = "function" === typeof Bun && Bun.version ? D : function(e, t) {
  return !P(e, t);
}, F = "function" === typeof Bun && Bun.version ? D : function(e, t) {
  return "use-strict" === k(_) && (_(""), k(_)), U(e, t);
}, Ie = S(function(e, t) {
  return F(e, t) ? t : e;
});
var Ae = we(ke()), Me = Ae.default;
Me = Me.ReactCurrentDispatcher;
var Ne = Ae.default;
Ne = Ne.ReactCurrentBatchConfig;
var je = Ae.default;
je = je.ReactCurrentOwner;
var De = Ae.default;
De = De.ReactDebugCurrentFrame;
var Ue = Ae.default;
Ue = Ue.ContextRegistry;
var Te, Se, xe, Oe, Ee, Ce, Re, _e, Pe;
var Ne = we(ke()), De = Ne.default;
De = De.ReactCurrentDispatcher;
var Ue = Ne.default;
Ue = Ue.ReactCurrentBatchConfig;
var Fe = Ne.default;
Fe = Fe.ReactCurrentOwner;
var Le = Ne.default;
Le = Le.ReactDebugCurrentFrame;
var ze = Ne.default;
ze = ze.ContextRegistry;
var Be, $e;
if (typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u") {
  var He = we(ke());
  Be = He.default, $e = He.version;
}
var Ie = we(ke()), Ge = Ie.default;
Ge = Ge.ReactCurrentDispatcher;
var qe = Ie.default;
qe = qe.ReactCurrentBatchConfig;
var Ke = Ie.default;
Ke = Ke.ReactCurrentOwner;
var Je = Ie.default;
Je = Je.ReactDebugCurrentFrame;
var We = Ie.default;
We = We.ContextRegistry;
var Ve = we(ke()), Ze = Ve.default;
Ze = Ze.ReactCurrentDispatcher;
var Qe = Ve.default;
Qe = Qe.ReactCurrentBatchConfig;
var Ye = Ve.default;
Ye = Ye.ReactCurrentOwner;
var Xe = Ve.default;
Xe = Xe.ReactDebugCurrentFrame;
var et = Ve.default;
et = et.ContextRegistry;
Te = Be.createPortal, Se = Be.findDOMNode, xe = Be.flushSync, Oe = Be.unstable_batchedUpdates, Re = Be.unstable_createPortal, _e = Be.unstable_renderSubtreeIntoContainer, Pe = $e, Ee = function(e, t) {
  if (!Be)
    throw Error("React DOM was loaded in a browser without full DOM support. It's not safe to use ReactDOM.createRoot(), since it relies on features like 'querySelectorAll' which may be missing. You can find a list of supported browsers on our website.");
  return t = Be.createRoot(e, t), new tt(t);
}, Ce = function(e, t, n) {
  return Be.hydrateRoot(e, t, n);
};
function tt(e) {
  this._internalRoot = e;
}
tt.prototype.render = function(e) {
  this._internalRoot.render(e);
};
tt.prototype.unmount = function() {
  this._internalRoot.unmount();
};
export {
  Ee as createRoot,
  Ce as hydrateRoot,
  Oe as unstable_batchedUpdates,
  xe as flushSync,
  Te as createPortal,
  Pe as version,
  Se as findDOMNode,
  Re as unstable_createPortal,
  _e as unstable_renderSubtreeIntoContainer
};
//# sourceMappingURL=client.js.map
