import { createAsyncThunk, createSlice, isFulfilled, isRejected } from "@reduxjs/toolkit";
import { addFundAction, withdrawFundAction } from "../../services/ApiActions";
import { getWallet } from "../../services/FetchDatas";

export const getWalletSync = createAsyncThunk(
  'wallets/getWallet',
  async(_,{rejectWithValue}) =>
    await getWallet()
    .then(response => response)
    .catch(error => rejectWithValue(error.message || "Failed to fetch wallet"))
)

export const addFundSync = createAsyncThunk(
  'wallets/addFund',
  async(data,{rejectWithValue}) =>
    await addFundAction(data)
    .then(response => response)
    .catch(error => rejectWithValue(error.messaege || "Failed to add fund"))
)

export const withdrawFundSync = createAsyncThunk(
  'wallets/withdrawFund',
    async(data,{rejectWithValue}) =>
      await withdrawFundAction(data)
      .then(response => response)
      .catch(error => rejectWithValue(error.messaege || "Failed to withdraw fund"))
)

const walletSlice = createSlice({

  name: 'wallet',
  initialState: {
    balance: 0,
    transactions: [],
    error: null
  },
  reducers: {
    setWallet: (state, action) => {
      const { balance, transactions } = action?.payload;
      state.balance = balance;
      state.transactions = transactions?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      state.error = null;
    },
    addFund: (state, action)=> {
      const { balance, transaction } = action.payload;
      state.balance = balance;
      state?.transactions.unshift(transaction)
      state.error = null;
    },
    withdrawFund: (state, action)=> {
      const { balance, transaction } = action.payload;
      state.balance = balance;
      state?.transactions.unshift(transaction)
      state.error = null;
    },
    clearWallet: (state) => {
      state.balance = 0;
      state.transactions = [];
      state.error= null
    }
  },
  /* extraReducers: (builder) => {
    builder
      .addCase(getWalletSync.fulfilled, (state, action) => {
        const { balance, transactions } = action.payload;
        state.balance = balance;
        state.transactions = transactions?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        state.error = null;
      })
      .addCase(getWalletSync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addMatcher(isFulfilled(addFundSync, withdrawFundSync), (state, action) => {
        const { balance, transaction } = action.payload;
        state.balance = balance;
        state?.transactions.push(transaction)
        state.error = null;
      })
      .addMatcher(isRejected(addFundSync, withdrawFundSync), (state, action) => {
        state.error = action.payload;
      })
  } */

})

export const { setWallet, addFund, withdrawFund, clearWallet } = walletSlice.actions

export default walletSlice.reducer