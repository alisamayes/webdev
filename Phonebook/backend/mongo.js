const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('give password, name and number as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://alisamayes_db_user:${password}@cluster0.ytqhhx3.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })



const userSchema = new mongoose.Schema({
    name: String,
    number: String,
})
  
const User = mongoose.model('User', userSchema)

const user = new User({
    name: name,
    number: number,
})


user.save().then(result => {
  console.log('user saved!')
  //mongoose.connection.close()
})

User.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})