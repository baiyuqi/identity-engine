import HttpProvider from 'ethjs-provider-http'
import Eth from 'ethjs-query'
import abi from 'ethjs-abi'
import BN from 'bn.js'
import EthContract from 'ethjs-contract'
import { Buffer } from 'buffer'
 const REGISTRY = '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'
  let provider  =  new HttpProvider('https://mainnet.infura.io/ethr-did')
  let eth = new Eth(provider)
  let registryAddress =  REGISTRY
  
