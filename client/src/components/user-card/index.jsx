import React from 'react'

// Icons
import { SiEthereum } from 'react-icons/si'
import { BsInfoCircle } from 'react-icons/bs'
import { shortenAddress } from '../../utils/shorten-address'
import keey from '../../../assets/keey-logo.png'

const styles = {
  cardWrapper: `p-3 justify-end items-start flex-col rounded-xl h-40 w-72 my-5 eth-card white-glassmorphism`,
  contentContainer: `flex justify-between flex-col w-full h-full`,
  upperContainer: `flex justify-between items-start`,
  ethIconWrapprt: `w-10 h-10 rounded-full border-2 border-white flex justify-center items-center`,
}

const UserCard = ({ selectedAddress, balance }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.upperContainer}>
          <div className={styles.ethIconWrapprt}>
            <img src={keey} alt='keey' className='w-100 py-5' />
            {/* <SiEthereum fontSize={21} color='#fff' /> */}
          </div>
          <BsInfoCircle fontSize={17} color='#fff' />
        </div>
        <div>
          <p className='text-white text-sm'>
            {shortenAddress(selectedAddress)}
          </p>
          <p className='text-white font-light text-sm'>
            Balance: <span className='font-semibold'>{balance} KEEY</span>
          </p>
          <p className='text-white font-semibold text-lg my-1'>
            Iron Sail Token (KEEY)
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
