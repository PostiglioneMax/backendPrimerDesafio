import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import express from 'express';

const swaggerDocumentProducts = yaml.load('./src/docs/products.yaml');
const swaggerDocumentCart = yaml.load('./src/docs/cart.yaml');

const swaggerSetup = (app) => {
  app.use('/api-docs/products', swaggerUi.serveFiles(swaggerDocumentProducts), swaggerUi.setup(swaggerDocumentProducts));
  app.use('/api-docs/cart', swaggerUi.serveFiles(swaggerDocumentCart), swaggerUi.setup(swaggerDocumentCart));
};

export default swaggerSetup;
