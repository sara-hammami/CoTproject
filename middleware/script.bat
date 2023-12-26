@echo off

set WILDFLY_HOME=D:\wildfly-30.0.0.Final\wildfly-30.0.0.Final
set WAR_NAME=org.eclipse.jakarta.hello-1.0-SNAPSHOT.war

echo Building...
mvn clean package

echo Deploying...
copy /Y target\%WAR_NAME% %WILDFLY_HOME%\standalone\deployments

%WILDFLY_HOME%\bin\jboss-cli.bat --connect --command="deploy --force=1 %WAR_NAME%"
echo Deployment complete.
