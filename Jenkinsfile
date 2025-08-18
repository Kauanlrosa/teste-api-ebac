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
                // Start em background + espera 15s para o servidor subir
                bat '''
                start /B npm start
                timeout /t 15 /nobreak
                '''
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
        success {
            echo 'Todos os testes foram executados com sucesso!'
        }
        failure {
            echo 'O pipeline falhou. Verifique os logs para detalhes.'
        }
    }
}
