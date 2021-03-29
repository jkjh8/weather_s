const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const Crypto = require('crypto-js')

const serviceAccount = require('./adminkey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://weatherpicker-default-rtdb.firebaseio.com'
})

const db = admin.firestore()
const rdb = admin.database().ref()
const colKeys = db.collection('keys')
const colUsers = db.collection('users')

async function getKey () {
  const keyArray = []
  const keys = await colKeys.get()
  keys.forEach((key) => {
    const rtValue = { id: key.id, key: key.data() }
    keyArray.push(rtValue)
  })
  return keyArray
}

async function getStation () {
  const stations = await rdb.child('stations').get()
  if (stations.exists()) {
    return stations.val()
  } else {
    console.log('No data available')
  }
  // return Object.values(stations.val())
}

function encode (data) {
  return Crypto.AES.encrypt(data, 'password').toString()
}

function decode (data) {
  return Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
}

exports.getApi = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const uid = decode(req.query.uuid)
    try {
      const user = await colUsers.doc(uid).get()
      const userValue = await user.data()
      if (user.empty) return res.sendStatus(401)
      if (!userValue.enable) return res.sendStatus(403)
      const keys = await getKey()
      const calls = userValue.calls + 1
      colUsers.doc(uid).set({ calls: calls }, { merge: true })
      return res.status(200).json({ user: userValue, keys: keys })
    } catch (err) {
      return res.status(500).json({ error: err })
    }
  })
})

exports.getStation = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const uid = decode(req.query.uuid)
    try {
      const user = await colUsers.doc(uid).get()
      const userValue = await user.data()
      if (user.empty) return res.sendStatus(401)
      if (!userValue.enable) return res.sendStatus(403)
      const stations = await getStation()
      return res.status(200).json({ user: userValue, stations: stations })
    } catch (err) {
      return res.status(500).json({ error: err })
    }
  })
})

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const uuid = encode(uid)
  const u = {
    email,
    displayName,
    photoURL,
    calls: 0,
    level: 5,
    enable: false,
    uuid: uuid
  }
  colUsers.doc(uid).set(u)
})
