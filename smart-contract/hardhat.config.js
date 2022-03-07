// https://eth-ropsten.alchemyapi.io/v2/9Ted2zR5eeKtV5jYXIBbqrAm7SRNbSw2

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.7.5',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/9Ted2zR5eeKtV5jYXIBbqrAm7SRNbSw2',
      accounts: [
        '0138ffc15f1fb0a7d6b35aa4560fab79ac5bc28ad37fd2f30f7a73a569ba2b42',
      ],
    },
  },
}
