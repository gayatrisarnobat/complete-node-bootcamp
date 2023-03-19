const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////
// FILE SYSTEM

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File has been created!');

// Non Blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err1, data1) => {
//   if (err1) {
//     console.log('Error 1: ', err1);
//     return;
//   }
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err2, data2) => {
//     if (err2) {
//       console.log('Error 2: ', err2);
//       return;
//     }
//     console.log(data2);
//     fs.writeFile('./txt/append.txt', `${data1}\n${data2}`, () => {
//       console.log('Data written successfully!');
//     });
//   });
// });
// console.log('Will read files!');

//////////////////////////////////
// SERVER

const templOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const templCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const productsData = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(productsData);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    // Products Overview Page
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templCard, el))
      .join('');
    const output = templOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(output);
  } else if (pathname === '/product') {
    // Product Details Page
    const product = dataObj[query.id];
    const output = replaceTemplate(templProduct, product);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(output);
  } else if (pathname === '/api') {
    // API Page
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(productsData);
  } else {
    // Not Found
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'Hello, World!',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
