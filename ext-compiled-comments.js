"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/scratch-vm.ts
var require_scratch_vm = __commonJS({
  "src/scratch-vm.ts"(exports2, module2) {
    "use strict";
    module2.exports = Scratch;
  }
});

// src/index.ts
var import_scratch_vm2 = __toESM(require_scratch_vm());

// src/include.ts
var import_scratch_vm = __toESM(require_scratch_vm());
var Block;
((Block2) => {
  let ParserState;
  ((ParserState2) => {
    ParserState2[ParserState2["Text"] = 0] = "Text";
    ParserState2[ParserState2["ArgName"] = 1] = "ArgName";
    ParserState2[ParserState2["ArgType"] = 2] = "ArgType";
  })(ParserState || (ParserState = {}));
  class BlockBuilder {
    blockOpcode;
    blockFunc;
    blockArgumentDefaults;
    blockHideFromPalette;
    blockBlockType;
    blockIsTerminal;
    blockBranchCount;
    blockIsEdgeActived;
    blockShouldRestartExistingThreads;
    blockIsMonitor;
    blockFilter;
    blockBlockIconURI;
    blockText;
    blockAction;
    constructor(opcode) {
      this.blockOpcode = opcode;
      this.blockArgumentDefaults = {};
      this.blockBlockType = import_scratch_vm.BlockType.COMMAND;
      this.blockIsMonitor = false;
    }
    func(func) {
      this.blockFunc = func;
      return this;
    }
    arguments(arguments_) {
      this.blockArgumentDefaults = arguments_;
      return this;
    }
    hide(hide) {
      this.blockHideFromPalette = hide;
      return this;
    }
    addFilter(filter) {
      if (!this.blockFilter) this.blockFilter = [];
      this.blockFilter.push(filter);
      return this;
    }
    blockType(blockType) {
      this.blockBlockType = blockType;
      return this;
    }
    terminal(terminal) {
      this.blockIsTerminal = terminal;
      return this;
    }
    branchCount(branchCount) {
      this.blockBranchCount = branchCount;
      return this;
    }
    edgeActived(edgeActived) {
      this.blockIsEdgeActived = edgeActived;
      return this;
    }
    restartExistingThreads(restartExistingThreads) {
      this.blockShouldRestartExistingThreads = restartExistingThreads;
      return this;
    }
    monitor(monitor) {
      this.blockIsMonitor = monitor;
      return this;
    }
    blockIconURI(blockIconURI) {
      this.blockBlockIconURI = blockIconURI;
      return this;
    }
    text(text) {
      this.blockText = text;
      return this;
    }
    action(action) {
      this.blockAction = action;
      return this;
    }
    static argTypeFromString(type) {
      switch (type) {
        case "number":
          return import_scratch_vm.ArgumentType.NUMBER;
        case "string":
          return import_scratch_vm.ArgumentType.STRING;
        case "boolean":
          return import_scratch_vm.ArgumentType.BOOLEAN;
        case "angle":
          return import_scratch_vm.ArgumentType.ANGLE;
        case "color":
          return import_scratch_vm.ArgumentType.COLOR;
        case "matrix":
          return import_scratch_vm.ArgumentType.MATRIX;
        case "note":
          return import_scratch_vm.ArgumentType.NOTE;
        default:
          return "";
      }
    }
    static parseText(text_, defaults) {
      const arguments_ = {};
      let text = "", argname = "", type = "", curr = 0;
      let state = 0 /* Text */;
      while (curr < text_.length) {
        switch (state) {
          case 0 /* Text */: {
            if (text_[curr] === "[") {
              state = 1 /* ArgName */;
              argname = "";
            }
            text += text_[curr];
            curr += 1;
            break;
          }
          case 1 /* ArgName */: {
            if (text_[curr] === ":") {
              state = 2 /* ArgType */;
              type = "";
            } else {
              argname += text_[curr];
              text += text_[curr];
            }
            curr += 1;
            break;
          }
          case 2 /* ArgType */: {
            if (text_[curr] === "]") {
              state = 0 /* Text */;
              text += "]";
              const default_ = defaults[argname];
              let defaultValue;
              let menu;
              if (default_) {
                if (typeof default_ === "object" && default_.type === "menu") {
                  menu = default_.menu;
                } else {
                  defaultValue = default_;
                }
              }
              arguments_[argname] = {
                type: BlockBuilder.argTypeFromString(type),
                defaultValue,
                menu
              };
            } else {
              type += text_[curr];
            }
            curr += 1;
            break;
          }
        }
      }
      return { arguments_, text };
    }
    build() {
      if (this.blockText === void 0) {
        throw new SyntaxError(`cannot initialize extension: block \`${this.blockOpcode}\`: missing text or argument defaults`);
      }
      const { arguments_, text } = BlockBuilder.parseText(
        this.blockText,
        this.blockArgumentDefaults
      );
      return {
        opcode: this.blockOpcode,
        func: this.blockFunc,
        blockType: this.blockBlockType,
        action: this.blockAction ?? (() => {
        }),
        arguments: arguments_,
        hideFromPalette: this.blockHideFromPalette,
        blockIconURI: this.blockBlockIconURI,
        text,
        filter: this.blockFilter,
        isTerminal: this.blockIsTerminal,
        branchCount: this.blockBranchCount,
        isEdgeActived: this.blockIsEdgeActived,
        shouldRestartExistingThreads: this.blockShouldRestartExistingThreads,
        disableMonitor: !this.blockIsMonitor
      };
    }
  }
  Block2.create = (opcode) => {
    return new BlockBuilder(opcode);
  };
})(Block || (Block = {}));
var Extension;
((Extension2) => {
  class ExtensionBuilder {
    extId;
    extName;
    extAuthor;
    extDescription;
    extMenuIconURI;
    extBlockIconURI;
    extDocsURI;
    extColors;
    extUnsandboxed;
    extBlocks;
    extMenus;
    constructor(extId) {
      this.extId = extId;
      this.extName = "Unnamed Extension";
      this.extColors = [void 0, void 0, void 0];
      this.extUnsandboxed = false;
      this.extBlocks = [];
      this.extMenus = {};
    }
    enableUnsandboxedCheck() {
      this.extUnsandboxed = true;
      return this;
    }
    name(name) {
      this.extName = name;
      return this;
    }
    author(author) {
      this.extAuthor = author;
      return this;
    }
    description(description) {
      this.extDescription = description;
      return this;
    }
    menuIconURI(menuIconURI) {
      this.extMenuIconURI = menuIconURI;
      return this;
    }
    blockIconURI(blockIconURI) {
      this.extBlockIconURI = blockIconURI;
      return this;
    }
    iconURI(iconURI) {
      this.menuIconURI(iconURI);
      return this.blockIconURI(iconURI);
    }
    color = (arg1, arg2) => {
      if (arg2) {
        this.extColors[arg1 - 1] = arg2;
      } else {
        this.extColors = [arg1, arg1, arg1];
      }
      return this;
    };
    addBlock(block) {
      this.extBlocks.push(block);
      return this;
    }
    addMenu(menuId, menu) {
      this.extMenus[menuId] = menu;
      return this;
    }
    getInfo() {
      return {
        id: this.extId,
        name: this.extName,
        author: this.extAuthor,
        description: this.extDescription,
        color1: this.extColors[0],
        color2: this.extColors[1],
        color3: this.extColors[2],
        menuIconURI: this.extMenuIconURI,
        blockIconURI: this.extBlockIconURI,
        docsURI: this.extDocsURI,
        blocks: this.extBlocks,
        menus: this.extMenus
      };
    }
    register() {
      const info = this.getInfo();
      class __Ext {
        getInfo() {
          return info;
        }
      }
      for (const block_ of this.extBlocks) {
        if (block_ === "---") continue;
        const block = block_;
        if (!block.opcode) continue;
        const func = block.func ?? block.opcode;
        __Ext.prototype[func] = block.action;
        delete block.action;
      }
      Scratch.extensions.register(new __Ext());
    }
  }
  Extension2.create = (extId) => {
    return new ExtensionBuilder(extId);
  };
})(Extension || (Extension = {}));

