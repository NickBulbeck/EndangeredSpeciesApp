window.addEventListener('load', function(){

  var height = document.body.scrollHeight
  var main = document.getElementById("main-div");
  main.style.height = height + "px";

  var slider = document.getElementById("rangeSlider")

  slider.addEventListener('input', function(){
    getAllJson(renderAll.bind(this));
  })

  var renderAll = function(data){
    document.getElementById("box-container").innerHTML = "";
    data.forEach(function(animal){
      renderContainer(animal, this.value)
    }.bind(this));
  }

  getAllJson(renderAll);
});//addEventListener


var getAllJson = function(callback){

  var request = new XMLHttpRequest();
  var url = "http://localhost:3005/species/all";

  request.open("GET", url);
  request.send();

  request.addEventListener('load', function() {
    if (request.status === 200) {
      var jsonString = request.responseText;
      var data = JSON.parse(jsonString);
      callback(data);
    }
  });
}

var renderContainer = function(animal, year){

  var div = document.createElement("div");
  div.className = "circle-div";
  div.id = animal.id;
  var outer = document.getElementById("box-container")

  var head = document.createElement("p");
  head.innerText = animal.name;

  div.appendChild(head)

  div.appendChild(renderCircle(animal, year));

  div.addEventListener('click', function(event){
    renderSidebar(animal);
  })
  outer.appendChild(div);
}

var renderSidebar = function(animal){

  var side = document.getElementById("side-content");
  side.innerHTML = "";

  var header = document.createElement("h2");
  header.innerText = animal.name;
  side.appendChild(header);

  var image = document.createElement("img");
  image.src = "images/" + animal.id + ".jpg"
  side.appendChild(image)

  var ul = buildUl(animal);
  side.appendChild(ul);

  var main = document.createElement('p');
  main.id = "infoText"
  main.innerHTML = animal.narrative.population;

  side.appendChild(main);
  
}

var buildUl = function(animal){
  var ul = document.createElement('ul');
  
  var liPopulation = document.createElement('li');
  liPopulation.id = "liPopulation";
  liPopulation.innerText = "Population";
  liPopulation.addEventListener("click", function() {

    console.log ("populations is here")
  })

  // liPopulation.addEventListener("mouseover", function() {
  //   console.log("we are entering")
  //   liPopulation.classList.add("li-hover-on")
  // })

  // liPopulation.addEventListener("mouseout", function() {
  //   console.log("we are leaving")
  //   liPopulation.classList.remove("li-hover-on")
  // })

  var liThreats = document.createElement('li');
  liThreats.innerText = "Threats";

  var liHabitat = document.createElement('li');
  liHabitat.innerText = "Habitat";

  var liRange = document.createElement('li');
  liRange.innerText = "Range";
  
  ul.appendChild(liPopulation)
  ul.appendChild(liThreats)
  ul.appendChild(liHabitat)
  ul.appendChild(liRange)

  return ul;
  // var linkPopulation = document.createElement('a');


}

var renderCircle = function(animal, year){
  var bgCircle = document.createElement("div");
  bgCircle.className = "bg-circle";
  var inner = renderInnerCircle(animal, year)
  bgCircle.appendChild(inner);
  return bgCircle;
}

var renderInnerCircle = function(animal, year){
  if (!year){ year = 1999}
  var currentStatus = getCurrentStatus(animal, year);
  var innerCircle = document.createElement("div");

  var newClass;

  if (currentStatus === "Extinct in the Wild"){
    newClass = "extinct";
  }
  else if ( currentStatus === "Critically Endangered" ||
            currentStatus === "\"Very rare and believed to be decreasing in numbers\""){
    newClass = "critical";
  }
  else if (currentStatus === "Endangered" ||
           currentStatus === "\"Very rare but believed to be stable or increasing\""){
    newClass = "endangered";
  }
  else if (currentStatus === "Vulnerable" ||
           currentStatus === "Rare"){
    newClass = "vulnerable";
  }
  else if (currentStatus === "Near Threatened" ||
           currentStatus === "Lower Risk/near threatened" ||
           currentStatus === "\"Less rare but believed to be threatened-requires watching\""){
    newClass = "near_threatened";
  }
  else if (currentStatus === "Least Concern" ||
             currentStatus === "Lower Risk/conservation dependent" ||
             currentStatus === "Lower Risk/least concern" ){
    newClass = "least";
  }
  else if (currentStatus === "Insufficiently Known" ||
           currentStatus === "Data Deficient" ||
           currentStatus === "Indeterminate" ||
           currentStatus === "Not Recognized" ||
           currentStatus === "\"Status inadequately known-survey required or data sought\""){
    newClass = "unknown";
  }
  else {
    newClass = "other";
  }
  console.log("Animal : ", animal.name);
  console.log("Animals status : ", currentStatus);
  console.log("New class is : ", newClass);

  innerCircle.className = "inner-circle " + newClass;
  return innerCircle;
}

var getCurrentStatus = function(animal, currentYear){
  var assessmentArray = animal.result
  var arrayLength = assessmentArray.length

  var index = 0;
  while ( index < (arrayLength-1) && (Number(assessmentArray[index].year) > Number(currentYear))){
    index++;
  }

  var currentStatus = assessmentArray[index].category;
  return currentStatus;

}
