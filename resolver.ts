import resolve from 'did-resolver'
import registerResolver from 'ethr-did-resolver'

registerResolver()

// You can also use ES7 async/await syntax
resolve('did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d79').then(doc=>{
    console.log(doc);
})
