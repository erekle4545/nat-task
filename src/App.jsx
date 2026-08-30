import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import Filters from './components/Filters'
import TaskList from './components/TaskList'
import './App.css'

const STORAGE_KEY = 'tasks'
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5'

function App() {
  // read saved tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('new')
  const [message, setMessage] = useState('')
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // save tasks every time the array changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // clock with setInterval
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // message is hidden after 2 seconds
  useEffect(() => {
    if (message === '') return
    const timer = setTimeout(() => setMessage(''), 2000)
    return () => clearTimeout(timer)
  }, [message])

  function addTask(title, priority) {
    const newTask = {
      id: Date.now(),
      title: title,
      priority: priority,
      done: false,
      date: new Date().toISOString()
    }
    setTasks([newTask, ...tasks])
    setMessage('Task added')
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
    setMessage('Task deleted')
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, done: !task.done }
        }
        return task
      })
    )
  }

  function clearAll() {
    setTasks([])
    setMessage('List is empty')
  }

  // get tasks from the server
  async function loadFromApi() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Server error: ' + response.status)
      }
      const data = await response.json()
      const apiTasks = data.map((item) => ({
        id: item.id + Date.now(),
        title: item.title,
        priority: 'low',
        done: item.completed,
        date: new Date().toISOString()
      }))
      setTasks([...apiTasks, ...tasks])
      setMessage('Tasks loaded from API')
    } catch (err) {
      setError('Could not load tasks. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // filter and sort before render
  let visibleTasks = tasks.filter((task) => {
    if (filter === 'done') return task.done
    if (filter === 'active') return !task.done
    return true
  })

  visibleTasks = [...visibleTasks].sort((a, b) => {
    if (sort === 'old') return new Date(a.date) - new Date(b.date)
    if (sort === 'title') return a.title.localeCompare(b.title)
    return new Date(b.date) - new Date(a.date)
  })

  const doneCount = tasks.filter((task) => task.done).length

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
        <p className="clock">{time}</p>
      </header>

      <TaskForm onAdd={addTask} />

      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="api-box">
        <button onClick={loadFromApi} disabled={loading}>
          {loading ? 'Loading...' : 'Load from API'}
        </button>
        <button className="clear" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <Filters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      <p className="stats">
        All: {tasks.length} | Done: {doneCount} | Active: {tasks.length - doneCount}
      </p>

      <TaskList tasks={visibleTasks} onDelete={deleteTask} onToggle={toggleTask} />
    </div>
  )
}

export default App
