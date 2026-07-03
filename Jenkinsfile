pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to EC2') {
            steps {
                bat '''
                echo =========================================
                echo Deploying to EC2
                echo =========================================

                scp -i "C:\\Jenkins\\Keys\\student-management-key.pem" -o StrictHostKeyChecking=no -r * ec2-user@52.205.214.136:/home/ec2-user/student-management

                ssh -i "C:\\Jenkins\\Keys\\student-management-key.pem" -o StrictHostKeyChecking=no ec2-user@52.205.214.136 "echo Deployment completed"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Deployment Failed!'
        }
    }
}