# Finance tracker
## About the project

## Jenkins Pipeline
pipeline {
    agent any
    
    environment {
        registryCredential = "docker_credentials"
        BACKEND_IMAGE = 'avantikaaa/finance-tracker-server'
        FRONTEND_IMAGE = 'avantikaaa/finance-tracker-client'
        serverImage = ""
        clientImage = ""
    }
    
    stages {
        stage('Git Pull') {
            steps {
                // Pulls code from my github repo
                git url: 'https://github.com/avantikaaa/finance-tracker.git', branch: 'main'
            }
        }
        stage('Build Backend Image') {
            steps {
                dir('server') {
                    script {
                        serverImage = docker.build BACKEND_IMAGE + ":latest"
                    }    
                }
            }
        }
        stage('Push Backend Image') {
            steps{
                script{
                    docker.withRegistry( '', registryCredential) {
                        serverImage.push()
                    }  
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                dir('client') {
                    script {
                        clientImage = docker.build FRONTEND_IMAGE + ":latest"
                    }    
                }
            }
        }
        
        stage('Push Frontend Image') {
            steps{
                script{
                    docker.withRegistry( '', registryCredential) {
                        clientImage.push()
                    }
                }
            }
        }
        stage('Deploy using ansible'){
            steps{
                ansiblePlaybook colorized: true, disableHostKeyChecking: true, installation: 'Ansible', inventory: 'inventory', playbook: 'playbook.yml'
                // sh 'ansible-playbook playbook.yml -i inventory'
            }
        }
    }
}