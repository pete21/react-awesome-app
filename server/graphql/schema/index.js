const debug = require('debug')('server:graphql:schema:index');

const { GraphQLSchema } = require('yeps-graphql/graphql');

const QueryType = require('./query');
const MutationType = require('./mutation');

debug('Schema created');

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = schema;
