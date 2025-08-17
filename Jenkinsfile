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

        stage('Iniciar API em Background') {
            steps {
                echo 'Iniciando o servidor da API (serverest)...'
                // Inicia a API em uma janela separada e continua imediatamente
                bat 'start "API-Server" npx cross-env RESET_DB=true npm start'
            }
        }

        stage('Aguardar API e Resetar Banco') {
            steps {
                echo 'Aguardando a API ficar online e tentando resetar...'
                // SOLUÇÃO: Loop de retry no Windows. Tenta por até 60 segundos.
                // O comando 'timeout' age como um 'sleep'.
                // O 'exit /b 0' sai do loop com sucesso.
                bat '''
                    set "ATTEMPTS=0"
                    :retry
                    timeout /t 5 /nobreak > NUL
                    node -e "fetch('http://localhost:3000/resetar-banco', { method: 'POST' } ).then(res => { if (!res.ok) throw new Error('API respondeu com status ' + res.status); process.exit(0); }).catch(err => { process.exit(1); });"
                    if %errorlevel% == 0 (
                        echo "API está online e foi resetada com sucesso."
                        exit /b 0
                    )
                    set /a "ATTEMPTS+=1"
                    if %ATTEMPTS% lss 12 (
                        echo "API ainda não está pronta, tentando novamente (%ATTEMPTS%/12)..."
                        goto retry
                    )
                    echo "ERRO: A API não ficou online após 60 segundos."
                    exit /b 1
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