import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addFundAction } from "../../services/ApiActions";
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

const walletSlice = createSlice({

  name: 'wallet',
  initialState: {
    balance: 0,
    transactions: [],
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWalletSync.fulfilled, (state, action) => {
        const { balance, transactions } = action.payload;
        state.balance = balance;
        state.transactions = transactions
        state.error = null;
      })
      .addCase(getWalletSync.rejected, (state, action) => {
        state.balance = 0;
        state.transactions = [];
        state.error = action.payload;
      })
      .addCase(addFundSync.fulfilled, (state, action) => {
        const { balance, transaction } = action.payload;
        state.balance = balance;
        state?.transactions.push(transaction)
        state.error = null;
      })
      .addCase(addFundSync.rejected, (state, action) => {
        state.balance = 0;
        state.transactions = [0];
        state.error = action.payload;
      })
  }

})

export default walletSlice.reducer