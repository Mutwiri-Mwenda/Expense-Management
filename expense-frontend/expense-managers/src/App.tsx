import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface FormState {
  description: string;
  amount: string;
  category: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<FormState>({ description: "", amount: "", category: "Food" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get<Expense[]>("http://localhost:3000/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        if (axios.isAxiosError(err)) {
          // More detailed error logging
          console.error("Error details:", {
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers
          });
        }
        setError("Failed to fetch expenses. Please check your backend server.");
      }
    };
    fetchExpenses();
  }, []);

  // Handle form input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  // Add new expense
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newExpense = {
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
    };

    try {
      console.log("Submitting expense:", newExpense); // Log the expense being submitted
      const res = await axios.post<Expense>("http://localhost:3000/expenses", newExpense, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Server response:", res.data); // Log the server's response
      setExpenses([...expenses, res.data]);
      setForm({ description: "", amount: "", category: "Food" });
    } catch (err) {
      console.error("Failed to add expense:", err);
      if (axios.isAxiosError(err)) {
        // More detailed error logging
        console.error("Error details:", {
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        setError(err.response?.data?.message || "Failed to add expense. Please check your input and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error details:", {
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
      }
      setError("Failed to delete expense. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Manager</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form className="mb-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 flex-1"
          required
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 w-24"
          type="text"
          required
        />
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-32">
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
        <button className="bg-blue-500 text-white p-2" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="border p-2 mb-2 flex justify-between items-center">
            <span>
              {expense.description} - ${expense.amount.toFixed(2)} ({expense.category})
            </span>
            <button onClick={() => handleDelete(expense.id)} className="bg-red-500 text-white p-2">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
