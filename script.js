


let mainwraper = document.getElementById('post-block-wraper');
let overlay = document.getElementById('overlay-post');
let content = document.getElementById('content');
let closeoverlay = document.getElementById('closeoverlay');
let addpost = document.getElementById('addpost');
let postoverlay = document.getElementById('postoverlay');
let form = document.getElementById('form');

function ajax(url, callback){
    let requist = new XMLHttpRequest();
    requist.open('get',url);
    requist.addEventListener('load',function(){
        let data = JSON.parse(requist.responseText);
        callback(data);
    });
    requist.send();
}
ajax('https://jsonplaceholder.typicode.com/posts',function(data){
    printdata(data);
});

function printdata(data){
    data.forEach(element => {
        createpost(element);
    });
}

function createpost(item){
    let divwraper = document.createElement('div');
    divwraper.classList.add('posts');
    divwraper.setAttribute('data-id', item.id);
    let deletebutton = document.createElement('button');
    deletebutton.setAttribute('data-id',item.id);
    deletebutton.innerText='delete this post';
    let h3tag = document.createElement('h3');
    h3tag.innerText='item.id';

    let h2tag =document.createElement('h2');
    h2tag.innerText='item.title';
    divwraper.appendChild(h3tag);
    divwraper.appendChild(h2tag);
    divwraper.appendChild(delete button);

    deletebutton.addEventListener('click',function(event){
        event.stopPropagation();
        let id = event.target.getAttribute('data-id');
        deletepost(id);
    });
    divwraper.addEventListener('click', function(event){
        let id =event.target.getAttribute('data-id');
        openoverlay(id);
    });
    mainwraper.appendChild(divwraper);
    console.log(divwraper);

}

function openoverlay(id){
    overlay.classList.add('active');
    let url =`https://jsonplaceholder.typicode.com/posts/${id}`;
    ajax(url, function(data){
        overlayfunction(data);

    })
    console.log(data);
}
 function deletepost(id){
     let url =`https://jsonplaceholder.typicode.com/posts/${id}`;
     fetch(url,{
         method:'delete',
     })
     .then(Response => Response.json());
     .then(data =>{
         console.log(data);
     });
 }

 function overlayfunction(item){
     let spanuserid = document.createElement('span');
     spanuserid.innerText=item.userid;
     let descriptionpost=document.createElement('p');
     descriptionpost.innerText=item.body;

     content.innerHTML='';
     content.appendChild(spanuserid)
     content.appendChild(descriptionpost);
 }
 closeoverlay.addEventListener('click',function(){
     overlay.classList.remove('active');
 });

 addpost.addEventListener('click',function(){
     postoverlay.classList.add('active');
 })
 form.addEventListener('submit',function(event){
     event.preventDefault();
     let formdata ={
         title =event.target[0].value,
         body:event.target[1].value
     }
     fetch('https://jsonplaceholder.typicode.com/posts',{
         method:'post',
         body:json.stringify(formdata),
         headers:{
             'content-type': 'application/json; charset=UTF-8',
         },
     })
     .then((response)=>response.json())
     .then((json)=>{
         postoverlay.classList.remove('active');
     });
     console.log(formdata);
 })

 