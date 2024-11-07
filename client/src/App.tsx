import React from 'react';
import './App.css';

interface Todo {
  id: number;
  title: string;
}

function App() {
  const [data, setData] = React.useState<Todo[] | null>(null);
  const [newTodo, setNewTodo] = React.useState("");


  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.todos));
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      });
      
      const data = await response.json();
      // Optionally refresh the todos list or update state
      setNewTodo(""); // Clear input after submission
      setData(data.todos);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div className="h-screen bg-slate-700 text-white mx-auto flex flex-col items-center space-y-4">
      <div className="">
        {!data ? "Loading..." : (
        <ul>
          {data.map((todo: any) => (
            <li key={todo.id}>
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => {
                fetch(`/todos/${todo.id}/${todo.completedAt ? 'uncompletions' : 'completions'}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ todoId: todo.id })
                })
                .then(res => res.json())
                .then(() => {
                  // Optionally refresh todos list
                  fetch("/api")
                    .then((res) => res.json())
                    .then((data) => setData(data.todos));
                });
              }}
              checked={!!todo.completedAt}
            />
            {todo.title}
          </li>          ))}
        </ul>
      )}
      </div>

      <div>
        <div>
          <input
            type="text"
            className="text-black px-2 py-1 rounded-md focus:outline-none"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
          />
          <button onClick={handleSubmit} className="ml-2 bg-blue-300 text-black font-bold px-2 py-1 rounded-md"
          >Add Todo</button>
        </div>
      </div>
    </div>
  );
  
}

export default App;
