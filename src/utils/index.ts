function isValidURL(url:string) {
    var res = url.match(/(https?:\/\/[^ ]*)/g);
    return (res !== null);
};

export {
    isValidURL
}