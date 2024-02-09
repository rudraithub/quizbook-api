# Setup Ubunut server


### Upgrade latest package
```sh
sudo apt update -y
```

### Install mysql-client
```sh
sudo apt install mysql-client-core-8.0
```

### Install Nginx & Setup
```sh
sudo apt install nginx -y
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
sudo cp config/nginx.conf /etc/nginx/nginx.conf
```

### Install Node.Js
```sh
sudo apt install ca-certificates curl gnupg -y
sudo apt install curl -y
sudo mkdir -p /etc/apt/keyrings && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_21.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt update
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v18.18.0/

node -v
npm -v
```

### Clone repo to server
1. Add Server key to GitHub repo
2. Create folder and pull code

```sh
mkdir ~/code
cd ~/code
git clone git@github.com:rudraithub/quizbook-api.git
```


### Database connectivity test
```sh
telnet rihdb.cd4iqywkwn5q.ap-south-1.rds.amazonaws.com 3306
```

### Database connection test
```sh
source .env
mysql -u $MYSQL_QZ_USERNAME -h $MYSQL_DB_SERVER $MYSQL_QZ_DB_NAME -P 3306 -p$MYSQL_QZ_PASSWORD
show databases;
```

