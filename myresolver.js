"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(exports, "__esModule", { value: true });
var did_resolver_1 = require("did-resolver");
var ethjs_provider_http_1 = require("ethjs-provider-http");
var ethjs_query_1 = require("ethjs-query");
var ethjs_abi_1 = require("ethjs-abi");
var bn_js_1 = require("bn.js");
var ethjs_contract_1 = require("ethjs-contract");
var ethr_did_registry_json_1 = require("../contracts/ethr-did-registry.json");
var buffer_1 = require("buffer");
exports.REGISTRY = '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b';
function bytes32toString(bytes32) {
    return buffer_1.Buffer.from(bytes32.slice(2), 'hex')
        .toString('utf8')
        .replace(/\0+$/, '');
}
exports.bytes32toString = bytes32toString;
function stringToBytes32(str) {
    var buffstr = '0x' +
        buffer_1.Buffer.from(str)
            .slice(0, 32)
            .toString('hex');
    return buffstr + '0'.repeat(66 - buffstr.length);
}
exports.stringToBytes32 = stringToBytes32;
exports.delegateTypes = {
    Secp256k1SignatureAuthentication2018: stringToBytes32('sigAuth'),
    Secp256k1VerificationKey2018: stringToBytes32('veriKey'),
};
exports.attrTypes = {
    sigAuth: 'SignatureAuthentication2018',
    veriKey: 'VerificationKey2018',
};
function wrapDidDocument(did, owner, history) {
    var now = new bn_js_1.default(Math.floor(new Date().getTime() / 1000));
    // const expired = {}
    var publicKey = [
        {
            id: did + "#owner",
            type: 'Secp256k1VerificationKey2018',
            owner: did,
            ethereumAddress: owner,
        },
    ];
    var authentication = [
        {
            type: 'Secp256k1SignatureAuthentication2018',
            publicKey: did + "#owner",
        },
    ];
    var delegateCount = 0;
    var auth = {};
    var pks = {};
    var services = {};
    for (var _i = 0, history_1 = history; _i < history_1.length; _i++) {
        var event_1 = history_1[_i];
        var validTo = event_1.validTo;
        var key = event_1._eventName + "-" + (event_1.delegateType ||
            event_1.name) + "-" + (event_1.delegate || event_1.value);
        if (validTo && validTo.gte(now)) {
            if (event_1._eventName === 'DIDDelegateChanged') {
                delegateCount++;
                var delegateType = bytes32toString(event_1.delegateType);
                switch (delegateType) {
                    case 'sigAuth':
                        auth[key] = {
                            type: 'Secp256k1SignatureAuthentication2018',
                            publicKey: did + "#delegate-" + delegateCount,
                        };
                    case 'veriKey':
                        pks[key] = {
                            id: did + "#delegate-" + delegateCount,
                            type: 'Secp256k1VerificationKey2018',
                            owner: did,
                            ethereumAddress: event_1.delegate,
                        };
                        break;
                }
            }
            else if (event_1._eventName === 'DIDAttributeChanged') {
                var name_1 = bytes32toString(event_1.name);
                var match = name_1.match(/^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/);
                if (match) {
                    var section = match[1];
                    var algo = match[2];
                    var type = exports.attrTypes[match[4]] || match[4];
                    var encoding = match[6];
                    switch (section) {
                        case 'pub':
                            delegateCount++;
                            var pk = {
                                id: did + "#delegate-" + delegateCount,
                                type: "" + algo + type,
                                owner: did,
                            };
                            switch (encoding) {
                                case null:
                                case undefined:
                                case 'hex':
                                    pk.publicKeyHex = event_1.value.slice(2);
                                    break;
                                case 'base64':
                                    pk.publicKeyBase64 = buffer_1.Buffer.from(event_1.value.slice(2), 'hex').toString('base64');
                                    break;
                                case 'base58':
                                    pk.publicKeyBase58 = buffer_1.Buffer.from(event_1.value.slice(2), 'hex').toString('base58');
                                    break;
                                case 'pem':
                                    pk.publicKeyPem = buffer_1.Buffer.from(event_1.value.slice(2), 'hex').toString();
                                    break;
                                default:
                                    pk.value = event_1.value;
                            }
                            pks[key] = pk;
                            break;
                        case 'svc':
                            services[key] = {
                                type: algo,
                                serviceEndpoint: buffer_1.Buffer.from(event_1.value.slice(2), 'hex').toString(),
                            };
                            break;
                    }
                }
            }
        }
        else {
            if (delegateCount > 0 &&
                (event_1._eventName === 'DIDDelegateChanged' ||
                    (event_1._eventName === 'DIDAttributeChanged' &&
                        bytes32toString(event_1.name).match(/^did\/pub\//))) &&
                validTo.lt(now))
                delegateCount--;
            delete auth[key];
            delete pks[key];
            delete services[key];
        }
    }
    var doc = {
        '@context': 'https://w3id.org/did/v1',
        id: did,
        publicKey: publicKey.concat(Object.values(pks)),
        authentication: authentication.concat(Object.values(auth)),
    };
    if (Object.values(services).length > 0) {
        doc.service = Object.values(services);
    }
    return doc;
}
exports.wrapDidDocument = wrapDidDocument;
function configureProvider(conf) {
    if (conf === void 0) { conf = {}; }
    if (conf.provider) {
        return conf.provider;
    }
    else if (conf.web3) {
        return conf.web3.currentProvider;
    }
    else {
        return new ethjs_provider_http_1.default(conf.rpcUrl || 'https://mainnet.infura.io/ethr-did');
    }
}
function register(conf) {
    var _this = this;
    if (conf === void 0) { conf = {}; }
    var provider = configureProvider(conf);
    var eth = new ethjs_query_1.default(provider);
    var registryAddress = conf.registry || exports.REGISTRY;
    var DidReg = new ethjs_contract_1.default(eth)(ethr_did_registry_json_1.default);
    var didReg = DidReg.at(registryAddress);
    var logDecoder = ethjs_abi_1.default.logDecoder(ethr_did_registry_json_1.default, false);
    var lastChanged = function (identity) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, didReg.changed(identity)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        return [2 /*return*/, result['0']];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    function changeLog(identity) {
        return __awaiter(this, void 0, void 0, function () {
            var history, previousChange, blockNumber, logs, events, _i, events_1, event_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = [];
                        return [4 /*yield*/, lastChanged(identity)];
                    case 1:
                        previousChange = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!previousChange) return [3 /*break*/, 4];
                        blockNumber = previousChange;
                        return [4 /*yield*/, eth.getLogs({
                                address: registryAddress,
                                topics: [null, "0x000000000000000000000000" + identity.slice(2)],
                                fromBlock: previousChange,
                                toBlock: previousChange,
                            })];
                    case 3:
                        logs = _a.sent();
                        events = logDecoder(logs);
                        previousChange = undefined;
                        for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                            event_2 = events_1[_i];
                            history.unshift(event_2);
                            if (event_2.previousChange.lt(blockNumber)) {
                                previousChange = event_2.previousChange;
                            }
                        }
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, history];
                }
            });
        });
    }
    function resolve(did, parsed) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parsed.id.match(/^0x[0-9a-fA-F]{40}$/))
                            throw new Error("Not a valid ethr DID: " + did);
                        return [4 /*yield*/, didReg.identityOwner(parsed.id)];
                    case 1:
                        owner = _a.sent();
                        return [4 /*yield*/, changeLog(parsed.id)];
                    case 2:
                        history = _a.sent();
                        return [2 /*return*/, wrapDidDocument(did, owner['0'], history)];
                }
            });
        });
    }
    did_resolver_1.registerMethod('ethr', resolve);
}
exports.default = register;
// module.exports = register
//# sourceMappingURL=myresolver.js.map