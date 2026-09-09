System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody, _dec, _class, _crd, ccclass, AutoSetupBallRigid;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      RigidBody = _cc.RigidBody;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8554c9cj0tCBKazmHjj/X4F", "BatchCloseRot", undefined);

      __checkObsolete__(['_decorator', 'Component', 'RigidBody', 'Node', 'Vec3']);

      ({
        ccclass
      } = _decorator);

      _export("AutoSetupBallRigid", AutoSetupBallRigid = (_dec = ccclass('AutoSetupBallRigid'), _dec(_class = class AutoSetupBallRigid extends Component {
        start() {
          this.traverseAllNode(this.node.scene);
        }

        traverseAllNode(parent) {
          var rigid = parent.getComponent(RigidBody);

          if (rigid) {
            // 完全放开XYZ三轴旋转
            rigid.angularFactor.set(1, 1, 1);
            rigid.linearFactor.set(1, 1, 1);
            rigid.allowSleep = false;
            rigid.useCCD = true; // 大幅降低旋转阻尼，旋转不会瞬间消失

            rigid.angularDamping = 0.05;
            rigid.linearDamping = 0.1;
          }

          for (var child of parent.children) {
            this.traverseAllNode(child);
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2d7cebde9d715c110ca4981ae022fd3e485cd4b2.js.map