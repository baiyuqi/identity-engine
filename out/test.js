"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethjs_provider_http_1 = __importDefault(require("ethjs-provider-http"));
var ethjs_query_1 = __importDefault(require("ethjs-query"));
var REGISTRY = '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b';
var provider = new ethjs_provider_http_1.default('https://mainnet.infura.io/ethr-did');
var eth = new ethjs_query_1.default(provider);
var registryAddress = REGISTRY;
//# sourceMappingURL=test.js.map