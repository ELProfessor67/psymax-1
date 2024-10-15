import express from 'express';
import roomRoute from './roomRoute';
const route = express.Router();

route.use('/room',roomRoute)

export default route