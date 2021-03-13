'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const Dato = require('../models/dato');

const datos = module.context.collection('datos');
const keySchema = joi.string().required()
.description('The key of the dato');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;


router.tag('dato');


router.get(function (req, res) {
  res.send(datos.all());
}, 'list')
.response([Dato], 'A list of datos.')
.summary('List all datos')
.description(dd`
  Retrieves a list of all datos.
`);


router.post(function (req, res) {
  const dato = req.body;
  let meta;
  try {
    meta = datos.save(dato);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(dato, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: dato._key})
  ));
  res.send(dato);
}, 'create')
.body(Dato, 'The dato to create.')
.response(201, Dato, 'The created dato.')
.error(HTTP_CONFLICT, 'The dato already exists.')
.summary('Create a new dato')
.description(dd`
  Creates a new dato from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let dato
  try {
    dato = datos.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(dato);
}, 'detail')
.pathParam('key', keySchema)
.response(Dato, 'The dato.')
.summary('Fetch a dato')
.description(dd`
  Retrieves a dato by its key.
`);
