/**
 * Represents the format of a guid string
 */
export enum GuidFormat {
    /**
     * 32 digits: '00000000000000000000000000000000'
     */
    N = 'N', 
    /**
     * 32 digits separated by hyphens: '00000000-0000-0000-0000-000000000000'
     */
    D = 'D', 
    /**
     * 32 digits separated by hyphens, enclosed in braces: '{00000000-0000-0000-0000-000000000000}'
     */
    B = 'B', 
    /**
     * 32 digits separated by hyphens, enclosed in paranthesis: '(00000000-0000-0000-0000-000000000000)'
     */
    P = 'P', 
}