
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBLxqtvRGikkt-N2_fcBJ_JIGYWI_SRNd4",
    authDomain: "mark-your-words-344db.firebaseapp.com",
    databaseURL: "https://mark-your-words-344db.firebaseio.com",
    projectId: "mark-your-words-344db",
    storageBucket: "mark-your-words-344db.appspot.com",
    messagingSenderId: "75369386922",
    appId: "1:75369386922:web:ca07a36a02f48020edd1d3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



//SELECT ELEMENTS AND ASSIGN THEM TO VARS
var newTask = document.querySelector("#new-task");
var addTaskBtn = document.querySelector("#addTask");
var toDoUl = document.querySelector(".todo-list ul");
var completeUl =  document.querySelector(".complete-list ul");
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours()+":"+today.getMinutes();
var dateTime = date + " " + time;


//CREATE FUNCTIONS

//CREATING THE ACTUAL TASK LIST ITEM
var createNewTask = function(task){
  // console.log("Creating task...");
  
  //SET UP THE NEW LIST ITEM
  var listItem = document.createElement("li"); //<li>
  // var checkBox = document.createElement("input"); //checkbox
  var label = document.createElement("label"); // <label>
  var throwBtn = document.createElement("button");
  throwBtn.innerText ="Throw";
  throwBtn.className="throw";


  //PULL THE INPUTED TEXT INTO LABEL
  label.innerText = dateTime +" " + task ;
   
  
  //ADD PROPERTIES
  // checkBox.type = "checkbox";

  
  //ADD ITEMS TO THE LI
  // listItem.appendChild(checkBox);
  listItem.appendChild(throwBtn);
  listItem.appendChild(label);
  //EVERYTHING PUT TOGETHER
  return listItem;  
  
};



//ADD THE NEW TASK INTO ACTUAL INCOMPLETE LIST
var addTask = function(){
  
  input_box = document.getElementById("new-task");

  // console.log("Adding task...");
  //FOR CLARITY, GRAB THE INPUTTED TEXT AND STORE IT IN A VAR
  var listItem = createNewTask(newTask.value);
  var key = firebase.database().ref().child("todo-list").push().key;
  console.log(key);

  var task = {
    time: dateTime,
    words: input_box.value,
    key: key
  }

  var updates = {};
  updates["/your_words/" + key] = task;
  firebase.database().ref().update(updates);
  console.log (updates);

  //ADD THE NEW LIST ITEM TO LIST
  toDoUl.appendChild(listItem); 
  //CLEAR THE INPUT
  newTask.value="";
  
  //BIND THE NEW LIST ITEM TO THE INCOMPLETE LIST
  bindIncompleteItems(listItem, completeTask);
  createUnfinishedTask();

};


var createUnfinishedTask = function(){
   unfinishedTask = document.getElementsByClassName("todo-list")[0]
   unfinishedTask.innerText= "";

   word_array =[];
   firebase.database().ref("your_words").on('value',function(snapshot){
     snapshot.forEach(function(childSnapshot){

      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      word_array.push(Object.values(childData));

     });

     word_array.reverse();

     for (var i, i = 0; i<word_array.length;i++){
        key = word_array[i][0];
        word = word_array[i][1];
        date = word_array[i][2];

        todo_list = document.createElement("div");
        todo_list.setAttribute("class","todo-list");
        todo_list.setAttribute("data-key",key);

        list = document.createElement("li");
        label1 = document.createElement("label");
        label2= document.createElement("label");
        label1.innerText= word + " ";
        label1.setAttribute("class","date");
        label2.innerText= date + " ";
        label2.setAttribute("class","word")

        // label.innerText = word + " " + date;
       
        throwBtn = document.createElement("button");
        throwBtn.setAttribute("class","throw")
        throwBtn.setAttribute("onclick","completeTask(this.parentNode.parentNode,this.parentNode)")
        throwBtn.innerText ="Throw";

        list.appendChild(throwBtn);
        list.appendChild(label2);

        list.appendChild(label1);
        unfinishedTask.appendChild(list); 

        // unfinishedTask.appendChild(list)

     }

   })

}



var completeTask = function(){
  
  //GRAB THE CHECKBOX'S PARENT ELEMENT, THE LI IT'S IN
  var listItem = this.parentNode;

  //CREATE AND INSERT THE DELETE BUTTON
  var deleteBtn = document.createElement("button"); // <button>
  deleteBtn.setAttribute("class","delete")
  deleteBtn.innerText ="Delete"; 
  listItem.appendChild(deleteBtn);

  var throwBtn = listItem.querySelector(".throw")
  throwBtn.remove();
  
  //SELECT THE CHECKBOX FROM THE COMPLETED CHECKBOX AND REMOVE IT
  // var checkBox = listItem.querySelector("input[type=checkbox]");
  // checkBox.remove();

  //PLACE IT INSIDE THE COMPLETED LIST
  completeUl.appendChild(listItem); 
  
  //BIND THE NEW COMPLETED LIST
  bindCompleteItems(listItem, deleteTask);
  
};



//DELETE TASK FUNCTIONS
var deleteTask = function(){
  console.log("Deleting task...");
  
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  
  ul.removeChild(listItem);
  
};

//A FUNCTION THAT BINDS EACH OF THE ELEMENTS THE INCOMPLETE LIST

var bindIncompleteItems = function(taskItem, throwButtonPress){  
  console.log("Binding the incomplete list...");
  
  //BIND THE CHECKBOX TO A VAR
  // var checkBox = taskItem.querySelector("input[type=checkbox]");
  var throwButton = taskItem.querySelector(".throw")
  
  //SETUP EVENT LISTENER FOR THE CHECKBOX
  // checkBox.onchange = checkBoxClick;  
  throwButton.onclick = throwButtonPress;
}; 


//A FUNCTIONM THAT BINDS EACH OF THE ELEMTS IN THE COMPLETE LIST
var bindCompleteItems = function(taskItem, deleteButtonPress){
  console.log("Binding the complete list...");
  
  //BIND THE DELETE BUTTON
  var deleteButton = taskItem.querySelector(".delete");
   
  //WHEN THE DELETE BUTTIN IS PRESSED, RUN THE deleteTask function
  deleteButton.onclick = deleteButtonPress;
    
};


for(var i=0; i < toDoUl.children.length; i++) {
  bindIncompleteItems(toDoUl.children[i], completeTask);
}

for(var i=0; i < completeUl.children.length; i++) {
  bindCompleteItems(completeUl.children[i], deleteTask);
}


addTaskBtn.addEventListener("click", addTask);