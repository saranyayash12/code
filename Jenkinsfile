pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/saranyayash12/code.git'
            }
        }

        stage('Build Spring Boot') {
            steps {
                sh 'cd BACKEND && mvn clean package'
            }
        }

        stage('Build React') {
            steps {
                sh 'cd FRONTEND && npm install'
                sh 'cd FRONTEND && npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker-compose down'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
