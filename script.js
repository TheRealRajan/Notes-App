const addBtn = document.querySelector('.add')
const toasts = document.querySelector('.toasts')
const tools = document.querySelector('.tools')
const deleteAll = document.querySelector('.delete-all')

let notes = JSON.parse(localStorage.getItem('notes'))

if(notes){
    notes.forEach(note => addNewNote(note))
}

addBtn.addEventListener('click', () => {
    addNewNote('')
    showToast('Note Added')
})

function addNewNote (text = ''){
    const note = document.createElement('div')
    note.classList.add('note', 'faded-out')
   
    //To change the opacity as the note is added to the DOM
    requestAnimationFrame(() => {
         note.classList.remove("faded-out")
    })

    note.innerHTML = 
    `
    <div class="tools">
        <p class = "edit-mode ${text ? "hidden" : ""}"> Edit Mode </p>
        <button title="Save" class="edit"><i class="fas fa-edit icon-button"></i></button>
        <button title="Delete" class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div class="main ${text ? " " : "hidden"}">.</div>
    <textarea title="Markdown syntax is supported !" placeholder="Write a note..." class="${text ? "hidden" : ""}"></textarea>

    `

    const editBtn = note.querySelector('.edit')
    const deleteBtn = note.querySelector('.delete')
    const main = note.querySelector('.main')
    const textArea = note.querySelector('textarea')
    const editInfo = note.querySelector('.edit-mode')

    textArea.value = text
    main.innerHTML = marked(text)
    // const para = main.childNodes
    // para.classList.add('para')

    deleteBtn.addEventListener('click', () =>{  
        
        setTimeout(() => {
            note.remove()
        }, 800);
        
       requestAnimationFrame(() => {
         note.classList.add('faded-out')
        })
        updateLocalStorage()
        showToast()
    })

    editBtn.addEventListener('click', (e) =>{
        
        if(e){
            const editIcon = editBtn.querySelector('.icon-button')
            if(editInfo.classList.contains('hidden')){
                // console.log('@Its hidden')
                editIcon.classList.remove('fa-edit')
                editIcon.classList.add('fa-sd-card')    
            }    
            else {
                // console.log('Its not hidden')
                editIcon.classList.remove('fa-sd-card')
                    editIcon.classList.add('fa-edit')
            }
        
        }
       

        main.classList.toggle('hidden')
        textArea.classList.toggle('hidden')
        editInfo.classList.toggle('hidden')
        textArea.focus()
        if(e){
            if(editBtn.title === "Edit"){
                editBtn.setAttribute("title", "Save")
            }
            else if(editBtn.title === "Save") {
                editBtn.setAttribute("title", "Edit")
            }
        }
        
    })

    textArea.addEventListener('input', (e) =>{
        const { value } = e.target
        main.innerHTML = marked(value)

        updateLocalStorage()
    })

    document.body.appendChild(note)
}

function updateLocalStorage(){
    const notesText = document.querySelectorAll('textarea')
    const notes = []
    notesText.forEach(note => {
        notes.push(note.value)
        localStorage.setItem('notes', JSON.stringify(notes))
    });
}

function showToast(text='Note Deleted'){
    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.innerText = text
    toasts.appendChild(toast)
    setTimeout(() => {
        toast.remove()
    }, 3000);
}


deleteAll.addEventListener('click', ()=> clearStorage())
function clearStorage(){
    const everyNote = document.querySelectorAll('.note')
    everyNote.forEach(note => note.remove())
    localStorage.clear()
    showToast('All Notes Deleted')
}