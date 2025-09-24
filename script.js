class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
        
        // Initialize UI elements
        this.calendar = document.getElementById('calendar');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.modal = document.getElementById('taskModal');
        this.modalDate = document.getElementById('modalDate');
        this.modalTasks = document.getElementById('modalTasks');
        
        // Set up event listeners
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
        document.querySelector('.close').addEventListener('click', () => this.closeModal());

        // Set calendar to English
        this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Render weekdays
        const weekdaysContainer = document.getElementById('weekdays');
        weekdaysContainer.innerHTML = this.weekDays.map(day => `<div>${day}</div>`).join('');

        // Initial render
        this.render();
    }
    
    render() {
        this.currentMonthElement.textContent = this.currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        this.calendar.innerHTML = '';
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        // Add days from previous month
        const firstDayWeekday = firstDay.getDay();
        const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
        
        for (let i = firstDayWeekday - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dayElement = this.createDayElement(day, true);
            this.calendar.appendChild(dayElement);
        }
        
        // Add days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = this.createDayElement(day, false);
            this.calendar.appendChild(dayElement);
        }
        
        // Add days from next month
        const remainingDays = 42 - this.calendar.children.length; // 6 rows * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = this.createDayElement(day, true);
            this.calendar.appendChild(dayElement);
        }
    }
    
    createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day' + (isOtherMonth ? ' other-month' : '');
        dayElement.textContent = day;
        
        if (!isOtherMonth) {
            const dateKey = this.getDateKey(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day));
            if (this.tasks[dateKey] && this.tasks[dateKey].length > 0) {
                dayElement.classList.add('has-tasks');
            }
            
            dayElement.addEventListener('click', () => this.showTasks(day));
        }
        
        return dayElement;
    }
    
    changeMonth(delta) {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
        this.render();
    }
    
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }
    alert
    showTasks(day) {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const dateKey = this.getDateKey(date);
        this.modalDate.textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.currentDateKey = dateKey;
        
        const tasks = this.tasks[dateKey] || [];
        this.modalTasks.innerHTML = tasks.map((task, index) => {
            const taskId = `task-${dateKey}-${index}`;
            return `
                <div class="task-item priority-${task.priority}" data-index="${index}">
                    <div class="task-content">
                        <input type="checkbox" id="${taskId}" 
                               ${task.completed ? 'checked' : ''}>
                        <label for="${taskId}">${task.name}</label>
                        <span class="priority-badge" style="background-color: ${priorityColors[task.priority]}"></span>
                    </div>
                    <button class="delete-btn calendar-delete" 
                            style="display: ${task.completed ? 'block' : 'none'}">×</button>
                </div>
            `;
        }).join('');

        // Add event listeners after creating the tasks
        const taskItems = this.modalTasks.querySelectorAll('.task-item');
        taskItems.forEach((taskItem, index) => {
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            checkbox.addEventListener('change', (e) => {
                this.toggleTaskComplete(index, e.target.checked);
            });

            deleteBtn.addEventListener('click', () => {
                this.deleteTask(index);
            });
        });
        
        this.modal.style.display = 'block';
    }

    toggleTaskComplete(taskIndex, completed) {
        if (!this.currentDateKey || !this.tasks[this.currentDateKey]) return;
        
        const task = this.tasks[this.currentDateKey][taskIndex];
        if (task) {
            task.completed = completed;
            localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
            
            // Show/hide delete button based on completion status
            const taskElement = this.modalTasks.querySelector(`[data-index="${taskIndex}"]`);
            if (taskElement) {
                const deleteBtn = taskElement.querySelector('.delete-btn');
                deleteBtn.style.display = completed ? 'block' : 'none';
            }
        }
    }

    deleteTask(taskIndex) {
        if (!this.currentDateKey || !this.tasks[this.currentDateKey]) return;
        
        // Remove the task
        this.tasks[this.currentDateKey].splice(taskIndex, 1);
        
        // If no tasks left for this date, remove the date entry
        if (this.tasks[this.currentDateKey].length === 0) {
            delete this.tasks[this.currentDateKey];
        }
        
        // Update localStorage and re-render
        localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
        this.render();
        
        // Re-render the modal with updated tasks
        const day = parseInt(this.currentDateKey.split('-')[2]);
        this.showTasks(day);
    }
    
    closeModal() {
        this.modal.style.display = 'none';
    }
    
    addTasks(tasks) {
        const dateKey = document.getElementById('datetimepicker').value;
        if (!this.tasks[dateKey]) {
            this.tasks[dateKey] = [];
        }
        
        const taskElements = document.querySelectorAll('#taskContainer .task-item');
        taskElements.forEach(element => {
            const taskName = element.querySelector('label').textContent;
            const priority = element.className.split(' ')[1].replace('priority-', '');
            this.tasks[dateKey].push({
                name: taskName,
                priority: priority,
                completed: element.querySelector('input[type="checkbox"]').checked
            });
        });
        
        localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
        this.render();
        return dateKey;
    }
}

const priorityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336'
};

// Make calendar instance global
let calendar;

document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar(); // Assign to window object to make it global
    calendar = window.calendar;
    const taskForm = document.getElementById('taskForm');
    const taskContainer = document.getElementById('taskContainer');
    const addToCalendarBtn = document.getElementById('addCalendar');
    const datetimePicker = document.getElementById('datetimepicker');

    // Set current date as default
    const now = new Date();
    datetimePicker.value = now.toISOString().split('T')[0];

    taskForm.addEventListener('submit', e => {
        e.preventDefault();

        const taskName = document.getElementById('name').value.trim();
        const priority = document.getElementById('taskpriority').value;

        if (!taskName) return;

        const taskElement = document.createElement('div');
        taskElement.className = `task-item priority-${priority}`;
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${Date.now()}">
            <label>${taskName}</label>
            <span class="priority-badge" style="background-color: ${priorityColors[priority]}"></span>
            <button class="delete-btn">×</button>
        `;

        taskContainer.appendChild(taskElement);

        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            taskElement.remove();
        });

        taskForm.reset();
    });

    addToCalendarBtn.addEventListener('click', () => {
        const dateKey = calendar.addTasks();
        taskContainer.innerHTML = '';
    });

    window.onclick = e => {
        if (e.target === document.getElementById('taskModal')) {
            calendar.closeModal();
        }
    };
});
