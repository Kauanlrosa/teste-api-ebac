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
                sh 'npm install'
            }
        }

        stage('Executar testes') {
            steps {
                echo 'Rodando Cypress...'
                sh 'npx cypress run'
            }
        }
    }
}