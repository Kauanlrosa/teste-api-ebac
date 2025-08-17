pipeline {
    agent any

    tools {
        nodejs 'NodeLocal' // Usando o nome que corrigimos antes
    }

    stages {
        stage('Instalar dependências') {
            steps {
                bat 'npm ci || npm install'
            }
        }

        // NOVO STAGE PARA INICIAR A API EM BACKGROUND
        stage('Iniciar API') {
            steps {
                // O comando "start" no Windows inicia um processo em uma nova janela.
                // O comando exato pode ser "npm start", "npm run serve", etc.
                // Verifique seu package.json!
                bat 'start "API Server" npm start'
                // Adiciona uma pequena espera para dar tempo da API iniciar
                sleep 15 
            }
        }

        stage('Verificar Cypress') {
            steps {
                bat 'npx cypress verify'
            }
        }

        stage('Executar testes API') {
            steps {
                bat 'set NO_COLOR=1 && npx cypress run --headless --browser electron'
            }
        }
    }

    post {
        always {
            // Este bloco será executado sempre, tenha o build sucesso ou falha.
            // É importante para não deixar processos "zumbis" rodando no agente Jenkins.
            echo 'Parando a API...'
            // O comando para parar pode variar. Este comando mata o processo Node.js.
            // Pode ser necessário ajustar.
            bat 'taskkill /IM node.exe /F || echo "Processo Node não encontrado para parar."'
            
            // Arquiva os relatórios e screenshots do Cypress
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}