import './App.css'

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import Footer from './components/footer'
import NavigationBar from './components/navigation-bar'

import {
  tokenABI,
  tokenAddress,
  tokenSaleABI,
  tokenSaleAddress,
} from './utils/constants'
import Welcome from './components/welcome'
import Services from './components/services'

const styles = {
  wrapper: `min-h-screen`,
}

// const HARDHAT_NETWORK_ID = '31337'

const ERROR_CODE_TX_REJECTED_BY_USER = 4001

const { ethereum } = window

function App() {
  let _pollDataInterval
  const _provider = new ethers.providers.Web3Provider(ethereum)
  const _token = new ethers.Contract(
    tokenAddress,
    tokenABI,
    _provider.getSigner(0)
  )

  const _tokenSale = new ethers.Contract(
    tokenSaleAddress,
    tokenSaleABI,
    _provider.getSigner(0)
  )

  const initialState = {
    tokenData: undefined,
    tokenSaleData: undefined,
    selectedAddress: undefined,
    balance: undefined,
    USDTBalance: undefined,
    txBeingSent: undefined,
    transactionError: undefined,
    networkError: undefined,
    formData: {
      size: undefined,
      subtotal: undefined,
    },
  }
  const [state, setState] = useState(initialState)

  const _connectWallet = async () => {
    const [selectedAddress] = await ethereum.request({
      method: 'eth_requestAccounts',
    })

    _initialize(selectedAddress)

    ethereum.on('accountsChanged', ([newAddress]) => {
      _stopPollingData()
      if (newAddress === undefined) {
        return _resetState()
      }

      _initialize(newAddress)
    })

    ethereum.on('chainChanged', ([networkId]) => {
      _stopPollingData()
      _resetState()
    })
  }

  const _initialize = async (userAddress) => {
    setState((prevState) => ({ ...prevState, selectedAddress: userAddress }))
    _getTokenData()
    _getTokenSaleData()
  }

  const _startPollingData = () => {
    _pollDataInterval = setInterval(() => _updateBalance(), 1000)
    _updateBalance()
  }

  const _stopPollingData = () => {
    clearInterval(_pollDataInterval)
    _pollDataInterval = undefined
  }

  const _getTokenData = async () => {
    const name = await _token.name()
    const symbol = await _token.symbol()

    setState((prevState) => ({
      ...prevState,
      tokenData: { name, symbol },
    }))
  }

  const _getTokenSaleData = async () => {
    const price = await _tokenSale.tokenPrice()
    const tokenSold = await _tokenSale.tokenSold()

    setState((prevState) => ({
      ...prevState,
      tokenSaleData: { price, tokenSold },
    }))
  }

  const _updateBalance = async () => {
    const balance = await _token.balanceOf(state.selectedAddress)
    const USDTBalance = await _provider.getBalance(state.selectedAddress)
    setState((prevState) => ({
      ...prevState,
      balance: balance,
      USDTBalance: USDTBalance,
    }))
  }

  const _transferTokens = async (to, amount) => {
    try {
      _dismissTransactionError()

      const tx = await _token.transfer(to, amount)
      // setState({ txBeingSent: tx.hash })
      setState((prevState) => ({ ...prevState, txBeingSent: tx.hash }))

      const receipt = await tx.wait()

      if (receipt.status === 0) {
        throw new Error('Transaction failed')
      }

      await _updateBalance()
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return
      }
      console.error(error)
      setState((prevState) => ({ ...prevState, transactionError: error }))
    } finally {
      setState((prevState) => ({ ...prevState, txBeingSent: undefined }))
    }
  }

  const _buyTokens = async (buyer, amount) => {
    try {
      _dismissTransactionError()

      let num = amount
        ? ethers.BigNumber.from(amount)
        : ethers.BigNumber.from(0)
      num = num * state.tokenSaleData.price
      num = ethers.BigNumber.from(num.toString())

      const tx = await _tokenSale.buyTokens(amount, {
        from: buyer,
        gasLimit: 30000,
        value: num._hex,
        // gas: '0x5208',
      })
      setState((prevState) => ({ ...prevState, txBeingSent: tx.hash }))

      const receipt = await tx.wait()

      if (receipt.status === 0) {
        throw new Error('Transaction failed')
      }

      await _updateBalance()
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return
      }
      console.error(error)
      setState((prevState) => ({ ...prevState, transactionError: error }))
    } finally {
      // setState({ txBeingSent: undefined })
      setState((prevState) => ({ ...prevState, txBeingSent: undefined }))
    }
  }

  const _dismissTransactionError = () => {
    // setState({ transactionError: undefined })
    setState((prevState) => ({ ...prevState, transactionError: undefined }))
  }

  const _dismissNetworkError = () => {
    // setState({ networkError: undefined })
    setState((prevState) => ({ ...prevState, networkError: undefined }))
  }

  const _getRpcErrorMessage = (error) => {
    if (error.data) {
      return error.data.message
    }

    return error.message
  }

  const _resetState = () => {
    setState(initialState)
  }

  // const _checkNetwork = () => {
  //   console.log('hithereimdead', ethereum.networkVersion)
  //   if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
  //     return true
  //   }

  //   setState((prevState) => ({
  //     ...prevState,
  //     networkError: 'Please connect Metamask to Localhost:8545',
  //   }))

  //   return false
  // }

  const _handleChange = (e) => {
    let num = e.target.value
    num = num ? ethers.BigNumber.from(num) : ethers.BigNumber.from(0)
    num = num * state.tokenSaleData.price

    setState((prevState) => ({
      ...prevState,
      formData: {
        size: e.target.value,
        subtotal: num,
      },
    }))
  }

  useEffect(() => {
    _stopPollingData()
    _connectWallet()
    // _getTokenSaleData()
    console.log(state.balance)
  }, [])
  useEffect(() => {
    if (state.selectedAddress) _startPollingData()
  }, [state.selectedAddress])

  return (
    <div className={styles.wrapper}>
      <div className='gradient-bg-welcome'>
        <NavigationBar
          selectedAddress={state.selectedAddress}
          connectWallet={() => _connectWallet()}
        />
        <Welcome
          availableSupply={
            2500 -
            (state.tokenSaleData && state.tokenSaleData.tokenSold
              ? state.tokenSaleData.tokenSold
              : 0)
          }
          selectedAddress={state.selectedAddress}
          connectWallet={() => _connectWallet()}
          formData={state.formData}
          balance={state.balance ? state.balance.toNumber() : 0}
          handleChange={(e) => _handleChange(e)}
          handleSubmit={(e) => {
            _buyTokens(state.selectedAddress, state.formData.size)
          }}
          USDTBalance={state.USDTBalance ? state.USDTBalance.toString() : '0'}
        />
      </div>
      <Services />
      <div className='flex w-full justify-center items-center 2xl:px-20 h-10 gradient-bg-transactions'></div>
      <Footer />
    </div>
  )
}

export default App
