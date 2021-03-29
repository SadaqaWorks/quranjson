const https = require('https')
const http = require('http');
const fetch = require("node-fetch");
var fs = require('fs');


http.createServer(function (req, res) {
    if (req.url != '/favicon.ico') {

        res.writeHead(200, { 'Content-Type': 'text/html' });
        var page = 1, howManyTimes = 605;
        var verses = [];

        const deleteFile = (filePath) => {
            fs.unlink(filePath, (error) => {
                if (!error) {
                } else {
                }
            })
        };

        function fetchVerses() {

            console.log('Loading page: ' + page);

                const url = 'https://api.quran.com/api/v4/verses/by_page/' + page + '?language=en&words=false&page=1&per_page=350';
        
                fetch(url)
                    .then((resp) => resp.json())
                    .then(function (data) {
                
                        let ref = data["verses"]
                        if (ref.length !== 0) {

                            verses = verses.concat(ref)

                            page++;
                            if (page <= howManyTimes) {
                        
                                if (page === howManyTimes) {
                                    console.log('Loading job completed: ' + page + '==' + howManyTimes)
                                    res.write('Loading verse job completed');
                                    var versesJson = JSON.stringify(verses);
                                    let filePath = __dirname + '/verses.json';
                                    deleteFile(filePath);
                                    fs.writeFile(filePath, versesJson, function (err, result) {
                                        if (err) console.log('error', err);
                                    });
                                } else {
                                    setTimeout(fetchVerses, 3000);
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
    
        }

        console.log('Loading verse job started \n')
        fetchVerses(page);
        res.end("Loading verses page by page \n");
    }
}).listen(8080);