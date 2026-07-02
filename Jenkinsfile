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
                scp -o StrictHostKeyChecking=no -i "C:\\Jenkins\\Keys\\student-management-key.pem" -r * ec2-user@52.205.214.136:/home/ec2-user/student-management

                ssh -o StrictHostKeyChecking=no -i "C:\\Jenkins\\Keys\\student-management-key.pem" ec2-user@52.205.214.136 ^
                "sudo rm -rf /usr/share/nginx/html/* && sudo cp -r /home/ec2-user/student-management/* /usr/share/nginx/html/ && sudo systemctl restart nginx"
                '''
            }
        }

    }
}