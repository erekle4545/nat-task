function TaskItem({ task, onDelete, onToggle }) {
  // show date with the Date object
  const date = new Date(task.date).toLocaleDateString()

  return (
    <li className={task.done ? 'task done' : 'task'}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      <div className="info">
        <span className="title">{task.title}</span>
        <span className="meta">
          {task.priority} | {date}
        </span>
      </div>
      <button className="delete" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  )
}

export default TaskItem
