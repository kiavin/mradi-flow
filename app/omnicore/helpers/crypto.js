import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'Gk$e3lbvXi!n7kpiLamr@i9eZ@q220T4'

export function encrypt(data) {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

export function decrypt(cipherText) {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
        return bytes.toString(CryptoJS.enc.Utf8)
    } catch {
        return null
    }
}
