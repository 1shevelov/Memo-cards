import { Assets } from 'pixi.js';

const manifest = {
      bundles: [
            {
                  name: 'backs',
                  assets: [
                        {
                              alias: 'green',
                              src: 'assets/images/cardBack_green3.png',
                        },
                  ],
            },
            {
                  name: 'faces',
                  assets: [
                        {
                              alias: 'clubs7',
                              src: 'assets/images/cardClubs7.png',
                        },
                        {
                              alias: 'clubsJ',
                              src: 'assets/images/cardClubsJ.png',
                        },
                        {
                              alias: 'diamonds8',
                              src: 'assets/images/cardDiamonds8.png',
                        },
                        {
                              alias: 'diamondsQ',
                              src: 'assets/images/cardDiamondsQ.png',
                        },
                        {
                              alias: 'hearts9',
                              src: 'assets/images/cardHearts9.png',
                        },
                        {
                              alias: 'heartsK',
                              src: 'assets/images/cardHeartsK.png',
                        },
                        {
                              alias: 'spades10',
                              src: 'assets/images/cardSpades10.png',
                        },
                        {
                              alias: 'spadesA',
                              src: 'assets/images/cardSpadesA.png',
                        },
                  ],
            }
      ] //,
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

let allFaces: string[] = [];
export function getAllFaces(): string[] {
   return allFaces;
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
    const cardsBundle = manifest.bundles.find(bundle => bundle.name === 'faces');
   //  let allFaces: string[] = [];
    if (cardsBundle !== undefined)
         allFaces = cardsBundle.assets.map(asset => asset.alias);
   // console.log(allFaces);

    // we download ALL our bundles and wait for them
    await Assets.loadBundle(bundleIds);
}
