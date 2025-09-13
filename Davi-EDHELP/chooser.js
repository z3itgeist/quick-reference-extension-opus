document.addEventListener('DOMContentLoaded', async () => {
    try {
        const storageResult = await chrome.storage.local.get(['operacoesSelecionadas']);
        const ids = storageResult.operacoesSelecionadas;

        if (!ids || ids.length === 0) {
            window.location.href = 'onboarding.html';
            return;
        }

        const SQL = await initSqlJs({ locateFile: file => `js/${file}` });
        const dbUrl = chrome.runtime.getURL('db/dados_operacoes.sqlite');
        const response = await fetch(dbUrl);
        const dbArrayBuffer = await response.arrayBuffer();
        const db = new SQL.Database(new Uint8Array(dbArrayBuffer));

        const placeholders = ids.map(() => '?').join(',');
        const stmt = db.prepare(`SELECT id, nome_operacao FROM operacoes WHERE id IN (${placeholders})`);
        
        // --- INÍCIO DA CORREÇÃO ---
        
        // 1. Vincula os parâmetros (o array de IDs) ao statement.
        stmt.bind(ids);

        // 2. Cria uma lista vazia para guardar os resultados.
        const result = [];
        
        // 3. Loop: enquanto houver uma próxima linha de resultado...
        while (stmt.step()) {
            // ...pegue a linha atual como um objeto e adicione à nossa lista.
            result.push(stmt.getAsObject());
        }

        // --- FIM DA CORREÇÃO ---
        
        stmt.free();
        db.close();

        const container = document.getElementById('chooser-container');
        container.innerHTML = ''; 
        result.forEach(row => {
            const button = document.createElement('button');
            button.textContent = row.nome_operacao;
            button.dataset.id = row.id;
            container.appendChild(button);
        });

        container.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const operacaoId = e.target.dataset.id;
                chrome.storage.session.set({ operacaoAtivaId: operacaoId }, () => {
                    window.location.href = 'popup.html';
                });
            }
        });
    } catch (error) {
        console.error("Erro na página de escolha:", error);
        const container = document.getElementById('chooser-container');
        container.innerHTML = '<p>Ocorreu um erro ao carregar as operações.</p>';
    }
});