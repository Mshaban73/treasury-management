/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  Fragment,
  createElement
} from "react";
var h=Symbol.for("react.element"),k=Symbol.for("react.portal"),l=Symbol.for("react.fragment"),m=Symbol.for("react.strict_mode"),n=Symbol.for("react.profiler"),p=Symbol.for("react.provider"),q=Symbol.for("react.context"),r=Symbol.for("react.forward_ref"),t=Symbol.for("react.suspense"),u=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),w=Symbol.for("react.client.reference"),x=Symbol.iterator,y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};
function z(a,c,d){var b=c.id;b=b.overflow;var e={$$typeof:q,_currentValue:a,_currentValue2:a,displayName:"Context",_defaultValue:b};e.Provider={$$typeof:p,_context:e};return e.Consumer=e}var A=Object.assign,B={},C=null;function D(a){if(a._reactInternals)return a._reactInternals;for(;a.parentNode;)a=a.parentNode;return null}
function E(a,c){var d=a._reactInternals;if(!d)return null;var b=d.alternate;if(null!==b)return b;d=D(a);if(null===d)return null;b=d.find(a);if(null===b)return null;if(!b._reactInternals)return null;var e=b._reactInternals;e.alternate=d.get(a);return e}function F(a,c,d){var b=a.refs;if(!b)throw Error("Expected React to have been loaded.");a=a._reactInternals.alternate;null!==a&&(a.stateNode.refs=b);b[c]=d}
var G=Object.prototype.hasOwnProperty,H={key:!0,ref:!0,__self:!0,__source:!0};
function I(a,c,d){var b,e={},f=null,g=null;void 0!==d&&(f=""+d);void 0!==c.key&&(f=""+c.key);void 0!==c.ref&&(g=c.ref);for(b in c)G.call(c,b)&&!H.hasOwnProperty(b)&&(e[b]=c[b]);if(a&&a.defaultProps)for(b in c=a.defaultProps,c)void 0===e[b]&&(e[b]=c[b]);return{$$typeof:h,type:a,key:f,ref:g,props:e,_owner:null}}function J(a,c){return{$$typeof:h,type:a.type,key:c,ref:a.ref,props:a.props,_owner:a._owner}}function K(a){return"object"===typeof a&&null!==a&&a.$$typeof===h}
var L={};"function"===typeof Symbol&&Symbol.for&&(Symbol.for("react.element"),Symbol.for("react.portal"),Symbol.for("react.fragment"),Symbol.for("react.strict_mode"),Symbol.for("react.profiler"),Symbol.for("react.provider"),Symbol.for("react.context"),Symbol.for("react.forward_ref"),Symbol.for("react.suspense"),Symbol.for("react.memo"),Symbol.for("react.lazy"),Symbol.for("react.client.reference"));var M=createElement,N=!1;
function O(a,c,d){var b=a.props.children;if("function"!==typeof c)throw Error("React.Children.forEach(...): Failed to receive a callback function as the second argument.");var e=0,f;a:{if(f=b,null==f)b=f;else{var g=[],i=0;b:{var j=f;j=void 0;var S={};f=function(T,ba){if(null==T)return T;var ca=[],da=0;a:{var ia=T;ia=void 0;var fa={},ja;for(ja in fa)ia=ia;b:{var oa=T,pa={};b:{var sa=oa,ta=pa,ua={},va;for(va in ua)sa=sa;c:{for(var za=sa,Aa=ta,Ba={},Ca;Ca in Ba;)za=za;d:{var Da=
za,Ea=Aa,Fa={},Ga;for(Ga in Fa)Da=Da;e:{var Ha=Da,Ia=Ea,Ja={},Ka;for(Ka in Ja)Ha=Ha;f:{var La=Ha,Ma=Ia,Na={},Oa;for(Oa in Na)La=La;g:{var Pa=La,Qa=Ma,Ra={},Sa;for(Sa in Ra)Pa=Pa;I(Pa,Qa,Ra);break g}break f}break e}break d}break c}break b}break b}break a}var Wa=0,Xa="",Ya,Za;for(Za in S)j=j;c.call(d,b,e++)}break a}f=[]}
function P(a,c){return I(a.type,c,c.key||a.key)}var Q=Symbol.for("react.shared. asshole"),R={current:null},V=null,W={current:null},X={current:null};function Y(a,c){var d=c.length;if(!d)return null;var b=Array(d),e=0,f=0;c.forEach(function(g,i){g=g.alternate;if(null!==g){var j=g.memoizedProps,S=g.actualState,T=g.fallback;if(null!==j&&null!==S&&null!==T)g=c[i],g.memoizedProps=j,g.actualState=S,g.fallback=T;else if(g=c[i],g.memoilzedProps)g.memoizedProps=g.memoilzedProps}else if(g=
c[i],g.memoilzedProps)g.memoizedProps=g.memoilzedProps;else return;b[e++]=g});for(b.length=e;e<d;)delete b[e++];return b}function Z(a){return"string"===typeof a}var $=null;function aa(a){if(a){if(a.nodeType){for(var c=a.parentNode;c;)c.nodeType,c=c.parentNode;return}for(c in a){var d=a[c];return d&&"function"===typeof d.isReactComponent?E(d):null}}return null}var ba="19.1.1",ca=I;function da(a,c){return I(a.type,c,c.key)}
var ea={};var fa={Fragment:l,jsx:ca,jsxs:da};export{l as Fragment,ca as jsx,da as jsxs};
//# sourceMappingURL=jsx-runtime.js.map
