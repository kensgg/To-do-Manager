// Formulario
const ToDoFormulario = document.getElementById('todo-form');
const taskNameInput = document.getElementById('task-name');
const taskDescInput = document.getElementById('task-description');
const taskCategoryInput = document.getElementById('task-category');

// Listas de tareas
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

// Timer
const timerDisplay = document.getElementById('timer-display');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Saludo
const greetingElement = document.getElementById('greeting');

// Iniciar App
let tasks = {
    todo: [],
    completed: []
};

// Estado del timer
let timerState = {
    minutes: 20,
    seconds: 0,
    isRunning: false,
    interval: null
};

function init() {
    updateGreeting();
    renderAllTasks();
    attachEventListeners();
}

// Saludo
function updateGreeting() {
    const hour = new Date().getHours();
    let timeOfDay = '';
    
    if (hour >= 5 && hour < 12) {
        timeOfDay = 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'Good Afternoon';
    } else {
        timeOfDay = 'Good Evening';
    }
    
    greetingElement.textContent = `${timeOfDay} Gerardo`;
}

// Acciones en Tareas
// Agregar nueva tarea
function handleAddTask(e) {
    e.preventDefault();
    
    // Validar campos
    const taskName = taskNameInput.value.trim();
    const taskDescription = taskDescInput.value.trim();
    const taskCategory = taskCategoryInput.value;
    
    //  nombre de tarea
    if (taskName === '') {
        alert('Enter Task Name');
        taskNameInput.focus();
        return;
    }
    
    // categoría
    if (taskCategory === '') {
        alert('Select Task Category');
        taskCategoryInput.focus();
        return;
    }
    
    // Crear objeto tarea
    const newTask = {
        id: Date.now(),
        name: taskName,
        description: taskDescription || '',
        category: taskCategory,
        createdAt: new Date().toISOString()
    };
    
    // Agregar a la lista de tareas 
    tasks.todo.push(newTask);
    
    ToDoFormulario.reset();
    
    // Renderizar
    renderAllTasks();
}

// Marcar tarea como completada
function completeTask(id) {
    const taskIndex = tasks.todo.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
        const task = tasks.todo[taskIndex];
        
        // Mover de todo a completed
        tasks.todo.splice(taskIndex, 1);
        tasks.completed.push(task);
        
        // Renderizar
        renderAllTasks();
    }
}

// Eliminar tarea de todo
function deleteTaskFromTodo(id) {
    tasks.todo = tasks.todo.filter(t => t.id !== id);
    renderAllTasks();
}

// Eliminar tarea de completed
function deleteTaskFromCompleted(id) {
    tasks.completed = tasks.completed.filter(t => t.id !== id);
    renderAllTasks();
}

// Mover tarea de completed a todo 
function recheckTask(id) {
    const taskIndex = tasks.completed.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
        const task = tasks.completed[taskIndex];
        tasks.completed.splice(taskIndex, 1);
        tasks.todo.push(task);
        
        // Renderizar
        renderAllTasks();
    }
}

// Renderizar todas las tareas
function renderAllTasks() {
    renderTodoTasks();
    renderCompletedTasks();
}

// Renderizar tareas pendientes
function renderTodoTasks() {
    todoList.innerHTML = '';
    
    tasks.todo.forEach(task => {
        const taskCard = createTaskCard(task, 'todo');
        todoList.appendChild(taskCard);
    });
}

// Renderizar tareas completadas
function renderCompletedTasks() {
    completedList.innerHTML = '';
    
    tasks.completed.forEach(task => {
        const taskCard = createTaskCard(task, 'completed');
        completedList.appendChild(taskCard);
    });
}

