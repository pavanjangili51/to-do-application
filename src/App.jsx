import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Learn React basics", completed: false },
  { id: 2, title: "Build my first application", completed: true },
];

function getSavedTasks() {
  try {
    const saved = localStorage.getItem("todo-app-tasks");
    const parsed = saved ? JSON.parse(saved) : initialTasks;
    return Array.isArray(parsed)
      ? parsed.filter(
          (task) =>
            task &&
            (typeof task.id === "string" || typeof task.id === "number") &&
            typeof task.title === "string" &&
            typeof task.completed === "boolean",
        )
      : initialTasks;
  } catch {
    return initialTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(getSavedTasks);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    localStorage.setItem("todo-app-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const title = input.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, completed: false },
    ]);
    setInput("");
    setAnnouncement(`Added task: ${title}`);
  }

  function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
    setAnnouncement(
      task.completed
        ? `Marked ${task.title} as not completed`
        : `Completed ${task.title}`,
    );
  }

  function deleteTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setTasks((current) => current.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
    setAnnouncement(`Deleted task: ${task.title}`);
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditInput(task.title);
  }

  function saveEdit(event, id) {
    event.preventDefault();
    const title = editInput.trim();
    if (!title) return;

    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, title } : task)),
    );
    setEditingId(null);
    setAnnouncement("Task updated");
  }

  function clearCompleted() {
    const completedCount = tasks.filter((task) => task.completed).length;
    if (completedCount === 0) return;

    setTasks((current) => current.filter((task) => !task.completed));
    setAnnouncement(
      `Cleared ${completedCount} completed ${
        completedCount === 1 ? "task" : "tasks"
      }`,
    );
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(today);
  const dateTime = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#main" aria-label="Tasker home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m6.5 12.5 3.6 3.6 7.6-8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>Tasker</strong>
            <small>THE PLANNER</small>
          </span>
        </a>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>
          <div className="sidebar-link" aria-current="page">
            <span className="sidebar-link-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="15"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 3.8v3M16 3.8v3M4.5 9.5h15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>My day</span>
            <span className="sidebar-count">{tasks.length}</span>
          </div>
        </div>

        <div className="sidebar-bottom">
          <span className="sidebar-sparkle" aria-hidden="true">
            ✦
          </span>
          <p>Make room for what matters.</p>
          <span>One step at a time.</span>
        </div>
      </aside>

      <main className="main-content" id="main">
        <header className="topbar">
          <div className="date-label">
            <span className="date-dot" aria-hidden="true" />
            <time dateTime={dateTime}>{formattedDate}</time>
          </div>
          <div className="profile-mark" aria-label="Your planner">
            D
          </div>
        </header>

        <section className="welcome-section" aria-labelledby="page-title">
          <div className="welcome-copy">
            <p className="eyebrow">YOUR PERSONAL SPACE</p>
            <h1 id="page-title">
              Make today count<span>.</span>
            </h1>
            <p className="welcome-note">
              A clear mind starts with a clear plan. You&apos;ve got this.
            </p>
          </div>
          <div
            className="progress-card"
            role="progressbar"
            aria-label="Daily task progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <div className="progress-heading">
              <span>DAILY PROGRESS</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              {remainingCount === 0 && tasks.length > 0
                ? "Everything is done. Nice work!"
                : `${remainingCount} ${
                    remainingCount === 1 ? "task" : "tasks"
                  } left to go`}
            </p>
          </div>
        </section>

        <section className="todo-card" aria-labelledby="tasks-heading">
          <div className="card-heading">
            <div>
              <p className="eyebrow">YOUR CHECKLIST</p>
              <h2 id="tasks-heading">Today&apos;s tasks</h2>
            </div>
            <span className="task-total">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <span className="input-plus" aria-hidden="true">
              +
            </span>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Add a task to your day..."
              aria-label="New task"
              maxLength={200}
            />
            <button type="submit" className="add-button" disabled={!input.trim()}>
              Add task
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="list-toolbar">
            <p className="list-caption">
              {remainingCount === 0 && tasks.length > 0
                ? "All caught up"
                : "Keep your momentum"}
            </p>
            <nav className="filters" aria-label="Filter tasks">
              {["all", "active", "completed"].map((name) => {
                const count =
                  name === "all"
                    ? tasks.length
                    : name === "active"
                      ? remainingCount
                      : completedCount;
                return (
                  <button
                    key={name}
                    type="button"
                    className={filter === name ? "filter active-filter" : "filter"}
                    onClick={() => setFilter(name)}
                    aria-pressed={filter === name}
                  >
                    {name[0].toUpperCase() + name.slice(1)}
                    <span>{count}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li
                key={task.id}
                className={task.completed ? "task done" : "task"}
              >
                {editingId === task.id ? (
                  <form
                    className="edit-form"
                    onSubmit={(event) => saveEdit(event, task.id)}
                  >
                    <input
                      type="text"
                      value={editInput}
                      onChange={(event) => setEditInput(event.target.value)}
                      aria-label={`Edit ${task.title}`}
                      maxLength={200}
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button type="submit" disabled={!editInput.trim()}>
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-edit"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <label className="task-label">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="custom-checkbox" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none">
                          <path
                            d="m3.5 8 3 3 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="task-title">{task.title}</span>
                    </label>
                    <div className="task-actions">
                      <button
                        className="edit-button"
                        type="button"
                        onClick={() => startEditing(task)}
                        aria-label={`Edit ${task.title}`}
                        title="Edit task"
                      >
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path
                            d="m12.8 4.2 3 3m-9.9 9.1-3.1.7.7-3.1 8.7-8.7a2.1 2.1 0 0 1 3 3l-8.6 8.8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        title="Delete task"
                      >
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path
                            d="M5 6h10m-8.5 0 .6 9h5.8l.6-9M8 6V4.5h4V6m-3 2.5v4m2-4v4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {visibleTasks.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                {tasks.length === 0 ? "✦" : "✓"}
              </span>
              <h3>
                {tasks.length === 0
                  ? "A fresh start"
                  : "Nothing to see here"}
              </h3>
              <p>
                {tasks.length === 0
                  ? "Add your first task and make today yours."
                  : "There are no tasks in this view just yet."}
              </p>
            </div>
          )}

          <footer className="card-footer">
            <span>
              <span className="footer-check" aria-hidden="true">
                ✓
              </span>
              {completedCount} of {tasks.length} completed
            </span>
            <button
              type="button"
              onClick={clearCompleted}
              disabled={completedCount === 0}
            >
              Clear completed
            </button>
          </footer>
        </section>

        <p className="bottom-note">
          Small steps every day lead to big results.
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </main>
    </div>
  );
}

export default App;
