let mainWrapper = document.getElementById('post-block-wraper');
let overlay = document.getElementById('overlay-post');
let content = document.getElementById('content');
let closeOverlay = document.getElementById('closeOverlay');
let addPost = document.getElementById('add');
let postOverlay = document.getElementById('postoverlay');
let form = document.getElementById('form');
let inputTitle = document.getElementById('titlePost');
let inputDescription = document.getElementById('postdescr');

function ajax(url,callback) {
    let requist = new XMLHttpRequest();
    requist.open('GET', url);
    requist.addEventListener('load', function() {
    
        let data = JSON.parse(requist.responseText);
        callback(data);
    });
    requist.send();
}

ajax('https://jsonplaceholder.typicode.com/posts', function(data) {
    printData(data);
});

function printData(data) {
    data.forEach(element => {
        createPost(element);
    })
}

function createPost(item) {
    let divWrapper = document.createElement('div');
    divWrapper.classList.add('posts');
    divWrapper.setAttribute('data-id', item.id);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('del-button');
    deleteButton.setAttribute('data-id', item.id);
    deleteButton.innerText = 'Delete This Post';

    let h3Tag = document.createElement('h3');
    h3Tag.innerText = item.id;

    let h2Tag = document.createElement('h2');
    h2Tag.innerText = item.title;

    divWrapper.appendChild(h3Tag);
    divWrapper.appendChild(h2Tag);
    divWrapper.appendChild(deleteButton);

    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();
        let id = event.target.getAttribute('data-id');

        let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
        fetch(url, {
            method: 'DELETE',
        })
        .then(() => divWrapper.remove());

    });


    divWrapper.addEventListener('click', function(event) {
        let id = event.target.getAttribute('data-id');
        openOverlay(id);
    })

    mainWrapper.appendChild(divWrapper);

    console.log(divWrapper);
}



function openOverlay(id) {
    overlay.classList.add('active');
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    ajax(url, function(data) {
        overlayFunction(data);
    })
    console.log(id);
}


function overlayFunction(item) {
    let spanUserId = document.createElement('span');
    spanUserId.innerText = item.userId;

    let descriptionPost = document.createElement('p');
    descriptionPost.innerText = item.body;

    content.innerHTML = '';
    content.appendChild(spanUserId);
    content.appendChild(descriptionPost);

}

closeOverlay.addEventListener('click', function() {
    overlay.classList.remove('active');
    // content.innerHTML = '';
});
addPost.addEventListener('click', function() {
    postOverlay.classList.add('active');
    inputTitle.value = '';
    inputDescription.value = '';
})

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = {
        title: event.target[0].value,
        body: event.target[1].value
    }

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((post) => afterPostSave(post));

    console.log(formData);
   
})

function afterPostSave(post) {
    createPost(post);
    postOverlay.classList.remove('active');
}

let currentPage = 1;
let totalPages;

function getUsers(page) {
    fetch('https://reqres.in/api/users?page=' + page, {
        method: 'GET'
    })
    .then(function(response) {
        if (response.status != 200) {
            throw response.status;
        }
        return response.json();
    })
    .then(function(responseData) {
        let fragment = document.createDocumentFragment();

        responseData.data.forEach(element => {
            let li = document.createElement('li');
            li.classList.add('li-item');

            let span = document.createElement('span');
            span.textContent = element.first_name;

            let img = document.createElement('img');
            img.src = element.avatar;
            img.classList.add('image-item');

            li.appendChild(img);
            li.appendChild(span);

            fragment.appendChild(li);
        });

        document.getElementById('list').innerHTML = '';
        document.getElementById('list').appendChild(fragment);

        totalPages = responseData.total_pages;
    })
    .catch(function(x) {
        if (x == 404) {
            let p = document.createElement('p');
            p.textContent = 'Server Error';
            document.getElementById('api').appendChild(p);
        } else {
            let p = document.createElement('p');
            p.textContent = 'Page Not Found';
            document.getElementById('api').appendChild(p);
        }
    })
}

document.getElementById('loadprev').addEventListener('click',function() {
    if (currentPage == 1) {
        return;
    }
   
    currentPage -=1;
    getUsers(currentPage);
});