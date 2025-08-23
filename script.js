//use the adeventlistener to use content from the html or add into it using tags ID's
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskContainer = document.getElementById('taskContainer');

    const priorityColors = {
        low: '#4CAF50',
        medium: '#FFC107',
        high: '#F44336'
    };

    taskForm.addEventListener('submit', e => {
        e.preventDefault();

        const taskName = document.getElementById('name').value.trim();
        const priority = document.getElementById('taskpriority').value;

        if (!taskName) return; // no empty task

        const taskElement = document.createElement('div');
        taskElement.className = `task-item priority-${priority}`;
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${Date.now()}">
            <label>${taskName}</label>
            <span class="priority-badge" style="background-color: ${priorityColors[priority]}"></span>
            <button class="delete-btn">×</button>
        `;

        taskContainer.appendChild(taskElement);

        // manage delete button within the addeventlistener separately
        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            taskElement.remove();
        });

        taskForm.reset();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const datetimePicker = document.getElementById('datetimepicker');

    // Set the current date and time as the default value
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
    datetimePicker.value = formattedDate;

    // Optional: Add an event listener to log the selected date and time
    datetimePicker.addEventListener('change', () => {
       return('Selected date and time:', datetimePicker.value);
    });
})