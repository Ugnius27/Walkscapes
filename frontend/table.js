document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('api/people');
    const data = await response.json();

    const table = document.querySelector('#peopleTable');
    table.innerHTML = `
        <tr>
        <th>ID</th>
        <th>Vardas</th>
        <th>Amžius</th>
        </tr>`;

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.age}</td>`;
        table.appendChild(tr);
    })
})