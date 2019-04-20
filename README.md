# mememe: Generate Memes using simple markup text

Mememe uses yaml file to generate memes. Meme creators can either create memes using predefined template, or create new templates.

## Development:
1. Clone the repository
2. Install dependencies
```
npm install
```
You might encounter a problem with `node-gyp` when trying to run `npm install`. Resolve the problem according to your OS/enviroment.

3. To generate a meme, run
```
node index.js path/to/meme.yaml [path/to/output.png]
```
If not specified, output path defaults to `out.png` in the active directory.
