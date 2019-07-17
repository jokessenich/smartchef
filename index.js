'use strict'

const urlRandom = "https://www.themealdb.com/api/json/v1/1/random.php";
const urlSearch = "https://www.themealdb.com/api/json/v1/1/search.php?s=";







function appendResults(ulString, searchTerm){
    $('.result-page').append(`<h1>Results for ${searchTerm}</h1>
    <ul>${ulString}
    </ul>`);
}

function getParams(id, meals){

  console.log(id);
  const meal = meals.find(meal => meal.idMeal === `${id}`);
  const keyPass = generateKeys(meal);
  displayRecipe(keyPass.measure, keyPass.ing, keyPass.pic, keyPass.vid, keyPass.n, keyPass.inst);

}


function generateIngredients(measurement, ingredients){
  let ingredientList = "";
  let i = 0;
  while (ingredients[i] != ""){
    ingredientList = ingredientList + `<li class = "store-item" data-ing-id = "${ingredients[i]}"><span>${measurement[i]} ${ingredients[i]}</span> 
    <div class = "shopping item controls">
      <button class = "remove-item">
        <span class = "remove-button-label">Remove</span>
      </button>
    </div>
    </li>`;
    i++;
  }
  return ingredientList;
}


function addItem(measurement, ingredients, picture, video, name, instructions){
  $('#add-item-form').submit(event=>{
  event.preventDefault();
  measurement.unshift($('#add-measure').val());
  ingredients.unshift($('#add-item').val());
  $('.recipe-page').empty();
  displayRecipe(measurement, ingredients, picture, video, name, instructions);
  })
}


function removeItem(measurement, ingredients, picture, video, name, instructions){
  let idRemove = "";
  $('.remove-item').click(event=>{
    idRemove = $(event.currentTarget).closest('li').data('ing-id');
    console.log(idRemove);
    for( let i = 0; i < ingredients.length; i++){ 
    if ( ingredients[i] === idRemove) {
     ingredients.splice(i, 1);
     measurement.splice(i,1); 
   }
}
    console.log(ingredients);
    $('.recipe-page').empty();
    displayRecipe(measurement, ingredients, picture, video, name, instructions);
  })
}


function displayRecipe(measurement, ingredients, picture, video, name, instructions){
      $('.recipe-page').removeClass('hidden');
    let ingredientList = generateIngredients(measurement, ingredients);
    let newVid = video.replace('watch?v=','embed/');
      console.log("displaying recipe" + measurement, name, newVid, picture, ingredients);

        $('.recipe-page').append(`<h1>${name}</h1>
        <img src = "${picture}" alt = "${name}" width = 100% height = auto>
        <ul>
          ${ingredientList}
          <li class = "store-item">        <form id = "add-item-form">
          <input type = "text" id = "add-measure" value = "1 stalk">
          <input type = "text" id = "add-item" value = "broccoli">
          <input type = "submit" value = "ADD">
        </form></li>
                </ul>
          <p>${instructions}</p>
          <object data=${newVid}
   width=100% height = auto></object>`);

      addItem(measurement, ingredients, picture, video, name, instructions);
      removeItem(measurement, ingredients, picture, video, name, instructions);
    }
    


function handleClick(meals){
    let id = "";
    $('.meal-button').click(event =>{
        $('.result-page').empty();
        $('.recipe-page').empty();
        id = $(event.currentTarget).closest('li').data('meal-id');
        getParams(id, meals);
        console.log(id);
    })  
}


function displayMatches(meals, searchTerm) {
    $('.result-page').removeClass('hidden');
    const listMeals = [];
    let ulString = "";
    let nameMeals = [];
    let idMeals = [];

    for( let i = 0; i < meals.length; i++){

        listMeals[i] = `<li data-meal-id = "${meals[i].idMeal}">
        <button class = "meal-button">
        <img src = ${meals[i].strMealThumb} alt = ${meals[i].strMeal} width=100%>
        <span class = "result-label">${meals[i].strMeal}</span>
        </button></li>`;
        ulString = ulString + listMeals[i];

    }
    appendResults(ulString, searchTerm);
    handleClick(meals);
}

function handleSearch(){

    const meals = [];


    $('#recipe-search').submit(event=>{
        event.preventDefault();
        $('.recipe-page').empty();
        $('.result-page').empty();

        fetch(urlSearch + $("#search-term").val())
            .then(response=>{
              console.log(`searched for ${urlSearch +$("#search-term").val()}`);
              return response.json();

            }) 
            
            .then (responseJson => {
              console.log(responseJson.meals);
              if (responseJson.meals != null){
                for (let i = 0; i < responseJson.meals.length; i++){
                    meals[i] = responseJson.meals[i];}}
                    else alert (`Sorry we couldn't find ${$('#search-term').val()}. Please try your search again.`);
                
                console.log(meals);
                displayMatches(meals, $('#search-term').val());
    })
})
}

function generateKeys(meal){
    const measurement = [];
    const ingredients = [];
    let picture = "";
    let video = "";
    let name = "";
    let instructions = "";
    
            for (let i = 1; i < 20; i++){
              //Object.keys(responseJson.meals[0].ingredients).length
                let measureString = "strMeasure"+i;
                let ingredientString = "strIngredient" + i;
                measurement[i-1] = meal[measureString];
                ingredients[i-1] = meal[ingredientString];

            }
            picture = meal.strMealThumb;
            video = meal.strYoutube;
            name = meal.strMeal;
            instructions = meal.strInstructions;

            const keys = {
              measure: measurement, 
              ing: ingredients, 
              pic: picture, 
              vid: video, 
              n: name,
              inst: instructions};
      
            return keys;
}


function fetchRandom(){

    console.log(`fetched url ${urlRandom}`);

    fetch (urlRandom)
        .then(response=>response.json())
        .then (responseJson=>{
            const meal = responseJson.meals[0];
            const keyPass = generateKeys(meal);
            displayRecipe(keyPass.measure, keyPass.ing, keyPass.pic, keyPass.vid, keyPass.n, keyPass.inst);
            

        })

}

function handleRandom(){
    $('#random-recipe').click(event =>{
      $('.result-page').empty();
      $('.recipe-page').empty();


        fetchRandom();
    })
}

function handleHome(){
    handleRandom();
    handleSearch();
}

$(handleHome());