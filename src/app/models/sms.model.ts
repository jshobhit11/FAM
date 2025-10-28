export interface SmsRequestDto {
    mobileNo: string;           // User's mobile number
    senderId: string;           // Sender ID (like "MESCOM")
    templateKey: string;        // SMS template key (e.g., "MATERIAL_RETURN")
    placeholders: {             // Dynamic variables to replace in template
        var1: string;
        var2: string;
    };
    discom: string;             // Discom name (e.g., "Mescom")
    discomCode: number;         // Discom numeric code
    officeId: string;           // Office ID (string or code)
    personName: string;         // Person name (can be username)
    appCode: number;            // Internal app code
    usercode: string;           // Internal user code
}