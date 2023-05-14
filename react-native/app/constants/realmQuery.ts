import LZString from 'lz-string'
import * as Realm from 'realm-web'

let collection

connect()
// .then(() => collection.deleteMany({}))
// .then(() => addUncompressedToken({ token: 'test test test hello' }))
// .then((uuid) => getUncompressedToken(uuid))
// .then(console.log)

async function connect() {
  const app = new Realm.App({ id: 'data-rsxwi' })

  const user: Realm.User = await app.logIn(
    Realm.Credentials.apiKey(
      'owPZtoMmFaePhNaP8EyvnG5lGPoNv0i7EaAvBvDjjpdlhMs9M2atvier77I8ojyl',
    ),
  )

  const mongo = app.currentUser.mongoClient('Cluster0')
  collection = mongo.db('db0').collection('coll0')
}

//Returns the UUID of the newly created record
export async function addRawToken(token) {
  const result = await collection.insertOne({ token })

  return result.insertedId.toString()
}

//Retrieve the compressed data
export async function getRawToken(uuid) {
  const result = await collection.findOne({
    _id: new Realm.BSON.ObjectId(uuid),
  })

  return result.token
}

//Returns the UUID of the newly created record
export async function addUncompressedToken(obj) {
  const compressedToken = LZString.compress(JSON.stringify(obj))

  const rp = await addRawToken(compressedToken)

  return rp
}

//Retrieve and uncompress the data into a JSON string
export async function getUncompressedToken(uuid) {
  const compressed = await getRawToken(uuid)

  const token = LZString.decompress(compressed)

  return token
}
