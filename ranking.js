async function fetchRanking() {
    try {
        const response = await fetch('http://localhost:8000/weekly_ranking');
        const data = await response.json();
        const table = document.getElementById('rankingTable');
        for (let i = 0; i < data.length && i < 5; i++) {
            const row = table.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            cell1.innerHTML = i + 1;
            cell2.innerHTML = data[i].user_id;
            cell3.innerHTML = data[i].score;
        }
    } catch (error) {
        console.error('Error fetching ranking:', error);
    }
}
