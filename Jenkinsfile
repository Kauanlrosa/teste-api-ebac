pipeline {
    agent any

    environment {
        SERVER_PID = ''
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

        stage('Rodar servidor da aplicação') {
            steps {
                echo 'Iniciando servidor da aplicação...'
                powershell '''
                # Inicia o servidor em background e salva o PID
                $process = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start" -PassThru
                $process.Id | Out-File server_pid.txt
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
            echo 'Finalizando servidor da aplicação...'
            powershell '''
            if (Test-Path server_pid.txt) {
                $pid = Get-Content server_pid.txt
                Stop-Process -Id $pid -Force
                Remove-Item server_pid.txt
            }
            '''
            echo 'Pipeline finalizado.'
        }
    }
}