import InputForm from '../input-form'
import UserCard from '../user-card'
import logo from '../../../assets/logo.png'

const styles = {
  wrapper: `flex w-full justify-center items-center`,
  button: `flex w-[300px] flex-row justify-center items-center mt-5 bg-[#2952E3] p-3 rounded-full cursor-pointer hover:bg-[#2546BD]`,
  header_text: `text-3xl sm:text-5xl text-white text-gradient py-1`,
  paragraph_text: `text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base`,
}

const Welcome = ({
  selectedAddress,
  connectWallet,
  balance,
  USDTBalance,
  handleChange,
  handleSubmit,
  formData,
  availableSupply,
}) => {
  return (
    <div className='px-20 md:px-40 flex flex-col justify-center items-center py-10'>
      <h1 className={styles.header_text}>Welcome to</h1>
      <img src={logo} alt='logo' className='w-100 py-5' />
      {selectedAddress ? (
        <div className=' flex flex-col justify-center items-center'>
          <UserCard selectedAddress={selectedAddress} balance={balance} />
          <div className='w-full sm:w-[500px]'>
            {/* {console.log(balance)} */}
            <InputForm
              USDTBalance={USDTBalance}
              handleChange={(e) => {
                handleChange(e)
                // console.log('HI THERE')
              }}
              handleSubmit={(e) => {
                handleSubmit(e)
              }}
              availableSupply={availableSupply}
              formData={formData}
            />
          </div>
        </div>
      ) : (
        <div>
          <button
            type='button'
            onClick={connectWallet}
            className={styles.button}
          >
            <p className='text-white text-base font-semibold'>Connect Wallet</p>
          </button>
        </div>
      )}
    </div>
  )
}

export default Welcome
