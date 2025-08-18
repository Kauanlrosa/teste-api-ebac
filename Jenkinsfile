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

        stage('Iniciar servidor da API') {
            steps {
                echo 'Iniciando servidor da aplicação...'
                // Inicia o backend em novo terminal
                bat 'start cmd /c "npm start"'

                // Espera a API ficar disponível na porta 3000
                echo 'Aguardando servidor subir...'
                powershell """
                \$maxRetries = 20
                \$retry = 0
                while (\$retry -lt \$maxRetries) {
                    try {
                        \$response = Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing -TimeoutSec 3
                        if (\$response.StatusCode -eq 200) {
                            Write-Host 'Servidor ativo!'
                            break
                        }
                    } catch {
                        Write-Host 'Servidor ainda não ativo, aguardando 3s...'
                    }
                    Start-Sleep -Seconds 3
                    \$retry++
                }
                if (\$retry -eq \$maxRetries) {
                    Write-Error 'Servidor não subiu em tempo hábil!'
                    exit 1
                }
                """
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
