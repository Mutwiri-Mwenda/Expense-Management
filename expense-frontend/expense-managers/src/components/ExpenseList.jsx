const ExpenseList = ({ expenses, onDelete }) => {
    return (
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="border p-2 mb-2 flex justify-between">
            {expense.description} - ${expense.amount} ({expense.category})
            <button onClick={() => onDelete(expense.id)} className="bg-red-500 text-white p-2">Delete</button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default ExpenseList;
  