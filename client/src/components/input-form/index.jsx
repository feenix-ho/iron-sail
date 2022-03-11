import React from 'react'
import { FormHelperText, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Loader from '../loader'

const styles = {
  formWrapper: `p-5 mt-5 w-full flex flex-col justify-start items-center blue-glassmorphism`,
  divideLine: `h-[2px] w-full bg-gray-400 my-2`,
}

const InputForm = ({
  USDTBalance,
  handleChange,
  handleSubmit,
  availableSupply,
  formData,
}) => {
  return (
    <div className={styles.formWrapper}>
      <TextField
        label='Size'
        type='number'
        focused
        variant='filled'
        className='mt-2 w-full rounded-md p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism'
        defaultValue={0}
        fullWidth
        sx={{ mt: 2 }}
        value={formData.size}
        onChange={(e) => {
          handleChange(e)
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <p className='text-white'>KEEY</p>
            </InputAdornment>
          ),
          disableUnderline: true,
          style: {
            color: 'white',
            fontWeight: 300,
          },
        }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      {availableSupply < formData.size ? (
        <div className='flex w-full justify-between items-center px-3'>
          <FormHelperText
            style={{
              color: '#770000',
            }}
          >
            Available supply is not enough.
          </FormHelperText>
        </div>
      ) : (
        <div className='flex w-full justify-between items-center px-3'>
          <FormHelperText
            style={{
              color: 'dimgrey',
            }}
          >
            Available supply:{' '}
            <span className='font-semibold text-sm'>
              {availableSupply} KEEY
            </span>
          </FormHelperText>
        </div>
      )}
      <TextField
        label='Subtotal'
        focused
        variant='filled'
        className='mt-2 w-full rounded-md p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism'
        type='number'
        defaultValue={0}
        fullWidth
        sx={{ m: 1 }}
        value={formData.subtotal}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <p className='text-white'>USDT</p>
            </InputAdornment>
          ),
          readOnly: true,
          disableUnderline: true,
          style: {
            color: 'white',
            fontWeight: 300,
          },
        }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      <div className='flex w-full justify-between items-center px-3'>
        <FormHelperText
          style={{
            color: USDTBalance < formData.subtotal ? '#770000' : 'dimgrey',
            // color: USDTBalance >= formData.subtotal ? 'dimgrey' : '#770000',
          }}
        >
          Balance:{' '}
          <span className='font-semibold text-sm'>{USDTBalance} USDT</span>
        </FormHelperText>
      </div>

      <div className={styles.divideLine} />

      <div className='flex w-full justify-between items-center p-10'>
        <div>
          <p className='text-lg text-white font-semibold'>Total</p>
        </div>
        <div>
          <p className='text-2xl text-[#2952E3] font-semibold'>
            {USDTBalance >= formData.subtotal &&
            availableSupply >= formData.size
              ? formData.subtotal
              : 0}{' '}
            USDT
          </p>
        </div>
      </div>

      <div className={styles.divideLine} />

      {false ? (
        <Loader />
      ) : (
        <button
          type='button'
          onClick={(e) => handleSubmit(e)}
          className='text-white w-full mt-2 border-[1px] p-2 border-[#3D4F7C] rounded-full cursor-pointer font-semibold'
        >
          Buy Now
        </button>
      )}
    </div>
  )
}

export default InputForm
