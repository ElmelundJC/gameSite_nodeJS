
async function getLeaderboard() {
    const tableBody = document.querySelector('.content-table tbody');


    await fetch('/api/users/scoreboard', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then( response => {
        return response.json();
    })
    .then(data => {
        // console.log(data.data);       
        
        for (const name in data.data.users) {
            if (Object.hasOwnProperty.call(data.data.users, name)) {
                const element = data.data.users[name];
                
                
                const rowElement = document.createElement('tr');
                const cellNameElement = document.createElement('td');
                const cellScoreElement = document.createElement('td');
                const cellMaxScoreElement = document.createElement('td');


                cellNameElement.textContent = element.name;
                cellScoreElement.textContent = element.currentScore;
                cellMaxScoreElement.textContent = element.maxScore;

                rowElement.appendChild(cellNameElement);
                rowElement.appendChild(cellScoreElement);
                rowElement.appendChild(cellMaxScoreElement);

                tableBody.appendChild(rowElement);
            }

        }

    })
    .catch((error) => {
        console.log('Error: ', error);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    getLeaderboard();
});
