const resolver = require('uport-did-resolver')
resolver.default()
const didJWT = require('did-jwt')
const signer = didJWT.SimpleSigner('fa09a3ff0d486be2eb69545c393e2cf47cb53feb44a3550199346bdfa6f53245');

didJWT.createJWT({aud: 'did:uport:2osnfJ4Wy7LBAm2nPBXire1WfQn75RrV6Ts', exp: 1957463421, name: 'uPort Developer'},
                 {issuer: 'did:uport:2osnfJ4Wy7LBAm2nPBXire1WfQn75RrV6Ts', signer}).then( response =>
                 { 
        
                     console.log(response);
                     var ec = response;
                     var jwt = didJWT.decodeJWT(ec);
                     console.log(jwt);
           
                     didJWT.verifyJWT(ec, {audience: 'did:uport:2osnfJ4Wy7LBAm2nPBXire1WfQn75RrV6Ts'}).then((response) =>
                        { 
                            let verifiedRespone = {};
                            verifiedRespone = response
                            console.log(verifiedRespone);
                         });


                 });

