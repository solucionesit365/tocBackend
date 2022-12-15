"use strict";(self["webpackChunktoc_game_v4"]=self["webpackChunktoc_game_v4"]||[]).push([[700],{9741:function(a,e,o){o.d(e,{Z:function(){return d}});var r=o(3396);const s={class:"input-group position-absolute bottom-0 start-0"};function t(a,e,o,t,l,i){return(0,r.wg)(),(0,r.iD)("div",s,[(0,r._)("button",{onClick:e[0]||(e[0]=a=>t.volver()),class:"btn btn-warning ms-2",style:{"font-size":"27px"}}," VOLVER ")])}var l=o(9351),i={name:"VolverComponent",setup(){function a(){l.Z.back()}return{volver:a}}},c=o(89);const n=(0,c.Z)(i,[["render",t]]);var d=n},6700:function(a,e,o){o.r(e),o.d(e,{default:function(){return R}});var r=o(3396);const s={class:"w-50 mx-auto"},t={class:"row mt-2"},l={class:"row mt-2"},i={class:"row mt-2"},c={class:"row mt-2"},n={class:"row mt-2"},d={class:"row mt-2"},u={class:"row mt-2"},m={class:"row mt-2"},p={class:"row mt-2"},f={class:"row mt-2"},g={class:"row mt-2"};function v(a,e,o,v,w,_){const k=(0,r.up)("MDBBtn"),h=(0,r.up)("VolverComponent"),z=(0,r.up)("ModalImpresoraComponent");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r._)("div",s,[(0,r._)("div",t,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[0]||(e[0]=a=>v.descargarClientesFinales())},{default:(0,r.w5)((()=>[(0,r.Uk)("Descargar clientes finales")])),_:1})]),(0,r._)("div",l,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[1]||(e[1]=a=>v.descargarTarifasEspeciales())},{default:(0,r.w5)((()=>[(0,r.Uk)("Descargar tarifas especiales")])),_:1})]),(0,r._)("div",i,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[2]||(e[2]=a=>v.actualizarParametros())},{default:(0,r.w5)((()=>[(0,r.Uk)("Actualizar parámetros tienda")])),_:1})]),(0,r._)("div",c,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[3]||(e[3]=a=>v.actualizarTrabajadores())},{default:(0,r.w5)((()=>[(0,r.Uk)("Actualizar trabajadores")])),_:1})]),(0,r._)("div",n,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[4]||(e[4]=a=>v.actualizarTeclados())},{default:(0,r.w5)((()=>[(0,r.Uk)("Actualizar teclado")])),_:1})]),(0,r._)("div",d,[v.modalImpresoraRef?((0,r.wg)(),(0,r.j4)(k,{key:0,color:"primary",size:"lg",class:"w-100",onClick:e[5]||(e[5]=a=>v.modalImpresoraRef.abrirModal())},{default:(0,r.w5)((()=>[(0,r.Uk)("Config. VID y PID impresora, Visor")])),_:1})):(0,r.kq)("",!0)]),(0,r._)("div",u,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100"},{default:(0,r.w5)((()=>[(0,r.Uk)("Config. IP Paytef")])),_:1})]),(0,r._)("div",m,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[6]||(e[6]=a=>v.imprimirTest())},{default:(0,r.w5)((()=>[(0,r.Uk)("Imprimir test")])),_:1})]),(0,r._)("div",p,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[7]||(e[7]=a=>v.cambiarPrecio())},{default:(0,r.w5)((()=>[(0,r.Uk)("Editar productos")])),_:1})]),(0,r._)("div",f,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100"},{default:(0,r.w5)((()=>[(0,r.Uk)("Listado de ventas")])),_:1})]),(0,r._)("div",g,[(0,r.Wm)(k,{color:"primary",size:"lg",class:"w-100",onClick:e[8]||(e[8]=a=>v.goToDoctor())},{default:(0,r.w5)((()=>[(0,r.Uk)("Toc Doctor")])),_:1})])]),(0,r.Wm)(h),(0,r.Wm)(z,{ref:"modalImpresoraRef"},null,512)],64)}var w=o(9741),_=o(4313),k=o(2492),h=o.n(k),z=o(70),T=o(9242);const b={class:"row"},y={key:0,class:"row mt-2"},B={class:"input-group mb-3"},C=(0,r._)("span",{class:"input-group-text",id:"basic-addon1"},"VID",-1),D={class:"input-group mb-3"},I=(0,r._)("span",{class:"input-group-text",id:"basic-addon1"},"PID",-1),U={class:"row mt-2"},M={class:"d-inline-block text-end"};function E(a,e,o,s,t,l){const i=(0,r.up)("MDBSelect"),c=(0,r.up)("MDBBtn"),n=(0,r.up)("MDBModalBody"),d=(0,r.up)("MDBModal");return(0,r.wg)(),(0,r.j4)(d,{id:"modalImpresora",tabindex:"-1",labelledby:"tituloModalImpresora",modelValue:s.modalImpresora,"onUpdate:modelValue":e[5]||(e[5]=a=>s.modalImpresora=a),staticBackdrop:"",size:"xl"},{default:(0,r.w5)((()=>[(0,r.Wm)(n,null,{default:(0,r.w5)((()=>[(0,r._)("div",b,[(0,r.Wm)(i,{options:s.opciones,"onUpdate:options":e[0]||(e[0]=a=>s.opciones=a),size:"lg",label:"Tipo impresora"},null,8,["options"])]),"USB"===s.selected?((0,r.wg)(),(0,r.iD)("div",y,[(0,r._)("div",B,[C,(0,r.wy)((0,r._)("input",{type:"text",class:"form-control form-control-lg","onUpdate:modelValue":e[1]||(e[1]=a=>s.vid=a),placeholder:"0x04B8"},null,512),[[T.nr,s.vid]])]),(0,r._)("div",D,[I,(0,r.wy)((0,r._)("input",{type:"text",class:"form-control form-control-lg","onUpdate:modelValue":e[2]||(e[2]=a=>s.pid=a),placeholder:"0x0202"},null,512),[[T.nr,s.pid]])])])):(0,r.kq)("",!0),(0,r._)("div",U,[(0,r._)("div",M,[(0,r.Wm)(c,{color:"primary",size:"lg",onClick:e[3]||(e[3]=a=>s.guardar())},{default:(0,r.w5)((()=>[(0,r.Uk)("Guardar")])),_:1}),(0,r.Wm)(c,{color:"danger",size:"lg",class:"mt-2",onClick:e[4]||(e[4]=a=>s.modalImpresora=!1)},{default:(0,r.w5)((()=>[(0,r.Uk)("Cancelar")])),_:1})])])])),_:1})])),_:1},8,["modelValue"])}var V=o(4870),W={name:"ModalImpresoraComponent",components:{MDBModal:_.j3,MDBModalBody:_.Yz,MDBBtn:_.$v,MDBSelect:_.R3},setup(a,{expose:e}){const o=(0,V.iH)(!1),s=(0,V.iH)(""),t=(0,V.iH)(""),l=(0,V.iH)([{text:"USB",value:"USB",selected:!0},{text:"SERIE",value:"SERIE"},{text:"MQTT",value:"MQTT"}]),i=(0,r.Fl)((()=>{if(l.value)for(let a=0;a<l.value.length;a++)if(!0===l.value[a]?.selected)return l.value[a].value;return"USB"}));function c(){o.value=!0}async function n(){try{switch(i.value){case"USB":if(""==s.value||""==t.value)throw Error("El tipo USB necesita los valores VID y PID");{const a=await z.Z.post("parametros/setVidAndPid",{vid:s.value,pid:t.value});if(!a.data)throw Error("Error al guardar los parámetros de la impresora USB");h().fire("OK","Datos de la impresora USB guardados correctamente","success"),o.value=!1}break;default:if("SERIE"!==i.value&&"MQTT"!==i.value)throw Error("Tipo de impresora desconocido");{const a=await z.Z.post("parametros/setTipoImpresora",{tipo:i.value});if(!a.data)throw Error("No se ha podido guardar el tipo de impresora");h().fire("OK","Datos de la impresora USB guardados correctamente","success"),o.value=!1}}}catch(a){h().fire("Oops...",a.message,"error")}}return e({abrirModal:c}),{modalImpresora:o,opciones:l,selected:i,vid:s,pid:t,guardar:n}}},x=o(89);const S=(0,x.Z)(W,[["render",E]]);var P=S,O={name:"TecnicoView",components:{VolverComponent:w.Z,ModalImpresoraComponent:P,MDBBtn:_.$v},setup(){const a=(0,V.iH)(null);function e(){z.Z.post("clientes/descargarClientesFinales").then((a=>{if(!a.data)throw Error("No se han podido descargar los clientes finales");h().fire("OK","Clientes finales actualizados correctamente","success")})).catch((a=>{h().fire("Oops...",a.message,"error")}))}function o(){console.log("descargarTicketInfo")}function r(){z.Z.get("tarifas/descargarTarifas").then((a=>{if(!a.data)throw Error("No se han podido descargar las tarifas especiales");h().fire("OK","Tarifas especiales descargadas correctamente","success")})).catch((a=>{h().fire("Oops...",a.message,"error")}))}function s(){console.log("actualizarTrabajadores")}function t(){z.Z.post("teclado/actualizarTeclado").then((a=>{if(!a.data)throw Error("No se ha podido actualizar el teclado");h().fire("OK","Teclado actualizado correctamente","success"),document.location.href="http://localhost:3000"})).catch((a=>{h().fire("Oops...",a.message,"error")}))}function l(){console.log("imprimirTest")}function i(){console.log("cambiarPrecio")}function c(){z.Z.get("parametros/actualizarParametros").then((a=>{if(!a.data)throw Error("No se han podido actualizar los parámetros");h().fire("OK","Parámetros actualizados correctamente","success"),document.location.href="http://localhost:3000"})).catch((a=>{h().fire("Oops...",a.message,"error")}))}function n(){console.log("goToDoctor")}return{descargarClientesFinales:e,descargarTarifasEspeciales:r,descargarTicketInfo:o,actualizarTrabajadores:s,actualizarTeclados:t,imprimirTest:l,cambiarPrecio:i,actualizarParametros:c,goToDoctor:n,modalImpresoraRef:a}}};const Z=(0,x.Z)(O,[["render",v]]);var R=Z}}]);
//# sourceMappingURL=700.6a68f791.js.map