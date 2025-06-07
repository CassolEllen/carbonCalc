// cria o banco local usando PouchDB
const db = new PouchDB('carbon_footprint');

// salva os dados no banco com um ID baseado na data atual
function saveData(formData) {
    return db.put({
        _id: new Date().toISOString(), // Ex: "2025-06-02T15:30:00.000Z"
        // fonte: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
        formData: formData
    });
}

// mostra os dados salvos numa tabela 
function displaySavedData() {
    db.allDocs({ include_docs: true, descending: true }) // pega tudo, do mais recente pro mais antigo
        .then(function (result) {
            const savedDataDiv = document.getElementById('savedData');
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';

            // cria a tabela
            const table = document.createElement('table');
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200');

            // cabeçalho da tabela
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // colunas
            const header1 = document.createElement('th');
            header1.textContent = 'Data';
            const header2 = document.createElement('th');
            header2.textContent = 'Combustível (litros)';
            const header3 = document.createElement('th');
            header3.textContent = 'Tipo de Combustível';
            const header4 = document.createElement('th');
            header4.textContent = 'Distância Percorrida (km)';

            // junta os cabeçalhos
            headerRow.appendChild(header1);
            headerRow.appendChild(header2);
            headerRow.appendChild(header3);
            headerRow.appendChild(header4);
            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            // corpo da tabela (com os dados de cada registro)
            const tableBody = document.createElement('tbody');

            result.rows.forEach(function (row) {
                const doc = row.doc;
                const dataRow = document.createElement('tr');

                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(doc._id).toLocaleString(); // mostra a data no formato local
                // fonte: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString


                const formData = doc.formData;

                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel;

                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType;

                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance;

                // junta as células na linha
                dataRow.appendChild(dateCell);
                dataRow.appendChild(fuelCell);
                dataRow.appendChild(fuelTypeCell);
                dataRow.appendChild(distanceCell);

                // adiciona a linha na tabela
                tableBody.appendChild(dataRow);
            });

            table.appendChild(tableBody);
            savedDataDiv.appendChild(table);
        }).catch(function (err) {
            console.log(err); // se der erro, mostra no console
        });
}

// quando o formulário for enviado, salva os dados e já mostra na tela
document.getElementById('carbonForm').addEventListener('submit', function (event) {
    event.preventDefault(); // impede o reload da página

    // pega os dados preenchidos
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value), 
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
        // fonte: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/parseFloat (a mesma para os 3 trechos, fuel, fueltype e distance)
    };

    // salva e já mostra os dados atualizados
    saveData(formData).then(function () {
        displaySavedData();
    }).catch(function (err) {
        console.log(err);
    });
});

// botão separado só pra salvar (sem mostrar os dados na tela)
document.getElementById('saveDataBtn').addEventListener('click', function () {
    const formData = {
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };

    saveData(formData).then(function () {
        alert('Dados salvos com sucesso!');
    }).catch(function (err) {
        console.log(err);
    });
});

// botão que carrega os dados salvos e mostra tudo em tabela
document.getElementById('loadTableBtn').addEventListener('click', function () {
    displaySavedData();
});
