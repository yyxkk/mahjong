System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody, Node, Vec3, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, PanShake;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      RigidBody = _cc.RigidBody;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "05ceduugDlG4IwsRsM76MYQ", "PanShake", undefined);

      __checkObsolete__(['_decorator', 'Component', 'RigidBody', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PanShake", PanShake = (_dec = ccclass('PanShake'), _dec2 = property(Node), _dec(_class = (_class2 = class PanShake extends Component {
        constructor(...args) {
          super(...args);

          // 锅内小球父节点
          _initializerDefineProperty(this, "ballParent", _descriptor, this);

          // 向上抛力
          _initializerDefineProperty(this, "jumpForce", _descriptor2, this);

          // 水平随机偏移力度
          _initializerDefineProperty(this, "horizontalForce", _descriptor3, this);

          // 空中旋转扭矩大小
          _initializerDefineProperty(this, "rotateTorque", _descriptor4, this);

          // 点击冷却时间
          _initializerDefineProperty(this, "coolDownTime", _descriptor5, this);

          this.coolDownTimer = 0;
        }

        update(delta) {
          if (this.coolDownTimer > 0) this.coolDownTimer -= delta;
        }

        onPanShakeBtnClick() {
          // 冷却拦截，防止连点叠加冲量
          if (this.coolDownTimer > 0 || !this.ballParent) return;
          this.coolDownTimer = this.coolDownTime;

          for (const child of this.ballParent.children) {
            const rigid = child.getComponent(RigidBody);
            if (!rigid) continue; // 1. 施加向上抛的线性冲量

            const randX = (Math.random() - 0.5) * this.horizontalForce;
            const randZ = (Math.random() - 0.5) * this.horizontalForce;
            const impulse = new Vec3(randX, this.jumpForce, randZ);
            rigid.applyImpulse(impulse); // 2. 施加随机旋转扭矩，升空自带翻滚

            const torque = new Vec3((Math.random() - 0.5) * this.rotateTorque, (Math.random() - 0.5) * this.rotateTorque * 0.5, (Math.random() - 0.5) * this.rotateTorque);
            rigid.applyTorque(torque);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ballParent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "jumpForce", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "horizontalForce", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotateTorque", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "coolDownTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.4;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=df73d905b573307de27f0d88cd03e2b06ee6cb15.js.map