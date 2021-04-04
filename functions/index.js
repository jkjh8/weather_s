const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const Crypto = require('crypto-js')
const moment = require('moment')

const serviceAccount = require('./adminkey.json')
const { default: axios } = require('axios')

moment.locale('ko')

// encode uuid
function encode (data) {
  return Crypto.AES.encrypt(data, 'password').toString()
}

function decode (data) {
  return Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
}

// admins init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://weatherpicker-default-rtdb.firebaseio.com'
})

// real time database
const db = admin.database()

async function getKey () {
  const keyArray = []
  const keys = await db.ref('keys').get()
  keys.forEach((key) => {
    const rtValue = { id: key.key, key: key.val() }
    keyArray.push(rtValue)
  })
  return keyArray
}

async function getStation () {
  const stations = await db.ref().child('stations').get()
  if (stations.exists()) {
    return stations.val()
  } else {
    console.log('No data available')
  }
  // return Object.values(stations.val())
}

exports.getApi = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const uid = decode(req.query.uuid)
    console.log(uid)
    try {
      const user = await db.ref('users').child(uid).get()
      let userValue
      if (user.exists()) {
        userValue = user.val()
      } else {
        return res.sendStatus(401)
      }
      if (!userValue.enable) return res.sendStatus(403)
      const keys = await getKey()
      const calls = userValue.calls + 1
      db.ref('users').child(uid).update({ calls: calls })
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
      const user = await db.ref('users').child(uid).get()
      let userValue
      if (user.exists()) {
        userValue = user.val()
      } else {
        return res.sendStatus(401)
      }
      if (!userValue.enable) return res.sendStatus(403)
      const stations = await getStation()
      const calls = userValue.getStations + 1
      db.ref('users').child(uid).update({ getStations: calls })
      return res.status(200).json({ user: userValue, stations: stations })
    } catch (err) {
      return res.status(500).json({ error: err })
    }
  })
})

exports.getdust = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const uid = decode(req.query.uuid)
    const station = req.query.station
    console.log(uid, station)
    try {
      const user = await db.ref('users').child(uid).get()
      let userValue
      if (user.exists()) {
        userValue = user.val()
      } else {
        return res.sendStatus(401)
      }
      if (!userValue.enable) return res.sendStatus(403)
      const r = await db.ref('dust').child('stations').child(station).get()
      const rt = r.val()
      const gettime = userValue.getdust + 1
      db.ref('users').child(uid).update({ getdust: gettime })
      return res.status(200).json({ user: userValue, dust: rt })
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
    getdust: 0,
    getStations: 0,
    level: 5,
    enable: false,
    uuid: uuid
  }
  // colUsers.doc(uid).set(u)
  return db.ref('users').child(uid).update(u)
})

// exports.getdust = functions.https.onRequest(async (req, res) => {
exports.scheduledFunction = functions.pubsub.schedule('16 * * * *').timeZone('Asia/Seoul').onRun(async (context) => {
  const k = await db.ref('keys').child('data').child('key').get()
  const dataKey = decode(k.val())
  const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?ServiceKey=${dataKey}&returnType=json&numOfRows=1000&pageNo=1&sidoName=${encodeURIComponent('전국')}&ver=1.0`
  axios.get(url).then((r) => {
    const now = moment().format()
    const rt = {}
    const items = r.data.response.body.items
    for (let i = 0; i < items.length; i++) {
      rt[items[i].stationName] = items[i]
    }
    db.ref('dust').child('updatedAt').set(now)
    return db.ref('dust').child('stations').set(rt)
  }).catch((err) => {
    console.log(err)
    return null
  })
})
