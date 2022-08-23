import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get('/users', function(req, res) {
    // let url = req.url
    // const index = url.indexOf('?')
    // if(index!==-1){
    //     url = url.slice(index+1)
    //     let params = url.split('&')
    //     params = params.map((e)=>{
    //         const x = e.split('=')
    //         x[0]=`String(e.${x[0]})`
    //         x[1]=`'${x[1]}'`
    //         return x.join('===') 
    //     })
    //     console.log(params)
    //     const str = params.join(' && ')
    //     console.log(str)
    //     const users = JSON.parse(fs.readFileSync('users.json', "utf-8"));
    //     const filtered = users.filter((e)=>eval(str))
    //     return res.send(JSON.stringify(filtered));
    // }else{
        const users = fs.readFileSync('users.json', "utf-8");
        console.log(users);
        return res.send(users);
    // }
});
app.get('/users/:id', function(req, res) {
    const users = JSON.parse(fs.readFileSync('users.json', "utf-8"));
    const id = req.params['id'];
    const user = users.find((e)=>e.id===+id)
    return res.send(user);
});
app.post('/users', function(req, res) {
    const users = fs.readFileSync('users.json', "utf-8");
    const obUsers = JSON.parse(users);
    const newUser = {
        id: new Date().getTime(),
        ...req.body
    }
    obUsers.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(obUsers));
    return res.send(newUser);
});
app.put('/users/:id', function(req, res) {
    const id = req.params['id'];
    const users = JSON.parse(fs.readFileSync('users.json', "utf-8"));
    const userIndex = users.findIndex((e)=>e.id===+id)
    const editedObj = {...users[userIndex],...req.body}
    users[userIndex] = editedObj
    fs.writeFileSync('users.json', JSON.stringify(users));
    return res.send(editedObj);
});
app.delete('/users/:id', function(req, res) {
    const id = req.params['id'];
    console.log(id);
    const users = fs.readFileSync('users.json', "utf-8");
    const obUsers = JSON.parse(users);
    const indexDeleteUser = obUsers.findIndex((user) => user.id === +id);
    obUsers.splice(indexDeleteUser, 1);
    fs.writeFileSync('users.json', JSON.stringify(obUsers));
    return res.send({id});
});
// app.get('/', function(request, response) {
//     return response.send('<h1>Run node.js server</h1>');
// });

// app.get('/products', function(request, response) {
//     return response.send('<h1>Page products</h1>');
// });

app.listen(3000, function() {
    console.log('run server on 3000 port');
});