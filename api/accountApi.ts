import { Account } from "@/types/account";
import axios from "axios";

const API_BASE_URL = "http://localhost:3002/hotel/accounts";

export const accountApi = {

  async findByEmail(email: string) {
    const res = await axios.get(`${API_BASE_URL}/find`, {
      params: { email },
    });
    return res.data; // account
  },


  async createOrGetAccount(email: string, user_name?: string) {
    const res = await axios.post(`${API_BASE_URL}`, {
      email,
      user_name: user_name || "",
    });
    return res.data; // account (cũ hoặc mới)
  },

   async updateAccount(account_id: string, payload: Partial<Account>): Promise<Account> {
    const res = await axios.put(`${API_BASE_URL}/${account_id}`, payload);
    return res.data;
  },
};
