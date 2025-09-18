async function initDb() {
    try{ const SQL = await initSqlJs({locateFile: file => `js/${file}`});
         const dbUrl = chrome.runtime.getURL('db/dados_operacoes.sqlite');
         const response = await fetch(dbUrl);
         const dbArrayBuffer = await response.arrayBuffer();
         db = new SQL.Database(new Uint8Array(dbArrayBuffer));
         
         console.log("Banco de dados inicializado com sucesso.");

         return db;
    } catch (error) {
        console.log("Erro ao inicializar o banco de dados:", error);
        return null;
    }   
}

async function buscarDadosDaOperacao(operacaoId) {
    try {
        const db = await initDb();
        const stmt = db.prepare("SELECT tipo_contato, nome_contato, info_copiavel FROM contatos WHERE id_operacao = :id ORDER BY tipo_contato, nome_contato");
        stmt.bind({ ':id': operacaoId });
        const resultados = [];
        while (stmt.step()) {
            resultados.push(stmt.getAsObject());
        }
        stmt.free();
        db.close();
        return resultados;
    } catch (error) {
        console.error("Falha ao carregar dados:", error);
        return null;
    }
}

async function buscarNomeDaOperacao(operacaoId) {
    try {
        const db = await initDb();
        const stmt = db.prepare("SELECT nome_operacao FROM operacoes WHERE id = :id");
        const resultado = stmt.getAsObject({ ':id': operacaoId });
        stmt.free();
        db.close();
        // Retorna apenas o nome da operação, ou null se não encontrar
        return resultado ? resultado.nome_operacao : null;
    } catch (error) {
        console.error("Erro ao buscar nome da operação:", error);
        return null;
    }
}

function renderizarBotoesDeCategoria(dadosAgrupados) {
    const container = document.getElementById('category-buttons-container');
    if (!container) return;

    const categorias = Object.keys(dadosAgrupados);
    let html = '';
    categorias.forEach(categoria => {
        const modalId = `modal-${categoria.replace(/[^a-zA-Z0-9]/g, '-')}`;
        html += `<button class="abrir-modal" data-modal="${modalId}">${categoria}</button>`;
    });
    container.innerHTML = html;
}

function renderizarModais(dadosAgrupados) {
    const container = document.getElementById('modals-container');
    if (!container) return;

    const categorias = Object.keys(dadosAgrupados);
    let html = '';
    categorias.forEach(categoria => {
        const modalId = `modal-${categoria.replace(/[^a-zA-Z0-9]/g, '-',)}`;
        html += `
            <div id="${modalId}" class="modal">
                <div class="modal-content">
                    <span class="fechar">&times;</span>
                    <h2>${categoria}</h2>
                    ${
                        dadosAgrupados[categoria].map(item =>
                            `<button class="copiar-info" data-text="${item.info_copiavel.replace(/"/g, '&quot;')}">${item.nome_contato}<br>${item.info_copiavel}</button>`
                        ).join('')
                    }
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Nova função para renderizar o botão de troca de operação
function renderizarBotaoDeTroca(totalOperacoesSalvas) {
    // Se o usuário só tem 1 (ou menos) operação salva, não faz nada.
    if (totalOperacoesSalvas <= 1) {
        return;
    }

    const container = document.getElementById('change-op-button-container');
    if (!container) return;

    // Cria o botão
    const button = document.createElement('button');
    button.className = 'change-op-button'; // Classe para estilização
    button.title = 'Trocar de Operação'; // Texto que aparece ao parar o mouse em cima
    button.innerHTML = '🔄'; // Usando um emoji para o ícone

    // Adiciona a funcionalidade de clique
    button.addEventListener('click', () => {
        window.location.href = 'chooser.html';
    });

    // Insere o botão na página
    container.appendChild(button);
}

function configurarEventListeners() {
    document.body.addEventListener('click', event => {
        const target = event.target;
        if (target.classList.contains('abrir-modal')) {
            const modalId = target.getAttribute('data-modal');
            document.getElementById(modalId).style.display = "block";
        }
        if (target.classList.contains('fechar')) {
            target.closest(".modal").style.display = "none";
        }
        if (target.classList.contains('copiar-info')) {
            const texto = target.getAttribute('data-text');
            navigator.clipboard.writeText(texto).then(() => {
                const original = target.textContent;
                target.textContent = "✅ Copiado!";
                setTimeout(() => {
                    target.textContent = original;
                }, 1000);
            });
        }
        if (target.classList.contains('modal')) {
            target.style.display = "none";
        }
    });
}

async function iniciarPopup() {
    
    let sessionData = await chrome.storage.session.get(['operacaoAtivaId']);
    let operacaoId = sessionData.operacaoAtivaId;

    let localData = await chrome.storage.local.get(['operacoesSelecionadas']);
    let operacoesSalvas = localData.operacoesSelecionadas;

    const totalOperacoesSalvas = operacoesSalvas ? operacoesSalvas.length : 0;
    const nomeOperacao = await buscarNomeDaOperacao(operacaoId);

    if (nomeOperacao) {
        document.getElementById('popup-title').textContent = nomeOperacao;
    }

    // Chama a nova função para decidir se o botão deve ser criado
    renderizarBotaoDeTroca(totalOperacoesSalvas);

    if (operacaoId) {
        // Se sim, ótimo! Prosseguimos para carregar os dados.
        console.log("Operação da sessão encontrada:", operacaoId);
    } else {
        // 2. Se não, verifica as operações SALVAS permanentemente.
        let localData = await chrome.storage.local.get(['operacoesSelecionadas']);
        let operacoesSalvas = localData.operacoesSelecionadas;

        if (!operacoesSalvas || operacoesSalvas.length === 0) {
            // Se não há nada salvo, vai para o onboarding.
            window.location.href = 'onboarding.html';
            return;
        }

        if (operacoesSalvas.length === 1) {
            // Se só tem uma salva, ela se torna a ativa.
            operacaoId = operacoesSalvas[0];
            await chrome.storage.session.set({ operacaoAtivaId: operacaoId });
            console.log("Definindo operação única como ativa:", operacaoId);
        } else {
            // Se tem mais de uma, precisa ir para a tela de escolha.
            window.location.href = 'chooser.html';
            return;
        }
    }

    const dados = await buscarDadosDaOperacao(operacaoId);

    if (!dados || dados.length === 0) {
        document.body.innerHTML = '<h1>Ed Help</h1><p>Nenhum dado encontrado no banco de dados.</p>';
        return;
    }

    const dadosAgrupados = dados.reduce((acc, item) => {
        const categoria = item.tipo_contato;
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(item);
        return acc;
    }, {});

    renderizarBotoesDeCategoria(dadosAgrupados);
    renderizarModais(dadosAgrupados);
    configurarEventListeners();
}

document.addEventListener('DOMContentLoaded', iniciarPopup);