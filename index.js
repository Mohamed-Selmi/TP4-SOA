const express=require('express');
const db=require('./database')
const app=express();
const cors=require('cors');
const rateLimit=require('express-rate-limit');
const db=require('./database');
app.use(express.json());
const PORT=3000;
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const memoryStore = new session.MemoryStore();
ap.use(cors({origin:['http;//localhost:3000','http://localhost:4200']}));
//rate limiting config:
const limiter= rateLimit({
    windowMs:15*60*1000,
    max:100,
    message: ('Too many requests from this IP, please try again later')
})
app.use(limiter)


app.use(session({
secret: 'api-secret',
resave: false,
saveUninitialized: true,
store: memoryStore
}));
// Configuration de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');
app.use(keycloak.middleware());
// Exemple : Protéger une route avec Keycloak
app.get('/secure', keycloak.protect(), (req, res) => {
res.json({ message: 'Vous êtes authentifié !' });
});
app.get('/',(req,res)=>{
    res.json("Registrez des personnes!")
})
app.get('/personnes',keycloak.protect(),(req,res)=>{
    db.all("SELECT * FROM personnes",[],(err,rows)=>{
        if (err){
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
});
app.get('/personnes/:id',keycloak.protect(),(req,res)=>{
    const id=req.params.id;
    db.get("SELECT * FROM personnes where id=?",[id],(err,row)=>{
        if(err){
            res.status(400).json({
                "error":err.message
            });
            return;
        }
        res.json({
            "message":"success",
            "data":row
        });
    });
});
app.post('/personnes',keycloak.protect(),(req,res)=>{
    const nom=req.body.nom;
    const adresse=req.body.adresse;
    db.run(`INSERT INTO personnes(nom,adresse) values (?,?)`,[nom,adresse],function(err){
    if (err){
        res.status(400).json({
            "error":err.message
        });
        return;
    }
    res.json({
        "message":"success",
        "data":{
            id:this.lastID
        }

    });
    });
});

app.put('/personnes/:id',keycloak.protect(),(req,res)=>{
    const id=req.params.id;
    const nom=req.body.nom;
    db.run(`UPDATE Personnes set nom=? WHERE id=?`,[nom,id],function(err){
        if (err){
            res.status(400).json({
                "error":err.message
            });
            return;
        }
        res.json({
                "message":"success"
        });
    });
});
    5
// Mettre à jour une personne
app.put('/personnes/:id',keycloak.protect(), (req, res) => {
const id = req.params.id;
const nom = req.body.nom;
db.run(`UPDATE personnes SET nom = ? WHERE id = ?`, [nom, id], function(err) {
if (err) {
res.status(400).json({
"error": err.message
});
return; }
res.json({
"message": "success"
});
});
});
// Supprimer une personne
app.delete('/personnes/:id',keycloak.protect(), (req, res) => {
const id = req.params.id;
db.run(`DELETE FROM personnes WHERE id = ?`, id, function(err) {
if (err) {
res.status(400).json({
"error": err.message
});
return;
}
res.json({
"message": "success" 
});
});
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
 });
 const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(YAML.load("./openapi.yaml")))