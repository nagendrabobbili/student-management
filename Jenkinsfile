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
        sshagent(['ec2-key']) {
            bat '''
            scp -o StrictHostKeyChecking=no -r * ec2-user@52.205.214.136:/home/ec2-user/student-management

            ssh ec2-user@52.205.214.136 ^
            "sudo rm -rf /usr/share/nginx/html/* && sudo cp -r /home/ec2-user/student-management/* /usr/share/nginx/html/ && sudo systemctl restart nginx"
            '''
        }
    }
}

    }
}