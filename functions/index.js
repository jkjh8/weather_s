const functions = require('firebase-functions')
const admin = require('firebase-admin')

const { v4: uuidv4 } = require('uuid')

const serviceAccount = require('./adminkey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://weatherpicker-default-rtdb.firebaseio.com'
})

const db = admin.firestore()
const colKeys = db.collection('keys')
const colUsers = db.collection('users')

async function getKey () {
  const keyArray = []
  const keys = await colKeys.get()
  keys.forEach((key) => {
    keyArray.push(key.data())
  })
  return keyArray
}

exports.getApi = functions.https.onRequest(async (req, res) => {
  const uuid = req.query.uuid
  try {
    const user = await colUsers.where('uuid', '==', uuid).get()
    const uid = user._docs()[0].id
    const userValue = await user._docs()[0].data()
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

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const userUuid = uuidv4()
  const u = {
    email,
    displayName,
    photoURL,
    calls: 0,
    level: 5,
    enable: false,
    uuid: userUuid
  }
  colUsers.doc(uid).set(u)
})
