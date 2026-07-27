import api from "./api";

const systemService = {

  async getSystemStatus() {
    const res = await api.get("/status");
    return res.data;
  },

};

export default systemService;