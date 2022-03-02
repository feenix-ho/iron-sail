import React from 'react'

// Icons
import { SiEthereum } from 'react-icons/si'
import { BsInfoCircle } from 'react-icons/bs'

const styles = {
  cardWrapper: `p-3 justify-end items-start flex-col rounded-xl h-40 w-72 my-5 eth-card white-glassmorphism`,
  contentContainer: `flex justify-between flex-col w-full h-full`,
  upperContainer: `flex justify-between items-start`,
  ethIconWrapprt: `w-10 h-10 rounded-full border-2 border-white flex justify-center items-center`,
}

const UserCard = () => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.upperContainer}>
          <div className={styles.ethIconWrapprt}>
            <SiEthereum fontSize={21} color='#fff' />
          </div>
          <BsInfoCircle fontSize={17} color='#fff' />
        </div>
        <div>
          <p className='text-white font-light text-sm'>Address</p>
          <p className='text-white font-semibold text-lg mt-1'>Name</p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
