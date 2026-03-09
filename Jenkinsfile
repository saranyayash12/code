pipeline {
agent any


stages {

    stage('Build Spring Boot') {
        steps {
            sh '''
            cd BACKEND/watch
            mvn clean package -DskipTests
            '''
        }
    }

    stage('Build Docker Images') {
        steps {
            sh 'docker compose build'
        }
    }

    stage('Stop Old Containers') {
        steps {
            sh 'docker compose down'
        }
    }

    stage('Deploy Containers') {
        steps {
            sh 'docker compose up -d'
        }
    }

}

}

