export const encodePath = (path) => {
    const firstEncoded = btoa(path);
    const urlEncoded = encodeURIComponent(firstEncoded);
    const secondEncoded = btoa(urlEncoded);
    return secondEncoded;
}

export const decodePath = (path) => {
    const secondDecoded = atob(path);
    const urlDecoded = decodeURIComponent(secondDecoded);
    const firstDecoded = atob(urlDecoded);
    return firstDecoded;
}