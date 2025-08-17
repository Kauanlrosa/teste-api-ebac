// Jenkinsfile para Pipeline Declarativo - Usando a abordagem 'parallel'

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

        // Este estágio vai rodar a API e os testes em paralelo
        stage('Executar Testes com a API') {
            parallel {
                // "Galho" 1: Iniciar e manter a API rodando
                stage('Iniciar API') {
                    steps {
                        echo 'Iniciando a API...'
                        // Não precisa mais de 'start'. O Jenkins vai gerenciar o processo.
                        // O pipeline vai ficar "preso" aqui, o que é o esperado.
                        bat 'npx cross-env RESET_DB=true npm start'
                    }
                }

                // "Galho" 2: Esperar, Resetar e Rodar os Testes
                stage('Testar API') {
                    steps {
                        // O script de retry ainda é útil aqui, pois o outro galho leva tempo.
                        echo 'Aguardando a API ficar online e tentando resetar...'
                        bat '''
                            set "ATTEMPTS=0"
                            :retry
                            echo "Aguardando 5 segundos..."
                            node -e "setTimeout(() => {}, 5000);"
                            
                            echo "Tentando conectar e resetar a API..."
                            node -e "fetch('http://localhost:3000/resetar-banco', { method: 'POST' } ).then(res => { if (!res.ok) throw new Error('API respondeu com status ' + res.status); process.exit(0); }).catch(err => { console.error(err.message); process.exit(1); });"
                            
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

                        // Se o reset funcionou, rodamos os testes
                        echo 'Executando testes Cypress...'
                        bat 'set NO_COLOR=1 && npx cypress run --headless'
                    }
                }
            }
        }
    }

    post {
        // Não precisamos mais do kill-port, o Jenkins faz a limpeza automaticamente!
        always {
            echo 'Arquivando os artefatos de teste...'
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}