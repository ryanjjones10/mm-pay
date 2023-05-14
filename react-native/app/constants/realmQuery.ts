import LZString from 'lz-string'
import * as Realm from 'realm-web'

let collection

connect()
  // .then(() => collection.deleteMany({}))
  // .then(() => addUncompressedData({ data: 'test testd test hello' }))
  // .then((uuid) => getUncompressedData(uuid))
  // .then(() => getRawData('646041e3fdc5b4de5892b274'))
  // .then((a) => console.log(a))

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
export async function addRawData(data) {
  const result = await collection.insertOne({ data })

  return result.insertedId.toString()
}

//Retrieve the compressed data
export async function getRawData(uuid) {
  const result = await collection.findOne({
    _id: new Realm.BSON.ObjectId(uuid),
  })

  return result.data
}

//Returns the UUID of the newly created record
export async function addUncompressedData(obj) {
  const compressedData = LZString.compress(JSON.stringify(obj))

  const rp = await addRawData(compressedData)

  return rp
}

//Retrieve and uncompress the data into a JSON string
export async function getUncompressedData(uuid) {
  const compressed = await getRawData(uuid)

  const data = LZString.decompress(compressed)

  return data
}
