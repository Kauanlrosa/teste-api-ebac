pipeline {
  agent any

  tools {
    nodejs 'NodeLocal'   
  }

  options { timestamps() }

  stages {
    stage('Instalar dependências') {
      steps {
        bat 'npm ci || npm install'
      }
    }

    stage('Verificar Cypress') {
      steps {
        bat 'npx cypress verify'
      }
    }

    stage('Executar testes API') {
      steps {
        bat 'set NO_COLOR=1 && npx cypress run --headless --browser electron'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**', allowEmptyArchive: true
    }
  }
}