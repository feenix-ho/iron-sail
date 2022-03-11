import './App.css'

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import Footer from './components/footer'
import NavigationBar from './components/navigation-bar'

import TokenArtifact from './utils/Token.json'
import TokenSaleArtifact from './utils/TokenSale.json'
import contractAddress from './utils/contract-address.json'
import Welcome from './components/welcome'
import Services from './components/services'

const styles = {
  wrapper: `min-h-screen`,
}

const ERROR_CODE_TX_REJECTED_BY_USER = 4001

function App() {
  const [defaultAccount, setDefaultAccount] = useState('')
  const [errorMessage, setErrorMessage] = useState(
    'Please connect to Ropsten Testnet to continue'
  )
  const [isConnected, setIsConnected] = useState(false)
  const [connButtonText, setConnButtonText] = useState('Connect Wallet')

  const [USDTContract, setUSDTContract] = useState(undefined)
  const [KEEYContract, setKEEYContract] = useState(undefined)
  const [SaleContract, setSaleContract] = useState(undefined)

  const [KEEYBalance, setKEEYBalance] = useState(0)

  const [approveText, setApproveText] = useState('(Need approval)')

  const [amount, setAmount] = useState('0')
  const [fixedBuyPrice] = useState(100000)
  const [totalUSDT, setTotalUSDT] = useState(amount * fixedBuyPrice)
  const [remainingKEEY, setRemainingKEEY] = useState(undefined)
  const [USDTBalance, setUSDTBalance] = useState(0)

  let _pollingInterval

  useEffect(() => {
    const setContract = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const USDTContractData = new ethers.Contract(
        contractAddress.USDT,
        TokenArtifact.abi,
        signer
      )
      setUSDTContract(USDTContractData)
      const KEEYContractData = new ethers.Contract(
        contractAddress.KEEY,
        TokenArtifact.abi,
        signer
      )
      setKEEYContract(KEEYContractData)

      const SaleContractData = new ethers.Contract(
        contractAddress.SaleContract,
        TokenSaleArtifact.abi,
        signer
      )
      setSaleContract(SaleContractData)
    }

    if (window.ethereum === undefined) {
      setErrorMessage(
        'Please install MetaMask browser extension to interact with the app'
      )
    } else {
      setIsConnected(true)
      setContract()
    }
  }, [isConnected])

  useEffect(() => {
    const getRemainingKEEY = async () => {
      try {
        let remainingKEEY = await SaleContract.getRemainingKEEYInPool()
        setRemainingKEEY(remainingKEEY)
      } catch (e) {
        console.log('ERROR: ', e)
      }
    }

    const updateUSDTBalance = async (account) => {
      try {
        let USDTBalanceData = await USDTContract.balanceOf(account)
        setUSDTBalance((USDTBalanceData / 1000000).toString())
      } catch (e) {
        console.log('ERROR: ', e)
      }
    }

    const checkUSDTApproval = async () => {
      try {
        const allowance = await USDTContract.allowance(
          defaultAccount[0],
          SaleContract.address
        )
        if (!allowance.isZero()) {
          setApproveText('')
        }
      } catch (e) {
        console.log('ERROR: ', e)
      }
    }

    getRemainingKEEY()
    updateUSDTBalance(defaultAccount[0])
    checkUSDTApproval()
  }, [defaultAccount[0]])

  const handleAccountChanged = (newAccount) => {
    setDefaultAccount(newAccount)
  }

  const updateBalance = async (account) => {
    try {
      let KEEYBalance = await KEEYContract.balanceOf(account)
      setKEEYBalance(KEEYBalance.toString())
    } catch (e) {
      console.log('ERROR: ', e)
    }
  }

  useEffect(() => {
    const handleChainChanged = () => {
      window.location.reload()
    }

    if (window.ethereum !== undefined) {
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', handleAccountChanged)
    }

    updateBalance(defaultAccount[0])
  }, [defaultAccount[0]])

  const connectWallet = () => {
    if (window.ethereum !== undefined) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          handleAccountChanged(result)
          // Should check Ropsten network here, assumption for short
          setConnButtonText('Wallet Connected')
          setErrorMessage('')
          updateBalance(result[0])
        })
        .catch((error) => {
          setErrorMessage(error.message)
        })
    } else {
      console.log('Need to install MetaMask')
    }
  }

  const handleFormChanged = (e) => {
    const value = e.target.value

    if (!value.includes('.') && Number.parseInt(value) >= 0) {
      if (value > 2500) {
        setAmount(2500)
        setTotalUSDT(2500 * fixedBuyPrice)
      } else if (value > 0) {
        setAmount(value)
        setTotalUSDT(value * fixedBuyPrice)
      }
    } else {
      setAmount(0)
      setTotalUSDT(0)
    }
  }

  const handleBuyKEEY = async () => {
    console.log(USDTContract.address)
    console.log(SaleContract.address)

    if (totalUSDT !== 0) {
      setErrorMessage('')
      if (approveText === '') {
        // Start buying
        console.log('Start buying...')
        try {
          const response = await SaleContract.buyKEEY(totalUSDT * 100000)
          console.log(totalUSDT * 100000)
          console.log(response)
        } catch (err) {
          setErrorMessage(err.error.message)
        }
      } else {
        try {
          const response = await USDTContract.approve(
            SaleContract.address,
            USDTContract.balanceOf(defaultAccount[0])
          )
          setApproveText('')
        } catch (err) {
          console.log('error: ', err)
          return
        }
      }
    } else {
      setErrorMessage('Please enter valid amount of KEEY')
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className='gradient-bg-welcome'>
        <NavigationBar
          selectedAddress={defaultAccount[0]}
          connectWallet={connectWallet}
        />
        <Welcome
          availableSupply={
            remainingKEEY === undefined ? 0 : remainingKEEY.toNumber()
          }
          selectedAddress={defaultAccount[0]}
          connectWallet={connectWallet}
          formData={{ size: amount, subtotal: totalUSDT / 10 }}
          balance={KEEYBalance}
          handleChange={(e) => handleFormChanged(e)}
          handleSubmit={handleBuyKEEY}
          USDTBalance={USDTBalance}
        />
      </div>
      <Services />
      <div className='flex w-full justify-center items-center 2xl:px-20 h-10 gradient-bg-transactions'></div>
      <Footer />
    </div>
  )
}

export default App
