pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependências') {
            steps {
                bat 'npm install'
            }
        }

        stage('Rodar servidor') {
            steps {
                echo 'Iniciando servidor da aplicação...'
                // Inicia em background
                bat 'start /B npm start'
                // Espera 15 segundos para o servidor iniciar (ajuste se necessário)
                bat 'timeout /t 15 /nobreak'
            }
        }

        stage('Executar testes Cypress') {
            steps {
                echo 'Rodando Cypress...'
                bat 'npx cypress run'
            }
        }
    }
}
