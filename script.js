const STORAGE_KEY = 'tasks'
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5'

// elements from the page
const form = document.getElementById('taskForm')
const taskInput = document.getElementById('taskInput')
const prioritySelect = document.getElementById('prioritySelect')
const formError = document.getElementById('formError')
const messageText = document.getElementById('message')
const apiError = document.getElementById('apiError')
const loadBtn = document.getElementById('loadBtn')
const clearBtn = document.getElementById('clearBtn')
const filterButtons = document.querySelectorAll('.filter-btn')
const sortSelect = document.getElementById('sortSelect')
const statsText = document.getElementById('stats')
const taskList = document.getElementById('taskList')
const emptyText = document.getElementById('emptyText')
const clock = document.getElementById('clock')

let tasks = loadTasks()
let filter = 'all'
let sort = 'new'
let messageTimer = null

// read saved tasks from localStorage
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) {
      return saved
    }
  } catch (err) {
    console.log('Saved tasks are broken, starting with empty list')
  }
  return []
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

// message is hidden after 2 seconds
function showMessage(text) {
  messageText.textContent = text
  clearTimeout(messageTimer)
  messageTimer = setTimeout(function () {
    messageText.textContent = ''
  }, 2000)
}

// clock with setInterval
function updateClock() {
  clock.textContent = new Date().toLocaleTimeString()
}

function addTask(title, priority) {
  const newTask = {
    id: Date.now(),
    title: title,
    priority: priority,
    done: false,
    date: new Date().toISOString()
  }
  tasks.unshift(newTask)
  saveTasks()
  render()
  showMessage('Task added')
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id
  })
  saveTasks()
  render()
  showMessage('Task deleted')
}

function toggleTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done
    }
  }
  saveTasks()
  render()
}

function clearAll() {
  tasks = []
  saveTasks()
  render()
  showMessage('List is empty')
}

// get tasks from the server
async function loadFromApi() {
  loadBtn.disabled = true
  loadBtn.textContent = 'Loading...'
  apiError.textContent = ''

  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Server error: ' + response.status)
    }
    const data = await response.json()

    const apiTasks = data.map(function (item) {
      return {
        id: item.id + Date.now(),
        title: item.title,
        priority: 'low',
        done: item.completed,
        date: new Date().toISOString()
      }
    })

    tasks = apiTasks.concat(tasks)
    saveTasks()
    render()
    showMessage('Tasks loaded from API')
  } catch (err) {
    apiError.textContent = 'Could not load tasks. ' + err.message
  } finally {
    loadBtn.disabled = false
    loadBtn.textContent = 'Load from API'
  }
}

// filter and sort before showing
function getVisibleTasks() {
  let result = tasks.filter(function (task) {
    if (filter === 'done') return task.done
    if (filter === 'active') return !task.done
    return true
  })

  result.sort(function (a, b) {
    if (sort === 'old') return new Date(a.date) - new Date(b.date)
    if (sort === 'title') return a.title.localeCompare(b.title)
    return new Date(b.date) - new Date(a.date)
  })

  return result
}

function createTaskElement(task) {
  const li = document.createElement('li')
  li.className = task.done ? 'task done' : 'task'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = task.done
  checkbox.addEventListener('change', function () {
    toggleTask(task.id)
  })

  const info = document.createElement('div')
  info.className = 'info'

  const title = document.createElement('span')
  title.className = 'title'
  title.textContent = task.title

  // show date with the Date object
  const meta = document.createElement('span')
  meta.className = 'meta'
  meta.textContent = task.priority + ' | ' + new Date(task.date).toLocaleDateString()

  info.appendChild(title)
  info.appendChild(meta)

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete'
  deleteBtn.textContent = 'Delete'
  deleteBtn.addEventListener('click', function () {
    deleteTask(task.id)
  })

  li.appendChild(checkbox)
  li.appendChild(info)
  li.appendChild(deleteBtn)
  return li
}

function render() {
  const visibleTasks = getVisibleTasks()
  taskList.innerHTML = ''

  visibleTasks.forEach(function (task) {
    taskList.appendChild(createTaskElement(task))
  })

  if (visibleTasks.length === 0) {
    emptyText.style.display = 'block'
  } else {
    emptyText.style.display = 'none'
  }

  let doneCount = 0
  tasks.forEach(function (task) {
    if (task.done) doneCount++
  })
  statsText.textContent =
    'All: ' + tasks.length + ' | Done: ' + doneCount + ' | Active: ' + (tasks.length - doneCount)
}

// events
form.addEventListener('submit', function (event) {
  event.preventDefault()
  const title = taskInput.value.trim()

  // simple validation
  if (title === '') {
    formError.textContent = 'Write the task name'
    return
  }
  if (title.length < 3) {
    formError.textContent = 'Task name is too short'
    return
  }

  addTask(title, prioritySelect.value)
  taskInput.value = ''
  prioritySelect.value = 'medium'
  formError.textContent = ''
})

loadBtn.addEventListener('click', loadFromApi)
clearBtn.addEventListener('click', clearAll)

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    filter = button.dataset.filter
    filterButtons.forEach(function (btn) {
      btn.classList.remove('active')
    })
    button.classList.add('active')
    render()
  })
})

sortSelect.addEventListener('change', function () {
  sort = sortSelect.value
  render()
})

updateClock()
setInterval(updateClock, 1000)
render()
