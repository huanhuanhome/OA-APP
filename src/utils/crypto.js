import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('1234123412ABCDEF') // 十六位十六进制数密钥
const IV = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') // 十六位十六进制数密钥偏移量

/**
 * 加密
 * @param {String} data 需要加密的数据
 * @return base64格式的密文
 */
export function Encrypt(data) {
    if (typeof data !== 'string') {
        console.error('加密的数据必须为字符串')
    }
    const encrypted = CryptoJS.AES.encrypt(
        data,
        KEY,
        {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    )
    return encrypted.toString()
}

/**
 * 解密
 * @param {String} data 需要解密的数据
 * @return 解密之后的数据
 */
export function Decrypt(encryptedData) {
    const decrypted = CryptoJS.AES.decrypt(
        encryptedData,
        KEY,
        {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    )
    return decrypted.toString(CryptoJS.enc.Utf8)
}
