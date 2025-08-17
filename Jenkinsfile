// Jenkinsfile para Pipeline Declarativo

pipeline {
    // 1. Agente: Executa em qualquer agente Jenkins disponível
    agent any

    // 2. Ferramentas: Define a versão do NodeJS a ser usada
    tools {
        // Garanta que 'NodeLocal' é o nome configurado em Manage Jenkins > Tools
        nodejs 'NodeLocal' 
    }

    // 3. Estágios: Define os passos do pipeline
    stages {
        stage('Instalar Dependências') {
            steps {
                // Usa 'npm ci' para uma instalação limpa e rápida, ou 'npm install' como fallback
                bat 'npm ci || npm install'
            }
        }

        stage('Iniciar API em Background') {
            steps {
                echo 'Iniciando o servidor da API (serverest)...'
                // Usa o comando 'start' do Windows para rodar a API em segundo plano
                // e não travar o pipeline. O comando vem do package.json.
                bat 'start "API-Server" npm start'
                
                echo 'Aguardando 15 segundos para a API inicializar completamente...'
                // Pausa crucial para dar tempo ao servidor de ficar pronto
                sleep 15 
            }
        }

        stage('Verificar Instalação do Cypress') {
            steps {
                // Etapa de verificação para garantir que o Cypress está pronto
                bat 'npx cypress verify'
            }
        }

        stage('Executar Testes de API com Cypress') {
            steps {
                // Executa os testes usando o script definido no package.json
                // O 'set NO_COLOR=1' melhora a legibilidade dos logs no Jenkins
                bat 'set NO_COLOR=1 && npm run cy:run'
            }
        }
    }

    // 4. Pós-execução: Ações que acontecem sempre no final do pipeline
    post {
        always {
            // Este bloco é executado independentemente do sucesso ou falha do pipeline
            
            echo 'Finalizando o processo da API...'
            // Mata o processo do servidor Node.js para limpar o ambiente do agente
            // O '|| echo' evita que o build falhe se o processo já tiver sido encerrado
            bat 'taskkill /F /IM node.exe || echo "Processo Node.js não encontrado para finalizar."'
            
            echo 'Arquivando os artefatos de teste...'
            // Salva os relatórios e screenshots gerados pelo Cypress
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}