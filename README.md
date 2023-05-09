# Finance tracker
## About the project

## Jenkins Pipeline
```
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
```

## Running the pipeline:
1. Add your docker hub credentials to your Jenkins credential manager with the ID "docker_credentials".
2. Update absolute path in the ansible playbook to point to the location where you will run the docker-compose file.
3. Update the absolute path of the volume in the docker compose file to point to the location where you want to store the database.
4. Trigger a build, either manually or through webhooks. This pulls 3 docker images for the frontend(client), backend(server) and the database(mongodb) respectively and starts their containers in the background.
5. Visit: http://localhost:3000/ to use the application