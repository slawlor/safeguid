import { Guid as _tsGuid } from 'typescript-guid';
import { Guid as _guidTs } from 'guid-typescript';
import { GuidSet, GuidMap } from './guid-sets';
import { GuidFormat } from './guidformat';
import { IGuid } from './iguid';

/**
 * Represents a strongly typed string representation of a guid with all the general mutation/helpers around guid management
 * @todo - SafeGuid does NOT support Lodash's cloneDeep(.) functionality as the underlying string array is read only. If you need to clone the underlying guid, use the built-in clone() method
 */
 export class SafeGuid extends String implements IGuid  {

    //#region Constants

    private static validator =
        new RegExp('^\\(?\\{?(([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12}))\\)?\\}?|(([a-z0-9]{8})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{12}))$', 'i');

    private static _EMPTY : string = '00000000-0000-0000-0000-000000000000';

    /**
     * Represents the empty guid
     */
    public static EMPTY : IGuid = new SafeGuid(SafeGuid._EMPTY);

    //#endregion

    //#region Public Static Methods

    /**
     * Test if a guid is valid against the validator
     * @returns true if the guid is valid, false otherwise
     */
    public static isGuid(guid: any) : boolean {
        var value : string;
        if (typeof guid === 'string') {
            value = guid;
        } else if (guid && typeof guid === 'object' && guid.toString && typeof guid.toString === 'function') {
            value = guid.toString();
        } else {
            return false;
        }

        if (value && SafeGuid.validator.test(value)) {
            return true;
        }
        return false;
    }

    /**
     * Generate a new guid randomly
     * @returns The generated guid
     */
    public static newGuid() : IGuid {
        const text = [SafeGuid.gen(2), SafeGuid.gen(1), SafeGuid.gen(1), SafeGuid.gen(1), SafeGuid.gen(3)].join('-');
        return new SafeGuid(text);
    }

    /**
     * Try and parse the guid from a string
     * @returns An object with a success flag and the parsed value
     */
    public static tryParse(value: string) : { success: boolean, value: IGuid } {
        if (SafeGuid.isGuid(value)) {
            return {
                success: true,
                value: new SafeGuid(value)
            };
        }
        return {
            success: false,
            value: SafeGuid.EMPTY
        };
    }

    /**
     * Parse the guid from a string
     * @returns The parsed guid, error otherwise
     */
    public static parse(value: string) : IGuid {
        const theTry = SafeGuid.tryParse(value);
        if (theTry.success) {
            return theTry.value;
        }
        throw new Error('Invalid Guid');
    }

    /**
     * Helper conversion to statically construct a guid instance
     * @returns - The IGuid instance
     */
    public static from(value?: any) : IGuid {
        return new SafeGuid(value);
    }

    /**
     * Create the special GuidMap type which implements the Map logic from IGuid -> T properly
     * @param entries - Optional entries to initialize the map with
     * @returns - A new Map<IGuid,T>
     */
    public static createMap<T>(entries?: Iterable<[IGuid | string, T]> | null) : Map<IGuid,T> {
        if (entries) {
            return new GuidMap<T>(entries);
        }
        return new GuidMap<T>();
    }

    /**
     * Create the special GuidSet type which implements the Set logic for IGuid
     * @param values - Optional values to initialize the set with
     * @returns - A new Set<IGuid>
     */
    public static createSet(values?: Iterable<IGuid | string> | null) : Set<IGuid> {
        if (values) {
            return new GuidSet(values);
        }
        return new GuidSet();
    }

    //#endregion

    //#region Public Instance Methods

    /**
     * Compare this guid to another guid
     * @param other - The other guid to compare to as a typescript-guid 'Guid' object
     * @returns true if the guids are equal, or both null, false otherwise
     */
    public equals(other: _tsGuid) : boolean;
    /**
     * Compare this guid to another guid
     * @param other - The other guid to compare to as a guid-typescript 'Guid' object
     * @returns true if the guids are equal, or both null, false otherwise
     */
    public equals(other: _guidTs) : boolean;
    /**
     * Compare this guid to another guid
     * @param other - The other guid to compare to
     * @returns true if the guids are equal, or both null, false otherwise
     */
    public equals(other: IGuid) : boolean;
    /**
     * Compare this guid to another guid
     * @param other - The other guid to compare to in string format
     * @returns true if the guids are equal, or both null, false otherwise
     */
    public equals(other: string | String) : boolean;
    /**
     *
     * @param potentialGuid - A potential guid in any of the supported formats
     * @returns true if the potential guid is equal to this one, false in all other scenarios
     */
    public equals(potentialGuid?: IGuid | _tsGuid | _guidTs | string | String | undefined) : boolean {
        if ((potentialGuid === undefined || potentialGuid === null)) {
            if ((this === undefined || this === null)) {
                // both null or undefined
                return true;
            } else {
                // other is undefined, but we have a value
                return false;
            }
        }

        var other: IGuid;
        if (typeof potentialGuid === 'string') {
            const parse = SafeGuid.tryParse(potentialGuid);
            if (parse.success) {
                other = parse.value;
            } else {
                throw new Error('Invalid guid format');
            }
        } else if (typeof potentialGuid === 'object') {
            if (potentialGuid instanceof SafeGuid || potentialGuid instanceof _tsGuid || potentialGuid instanceof _guidTs) {
                other = new SafeGuid(potentialGuid);
            } else if (potentialGuid && potentialGuid.toString && typeof potentialGuid.toString === 'function') {
                const str = potentialGuid.toString();
                if (SafeGuid.isGuid(str)) {
                    other = new SafeGuid(str);
                } else {
                    throw new Error("Invalid guid formatted");
                }
            }
            // catch all
            else {
                throw new Error('Unsupported comparison type for SafeGuid');
            }
        } else {
            throw new Error('Unsupported comparison type for SafeGuid');
        }

        if (other && this) {
            // compare the inherit value of both guid's in the 'N', lowercase format
            return other.valueOf() === this.valueOf();
        }

        // catch all, inequal assumption
        return false;
    }

    /**
     * Tests whether the guid is empty
     * @returns True if the guid is empty, false otherwise
     */
    public isEmpty() : boolean {
        return this.equals(SafeGuid.EMPTY);
    }

    /**
     * Convert the guid to string representation ('D' format)
     */
    public toString() : string {
        return this.toStringFormat(GuidFormat.D);
    }

    /**
     * Convert the guid to string representation
     * @param fmt - The format of the guid to return, defaults to GuidFormat.D ('D')
     */
    public toStringFormat(fmt? : GuidFormat | string | undefined) : string {
        /*
        NOTE: JavaScript's implementation of ECMAScript can vary from browser to browser, however for Chrome, many string operations
        (substr, slice, regex, etc.) simply retain references to the original string rather than making copies of the string.
        This is a known issue in Chrome (Bug #2869). This code works by appending a space to the front of the string.
        This concatenation results in a string copy in Chrome's implementation. Then the substring after the space can be referenced.
        */
        const str = (' ' + super.toString()).slice(1);

        const format = fmt !== undefined && fmt !== null && fmt.length > 0 ? fmt : GuidFormat.D;
        // early exit if "N" is the format, since that the internal structure stored for the guid
        if (format === GuidFormat.N) {
            return str.replace(/-/g,'').toLowerCase();
        }
        // retrieve the parsed parts
        const parts = SafeGuid.getParts(str);
        // join with a '-' in lowercase in order to do stuff like straight comparisons
        const d = parts.join('-').toLowerCase();

        switch(format)
        {
            case GuidFormat.D:
                return d;
            case GuidFormat.B:
                return '(' + d + ')';
            case GuidFormat.P:
                return '{' + d + '}';
            default:
                return d;
        }
    }

    /**
     * Retrieve the guid as JSON ready value (StringFormat = 'D')
     * @returns string of guid ready for JSON
     */
    public toJson() : any { return this.toJSON(); }
    /**
     * Retrieve the guid as JSON ready value (StringFormat = 'D')
     * @returns string of guid ready for JSON
     */
    public toJSON() : any {
        /*
        NOTE: JavaScript's implementation of ECMAScript can vary from browser to browser, however for Chrome, many string operations
        (substr, slice, regex, etc.) simply retain references to the original string rather than making copies of the string.
        This is a known issue in Chrome (Bug #2869). This code works by appending a space to the front of the string.
        This concatenation results in a string copy in Chrome's implementation. Then the substring after the space can be referenced.
        */
        const payload = this.toStringFormat(GuidFormat.D);
        return (' ' + payload).slice(1).toLowerCase();
    }

    /**
     * Get the raw value of the object
     * @returns The raw value of the object, for equality comparisons
     */
    public valueOf() : string {
        /*
        NOTE: JavaScript's implementation of ECMAScript can vary from browser to browser, however for Chrome, many string operations
        (substr, slice, regex, etc.) simply retain references to the original string rather than making copies of the string.
        This is a known issue in Chrome (Bug #2869). This code works by appending a space to the front of the string.
        This concatenation results in a string copy in Chrome's implementation. Then the substring after the space can be referenced.
        */
        const str = (' ' + super.toString()).slice(1).replace(/-/g, '').toLowerCase();
        return str;
    }

    /**
     * Convert the SafeGuid to a Typescript guid
     */
    public toTypescriptGuid() : _tsGuid {
        const thisString = this.toString();
        if (thisString) {
            return _tsGuid.parse(thisString);
        }
        return _tsGuid.EMPTY;
    }

    /**
     * Convert the SafeGuid to a guid-typescript guid
     * @returns A new guid-typescript guid
     */
    public toGuidTypescript() : _guidTs {
        const thisString = this.toString();
        if (thisString) {
            return _guidTs.parse(thisString);
        }
        return _guidTs.createEmpty();
    }

    /**
     * Clone the current guid
     */
    public clone() : IGuid {
        if (this) {
            return new SafeGuid(this.valueOf());
        }
        throw new Error("This guid is not valid and cannot be cloned");
    }

    //#endregion

    //#region Constructors

    /**
     * Construct an empty guid
     */
    constructor();
    /**
     * Construct a guid from any supported value
     */
    constructor(value: any);
    /**
     * Construct a guid from any supported value
     */
    constructor(value?: any) {
        super(SafeGuid.formatInitialInput(value));
    }

    //#endregion

    //#region Private Methods

    /**
     * Retrieve the 5 parts of the guid components as sub-strings
     * @return Array of guid parts
     */
    private static getParts(str: string) {
        if (str) {
            const matches = str.match(SafeGuid.validator);
            if (matches && matches.length && matches.length > 0 && matches[0]) {
                // there was a match, find the right fmt (a or b)
                if (matches[1]) { // outer group 1 matches
                    return [ matches[2], matches[3], matches[4], matches[5], matches[6] ];
                } else if (matches[7]) { // outer group 2 matches
                    return [ matches[8], matches[9], matches[10], matches[11], matches[12] ];
                }
            }
        }
        return [];
    }

    /**
     * Format the initial input to the SafeGuid class
     */
    private static formatInitialInput(obj?: any) : string {
        var str = SafeGuid._EMPTY; // failover to SafeGuid.EMPTY

        if (obj !== undefined && obj !== null) {
            if (typeof obj === 'string') {
                const parts = SafeGuid.getParts(obj);
                if (parts.length > 0) { // valid guid, safe internally using the 'N' format
                    str = parts.join('');
                } else {
                    throw new Error('Invalid guid format');
                }
            } else if (typeof obj === 'object' && obj instanceof _tsGuid) {
                const parts = SafeGuid.getParts(obj.toString());
                if (parts.length > 0) {
                    str = parts.join('');
                } else {
                    throw new Error('Invalid guid from Typescript-Guid');
                }
            } else if (typeof obj === 'object' && obj instanceof _guidTs) {
                const parts = SafeGuid.getParts(obj.toString());
                if (parts.length > 0) {
                    str = parts.join('');
                } else {
                    throw new Error('Invalid guid from Guid-Typescript');
                }
            } else if (typeof obj === 'object' && obj instanceof SafeGuid) {
                // we can just safely apply the value here, since it's already a SafeGuid instance
                str = obj.valueOf();
            } else if (typeof obj === 'object' && obj.toString && typeof obj.toString === 'function') {
                const parts = SafeGuid.getParts(obj.toString());
                if (parts.length > 0){
                    str = parts.join('');
                } else {
                    throw new Error('Invalid guid format from object');
                }
            }
            else {
                throw new Error('Unsupported guid type');
            }
        }

        return str.replace(/-/g,'').toLowerCase(); // assure 'N' formatting
    }

    /**
     * Generate a random number of characters
     */
    private static gen(count: number) : string {
        let out: string = '';
        for (let i: number = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    }

    //#endregion
}
