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
    <div className="App">
      <header className="App-header">
        {!data ? "Loading..." : (
        <ul>
          {data.map((todo: any) => (
            <li key={todo.id}>
            <input
              type="checkbox"
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
      </header>

      <div>
        <div>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
          />
          <button onClick={handleSubmit}>Add Todo</button>
        </div>
      </div>
    </div>
  );
  
}

export default App;
