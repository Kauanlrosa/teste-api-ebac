// Jenkinsfile para Pipeline Declarativo - Versão Final e Robusta

pipeline {
    agent any

    tools {
        nodejs 'NodeLocal' 
    }

    stages {
        stage('Instalar Dependências' ) {
            steps {
                // Instala todas as dependências de desenvolvimento, incluindo cross-env e kill-port
                bat 'npm ci || npm install'
            }
        }

        stage('Iniciar API com Reset Habilitado') {
            steps {
                echo 'Iniciando o servidor da API (serverest) com permissão de reset...'
                // SOLUÇÃO 1: Usa 'cross-env' para setar a variável de ambiente que permite o reset do banco
                bat 'start "API-Server" npx cross-env RESET_DB=true npm start'
                
                echo 'Aguardando 15 segundos para a API inicializar completamente...'
                sleep 15
            }
        }

        stage('Resetar Banco de Dados da API') {
            steps {
                echo 'Resetando a base de dados da API usando o endpoint correto...'
                // SOLUÇÃO 2: Usa o endpoint '/resetar-banco'
                bat '''
                    node -e "require('http' ).get('http://localhost:3000/resetar-banco', (res ) => { console.log('Reset solicitado. Status:', res.statusCode); process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', (err) => { console.error('Erro no reset:', err.message); process.exit(1) });"
                '''
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
            bat 'npx kill-port 3000 || echo "Processo na porta 3000 não encontrado ou já finalizado."'
            
            echo 'Arquivando os artefatos de teste...'
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}