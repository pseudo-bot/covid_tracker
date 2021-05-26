fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBcsCr8jrWKO1pSWrC4QDRuK9lt2C7Y-Y0')
.then(resolve => resolve.json())
.then(data => console.log(data))