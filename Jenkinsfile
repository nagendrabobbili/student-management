pipeline {
    agent any

    environment {
        FIREBASE_TOKEN = credentials('firebase-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Firebase CLI') {
            steps {
                bat 'firebase --version'
            }
        }

        stage('Deploy to Firebase') {
            steps {
                bat 'firebase deploy --token %FIREBASE_TOKEN%'
            }
        }
    }
}