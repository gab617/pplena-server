const express = require('express');
const cors = require('cors'); // Importa el middleware cors
const app = express();
const fs = require('fs');
const port = 3000;
app.use(express.json());

// Aplica el middleware cors a todas las rutas
app.use(cors());

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.get('/productos', (req, res) => {
    // Lee el archivo JSON y envíalo como respuesta
    const jsonData = require('./assets/products.json');
    res.json(jsonData);
});



app.put('/updateProduct/:id', (req, res) => {

    const productId = parseInt(req.params.id); // ID del producto a actualizar
    const newData = req.body; // Datos editados recibidos desde el frontend
    // Lee el archivo JSON actual
    fs.readFile('./assets/products.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo JSON');
            return;
        }

        let products = JSON.parse(data); // Convierte el contenido a un objeto JSON

        // Encuentra el producto correspondiente y actualiza el campo 'stock'
        const productToUpdate = products.find((product) => product.id === productId);

        if (productToUpdate) {
            productToUpdate.stock = newData.stock;

        } else {
            res.status(404).send('Producto no encontrado');
            return;
        }

        // Escribe los datos actualizados en el archivo JSON
        fs.writeFile('./assets/products.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo JSON');
                return;
            }
            res.json(products); // Devuelve los datos actualizados como respuesta
        });
    });
});

app.get('/reload-true', (req, res) => {
    console.log('reiniciar datos')
    fs.readFile('./assets/products.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo JSON');
            return;
        }

        let products = JSON.parse(data); // Convierte el contenido a un objeto JSON

        products.map(product => product.stock = true)
        console.log(products)
        fs.writeFile('./assets/products.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo JSON');
                return;
            }
            res.json(products); // Devuelve los datos actualizados como respuesta
        })

    })
})

app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
});
