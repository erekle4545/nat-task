import { useState } from 'react'

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    // simple validation
    if (title.trim() === '') {
      setError('Write the task name')
      return
    }
    if (title.trim().length < 3) {
      setError('Task name is too short')
      return
    }

    onAdd(title.trim(), priority)
    setTitle('')
    setPriority('medium')
    setError('')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New task"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <select value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default TaskForm
