# Memo-cards
Typescript + PixiJS 8 + GSAP 3

## Implemented features:

 - random number of card pairs up to 8
 - game restarts on win
 - moves counter
 - cards reveal/hide animation
 - queueing card animation, if user acts while playing
 - cards match animation


## Startup

### Run on host OS

Requires Node.js version 18 or higher.

```
git clone https://github.com/1shevelov/Memo-cards
cd Memo-cards
npm install
npm run dev
```

Access http://localhost:1234 in your browser.

### Run in Docker

```
git clone https://github.com/1shevelov/Memo-cards
cd Memo-cards
docker build -t memo-cards .
docker run -p 8080:1234 memo-cards
```

Access http://localhost:8080 in your browser.
