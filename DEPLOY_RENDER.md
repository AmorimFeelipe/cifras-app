# Guia de Implantação no Render.com

Este guia explica como implantar sua aplicação de cifras no Render.com.

## Pré-requisitos

1. Uma conta no [GitHub](https://github.com) (ou GitLab/Bitbucket)
2. Uma conta no [Render.com](https://render.com) (gratuita)

## Passo 1: Enviar o Código para o GitHub

### 1.1. Criar um Novo Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito e selecione **"New repository"**
3. Preencha os campos:
   - **Repository name**: `cifras-app` (ou outro nome de sua preferência)
   - **Description**: "Aplicação web de cifras musicais" (opcional)
   - **Visibility**: Escolha "Public" ou "Private"
   - **NÃO** marque "Initialize this repository with a README" (já temos arquivos locais)
4. Clique em **"Create repository"**

### 1.2. Conectar o Repositório Local ao GitHub

Após criar o repositório, o GitHub mostrará instruções. Execute os seguintes comandos no terminal, **dentro da pasta do projeto** (`~/cifras-app`):

```bash
# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/cifras-app.git

# Envie o código para o GitHub
git push -u origin main
```

**Nota**: Se o GitHub solicitar autenticação, você pode usar um **Personal Access Token** em vez de senha. Veja como criar um token [aqui](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

## Passo 2: Implantar no Render.com

### 2.1. Criar uma Conta no Render

1. Acesse [Render.com](https://render.com)
2. Clique em **"Get Started"** ou **"Sign Up"**
3. Recomendo fazer login usando sua conta do GitHub (facilita a integração)

### 2.2. Criar um Novo Web Service

1. No painel do Render, clique em **"New +"** e selecione **"Web Service"**
2. Conecte seu repositório GitHub:
   - Se for a primeira vez, clique em **"Connect account"** e autorize o Render a acessar seus repositórios
   - Selecione o repositório `cifras-app` da lista
3. Clique em **"Connect"**

### 2.3. Configurar o Web Service

Preencha as configurações do serviço:

- **Name**: `cifras-app` (ou outro nome único)
- **Region**: Escolha a região mais próxima de você (ex: Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: Deixe em branco (ou `.` se solicitado)
- **Runtime**: **Python 3**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### 2.4. Escolher o Plano

- Selecione o plano **"Free"** (gratuito)
- O plano gratuito tem algumas limitações (como o serviço "dormir" após 15 minutos de inatividade), mas é perfeito para projetos pessoais

### 2.5. Criar o Web Service

1. Clique em **"Create Web Service"**
2. O Render começará a fazer o deploy automaticamente
3. Você verá os logs de build e deploy em tempo real
4. Aguarde até que o status mude para **"Live"** (pode levar alguns minutos)

## Passo 3: Acessar Sua Aplicação

Quando o deploy estiver completo:

1. O Render fornecerá uma URL pública no formato: `https://cifras-app-XXXX.onrender.com`
2. Clique na URL ou copie e cole no navegador
3. Sua aplicação de cifras estará online! 🎉

## Atualizações Futuras

Sempre que você fizer alterações no código:

```bash
# Adicione as alterações
git add .

# Faça um commit
git commit -m "Descrição das alterações"

# Envie para o GitHub
git push origin main
```

O Render detectará automaticamente as mudanças no GitHub e fará o **deploy automático** da nova versão!

## Adicionar Novas Músicas

Para adicionar novas cifras:

1. Crie um arquivo `.chord` na pasta `musicas/` no seu computador
2. Siga o formato ChordPro (veja exemplos nos arquivos existentes)
3. Faça commit e push para o GitHub:
   ```bash
   git add musicas/nova-musica.chord
   git commit -m "Adiciona nova música"
   git push origin main
   ```
4. O Render fará o deploy automático e a nova música aparecerá na lista!

## Solução de Problemas

### O serviço não inicia

- Verifique os logs no painel do Render
- Certifique-se de que o `requirements.txt` está correto
- Verifique se o comando de start está como `gunicorn app:app`

### Erro 404 ao acessar

- Verifique se o arquivo `app.py` está na raiz do repositório
- Confirme que a rota `/` está definida no `app.py`

### A aplicação está lenta

- No plano gratuito, o serviço "dorme" após 15 minutos de inatividade
- O primeiro acesso após o "sono" pode levar 30-60 segundos para acordar
- Para evitar isso, considere fazer upgrade para um plano pago

## Recursos Adicionais

- [Documentação do Render](https://render.com/docs)
- [Documentação do Flask](https://flask.palletsprojects.com/)
- [Formato ChordPro](https://www.chordpro.org/)

