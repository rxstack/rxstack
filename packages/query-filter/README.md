# The RxStack QueryFilter

> The QueryFilter component helps you build a `mongodb` like query from http or socket request.

## Installation

```
npm install @rxstack/query-filter --save
```

## Documentation

* [Query filter schema](#query-filter-schema)
* [Equality](#operator-equality)
* [$in, $nin](#operator-in-nin)
* [$lt, $lte](#operator-lt-lte)
* [$gt, $gte](#operator-gt-gte)
* [$ne](#operator-ne)
* [$or](#operator-or)
* [$limit](#operator-limit)
* [$skip](#operator-skip)
* [$sort](#operator-sort)
* [Replace original operator](#operator-replace)
* [Replace $or operator](#operator-replace-or)

### <a name="query-filter-schema"></a>  Query filter schema
`QueryFilterSchema` is used to whitelist properties coming from the request, 
allow certain operators, sorting, apply transformations, `OR` queries and sets default limit.

> Important: in http requests all query values are strings. They might have to be converted to the right type.

```typescript
import {QueryFilterSchema, queryFilter} from '@rxstack/query-filter';

export const myQueryFilterSchema: QueryFilterSchema = {
  'properties': {
    'id': {
      'operators': ['$eq', '$ne'],
      'sort': true,
      'transformers': [parseInt],
    },
    'product_title': {
      'property_path': 'title',
      'operators': ['$ne', '$eq'],
      'sort': true
    }
  },
  'allowOrOperator': true,
  'defaultLimit': 10
};
```

Using with expressjs or socketio:

```typescript
import {QueryFilterSchema, QueryFilter} from '@rxstack/query-filter';

// GET /messages?id=1&product_title=any&not_listed=any
app.get('/messages', (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
   const result = queryFilter.createQuery(myQueryFilterSchema, req.query);
});

// client side
socket.emit('messages', { 'params': {
  'id': 1,
  'product_title': {'$ne': 'some'},
  'not_listed': 'any'
}});

// server side
socket.on('messages', (args: any, callback: Function) => {
  const result = queryFilter.createQuery(myQueryFilterSchema, args.params);
});


// output: { 'where': {'id': { '$eq': 1 }, 'product_title': { '$ne': 'some' }}, 'limit': 10, 'skip': 0 }
```

The output will return [`QueryInterface`](src/interfaces.ts);


### Operators:

##### <a name="operator-equality"></a> Equality
All fields that do not contain special query parameters are compared directly for equality.

ex: `GET /messages?id=1`

output: `{'where': {'id': { '$eq': 1 }}}`

##### <a name="operator-in-nin"> `$in`, `$nin`
Find all records where the property does ($in) or does not ($nin) match any of the given values.

ex: `GET /messages?roomId[$in]=2&roomId[$in]=5`

output: `{'where': {'roomId': { '$in': [1,5] }}}`

##### <a name="operator-lt-lte"> `$lt`, `$lte`
Find all records where the value is less ($lt) or less and equal ($lte) to a given value.

ex: `GET /messages?createdAt[$lt]=1479664146607`

output: `{'where': {'createdAt': { '$lt': 1479664146607 }}}`

##### <a name="operator-gt-gte"> `$gt`, `$gte`
Find all records where the value is more ($gt) or more and equal ($gte) to a given value.

ex: `GET /messages?createdAt[$gt]=1479664146607`

output: `{'where': {'createdAt': { '$gt': 1479664146607 }}}`

##### <a name="operator-ne"> `$ne`
Find all records that do not equal the given property value.

ex: `GET /messages?id[$ne]=1`

output: `{'where': {'id': { '$ne': 1 }}}`

##### <a name="operator-or"> `$or`
Find all records that match any of the given criteria (you'll need to enabled it in the schema `allowOrOperator: true`). 

ex: `GET /messages?$or[0][archived][$ne]=true&$or[1][roomId]=2`

output: `{'where': {'$or': [{'archived': {'$ne': true}}, {'roomId': {'$eq': 2}}]}}`


#####  <a name="operator-limit">`$limit`
Parses the query parameter `$limit` and cast it to integer, it should not exceed the default value set in the schema. 
If `$limit` is not defined in the query then default value set in the schema is used.

ex: `GET /messages?$limit=2&read=false`

output: `{'where': {'read': { '$eq': false }}, 'limit': 2}`


##### <a name="operator-skip"> `$skip`
Parses the query parameter `$skip` and cast it to integer. 
If `$skip` is not defined in the query then `0` is returned.

ex: `GET /messages?$limit=2&$skip=2&read=false`

output: `{'where': {'read': { '$eq': false }}, 'limit': 2, 'skip': 2}`


##### <a name="operator-sort"> `$sort`
If sorting is enabled for a specific field in the schema then a sort object is returned:

ex: `/messages?$limit=10&$sort[createdAt]=-1`

output: `{'limit': 10, 'sort': {'createdAt': -1}}`

##### <a name="operator-replace"> Replace original operator
In some cases you need to replace the original operator with something db-specific.

Let's assume we need to perform `$regex` search on a db-field `name` with `mongoose`:

ex: `/messages?search=something`

```typescript
import {QueryFilterSchema} from '@rxstack/query-filter';

export const customQueryFilter: QueryFilterSchema = {
  'properties': {
    'search': {
      'property_path': 'name',
      'operators': ['$eq'],
      'replace_operators': [['$eq', '$regex']],
      'transformers': [
        (value: any) => new RegExp(`${value}`, 'i')
      ],
      'sort': true
    }
  },
  'allowOrOperator': false,
  'defaultLimit': 25
};
```


##### <a name="operator-replace"> Replace `$or` operator
In some cases you need to replace the `$or` operator with something db-specific.

```typescript
import {QueryFilterSchema} from '@rxstack/query-filter';

export const customQueryFilter: QueryFilterSchema = {
  // ...
  'allowOrOperator': true,
  'replaceOrOperatorWith': Symbor('or'),
};
```


## License

Licensed under the [MIT license](../../LICENSE).
