// Estado da aplicação
let allSongs = [];
let currentSong = null;
let transposeAmount = 0;

// Elementos do DOM
const searchInput = document.getElementById('search-input');
const songsList = document.getElementById('songs-list');
const songsCount = document.getElementById('songs-count');
const welcomeScreen = document.getElementById('welcome-screen');
const songDisplay = document.getElementById('song-display');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const chordSheet = document.getElementById('chord-sheet');
const transposeDown = document.getElementById('transpose-down');
const transposeUp = document.getElementById('transpose-up');
const transposeInfo = document.getElementById('transpose-info');

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await loadSongs();
    setupEventListeners();
});

// Carrega a lista de músicas da API
async function loadSongs() {
    try {
        const response = await fetch('/api/songs');
        if (!response.ok) throw new Error('Erro ao carregar músicas');
        
        allSongs = await response.json();
        renderSongsList(allSongs);
        updateSongsCount(allSongs.length);
    } catch (error) {
        console.error('Erro:', error);
        songsList.innerHTML = '<li class="error-message">Erro ao carregar músicas</li>';
    }
}

// Renderiza a lista de músicas
function renderSongsList(songs) {
    if (songs.length === 0) {
        songsList.innerHTML = '<li class="no-results">Nenhuma música encontrada</li>';
        return;
    }

    songsList.innerHTML = songs.map(song => `
        <li class="song-item" data-filename="${song.filename}">
            <svg class="song-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <span class="song-item-title">${song.title}</span>
        </li>
    `).join('');

    // Adiciona event listeners aos itens
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const filename = item.dataset.filename;
            loadSong(filename);
            
            // Atualiza seleção visual
            document.querySelectorAll('.song-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Carrega uma música específica
async function loadSong(filename) {
    try {
        const response = await fetch(`/api/songs/${filename}`);
        if (!response.ok) throw new Error('Erro ao carregar cifra');
        
        const chordSheetContent = await response.text();
        
        // Parse usando ChordSheetJS
        const parser = new ChordSheetJS.ChordProParser();
        currentSong = parser.parse(chordSheetContent);
        
        // Reset transposição
        transposeAmount = 0;
        
        // Atualiza UI
        updateSongInfo(currentSong);
        renderChordSheet(currentSong);
        
        // Mostra a área de exibição
        welcomeScreen.style.display = 'none';
        songDisplay.style.display = 'block';
        
    } catch (error) {
        console.error('Erro:', error);
        chordSheet.innerHTML = '<p class="error-message">Erro ao carregar cifra</p>';
    }
}

// Atualiza informações da música
function updateSongInfo(song) {
    const title = song.metadata.title || 'Sem título';
    const artist = song.metadata.artist || '';
    
    songTitle.textContent = title;
    songArtist.textContent = artist;
    songArtist.style.display = artist ? 'block' : 'none';
    
    updateTransposeInfo();
}

// Renderiza a cifra
function renderChordSheet(song) {
    const formatter = new ChordSheetJS.HtmlDivFormatter();
    chordSheet.innerHTML = formatter.format(song);
}

// Atualiza informação de transposição
function updateTransposeInfo() {
    if (transposeAmount === 0) {
        transposeInfo.textContent = 'Tom Original';
    } else {
        const sign = transposeAmount > 0 ? '+' : '';
        transposeInfo.textContent = `${sign}${transposeAmount} semitons`;
    }
}

// Transpõe a música
function transposeSong(semitones) {
    if (!currentSong) return;
    
    transposeAmount += semitones;
    const transposed = currentSong.transpose(transposeAmount);
    renderChordSheet(transposed);
    updateTransposeInfo();
}

// Filtra músicas
function filterSongs(searchTerm) {
    const filtered = allSongs.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderSongsList(filtered);
    updateSongsCount(filtered.length);
}

// Atualiza contador de músicas
function updateSongsCount(count) {
    songsCount.textContent = count;
}

// Configura event listeners
function setupEventListeners() {
    // Busca
    searchInput.addEventListener('input', (e) => {
        filterSongs(e.target.value);
    });

    // Transposição
    transposeDown.addEventListener('click', () => transposeSong(-1));
    transposeUp.addEventListener('click', () => transposeSong(1));

    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            transposeSong(1);
        } else if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            transposeSong(-1);
        }
    });
}

