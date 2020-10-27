let promiseDB = idb.open("news-reader",1,function(upgradeDb){
    let articleStore = upgradeDb.createObjectStore("articles",{
        keyPath: "ID"
    });
    articleStore.createIndex("post_title","post_title",{ unique: false });
})

function saveForLater(article){
    promiseDB.then(function(db){
        let trans = db.transaction("articles","readwrite");
        let store = trans.objectStore("articles");
        console.log(article);
        store.add(article.result);
        return trans.complete;
    })
    .then(function(){
        console.log("artikel berhasil disimpan");
    })
};

function getAll(){
    return new Promise(function(resolve,reject){
        promiseDB.then(function(db){
            let trans = db.transaction("articles","readonly");
            let store = trans.objectStore("articles");
            return store.getAll();
        })
        .then(function(articles){
            resolve(articles);
        });
    });
};

function getById(id) {
    return new Promise(function(resolve, reject) {
      promiseDB
        .then(function(db) {
          var tx = db.transaction("articles", "readonly");
          var store = tx.objectStore("articles");
          return store.get(id);
        })
        .then(function(article) {
          resolve(article);
        });
    });
  };