pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Running build automation'
		sh 'npm install'
	
            }
        }
       stage('Test') {
            steps {
                sh 'node --version'
		sh 'scripts/test'
            }
        }
        stage('Build Docker image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    app = docker.build("nettadmin/taasiyeda-taki")
                }
            }
        }
        stage('Push Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub_login') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
	    input 'Deploy to Production?'
            milestone(1)
            steps {
		script {
                    sshagent (credentials: ['app_server_loginkey']) {
		        sh "ssh -o StrictHostKeyChecking=no jenkins_deploy@$app_server_ip \"uname -a\""
		        sh "ssh -o StrictHostKeyChecking=no jenkins_deploy@$app_server_ip \"docker pull nettadmin/taasiyeda-taki:${env.BUILD_NUMBER}\""
                        try {
                            sh "ssh -o StrictHostKeyChecking=no jenkins_deploy@$app_server_ip \"docker stop taasiyeda-taki\""
                            sh "ssh -o StrictHostKeyChecking=no jenkins_deploy@$app_server_ip \"docker rm taasiyeda-taki\""
                        } catch (err) {
                            echo: 'caught error: $err'
                        }
                        sh "ssh -o StrictHostKeyChecking=no jenkins_deploy@$app_server_ip \"docker run --restart always --name taasiyeda-taki -p 8080:8080 -d nettadmin/taasiyeda-taki:${env.BUILD_NUMBER}\""
                    }
	        }
            }
        }
    }
}	

