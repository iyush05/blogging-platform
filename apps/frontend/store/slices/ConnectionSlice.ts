import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendRequest = createAsyncThunk(
  'connections/sendRequest',
  async (userId: string) => {
    const res = await axios.post('/api/connections/request', { userId });
    return res.data; // new Connection object
  }
);