// src/compiler.ts
var patchCompiler = () => {
  var _a, _b, _c;
  const dangerousExports = (
    // @ts-expect-error missing typing
    ((_b = (_a = Scratch.vm) == null ? void 0 : _a.exports) == null ? void 0 : _b.i_will_not_ask_for_help_when_these_break) && // @ts-expect-error missing typing
    ((_c = Scratch.vm) == null ? void 0 : _c.exports.i_will_not_ask_for_help_when_these_break())
  );
  if (!dangerousExports) {
    console.error("compiled-comments: compiler patching failed. The extension will run in a slower mode.");
    return;
  }
  const ASTGen = dangerousExports.ScriptTreeGenerator;
  const JSGen = dangerousExports.JSGenerator;
  const ast_descendInput = ASTGen.prototype.descendInput;
  ASTGen.prototype.descendInput = function(block, ...otherParams) {
    switch (block.opcode) {
      case "commentReporter":
      case "commentBoolean":
        return this.descendInputOfBlock(block, "INPUT");
      default:
        return ast_descendInput.call(this, block, ...otherParams);
    }
  };
  const ast_descendStackedBlock = ASTGen.prototype.descendStackedBlock;
  ASTGen.prototype.descendStackedBlock = function(block, ...otherParams) {
    switch (block.opcode) {
      case "commentCommand":
      case "commentC":
        return {
          kind: "compiledcomments.comment"
        };
      default:
        return ast_descendStackedBlock.call(this, block, ...otherParams);
    }
  };
  const js_descendStackedBlock = JSGen.prototype.descendStackedBlock;
  JSGen.prototype.descendStackedBlock = function(node, ...otherParams) {
    switch (node.kind) {
      case "compiledcomments.comment":
        break;
      default:
        js_descendStackedBlock.call(this, node, ...otherParams);
    }
  };
};

// src/index.ts
var defaultComment = Scratch.translate("This is a comment...");
patchCompiler();
Extension.create("compiledcomments").name(Scratch.translate("Compiled Comments")).color("#3f3f6f").addBlock(
  Block.create("commentHat").text("// [COMMENT:string]").arguments({
    COMMENT: defaultComment
  }).blockType(import_scratch_vm2.BlockType.HAT).edgeActived(false).action((_args, _utils) => false).build()
).addBlock(
  Block.create("commentCommand").text("// [COMMENT:string]").arguments({
    COMMENT: defaultComment
  }).blockType(import_scratch_vm2.BlockType.COMMAND).action((_args, _utils) => {
  }).build()
).addBlock(
  Block.create("commentC").text("// [COMMENT:string]").arguments({
    COMMENT: defaultComment
  }).branchCount(1).blockType(import_scratch_vm2.BlockType.CONDITIONAL).action((_args, _utils) => true).build()
).addBlock(
  Block.create("commentReporter").text("[INPUT:string] // [COMMENT:string]").arguments({
    COMMENT: defaultComment
  }).blockType(import_scratch_vm2.BlockType.REPORTER).action((args, _utils) => args.INPUT).build()
).addBlock(
  Block.create("commentBoolean").text("[INPUT:boolean] // [COMMENT:string]").arguments({
    COMMENT: defaultComment
  }).blockType(import_scratch_vm2.BlockType.BOOLEAN).action((args, _utils) => args.INPUT).build()
).register();
