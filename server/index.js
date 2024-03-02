const express = require('express');
const app = express();
const { data } = require("./models");
const { dataToBeAdded } = require('./data.js');
const cors = require('cors')
app.use(cors());
const setData = async (datafrom) => {
    const { sno, customer_name, age, phone, location } = datafrom;
    await data.create({ sno: sno, customer_name: customer_name, age: age, phone: phone, location: location });
};
let isthere = null
data.findOne({where:{sno:1}}).then((data)=>{isthere=data})

if (!isthere) {
    for (let i = 0; i < dataToBeAdded.length; i++) {
        setData(dataToBeAdded[i]); 
    }
}

app.get('/data', async (req, res) => { 
    const fetchedData = await data.findAll({order:[["sno","ASC"]]});
    const modifiedData = fetchedData.map(item => {
        const createdAtDate = new Date(item.dataValues.createdAt).toLocaleDateString();
        const createdAtTime = new Date(item.dataValues.createdAt).toLocaleTimeString();
        return { ...item,  date: createdAtDate, time: createdAtTime };
    });
    res.json(modifiedData); 
});

app.listen(4000, () => { 
    console.log('Server started at port 4000');
});

module.exports = app; 
