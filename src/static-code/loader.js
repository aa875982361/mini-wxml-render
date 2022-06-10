/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 605:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

    "use strict";

    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.Callable = exports.createVMFromArrayBuffer = exports.VirtualMachine = exports.I = void 0;
    const utils_1 = __webpack_require__(261);
    const scope_1 = __webpack_require__(226);
    var I;
    (function (I) {
        I[I["VAR"] = 0] = "VAR";
        I[I["CLS"] = 1] = "CLS";
        I[I["MOV"] = 2] = "MOV";
        I[I["ADD"] = 3] = "ADD";
        I[I["SUB"] = 4] = "SUB";
        I[I["MUL"] = 5] = "MUL";
        I[I["DIV"] = 6] = "DIV";
        I[I["MOD"] = 7] = "MOD";
        I[I["EXP"] = 8] = "EXP";
        I[I["INC"] = 9] = "INC";
        I[I["DEC"] = 10] = "DEC";
        I[I["LT"] = 11] = "LT";
        I[I["GT"] = 12] = "GT";
        I[I["EQ"] = 13] = "EQ";
        I[I["LE"] = 14] = "LE";
        I[I["GE"] = 15] = "GE";
        I[I["NE"] = 16] = "NE";
        I[I["WEQ"] = 17] = "WEQ";
        I[I["WNE"] = 18] = "WNE";
        I[I["LG_AND"] = 19] = "LG_AND";
        I[I["LG_OR"] = 20] = "LG_OR";
        I[I["AND"] = 21] = "AND";
        I[I["OR"] = 22] = "OR";
        I[I["XOR"] = 23] = "XOR";
        I[I["SHL"] = 24] = "SHL";
        I[I["SHR"] = 25] = "SHR";
        I[I["ZSHR"] = 26] = "ZSHR";
        I[I["JMP"] = 27] = "JMP";
        I[I["JE"] = 28] = "JE";
        I[I["JNE"] = 29] = "JNE";
        I[I["JG"] = 30] = "JG";
        I[I["JL"] = 31] = "JL";
        I[I["JIF"] = 32] = "JIF";
        I[I["JF"] = 33] = "JF";
        I[I["JGE"] = 34] = "JGE";
        I[I["JLE"] = 35] = "JLE";
        I[I["PUSH"] = 36] = "PUSH";
        I[I["POP"] = 37] = "POP";
        I[I["CALL"] = 38] = "CALL";
        I[I["PRINT"] = 39] = "PRINT";
        I[I["RET"] = 40] = "RET";
        I[I["PAUSE"] = 41] = "PAUSE";
        I[I["EXIT"] = 42] = "EXIT";
        I[I["CALL_CTX"] = 43] = "CALL_CTX";
        I[I["CALL_VAR"] = 44] = "CALL_VAR";
        I[I["CALL_REG"] = 45] = "CALL_REG";
        I[I["MOV_CTX"] = 46] = "MOV_CTX";
        I[I["MOV_PROP"] = 47] = "MOV_PROP";
        I[I["SET_CTX"] = 48] = "SET_CTX";
        I[I["NEW_OBJ"] = 49] = "NEW_OBJ";
        I[I["NEW_ARR"] = 50] = "NEW_ARR";
        I[I["NEW_REG"] = 51] = "NEW_REG";
        I[I["SET_KEY"] = 52] = "SET_KEY";
        I[I["FUNC"] = 53] = "FUNC";
        I[I["ALLOC"] = 54] = "ALLOC";
        I[I["PLUS"] = 55] = "PLUS";
        I[I["MINUS"] = 56] = "MINUS";
        I[I["NOT"] = 57] = "NOT";
        I[I["VOID"] = 58] = "VOID";
        I[I["DEL"] = 59] = "DEL";
        I[I["NEG"] = 60] = "NEG";
        I[I["TYPE_OF"] = 61] = "TYPE_OF";
        I[I["IN"] = 62] = "IN";
        I[I["INST_OF"] = 63] = "INST_OF";
        I[I["MOV_THIS"] = 64] = "MOV_THIS";
        I[I["TRY"] = 65] = "TRY";
        I[I["TRY_END"] = 66] = "TRY_END";
        I[I["THROW"] = 67] = "THROW";
        I[I["GET_ERR"] = 68] = "GET_ERR";
        I[I["MOV_ARGS"] = 69] = "MOV_ARGS";
        I[I["FORIN"] = 70] = "FORIN";
        I[I["FORIN_END"] = 71] = "FORIN_END";
        I[I["BREAK_FORIN"] = 72] = "BREAK_FORIN";
        I[I["CONT_FORIN"] = 73] = "CONT_FORIN";
        I[I["BVAR"] = 74] = "BVAR";
        I[I["BLOCK"] = 75] = "BLOCK";
        I[I["END_BLOCK"] = 76] = "END_BLOCK";
        I[I["CLR_BLOCK"] = 77] = "CLR_BLOCK";
    })(I = exports.I || (exports.I = {}));
    const NO_RETURN_SYMBOL = Symbol();
    class VMRunTimeError extends Error {
        constructor(error) {
            super(error);
            this.error = error;
        }
    }
    class VirtualMachine {
        constructor(codes, functionsTable, entryIndx, stringsTable, globalSize, ctx) {
            this.codes = codes;
            this.functionsTable = functionsTable;
            this.entryIndx = entryIndx;
            this.stringsTable = stringsTable;
            this.globalSize = globalSize;
            this.ctx = ctx;
            this.ip = 0;
            this.fp = 0;
            this.sp = -1;
            this.stack = [];
            this.callingFunctionInfo = {
                isInitClosure: true,
                closureScope: new scope_1.Scope(),
                variables: new scope_1.Scope(),
                args: [],
            };
            this.callingFunctionInfos = [];
            this.allThis = [];
            this.isRunning = false;
            const mainClosureScope = new scope_1.Scope();
            mainClosureScope.isRestoreWhenChange = false;
            this.mainFunction = this.parseToJsFunc(functionsTable[this.entryIndx], mainClosureScope);
            this.init();
        }
        init() {
            const { globalSize, mainFunction } = this;
            const { meta } = this.getMetaFromFunc(mainFunction);
            const [ip, numArgs, localSize] = meta;
            this.stack.splice(0);
            const globalIndex = globalSize + 1;
            this.fp = globalIndex;
            this.stack[this.fp] = -1;
            this.sp = this.fp;
            this.stack.length = this.sp + 1;
            this.callingFunctionInfos = [];
            this.allThis = [];
        }
        reset() {
            this.init();
            this.error = null;
        }
        run() {
            this.callFunction(this.mainFunction, void 0, '', 0, false);
            this.isRunning = true;
            while (this.isRunning) {
                this.fetchAndExecute();
            }
        }
        setReg(dst, src) {
            const callingFunctionInfo = this.callingFunctionInfo;
            if (dst.type === 208) {
                this.checkVariableScopeAndNew();
                callingFunctionInfo.variables.set(dst.index, src.value);
            }
            else if (dst.type === 16) {
                this.checkClosureAndFork();
                this.callingFunctionInfo.closureScope.set(dst.index, src.value);
            }
            else if (dst.type === 0 || dst.type === 112) {
                if (dst.type === 112) {
                    this.callingFunctionInfo.returnValue = src.value;
                }
                if (dst.raw <= -4) {
                    this.callingFunctionInfo.args[-4 - dst.raw] = src.value;
                }
                else {
                    this.stack[dst.index] = src.value;
                }
            }
            else {
                console.error(dst);
                throw new Error(`Cannot process register type ${dst.type}`);
            }
        }
        newReg(o) {
            const callingFunctionInfo = this.callingFunctionInfo;
            if (o.type === 208) {
                this.checkVariableScopeAndNew();
                this.callingFunctionInfo.variables.new(o.index);
            }
            else if (o.type === 16) {
                this.checkClosureAndFork();
                this.callingFunctionInfo.closureScope.new(o.index);
            }
            else {
                console.error(o);
                throw new Error(`Cannot process register type ${o.type}`);
            }
        }
        getReg(o) {
            if (o.type === 208) {
                if (!this.callingFunctionInfo.variables) {
                    throw new Error('variable is not declared.');
                }
                return this.callingFunctionInfo.variables.get(o.index);
            }
            else if (o.type === 16) {
                return this.callingFunctionInfo.closureScope.get(o.index);
            }
            else if (o.type === 0 || o.type === 112) {
                return this.stack[o.index];
            }
            else {
                throw new Error(`Cannot process register type ${o.type}`);
            }
        }
        fetchAndExecute() {
            if (!this.isRunning) {
                throw new VMRunTimeError('try to run again...');
            }
            let op = this.nextOperator();
            let isCallVMFunction = false;
            switch (op) {
                case I.VAR:
                case I.CLS: {
                    const o = this.nextOperant();
                    this.newReg(o);
                    break;
                }
                case I.PUSH: {
                    const value = this.nextOperant().value;
                    this.push(value);
                    break;
                }
                case I.EXIT: {
                    this.isRunning = false;
                    break;
                }
                case I.RET: {
                    this.returnCurrentFunction();
                    break;
                }
                case I.PRINT: {
                    const val = this.nextOperant();
                    console.log(val.value);
                    break;
                }
                case I.MOV: {
                    const dst = this.nextOperant();
                    const src = this.nextOperant();
                    this.setReg(dst, src);
                    break;
                }
                case I.JMP: {
                    const address = this.nextOperant();
                    this.ip = address.value;
                    break;
                }
                case I.JE: {
                    this.jumpWithCondidtion((a, b) => a === b);
                    break;
                }
                case I.JNE: {
                    this.jumpWithCondidtion((a, b) => a !== b);
                    break;
                }
                case I.JG: {
                    this.jumpWithCondidtion((a, b) => a > b);
                    break;
                }
                case I.JL: {
                    this.jumpWithCondidtion((a, b) => a < b);
                    break;
                }
                case I.JGE: {
                    this.jumpWithCondidtion((a, b) => a >= b);
                    break;
                }
                case I.JLE: {
                    this.jumpWithCondidtion((a, b) => a <= b);
                    break;
                }
                case I.JIF: {
                    const cond = this.nextOperant();
                    const address = this.nextOperant();
                    if (cond.value) {
                        this.ip = address.value;
                    }
                    break;
                }
                case I.JF: {
                    const cond = this.nextOperant();
                    const address = this.nextOperant();
                    if (!cond.value) {
                        this.ip = address.value;
                    }
                    break;
                }
                case I.CALL_CTX:
                case I.CALL_VAR: {
                    let o;
                    if (op === I.CALL_CTX) {
                        o = this.ctx;
                    }
                    else {
                        o = this.nextOperant().value;
                    }
                    const funcName = this.nextOperant().value;
                    const numArgs = this.nextOperant().value;
                    const isNewExpression = this.nextOperant().value;
                    isCallVMFunction = this.callFunction(void 0, o, funcName, numArgs, isNewExpression);
                    break;
                }
                case I.CALL_REG: {
                    const o = this.nextOperant();
                    const f = o.value;
                    const numArgs = this.nextOperant().value;
                    const isNewExpression = this.nextOperant().value;
                    isCallVMFunction = this.callFunction(f, void 0, '', numArgs, isNewExpression);
                    break;
                }
                case I.MOV_CTX: {
                    const dst = this.nextOperant();
                    const propKey = this.nextOperant();
                    const src = this.ctx[propKey.value];
                    this.setReg(dst, { value: src });
                    break;
                }
                case I.SET_CTX: {
                    const propKey = this.nextOperant();
                    const val = this.nextOperant();
                    this.ctx[propKey.value] = val.value;
                    break;
                }
                case I.NEW_OBJ: {
                    const dst = this.nextOperant();
                    const o = {};
                    this.setReg(dst, { value: o });
                    break;
                }
                case I.NEW_REG: {
                    const dst = this.nextOperant();
                    const pattern = this.nextOperant();
                    const flags = this.nextOperant();
                    try {
                        this.setReg(dst, { value: new RegExp(pattern.value, flags.value) });
                    }
                    catch (e) {
                        throw new VMRunTimeError(e);
                    }
                    break;
                }
                case I.NEW_ARR: {
                    const dst = this.nextOperant();
                    const o = [];
                    this.setReg(dst, { value: o });
                    break;
                }
                case I.SET_KEY: {
                    const o = this.nextOperant().value;
                    const key = this.nextOperant().value;
                    const value = this.nextOperant().value;
                    o[key] = value;
                    break;
                }
                case I.FUNC: {
                    const dst = this.nextOperant();
                    const funcOperant = this.nextOperant();
                    const funcInfoMeta = funcOperant.value;
                    const func = this.parseToJsFunc(funcInfoMeta, this.callingFunctionInfo.closureScope.fork());
                    this.setReg(dst, { value: func });
                    break;
                }
                case I.MOV_PROP: {
                    const dst = this.nextOperant();
                    const o = this.nextOperant();
                    const k = this.nextOperant();
                    const v = o.value[k.value];
                    this.setReg(dst, { value: v });
                    break;
                }
                case I.LT: {
                    this.binaryExpression((a, b) => a < b);
                    break;
                }
                case I.GT: {
                    this.binaryExpression((a, b) => a > b);
                    break;
                }
                case I.EQ: {
                    this.binaryExpression((a, b) => a === b);
                    break;
                }
                case I.NE: {
                    this.binaryExpression((a, b) => a !== b);
                    break;
                }
                case I.WEQ: {
                    this.binaryExpression((a, b) => a == b);
                    break;
                }
                case I.WNE: {
                    this.binaryExpression((a, b) => a != b);
                    break;
                }
                case I.LE: {
                    this.binaryExpression((a, b) => a <= b);
                    break;
                }
                case I.GE: {
                    this.binaryExpression((a, b) => a >= b);
                    break;
                }
                case I.ADD: {
                    this.binaryExpression((a, b) => a + b);
                    break;
                }
                case I.SUB: {
                    this.binaryExpression((a, b) => a - b);
                    break;
                }
                case I.MUL: {
                    this.binaryExpression((a, b) => a * b);
                    break;
                }
                case I.DIV: {
                    this.binaryExpression((a, b) => a / b);
                    break;
                }
                case I.MOD: {
                    this.binaryExpression((a, b) => a % b);
                    break;
                }
                case I.AND: {
                    this.binaryExpression((a, b) => a & b);
                    break;
                }
                case I.OR: {
                    this.binaryExpression((a, b) => a | b);
                    break;
                }
                case I.XOR: {
                    this.binaryExpression((a, b) => a ^ b);
                    break;
                }
                case I.SHL: {
                    this.binaryExpression((a, b) => a << b);
                    break;
                }
                case I.SHR: {
                    this.binaryExpression((a, b) => a >> b);
                    break;
                }
                case I.ZSHR: {
                    this.binaryExpression((a, b) => a >>> b);
                    break;
                }
                case I.LG_AND: {
                    this.binaryExpression((a, b) => a && b);
                    break;
                }
                case I.LG_OR: {
                    this.binaryExpression((a, b) => a || b);
                    break;
                }
                case I.INST_OF: {
                    this.binaryExpression((a, b) => {
                        return a instanceof b;
                    });
                    break;
                }
                case I.IN: {
                    this.binaryExpression((a, b) => {
                        return a in b;
                    });
                    break;
                }
                case I.ALLOC: {
                    const dst = this.nextOperant();
                    this.getReg(dst);
                    break;
                }
                case I.PLUS: {
                    this.uniaryExpression((val) => +val);
                    break;
                }
                case I.MINUS: {
                    this.uniaryExpression((val) => -val);
                    break;
                }
                case I.VOID: {
                    this.uniaryExpression((val) => void val);
                    break;
                }
                case I.NOT: {
                    this.uniaryExpression((val) => ~val);
                    break;
                }
                case I.NEG: {
                    this.uniaryExpression((val) => !val);
                    break;
                }
                case I.TYPE_OF: {
                    this.uniaryExpression((val) => typeof val);
                    break;
                }
                case I.DEL: {
                    const o1 = this.nextOperant().value;
                    const o2 = this.nextOperant().value;
                    delete o1[o2];
                    break;
                }
                case I.MOV_THIS: {
                    this.setReg(this.nextOperant(), { value: this.currentThis });
                    break;
                }
                case I.TRY: {
                    const catchAddress = this.nextOperant();
                    const endAddress = this.nextOperant();
                    let callCount = 1;
                    const currentFunctionInfo = this.callingFunctionInfo;
                    while (callCount > 0 && this.isRunning) {
                        try {
                            const [o, isCallVMFunc] = this.fetchAndExecute();
                            op = o;
                            if (isCallVMFunc) {
                                callCount++;
                            }
                            if (o === I.RET) {
                                callCount--;
                                if (callCount === 0) {
                                    break;
                                }
                            }
                            if (o === I.TRY_END && callCount === 1) {
                                this.ip = endAddress.value;
                                break;
                            }
                        }
                        catch (e) {
                            if (e instanceof VMRunTimeError) {
                                throw e;
                            }
                            this.popToFunction(currentFunctionInfo);
                            this.error = e;
                            this.ip = catchAddress.value;
                            break;
                        }
                    }
                    break;
                }
                case I.THROW: {
                    const err = this.nextOperant();
                    throw err.value;
                    break;
                }
                case I.TRY_END: {
                    break;
                }
                case I.GET_ERR: {
                    const o = this.nextOperant();
                    this.setReg(o, { value: this.error });
                    break;
                }
                case I.MOV_ARGS: {
                    const dst = this.nextOperant();
                    this.setReg(dst, { value: this.stack[this.fp - 3] });
                    break;
                }
                case I.FORIN: {
                    const dst = this.nextOperant();
                    const target = this.nextOperant();
                    const startAddress = this.nextOperant();
                    const endAddress = this.nextOperant();
                    forIn: for (const i in target.value) {
                        this.setReg(dst, { value: i });
                        while (true) {
                            const o = this.fetchAndExecute()[0];
                            if (o === I.BREAK_FORIN) {
                                break forIn;
                            }
                            if (o === I.FORIN_END || o === I.CONT_FORIN) {
                                this.ip = startAddress.value;
                                continue forIn;
                            }
                        }
                    }
                    this.ip = endAddress.value;
                    break;
                }
                case I.FORIN_END:
                case I.BREAK_FORIN:
                case I.CONT_FORIN: {
                    break;
                }
                case I.BLOCK: {
                    const o = this.nextOperant();
                    this.checkClosureAndFork();
                    this.checkVariableScopeAndNew();
                    this.callingFunctionInfo.closureScope.front(o.value);
                    this.callingFunctionInfo.variables.front(o.value);
                    break;
                }
                case I.CLR_BLOCK:
                case I.END_BLOCK: {
                    const o = this.nextOperant();
                    this.callingFunctionInfo.closureScope.back(o.value);
                    this.callingFunctionInfo.variables.back(o.value);
                    break;
                }
                default:
                    throw new VMRunTimeError("Unknow command " + op + " " + I[op]);
            }
            return [op, isCallVMFunction];
        }
        checkClosureAndFork() {
            const callingFunctionInfo = this.callingFunctionInfo;
            if (!callingFunctionInfo.isInitClosure) {
                callingFunctionInfo.closureScope = this.callingFunctionInfo.closureScope.fork();
                callingFunctionInfo.isInitClosure = true;
            }
        }
        checkVariableScopeAndNew() {
            if (!this.callingFunctionInfo.variables) {
                this.callingFunctionInfo.variables = new scope_1.Scope();
            }
        }
        returnCurrentFunction() {
            const stack = this.stack;
            const fp = this.fp;
            this.fp = stack[fp];
            this.ip = stack[fp - 1];
            this.sp = fp - stack[fp - 2] - 4;
            this.stack.splice(this.sp + 1);
            if (this.callingFunctionInfo.returnValue === NO_RETURN_SYMBOL) {
                this.stack[0] = undefined;
            }
            this.allThis.pop();
            this.currentThis = this.allThis[this.allThis.length - 1];
            this.callingFunctionInfos.pop();
            this.callingFunctionInfo = this.callingFunctionInfos[this.callingFunctionInfos.length - 1];
        }
        push(val) {
            this.stack[++this.sp] = val;
        }
        nextOperator() {
            return utils_1.readUInt8(this.codes, this.ip, ++this.ip);
        }
        nextOperant() {
            const [operantType, value, byteLength] = utils_1.getOperatantByBuffer(this.codes, this.ip++);
            this.ip = this.ip + byteLength;
            if (operantType === 0) {
            }
            return {
                type: operantType,
                value: this.parseValue(operantType, value),
                raw: value,
                index: operantType === 0 ? (this.fp + value) : value,
            };
        }
        parseValue(valueType, value) {
            switch (valueType) {
                case 16:
                    return this.callingFunctionInfo.closureScope.get(value);
                case 0:
                    if (value <= -4) {
                        if ((-4 - value) < this.callingFunctionInfo.args.length) {
                            return this.callingFunctionInfo.args[-4 - value];
                        }
                        else {
                            return void 0;
                        }
                    }
                    return this.stack[this.fp + value];
                case 96:
                case 48:
                case 128:
                    return value;
                case 32:
                    return this.stack[value];
                case 80:
                    return this.stringsTable[value];
                case 64:
                    return this.functionsTable[value];
                case 112:
                    return this.stack[0];
                case 144:
                    return !!value;
                case 160:
                    return null;
                case 176:
                    return void 0;
                case 208:
                    if (!this.callingFunctionInfo.variables) {
                        return undefined;
                    }
                    return this.callingFunctionInfo.variables.get(value);
                default:
                    throw new VMRunTimeError("Unknown operant " + valueType);
            }
        }
        jumpWithCondidtion(cond) {
            const op1 = this.nextOperant();
            const op2 = this.nextOperant();
            const address = this.nextOperant();
            if (cond(op1.value, op2.value)) {
                this.ip = address.value;
            }
        }
        uniaryExpression(exp) {
            const o = this.nextOperant();
            const ret = exp(o.value);
            this.setReg(o, { value: ret });
        }
        binaryExpression(exp) {
            const o1 = this.nextOperant();
            const o2 = this.nextOperant();
            const ret = exp(o1.value, o2.value);
            this.setReg(o1, { value: ret });
        }
        callFunction(func, o, funcName, numArgs, isNewExpression) {
            const stack = this.stack;
            const f = func || o[funcName];
            let isCallVMFunction = false;
            const isNullOrUndefined = o === void 0 || o === null || o === this.ctx;
            if ((f instanceof Callable) && !isNewExpression) {
                const arg = new NumArgs(numArgs);
                if (!isNullOrUndefined) {
                    if (typeof o[funcName] === 'function') {
                        o[funcName](arg);
                    }
                    else {
                        throw new VMRunTimeError(`The function ${funcName} is not a function`);
                    }
                }
                else {
                    f(arg);
                }
                isCallVMFunction = true;
            }
            else {
                const args = [];
                for (let i = 0; i < numArgs; i++) {
                    args.unshift(stack[this.sp--]);
                }
                if (!isNullOrUndefined) {
                    stack[0] = isNewExpression
                        ? new o[funcName](...args)
                        : o[funcName](...args);
                }
                else {
                    stack[0] = isNewExpression
                        ? new f(...args)
                        : f(...args);
                }
                this.stack.splice(this.sp + 1);
            }
            return isCallVMFunction;
        }
        popToFunction(targetFunctionInfo) {
            while (this.callingFunctionInfos[this.callingFunctionInfos.length - 1] !== targetFunctionInfo) {
                this.returnCurrentFunction();
            }
        }
        parseToJsFunc(meta, closureScope) {
            const vm = this;
            const func = function (...args) {
                const [ip, _, localSize] = meta;
                vm.isRunning = true;
                const n = args[0];
                const isCalledFromJs = !(n instanceof NumArgs);
                let numArgs = 0;
                let allArgs = [];
                if (isCalledFromJs) {
                    args.forEach((arg) => vm.push(arg));
                    numArgs = args.length;
                    allArgs = [...args];
                }
                else {
                    numArgs = n.numArgs;
                    const end = vm.sp + 1;
                    allArgs = vm.stack.slice(end - numArgs, end);
                }
                const currentCallingFunctionInfo = vm.callingFunctionInfo = {
                    isInitClosure: false,
                    closureScope,
                    variables: null,
                    args: allArgs,
                    returnValue: NO_RETURN_SYMBOL,
                };
                vm.callingFunctionInfos.push(vm.callingFunctionInfo);
                if (vm.allThis.length === 0) {
                    vm.currentThis = vm.ctx;
                }
                else {
                    vm.currentThis = this || vm.ctx;
                }
                vm.allThis.push(vm.currentThis);
                const stack = vm.stack;
                if (isCalledFromJs) {
                    stack[0] = undefined;
                }
                stack[++vm.sp] = allArgs;
                stack[++vm.sp] = numArgs;
                stack[++vm.sp] = vm.ip;
                stack[++vm.sp] = vm.fp;
                vm.ip = ip;
                vm.fp = vm.sp;
                vm.sp += localSize;
                if (isCalledFromJs) {
                    let callCount = 1;
                    while (callCount > 0 && vm.isRunning) {
                        const [op, isCallVMFunction] = vm.fetchAndExecute();
                        if (isCallVMFunction) {
                            callCount++;
                        }
                        else if (op === I.RET) {
                            callCount--;
                        }
                    }
                    if (currentCallingFunctionInfo.returnValue !== NO_RETURN_SYMBOL) {
                        return currentCallingFunctionInfo.returnValue;
                    }
                }
            };
            Object.setPrototypeOf(func, Callable.prototype);
            try {
                Object.defineProperty(func, 'length', { value: meta[1] });
            }
            catch (e) { }
            vm.setMetaToFunc(func, meta);
            return func;
        }
        setMetaToFunc(func, meta) {
            Object.defineProperty(func, '__vm_func_info__', {
                enumerable: false,
                value: { meta },
                writable: false,
            });
        }
        getMetaFromFunc(func) {
            return func.__vm_func_info__;
        }
    }
    exports.VirtualMachine = VirtualMachine;
    const createVMFromArrayBuffer = (buffer, ctx = {}) => {
        const mainFunctionIndex = utils_1.readUInt32(buffer, 0, 4);
        const funcionTableBasicIndex = utils_1.readUInt32(buffer, 4, 8);
        const stringTableBasicIndex = utils_1.readUInt32(buffer, 8, 12);
        const globalsSize = utils_1.readUInt32(buffer, 12, 16);
        const stringsTable = utils_1.parseStringsArray(buffer.slice(stringTableBasicIndex));
        const codesBuf = new Uint8Array(buffer.slice(4 * 4, funcionTableBasicIndex));
        const funcsBuf = buffer.slice(funcionTableBasicIndex, stringTableBasicIndex);
        const funcsTable = parseFunctionTable(funcsBuf);
        return new VirtualMachine(codesBuf, funcsTable, mainFunctionIndex, stringsTable, globalsSize, ctx);
    };
    exports.createVMFromArrayBuffer = createVMFromArrayBuffer;
    const parseFunctionTable = (buffer) => {
        const funcs = [];
        let i = 0;
        while (i < buffer.byteLength) {
            const ipEnd = i + 4;
            const ip = utils_1.readUInt32(buffer, i, ipEnd);
            const numArgsAndLocal = new Uint16Array(buffer.slice(ipEnd, ipEnd + 2 * 2));
            funcs.push([ip, numArgsAndLocal[0], numArgsAndLocal[1]]);
            i += 8;
        }
        return funcs;
    };
    class Callable extends Function {
        constructor() {
            super();
        }
    }
    exports.Callable = Callable;
    class NumArgs {
        constructor(numArgs) {
            this.numArgs = numArgs;
        }
    }
    if (typeof window !== 'undefined') {
        window.VirtualMachine = VirtualMachine;
        window.createVMFromArrayBuffer = createVMFromArrayBuffer;
    }
    
    
    /***/ }),
    
    /***/ 226:
    /***/ ((__unused_webpack_module, exports) => {
    
    "use strict";
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.Scope = void 0;
    var Scope = (function () {
        function Scope(scope, heap, isRestoreWhenChange) {
            if (scope === void 0) { scope = {}; }
            if (heap === void 0) { heap = []; }
            if (isRestoreWhenChange === void 0) { isRestoreWhenChange = true; }
            this.scope = scope;
            this.heap = heap;
            this.isRestoreWhenChange = isRestoreWhenChange;
            this.scope.blockNameMap = new Map();
        }
        var $0 = Scope.prototype;
    $0.front = function(blockName) {
            this.scope = Object.setPrototypeOf({ len: this.heap.length }, this.scope);
            this.scope.blockName = blockName;
            this.scope.blockNameMap.set(blockName, this.scope);
        };
        $0.back = function(blockName) {
            var targetScope = this.scope.blockNameMap.get(blockName);
            if (this.isRestoreWhenChange) {
                var len = targetScope.len;
                this.heap.splice(len);
            }
            this.scope = Object.getPrototypeOf(targetScope);
        };
        $0.fork = function() {
            var scope = Object.setPrototypeOf({ len: this.heap.length }, this.scope);
            return new Scope(scope, this.heap, this.isRestoreWhenChange);
        };
        $0.new = function(key) {
            var index = this.heap.length;
            this.scope[key] = index;
            this.heap.push(void 0);
        };
        $0.set = function(key, value) {
            if (!(key in this.scope)) {
                throw new Error("variable is used before decleration");
            }
            var index = this.scope[key];
            this.heap[index] = value;
        };
        $0.get = function(key) {
            var index = this.scope[key];
            return this.heap[index];
        };
        $0.printScope = function() {
            var scope = this.scope;
            var scopes = [];
            while (scope.len !== undefined) {
                scopes.push(JSON.stringify(scope));
                scope = Object.getPrototypeOf(scope);
            }
            return "len " + scopes.length + ": " + scopes.join(" <- ");
        };
        return Scope;
    }());
    exports.Scope = Scope;
    
    
    /***/ }),
    
    /***/ 674:
    /***/ ((module, exports, __webpack_require__) => {
    
    var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0
    
    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.
    
    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global global, define, System, Reflect, Promise */
    var __extends;
    var __assign;
    var __rest;
    var __decorate;
    var __param;
    var __metadata;
    var __awaiter;
    var __generator;
    var __exportStar;
    var __values;
    var __read;
    var __spread;
    var __spreadArrays;
    var __await;
    var __asyncGenerator;
    var __asyncDelegator;
    var __asyncValues;
    var __makeTemplateObject;
    var __importStar;
    var __importDefault;
    (function (factory) {
        var root = typeof __webpack_require__.g === "object" ? __webpack_require__.g : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (true) {
            !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (exports) { factory(createExporter(root, createExporter(exports))); }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }
        else {}
        function createExporter(exports, previous) {
            if (exports !== root) {
                if (typeof Object.create === "function") {
                    Object.defineProperty(exports, "__esModule", { value: true });
                }
                else {
                    exports.__esModule = true;
                }
            }
            return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
        }
    })
    (function (exporter) {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    
        __extends = function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    
        __assign = Object.assign || function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
    
        __rest = function (s, e) {
            var t = {};
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
            if (s != null && typeof Object.getOwnPropertySymbols === "function")
                for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                        t[p[i]] = s[p[i]];
                }
            return t;
        };
    
        __decorate = function (decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
            else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
    
        __param = function (paramIndex, decorator) {
            return function (target, key) { decorator(target, key, paramIndex); }
        };
    
        __metadata = function (metadataKey, metadataValue) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
        };
    
        __awaiter = function (thisArg, _arguments, P, generator) {
            return new (P || (P = Promise))(function (resolve, reject) {
                function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
        };
    
        __generator = function (thisArg, body) {
            var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
            return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
            function verb(n) { return function (v) { return step([n, v]); }; }
            function step(op) {
                if (f) throw new TypeError("Generator is already executing.");
                while (_) try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                    if (y = 0, t) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0: case 1: t = op; break;
                        case 4: _.label++; return { value: op[1], done: false };
                        case 5: _.label++; y = op[1]; op = [0]; continue;
                        case 7: op = _.ops.pop(); _.trys.pop(); continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                            if (t[2]) _.ops.pop();
                            _.trys.pop(); continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
            }
        };
    
        __exportStar = function (m, exports) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        };
    
        __values = function (o) {
            var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
            if (m) return m.call(o);
            return {
                next: function () {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        };
    
        __read = function (o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
            }
            catch (error) { e = { error: error }; }
            finally {
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                }
                finally { if (e) throw e.error; }
            }
            return ar;
        };
    
        __spread = function () {
            for (var ar = [], i = 0; i < arguments.length; i++)
                ar = ar.concat(__read(arguments[i]));
            return ar;
        };
    
        __spreadArrays = function () {
            for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
            for (var r = Array(s), k = 0, i = 0; i < il; i++)
                for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                    r[k] = a[j];
            return r;
        };
    
        __await = function (v) {
            return this instanceof __await ? (this.v = v, this) : new __await(v);
        };
    
        __asyncGenerator = function (thisArg, _arguments, generator) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var g = generator.apply(thisArg, _arguments || []), i, q = [];
            return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
            function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
            function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
            function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
            function fulfill(value) { resume("next", value); }
            function reject(value) { resume("throw", value); }
            function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
        };
    
        __asyncDelegator = function (o) {
            var i, p;
            return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
            function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
        };
    
        __asyncValues = function (o) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var m = o[Symbol.asyncIterator], i;
            return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
            function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
            function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
        };
    
        __makeTemplateObject = function (cooked, raw) {
            if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
            return cooked;
        };
    
        __importStar = function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
            result["default"] = mod;
            return result;
        };
    
        __importDefault = function (mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
    
        exporter("__extends", __extends);
        exporter("__assign", __assign);
        exporter("__rest", __rest);
        exporter("__decorate", __decorate);
        exporter("__param", __param);
        exporter("__metadata", __metadata);
        exporter("__awaiter", __awaiter);
        exporter("__generator", __generator);
        exporter("__exportStar", __exportStar);
        exporter("__values", __values);
        exporter("__read", __read);
        exporter("__spread", __spread);
        exporter("__spreadArrays", __spreadArrays);
        exporter("__await", __await);
        exporter("__asyncGenerator", __asyncGenerator);
        exporter("__asyncDelegator", __asyncDelegator);
        exporter("__asyncValues", __asyncValues);
        exporter("__makeTemplateObject", __makeTemplateObject);
        exporter("__importStar", __importStar);
        exporter("__importDefault", __importDefault);
    });
    
    
    /***/ }),
    
    /***/ 261:
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    "use strict";
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.CategoriesPriorityQueue = exports.getOperantName = exports.getByteLengthFromFloat64 = exports.getByteLengthFromInt32 = exports.getOperantTypeAndByteLengthByNum = exports.getInt32OperatantValueByBuffer = exports.getFloat64OperatantValueByBuffer = exports.getOperatantByBuffer = exports.createOperantBuffer = exports.createInt32OperantBuff = exports.createFloat64OperantBuff = exports.readString = exports.readUInt32 = exports.readUInt16 = exports.readInt16 = exports.readInt8 = exports.readUInt8 = exports.readFloat64 = exports.parseStringsArray = exports.getByProp = exports.stringToArrayBuffer = exports.arrayBufferToString = exports.concatBuffer = void 0;
    var tslib_1 = __webpack_require__(674);
    var loader_1 = __webpack_require__(605);
    exports.concatBuffer = function (buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    };
    exports.arrayBufferToString = function (buffer) {
        return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
    };
    exports.stringToArrayBuffer = function (str) {
        var stringLength = str.length;
        var buffer = new ArrayBuffer(stringLength * 2);
        var bufferView = new Uint16Array(buffer);
        for (var i = 0; i < stringLength; i++) {
            bufferView[i] = str.charCodeAt(i);
        }
        return buffer;
    };
    exports.getByProp = function (obj, prop) {
        if (typeof prop === "string") {
            return String(prop).split(".").reduce(function (o, p) { return o[p]; }, obj);
        }
        else {
            return obj[prop];
        }
    };
    exports.parseStringsArray = function (buffer) {
        var strings = [];
        var i = 0;
        while (i < buffer.byteLength) {
            var lentOffset = i + 4;
            var len = exports.readUInt32(buffer, i, lentOffset);
            var start = lentOffset;
            var end = lentOffset + len * 2;
            var str = exports.readString(buffer, start, end);
            strings.push(str);
            i = end;
        }
        return strings;
    };
    exports.readFloat64 = function (buffer, from, to) {
        return (new Float64Array(buffer.slice(from, to)))[0];
    };
    exports.readUInt8 = function (buffer, from, to) {
        return buffer[from];
    };
    exports.readInt8 = function (buffer, from, to) {
        return (new Int8Array(buffer.slice(from, to)))[0];
    };
    exports.readInt16 = function (buffer, from, to) {
        return (new Int16Array(buffer.slice(from, to)))[0];
    };
    exports.readUInt16 = function (buffer, from, to) {
        return (new Uint16Array(buffer.slice(from, to)))[0];
    };
    exports.readUInt32 = function (buffer, from, to) {
        return (new Uint32Array(buffer.slice(from, to)))[0];
    };
    exports.readString = function (buffer, from, to) {
        return exports.arrayBufferToString(buffer.slice(from, to));
    };
    var OPERANT_TYPE_MASK = 240;
    var OPERANT_BYTE_LEN_MASK = ~OPERANT_TYPE_MASK;
    exports.createFloat64OperantBuff = function (ot, value, forceLength) {
        var numBuf = value !== void 0
            ? new Float64Array([value]).buffer
            : new ArrayBuffer(0);
        var byteLength = forceLength || exports.getByteLengthFromFloat64(value);
        var head = createOperantHead(ot, byteLength);
        return exports.concatBuffer(head, numBuf.slice(8 - byteLength));
    };
    exports.createInt32OperantBuff = function (ot, value, forceLength) {
        var numBuf = value !== void 0
            ? new Uint32Array([value]).buffer
            : new ArrayBuffer(0);
        var byteLength = forceLength || exports.getByteLengthFromInt32(value);
        var head = createOperantHead(ot, byteLength);
        return exports.concatBuffer(head, numBuf.slice(0, byteLength));
    };
    exports.createOperantBuffer = function (ot, value, forceLength) {
        if (ot === 48) {
            return exports.createFloat64OperantBuff(ot, value, forceLength);
        }
        else {
            return exports.createInt32OperantBuff(ot, value, forceLength);
        }
    };
    exports.getOperatantByBuffer = function (arrayBuffer, i) {
        if (i === void 0) { i = 0; }
        var buffer = arrayBuffer;
        var head = buffer[i++];
        var _a = tslib_1.__read(exports.getOperantTypeAndByteLengthByNum(head), 2), ot = _a[0], byteLength = _a[1];
        var value = ot === 48
            ? exports.getFloat64OperatantValueByBuffer(buffer, i, byteLength)
            : exports.getInt32OperatantValueByBuffer(buffer, i, byteLength);
        return [ot, value, byteLength];
    };
    var createOperantHead = function (ot, byteLength) {
        return new Uint8Array([ot | byteLength]).buffer;
    };
    var num64Buf = new Float64Array(1);
    var num8For64Buf = new Uint8Array(num64Buf.buffer);
    exports.getFloat64OperatantValueByBuffer = function (buffer, i, byteLength) {
        if (i === void 0) { i = 0; }
        num64Buf[0] = 0;
        var s = num8For64Buf.length - byteLength;
        for (var j = 0; j < byteLength; j++) {
            num8For64Buf[s + j] = buffer[i + j];
        }
        return num64Buf[0];
    };
    var num32Buf = new Int32Array(1);
    var num8For32Buf = new Uint8Array(num32Buf.buffer);
    exports.getInt32OperatantValueByBuffer = function (buffer, i, byteLength) {
        if (i === void 0) { i = 0; }
        num32Buf[0] = 0;
        for (var j = 0; j < byteLength; j++) {
            num8For32Buf[j] = buffer[j + i];
        }
        return num32Buf[0];
    };
    exports.getOperantTypeAndByteLengthByNum = function (head) {
        var ot = head & OPERANT_TYPE_MASK;
        var byteLength = head & OPERANT_BYTE_LEN_MASK;
        return [ot, byteLength];
    };
    exports.getByteLengthFromInt32 = function (num) {
        var n32Buf = new Int32Array([num]);
        var n8For32Buf = new Uint8Array(n32Buf.buffer);
        var i = n8For32Buf.length;
        while (i-- > 0) {
            if (n8For32Buf[i] > 0) {
                break;
            }
        }
        return i + 1;
    };
    exports.getByteLengthFromFloat64 = function (num) {
        var n64Buf = new Float64Array([num]);
        var n8For64Buf = new Uint8Array(n64Buf.buffer);
        var i = 0;
        while (n8For64Buf[i] === 0) {
            i++;
        }
        return 8 - i;
    };
    exports.getOperantName = function (o) {
        return loader_1.I[o];
    };
    var CategoriesPriorityQueue = (function () {
        function CategoriesPriorityQueue() {
            this.categories = {};
        }
        var $0 = CategoriesPriorityQueue.prototype;
    $0.push = function(item, p) {
            if (p === void 0) { p = 100; }
            var list = this.categories[p] || [];
            list.push(item);
            this.categories[p] = list;
        };
        $0.clear = function() {
            this.categories = {};
        };
        CategoriesPriorityQueue.prototype[Symbol.iterator] = function () {
            var ll, ll_1, ll_1_1, l, l_1, l_1_1, i, e_1_1, e_2_1;
            var e_2, _a, e_1, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ll = Object
                            .entries(this.categories)
                            .sort(function (_a, _b) {
                            var _c = tslib_1.__read(_a, 1), x = _c[0];
                            var _d = tslib_1.__read(_b, 1), y = _d[0];
                            return Number(x) - Number[y];
                        })
                            .map(function (_a) {
                            var _b = tslib_1.__read(_a, 2), _ = _b[0], list = _b[1];
                            return list;
                        });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 12, 13, 14]);
                        ll_1 = tslib_1.__values(ll), ll_1_1 = ll_1.next();
                        _c.label = 2;
                    case 2:
                        if (!!ll_1_1.done) return [3, 11];
                        l = ll_1_1.value;
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 8, 9, 10]);
                        l_1 = (e_1 = void 0, tslib_1.__values(l)), l_1_1 = l_1.next();
                        _c.label = 4;
                    case 4:
                        if (!!l_1_1.done) return [3, 7];
                        i = l_1_1.value;
                        return [4, i];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        l_1_1 = l_1.next();
                        return [3, 4];
                    case 7: return [3, 10];
                    case 8:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 10];
                    case 9:
                        try {
                            if (l_1_1 && !l_1_1.done && (_b = l_1.return)) _b.call(l_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7];
                    case 10:
                        ll_1_1 = ll_1.next();
                        return [3, 2];
                    case 11: return [3, 14];
                    case 12:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 14];
                    case 13:
                        try {
                            if (ll_1_1 && !ll_1_1.done && (_a = ll_1.return)) _a.call(ll_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7];
                    case 14: return [2];
                }
            });
        };
        return CategoriesPriorityQueue;
    }());
    exports.CategoriesPriorityQueue = CategoriesPriorityQueue;
    
    
    /***/ })
    
    /******/ 	});
    /************************************************************************/
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /************************************************************************/
    /******/ 	/* webpack/runtime/global */
    /******/ 	(() => {
    /******/ 		__webpack_require__.g = (function() {
    /******/ 			if (typeof globalThis === 'object') return globalThis;
    /******/ 			try {
    /******/ 				return this || new Function('return this')();
    /******/ 			} catch (e) {
    /******/ 				if (typeof window === 'object') return window;
    /******/ 			}
    /******/ 		})();
    /******/ 	})();
    /******/ 	
    /************************************************************************/
    /******/ 	
    /******/ 	// startup
    /******/ 	// Load entry module and return exports
    /******/ 	// This entry module is referenced by other modules so it can't be inlined
    /******/ 	var __webpack_exports__ = __webpack_require__(605);
    /******/ 	var __webpack_export_target__ = exports;
    /******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
    /******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
    /******/ 	
    /******/ })()
    ;