import React, { useEffect, useState } from 'react'
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdArrowRoundUp } from "react-icons/io";
import AddFundModal from '../../../components/ui/AddFundModal';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletSync } from '../../../store/slices/WalletSlice';
import { format } from 'date-fns';
import { clsx } from 'clsx';

function Wallet() {

  const dispatch = useDispatch();
  const { balance:walletBalance, transactions:list } = useSelector(state => state.wallet);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getWalletSync())
  },[])

  useEffect(() => {
    if(walletBalance) setBalance(walletBalance);
    if(list?.length) setTransactions(list);
  },[walletBalance, list])

  return (
    <div className='w-full h-full p-6'>
      <div className='flex flex-col space-y-5'>

        {/* balance display */}
        <div className='flex justify-between'>
          
          <div className="inline-flex flex-col">
            <h3 className='text-lg'>Total Balance</h3>
            <h3 className='text-2xl !text-primary-400 content-before content-before:text-base
              flex items-start content-before:font-normal'
            >{balance}</h3>
          </div>

          <div className='inline-flex items-center'>
            <button
              onClick={() => setIsModalOpen(true)}
              className='!px-10'
            >Add cash</button>
          </div>
        </div>

        <div className='flex flex-col border border-gray-100 rounded-3xl shadow-lg/5 p-5'>
          <h3 className='text-lg mb-4'>Transactions</h3>

          <ul className='divide-y divide-gray-200'>

            <li className='grid grid-cols-[0.5fr_0.5fr_1.5fr_1fr_1fr_1fr] mb-1.5'
            >
              <p className='font-bold'>No</p>
              <p className='flex items-center'>
                <HiMiniArrowsUpDown className='text-lg' />
              </p>
              <p className='font-bold'>Description</p>
              <p className='font-bold'>Payment Type</p>
              <p className='font-bold'>Amount</p>
              <p className='font-bold'>Date</p>
            </li>
            
            {transactions.length > 0 ?
              transactions?.map((item, i) => {

                const credit = item?.type === 'credit';
                const dt = format(new Date(item?.createdAt), "dd-MM-yyyy")
                
                return (
                  <li 
                    key={item?._id}
                    className='grid grid-cols-[0.5fr_0.5fr_1.5fr_1fr_1fr_1fr] py-0.5'>
                    <p>{++i}</p>
                    <p className='flex items-center'>
                      {credit ?
                        <span className='bg-primary-50 text-primary-400 p-0.5 rounded-full'>
                          <IoMdArrowRoundUp />
                        </span>
                        :
                        <span className='bg-red-100 text-red-400 p-0.5 rounded-full'>
                          <IoMdArrowRoundDown />
                        </span>
                      }
                    </p>
                    <p>{item?.description}</p>
                    <p>{item?.paymentMethod}</p>
                    <p className={clsx('font-semibold',credit ? 'text-primary-400' : 'text-red-400')}>
                      <span className='me-1'
                      >{credit ? '+' : '-'}</span>
                      <span className='content-before content-before:font-normal'
                      >{item?.amount}</span>
                    </p>
                    <p>{dt}</p>
                  </li>
                )
              })
              :
              <li className='text-center p-3 text-gray-400'>No transaction exists</li>
            }
          </ul>
        </div>

      </div>

      <AddFundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Wallet