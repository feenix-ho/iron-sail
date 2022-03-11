require('@nomiclabs/hardhat-waffle')
require('dotenv').config()
const INFURA_API_KEY = 'bab26bec2d824580a15b79d772768d67'

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY_KEEY = process.env.ROPSTEN_PRIVATE_KEY_KEEY
const ROPSTEN_PRIVATE_KEY_USDT = process.env.ROPSTEN_PRIVATE_KEY_USDT

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
https: module.exports = {
  solidity: '0.8.3',
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY_KEEY}`, `${ROPSTEN_PRIVATE_KEY_USDT}`],
    },
  },
  localhost: {
    url: 'http://127.0.0.1:8545',
    accounts: [
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    ],
  },
}
