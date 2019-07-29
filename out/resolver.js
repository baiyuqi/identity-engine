"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var did_resolver_1 = __importDefault(require("did-resolver"));
var ethr_did_resolver_1 = __importDefault(require("ethr-did-resolver"));
ethr_did_resolver_1.default();
// You can also use ES7 async/await syntax
did_resolver_1.default('did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74').then(function (doc) {
    console.log(doc);
});
//# sourceMappingURL=resolver.js.map