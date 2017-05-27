function asyncAssets(assets) {
    return assets.reduce((assetss,asset) => {
        assetss[asset] = import(`./${asset}`);
        return assetss;
    })
}
export default {
    ...asyncAssets([
        'logo.png',
    ])
}