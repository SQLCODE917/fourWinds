# Four Winds
## raspivid tech evaluation

### Basically

You take an RPi 3 Model B,
Camera v2,
throw Raspbian on it,
install NVM,
get set with latest Node.js v6,
build the server component around Express,
and serve the raw h264 stream over web sockets.
On the client side,
you got a Broadway decoder,
working on one _NAL unit_ of h264 frames at a time.
Only works with the _baseline_ camera profile.
However, sub-second lag on local network. Ship it!

### Installation

```
npm install
node_modules/.bin/gulp pack
node index.js
```

### Demo

Go to your RPi IP in your browser, port 8080 for the simple web player, and click "Start Video"

enjoy!
