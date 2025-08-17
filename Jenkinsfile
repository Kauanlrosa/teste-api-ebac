// Jenkinsfile para Pipeline Declarativo

pipeline {
    agent any

    tools {
        nodejs 'NodeLocal' 
    }

    stages {
        stage('Instalar Dependências') {
            steps {
                bat 'npm ci || npm install'
            }
        }

        stage('Iniciar API e Resetar Estado') {
            steps {
                echo 'Iniciando o servidor da API (serverest)...'
                // Inicia a API em background
                bat 'start "API-Server" npm start'
                
                echo 'Aguardando 10 segundos para a API inicializar...'
                sleep 10
                
                echo 'Resetando a base de dados da API para um estado limpo...'
                // Adiciona o passo de reset. O -f falha silenciosamente se houver erro.
                bat 'curl -X GET http://localhost:3000/usuarios/reset || echo "Reset falhou, continuando..."'

                echo 'Aguardando 5 segundos após o reset...'
                sleep 5
            }
        }

        stage('Verificar Instalação do Cypress' ) {
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
            echo 'Finalizando o processo da API...'
            // Comando mais robusto para parar o processo Node.js no Windows
            // Ele busca o PID da porta 3000 e o mata.
            bat '''
                for /f "tokens=5" %%a in ('netstat -aon ^| find "3000" ^| find "LISTENING"') do (
                    taskkill /F /PID %%a
                )
                || echo "Processo na porta 3000 não encontrado para finalizar."
            '''
            
            echo 'Arquivando os artefatos de teste...'
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}