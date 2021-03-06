//Create variables here
var dog, dogImg,happyDogImg, database, foodS, foodStock;
var feedBtn, addFoodBtn,fedTime, lastFed,foodObj // VP2
var bedroom, garden, washroom,gameState;
var isFed = false;
function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png")
  happyDogImg = loadImage("images/dogImg1.png")
  bedroom= loadImage("images/BedRoom.png")
  garden = loadImage("images/Garden.png") 
  washroom= loadImage("images/Wash Room.png");
  //sadDogImg = loadImage("sprites/")
}

function setup() {
  createCanvas(600, 500);
  database = firebase.database();
  dog = createSprite(250,250)
  dog.addImage("dog",dogImg)
  dog.addImage("doghappy",happyDogImg)
  dog.scale = 0.1;
  getFoodStock();
  
  //VP2 start
  feedBtn = createButton("Feed Dog")
  feedBtn.position(700,75)
  addFoodBtn = createButton("Add Food")
  addFoodBtn.position(800,75)
  foodObj = new Food();
  //VP2 END

  // read gamestate from Db
  database.ref("gameState").on("value",function(data){
    gameState = data.val();
  })
}


function draw() {  

  background(46, 139, 87);
  fill("red")
  stroke("white")
  text("Press UP ARROW TO FEED DOG", 150, 50);
  
  // VP2
  foodObj.foodStock = foodS;
  
  readTime();
  showTime(lastFed);
  addFoodBtn.mousePressed(function(){
    getFoodStock();
    addFood(foodS);
  });
  feedBtn.mousePressed(function(){
    getFoodStock();
    feedDog();
  })
  //VP2 end

  if(gameState !== "hungry"){

    feedBtn.hide();
    addFoodBtn.hide();
    dog.visible = false;
  }
  else{
    feedBtn.show();
    addFoodBtn.show();
    dog.visible = true;
  }

  if(hour()===lastFed+1){
    foodObj.showGarden();
    updateGameState("playing")
  }
  else if(hour()>=lastFed+2 && hour()<=lastFed+4){
    foodObj.showWashRoom();
    updateGameState("bathing")
  }
  else{
    updateGameState("hungry");
    foodObj.display();
  }
  drawSprites();
  

}

function showTime(time){
if(time>=12){
  text("LastFeed :"+time%12 +"PM",350,300)
}
else if(time===0){
  text("LastFeed : 12 AM",350,300)
}else{
  text("LastFeed :"+time +"PM",350,300)
}
}

function addFood(f){
  f++;
  database.ref('/').update({
    Food : f
  })
}
function getFoodStock(){
  database.ref("Food").on("value",function(data){
    foodS = data.val();
  })
}
function feedDog(){
  foodS--;
  isFed = true;
  dog.changeImage("doghappy",happyDogImg);
  database.ref("/").update({
    FeedTime:hour(),
    Food:foodS
  })
}
function readTime(){
  database.ref('FeedTime').on("value",function(data){
    lastFed = data.val();
    
  });
}
function readGameState(){
database.ref("gameState").on("value",function(data){
  gameState : data.val();
})
}
function updateGameState(state){
  database.ref('/').update({
    gameState:state
  })
}