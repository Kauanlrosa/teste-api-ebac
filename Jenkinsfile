// Jenkinsfile para Pipeline Declarativo - A Simplicidade do npm start

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

        stage('Executar Testes com a API') {
            parallel {
                stage('Iniciar API') {
                    steps {
    echo 'Iniciando a API diretamente do node_modules...'
    // VERIFIQUE SE ESTA É A LINHA QUE VOCÊ TEM:
    bat 'npx cross-env RESET_DB=true .\\node_modules\\.bin\\serverest'
}
                    }
                }

                stage('Testar API') {
                    steps {
                        echo 'Aguardando a API ficar online e tentando resetar...'
                        bat '''
                            set "ATTEMPTS=0"
                            :retry
                            echo "Aguardando 10 segundos..."
                            node -e "setTimeout(() => {}, 10000);"
                            
                            echo "Tentando conectar e resetar a API..."
                            node -e "fetch('http://localhost:3000/resetar-banco', { method: 'POST' } ).then(res => { if (!res.ok) throw new Error('API respondeu com status ' + res.status); process.exit(0); }).catch(err => { console.error(err.message); process.exit(1); });"
                            
                            if %errorlevel% == 0 (
                                echo "API está online e foi resetada com sucesso."
                                exit /b 0
                            )
                            
                            set /a "ATTEMPTS+=1"
                            if %ATTEMPTS% lss 6 (
                                echo "API ainda não está pronta, tentando novamente (%ATTEMPTS%/6)..."
                                goto retry
                            )
                            
                            echo "ERRO: A API não ficou online após 60 segundos."
                            exit /b 1
                        '''

                        echo 'Executando testes Cypress...'
                        bat 'set NO_COLOR=1 && npx cypress run --headless'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Arquivando os artefatos de teste...'
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}