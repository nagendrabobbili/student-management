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
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'KEY')]) {
                    bat '''
                    scp -o StrictHostKeyChecking=no -i %KEY% -r * ec2-user@52.205.214.136:/home/ec2-user/student-management

                    ssh -o StrictHostKeyChecking=no -i %KEY% ec2-user@52.205.214.136 "cd /home/ec2-user/student-management && ./deploy.sh"
                    '''
                }
            }
        }
    }
}