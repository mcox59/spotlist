var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname + "/public")));

class playlist {
  constructor(url, genre) {
    this.url = url;
    this.genre = genre;
    this.ups = this.downs = 0;
  }
  getURL() {
    return this.url;
  }
  getGenre(){
    return this.genre;
  }
  getUPS(){
    return this.ups;
  }
  getDOWNS(){
    return this.downs;
  }
}

var playlists = [];

app.get('/submit', function (req, res){
    let pl = new playlist(req.query.url, req.query.genre);
    playlists.push(pl);
    console.log("NEW PLAYLIST: " + pl.getURL() + " " + pl.getGenre());
    var filename = pl.getGenre() + '.html';
    fs.readFile(__dirname + '/public/' + filename, 'utf8', function(err, data){
        if(err) console.log('failed to read: ' + err);
        var index = data.indexOf("<!-- FIELD -->");
        var out = [data.slice(0, index), '<li><iframe src="', pl.getURL(), '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></li>', data.slice(index + 14)].join('');
        fs.open(__dirname + '/public/' + filename, 'w', function(err, fd){
            if(err) throw "error opening file: " + err;
            fs.write(fd, out, 0, null, function(err){
                if(err) throw 'error writing to file: ' + err;
                fs.close(fd, function() {
                    console.log("success");
                });
            });
        });
    });
    res.sendFile(__dirname + '/public/index.html');

});



console.log('Maybe working');
app.listen(8888);

