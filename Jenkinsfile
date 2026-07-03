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
        echo Deploying Student Management to EC2
        echo =========================================

        "C:\\Program Files\\Git\\usr\\bin\\scp.exe" ^
        -o StrictHostKeyChecking=no ^
        -i "C:\\Jenkins\\Keys\\student-management-key.pem" ^
        -r * ec2-user@52.205.214.136:/home/ec2-user/student-management

        "C:\\Program Files\\Git\\usr\\bin\\ssh.exe" ^
        -o StrictHostKeyChecking=no ^
        -i "C:\\Jenkins\\Keys\\student-management-key.pem" ^
        ec2-user@52.205.214.136 "echo Deployment completed successfully"
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
