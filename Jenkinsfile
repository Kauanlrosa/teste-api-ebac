// Jenkinsfile para Pipeline Declarativo - Corrigindo o método de Reset para POST

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

        stage('Iniciar API com Reset Habilitado') {
            steps {
                echo 'Iniciando o servidor da API (serverest) com permissão de reset...'
                bat 'start "API-Server" npx cross-env RESET_DB=true npm start'
                
                echo 'Aguardando 15 segundos para a API inicializar completamente...'
                sleep 15
            }
        }

        stage('Resetar Banco de Dados da API') {
            steps {
                echo 'Resetando a base de dados da API usando o método POST...'
                // SOLUÇÃO: Usa fetch() do Node.js para enviar uma requisição POST.
                bat '''
                    node -e "fetch('http://localhost:3000/resetar-banco', { method: 'POST' } ).then(res => { console.log('Reset solicitado. Status:', res.status); if (!res.ok) throw new Error('Status nao eh 200'); }).catch(err => { console.error('Erro no reset:', err.message); process.exit(1); });"
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
                // Adicionamos --headless aqui para garantir, embora seja o padrão
                bat 'set NO_COLOR=1 && npx cypress run --headless'
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