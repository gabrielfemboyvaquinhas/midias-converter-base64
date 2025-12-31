const translations = {
    pt: {
        title: 'Conversor de Mídias para Base64',
        subtitle: 'Converta imagens, vídeos, áudios e outros arquivos para Base64',
        uploadText: 'Clique para selecionar arquivo',
        uploadSubtext: 'Suporta todos os formatos: imagens, vídeos, áudios, documentos, etc.',
        fileLabel: 'Arquivo:',
        typeLabel: 'Tipo:',
        sizeLabel: 'Tamanho:',
        previewTitle: 'Preview',
        resultTitle: 'Resultado Base64',
        copyBtn: 'Copiar',
        downloadBtn: 'Download .txt',
        developedBy: 'Desenvolvido por <strong>Gabriel Femboy Vaquinha</strong>',
        githubStar: 'Se você gostou deste projeto, deixe uma ⭐ no <a href="https://github.com/gabrielfemboyvaquinhas/midias-converter-base64/" target="_blank">GitHub</a>!',
        copied: 'Copiado!',
        unknown: 'Desconhecido',
        error: 'Erro ao ler o arquivo. Por favor, tente novamente.',
        previewNotAvailable: 'Preview não disponível para este tipo de arquivo'
    },
    en: {
        title: 'Media to Base64 Converter',
        subtitle: 'Convert images, videos, audios and other files to Base64',
        uploadText: 'Click to select file',
        uploadSubtext: 'Supports all formats: images, videos, audios, documents, etc.',
        fileLabel: 'File:',
        typeLabel: 'Type:',
        sizeLabel: 'Size:',
        previewTitle: 'Preview',
        resultTitle: 'Base64 Result',
        copyBtn: 'Copy',
        downloadBtn: 'Download .txt',
        developedBy: 'Developed by <strong>Gabriel Femboy Vaquinha</strong>',
        githubStar: 'If you liked this project, leave a ⭐ on <a href="https://github.com/gabrielfemboyvaquinhas/midias-converter-base64/" target="_blank">GitHub</a>!',
        copied: 'Copied!',
        unknown: 'Unknown',
        error: 'Error reading file. Please try again.',
        previewNotAvailable: 'Preview not available for this file type'
    },
    es: {
        title: 'Conversor de Medios a Base64',
        subtitle: 'Convierte imágenes, videos, audios y otros archivos a Base64',
        uploadText: 'Haz clic para seleccionar archivo',
        uploadSubtext: 'Soporta todos los formatos: imágenes, videos, audios, documentos, etc.',
        fileLabel: 'Archivo:',
        typeLabel: 'Tipo:',
        sizeLabel: 'Tamaño:',
        previewTitle: 'Vista Previa',
        resultTitle: 'Resultado Base64',
        copyBtn: 'Copiar',
        downloadBtn: 'Descargar .txt',
        developedBy: 'Desarrollado por <strong>Gabriel Femboy Vaquinha</strong>',
        githubStar: '¡Si te gustó este proyecto, deja una ⭐ en <a href="https://github.com/gabrielfemboyvaquinhas/midias-converter-base64/" target="_blank">GitHub</a>!',
        copied: '¡Copiado!',
        unknown: 'Desconocido',
        error: 'Error al leer el archivo. Por favor, inténtalo de nuevo.',
        previewNotAvailable: 'Vista previa no disponible para este tipo de archivo'
    }
};

let currentLang = localStorage.getItem('language') || 'pt';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    setLanguage(currentLang);
});

const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileType = document.getElementById('fileType');
const fileSize = document.getElementById('fileSize');
const previewSection = document.getElementById('previewSection');
const previewContainer = document.getElementById('previewContainer');
const resultSection = document.getElementById('resultSection');
const base64Output = document.getElementById('base64Output');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

fileInput.addEventListener('change', handleFileSelect);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadAsText);

function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    fileName.textContent = file.name;
    fileType.textContent = file.type || translations[currentLang].unknown;
    fileSize.textContent = formatFileSize(file.size);
    
    fileInfo.classList.remove('hidden');

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64String = e.target.result;
        base64Output.value = base64String;
        
        showPreview(file, base64String);
        
        resultSection.classList.remove('hidden');
    };
    
    reader.onerror = function() {
        alert(translations[currentLang].error);
    };
    
    reader.readAsDataURL(file);
}

function showPreview(file, base64String) {
    previewContainer.innerHTML = '';
    
    const fileTypeCategory = file.type.split('/')[0];
    
    if (fileTypeCategory === 'image') {
        const img = document.createElement('img');
        img.src = base64String;
        img.alt = file.name;
        previewContainer.appendChild(img);
        previewSection.classList.remove('hidden');
    } else if (fileTypeCategory === 'video') {
        const video = document.createElement('video');
        video.src = base64String;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '400px';
        previewContainer.appendChild(video);
        previewSection.classList.remove('hidden');
    } else if (fileTypeCategory === 'audio') {
        const audio = document.createElement('audio');
        audio.src = base64String;
        audio.controls = true;
        audio.style.width = '100%';
        previewContainer.appendChild(audio);
        previewSection.classList.remove('hidden');
    } else {
        const fileIcon = document.createElement('div');
        fileIcon.className = 'file-icon';
        fileIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <p>${file.name}</p>
            <p style="font-size: 0.9rem; color: #b45309; margin-top: 5px;">${translations[currentLang].previewNotAvailable}</p>
        `;
        previewContainer.appendChild(fileIcon);
        previewSection.classList.remove('hidden');
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function copyToClipboard() {
    base64Output.select();
    base64Output.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(base64Output.value).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span data-i18n="copied">${translations[currentLang].copied}</span>
        `;
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(() => {
        document.execCommand('copy');
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span data-i18n="copied">${translations[currentLang].copied}</span>
        `;
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
}

function downloadAsText() {
    const base64Content = base64Output.value;
    const blob = new Blob([base64Content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${fileName.textContent}.base64.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
