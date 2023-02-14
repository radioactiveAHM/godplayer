import express from "express";
import fs from "fs";
import {parseFile} from "music-metadata"
import {resolve} from 'path';

function checker(a, b){
  for(let c of a){
    if(c==b){
      return true
    }
  }
  return false
}
// ready covers
const song_list = fs.readdirSync("./static/music");
const cover_list = fs.readdirSync("./static/cover");
for(let song of song_list){
  if (checker(cover_list, song)){
    break
  }
  await parseFile("./static/music/"+song)
    .catch(e=>console.log(e))
    .then(meta=>{
      fs.writeFileSync("./static/cover/"+song.split(".")[0]+".jpg", meta.common.picture[0].data)
    })
}

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("static"))

app.get("/", (req, res)=>{
  res.sendFile(resolve("./index.html"));
})

app.get("/list", (req, res)=>{
  fs.readdir("./static/music", (err, files)=>{
    res.json(JSON.stringify(err||files))
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));