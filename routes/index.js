const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/media', async (req, res) => {

    const stat = await fs.statSync('data/media1.mp4');
    const total = stat.size;
    let start = 0;
    let end = (total - 1);
    let statusCode = 200;

    if (req.headers.range) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, '').split('-');
        const [partialStart, partialEnd] = parts;
        start = parseInt(partialStart, 10);
        end = partialEnd ? parseInt(partialEnd, 10) : (total - 1);

        if (partialStart > 0) {
            statusCode = 206;
        }
    }

    let chunkSize = end - start - 1;
    let headers = {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
    };


    res.writeHead(statusCode, headers);

    const stream = fs.createReadStream('data/media1.mp4', {start, end});
    stream.pipe(res);
});

module.exports = router;
