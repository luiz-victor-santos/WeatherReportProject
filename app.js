const express = require("express");
const https = require("https");
// body Parser is the package that allows me to look throught the body of the post request
// and fetch the date based on the name of the input (in this case is City Name)
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
res.sendFile(__dirname + "/index.html"); //render the html file

});

app.post("/", function(req,res){

  const query = req.body.cityName;
  const apiKey = "9d92a7cd1fe238f70bd3111171defbbd";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {
    // this is the http status code 200,300,400etc it will show in the terminal
    console.log(response.statusCode);

    //the method ".on" is the actual "data" we got back from the API.
    response.on("data", function(data) {
      // below we are converting the hexcode data that comes from the api in JavaScript object
      // check JSON methods!!
      const weatherData = JSON.parse(data);
      //to get the specific pieces of infomation from the weatherData(for example) main -> temp ->
      const temp = weatherData.main.temp;
      // and goes on like above, but in this case there was a array with 1 object that contained the information "description"
      const weatherDescription = weatherData.weather[0].description;
      const tempMax = weatherData.main.temp_max;
      const tempMin = weatherData.main.temp_min;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      // We can have only 1 "res.send" . In order to send some more data we use the method "res.write()"
      // Use res.write + res.send() at the ende to send as many information you want.
      res.write("<h1>The Weather in "+query+" today!</h1>")
      res.write("<p>The max temp will be: " + tempMax + "C</p>");
      res.write("<p>The min temp will be: " + tempMin + "C</p>");
      res.write("<p>The temperature in "+query+ " is: " + temp + "C with " + weatherDescription + ".</p>");
      res.write("<img src =" + imageURL + ">");
      res.send();
    });
  });

});






app.listen(3000, function() {
  console.log("Server is runing on port 3000>");
});
