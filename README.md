# Memo-cards
Typescript + PixiJS 8 + GSAP 3

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
