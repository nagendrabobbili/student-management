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
                bat '"C:\\Users\\bobbi\\AppData\\Roaming\\npm\\firebase.cmd" --version'
            }
        }

        stage('Deploy to Firebase') {
            steps {
                bat '"C:\\Users\\bobbi\\AppData\\Roaming\\npm\\firebase.cmd" deploy --token %FIREBASE_TOKEN%'
            }
        }
    }
}