pipeline {
    agent any

    environment {
        // Definindo variáveis de ambiente que serão usadas no pipeline
        NODE_VERSION = '18'
        CYPRESS_CACHE_FOLDER = './cypress-cache'
        API_BASE_URL = 'https://serverest.dev'
    }

    stages {
        stage('Checkout') {
            steps {
                // Obtém o código mais recente do repositório
                echo 'Fazendo checkout do código...'
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Configurando ambiente Node.js...'
                // Instala a versão específica do Node.js se necessário
                sh '''
                    # Verifica se o Node.js está instalado
                    node --version || echo "Node.js não encontrado"
                    npm --version || echo "npm não encontrado"
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependências do projeto...'
                sh '''
                    # Instala as dependências do package.json
                    npm ci
                    
                    # Verifica se o Cypress foi instalado corretamente
                    npx cypress version
                '''
            }
        }

        stage('Lint Code') {
            steps {
                echo 'Executando verificação de qualidade do código...'
                sh '''
                    # Executa ESLint se estiver configurado
                    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
                        npm run lint || echo "Lint não configurado ou falhou"
                    else
                        echo "ESLint não configurado, pulando verificação"
                    fi
                '''
            }
        }

        stage('Start API Server') {
            steps {
                echo 'Iniciando servidor da API para testes...'
                script {
                    // Se você tiver uma API local para testar, inicie aqui
                    // Caso contrário, os testes usarão a API externa (serverest.dev)
                    sh '''
                        # Exemplo: se você tiver um servidor local
                        # npm run start:api &
                        # sleep 10 # Aguarda o servidor iniciar
                        
                        # Para este exemplo, usaremos a API externa
                        echo "Usando API externa: ${API_BASE_URL}"
                        
                        # Verifica se a API está acessível
                        curl -f ${API_BASE_URL}/usuarios || echo "API não está respondendo"
                    '''
                }
            }
        }

        stage('Run API Tests') {
            steps {
                echo 'Executando testes da API com Cypress...'
                sh '''
                    # Define a URL base para os testes
                    export CYPRESS_baseUrl=${API_BASE_URL}
                    
                    # Executa os testes Cypress em modo headless
                    npx cypress run \
                        --spec "cypress/e2e/exercicio-api.cy.js" \
                        --browser chrome \
                        --headless \
                        --reporter junit \
                        --reporter-options "mochaFile=cypress/results/test-results-[hash].xml"
                '''
            }
            post {
                always {
                    // Publica os resultados dos testes
                    publishTestResults testResultsPattern: 'cypress/results/*.xml'
                    
                    // Arquiva screenshots e vídeos em caso de falha
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('Generate Test Report') {
            steps {
                echo 'Gerando relatório de testes...'
                sh '''
                    # Gera relatório HTML dos testes (se configurado)
                    if [ -d "cypress/results" ]; then
                        echo "Resultados dos testes encontrados"
                        ls -la cypress/results/
                    else
                        echo "Nenhum resultado de teste encontrado"
                    fi
                '''
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Verificando critérios de qualidade...'
                script {
                    // Verifica se todos os testes passaram
                    def testResults = sh(
                        script: 'find cypress/results -name "*.xml" -exec grep -l "failures=\\"0\\"" {} \\;',
                        returnStatus: true
                    )
                    
                    if (testResults != 0) {
                        error("Alguns testes falharam. Pipeline interrompido.")
                    } else {
                        echo "Todos os testes passaram! ✅"
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                // Só executa este estágio se estivermos na branch main/master
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Fazendo deploy para ambiente de staging...'
                sh '''
                    # Aqui você colocaria os comandos para fazer deploy
                    # Por exemplo:
                    # - Construir a aplicação
                    # - Fazer upload para servidor
                    # - Reiniciar serviços
                    
                    echo "Deploy para staging seria executado aqui"
                    echo "Branch atual: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT}"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado!'
            
            // Limpa arquivos temporários
            sh '''
                # Remove cache do Cypress se necessário
                rm -rf ${CYPRESS_CACHE_FOLDER} || true
                
                # Remove node_modules se quiser economizar espaço
                # rm -rf node_modules || true
            '''
        }
        
        success {
            echo '✅ Pipeline executado com sucesso!'
            
            // Envia notificação de sucesso (exemplo com Slack)
            // slackSend(
            //     channel: '#dev-team',
            //     color: 'good',
            //     message: "✅ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} executado com sucesso!"
            // )
        }
        
        failure {
            echo '❌ Pipeline falhou!'
            
            // Envia notificação de falha
            // slackSend(
            //     channel: '#dev-team',
            //     color: 'danger',
            //     message: "❌ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} falhou! Verifique os logs."
            // )
            
            // Arquiva logs para análise
            archiveArtifacts artifacts: 'cypress/logs/**/*', allowEmptyArchive: true
        }
        
        changed {
            echo 'Status do pipeline mudou desde a última execução'
        }
    }
}

