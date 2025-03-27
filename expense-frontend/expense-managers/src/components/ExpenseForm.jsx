import { useState } from "react";

const ExpenseForm = ({ onAdd }) => {
  const [form, setForm] = useState({ description: "", amount: "", category: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.description && form.amount && form.category) {
      onAdd(form);
      setForm({ description: "", amount: "", category: "" });
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 mr-2" />
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className="border p-2 mr-2" type="number" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 mr-2" />
      <button className="bg-blue-500 text-white p-2" type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
