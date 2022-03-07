import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import { BiWallet } from 'react-icons/bi'
import { shortenAddress } from '../../utils/shorten-address'

import logo from '../../../assets/logo.png'
import React from 'react'

const styles = {
  wrapper: `w-full flex md:justify-center justify-between items-center p-4`,
  logo_wrapper: `md:flex-[0.5] flex-initial justify-center items-center`,
  logo: `w-32 cursor-pointer`,
  navigation_item_wrapper: `text-white md:flex hidden list-none flex-row justify-between items-center flex-initial`,
  connect_button: `w-[200px] flex flex-row items-center bg-[#2952E3] py-2 px-5 rounded-full cursor-pointer hover:bg-[#2546BD]`,
  navigation_menu_icon_button: `text-white md:hidden cursor-pointer`,
  md_navigation_item_wrapper: `z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
  flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in`,
}

const NavigationItem = ({ title, class_props }) => {
  return <li className={`mx-4 cursor-pointer ${class_props}`}>{title}</li>
}

const NavigationBar = ({ connectWallet, selectedAddress }) => {
  const [toggleMenu, setToggleMenu] = React.useState(false)
  const navigationItems = ['Market', 'Exchange', 'Tutorials', 'Wallets']

  return (
    <nav className={styles.wrapper}>
      <div className={styles.logo_wrapper}>
        <img src={logo} alt='logo' className={styles.logo} />
      </div>
      <ul className={styles.navigation_item_wrapper}>
        {navigationItems.map((item, index) => (
          <NavigationItem key={item + index} title={item} />
        ))}
        {selectedAddress ? (
          <li
            className={`${styles.connect_button} justify-between`}
            onClick={() => {
              console.log(selectedAddress)
            }}
          >
            <BiWallet fontSize={21} />
            <div>{shortenAddress(selectedAddress)}</div>
          </li>
        ) : (
          <li
            className={`${styles.connect_button} justify-center`}
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </li>
        )}
      </ul>
      <div className='flex relative'>
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className={styles.navigation_menu_icon_button}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className={styles.navigation_menu_icon_button}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className={styles.md_navigation_item_wrapper}>
            <li className='text-xl w-full my-2'>
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navigationItems.map((item, index) => (
              <NavigationItem
                key={item + index}
                title={item}
                class_props='my-2 text-lg'
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

export default NavigationBar
