(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-00c7a87e"],{"057f":function(t,e,o){var n=o("c6b6"),r=o("fc6a"),i=o("241c").f,a=o("f36a"),c="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return i(t)}catch(e){return a(c)}};t.exports.f=function(t){return c&&"Window"==n(t)?s(t):i(r(t))}},"35a14":function(t,e,o){"use strict";o("5d72")},"428f":function(t,e,o){var n=o("da84");t.exports=n},5273:function(t,e,o){},"5d72":function(t,e,o){},"746f":function(t,e,o){var n=o("428f"),r=o("1a2d"),i=o("e538"),a=o("9bf2").f;t.exports=function(t){var e=n.Symbol||(n.Symbol={});r(e,t)||a(e,t,{value:i.f(t)})}},"9a0b":function(t,e,o){"use strict";o.r(e);var n=o("7a23"),r=function(t){return Object(n["A"])("data-v-52352ed8"),t=t(),Object(n["y"])(),t},i={class:"row pt-1"},a={class:"col-md-1"},c={class:"d-flex flex-column align-items-stretch flex-shrink-0 bg-white",style:{width:"140px",height:"100%"}},s={class:"list-group list-group-flush border-bottom scrollarea"},u=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-cash iconosBootstrap me-3"})],-1)})),f=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-piggy-bank iconosBootstrap me-3"})],-1)})),b=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-door-open iconosBootstrap me-3"})],-1)})),l=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-trash iconosBootstrap me-3"})],-1)})),d=[l],p=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-globe iconosBootstrap me-3"})],-1)})),g=[p],j=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-pencil-square iconosBootstrap me-3"})],-1)})),h=[j],m=r((function(){return Object(n["h"])("div",{class:"d-flex w-100 align-items-center justify-content-center"},[Object(n["h"])("i",{class:"bi bi-key iconosBootstrap me-3"})],-1)})),v={class:"col"};function O(t,e,o,r,l,p){var j=Object(n["F"])("router-link"),O=Object(n["F"])("Trabajador"),y=Object(n["F"])("Cesta"),T=Object(n["F"])("router-view");return Object(n["x"])(),Object(n["g"])("div",i,[Object(n["h"])("div",a,[Object(n["h"])("div",c,[Object(n["h"])("div",s,[Object(n["k"])(j,{to:"/",class:"list-group-item list-group-item-action py-3 lh-tight"},{default:Object(n["Q"])((function(){return[u]})),_:1}),Object(n["k"])(j,{to:"/menu/caja/tickets",class:"list-group-item list-group-item-action py-3 lh-tight"},{default:Object(n["Q"])((function(){return[f]})),_:1}),Object(n["k"])(j,{to:"/menu/fichajes",class:"list-group-item list-group-item-action py-3 lh-tight"},{default:Object(n["Q"])((function(){return[b]})),_:1}),Object(n["h"])("button",{onClick:e[0]||(e[0]=function(t){return r.devoluciones()}),class:"list-group-item list-group-item-action py-3 lh-tight"},d),Object(n["h"])("button",{onClick:e[1]||(e[1]=function(t){return r.menuPedidos()}),class:"list-group-item list-group-item-action py-3 lh-tight"},g),Object(n["h"])("button",{onClick:e[2]||(e[2]=function(t){return r.imprimirEntregas()}),class:"list-group-item list-group-item-action py-3 lh-tight"},h),Object(n["k"])(j,{to:"/menuTecnico",class:"list-group-item list-group-item-action py-3 lh-tight"},{default:Object(n["Q"])((function(){return[m]})),_:1}),Object(n["k"])(O),Object(n["k"])(y)])])]),Object(n["h"])("div",v,[Object(n["k"])(T)])])}var y=o("5502"),T=o("bc3a"),w=o.n(T),k=o("a18c"),S=o("f06f"),A=["onClick"];function C(t,e,o,r,i,a){return Object(n["x"])(!0),Object(n["g"])(n["a"],null,Object(n["D"])(r.arrayTrabajadores,(function(t,e){return Object(n["x"])(),Object(n["g"])("div",{class:Object(n["r"])(["btn mb-3",[{"btn-color":r.esActivo(t.idTrabajador),"btn-outline-color":!r.esActivo(t.idTrabajador)}]]),key:e,onClick:function(e){return r.changeActivo(t.idTrabajador)}},Object(n["I"])(t.nombre),11,A)})),128)}var x={name:"Trabajador",setup:function(){var t=Object(y["b"])(),e=Object(n["C"])(),o=Object(n["C"])([]);function r(t){return e.value===t}function i(e){console.log("Cambiode trabajadores "),w.a.post("trabajadores/setActivo",{id:e}).then((function(o){o.data.error?console.log("Error al cambiar trabajador activo"):(t.dispatch("Trabajadores/setTrabajadorActivo",e),t.dispatch("Cesta/setIdAction",e),a(),k["a"].push("/"))}))}function a(){w.a.post("trabajadores/getTrabajadoresFichados").then((function(n){n.data.error?console.log("Error en getTrabajadoresFichados"):n.data.res.length>0&&(t.dispatch("Trabajadores/setArrayTrabajadores",n.data.res),o.value=n.data.res,w.a.post("trabajadores/getCurrentTrabajador").then((function(o){o.data.error?console.log("Error en getCurrentTrabajador"):(console.log(o.data),e.value=o.data.trabajador.idTrabajador,t.dispatch("Trabajadores/setTrabajadorActivo",o.data.trabajador.idTrabajador))}))["catch"]((function(t){console.log(t)})))}))["catch"]((function(t){console.log(t)}))}return Object(n["v"])((function(){a()})),{arrayTrabajadores:o,esActivo:r,changeActivo:i}}},P=(o("35a14"),o("d959")),E=o.n(P);const B=E()(x,[["render",C],["__scopeId","data-v-e12cdda2"]]);var F=B,I=["onClick"];function _(t,e,o,r,i,a){return Object(n["x"])(!0),Object(n["g"])(n["a"],null,Object(n["D"])(r.cestas,(function(t,e){return Object(n["x"])(),Object(n["g"])("div",{class:Object(n["r"])(["btn mb-3",[{"btn-info":r.esActivo(t.idMongo),"btn-outline-info":!r.esActivo(t.idMongo)}]]),key:e,onClick:function(e){return r.changeActivo(t.idMongo)}},Object(n["I"])(t.nombre),11,I)})),128)}o("a4d3"),o("e01a"),o("d3b7"),o("d28b"),o("3ca3"),o("ddb0");function M(t){return M="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},M(t)}var N={name:"Cesta",setup:function(){var t=Object(y["b"])(),e=t.state.CestasActivas.cestas,o=t.state.Cesta.cesta._id;function n(t){return console.log(M(o),M(t)),o===t}function r(e){console.log(e),t.dispatch("Cesta/setIdAction",e),k["a"].push("/")}return console.log(e),{cestas:e,esActivo:n,changeActivo:r}}};const D=E()(N,[["render",_]]);var Q=D,q={name:"Menu",props:{tipoToast:{required:!1},mensajeToast:{required:!1}},setup:function(t){var e=Object(y["b"])(),o=Object(n["c"])((function(){return e.state.Menu.hidden})),r=S["a"].getParametros(),i=Object(n["C"])("");function a(){e.dispatch("Ticket/setActivoAction",null)}function c(){e.dispatch("Menu/setHiddenAction",!0),a()}function s(){k["a"].push("/menu/pedidos/".concat(r.codigoTienda))}function u(t){k["a"].push(t)}function f(){u(i.value),console.log(i.value)}function b(){e.dispatch("setModoActual","DEVOLUCION"),k["a"].push("/")}function l(){w.a.post("impresora/imprimirEntregas"),c(),a()}return w.a.get("parametros/getParametrosBonito").then((function(t){0==t.data.error?i.value="/menu/pedidos/".concat(t.data.parametros.codigoTienda):console.log("Error en parametros/getParametrosBonito")})),console.log(r),void 0!=t.tipoToast&&void 0!=t.mensajeToast?(toast(t.mensajeToast,{type:t.tipoToast}),console.log("Deberían abrirse la ptm")):(console.log("No están definidos. INFO TOAST"),console.log(t.tipoToast,t.mensajeToast)),{menuPedidos:f,pedidos:s,devoluciones:b,isHidden:o,hideMenu:c,quitarActivoTicket:a,imprimirEntregas:l,goTo:u,url:i}},components:{Trabajador:F,Cesta:Q}};o("e4f3");const J=E()(q,[["render",O],["__scopeId","data-v-52352ed8"]]);e["default"]=J},a4d3:function(t,e,o){"use strict";var n=o("23e7"),r=o("da84"),i=o("d066"),a=o("2ba4"),c=o("c65b"),s=o("e330"),u=o("c430"),f=o("83ab"),b=o("4930"),l=o("d039"),d=o("1a2d"),p=o("e8b5"),g=o("1626"),j=o("861d"),h=o("3a9b"),m=o("d9b5"),v=o("825a"),O=o("7b0b"),y=o("fc6a"),T=o("a04b"),w=o("577e"),k=o("5c6c"),S=o("7c73"),A=o("df75"),C=o("241c"),x=o("057f"),P=o("7418"),E=o("06cf"),B=o("9bf2"),F=o("d1e7"),I=o("f36a"),_=o("6eeb"),M=o("5692"),N=o("f772"),D=o("d012"),Q=o("90e3"),q=o("b622"),J=o("e538"),H=o("746f"),$=o("d44e"),L=o("69f3"),U=o("b727").forEach,V=N("hidden"),W="Symbol",z="prototype",G=q("toPrimitive"),K=L.set,R=L.getterFor(W),X=Object[z],Y=r.Symbol,Z=Y&&Y[z],tt=r.TypeError,et=r.QObject,ot=i("JSON","stringify"),nt=E.f,rt=B.f,it=x.f,at=F.f,ct=s([].push),st=M("symbols"),ut=M("op-symbols"),ft=M("string-to-symbol-registry"),bt=M("symbol-to-string-registry"),lt=M("wks"),dt=!et||!et[z]||!et[z].findChild,pt=f&&l((function(){return 7!=S(rt({},"a",{get:function(){return rt(this,"a",{value:7}).a}})).a}))?function(t,e,o){var n=nt(X,e);n&&delete X[e],rt(t,e,o),n&&t!==X&&rt(X,e,n)}:rt,gt=function(t,e){var o=st[t]=S(Z);return K(o,{type:W,tag:t,description:e}),f||(o.description=e),o},jt=function(t,e,o){t===X&&jt(ut,e,o),v(t);var n=T(e);return v(o),d(st,n)?(o.enumerable?(d(t,V)&&t[V][n]&&(t[V][n]=!1),o=S(o,{enumerable:k(0,!1)})):(d(t,V)||rt(t,V,k(1,{})),t[V][n]=!0),pt(t,n,o)):rt(t,n,o)},ht=function(t,e){v(t);var o=y(e),n=A(o).concat(Tt(o));return U(n,(function(e){f&&!c(vt,o,e)||jt(t,e,o[e])})),t},mt=function(t,e){return void 0===e?S(t):ht(S(t),e)},vt=function(t){var e=T(t),o=c(at,this,e);return!(this===X&&d(st,e)&&!d(ut,e))&&(!(o||!d(this,e)||!d(st,e)||d(this,V)&&this[V][e])||o)},Ot=function(t,e){var o=y(t),n=T(e);if(o!==X||!d(st,n)||d(ut,n)){var r=nt(o,n);return!r||!d(st,n)||d(o,V)&&o[V][n]||(r.enumerable=!0),r}},yt=function(t){var e=it(y(t)),o=[];return U(e,(function(t){d(st,t)||d(D,t)||ct(o,t)})),o},Tt=function(t){var e=t===X,o=it(e?ut:y(t)),n=[];return U(o,(function(t){!d(st,t)||e&&!d(X,t)||ct(n,st[t])})),n};if(b||(Y=function(){if(h(Z,this))throw tt("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?w(arguments[0]):void 0,e=Q(t),o=function(t){this===X&&c(o,ut,t),d(this,V)&&d(this[V],e)&&(this[V][e]=!1),pt(this,e,k(1,t))};return f&&dt&&pt(X,e,{configurable:!0,set:o}),gt(e,t)},Z=Y[z],_(Z,"toString",(function(){return R(this).tag})),_(Y,"withoutSetter",(function(t){return gt(Q(t),t)})),F.f=vt,B.f=jt,E.f=Ot,C.f=x.f=yt,P.f=Tt,J.f=function(t){return gt(q(t),t)},f&&(rt(Z,"description",{configurable:!0,get:function(){return R(this).description}}),u||_(X,"propertyIsEnumerable",vt,{unsafe:!0}))),n({global:!0,wrap:!0,forced:!b,sham:!b},{Symbol:Y}),U(A(lt),(function(t){H(t)})),n({target:W,stat:!0,forced:!b},{for:function(t){var e=w(t);if(d(ft,e))return ft[e];var o=Y(e);return ft[e]=o,bt[o]=e,o},keyFor:function(t){if(!m(t))throw tt(t+" is not a symbol");if(d(bt,t))return bt[t]},useSetter:function(){dt=!0},useSimple:function(){dt=!1}}),n({target:"Object",stat:!0,forced:!b,sham:!f},{create:mt,defineProperty:jt,defineProperties:ht,getOwnPropertyDescriptor:Ot}),n({target:"Object",stat:!0,forced:!b},{getOwnPropertyNames:yt,getOwnPropertySymbols:Tt}),n({target:"Object",stat:!0,forced:l((function(){P.f(1)}))},{getOwnPropertySymbols:function(t){return P.f(O(t))}}),ot){var wt=!b||l((function(){var t=Y();return"[null]"!=ot([t])||"{}"!=ot({a:t})||"{}"!=ot(Object(t))}));n({target:"JSON",stat:!0,forced:wt},{stringify:function(t,e,o){var n=I(arguments),r=e;if((j(e)||void 0!==t)&&!m(t))return p(e)||(e=function(t,e){if(g(r)&&(e=c(r,this,t,e)),!m(e))return e}),n[1]=e,a(ot,null,n)}})}if(!Z[G]){var kt=Z.valueOf;_(Z,G,(function(t){return c(kt,this)}))}$(Y,W),D[V]=!0},d28b:function(t,e,o){var n=o("746f");n("iterator")},e01a:function(t,e,o){"use strict";var n=o("23e7"),r=o("83ab"),i=o("da84"),a=o("e330"),c=o("1a2d"),s=o("1626"),u=o("3a9b"),f=o("577e"),b=o("9bf2").f,l=o("e893"),d=i.Symbol,p=d&&d.prototype;if(r&&s(d)&&(!("description"in p)||void 0!==d().description)){var g={},j=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:f(arguments[0]),e=u(p,this)?new d(t):void 0===t?d():d(t);return""===t&&(g[e]=!0),e};l(j,d),j.prototype=p,p.constructor=j;var h="Symbol(test)"==String(d("test")),m=a(p.toString),v=a(p.valueOf),O=/^Symbol\((.*)\)[^)]+$/,y=a("".replace),T=a("".slice);b(p,"description",{configurable:!0,get:function(){var t=v(this),e=m(t);if(c(g,t))return"";var o=h?T(e,7,-1):y(e,O,"$1");return""===o?void 0:o}}),n({global:!0,forced:!0},{Symbol:j})}},e4f3:function(t,e,o){"use strict";o("5273")},e538:function(t,e,o){var n=o("b622");e.f=n}}]);
//# sourceMappingURL=chunk-00c7a87e.6709ffff.js.map