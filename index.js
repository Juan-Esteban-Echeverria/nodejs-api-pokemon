const axios = require("axios")
const http = require("http")
const fs = require("fs")

// CREAR EL SERVER
const server = http.createServer(async(req, res)=>{
    if(req.url.includes('/pokemones')){

        // ASYNC AWAIT PARA LAS CONSULTAS
        try {
            const {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=150`)

            const pokemones = data.results.map(async (item) => {
                const {data} = await axios.get(item.url)
                return {nombre: data.name, img: data.sprites.front_default}
            })

            // PROMISE ALL PARA EJECUTAR Y OBTENER LA DATA DE LAS FUNCIONES ASINCRONAS
            const datos = await Promise.all(pokemones)

            res.writeHead(200, {"Content-Type": "application/json"})
            return res.end(JSON.stringify(datos))

        } catch (error) {
            return res.end('error de servidor')
        }
    }

    // LECTURA DEL HTML CON EL FILE SISTEM
    if (req.url.includes("/inicio")) { 
        return fs.readFile("index.html", "utf-8", (err, html) => { 
            if (err) return res.end("error al leer html"); 
    
            res.writeHead(200, { "Content-Type": "text/html" }); 
            return res.end(html); 
        }); 
    } 
})

server.listen(5000, ()=> console.log("Server ON"))


