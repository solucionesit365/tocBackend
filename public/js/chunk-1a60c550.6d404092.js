(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1a60c550"],{"1da1":function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));r("d3b7");function n(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(u){return void r(u)}c.done?e(s):Promise.resolve(s).then(n,o)}function o(t){return function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,s,"next",t)}function s(t){n(a,o,i,c,s,"throw",t)}c(void 0)}))}}},6580:function(t,e,r){"use strict";r("cadd")},"658a":function(t,e,r){"use strict";r.r(e);var n=r("7a23"),o=Object(n["h"])("span",{class:"titulo"},"TOC DOCTOR",-1),i={class:"row"},a={class:"col"},c={class:"row"},s={class:"col"},u={class:"table"},l=Object(n["h"])("thead",{class:"headerNegro"},[Object(n["h"])("tr",null,[Object(n["h"])("th",null,"º"),Object(n["h"])("th",null,"Módulo"),Object(n["h"])("th",null,"Descripción"),Object(n["h"])("th",null,"Estado"),Object(n["h"])("th",null,"Diagnóstico")])],-1),h=Object(n["h"])("th",null,"1",-1),f=Object(n["h"])("th",null,"Token",-1),b=Object(n["h"])("th",null,"Comprobando si el dispositivo tiene un token válido para identificarse con el backend service",-1),d={key:0,class:"bi bi-caret-right-square iconsSize"},O={key:1,class:"spinner-border",role:"status"},v=Object(n["h"])("span",{class:"visually-hidden"},"Loading...",-1),j=[v],p={key:0,class:"bi bi-question-square iconsSize"},g={key:1,class:"bi bi-check-square iconsSize"},y={key:2,class:"bi bi-x-square iconsSize"},m=Object(n["h"])("th",null,"2",-1),w=Object(n["h"])("th",null,"Trabajadores",-1),C=Object(n["h"])("th",null,"Existen trabajadores, trabajadores fichados, trabajadores con cesta siempre",-1),E={key:0,class:"bi bi-caret-right-square iconsSize"},x={key:1,class:"spinner-border",role:"status"},k=Object(n["h"])("span",{class:"visually-hidden"},"Loading...",-1),N=[k],L={key:0,class:"bi bi-question-square iconsSize"},R={key:1,class:"bi bi-check-square iconsSize"},S={key:2,class:"bi bi-x-square iconsSize"},T=Object(n["h"])("th",null,"3",-1),_=Object(n["h"])("th",null,"Cestas",-1),A=Object(n["h"])("th",null,"Mínimo de cestas, mesas relacionadas",-1),I={key:0,class:"bi bi-caret-right-square iconsSize"},M={key:1,class:"spinner-border",role:"status"},Z=Object(n["h"])("span",{class:"visually-hidden"},"Loading...",-1),q=[Z],D={key:0,class:"bi bi-question-square iconsSize"},F={key:1,class:"bi bi-check-square iconsSize"},P={key:2,class:"bi bi-x-square iconsSize"},z={class:"position-fixed bottom-0 start-0 ms-2 mb-2"};function G(t,e,r,v,k,Z){return Object(n["x"])(),Object(n["g"])(n["a"],null,[o,Object(n["h"])("div",i,[Object(n["h"])("div",a,[Object(n["h"])("button",{class:"btn btn-primary btn-lg",onClick:e[0]||(e[0]=function(t){return v.ejecutarDoctor()})},"Comenzar")])]),Object(n["h"])("div",c,[Object(n["h"])("div",s,[Object(n["h"])("table",u,[l,Object(n["h"])("tbody",null,[Object(n["h"])("tr",null,[h,f,b,Object(n["h"])("th",{onClick:e[1]||(e[1]=function(t){return v.ejecutarToken()})},["SIN_COMENZAR"==v.estadoToken?(Object(n["x"])(),Object(n["g"])("i",d)):Object(n["f"])("",!0),"EN_PROCESO"==v.estadoToken?(Object(n["x"])(),Object(n["g"])("div",O,j)):Object(n["f"])("",!0)]),Object(n["h"])("th",null,["SIN_COMENZAR"==v.diagnosticoToken?(Object(n["x"])(),Object(n["g"])("i",p)):Object(n["f"])("",!0),"CORRECTO"==v.diagnosticoToken?(Object(n["x"])(),Object(n["g"])("i",g)):Object(n["f"])("",!0),"FALLIDO"==v.diagnosticoToken?(Object(n["x"])(),Object(n["g"])("i",y)):Object(n["f"])("",!0)])]),Object(n["h"])("tr",null,[m,w,C,Object(n["h"])("th",{onClick:e[2]||(e[2]=function(t){return v.ejecutarTrabajadores()})},["SIN_COMENZAR"==v.estadoTrabajadores?(Object(n["x"])(),Object(n["g"])("i",E)):Object(n["f"])("",!0),"EN_PROCESO"==v.estadoTrabajadores?(Object(n["x"])(),Object(n["g"])("div",x,N)):Object(n["f"])("",!0)]),Object(n["h"])("th",null,["SIN_COMENZAR"==v.diagnosticoTrabajadores?(Object(n["x"])(),Object(n["g"])("i",L)):Object(n["f"])("",!0),"CORRECTO"==v.diagnosticoTrabajadores?(Object(n["x"])(),Object(n["g"])("i",R)):Object(n["f"])("",!0),"FALLIDO"==v.diagnosticoTrabajadores?(Object(n["x"])(),Object(n["g"])("i",S)):Object(n["f"])("",!0)])]),Object(n["h"])("tr",null,[T,_,A,Object(n["h"])("th",{onClick:e[3]||(e[3]=function(t){return v.ejecutarCestas()})},["SIN_COMENZAR"==v.estadoCestas?(Object(n["x"])(),Object(n["g"])("i",I)):Object(n["f"])("",!0),"EN_PROCESO"==v.estadoCestas?(Object(n["x"])(),Object(n["g"])("div",M,q)):Object(n["f"])("",!0)]),Object(n["h"])("th",null,["SIN_COMENZAR"==v.diagnosticoCestas?(Object(n["x"])(),Object(n["g"])("i",D)):Object(n["f"])("",!0),"CORRECTO"==v.diagnosticoCestas?(Object(n["x"])(),Object(n["g"])("i",F)):Object(n["f"])("",!0),"FALLIDO"==v.diagnosticoCestas?(Object(n["x"])(),Object(n["g"])("i",P)):Object(n["f"])("",!0)])])])])])]),Object(n["h"])("div",z,[Object(n["h"])("button",{class:"btn btn-warning botonVolver",onClick:e[4]||(e[4]=function(t){return v.volver()})},"Volver")])],64)}var V=r("1da1"),J=(r("96cf"),r("a18c")),Y=r("bc3a"),B=r.n(Y),Q=r("0180");r("0d03"),r("ac1f"),r("1276"),r("c975");function W(t,e){new Date;document.cookie=t+"="+e+";;path=/"}function H(t){for(var e=t+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){var o=r[n];while(" "==o.charAt(0))o=o.substring(1);if(0==o.indexOf(e))return o.substring(e.length,o.length)}return""}var K={name:"TocDoctor",setup:function(){var t=Object(Q["b"])(),e=Object(n["C"])("SIN_COMENZAR"),r=Object(n["C"])("SIN_COMENZAR"),o=Object(n["C"])("SIN_COMENZAR"),i=Object(n["C"])("SIN_COMENZAR"),a=Object(n["C"])("SIN_COMENZAR"),c=Object(n["C"])("SIN_COMENZAR");function s(){return o.value="EN_PROCESO",B.a.post("satelites/verifyToken",{token:H("token")}).then((function(t){return o.value="SIN_COMENZAR",t.data?(c.value="CORRECTO",!0):(c.value="FALLIDO",!1)}))["catch"]((function(t){return console.log(t),c.value="FALLIDO",o.value="SIN_COMENZAR",!1}))}function u(){return e.value="EN_PROCESO",B.a.get("doctor/checkTrabajadores").then((function(t){return e.value="SIN_COMENZAR",t.data?(i.value="CORRECTO",!0):(i.value="FALLIDO",!1)}))["catch"]((function(t){return console.log(t),e.value="SIN_COMENZAR",i.value="FALLIDO",!1}))}function l(){return r.value="EN_PROCESO",B.a.get("doctor/checkCestas").then((function(t){return r.value="SIN_COMENZAR",t.data?(a.value="CORRECTO",!0):(a.value="FALLIDO",!1)}))["catch"]((function(t){return console.log(t),r.value="SIN_COMENZAR",a.value="FALLIDO",!1}))}function h(){return f.apply(this,arguments)}function f(){return f=Object(V["a"])(regeneratorRuntime.mark((function e(){var r,n,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s();case 2:return r=e.sent,e.next=5,u();case 5:return n=e.sent,e.next=8,l();case 8:o=e.sent,n&&o&&r?t.success("Toc en correcto estado"):t.error("Chequeo fallido, revisa los módulos");case 10:case"end":return e.stop()}}),e)}))),f.apply(this,arguments)}function b(){J["a"].push("/")}return Object(n["v"])((function(){W("token","ZBOL4pJWVoA5il9YvF9VqR8&b7QZ8G"),t.info(H("token"))})),{estadoToken:o,diagnosticoToken:c,ejecutarToken:s,volver:b,ejecutarTrabajadores:u,ejecutarCestas:l,ejecutarDoctor:h,estadoTrabajadores:e,estadoCestas:r,diagnosticoTrabajadores:i,diagnosticoCestas:a}}},U=(r("6580"),r("d959")),X=r.n(U);const $=X()(K,[["render",G]]);e["default"]=$},"96cf":function(t,e,r){var n=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"===typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(_){s=function(t,e,r){return t[e]=r}}function u(t,e,r,n){var o=e&&e.prototype instanceof v?e:v,i=Object.create(o.prototype),a=new R(n||[]);return i._invoke=x(t,r,a),i}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(_){return{type:"throw",arg:_}}}t.wrap=u;var h="suspendedStart",f="suspendedYield",b="executing",d="completed",O={};function v(){}function j(){}function p(){}var g={};s(g,i,(function(){return this}));var y=Object.getPrototypeOf,m=y&&y(y(S([])));m&&m!==r&&n.call(m,i)&&(g=m);var w=p.prototype=v.prototype=Object.create(g);function C(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(o,i,a,c){var s=l(t[o],t,i);if("throw"!==s.type){var u=s.arg,h=u.value;return h&&"object"===typeof h&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(h).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var o;function i(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}this._invoke=i}function x(t,e,r){var n=h;return function(o,i){if(n===b)throw new Error("Generator is already running");if(n===d){if("throw"===o)throw i;return T()}r.method=o,r.arg=i;while(1){var a=r.delegate;if(a){var c=k(a,r);if(c){if(c===O)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===h)throw n=d,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=b;var s=l(t,e,r);if("normal"===s.type){if(n=r.done?d:f,s.arg===O)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n=d,r.method="throw",r.arg=s.arg)}}}function k(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator["return"]&&(r.method="return",r.arg=e,k(t,r),"throw"===r.method))return O;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return O}var o=l(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,O;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,O):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,O)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function S(t){if(t){var r=t[i];if(r)return r.call(t);if("function"===typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){while(++o<t.length)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return{next:T}}function T(){return{value:e,done:!0}}return j.prototype=p,s(w,"constructor",p),s(p,"constructor",j),j.displayName=s(p,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"===typeof t&&t.constructor;return!!e&&(e===j||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,p):(t.__proto__=p,s(t,c,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},C(E.prototype),s(E.prototype,a,(function(){return this})),t.AsyncIterator=E,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new E(u(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},C(w),s(w,c,"Generator"),s(w,i,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){while(e.length){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,R.prototype={constructor:R,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(L),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0],e=t.completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,O):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),O},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),O}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:S(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),O}},t}(t.exports);try{regeneratorRuntime=n}catch(o){"object"===typeof globalThis?globalThis.regeneratorRuntime=n:Function("r","regeneratorRuntime = r")(n)}},a640:function(t,e,r){"use strict";var n=r("d039");t.exports=function(t,e){var r=[][t];return!!r&&n((function(){r.call(null,e||function(){throw 1},1)}))}},c975:function(t,e,r){"use strict";var n=r("23e7"),o=r("e330"),i=r("4d64").indexOf,a=r("a640"),c=o([].indexOf),s=!!c&&1/c([1],1,-0)<0,u=a("indexOf");n({target:"Array",proto:!0,forced:s||!u},{indexOf:function(t){var e=arguments.length>1?arguments[1]:void 0;return s?c(this,t,e)||0:i(this,t,e)}})},cadd:function(t,e,r){}}]);
//# sourceMappingURL=chunk-1a60c550.6d404092.js.map