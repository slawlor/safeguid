import { Guid as _tsGuid } from 'typescript-guid';
import { Guid as _guidTs } from "guid-typescript";

import { GuidFormat } from './guidformat';

export {}
declare global {
    /**
     * Represents a Guid wrapper around the SafeGuid implementation. Does not require importing and can be used for simple
     * comparisons or serialization over the wire
     */
    export interface IGuid extends String {
        /**
         * Compare this guid to another guid
         * @param other - The other guid to compare to as a typescript-guid 'Guid' object
         * @returns true if the guids are equal, or both null, false otherwise
         */
        equals(other: _tsGuid) : boolean;
        /**
         * Compare this guid to another guid
         * @param other - The other guid to compare to
         * @returns true if the guids are equal, or both null, false otherwise
         */
        equals(other: IGuid) : boolean;
        /**
         * Compare this guid to another guid
         * @param other - The other guid to compare to in string format
         * @returns true if the guids are equal, or both null, false otherwise
         */
        equals(other: string | String) : boolean;
        /**
         * 
         * @param potentialGuid - A potential guid in any of the supported formats
         * @returns true if the potential guid is equal to this one, false in all other scenarios
         */
        equals(potentialGuid?: IGuid | _tsGuid | string | String | undefined) : boolean;

        /**
         * Tests whether the guid is empty
         * @returns True if the guid is empty, false otherwise
         */
        isEmpty() : boolean;

        /**
         * Convert the guid to string representation ('D' format)
         */
        toString() : string;

        /**
         * Convert the guid to string representation
         * @param fmt - The format of the guid to return, defaults to GuidFormat.D ('D')
         */
        toStringFormat(fmt? : GuidFormat | string | undefined) : string;

        /**
         * Retrieve the guid as JSON ready value (StringFormat = 'D')
         */
        toJSON() : any;

        /**
         * Retrieve the guid as JSON ready value (StringFormat = 'D')
         */
        toJson() : any;

        /**
         * Get the raw value of the object
         * @returns The raw value of the object, for equality comparisons
         */
        valueOf() : string;
        
        /**
         * Convert the SafeGuid to a typescript-guid guid
         */
        toTypescriptGuid() : _tsGuid;

        /**
         * Convert the SafeGuid to a guid-typescript guid
         */
        toGuidTypescript() : _guidTs;

        /**
         * Clone the current guid
         */
        clone() : IGuid;
    }

}