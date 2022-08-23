const listUsers = document.querySelector('#users');
const userForm = document.querySelector('.add-user');
const submitBtn = document.querySelector('.submitBtn')
fetch("http://localhost:3000/users")
    .then((res) => res.json())
    .then((users) => {
        users.forEach((user) => {
            listUsers.insertAdjacentHTML('afterbegin', addedUser(user))
        });
    });
function clearForm(){
    userForm.elements['name'].value=''
    userForm.elements['age'].value=''
    userForm.elements['position'].value=''
}
userForm.addEventListener('click',function(e){
    if(e.target.classList.contains('switchState')){
        document.querySelector('.switchState').remove()
        clearForm()
        userForm.removeAttribute('data-switch')
    }
})
userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('submit')
    const fields = this.elements;
    const newUser = {
        name: fields['name'].value,
        age: fields['age'].value,
        position: fields['position'].value
    };
    const editId = e.target.getAttribute("data-switch")
    if (editId !== null) {
        fetch("http://localhost:3000/users/"+editId, {
            method: "PUT",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res)=>res.json())
            .then((editedUser) => {
                const liArray = Array.from(listUsers.querySelectorAll('li')) 
                liArray.find((e)=>+e.getAttribute('data-id')===editedUser.id).innerHTML = `${editedUser.name}<button class='edit-btn'>Edit</button> <button class="btn-delete">Delete</button>`;
                userForm.removeAttribute('data-switch')
                clearForm()
                document.querySelector('.switchState').remove()
                submitBtn.value = 'Add'
            });
    } else {

        fetch("http://localhost:3000/users", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((user) => {
                listUsers.insertAdjacentHTML('afterbegin', addedUser(user))
            });
    }
});
listUsers.addEventListener('click', function (e) {
    e.preventDefault()
    const target = e.target;
    if (target.classList.contains('btn-delete')) {
        const formId = userForm.getAttribute('data-switch')
        const id = target.closest('li').getAttribute('data-id');
        fetch("http://localhost:3000/users/" + id, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then(() => {
                e.target.closest('li').remove();
                if(formId===id){
                    userForm.removeAttribute('data-switch')
                    submitBtn.value = 'Add'
                    document.querySelector('.switchState').remove()
                    clearForm()
                }
            });
    } else if (target.classList.contains('edit-btn')) {
        const id = e.target.closest('li').getAttribute('data-id');
        const fields = document.querySelector('.add-user')
        const newUser = {
            name: fields['name'],
            age: fields['age'],
            position: fields['position']
        };
        fetch('http://localhost:3000/users/' + id)
            .then((res)=>res.json())
            .then((user) => {
                newUser.name.value = user.name,
                newUser.age.value = user.age,
                newUser.position.value = user.position
                if(document.querySelector('.switchState')===null){
                    userForm.insertAdjacentHTML('beforeend',`<button class='switchState'>Back to Add</button>`)
                }
                submitBtn.value = 'Edit'
            })
        fields.setAttribute('data-switch', id)
    }
});
function addedUser(user) {
    return `<li data-id="${user.id}">${user.name} <button class='edit-btn'>Edit</button> <button class="btn-delete">Delete</button></li>`
}

// function deleteUser(id) {
//     console.log(id, this);

// }