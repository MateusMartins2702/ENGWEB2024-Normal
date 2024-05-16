// Importações de módulos necessários
const express = require('express');
const path = require('path');
const fs = require('fs');

// Criação da aplicação Express
const app = express();

// Middleware para análise do corpo da solicitação
app.use(express.json());

// Caminho para o arquivo JSON de contratos
const contractsFilePath = path.join(__dirname, '../contratos2024.json');

// Função para ler os contratos do arquivo JSON
function readContractsFromFile() {
    try {
        const data = fs.readFileSync(contractsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo de contratos:', error);
        return []; // Retorna um array vazio se houver erro
    }
}

// Função para escrever os contratos no arquivo JSON
function writeContractsToFile(contracts) {
    try {
        fs.writeFileSync(contractsFilePath, JSON.stringify(contracts, null, 2), { encoding: 'utf8' });
    } catch (error) {
        console.error('Erro ao escrever no arquivo de contratos:', error);
    }
}

// Rota para listar todos os contratos
app.get('/contratos', (req, res) => {
    const contracts = readContractsFromFile();
    res.json(contracts);
});

// Rota para obter um contrato por ID
app.get('/contratos/:id', (req, res) => {
    const contracts = readContractsFromFile();
    const contract = contracts.find(c => c._id.toString() === req.params.id);
    if (contract) {
        res.json(contract);
    } else {
        res.status(404).send('Contrato não encontrado.');
    }
});

// Rota para listar contratos por entidade
app.get('/contratos/entidades', (req, res) => {
    const contracts = readContractsFromFile();
    const entities = [...new Set(contracts.map(c => c.entidade_comunicante))];
    entities.sort();
    res.json(entities);
});

// Rota para listar contratos por tipo de procedimento
app.get('/contratos/tipos', (req, res) => {
    const contracts = readContractsFromFile();
    const types = [...new Set(contracts.map(c => c.tipoprocedimento))];
    types.sort();
    res.json(types);
});

// Rota para listar contratos por entidade específica
app.get('/contratos/entidades/:entidade', (req, res) => {
    const contracts = readContractsFromFile();
    const filteredContracts = contracts.filter(c => c.entidade_comunicante === req.params.entidade);
    res.json(filteredContracts);
});

// Rota para listar contratos por tipo específico de procedimento
app.get('/contratos/tipos/:tipo', (req, res) => {
    const contracts = readContractsFromFile();
    const filteredContracts = contracts.filter(c => c.tipoprocedimento === req.params.tipo);
    res.json(filteredContracts);
});

// Rota para adicionar um novo contrato
app.post('/contratos', (req, res) => {
    const contracts = readContractsFromFile();
    const newContract = { ...req.body, _id: Math.max(...contracts.map(c => c._id)) + 1 }; // Atribui um novo ID automaticamente
    contracts.push(newContract);
    writeContractsToFile(contracts);
    res.status(201).json(newContract);
});

// Rota para excluir um contrato por ID
app.delete('/contratos/:id', (req, res) => {
    const contracts = readContractsFromFile();
    const index = contracts.findIndex(c => c._id.toString() === req.params.id);
    if (index !== -1) {
        contracts.splice(index, 1);
        writeContractsToFile(contracts);
        res.status(204).send();
    } else {
        res.status(404).send('Contrato não encontrado.');
    }
});

// Rota para atualizar um contrato por ID
app.put('/contratos/:id', (req, res) => {
    const contracts = readContractsFromFile();
    const index = contracts.findIndex(c => c._id.toString() === req.params.id);
    if (index !== -1) {
        contracts[index] = { ...contracts[index], ...req.body };
        writeContractsToFile(contracts);
        res.json(contracts[index]);
    } else {
        res.status(404).send('Contrato não encontrado.');
    }
});

// Rota raiz para evitar "Cannot GET /"
app.get('/', (req, res) => {
    res.send('API de Contratos está ativa. Use /contratos para acessar os dados.');
});

// Configuração do servidor para ouvir na porta 16000
const PORT = 16000;
app.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});

// Exporta a aplicação Express
module.exports = app;
