// Jenkinsfile para Pipeline Declarativo - Versão Robusta com Node.js

pipeline {
    agent any

    tools {
        nodejs 'NodeLocal' 
    }

    stages {
        stage('Instalar Dependências (incluindo kill-port)') {
            steps {
                // Agora também instala o 'kill-port' que adicionamos
                bat 'npm ci || npm install'
            }
        }

        stage('Iniciar API e Resetar Estado') {
            steps {
                echo 'Iniciando o servidor da API (serverest)...'
                bat 'start "API-Server" npm start'
                
                echo 'Aguardando 10 segundos para a API inicializar...'
                sleep 10
                
                echo 'Resetando a base de dados da API usando Node.js...'
                // SOLUÇÃO: Usa Node.js para fazer a requisição HTTP, em vez de 'curl'
                bat '''
                    node -e "require('http' ).get('http://localhost:3000/usuarios/reset', (res ) => { console.log('Reset solicitado. Status:', res.statusCode); process.exit(res.statusCode == 200 ? 0 : 1) }).on('error', (err) => { console.error('Erro no reset:', err.message); process.exit(1) });"
                '''

                echo 'Aguardando 5 segundos após o reset...'
                sleep 5
            }
        }

        stage('Verificar Instalação do Cypress') {
            steps {
                bat 'npx cypress verify'
            }
        }

        stage('Executar Testes de API com Cypress') {
            steps {
                bat 'set NO_COLOR=1 && npm run cy:run'
            }
        }
    }

    post {
        always {
            echo 'Finalizando o processo da API na porta 3000...'
            // SOLUÇÃO: Usa 'npx kill-port' para parar a API, em vez de taskkill/netstat
            // O '|| echo' garante que o pipeline não falhe se a porta já estiver livre.
            bat 'npx kill-port 3000 || echo "Processo na porta 3000 não encontrado ou já finalizado."'
            
            echo 'Arquivando os artefatos de teste...'
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}