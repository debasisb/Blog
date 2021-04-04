//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

// required to access the Weather API
const https = require("https");

const homeStartingContent = "Introductory content for my blog. This is the starting page for my daily journal.";
const aboutContent = "This page describes what the blog is all about and some information about myself.";
const contactContent = "Brief information about how to contact me via social media.";
const weatherContent = "This is our weather search feature! Enter your city below and it will show the city's weather!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];
let weathers = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
app.get("/weather", function(req, res){
  res.render("weather", {
    weatherContent: weatherContent, 
    weathers: weathers
  });
});
app.post("/weather", function(req, res){
  
   // takes the city input from the user.
        var city = String(req.body.cityInput);
        console.log(req.body.cityInput);
    
    //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
        const units = "imperial";
        const apiKey = "f17bce9d60dfa1aa878fe1d1664c4ce1";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +  "&units=" + units + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI
    https.get(url, function(response){
        console.log(response.statusCode);
        
        // gets individual items from Open Weather API
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const humid = weatherData.main.humidity;
            const windsp = weatherData.wind.speed;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const winddeg= weatherData.wind.deg;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            
         
            //stores all the results of that certain city into the array named cities.
             const cities = {
                city: req.body.cityInput,
                temp: " the temperature of " + req.body.cityInput + " is " + temp + " F.",
                img: imageURL,
                weatherdes: "The weather description is " + weatherDescription,
                humidity: "weather humidity is " + humid,
                windspeed: "windspeed is " + windsp+ " m/s."
            };
             res.redirect("/weather");
              weathers.push(cities);
        });
       
    });
    
  
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});
app.get("/weathers/:weatherName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.weatherName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(cities.city);

    if (storedTitle === requestedTitle) {
      res.render("cities", {
        result: cities.city
      });
    }
  });

});
app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

// need to write out an app.get function that open a route /weather Need an EJS view called weather.ejs that displays one text field to input city name
//This EJS view will input a city name from user
// Then need to write out an app.get function that will use the city name to query the Weather API to retrieve basic weather information - temperature, description and humidity
// The display of the weather information must be saved to an array and then the results of the array must be pushed to the /weather EJS view to display
// The /weather route and page created by weather.ejs page should allow for the input of the city name, and the display of the weather for the city - city name, weather icon image, temperature in F, description, humidity, wind direction


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
