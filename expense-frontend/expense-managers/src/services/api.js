import axios from "axios";

app.use(express.json());

const API_URL = "http://localhost:3000/expenses";

export const getExpenses = () => axios.get(API_URL);
export const addExpense = (expense) => axios.post(API_URL, expense);
export const deleteExpense = (id) => axios.delete(`${API_URL}/${id}`);
