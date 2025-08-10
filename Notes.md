Order of the routes in the code matters,

- If the two routes contain the same half part of the routes
  e.g localhost:3000/test/ (Common part)
  route 1 localhost:3000/test/
  route 2 localhost:3000/test/part
- Now if the route 2 is hit on the URL (browser), then contain of the route 1 will be present to user. since it's match the route1 . Now
  if the route 2 is written first then route 2 then rotue 2 contain will present.

hence routes order in the code is matter.

Understanding the middle ware .

- Basically as developer, we don't want to expose our api to the external world,users. Hence
- We need a mechanisms that help us to first authenticate those requestor, then let them get the response from the API.
- e.g, Just to auth the admin, middle ware can we created just to athenticate all the several request which only make for the admin, URL like, local:3000/admin/getdata.

Error handling-- used by 
app.use('/',(err,req,res,next)=>{
err.status(500).send('Something went wrong');
});

-- Best practice to write the error handler is at the end of the code since, it handle all the routes only using all the routes. 
