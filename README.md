# ED HELP - Guia de Referência Rápida

O objetivo é agilizar as informações passadas e consulta delas, e assim tornar mais ágeis os atendimentos.

---

### Índice

* [Como Utilizar](#-como-utilizar)
    * [Instalação](#instalação)
    * [Uso](#uso)
* [Como Foi Feita (Tecnologias)](#️-como-foi-feita)
<!--* [Licença](#-licença)-->

---

### Como Utilizar

#### Instalação

Na aba de code do GitHub, selecione a opção de "Download ZIP". Na sua onde baixou o arquivo, descompacte a pasta toda.

Agora, abra o Google Chrome e encontre "Extensões" e selecione a opção de "Gerenciar extensões". Na aba do gerenciador, ativo o modo de desenvolvedor (canto superior direito). 

Por último, clique em "Carregar sem compactação" e selecione a pasta descompactada mais cedo. Agora nossa extensão está instalada, antes de usarmos recomendo, ainda no gerenciador, clicar em "Atalhos de teclado" e crie um atalho para chamar nossa extensão.

#### Uso

Após a instalação, basta selecionar o botão da extensão, ou então use o atalho de teclado criado antes (se desejar pode fixar ela no navegador).

No primeiro acesso basta selecionar quais operações deseja usar, para isso clique em uma e segure Ctrl para clicar em mais de uma, depois clique em Salvar e Continuar.

Agora, caso tenha selecionado apenas uma operação, as classificações de contatos aparecerão.

E basta clicar nas classificações para ver os contatos, e ao clicar um contato irá copiar as informações dele.

Caso tenha selecionado mais de uma operação, irá aparecer uma lista com as operações selecionadas e poderá escolher qual irá utilizar como ativa no momento. 

Após isso basta, repetir o que foi falando acima para utilizar a extensão. Ainda em todas essas etapas a um botão de voltar para escolher outros contatos ou outras operações. 

#### Selecionei as operações erradas e agora?

Você vai ver, que não tem uma opção para re-selecionar as operações. No caso de ter escolhido a operação errada, ter faltado alguma operação ou simplesmente alguma configuração errada. Basta exlcuir a extensão do navegador e instalar novamente.


### Como foi feita?

A extensão faz parte de uma inovação para o ambiente de atendimento ao cliente. Como a ideia surgiu num ambiente de escritório onde as atividades são majoritariamente feitas no browser, o JavaScript foi a principal ferramenta utilizada.

A versão atual funciona da seguinte forma. Os dados que você precisa são colocados em um banco de dados do SQLite, usando linguagem SQL e a ferramenta DB Browser for SQLite. Pela necessidade, todos os dados ficam alocados juntos a extensão e para isso é necessário que o programa acesse esse banco, como o SQLite é uma ferramenta em C, é necessário também um interpretador para JS.

Dessa forma, temos uma pasta com nosso banco .sqlite e uma pasta com nosso interpretador os arquivos sql-wasm.js e sql-wasm.wasm.

O próximo passo é trabalhar os dados. Através de 3 conjuntos de código principais, onboarding, chooser e popup. O onboarding fica responsável por checar se o usuário já utilizou a ferramenta alguma vez, se sim checa quantas operações estão selecionadas na memória do navegador e para 2 ou mais, move para o chooser, onde escolhemos a operação atual e nos move para o popup, onde de fato utilizamos a ferramenta. Alternativamente, se há apenas uma operação somos movidos direto ao popup, e caso não tenhamos selecionado nada ainda, o onboarding nos permite escolher qual ou quais vamos utilizar.
 