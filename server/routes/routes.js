import { Router } from 'express';
import multer from 'multer';
import { join,dirname } from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';
import fs from 'fs';

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

const diskStorage = multer.diskStorage({
  destination: join(__dirname, "../images"),
  filename:(req,file,callback)=>{
    callback(null, Date.now()+"-"+file.originalname);
  }
});

const fileUpload = multer({
  storage:diskStorage
});

// router.get("/",async(req,res)=>{
//   res.send('Welcome to my images app!');
// });

router.post("/images/post",fileUpload.single("file"),async (req,res)=>{  
  try{
    const type = req.file.mimetype;
    const name = req.file.originalname;
    const data = fs.readFileSync(join(__dirname,"../images/"+req.file.filename));
    const [row] = await pool.query("INSERT INTO image set ?",[{type,name,data}]);
    res.json(row);
  }catch(error){
    return res.status(500).send('Server error');
  };
});

router.get("/images/get", async (req,res)=>{  
  try{
    const [row] = await pool.query("SELECT * FROM image;");
    row.map(item=>{
      fs.writeFileSync(join(__dirname,"../dbimages/"+item.id+"library.png"),item.data);
    });

    // const imagedir = fs.readdirSync(join(__dirname,"../dbimages/"));
    res.json(row.map(item=>{return({id:item.id,name:item.name})}));

  }catch(error){
    return res.status(500).send('Server error');
  };
});

router.delete("/images/delete/:id", async (req,res)=>{  
  try{
    const [row] = await pool.query("DELETE FROM image WHERE id = ?;",[req.params.id]);
   
    fs.unlinkSync(join(__dirname,'../dbimages/'+req.params.id+"library.png"));
    res.send("Image was deleted");

  }catch(error){
    return res.status(500).send('Server error');
  };
});

export default router;