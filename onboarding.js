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

            selectElement.size = numeroDeOperacoes;
            selectElement.innerHTML = '';
            
            operations.forEach(op => {
                const option = document.createElement('option');
                option.value = op[0];
                option.textContent = op[1];
                selectElement.appendChild(option);
            });
        } else {
            selectElement.innerHTML = '<option value="">Nenhuma operação encontrada</option>';
        }
        
        db.close();
    } catch (error) {
        console.error("Erro ao carregar operações:", error);
        selectElement.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

document.getElementById('setupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const selectElement = document.getElementById('operacaoSelect');
    
    const operacoesSelecionadas = Array.from(selectElement.selectedOptions).map(option => option.value);

    if (operacoesSelecionadas.length > 0) {
        chrome.storage.local.set({ operacoesSelecionadas: operacoesSelecionadas }, () => {
            console.log('Operações salvas:', operacoesSelecionadas);
            
            if (operacoesSelecionadas.length === 1) {
                window.location.href = 'popup.html';
            } else {
                window.location.href = 'chooser.html';
            }
        });
    }
});

populateOperations();