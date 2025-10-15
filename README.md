# Minhas Cifras

Um aplicativo web moderno para visualizar e gerenciar cifras de músicas, com suporte a transposição de tom e busca em tempo real.

## Funcionalidades

- 🎵 **Listagem Alfabética**: Todas as músicas são ordenadas automaticamente de A a Z
- 🔍 **Busca em Tempo Real**: Filtre músicas rapidamente usando o campo de busca
- 🎼 **Transposição de Tom**: Suba ou baixe o tom das cifras com um clique
- 📱 **Design Responsivo**: Interface moderna que funciona em qualquer dispositivo
- 🎨 **Interface Intuitiva**: Design limpo e profissional para melhor experiência

## Como Adicionar Novas Músicas

1. Crie um arquivo `.chord` na pasta `musicas/`
2. Use o formato ChordPro para escrever a cifra:

```chordpro
{title: Nome da Música}
{artist: Nome do Artista}
{key: Tom Original}

{start_of_verse}
Letra com [Acordes] intercalados
{end_of_verse}

{start_of_chorus}
Refrão com [Acordes]
{end_of_chorus}
```

3. A música aparecerá automaticamente na lista!

## Tecnologias Utilizadas

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Biblioteca de Cifras**: ChordSheetJS
- **Hospedagem**: Render.com

## Desenvolvimento Local

```bash
# Instale as dependências
pip install -r requirements.txt

# Execute o servidor
python app.py

# Acesse no navegador
http://localhost:5000
```

## Licença

Este projeto é de uso pessoal.

