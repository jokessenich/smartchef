'use strict'

const urlRandom = "https://www.themealdb.com/api/json/v1/1/random.php";
const urlSearch = "https://www.themealdb.com/api/json/v1/1/search.php?s=";







function appendResults(ulString, searchTerm){
  $('.result-page').append(`<h1>Results for ${searchTerm}</h1>
  <h2>Choose a Recipe</h2>
    <ul>${ulString}
    </ul>`
    );
}

function getParams(id, meals){

  console.log(id);
  const meal = meals.find(meal => meal.idMeal === `${id}`);
  const keyPass = generateKeys(meal);
  displayRecipe(keyPass.measure, keyPass.ing, keyPass.pic, keyPass.vid, keyPass.n, keyPass.inst, keyPass.check);

}


function generateIngredients(measurement, ingredients, checked){
  let ingredientList = "";
  let i = 0;
  while (ingredients[i] != "" && ingredients[i]!=null){
    ingredientList = ingredientList + `<li class = "store-item ${checked[i]? "checked" : ''}" data-ing-id = "${ingredients[i]}"><span class = "ing-meas">${measurement[i]} ${ingredients[i]}</span> 
      <button class = "remove-item">
      <span class = "remove-button-label">Remove</span>
      </button>
      <button class = "check-item">
      <span class = "remove-button-label">Check</span>
      </button>
      </li>`;
    i++;
  }
  return ingredientList;
}


function addItem(measurement, ingredients, picture, video, name, instructions, checked){
  $('#add-item-form').submit(event=>{
    event.preventDefault();
    measurement.unshift($('#add-measure').val());
    ingredients.unshift($('#add-item').val());
    $('.recipe-page').empty();
    displayRecipe(measurement, ingredients, picture, video, name, instructions, checked);
  })
}

function checkItem(measurement, ingredients, picture, video, name, instructions, checked){
  $('.check-item').click(event=>{
    if($(event.currentTarget).closest('li').hasClass('checked')){
      $(event.currentTarget).closest('li').removeClass('checked');

    }
    else $(event.currentTarget).closest('li').addClass('checked');
    })
}


function removeItem(measurement, ingredients, picture, video, name, instructions, checked){
  let idRemove = "";
  $('.remove-item').click(event=>{
    $(event.currentTarget).closest('li').removeClass('store-item');
    $(event.currentTarget).closest('li').empty();    
    })


}


function displayRecipe(measurement, ingredients, picture, video, name, instructions, checked){
  $('.recipe-page').removeClass('hidden');
  let ingredientList = generateIngredients(measurement, ingredients, checked);
  let newVid = video.replace('watch?v=','embed/');
  console.log("displaying recipe" + measurement, name, newVid, picture, ingredients, checked);
  
  $('.recipe-page').append(`<h1>${name}</h1>
    <div class = "recipe-img">
    <img src = "${picture}" alt = "${name}" width = 100% height = auto>
    <ul>
    ${ingredientList}
    <li class = "store-item">        <form id = "add-item-form">
    <input type = "text" id = "add-measure" placeholder = "1 stalk">
    <input type = "text" id = "add-item" placeholder = "broccoli">
    <input type = "submit" id = "add-submit" value = "ADD">
    </form></li>
          </ul>
    <p class= "recipe">${instructions}</p>
    </div>
    <object data=${newVid}
     height =500px width=600px></object>`
  );

  addItem(measurement, ingredients, picture, video, name, instructions, checked);
  removeItem(measurement, ingredients, picture, video, name, instructions, checked);
  checkItem(measurement, ingredients, picture, video, name, instructions, checked);
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

  for(let i = 0; i < meals.length; i++){

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

  let meals = [];


  $('#recipe-search').submit(event=>{
    event.preventDefault();
    $('.recipe-page').empty();
    $('.result-page').empty();
    $('.home-background').addClass('hidden');
    $('header').addClass('hidden');
    $('.get-recipes').removeClass('absolute');
    $('.site-label').removeClass('hidden');
    $('.get-recipes').addClass('bg');

    fetch(urlSearch + $("#search-term").val())
      .then(response=>{
        console.log(`searched for ${urlSearch +$("#search-term").val()}`);
        return response.json();}) 
        
        .then (responseJson => {
          console.log(responseJson.meals);
          if (responseJson.meals != null){
          displayMatches(responseJson.meals, $('#search-term').val());

          }
          else alert (`Sorry we couldn't find ${$('#search-term').val()}. Please try your search again.`);
            
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
  let checked = [];
    
  for (let i = 1; i < 20; i++){
    //Object.keys(responseJson.meals[0].ingredients).length
    let measureString = "strMeasure"+i;
    let ingredientString = "strIngredient" + i;
    measurement[i-1] = meal[measureString];
    ingredients[i-1] = meal[ingredientString];
    checked[i-1] = false;

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
      inst: instructions,
      check: checked};

  return keys;
}


function fetchRandom(){

  console.log(`fetched url ${urlRandom}`);

  fetch (urlRandom)
    .then(response=>response.json())
    .then (responseJson=>{
      const meal = responseJson.meals[0];
      const keyPass = generateKeys(meal);
      displayRecipe(keyPass.measure, keyPass.ing, keyPass.pic, keyPass.vid, keyPass.n, keyPass.inst, keyPass.check);
})
}

function handleRandom(){
  $('#random-recipe').click(event =>{
    $('.result-page').empty();
    $('.recipe-page').empty();
    $('.home-background').addClass('hidden');
    $('header').addClass('hidden');
    $('.get-recipes').removeClass('absolute');
    $('.site-label').removeClass('hidden');
    $('.get-recipes').addClass('bg');


    fetchRandom();
    })
}

function handleHome(){
  handleRandom();
  handleSearch();
}

$(handleHome());