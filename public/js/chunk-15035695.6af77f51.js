(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-15035695"],{"0cfc":function(t,e,r){t.exports=r.p+"img/uneuro.d4d09342.png"},"0e5e":function(t,e,r){t.exports=r.p+"img/img-tarjetas.6adf4bbd.png"},"100f":function(t,e,r){t.exports=r.p+"img/1cts.08f9a496.png"},1091:function(t,e,r){t.exports=r.p+"img/10euros.71677dd3.png"},1135:function(t,e,r){t.exports=r.p+"img/20euros.d0df58ee.png"},"1da1":function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));r("d3b7");function n(t,e,r,n,o,a,c){try{var i=t[a](c),s=i.value}catch(l){return void r(l)}i.done?e(s):Promise.resolve(s).then(n,o)}function o(t){return function(){var e=this,r=arguments;return new Promise((function(o,a){var c=t.apply(e,r);function i(t){n(c,o,a,i,s,"next",t)}function s(t){n(c,o,a,i,s,"throw",t)}i(void 0)}))}}},2888:function(t,e,r){t.exports=r.p+"img/5euros.4a15401a.png"},"2a21":function(t,e,r){},"41ef":function(t,e,r){t.exports=r.p+"img/50euros.de313b3c.png"},"54ab":function(t,e,r){t.exports=r.p+"img/img-efectivo-disabled.aabb57ee.png"},"7abc":function(t,e,r){"use strict";r("2a21")},"7cd7":function(t,e,r){t.exports=r.p+"img/img-cancelar-paytef.b82fe78e.png"},"96cf":function(t,e,r){var n=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"===typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",i=o.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(P){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof g?e:g,a=Object.create(o.prototype),c=new z(n||[]);return a._invoke=k(t,r,c),a}function u(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(P){return{type:"throw",arg:P}}}t.wrap=l;var d="suspendedStart",b="suspendedYield",f="executing",h="completed",p={};function g(){}function v(){}function m(){}var O={};s(O,a,(function(){return this}));var j=Object.getPrototypeOf,y=j&&j(j(L([])));y&&y!==r&&n.call(y,a)&&(O=y);var C=m.prototype=g.prototype=Object.create(O);function w(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function r(o,a,c,i){var s=u(t[o],t,a);if("throw"!==s.type){var l=s.arg,d=l.value;return d&&"object"===typeof d&&n.call(d,"__await")?e.resolve(d.__await).then((function(t){r("next",t,c,i)}),(function(t){r("throw",t,c,i)})):e.resolve(d).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,i)}))}i(s.arg)}var o;function a(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}this._invoke=a}function k(t,e,r){var n=d;return function(o,a){if(n===f)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw a;return M()}r.method=o,r.arg=a;while(1){var c=r.delegate;if(c){var i=E(c,r);if(i){if(i===p)continue;return i}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===d)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=f;var s=u(t,e,r);if("normal"===s.type){if(n=r.done?h:b,s.arg===p)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n=h,r.method="throw",r.arg=s.arg)}}}function E(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator["return"]&&(r.method="return",r.arg=e,E(t,r),"throw"===r.method))return p;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var o=u(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,p;var a=o.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,p):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,p)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function z(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function L(t){if(t){var r=t[a];if(r)return r.call(t);if("function"===typeof t.next)return t;if(!isNaN(t.length)){var o=-1,c=function r(){while(++o<t.length)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return c.next=c}}return{next:M}}function M(){return{value:e,done:!0}}return v.prototype=m,s(C,"constructor",m),s(m,"constructor",v),v.displayName=s(m,i,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"===typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,s(t,i,"GeneratorFunction")),t.prototype=Object.create(C),t},t.awrap=function(t){return{__await:t}},w(x.prototype),s(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var c=new x(l(e,r,n,o),a);return t.isGeneratorFunction(r)?c:c.next().then((function(t){return t.done?t.value:c.next()}))},w(C),s(C,i,"Generator"),s(C,a,(function(){return this})),s(C,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){while(e.length){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=L,z.prototype={constructor:z,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(A),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0],e=t.completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return i.type="throw",i.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var c=this.tryEntries[a],i=c.completion;if("root"===c.tryLoc)return o("end");if(c.tryLoc<=this.prev){var s=n.call(c,"catchLoc"),l=n.call(c,"finallyLoc");if(s&&l){if(this.prev<c.catchLoc)return o(c.catchLoc,!0);if(this.prev<c.finallyLoc)return o(c.finallyLoc)}else if(s){if(this.prev<c.catchLoc)return o(c.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<c.finallyLoc)return o(c.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var c=a?a.completion:{};return c.type=t,c.arg=e,a?(this.method="next",this.next=a.finallyLoc,p):this.complete(c)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:L(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),p}},t}(t.exports);try{regeneratorRuntime=n}catch(o){"object"===typeof globalThis?globalThis.regeneratorRuntime=n:Function("r","regeneratorRuntime = r")(n)}},"9e6f":function(t,e,r){t.exports=r.p+"img/img-restaurant.96084bf3.png"},a340:function(t,e,r){t.exports=r.p+"img/doseuros.920ccd20.png"},a7d3:function(t,e,r){t.exports=r.p+"img/100euros.2f9cefba.png"},b9b8:function(t,e,r){t.exports=r.p+"img/10cts.aecf0c2d.png"},c05b:function(t,e,r){t.exports=r.p+"img/500euros.db40467f.png"},cc03:function(t,e,r){t.exports=r.p+"img/5cts.1ad0ba13.png"},cff6:function(t,e,r){t.exports=r.p+"img/200euros.594db7de.png"},d68e:function(t,e,r){t.exports=r.p+"img/50cts.a9507b29.png"},d69f:function(t,e,r){t.exports=r.p+"img/img-efectivo.0a3202b8.png"},ea88:function(t,e,r){t.exports=r.p+"img/img-tarjetas-disabled.b2f9a319.png"},edb7:function(t,e,r){t.exports=r.p+"img/20cts.f25065eb.png"},fbdc:function(t,e,r){"use strict";r.r(e);var n=r("7a23");function o(t,e,r,o,a,c){var i=Object(n["F"])("CobroComponent");return Object(n["x"])(),Object(n["e"])(i)}r("b680"),r("a9e3");var a=r("100f"),c=r.n(a),i=r("fbdd"),s=r.n(i),l=r("cc03"),u=r.n(l),d=r("b9b8"),b=r.n(d),f=r("edb7"),h=r.n(f),p=r("d68e"),g=r.n(p),v=r("0cfc"),m=r.n(v),O=r("a340"),j=r.n(O),y=r("2888"),C=r.n(y),w=r("1091"),x=r.n(w),k=r("1135"),E=r.n(k),T=r("41ef"),A=r.n(T),z=r("a7d3"),L=r.n(z),M=r("cff6"),P=r.n(M),I=r("c05b"),F=r.n(I),N=r("d69f"),R=r.n(N),_=r("54ab"),B=r.n(_),S=r("0e5e"),D=r.n(S),V=r("ea88"),G=r.n(V),J=r("9e6f"),K=r.n(J),Y=r("7cd7"),H=r.n(Y),U=function(t){return Object(n["A"])("data-v-5d629f31"),t=t(),Object(n["y"])(),t},X={class:"container-fluid mt-2"},q={class:"row"},Q={class:"col-md-12 text-center"},W=["width"],Z=["width"],$=["width"],tt=["width"],et=["width"],rt=["width"],nt=["width"],ot=["width"],at={class:"row"},ct={class:"col-md-12 text-center"},it=["width"],st=["width"],lt=["width"],ut=["width"],dt=["width"],bt=["width"],ft=["width"],ht={class:"row"},pt={class:"col-md-7"},gt={class:"row"},vt={class:"col",style:{"max-width":"325px"}},mt={class:"btn-group-vertical",role:"group"},Ot={class:"btn-group"},jt={class:"btn-group"},yt={class:"btn-group"},Ct={class:"btn-group"},wt={class:"col-md-6 pt-2 text-start colorTexto"},xt={style:{"font-size":"32px"},class:"fw-bold"},kt=U((function(){return Object(n["h"])("br",null,null,-1)})),Et={style:{"font-size":"32px"},class:"fw-bold"},Tt=U((function(){return Object(n["h"])("br",null,null,-1)})),At={style:{"font-size":"32px"},class:"fw-bold"},zt=U((function(){return Object(n["h"])("br",null,null,-1)})),Lt={key:0,class:"fw-bold",style:{"font-size":"32px",color:"red"}},Mt={key:1,class:"fw-bold",style:{"font-size":"32px",color:"green"}},Pt={class:"col-md-5"},It={key:0,class:"row"},Ft={class:"col-md-6 text-center"},Nt={class:"col-md-6 text-center"},Rt={class:"row mt-2"},_t=U((function(){return Object(n["h"])("div",{class:"col text-center"},[Object(n["h"])("img",{"data-bs-toggle":"modal","data-bs-target":"#exampleModal",src:K.a,alt:"tkrs",width:"185"})],-1)})),Bt={key:0,class:"col text-center"},St=U((function(){return Object(n["h"])("div",{class:"spinner-border mx-auto",style:{width:"5rem",height:"5rem"},role:"status"},[Object(n["h"])("span",{class:"visually-hidden"},"Loading...")],-1)})),Dt=[St],Vt={class:"position-absolute bottom-0 start-0 mb-2",style:{position:"absolute"}},Gt={class:"row ms-2",role:"group","aria-label":"First group"},Jt={class:"col"},Kt={class:"position-absolute bottom-0 end-0 mb-2 me-2"},Yt={class:"col-md-12 text-center"},Ht={class:"modal fade",id:"exampleModal",tabindex:"-1","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},Ut={class:"modal-dialog"},Xt={class:"modal-content"},qt=U((function(){return Object(n["h"])("div",{class:"modal-header"},[Object(n["h"])("h5",{class:"modal-title",id:"exampleModalLabel"},"Importe del ticket restaurant"),Object(n["h"])("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)})),Qt={class:"modal-body"},Wt={class:"input-group mb-3"},Zt=U((function(){return Object(n["h"])("span",{class:"input-group-text"},"Cantidad",-1)})),$t={class:"modal-footer"},te=U((function(){return Object(n["h"])("button",{type:"button",class:"btn btn-secondary btn-lg","data-bs-dismiss":"modal"},"Cerrar",-1)}));function ee(t,e,r,o,a,i){return Object(n["x"])(),Object(n["g"])(n["a"],null,[Object(n["h"])("div",X,[Object(n["h"])("div",q,[Object(n["h"])("div",Q,[Object(n["h"])("img",{onClick:e[0]||(e[0]=function(t){return o.agregar(.01)}),src:c.a,alt:"Moneda 1 cts.",width:o.sizeMonedas},null,8,W),Object(n["h"])("img",{onClick:e[1]||(e[1]=function(t){return o.agregar(.02)}),src:s.a,alt:"Moneda 2 cts.",width:o.sizeMonedas,class:"mr-2"},null,8,Z),Object(n["h"])("img",{onClick:e[2]||(e[2]=function(t){return o.agregar(.05)}),src:u.a,alt:"Moneda 5 cts.",width:o.sizeMonedas,class:"mr-2"},null,8,$),Object(n["h"])("img",{onClick:e[3]||(e[3]=function(t){return o.agregar(.1)}),src:b.a,alt:"Moneda 10 cts.",width:o.sizeMonedas,class:"mr-2"},null,8,tt),Object(n["h"])("img",{onClick:e[4]||(e[4]=function(t){return o.agregar(.2)}),src:h.a,alt:"Moneda 20 cts.",width:o.sizeMonedas,class:"mr-2"},null,8,et),Object(n["h"])("img",{onClick:e[5]||(e[5]=function(t){return o.agregar(.5)}),src:g.a,alt:"Moneda 50 cts.",width:o.sizeMonedas,class:"mr-2"},null,8,rt),Object(n["h"])("img",{onClick:e[6]||(e[6]=function(t){return o.agregar(1)}),src:m.a,alt:"Moneda 1 euro",width:o.sizeMonedas,class:"mr-2"},null,8,nt),Object(n["h"])("img",{onClick:e[7]||(e[7]=function(t){return o.agregar(2)}),src:j.a,alt:"Moneda 2 euros",width:o.sizeMonedas,class:"mr-2"},null,8,ot)])]),Object(n["h"])("div",at,[Object(n["h"])("div",ct,[Object(n["h"])("img",{onClick:e[8]||(e[8]=function(t){return o.agregar(5)}),src:C.a,alt:"Billete 5 euros",width:o.sizeBilletes},null,8,it),Object(n["h"])("img",{onClick:e[9]||(e[9]=function(t){return o.agregar(10)}),src:x.a,alt:"Billete 10 euros",width:o.sizeBilletes,class:"p-2"},null,8,st),Object(n["h"])("img",{onClick:e[10]||(e[10]=function(t){return o.agregar(20)}),src:E.a,alt:"Billete 20 euros",width:o.sizeBilletes,class:"p-2"},null,8,lt),Object(n["h"])("img",{onClick:e[11]||(e[11]=function(t){return o.agregar(50)}),src:A.a,alt:"Billete 50 euros",width:o.sizeBilletes,class:"p-2"},null,8,ut),Object(n["h"])("img",{onClick:e[12]||(e[12]=function(t){return o.agregar(100)}),src:L.a,alt:"Billete 100 euros",width:o.sizeBilletes,class:"p-2"},null,8,dt),Object(n["h"])("img",{onClick:e[13]||(e[13]=function(t){return o.agregar(200)}),src:P.a,alt:"Billete 200 euros",width:o.sizeBilletes,class:"p-2"},null,8,bt),Object(n["h"])("img",{onClick:e[14]||(e[14]=function(t){return o.agregar(500)}),src:F.a,alt:"Billete 500 euros",width:o.sizeBilletes,class:"p-2"},null,8,ft)])]),Object(n["h"])("div",ht,[Object(n["h"])("div",pt,[Object(n["h"])("div",gt,[Object(n["h"])("div",vt,[Object(n["h"])("div",mt,[Object(n["h"])("div",Ot,[Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[15]||(e[15]=function(t){return o.agregarTecla("7")})},"7"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[16]||(e[16]=function(t){return o.agregarTecla("8")})},"8"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[17]||(e[17]=function(t){return o.agregarTecla("9")})},"9")]),Object(n["h"])("div",jt,[Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[18]||(e[18]=function(t){return o.agregarTecla("4")})},"4"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[19]||(e[19]=function(t){return o.agregarTecla("5")})},"5"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[20]||(e[20]=function(t){return o.agregarTecla("6")})},"6")]),Object(n["h"])("div",yt,[Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[21]||(e[21]=function(t){return o.agregarTecla("1")})},"1"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[22]||(e[22]=function(t){return o.agregarTecla("2")})},"2"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[23]||(e[23]=function(t){return o.agregarTecla("3")})},"3")]),Object(n["h"])("div",Ct,[Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[24]||(e[24]=function(t){return o.borrarCuentas()})},"C"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[25]||(e[25]=function(t){return o.agregarTecla("0")})},"0"),Object(n["h"])("a",{class:"botonEze botonesCalculadora",onClick:e[26]||(e[26]=function(t){return o.agregarComa()})},",")])])]),Object(n["h"])("div",wt,[Object(n["h"])("span",xt," Total: "+Object(n["I"])(Number(o.total).toFixed(2))+" € ",1),kt,Object(n["h"])("span",Et," Dinero recibido: "+Object(n["I"])(o.cuenta+o.totalTkrs)+" € ",1),Tt,Object(n["h"])("span",At," Ticket Restaurant: "+Object(n["I"])(o.totalTkrs)+" € ",1),zt,o.faltaOSobra?(Object(n["x"])(),Object(n["g"])("span",Lt," Faltan: "+Object(n["I"])(o.total-(o.totalTkrs+o.cuenta))+" € ",1)):(Object(n["x"])(),Object(n["g"])("span",Mt," Sobran: "+Object(n["I"])(o.sobranX.toFixed(2))+" € ",1))])])]),Object(n["h"])("div",Pt,[!1===o.esVIP&&!1===o.esDevolucion&&!1===o.esConsumoPersonal&&o.botonesCobroActivo&&!1===o.tkrs?(Object(n["x"])(),Object(n["g"])("div",It,[Object(n["h"])("div",Ft,["EFECTIVO"==o.metodoPagoActivo?(Object(n["x"])(),Object(n["g"])("img",{key:0,onClick:e[27]||(e[27]=function(t){return o.setMetodoPago("EFECTIVO")}),src:R.a,alt:"Cobrar con efectivo",width:"185"})):(Object(n["x"])(),Object(n["g"])("img",{key:1,onClick:e[28]||(e[28]=function(t){return o.setMetodoPago("EFECTIVO")}),src:B.a,alt:"Cobrar con efectivo",width:"185"}))]),Object(n["h"])("div",Nt,["TARJETA"==o.metodoPagoActivo?(Object(n["x"])(),Object(n["g"])("img",{key:0,onClick:e[29]||(e[29]=function(t){return o.setMetodoPago("TARJETA")}),src:D.a,alt:"Cobrar con tarjeta",width:"185"})):(Object(n["x"])(),Object(n["g"])("img",{key:1,onClick:e[30]||(e[30]=function(t){return o.setMetodoPago("TARJETA")}),src:G.a,alt:"Cobrar con tarjeta",width:"185"}))])])):Object(n["f"])("",!0),Object(n["h"])("div",Rt,[_t,"PAYTEF"==o.tipoDatafono?(Object(n["x"])(),Object(n["g"])("div",Bt,[Object(n["h"])("img",{onClick:e[31]||(e[31]=function(t){return o.cancelarOperacionDatafono()}),src:H.a,alt:"tkrs",width:"185"})])):Object(n["f"])("",!0)]),Object(n["h"])("div",{class:Object(n["r"])(["row mt-2",{datafonoEsperando:!o.esperando}])},Dt,2)])])]),Object(n["h"])("div",Vt,[Object(n["h"])("div",Gt,[Object(n["h"])("div",Jt,[Object(n["h"])("button",{type:"button",onClick:e[32]||(e[32]=function(t){return o.volver()}),class:"btn btn-warning ms-4 botonesPrincipales"},"Volver"),Object(n["h"])("button",{type:"button",onClick:e[33]||(e[33]=function(t){return o.reset()}),class:"btn btn-danger ms-4 botonesPrincipales"},"Reset ")])])]),Object(n["h"])("div",Kt,[Object(n["h"])("div",Yt,[Object(n["h"])("button",{onClick:e[34]||(e[34]=function(t){return o.cobrar()}),class:"btn btn-secondary w-100 totalStyle botonCobrar menusColorIvan"}," Cobrar "+Object(n["I"])(o.cobrarVariable)+" € ",1)])]),Object(n["h"])("div",Ht,[Object(n["h"])("div",Ut,[Object(n["h"])("div",Xt,[qt,Object(n["h"])("div",Qt,[Object(n["h"])("div",Wt,[Zt,Object(n["R"])(Object(n["h"])("input",{type:"number","onUpdate:modelValue":e[35]||(e[35]=function(t){return o.totalTkrs=t}),class:"form-control",style:{"font-size":"45px"}},null,512),[[n["N"],o.totalTkrs]])])]),Object(n["h"])("div",$t,[te,Object(n["h"])("button",{type:"button",class:"btn btn-primary btn-lg","data-bs-dismiss":"modal",onClick:e[36]||(e[36]=function(t){return o.configurarCantidad()})},"Aceptar")])])])])],64)}var re=r("1da1"),ne=(r("96cf"),r("ac1f"),r("5319"),r("bc3a")),oe=r.n(ne),ae=r("5502"),ce=r("6c02"),ie=r("0180"),se=r("a18c"),le=r("6c23"),ue={name:"CobroComponent",setup:function(){var t=Object(ie["b"])(),e=(Object(ce["c"])(),Object(ae["b"])()),r=Object(n["C"])(0),o=(e.getters["getModoActual"],e.getters["Clientes/getInfoCliente"]),a="100",c="150",i=!1,s=!1,l=!1,u=!0,d=Object(n["C"])(!1),b=Object(n["C"])(0),f=Object(n["C"])(0),h=Object(n["C"])("TARJETA"),p=Object(n["C"])(0),g=Object(n["C"])(0),v=e.getters["Cesta/getCestaId"],m=Object(n["C"])([]),O=Object(n["C"])(null),j=Object(n["c"])((function(){return e.state.esperandoDatafono}));function y(){return oe.a.post("cestas/getCestaCurrent",{idCesta:v}).then((function(t){return t.data.error?(console.log(t.data.mensaje),-1):t.data.info._id}))["catch"]((function(e){return console.log(e),t.error(e.message),-1}))}function C(){b.value=0,f.value=0,p.value=0,g.value=0}function w(t){f.value=String(Number(f.value+t))}function x(){oe.a.get("paytef/cancelarOperacionActual").then((function(e){e.data||t.error("Error, no se ha podido cancelar la operación en curso")}))["catch"]((function(e){console.log(e),t.error("Error catch cancelar operación")}))}function k(){j.value?t.info("Hay una operación pendiente, debes cancelarla antes de salir."):se["a"].push("/")}function E(){d.value?p.value="".concat(p.value.replace(".",""),"."):f.value="".concat(f.value.replace(".",""),".")}function T(t){p.value=t}function A(){var t=Number(p.value);t>0?T(t):console.log("Importe ticket restaurant incorrecto")}function z(t){b.value+=t}function L(){d.value?(d.value=!1,h.value="EFECTIVO"):(h.value="TICKET_RESTAURANT",d.value=!0)}function M(){p.value=0,b.value=0,f.value=0}function P(t){h.value=t}oe.a.post("cestas/getCestaCurrent",{idCesta:v}).then((function(e){!1===e.data.error?r.value=e.data.info.tiposIva.importe1+e.data.info.tiposIva.importe2+e.data.info.tiposIva.importe3:(r.value=0,t.error(e.data.error))}))["catch"]((function(e){console.log(e),t.error("No se ha podido cargar la cesta")}));var I=Object(n["c"])((function(){return r.value-p.value<=0?0:(r.value-p.value).toFixed(2).replace(".",",")})),F=Object(n["c"])((function(){return d.value?r.value-p.value?(u=!0,g.value+p.value+r.value):(u=!1,g.value):g.value+p.value-r.value})),N=Object(n["c"])((function(){return g.value+p.value-r.value<0})),R=Object(n["P"])((function(){g.value=b.value})),_=Object(n["P"])((function(){g.value=Number(f.value)}));function B(t){e.dispatch("setEsperandoDatafono",t)}function S(){return D.apply(this,arguments)}function D(){return D=Object(re["a"])(regeneratorRuntime.mark((function e(){var n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(j.value||!(r.value>0)){e.next=21;break}return e.next=3,y();case 3:if(n=e.sent,e.t0=p.value>0,!e.t0){e.next=11;break}return e.next=8,n;case 8:e.t1=e.sent,e.t2=-1,e.t0=e.t1!=e.t2;case 11:if(!e.t0){e.next=16;break}a={total:Number(r.value),totalTkrs:p.value,idCesta:n,idCliente:o},oe.a.post("tickets/crearTicketTKRS",a).then((function(e){if(e.data.error)t.error("Error al insertar el ticket.");else{C();try{oe.a.post("impresora/abrirCajon")}catch(r){t.error("No se ha podido abrir el cajón.")}t.success("Ticket OK"),se["a"].push("/")}}))["catch"]((function(e){console.log(e),t.error("Error")})),e.next=19;break;case 16:"EFECTIVO"===h.value&&oe.a.post("tickets/crearTicketEfectivo",{total:Number(r.value),idCesta:n,idCliente:o}).then((function(e){if(e.data.error)console.log(e.data.mensaje),t.error("Error al insertar el ticket");else{C();try{oe.a.post("impresora/abrirCajon")}catch(r){t.error("No se ha podido abrir el cajón")}t.success("Ticket OK"),se["a"].push("/")}}))["catch"]((function(e){console.log(e),t.error("Error")})),"TARJETA 3G"===h.value&&oe.a.post("tickets/crearTicketDatafono3G",{total:Number(r),idCesta:n,idCliente:o}).then((function(e){e.data.error?t.error("Error al insertar el ticket"):(C(),se["a"].push({name:"Home",params:{tipoToast:"success",mensajeToast:"Ticket creado"}}))}))["catch"]((function(e){console.log(e),t.error("Error")})),"TARJETA"===h.value&&("CLEARONE"==O.value?(Object(le["emitSocket"])("enviarAlDatafono",{total:Number(r),idCesta:n,idClienteFinal:o}),B(!0)):"PAYTEF"==O.value&&(B(!0),Object(le["emitSocket"])("iniciarTransaccion",{idClienteFinal:o,idCesta:v})));case 19:e.next=22;break;case 21:0===r.value&&t.error("El valor de la cesta es 0");case 22:case"end":return e.stop()}}),e)}))),D.apply(this,arguments)}function C(){return V.apply(this,arguments)}function V(){return V=Object(re["a"])(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,oe.a.post("trabajadores/getCurrentTrabajador",{});case 2:n=r.sent,n.data.error&&t.error(n.data.mensaje),e.dispatch("setModoActual","NORMAL"),e.dispatch("Clientes/resetClienteActivo"),e.dispatch("Footer/resetMenuActivo"),oe.a.post("promociones/setEstadoPromociones",{estadoPromociones:!0});case 8:case"end":return r.stop()}}),r)}))),V.apply(this,arguments)}function G(){oe.a.post("cestas/enviarACocina",{idCesta:cestaID.value}).then((function(e){e.error?t.error("Error al enviar el pedido a cocina."):(t.success("OK."),k())}))}function J(){console.log("test vacío")}return Object(n["v"])((function(){oe.a.post("parametros/getParametros").then((function(t){O.value=t.data.parametros.tipoDatafono}))["catch"]((function(e){console.log(e),t.error("Error inicialización cobroMenu")}))})),{test:J,total:r,sizeBilletes:c,sizeMonedas:a,esVIP:i,esDevolucion:s,esConsumoPersonal:l,botonesCobroActivo:u,tkrs:d,agregarTecla:w,agregarComa:E,agregar:z,cobrarVariable:I,sobranX:F,faltaOSobra:N,cuentaAsistente:R,cuentaAsistenteTeclado:_,cuenta:g,totalTkrs:p,borrarCuentas:M,setMetodoPago:P,metodoPagoActivo:h,alternarTkrs:L,configurarCantidad:A,reset:C,arrayFichados:m,volver:k,cobrar:S,esperando:j,enviarACocina:G,cancelarOperacionDatafono:x,tipoDatafono:O}}},de=(r("7abc"),r("d959")),be=r.n(de);const fe=be()(ue,[["render",ee],["__scopeId","data-v-5d629f31"]]);var he=fe,pe={name:"Cobro",components:{CobroComponent:he}};const ge=be()(pe,[["render",o]]);e["default"]=ge},fbdd:function(t,e,r){t.exports=r.p+"img/2cts.b4040beb.png"}}]);
//# sourceMappingURL=chunk-15035695.6af77f51.js.map