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
    fileType.textContent = file.type || 'Desconhecido';
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
        alert('Erro ao ler o arquivo. Por favor, tente novamente.');
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
            <p style="font-size: 0.9rem; color: #b45309; margin-top: 5px;">Preview não disponível para este tipo de arquivo</p>
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
            Copiado!
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
            Copiado!
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
