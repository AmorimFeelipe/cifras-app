from flask import Flask, jsonify, send_from_directory, send_file
import os
import re

app = Flask(__name__, static_folder='static')

MUSICAS_DIR = os.path.join(os.path.dirname(__file__), 'musicas')

def extract_title_from_chord(filepath):
    """Extrai o título e artista do arquivo .chord"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read(500)  # Lê apenas os primeiros 500 caracteres
            
            title_match = re.search(r'\{title:\s*([^}]+)\}', content, re.IGNORECASE)
            artist_match = re.search(r'\{artist:\s*([^}]+)\}', content, re.IGNORECASE)
            
            title = title_match.group(1).strip() if title_match else None
            artist = artist_match.group(1).strip() if artist_match else None
            
            if title and artist:
                return f"{title} - {artist}"
            elif title:
                return title
            else:
                # Se não encontrar, usa o nome do arquivo
                return os.path.splitext(os.path.basename(filepath))[0].replace('-', ' ').title()
    except Exception:
        return os.path.splitext(os.path.basename(filepath))[0].replace('-', ' ').title()

@app.route('/')
def index():
    return send_file('static/index.html')

@app.route('/api/songs')
def list_songs():
    """Lista todas as músicas disponíveis na pasta musicas/"""
    try:
        songs = []
        for filename in os.listdir(MUSICAS_DIR):
            if filename.endswith('.chord'):
                filepath = os.path.join(MUSICAS_DIR, filename)
                title = extract_title_from_chord(filepath)
                songs.append({
                    'filename': filename,
                    'title': title
                })
        
        # Ordena alfabeticamente pelo título
        songs.sort(key=lambda x: x['title'].lower())
        
        return jsonify(songs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/songs/<filename>')
def get_song(filename):
    """Retorna o conteúdo de uma música específica"""
    try:
        # Segurança: verifica se o arquivo existe e está na pasta correta
        if not filename.endswith('.chord'):
            return jsonify({'error': 'Invalid file type'}), 400
        
        filepath = os.path.join(MUSICAS_DIR, filename)
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return content, 200, {'Content-Type': 'text/plain; charset=utf-8'}
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)

