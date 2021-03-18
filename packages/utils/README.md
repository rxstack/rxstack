# The RxStack Utils

> The Utils component is a collection of helpers.

## Installation

```
npm install @rxstack/utils --save
```

## Documentation

* [Parse range](#parse-range)

### <a name="parse-range"></a>  Parse range
Parse the given header string where size is the maximum size of the resource.

```typescript
import {parseRange} from '@rxstack/utils'

parseRange('bytes=0-1023', 10000); 
// output {'start': 0, 'end': 1023, 'chunkSize': 1024}
```

## License

Licensed under the [MIT license](LICENSE).
