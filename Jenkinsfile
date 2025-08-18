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

        stage('Executar testes') {
            steps {
                echo 'Rodando Cypress...'
                bat 'npx cypress run'
            }
        }
    }
}
