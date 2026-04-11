const sqlite3=require('sqlite3').verbose()
const db=new sqlite3.Database('.myDataBase.sqlite',sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
    if (err){
        console.error(err.message);
    }
    else{
        console.log("Connected to SQLite database!");
        db.run(`CREATE TABLE IF NOT EXISTS personnes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            adresse TEXT)`,(err)=>{
                if (err){
                    console.error(err.message);
                }
                else{
                    const personnes=['Bob','Alice','Charlie'];
                    personnes.forEach((nom)=>{
                        db.run(`INSERT INTO personnes (nom) values (?)`,[nom]);
                    });
                }
}
        );
    }
});
module.exports=db;
