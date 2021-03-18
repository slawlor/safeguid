# SafeGuid

A better typescript guid implementation. The reason for this library is to explicitely inherit string so we can serialize the guid over the wire to/from JSON more safely. Also it has better guid formatting support for the 4 major guid string formats, B, P, D, and N.

## Installation

```text
npm i safeguid --save
```

## Basic Usage

```typescript
import { SafeGuid } from 'safeguid';
import { Guid as _tsGuid } from 'typescript-guid';

export class Example {
    public id: IGuid;
    public guidString: string;

    constructor() {
        // generate a random guid
        id = SafeGuid.newGuid();
        // get the raw string of the guid, "N" format
        guidString = id.valueOf();
        // parse a guid from string
        id = SafeGuid.parse("b77d409a-10cd-4a47-8e94-b0cd0ab50aa1");
        // Default to string implementation, "D" format, the same as toJSON for json serialization
        guidString = id.toString();
        // Empty guid
        id = SafeGuid.EMPTY;
        // Construct from any supported format
        id = new SafeGuid(); // empty
        id = new SafeGuid("b77d409a-10cd-4a47-8e94-b0cd0ab50aa1"); // from a string
        id = new SafeGuid(new SafeGuid("b77d409a-10cd-4a47-8e94-b0cd0ab50aa1")); // from another IGuid
        id = new SafeGuid(_tsGuid.parse("b77d409a-10cd-4a47-8e94-b0cd0ab50aa1")); // interop support for typescript-guid
    }
}
```
