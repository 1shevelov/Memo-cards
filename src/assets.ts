import { Assets } from 'pixi.js';

const manifest = {
    bundles: [{
       name: 'cards',
       assets:[
           {
              alias: 'back',
              src: 'assets/images/cardBack_green3.png',
           },
           {
              alias: 'clubs7',
              src: 'assets/images/cardClubs7.png',
           },
           {
              alias: 'clubsJ',
              src: 'assets/images/cardClubsJ.png',
           },
       ],
    }] //,
    // {
    //    name:'game-screen',
    //    assets:[
    //        {
    //           name: 'character',
    //           srcs: 'robot.png',
    //        },
    //        {
    //           name: 'enemy',
    //           srcs: 'bad-guy.png',
    //        }
    //    ]
    // }]
}

export async function LoadAssets(): Promise<void> {
    // const resolver = new Resolver();
    // resolver.basePath = 'assets/images/';
    // // resolver.add({ alias: 'cardBack', src: 'cardBack_green3.png'});
    // // resolver.add({ alias: 'clubs7', src: 'cardClubs7.png'});
    // // resolver.add({ alias: 'clubsJ', src: 'cardClubsJ.png'});
    // resolver.addManifest(manifest);
    // const resolvedAssets = resolver.resolveBundle('cards');
    // console.log(resolvedAssets);

    // const assets = await Assets.load(resolvedAssets);
    // console.log(assets);

    await Assets.init({ manifest: manifest });

    // let's extract the bundle ids. This is a bit of js black magic
    const bundleIds =  manifest.bundles.map(bundle => bundle.name);
    // console.log(bundleIds);

    // we download ALL our bundles and wait for them
    await Assets.loadBundle(bundleIds);
}
