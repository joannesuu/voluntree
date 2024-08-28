function generateBirthdaySelection() {
    //function to populate birthday options
    const day = document.getElementById('day');

    for (let i = 1; i <= 31; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
       day.appendChild(option);
    }


    const month = document.getElementById('month');
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        month.appendChild(option);
    }

    const year = document.getElementById('year');
    const currYear = new Date().getFullYear();
    for (let i = currYear; i >= 1950; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        year.appendChild(option);
    }
}
window.addEventListener('load', generateBirthdaySelection);
window.generateBirthdaySelection = generateBirthdaySelection;