const functions = require('firebase-functions')
const admin = require('firebase-admin')

const serviceAccount = require('./adminkey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://weatherpicker-default-rtdb.firebaseio.com'
})
const fstore = admin.firestore()

exports.getApi = functions.https.onRequest(async (req, res) => {
  const uuid = req.query.uuid
  try {
    const user = await fstore.collection('users').where('uuid', '==', uuid).get()
    if (user.empty) {
      res.sendStatus(400)
      return
    }
    const rtUser = []
    user.forEach((doc) => {
      rtUser.push(doc.data())
    })
    const rtKey = []
    const keys = await fstore.collection('keys').get()
    keys.forEach((key) => {
      rtKey.push({ id: key.id, key: key.data() })
    })
    res.status(200).json({ user: rtUser[0], keys: rtKey })
  } catch (err) {
    res.sendStatus(500)
  }
  res.send(uuid)
})
