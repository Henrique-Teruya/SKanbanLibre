TELA PRINCIPAL — KANBAN DE ATENDIMENTOS
Essa é a principal.

O que cada card deve mostrar

Protocolo
API:
Realiza o cadastro de um atendimento
Realiza o cadastro de um novo atendimento
Cadastrar Atendimento

Cliente
nome
documento
telefone
e-mail
API:
Lista os atendimentos
Retorna os atendimentos ativos que o cliente está associado e é permitido a visualização
Retorna os dados dos atendimentos

Assunto
API:
Retorna os assuntos do atendimento

Subassunto
API:
Retorna os subassuntos de assunto do atendimento

Situação atual
API:
Retorna as situações possíveis em um atendimento
Alterar situação do atendimento
Lista os atendimentos
Retorna os dados dos atendimentos

Prioridade
API:
Lista os atendimentos
Retorna os dados dos atendimentos
Altera os dados do atendimento

Responsável atual
API:
Lista os atendimentos
Retorna os dados dos atendimentos
Altera os dados do atendimento

Time responsável
API:
Retorna os times de atendimentos
Retorna os integrantes dos times de atendimentos

Data de abertura
API:
Lista os atendimentos
Retorna os dados dos atendimentos

Última interação
API:
Retorna as interações dos atendimentos
Lista as mensagens de um atendimento

Tempo médio de resposta
API:
Retorna os dados dos atendimentos
Retorna as respostas dos atendimentos

Tempo em cada situação (SLA)
API:
Retorna o tempo que o atendimento passou em cada situação

Quantidade de mensagens
API:
Lista as mensagens de um atendimento
Retorna as respostas dos atendimentos

Quantidade de anexos
API:
Faz o upload dos arquivos do atendimento
Lista as mensagens de um atendimento

Tarefas vinculadas
API:
Retorna as tarefas dos atendimentos
Retorna as tarefas criadas do atendimento

AÇÕES RÁPIDAS NO CARD

Novo atendimento
API:
Realiza o cadastro de um atendimento
Realiza o cadastro de um novo atendimento
Cadastrar Atendimento

Responder atendimento
API:
Responde um determinado atendimento
Adiciona uma mensagem no atendimento

Upload de anexos
API:
Faz o upload dos arquivos do atendimento

Alterar situação (drag and drop)
API:
Alterar situação do atendimento
ESSA É A MAIS IMPORTANTE.

Finalizar atendimento
API:
Finaliza um atendimento

Editar dados
API:
Altera os dados do atendimento

Encerrar tarefa
API:
Encerra uma tarefa criada

Avaliar atendimento
API:
Avalia um atendimento

TELA DETALHADA DO ATENDIMENTO
Aqui fica a visão completa.
Formato tipo:
Zendesk + CRM + Chat

BLOCO 1 — Informações Gerais
Mostrar:
protocolo
cliente
assunto
subassunto
situação
prioridade
responsável
time
data abertura
SLA
workflow atual
APIs:
Retorna os dados de um atendimento
Retorna os dados dos atendimentos
Alterar situação do atendimento
retornarsubworkflows-1

BLOCO 2 — Timeline / Histórico
Mostrar:
mensagens
respostas
anexos
alterações de status
interações
logs
tarefas criadas
tarefas concluídas
APIs:
Lista as mensagens de um atendimento
Obtém uma mensagem específica
Retorna as respostas dos atendimentos
Retorna as interações dos atendimentos
Retorna as tarefas dos atendimentos
Retorna as tarefas criadas do atendimento
Essa é a parte mais forte da máscara.

BLOCO 3 — Campo de resposta
Permitir:
responder
anexar arquivos
alterar status rápido
APIs:
Responde um determinado atendimento
Adiciona uma mensagem no atendimento
Faz o upload dos arquivos do atendimento
Alterar situação do atendimento

BLOCO 4 — Gestão de tarefas
Mostrar:
tarefas abertas
responsável
prazo
status
observações
APIs:
Retorna as tarefas criadas do atendimento
Retorna uma tarefa criada

BLOCO 5 — Avaliação final
Se encerrado:
mostrar:
estrelas
comentário
API:
Avalia um atendimento

DASHBOARD GERENCIAL
Dados vindos principalmente do CVDW

Mostrar
total de atendimentos
atendimentos por situação
atendimentos por time
atendimentos por responsável
SLA médio
tempo médio de resposta
tempo médio por etapa
gargalos operacionais
performance das equipes
produtividade por time
APIs:
Retorna os dados dos atendimentos
Retorna os times de atendimentos
Retorna os integrantes dos times de atendimentos
Retorna o tempo que o atendimento passou em cada situação
Retorna as interações dos atendimentos

FILTROS GLOBAIS
Permitir busca por:
protocolo
documento
e-mail
telefone
situação
data
prioridade
responsável
assunto
subassunto
workflow
time
APIs:
Lista os atendimentos
Retorna os atendimentos ativos que o cliente está associado e é permitido a visualização
Retorna os dados dos atendimentos
