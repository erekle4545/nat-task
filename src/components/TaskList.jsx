import TaskItem from './TaskItem'

function TaskList({ tasks, onDelete, onToggle }) {
  if (tasks.length === 0) {
    return <p className="empty">There are no tasks yet</p>
  }

  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  )
}

export default TaskList
