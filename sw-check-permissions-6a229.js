function getYmid() {
    try {
        return new URL(location.href).searchParams.get('ymid');
    } catch (e) {
        console.warn(e);
    }
    return null;
}
function getVar() {
    try {
        return new URL(location.href).searchParams.get('var');
    } catch (e) {
        console.warn(e);
    }
    return null;
}
self.options = {
    "domain": "diehardalbion.top",  // <-- SEU DOMÍNIO AQUI
    "resubscribeOnInstall": true,
    "zoneId": 10474314,
    "ymid": getYmid(),
    "var": getVar()
}
self.lary = "";
importScripts('https://10zon.com/act/files/sw.perm.check.min.js?r=sw');
