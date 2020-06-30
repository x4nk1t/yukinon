exports.random = () => {
    return Math.floor(Math.random() * (0xffffff + 1));
}

exports.color = (hexString) => {
    return parseInt(hexString.replace('#', ''), 16);
}