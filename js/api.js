const BASE_URL = "https://readerapi.codepolitan.com/";

//if fetch succces
function status(response){
    if(response.status !== 200){
        console.log("Error: " + response.status);
        return Promise.reject(new Error(response.statusText));
    }else{
        //change obj to promise so can use .then
        return Promise.resolve(response);
    }
};

//code for parse json to array
function json(response){
    return response.json();
};

//handle error
function error(error){
    console.log("error :" + error);
};

//code for req data json
function getArticles(){

    if('caches' in window){
        caches.match(BASE_URL+"articles")
        .then(function(response){
            if(response){
                response.json()
                .then(function(data){
                    let articlesHTML = "";
                    data.result.forEach(function(article){
                        articlesHTML += `
                        <div class="card">
                            <a href="./article.html?id=${article.id}">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${article.thumbnail}" />
                                </div>
                            </a>
                            <div class = "card-content">
                                <span class="card-title truncate">${article.title}</span>
                                <p>${article.description}</p>
                            </div>
                        </div>
                    `;    
                    });
                    document.getElementById("articles").innerHTML = articlesHTML;
                })
            }
        });
    }

    fetch(BASE_URL+"articles")
    .then(status)
    .then(json)
    .then(function(data){
        let articlesHTML = "";
        data.result.forEach(function(article){
            articlesHTML += `
                <div class="card">
                    <a href="./article.html?id=${article.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}" />
                        </div>
                    </a>
                    <div class = "card-content">
                        <span class="card-title truncate">${article.title}</span>
                        <p>${article.description}</p>
                    </div>
                </div>
            `;
        });
        document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
};

function getArticleById(){
    return new Promise(function(resolve,reject){

    //ambil nilai query parameter(?id=)
    let urlParameter = new URLSearchParams(window.location.search);
    let idParameter = urlParameter.get("id");

    if('caches' in window){
        caches.match(BASE_URL+"articles/"+idParameter)
        .then(function(response){
            if(response){
                response.json()
                .then(function(data){
                    let articleHTML = `
            <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.result.cover}" />
                </div>
                <div class="card-content">
                    <span class="card-title">${data.result.post_title}</span>
                    ${snarkdown(data.result.post_content)}
                </div>
            </div>
            `;
                document.getElementById("body-content").innerHTML = articlesHTML;
                resolve(data);
            })
            }
        });
    }

    fetch(BASE_URL+"article/"+idParameter)
        .then(status)
        .then(json)
        .then(function(data){
            console.log(data);
            //susun komp card secara dinamis
            let articleHTML = `
            <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.result.cover}" />
                </div>
                <div class="card-content">
                    <span class="card-title">${data.result.post_title}</span>
                    ${snarkdown(data.result.post_content)}
                </div>
            </div>
            `;
            document.getElementById("body-content").innerHTML = articleHTML;
            resolve(data);
        })
    })
};

function getSavedArticles(){
    getAll().then(function(articles){
        console.log(articles);
        let articlesHTML = "";
        articles.forEach(function(article){
            let desc = article.post_content.substring(0,100);
            articlesHTML +=
            `
            <div class="card">
                <a href="./article.html?id=${article.ID}&saved=true">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                    </div>
                </a>
                <div class="card-content">
                    <span class="card-title truncate">${article.post_title}</span>
                    <p>${desc}</p>
                </div>
            </div>
            `;
        });
        document.getElementById("body-content").innerHTML= articlesHTML;
    });
};

function getSavedArticleById() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    
    getById(idParam).then(function(article) {
      articleHTML = '';
      var articleHTML = `
      <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${article.cover}" />
        </div>
        <div class="card-content">
          <span class="card-title">${article.post_title}</span>
          ${snarkdown(article.post_content)}
        </div>
      </div>
    `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = articleHTML;
    });
  };