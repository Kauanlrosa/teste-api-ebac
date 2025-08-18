pipeline {
    agent any

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

        stage('Rodar servidor da aplicação') {
            steps {
                echo 'Iniciando servidor da aplicação...'
                powershell '''
                # Inicia o servidor em background
                Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"
                # Aguarda 15 segundos para o servidor subir
                Start-Sleep -Seconds 15
                '''
            }
        }

        stage('Executar testes Cypress') {
            steps {
                echo 'Rodando Cypress...'
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