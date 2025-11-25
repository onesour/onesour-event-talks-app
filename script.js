document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('category-search');
    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            displayTalks(talks);
        });

    function displayTalks(talksToDisplay) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date('2025-11-25T10:00:00');

        talksToDisplay.forEach((talk, index) => {
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk');

            const startTime = new Date(currentTime);
            const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

            talkElement.innerHTML = `
                <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                <h2>${talk.title}</h2>
                <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                <p>${talk.description}</p>
                <div class="category">
                    ${talk.category.map(cat => `<span>${cat}</span>`).join(' ')}
                </div>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchElement = document.createElement('div');
                lunchElement.classList.add('talk');
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
                lunchElement.innerHTML = `<div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div><h2>Lunch Break</h2>`;
                scheduleContainer.appendChild(lunchElement);
                currentTime = lunchEndTime;
            }
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk => {
            return talk.category.some(cat => cat.toLowerCase().includes(searchTerm));
        });
        displayTalks(filteredTalks);
    });
});

