const torrentStream = require('torrent-stream');
const express = require('express');
const mime = require('mime-types');
const archiver = require('archiver');
const app = express();
const port = 3000;

app.get('/stream', (req, res) => {
  const magnetLink = req.query.magnet;
  if (!magnetLink) {
    return res.status(400).send('No magnet link provided');
  }
  const engine = torrentStream(magnetLink);
  let activeFileIndex = 0;
  engine.on('ready', () => {
    const videoFiles = engine.files.filter(file => {
      const mimeType = mime.lookup(file.name);
      return mimeType && mimeType.startsWith('video/');
    });
    if (videoFiles.length === 0) {
      engine.destroy();
      return res.status(404).send('No video files found in the torrent');
    }
    res.setHeader('Content-Type', 'video/mp4');
    const file = videoFiles[activeFileIndex];
    const stream = file.createReadStream();
    stream.on('error', (err) => {
      console.error('Error streaming file:', err);
      engine.destroy();
    });
    stream.on('end', () => {
      activeFileIndex++;
      if (activeFileIndex < videoFiles.length) {
        const nextFile = videoFiles[activeFileIndex];
        nextFile.select();
        nextFile.createReadStream().pipe(res);
      } else {
        engine.destroy();
        res.end();
      }
    });
    stream.pipe(res);
  });
});


app.get('/start', (req, res) => {
  const magnetURI = req.query.magnet;
  if (!magnetURI || magnetURI == "" || magnetURI == " ") {
    return res.status(400).json({ error: 'Magnet URI is required' });
  }
  const engine = torrentStream(magnetURI);
  engine.on('ready', () => {
  const torrent = engine.torrent;
   
   const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <script async="async" data-cfasync="false" src="//pl19715772.highrevenuegate.com/72cca2607972566db507616fa7493279/invoke.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>Torrent Web by Nishant Shah</title>
<script type='text/javascript' src='//loinpriestinfected.com/60/87/6b/60876b216477da4c6b5716d603034732.js'></script>
</head>
<body>

    <center>
        <h1 style="padding-top:20px;">Torrent Web Server</h1>
<div style="padding:5px;display:flex; gap:5px;justify-content:center;">
<!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/nishantshah977/torrent-web" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star nishantshah977/torrent-web on GitHub">Star</a>
<!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/nishantshah977/torrent-web/issues" data-icon="octicon-issue-opened" data-size="large" data-show-count="true" aria-label="Issue nishantshah977/torrent-web on GitHub">Issue</a>
</div>

        <script src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"></script>
<video id="video-id"><source src="/stream?magnet=${magnetURI}" type="video/mp4" /></video>

    <a href="/download?magnet=${magnetURI}" id="downloadButton" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Download</a>
<script>
    var myFP = fluidPlayer(
        'video-id',	{
	"layoutControls": {
		"controlBar": {
			"autoHideTimeout": 3,
			"animated": true,
			"autoHide": true
		},
		"htmlOnPauseBlock": {
			"html": "TorrentX",
			"height": null,
			"width": null
		},
		"autoPlay": true,
		"mute": true,
		"allowTheatre": true,
		"playPauseAnimation": true,
		"playbackRateEnabled": true,
		"allowDownload": true,
		"playButtonShowing": true,
		"fillToContainer": true,
		"posterImage": ""
	},
	"vastOptions": {
		"adList": [],
		"adCTAText": false,
		"adCTATextPosition": ""
	}
});
</script>
        <div class="info">
            <h1 style="padding-top:10px;">Torrent Information</h1>
            <ul style="padding-bottom:10px;">
                <li><b>Name: </b> ${torrent.name}</li> 
                <li><b>Size: </b> ${(torrent.size / 1048576).toFixed(2)} </li>
                <li><b>Number of File: </b> ${torrent.files.length}</li>
                <li><b>Peers: </b> ${torrent.numPeers}</li>
            </ul>
        </div>

<div id="container-72cca2607972566db507616fa7493279"></div>
    </center>
<!-- Place this tag in your head or just before your close body tag. -->
<script async defer src="https://buttons.github.io/buttons.js"></script>
    <script type='text/javascript' src='//pl19715794.highrevenuegate.com/56/d4/40/56d44000a44117d52cc02e05e9342155.js'></script>
</body>
</html>
`;
res.send(html);
});
});



app.get('/download', (req, res) => {
  const magnetURI = req.query.magnet;
  if (!magnetURI || magnetURI == "" || magnetURI == " ") {
    return res.status(400).json({ error: 'Magnet URI is required' });
  }
  const engine = torrentStream(magnetURI);
  const videoStreams = [];
  engine.on('ready', () => {
    console.log('Engine ready');
    const videoFiles = engine.files.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ext === 'mp4' || ext === 'mkv' || ext === 'avi';
    });
    if (videoFiles.length === 0) {
      return res.status(404).json({ error: 'No video files found in the torrent' });
    }

    res.attachment('videos.zip');
    res.setHeader('Content-Type', 'application/octet-stream');
    const archive = archiver('zip');
    archive.pipe(res);
    videoFiles.forEach((file) => {
      const readStream = file.createReadStream();
      videoStreams.push(readStream);
      archive.append(readStream, { name: file.name });
    });
    archive.finalize();
  });
  engine.on('download', () => {
    if (engine.swarm.downloaded === engine.swarm.numPeers * engine.torrent.length) {
      console.log('Download complete');
      videoStreams.forEach((stream) => {
        stream.destroy();
      });
    }
  });
  engine.on('error', (err) => {
    console.error('Error initializing torrent engine:', err);
    res.status(500).send('Error initializing torrent engine');
  });
});

app.get('/',(req,res)=>{
const html = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Torrent Web</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }

    #container {
      max-width: 500px;
      margin: 50px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      text-align: center;
    }

    form {
      display: flex;
    }

    #torrent-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 4px;
    }

    #submit-btn {
      padding: 10px 15px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
  </style>
</head>

<body>
  <div id="container">
    <h1>Torrent Web</h1>
    <form action="/start" method="get">
      <input type="text" id="torrent-input" name="magnet" placeholder="Enter magnet link" required>
      <button type="submit" id="submit-btn">Submit</button>
    </form>
  </div>
</body>

</html>`;

res.send(html);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
