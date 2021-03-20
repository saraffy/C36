var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(250,350,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,300);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(710,330);
  addFood.mousePressed(addFoods);

}

function draw() {
  background("green");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(25);
  if(lastFed>=12){
    stroke("white");
    fill("black");
    text("Last Fed : "+ lastFed%12 + " PM", 150,30);
   }else if(lastFed==0){
     stroke("white");
     fill("black")
     text("Last Fed : 12 AM",350,30);
   }else{
     stroke("white");
     fill("black");
     text("Last Fed : "+ lastFed + " AM", 150,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}