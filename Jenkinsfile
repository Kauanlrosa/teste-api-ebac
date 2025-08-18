pipeline {
    agent any

    environment {
        // Aguarda 15 segundos antes de rodar os testes
        WAIT_TIME = 15
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositório...'
                checkout scm
            }
        }

        stage('Instalar dependências') {
            steps {
                echo 'Instalando pacotes...'
                bat 'npm install'
            }
        }

        stage('Iniciar servidor da API') {
            steps {
                echo 'Iniciando servidor da aplicação...'
                // Inicia o backend em background
                bat 'start cmd /c "npm start"'
                
                // Aguarda o backend subir (em segundos)
                echo "Aguardando ${env.WAIT_TIME} segundos para o servidor iniciar..."
                bat "powershell -Command \"Start-Sleep -Seconds ${env.WAIT_TIME}\""
            }
        }

        stage('Executar testes Cypress') {
            steps {
                echo 'Rodando testes Cypress...'
                bat 'npx cypress run'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado.'
        }
    }
}
