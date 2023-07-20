# Torrent-Web
Stream Torrent online without installing any 
torrent client. This Node.js application allows 
you to stream torrent content directly to your 
browser.
## Installation
To install Torrent-Web, you can use npm by 
running the following command: ```bash npm 
install -g torrentweb ```
## Usage
1. After installation, simply run the following 
command in your terminal: ```bash torrentweb ``` 
2. Once the server starts, visit 
`localhost:3000` in your web browser. 3. Submit 
the magnet link of the torrent you want to 
stream. 4. Enjoy streaming your favorite torrent 
content online!
## Project Details
### Package.json
```json { "name": "torrent-web", "version": 
  "1.0", "description": "Stream Torrent online 
  without installing any torrent client.", 
  "main": "index.js", "bin": {
    "torrentweb": "./bin/torrentweb"
  },
  "scripts": { "start": "node index.js", "test": 
    "echo \"Error: no test specified\" && exit 
    1"
  },
  "keywords": [], "author": "Nishant Shah", 
  "license": "GNU", "dependencies": {
    "@types/node": "^18.0.6", "express": 
    "^4.18.2", "mime-types": "^2.1.35", 
    "node-fetch": "^3.2.6", "torrent-stream": 
    "^1.2.1", "archiver": "^5.3.0"
  }
}
```
### Dependencies
- **express** - A fast and minimal web 
application framework for Node.js. - 
**mime-types** - Provides a collection of MIME 
types. - **node-fetch** - A library to make HTTP 
requests using the Fetch API. - 
**torrent-stream** - A module to stream 
torrents. - **archiver** - A streaming interface 
for archive generation.
## License
This project is licensed under the GNU License. See the [LICENSE](LICENSE) file for details.
