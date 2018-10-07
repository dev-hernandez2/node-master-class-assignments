/**
 * Node Master Class from https://pirple.thinkific.com/
 * Homework Assignment #1 
 * RESTful JSON AP that return "Hello world"
 */

 //NODE Dependencies
 const http = require('http')
 const url = require('url')
 const stringDecoder = require('string_decoder').StringDecoder


 //server initiation 
const httpServer = http.createServer((req, res) => {

    //parse URL's
    const parsedURL = url.parse(req.url, true)
    const path = parsedURL.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    //guet Query
    const queryStringObject = parsedURL.query

    //Get HTTP Method
    const method = req.method.toLowerCase()

    //Get Headers
    const headers = req.headers

    //get Data from petition 
    const decoder = new stringDecoder('utf-8')
    let buffer = ''

    req.on('data', data => buffer += decoder.write(data))

    req.on('end', () => {
        buffer += decoder.end()

        //choose the correct route handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
        
        //get data
        let data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            'payload' : buffer
        }

        //call the logic of the route selected 
        chosenHandler(data, (statusCode, payload) => {
            //use the staus code callback by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            //use the payload called back by the handler, or default to empty obj
            payload = typeof(payload) == 'object' ? payload : {}

            //Convert the payload to string
            const payloadString = JSON.stringify(payload)

            //return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            console.log('returning response: ', statusCode, payloadString)
        })

    }) 
})

// avtive listenig of port 3000
httpServer.listen(3000, () => console.log(`Server is runing on por 3000`))

//Routes and hendlers
let handlers = {}

//hello route controller
handlers.hello = (data, callback) => {

    //get the post payloads
    const payLoads = data.payload ? data.payload : 'nothing'
   //send the response
    callback(200, {"messaje": `Hello World, you Post ${ payLoads }`})
}

//return 404 page notFound
handlers.notFound = (data, callback) => callback(404, { "Massaje" : "Page Not Found"})

//Routers
const router = {
    'hello' : handlers.hello
}

