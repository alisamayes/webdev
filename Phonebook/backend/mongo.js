const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password || (name && !number) || (!name && number)) {
  console.log('give password, or password with name and number as arguments')
  process.exit(1)
}

const url = `mongodb+srv://alisamayes_db_user:${password}@cluster0.ytqhhx3.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const userSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const User = mongoose.model('User', userSchema)

const listUsers = () =>
  User.find({}).then(result => {
    result.forEach(user => console.log(user))
    mongoose.connection.close()
  })

if (name && number) {
  const user = new User({ name, number })

  user
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      return listUsers()
    })
    .catch(error => {
      console.error(error)
      mongoose.connection.close()
    })
} else {
  listUsers().catch(error => {
    console.error(error)
    mongoose.connection.close()
  })
}
