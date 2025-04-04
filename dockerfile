# Use uma imagem base com Node.js e outras dependências
FROM node:16

# Crie um diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e yarn.lock ou package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código-fonte para dentro do contêiner
COPY . .

# Exponha a porta que o servidor irá rodar
EXPOSE 8081

# Comando para rodar o servidor do React Native
CMD ["npm", "start"]
