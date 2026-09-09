System.register("chunks:///_virtual/BatchCloseRot.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var t,o,r,a,n,l;return{setters:[function(e){t=e.inheritsLoose,o=e.createForOfIteratorHelperLoose},function(e){r=e.cclegacy,a=e._decorator,n=e.RigidBody,l=e.Component}],execute:function(){var i;r._RF.push({},"8554c9cj0tCBKazmHjj/X4F","BatchCloseRot",void 0);var s=a.ccclass;e("AutoSetupBallRigid",s("AutoSetupBallRigid")(i=function(e){function r(){return e.apply(this,arguments)||this}t(r,e);var a=r.prototype;return a.start=function(){this.traverseAllNode(this.node.scene)},a.traverseAllNode=function(e){var t=e.getComponent(n);t&&(t.angularFactor.set(1,1,1),t.linearFactor.set(1,1,1),t.allowSleep=!1,t.useCCD=!0,t.angularDamping=.05,t.linearDamping=.1);for(var r,a=o(e.children);!(r=a()).done;){var l=r.value;this.traverseAllNode(l)}},r}(l))||i);r._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./BatchCloseRot.ts","./PanShake.ts"],(function(){return{setters:[null,null],execute:function(){}}}));

System.register("chunks:///_virtual/PanShake.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var r,o,t,n,i,a,l,c,u,p,s;return{setters:[function(e){r=e.applyDecoratedDescriptor,o=e.inheritsLoose,t=e.initializerDefineProperty,n=e.assertThisInitialized,i=e.createForOfIteratorHelperLoose},function(e){a=e.cclegacy,l=e._decorator,c=e.Node,u=e.RigidBody,p=e.Vec3,s=e.Component}],execute:function(){var h,m,f,b,d,w,y,T,g;a._RF.push({},"05ceduugDlG4IwsRsM76MYQ","PanShake",void 0);var v=l.ccclass,D=l.property;e("PanShake",(h=v("PanShake"),m=D(c),h((d=r((b=function(e){function r(){for(var r,o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];return r=e.call.apply(e,[this].concat(i))||this,t(r,"ballParent",d,n(r)),t(r,"jumpForce",w,n(r)),t(r,"horizontalForce",y,n(r)),t(r,"rotateTorque",T,n(r)),t(r,"coolDownTime",g,n(r)),r.coolDownTimer=0,r}o(r,e);var a=r.prototype;return a.update=function(e){this.coolDownTimer>0&&(this.coolDownTimer-=e)},a.onPanShakeBtnClick=function(){if(!(this.coolDownTimer>0)&&this.ballParent){this.coolDownTimer=this.coolDownTime;for(var e,r=i(this.ballParent.children);!(e=r()).done;){var o=e.value.getComponent(u);if(o){var t=(Math.random()-.5)*this.horizontalForce,n=(Math.random()-.5)*this.horizontalForce,a=new p(t,this.jumpForce,n);o.applyImpulse(a);var l=new p((Math.random()-.5)*this.rotateTorque,(Math.random()-.5)*this.rotateTorque*.5,(Math.random()-.5)*this.rotateTorque);o.applyTorque(l)}}}},r}(s)).prototype,"ballParent",[m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),w=r(b.prototype,"jumpForce",[D],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 5}}),y=r(b.prototype,"horizontalForce",[D],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 1}}),T=r(b.prototype,"rotateTorque",[D],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 3}}),g=r(b.prototype,"coolDownTime",[D],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return.4}}),f=b))||f));a._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});