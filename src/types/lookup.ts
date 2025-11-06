export interface Lookup {
    id: string;
    lookupName: string;
    data: Record<string, string>[];
    uploadedAt: string;
    recordCount: number;
    description: string;
    fieldDescriptions: Record<string, string>;
}

export interface LookupWOData {
    id: string;
    lookupName: string;
    uploadedAt: string;
    recordCount: number;
    description: string;
}

export interface UploadLookup {
    lookupName: string; 
    description: string; 
    lookupFile: File;
}