//  Tarjeta de tarea
function createTaskCard(task, type) {
    const card = document.createElement('div');
    card.className = `task-card ${type === 'completed' ? 'completed' : ''}`;
    
    // Header  nombre y categoría
    const header = document.createElement('div');
    header.className = 'task-header';
    
    const name = document.createElement('div');
    name.className = 'task-name';
    name.textContent = task.name;
    
    const category = document.createElement('div');
    category.className = 'task-category';
    category.textContent = task.category;
    
    header.appendChild(name);
    header.appendChild(category);
    
    // Descripción Verificar que exista
    let description = null;
    if (task.description) {
        description = document.createElement('div');
        description.className = 'task-description';
        description.textContent = task.description;
    }
    
    // Acciones
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    if (type === 'todo') {
        // Check btn
        const completeBtn = document.createElement('button');
        completeBtn.className = 'task-btn';
        completeBtn.innerHTML = '<img src="images/check.png" alt="Complete" class="task-icon">';
        completeBtn.setAttribute('aria-label', 'Marcar como completada');
        completeBtn.addEventListener('click', () => completeTask(task.id));
        
        // Trash btn
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn';
        deleteBtn.innerHTML = '<img src="images/trash.png" alt="Delete" class="task-icon">';
        deleteBtn.setAttribute('aria-label', 'Eliminar tarea');
        deleteBtn.addEventListener('click', () => deleteTaskFromTodo(task.id));
        
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
    } else {
        // Recheck btn
        const recheckBtn = document.createElement('button');
        recheckBtn.className = 'task-btn';
        recheckBtn.innerHTML = '<img src="images/recheck.png" alt="Recheck" class="task-icon">';
        recheckBtn.setAttribute('aria-label', 'Mover a pendientes');
        recheckBtn.addEventListener('click', () => recheckTask(task.id));
        
        // Trash btn
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn';
        deleteBtn.innerHTML = '<img src="images/trash.png" alt="Delete" class="task-icon">';
        deleteBtn.setAttribute('aria-label', 'Eliminar tarea completada');
        deleteBtn.addEventListener('click', () => deleteTaskFromCompleted(task.id));
        
        actions.appendChild(recheckBtn);
        actions.appendChild(deleteBtn);
    }
    
    // Tarjeta
    card.appendChild(header);
    if (description) {
        card.appendChild(description);
    }
    card.appendChild(actions);
    
    return card;
}

// Timer
function updateTimerDisplay() {
    const minutes = String(timerState.minutes).padStart(2, '0');
    const seconds = String(timerState.seconds).padStart(2, '0');
    timerDisplay.textContent = `00:${minutes}:${seconds}`;
}

function startTimer() {
    if (timerState.isRunning) return;
    
    timerState.isRunning = true;
    updateTimerButtonStates('play');
    timerState.interval = setInterval(() => {
        if (timerState.seconds === 0) {
            if (timerState.minutes === 0) {
                stopTimer();
                resetTimer();
                return;
            }
            timerState.minutes--;
            timerState.seconds = 59;
        } else {
            timerState.seconds--;
        }
        
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    if (!timerState.isRunning) return;
    
    timerState.isRunning = false;
    clearInterval(timerState.interval);
    updateTimerButtonStates('pause');
}

function stopTimer() {
    timerState.isRunning = false;
    clearInterval(timerState.interval);
}

function resetTimer() {
    stopTimer();
    timerState.minutes = 20;
    timerState.seconds = 0;
    updateTimerDisplay();
    updateTimerButtonStates('reset');
}

function updateTimerButtonStates(activeButton) {
    playBtn.style.opacity = '0.3';
    pauseBtn.style.opacity = '0.3';
    resetBtn.style.opacity = '0.3';
    
    if (activeButton === 'play') {
        playBtn.style.opacity = '1';
    } else if (activeButton === 'pause') {
        pauseBtn.style.opacity = '1';
    } else if (activeButton === 'reset') {
        resetBtn.style.opacity = '1';
    }
}

function attachEventListeners() {
    // Formulario
    ToDoFormulario.addEventListener('submit', handleAddTask);
    // Timer
    playBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Actualizar saludo 
setInterval(updateGreeting, 60000);