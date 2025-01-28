const express = require('express');
const mongoose = require('mongoose');
const{MongoClient} = require("mongodb");
const url = "mongodb://localhost:27017/student"
const databse = 'studentData'
const client = new MongoClient(url);
async function getdata() {
    let result = await client.connect();
    let db = result.db(databse);
    return db.collection('details')
}

module.exports = getdata;

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/studentData');

const studentSchema = new mongoose.Schema({
    name: String,
    course: String,
    age: Number
});

const Student = mongoose.model('details', studentSchema);

app.post('/form', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.send("Student added successfully");
});

app.get('/view', async (req, res) => {
    try {
        const data = await Student.find();
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

app.delete('/delete', async (req, res) => {
    const { name, course } = req.body;

    try {
      const result = await Student.findOneAndDelete({ name, course });
      if (result) {
        res.status(200).json({ message: "Record deleted successfully" });
      } else {
        res.status(404).json({ message: "No matching record found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting record", error });
    }
});

app.listen(3010, () => console.log("Server running"));

