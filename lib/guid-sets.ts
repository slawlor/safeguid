import { IGuid } from './iguid';
import { SafeGuid } from './safeguid';

/**
 * Represents a mapping from one iterator to another
 */
 class IteratorMapping<TIn,TOut> implements IterableIterator<TOut> {
    
    //#region Fields

    private readonly strings: IterableIterator<TIn>;
    private readonly converter: (arg: TIn) => TOut;

    //#endregion

    /** Constructor from another iterator with a converter */
    constructor(strings: IterableIterator<TIn>, converter: (arg: TIn) => TOut) {
        this.strings = strings;
        this.converter = converter;
    }

    /**
     * Get the iterator (this)
     */
    [Symbol.iterator](): IterableIterator<TOut> {
        return this;
    }

    /**
     * Retrieve the next item in the iterator
     */
    public next() : IteratorResult<TOut> {
        const current = this.strings.next();
        if (current && current.done === false && current.value) {
            const converted = this.converter(current.value);
            return {
                done: false,
                value: converted
            };
        }
        return {
            done: true,
            value: <any>(null) as TOut
        };
    }
}

/**
 * Represents a Set<IGuid>
 */
 export class GuidSet extends Set<String> implements Set<IGuid> {

    /** Constructors */
    constructor();
    constructor(values: ReadonlyArray<IGuid>);
    constructor(values?: ReadonlyArray<IGuid>) {
        // @ts-ignore
        const arr : ReadonlyArray<string> | undefined = values !== undefined && values !== null ? values.map(item => item.valueOf()) : undefined;
        // @ts-ignore
        super(arr);
    }

    /** Add a guid to the set */
    public add(guid: IGuid) {
        super.add(guid.valueOf());
        return this;
    }

    /** Delete a guid from the set */
    public delete(guid : IGuid) {
        return super.delete(guid.valueOf());
    }

    /** Iterate through the set with a callback */
    public forEach(callbackfn: (value: IGuid, value2: IGuid, set: GuidSet) => void, thisArg?: any): void {
        super.forEach((guida, guidb, set) => callbackfn(new SafeGuid(guida), new SafeGuid(guidb), this), thisArg);
    }

    /** Test if set contains guid */
    public has(value: IGuid) : boolean {
        return super.has(value.valueOf());
    }

    /**
     * Returns an iterable of values in the set.
     */
    public values() : IterableIterator<IGuid> {
        return new IteratorMapping<String, IGuid>(super.values(), (str) => new SafeGuid(str));
    }

    /**
     * Despite its name, returns an iterable of the values in the set.
     */
    public keys(): IterableIterator<IGuid> {
        return this.values();
    }

    /**
     * Returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    public entries() : IterableIterator<[IGuid, IGuid]> {
        return new IteratorMapping<IGuid, [IGuid, IGuid]>(this.keys(), (guid) => [guid, guid]);
    }

    /** Iterates over values in the set. */
    public [Symbol.iterator](): IterableIterator<IGuid> {
        return new IteratorMapping<String, IGuid>(super[Symbol.iterator](), (item) => new SafeGuid(item));
    }
}

/**
 * Represents a Map<IGuid,V>
 */
export class GuidMap<V> extends Map<String, V> implements Map<IGuid, V> {

    /** Constructors */
    constructor();
    constructor(entries: ReadonlyArray<[IGuid, V]>);
    constructor(entries?: ReadonlyArray<[IGuid, V]>) {
        // @ts-ignore
        const arr : ReadonlyArray<[string, V]> | undefined = entries !== undefined && entries !== null ? entries.map(kvp => [kvp[0].valueOf(), kvp[1]]) : undefined;
        // @ts-ignore
        super(arr);
    }

    /** Delete an item with the key from the map */
    public delete(key: IGuid) : boolean {
        return super.delete(key.valueOf());
    }

    /** Iterate through the map, threading a callback */
    public forEach(callbackfn: (value: V, key: IGuid, map: GuidMap<V>) => void, thisArg?: any): void {
        super.forEach((v, guidb, set) => callbackfn(v, new SafeGuid(guidb), this), thisArg);
    }

    /** Get an item with the given key from the map */
    public get(key: IGuid) {
        return super.get(key.valueOf());
    }

    /** Test if map contains key */
    public has(key : IGuid) : boolean {
        return super.has(key.valueOf());
    }

    /** Set a key-value pair into the map */
    public set(key: IGuid, value: V) : this {
        super.set(key.valueOf(), value);
        return this;
    }

    /**
     * Returns an iterable of values in the map
     */
    public values() : IterableIterator<V> {
        return super.values();
    }

    /**
     * Returns an iterable of keys in the map
     */
    public keys(): IterableIterator<IGuid> {
        return new IteratorMapping<String, IGuid>(super.keys(), (str) => new SafeGuid(str));
    }

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    public entries() : IterableIterator<[IGuid, V]> {
        return new IteratorMapping<[String, V], [IGuid, V]>(super.entries(), (strarr) => [new SafeGuid(strarr[0]), strarr[1]]);
    }

    /** Returns an iterable of entries in the map. */
    public [Symbol.iterator](): IterableIterator<[IGuid, V]> {
        return new IteratorMapping<[String, V], [IGuid, V]>(super[Symbol.iterator](), (arg) => [new SafeGuid(arg[0]), arg[1]]);
    }
}