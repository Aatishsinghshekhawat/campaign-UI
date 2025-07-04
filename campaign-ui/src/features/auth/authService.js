import axios from '../../api/axios';

const login = async (credentials) => {
  const res = await axios.post('/auth/login', credentials);
  return res.data;
};

const authService = { login };
export default authService;
