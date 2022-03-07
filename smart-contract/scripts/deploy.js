const main = async () => {
  const tokenInstance = await ethers.getContractFactory('KEEY')
  const KEEY = await tokenInstance.deploy(2500)

  const tokenSaleInstance = await ethers.getContractFactory('KEEYSale')
  const tokenPrice = 1000000000000000 //0.001 eth
  const KEEYSale = await tokenSaleInstance.deploy(KEEY.address, tokenPrice)

  console.log('KEEY deployed to: ', KEEY.address)
  console.log('KEEYSale deployed to: ', KEEYSale.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
