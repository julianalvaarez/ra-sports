export function getIdYoutube(url: string | null) {
    if (!url) return null;

    // Esta expresión regular cubre casi todos los formatos de URLs de YouTube
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    // Los IDs de YouTube siempre tienen exactamente 11 caracteres
    return (match && match[2].length === 11) ? match[2] : null;
}