const IpfsHttpClient = require('ipfs-http-client')

//const ipfs = IpfsHttpClient('http://localhost:5001')
const ipfs = IpfsHttpClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export default ipfs