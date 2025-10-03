async function loadDB() {
    const SQL = await initSqlJs({
        locateFile: file => `js/${file}`
    });
    const dbUrl = chrome.runtime.getURL('db/dados_operacoes.sqlite');
    const response = await fetch(dbUrl);
    const dbArrayBuffer = await response.arrayBuffer();
    
    // CORREÇÃO APLICADA AQUI:
    return new SQL.Database(new Uint8Array(dbArrayBuffer));
}

async function populateOperations() {
    const selectElement = document.getElementById('operacaoSelect');

    try {
        const db = await loadDB();
        const result = db.exec("SELECT id, nome_operacao FROM operacoes ORDER BY nome_operacao");

        if (result.length > 0 && result[0].values.length > 0) {
            const operations = result[0].values;
            const numeroDeOperacoes = operations.length;

            //selectElement.size = numeroDeOperacoes;
            selectElement.innerHTML = '';
            
            
            operations.forEach(op => {

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'op_'+op[0];
                checkbox.value = op[0];
                checkbox.name = 'operacoesSelecionadas'

                const label = document.createElement('label');
                label.htmlFor = 'op_'+op[0];
                label.textContent = op[1];
                

                selectElement.appendChild(checkbox);
                selectElement.appendChild(label);   
                selectElement.appendChild(document.createElement('br'));             
                });
            
            /*
            operations.forEach(op => {
                const option = document.createElement('option');
                option.value = op[0];
                option.textContent = op[1];
                selectElement.appendChild(option);
            });*/
            
        } else {
            selectElement.innerHTML = '<p>Nenhuma operação encontrada</p>';
        }
        
        db.close();
    } catch (error) {
        console.error("Erro ao carregar operações:", error);
        selectElement.innerHTML = '<p>Erro ao carregar</p>';
    }
}

document.getElementById('setupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const operacoesSelecionadas = Array.from(allCheckboxes)
                                       .filter(checkbox => checkbox.checked)
                                       .map(checkbox => checkbox.value);

    if (operacoesSelecionadas.length > 0) {
        chrome.storage.local.set({ operacoesSelecionadas: operacoesSelecionadas }, () => {
            console.log('Operações salvas:', operacoesSelecionadas);
            
            if (operacoesSelecionadas.length === 1) {
                window.location.href = 'popup.html';
            } else {
                window.location.href = 'chooser.html';
            }
        });
    } else {
        alert('Por favor, selecione pelo menos uma operação para continuar.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['operacoesSelecionadas'], (result) => {
        const opsSalvas = result.operacoesSelecionadas;

        if (opsSalvas && opsSalvas.length > 0) {
            console.log("Configuração encontrada. Redirecionando...");
            
            if (opsSalvas.length === 1) {
                window.location.href = 'popup.html';
            } else {
                window.location.href = 'chooser.html';
            }
        } else {
            console.log("Primeiro acesso. Carregando lista de operações...");
            populateOperations();
        }
    });
});