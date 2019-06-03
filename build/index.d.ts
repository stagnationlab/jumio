import { Router } from "express";
import { Logger } from "ts-log";
export declare type HandleIdentityVerificationFn = (verificationResult: IdentityVerificationResult) => Promise<void>;
export declare type HandleDocumentVerificationFn = (verificationResult: DocumentVerificationResult) => Promise<void>;
export interface JumioConfig {
    apiToken: string;
    apiSecret: string;
    region: Region;
    company: string;
    handleIdentityVerification?: HandleIdentityVerificationFn;
    handleDocumentVerification?: HandleDocumentVerificationFn;
    version?: string;
    identityApiBaseUrl?: string;
    documentApiBaseUrl?: string;
    callbackWhitelist?: string[];
    log?: Logger;
}
export declare enum Region {
    US = "US",
    EU = "EU"
}
export declare type RegionApiUrlMap = {
    [key in keyof typeof Region]: string;
};
export declare type RegionCallbackWhitelistMap = {
    [key in keyof typeof Region]: string[];
};
export declare enum WorkflowId {
    ID_CAMERA_AND_UPLOAD = 100,
    ID_CAMERA_ONLY = 101,
    ID_UPLOAD_ONLY = 102,
    ID_AND_IDENTITY_CAMERA_AND_UPLOAD = 200,
    ID_AND_IDENTITY_CAMERA_ONLY = 201,
    ID_AND_IDENTITY_UPLOAD_ONLY = 202
}
export interface Preset {
    index: number;
    country: CountryCode;
    type: IdType;
}
export declare enum Locale {
    "bg" = "bg",
    "cs" = "cs",
    "da" = "da",
    "de" = "de",
    "el" = "el",
    "en" = "en",
    "en_GB" = "en_GB",
    "es" = "es",
    "es_MX" = "es_MX",
    "et" = "et",
    "fi" = "fi",
    "fr" = "fr",
    "hu" = "hu",
    "it" = "it",
    "ja" = "ja",
    "ko" = "ko",
    "lt" = "lt",
    "nl" = "nl",
    "no" = "no",
    "pl" = "pl",
    "pt" = "pt",
    "pt_BR" = "pt_BR",
    "ro" = "ro",
    "ru" = "ru",
    "sk" = "sk",
    "sv" = "sv",
    "tr" = "tr",
    "vl" = "vl",
    "zh_CN" = "zh_CN",
    "zh_HK" = "zh_HK"
}
export interface InitiateIdentityVerificationParameters {
    customerInternalReference: string;
    userReference: string;
    reportingCriteria?: string;
    successUrl?: string;
    errorUrl?: string;
    callbackUrl?: string;
    workflowId?: WorkflowId;
    presets?: Preset[];
    locale?: Locale;
    tokenLifetimeInMinutes?: number;
}
export interface InitiateIdentityVerificationResponse {
    timestamp: string;
    redirectUrl: string;
    transactionReference: string;
}
export declare enum IdentityVerificationStatus {
    APPROVED_VERIFIED = "APPROVED_VERIFIED",
    DENIED_FRAUD = "DENIED_FRAUD",
    DENIED_UNSUPPORTED_ID_TYPE = "DENIED_UNSUPPORTED_ID_TYPE",
    DENIED_UNSUPPORTED_ID_COUNTRY = "DENIED_UNSUPPORTED_ID_COUNTRY",
    ERROR_NOT_READABLE_ID = "ERROR_NOT_READABLE_ID",
    NO_ID_UPLOADED = "NO_ID_UPLOADED"
}
export declare enum IdScanStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
}
export declare enum IdScanSource {
    WEB = "WEB",
    WEB_CAM = "WEB_CAM",
    WEB_UPLOAD = "WEB_UPLOAD",
    REDIRECT = "REDIRECT",
    REDIRECT_CAM = "REDIRECT_CAM",
    REDIRECT_UPLOAD = "REDIRECT_UPLOAD",
    API = "API",
    SDK = "SDK"
}
export declare enum IdCheckStatus {
    OK = "OK",
    NOT_AVAILABLE = "N/A"
}
export declare enum IdType {
    PASSPORT = "PASSPORT",
    DRIVING_LICENSE = "DRIVING_LICENSE",
    ID_CARD = "ID_CARD",
    VISA = "VISA"
}
export declare enum IdSubType {
    NATIONAL_ID = "NATIONAL_ID",
    CONSULAR_ID = "CONSULAR_ID",
    ELECTORAL_ID = "ELECTORAL_ID",
    RESIDENT_PERMIT_ID = "RESIDENT_PERMIT_ID",
    TAX_ID = "TAX_ID",
    STUDENT_ID = "STUDENT_ID",
    PASSPORT_CARD_ID = "PASSPORT_CARD_ID",
    MILITARY_ID = "MILITARY_ID",
    OTHER_ID = "OTHER_ID",
    VISA = "VISA",
    LEARNING_DRIVING_LICENSE = "LEARNING_DRIVING_LICENSE",
    E_PASSPORT = "E_PASSPORT",
    UNKNOWN = "UNKNOWN"
}
export declare enum RejectReasonCode {
    MANIPULATED_DOCUMENT = 100,
    FRAUDSTER = 105,
    FAKE = 106,
    PHOTO_MISMATCH = 107,
    MRZ_CHECK_FAILED = 108,
    PUNCHED_DOCUMENT = 109,
    CHIP_DATA_MANIPULATED = 110,
    MISMATCH_PRINTED_BARCODE_DATA = 111,
    PHOTOCOPY_BLACK_WHITE = 102,
    PHOTOCOPY_COLOR = 103,
    DIGITAL_COPY = 104,
    NOT_READABLE_DOCUMENT = 200,
    NO_DOCUMENT = 201,
    SAMPLE_DOCUMENT = 202,
    MISSING_BACK = 206,
    WRONG_DOCUMENT_PAGE = 207,
    MISSING_SIGNATURE = 209,
    CAMERA_BLACK_WHITE = 210,
    DIFFERENT_PERSONS_SHOWN = 211,
    MANUAL_REJECTION = 300
}
export declare enum RejectReasonDescription {
    MANIPULATED_DOCUMENT = "MANIPULATED_DOCUMENT",
    FRAUDSTER = "FRAUDSTER",
    FAKE = "FAKE",
    PHOTO_MISMATCH = "PHOTO_MISMATCH",
    MRZ_CHECK_FAILED = "MRZ_CHECK_FAILED",
    PUNCHED_DOCUMENT = "PUNCHED_DOCUMENT",
    CHIP_DATA_MANIPULATED = "CHIP_DATA_MANIPULATED",
    MISMATCH_PRINTED_BARCODE_DATA = "MISMATCH_PRINTED_BARCODE_DATA",
    PHOTOCOPY_BLACK_WHITE = "PHOTOCOPY_BLACK_WHITE",
    PHOTOCOPY_COLOR = "PHOTOCOPY_COLOR",
    DIGITAL_COPY = "DIGITAL_COPY",
    NOT_READABLE_DOCUMENT = "NOT_READABLE_DOCUMENT",
    NO_DOCUMENT = "NO_DOCUMENT",
    SAMPLE_DOCUMENT = "SAMPLE_DOCUMENT",
    MISSING_BACK = "MISSING_BACK",
    WRONG_DOCUMENT_PAGE = "WRONG_DOCUMENT_PAGE",
    MISSING_SIGNATURE = "MISSING_SIGNATURE",
    CAMERA_BLACK_WHITE = "CAMERA_BLACK_WHITE",
    DIFFERENT_PERSONS_SHOWN = "DIFFERENT_PERSONS_SHOWN",
    MANUAL_REJECTION = "MANUAL_REJECTION"
}
export declare enum RejectDetailsCode {
    PHOTO = 1001,
    DOCUMENT_NUMBER = 1002,
    EXPIRY = 1003,
    DOB = 1004,
    NAME = 1005,
    ADDRESS = 1006,
    SECURITY_CHECKS = 1007,
    SIGNATURE = 1008,
    PERSONAL_NUMBER = 1009,
    PLACE_OF_BIRTH = 10011,
    BLURRED = 2001,
    BAD_QUALITY = 2002,
    MISSING_PART_DOCUMENT = 2003,
    HIDDEN_PART_DOCUMENT = 2004,
    DAMAGED_DOCUMENT = 2005
}
export declare enum RejectDetailsDescription {
    PHOTO = "PHOTO",
    DOCUMENT_NUMBER = "DOCUMENT_NUMBER",
    EXPIRY = "EXPIRY",
    DOB = "DOB",
    NAME = "NAME",
    ADDRESS = "ADDRESS",
    SECURITY_CHECKS = "SECURITY_CHECKS",
    SIGNATURE = "SIGNATURE",
    PERSONAL_NUMBER = "PERSONAL_NUMBER",
    PLACE_OF_BIRTH = "PLACE_OF_BIRTH",
    BLURRED = "BLURRED",
    BAD_QUALITY = "BAD_QUALITY",
    MISSING_PART_DOCUMENT = "MISSING_PART_DOCUMENT",
    HIDDEN_PART_DOCUMENT = "HIDDEN_PART_DOCUMENT",
    DAMAGED_DOCUMENT = "DAMAGED_DOCUMENT"
}
export interface RejectReasonDetails {
    detailsCode: RejectDetailsCode;
    detailsDescription: RejectDetailsDescription;
}
export interface RejectReason {
    rejectReasonCode: RejectReasonCode;
    rejectReasonDescription: RejectReasonDescription;
    rejectReasonDetails?: RejectReasonDetails;
}
export interface AddressUs {
    city: string;
    stateCode: string;
    streetName: string;
    streetSuffix: string;
    streetDirection: string;
    streetNumber: string;
    unitDesignator: string;
    unitNumber: string;
    zip: string;
    zipExtension: string;
    country: CountryCode;
}
export interface AddressEu {
    city: string;
    province: string;
    streetName: string;
    streetNumber: string;
    unitDetails: string;
    postalCode: string;
    country: CountryCode;
}
export interface AddressRaw {
    line1: string;
    line2?: string;
    line3?: string;
    line4?: string;
    line5?: string;
    country?: CountryCode;
    postalCode?: string;
    city?: string;
}
export declare type Address = AddressUs | AddressEu | AddressRaw;
export declare enum Gender {
    M = "M",
    F = "F"
}
export declare enum Similarity {
    MATCH = "MATCH",
    NO_MATCH = "NO_MATCH",
    NOT_POSSIBLE = "NOT_POSSIBLE"
}
export declare enum IdentityInvalidReason {
    SELFIE_CROPPED_FROM_ID = "SELFIE_CROPPED_FROM_ID",
    ENTIRE_ID_USED_AS_SELFIE = "ENTIRE_ID_USED_AS_SELFIE",
    MULTIPLE_PEOPLE = "MULTIPLE_PEOPLE",
    SELFIE_IS_SCREEN_PAPER_VIDEO = "SELFIE_IS_SCREEN_PAPER_VIDEO",
    SELFIE_MANIPULATED = "SELFIE_MANIPULATED",
    AGE_DIFFERENCE_TOO_BIG = "AGE_DIFFERENCE_TOO_BIG",
    NO_FACE_PRESENT = "NO_FACE_PRESENT",
    FACE_NOT_FULLY_VISIBLE = "FACE_NOT_FULLY_VISIBLE",
    BAD_QUALITY = "BAD_QUALITY",
    BLACK_AND_WHITE = "BLACK_AND_WHITE"
}
export interface IdentityVerificationBase {
    similarity: Similarity;
    validity: boolean;
    handwrittenNoteMatches?: boolean;
}
export interface IdentityVerificationSuccess extends IdentityVerificationBase {
    validity: true;
}
export interface IdentityVerificationFailure extends IdentityVerificationBase {
    validity: false;
    reason: IdentityInvalidReason;
}
export declare type IdentityVerificationInfo = IdentityVerificationSuccess | IdentityVerificationFailure;
export declare enum CountryCode {
    AFG = "AFG",
    ALA = "ALA",
    ALB = "ALB",
    DZA = "DZA",
    ASM = "ASM",
    AND = "AND",
    AGO = "AGO",
    AIA = "AIA",
    ATA = "ATA",
    ATG = "ATG",
    ARG = "ARG",
    ARM = "ARM",
    ABW = "ABW",
    AUS = "AUS",
    AUT = "AUT",
    AZE = "AZE",
    BHS = "BHS",
    BHR = "BHR",
    BGD = "BGD",
    BRB = "BRB",
    BLR = "BLR",
    BEL = "BEL",
    BLZ = "BLZ",
    BEN = "BEN",
    BMU = "BMU",
    BTN = "BTN",
    BOL = "BOL",
    BES = "BES",
    BIH = "BIH",
    BWA = "BWA",
    BVT = "BVT",
    BRA = "BRA",
    IOT = "IOT",
    BRN = "BRN",
    BGR = "BGR",
    BFA = "BFA",
    BDI = "BDI",
    CPV = "CPV",
    KHM = "KHM",
    CMR = "CMR",
    CAN = "CAN",
    CYM = "CYM",
    CAF = "CAF",
    TCD = "TCD",
    CHL = "CHL",
    CHN = "CHN",
    CXR = "CXR",
    CCK = "CCK",
    COL = "COL",
    COM = "COM",
    COG = "COG",
    COD = "COD",
    COK = "COK",
    CRI = "CRI",
    CIV = "CIV",
    HRV = "HRV",
    CUB = "CUB",
    CUW = "CUW",
    CYP = "CYP",
    CZE = "CZE",
    DNK = "DNK",
    DJI = "DJI",
    DMA = "DMA",
    DOM = "DOM",
    ECU = "ECU",
    EGY = "EGY",
    SLV = "SLV",
    GNQ = "GNQ",
    ERI = "ERI",
    EST = "EST",
    SWZ = "SWZ",
    ETH = "ETH",
    FLK = "FLK",
    FRO = "FRO",
    FJI = "FJI",
    FIN = "FIN",
    FRA = "FRA",
    GUF = "GUF",
    PYF = "PYF",
    ATF = "ATF",
    GAB = "GAB",
    GMB = "GMB",
    GEO = "GEO",
    DEU = "DEU",
    GHA = "GHA",
    GIB = "GIB",
    GRC = "GRC",
    GRL = "GRL",
    GRD = "GRD",
    GLP = "GLP",
    GUM = "GUM",
    GTM = "GTM",
    GGY = "GGY",
    GIN = "GIN",
    GNB = "GNB",
    GUY = "GUY",
    HTI = "HTI",
    HMD = "HMD",
    VAT = "VAT",
    HND = "HND",
    HKG = "HKG",
    HUN = "HUN",
    ISL = "ISL",
    IND = "IND",
    IDN = "IDN",
    IRN = "IRN",
    IRQ = "IRQ",
    IRL = "IRL",
    IMN = "IMN",
    ISR = "ISR",
    ITA = "ITA",
    JAM = "JAM",
    JPN = "JPN",
    JEY = "JEY",
    JOR = "JOR",
    KAZ = "KAZ",
    KEN = "KEN",
    KIR = "KIR",
    PRK = "PRK",
    KOR = "KOR",
    KWT = "KWT",
    KGZ = "KGZ",
    LAO = "LAO",
    LVA = "LVA",
    LBN = "LBN",
    LSO = "LSO",
    LBR = "LBR",
    LBY = "LBY",
    LIE = "LIE",
    LTU = "LTU",
    LUX = "LUX",
    MAC = "MAC",
    MKD = "MKD",
    MDG = "MDG",
    MWI = "MWI",
    MYS = "MYS",
    MDV = "MDV",
    MLI = "MLI",
    MLT = "MLT",
    MHL = "MHL",
    MTQ = "MTQ",
    MRT = "MRT",
    MUS = "MUS",
    MYT = "MYT",
    MEX = "MEX",
    FSM = "FSM",
    MDA = "MDA",
    MCO = "MCO",
    MNG = "MNG",
    MNE = "MNE",
    MSR = "MSR",
    MAR = "MAR",
    MOZ = "MOZ",
    MMR = "MMR",
    NAM = "NAM",
    NRU = "NRU",
    NPL = "NPL",
    NLD = "NLD",
    NCL = "NCL",
    NZL = "NZL",
    NIC = "NIC",
    NER = "NER",
    NGA = "NGA",
    NIU = "NIU",
    NFK = "NFK",
    MNP = "MNP",
    NOR = "NOR",
    OMN = "OMN",
    PAK = "PAK",
    PLW = "PLW",
    PSE = "PSE",
    PAN = "PAN",
    PNG = "PNG",
    PRY = "PRY",
    PER = "PER",
    PHL = "PHL",
    PCN = "PCN",
    POL = "POL",
    PRT = "PRT",
    PRI = "PRI",
    QAT = "QAT",
    REU = "REU",
    ROU = "ROU",
    RUS = "RUS",
    RWA = "RWA",
    BLM = "BLM",
    SHN = "SHN",
    KNA = "KNA",
    LCA = "LCA",
    MAF = "MAF",
    SPM = "SPM",
    VCT = "VCT",
    WSM = "WSM",
    SMR = "SMR",
    STP = "STP",
    SAU = "SAU",
    SEN = "SEN",
    SRB = "SRB",
    SYC = "SYC",
    SLE = "SLE",
    SGP = "SGP",
    SXM = "SXM",
    SVK = "SVK",
    SVN = "SVN",
    SLB = "SLB",
    SOM = "SOM",
    ZAF = "ZAF",
    SGS = "SGS",
    SSD = "SSD",
    ESP = "ESP",
    LKA = "LKA",
    SDN = "SDN",
    SUR = "SUR",
    SJM = "SJM",
    SWE = "SWE",
    CHE = "CHE",
    SYR = "SYR",
    TWN = "TWN",
    TJK = "TJK",
    TZA = "TZA",
    THA = "THA",
    TLS = "TLS",
    TGO = "TGO",
    TKL = "TKL",
    TON = "TON",
    TTO = "TTO",
    TUN = "TUN",
    TUR = "TUR",
    TKM = "TKM",
    TCA = "TCA",
    TUV = "TUV",
    UGA = "UGA",
    UKR = "UKR",
    ARE = "ARE",
    GBR = "GBR",
    USA = "USA",
    UMI = "UMI",
    URY = "URY",
    UZB = "UZB",
    VUT = "VUT",
    VEN = "VEN",
    VNM = "VNM",
    VGB = "VGB",
    VIR = "VIR",
    WLF = "WLF",
    ESH = "ESH",
    XKX = "XKX",
    YEM = "YEM",
    ZMB = "ZMB",
    ZWE = "ZWE"
}
export declare enum DlCarPermission {
    YES = "YES",
    NO = "NO",
    NOT_READABLE = "NOT_READABLE"
}
export declare enum DlCategory {
    B1 = "B1",
    B = "B",
    BE = "BE"
}
export interface DlCategoryItem {
    category: DlCategory;
    issueDate?: string;
    expiryDate?: string;
    isReadable?: boolean;
}
export declare type DlCategories = DlCategoryItem[];
export interface VerificationMetadata {
    rawResult: object;
    callbackIp: string;
    isValidCallbackIp: boolean;
}
export interface VerificationResultBase {
    metadata: VerificationMetadata;
    callbackType: string;
    jumioIdScanReference: string;
    verificationStatus: IdentityVerificationStatus;
    idScanStatus: IdScanStatus;
    idScanSource: IdScanSource;
    idCheckDataPositions: IdCheckStatus;
    idCheckDocumentValidation: IdCheckStatus;
    idCheckHologram: IdCheckStatus;
    idCheckMRZcode: IdCheckStatus;
    idCheckMicroprint: IdCheckStatus;
    idCheckSecurityFeatures: IdCheckStatus;
    idCheckSignature: IdCheckStatus;
    transactionDate: Date;
    callbackDate: Date;
    idScanImage?: string;
    idScanImageFace?: string;
    idScanImageBackside?: string;
    idUsState?: string;
    idAddress?: Address;
    merchantIdScanReference?: string;
    merchantReportingCriteria?: string;
    customerId?: string;
    clientIp?: string;
    optionalData1?: string;
    optionalData2?: string;
    dni?: string;
    curp?: string;
    gender?: Gender;
    presetCountry?: CountryCode;
    presetIdType?: IdType;
    dlCarPermission?: DlCarPermission;
    dlCategories?: DlCategories;
    nationality?: CountryCode;
    passportNumber?: string;
    durationOfStay?: string;
    numberOfEntries?: string;
    visaCategory?: string;
    originDob?: string;
}
export interface VerificationResultApproved extends VerificationResultBase {
    verificationStatus: IdentityVerificationStatus.APPROVED_VERIFIED;
    idType: IdType;
    idSubtype?: IdSubType;
    idNumber: string;
    idCountry: CountryCode;
    idFirstName: string | "N/A";
    idLastName: string | "N/A";
    idDob?: Date;
    idExpiry?: Date;
    personalNumber: string | "N/A";
    identityVerification: IdentityVerificationInfo;
    firstAttemptDate: Date;
}
export interface VerificationResultDeniedFraud extends VerificationResultBase {
    verificationStatus: IdentityVerificationStatus.DENIED_FRAUD;
    rejectReason: RejectReason;
    firstAttemptDate: Date;
}
export interface VerificationResultErrorNotReadableId extends VerificationResultBase {
    verificationStatus: IdentityVerificationStatus.ERROR_NOT_READABLE_ID;
    rejectReason: RejectReason;
    firstAttemptDate: Date;
}
export interface VerificationResultUnsupportedIdCountry extends VerificationResultBase {
    verificationStatus: IdentityVerificationStatus.DENIED_UNSUPPORTED_ID_COUNTRY;
    firstAttemptDate: Date;
}
export interface VerificationResultUnsupportedIdType extends VerificationResultBase {
    verificationStatus: IdentityVerificationStatus.DENIED_UNSUPPORTED_ID_TYPE;
    firstAttemptDate: Date;
}
export declare type VerificationResultCombined = VerificationResultApproved & VerificationResultDeniedFraud & VerificationResultErrorNotReadableId & VerificationResultUnsupportedIdCountry & VerificationResultUnsupportedIdType;
export declare type RawIdentityVerificationResult = {
    [key in keyof VerificationResultCombined]: any;
};
export declare type IdentityVerificationResult = VerificationResultApproved | VerificationResultDeniedFraud | VerificationResultErrorNotReadableId | VerificationResultUnsupportedIdCountry | VerificationResultUnsupportedIdType;
export interface IdentityImageEndpointParams {
    id: string;
    type: string;
}
export interface DocumentImageEndpointParams {
    id: string;
    index: string;
}
export interface DocumentOriginalEndpointParams {
    id: string;
}
export declare enum DocumentVerificationType {
    "BC" = "BC",
    "BS" = "BS",
    "CAAP" = "CAAP",
    "CB" = "CB",
    "CC" = "CC",
    "CCS" = "CCS",
    "CRC" = "CRC",
    "CUSTOM" = "CUSTOM",
    "HCC" = "HCC",
    "IC" = "IC",
    "LAG" = "LAG",
    "LOAP" = "LOAP",
    "MEDC" = "MEDC",
    "MOAP" = "MOAP",
    "PB" = "PB",
    "SEL" = "SEL",
    "SENC" = "SENC",
    "SS" = "SS",
    "SSC" = "SSC",
    "STUC" = "STUC",
    "TAC" = "TAC",
    "TR" = "TR",
    "UB" = "UB",
    "VC" = "VC",
    "VT" = "VT",
    "WWCC" = "WWCC"
}
export declare type DocumentTypeList = {
    type: DocumentVerificationType;
    name: string;
}[];
export interface InitiateDocumentVerificationParameters {
    type: DocumentVerificationType;
    country: CountryCode;
    merchantScanReference: string;
    customerId: string;
    enableExtraction: boolean;
    callbackUrl?: string;
    successUrl?: string;
    errorUrl?: string;
    authorizationTokenLifetime?: number;
    merchantReportingCriteria?: string;
    locale?: Locale;
    baseColor?: string;
    bgColor?: string;
    headerImageUrl?: string;
    customDocumentCode?: string;
}
export interface InitiateDocumentVerificationResponse {
    clientRedirectUrl: string;
    scanReference: string;
}
export interface RawDocumentVerificationResult {
    scanReference: string;
    timestamp: string;
    transaction: string;
    document?: string;
}
export interface DocumentVerificationResult {
    metadata: VerificationMetadata;
    scanReference: string;
    transactionStatus: DocumentVerificationTransactionStatus;
    documentStatus: DocumentVerificationDocumentStatus;
    source: DocumentVerificationSource;
    merchantScanReference: string;
    customerId: string;
    merchantReportingCriteria?: string;
    transactionDate: Date;
    callbackDate: Date;
    images: string[];
    originalDocument?: string;
    name?: string;
    address?: string;
    clientIp?: string;
}
export declare enum DocumentVerificationTransactionStatus {
    DONE = "DONE",
    FAILED = "FAILED"
}
export declare enum DocumentVerificationSource {
    DOC_UPLOAD = "DOC_UPLOAD",
    DOC_API = "DOC_API",
    DOC_SDK = "DOC_SDK"
}
export interface DocumentVerificationTransactionInfo {
    date: string;
    status: DocumentVerificationTransactionStatus;
    source: DocumentVerificationSource;
    merchantScanReference: string;
    customerId: string;
    merchantReportingCriteria?: string;
    clientIp?: string;
}
export declare enum DocumentVerificationDocumentStatus {
    NOT_AVAILABLE = "NOT_AVAILABLE",
    UPLOADED = "UPLOADED",
    EXTRACTED = "EXTRACTED",
    DISCARDED = "DISCARDED"
}
export declare type ExtractedDocumentData = {
    name?: string;
    issueDate?: string;
    address?: Address;
    accountNumber?: string;
    pan?: string;
    expiryDate?: string;
    dueDate?: string;
    cardNumberLastFourDigits?: string;
    firstName?: string;
    lastName?: string;
    ssn?: string;
    signatureAvailable?: string;
};
export interface DocumentVerificationDocumentInfo {
    status: DocumentVerificationDocumentStatus;
    country: CountryCode;
    type: DocumentVerificationType;
    images: string[];
    originalDocument?: string;
    customDocumentCode?: string;
    extractedData?: ExtractedDocumentData;
}
export interface Country {
    name: string;
    countryCode: CountryCode;
    region: string;
    subRegion: string;
    locale: Locale;
}
export declare const identityRegionApiUrlMap: RegionApiUrlMap;
export declare const documentRegionApiUrlMap: RegionApiUrlMap;
export declare const identityRetrievalRegionApiUrlMap: RegionApiUrlMap;
export declare const documentRetrievalRegionApiUrlMap: RegionApiUrlMap;
export declare const regionCallbackWhitelistMap: RegionCallbackWhitelistMap;
export declare const documentTypeList: DocumentTypeList;
export declare const countries: Country[];
/**
 * Provides integration to Jumio NetVerify service.
 */
export default class Jumio {
    private readonly config;
    private readonly log;
    private readonly identityApi;
    private readonly documentApi;
    /**
     * Sets up the library.
     *
     * @param config Configuration
     */
    constructor(config: JumioConfig);
    /**
     * Returns whether given identity verification result can be considered a successful verification.
     *
     * @param result Verification result
     */
    static isIdentityConsideredVerified(result: IdentityVerificationResult): boolean;
    /**
     * Returns whether given document verification result can be considered a successful verification.
     *
     * @param result Verification result
     */
    static isDocumentConsideredVerified(result: DocumentVerificationResult): boolean;
    /**
     * Extracts name from the document verification document info if available.
     *
     * @param document Document info
     */
    private static extractDocumentName;
    /**
     * Extracts address from the document verification document info if available.
     *
     * @param document Document info
     */
    private static stringifyAddress;
    /**
     * Transforms raw callback result into parsed object with proper dates, parsed JSON payloads etc.
     *
     * @param info Raw verification result info
     * @param metadata Metadata added by the library
     */
    private static transformRawIdentityResult;
    /**
     * Transforms raw callback result into parsed object with proper dates, parsed JSON payloads etc.
     *
     * @param info Raw verification result info
     * @param metadata Metadata added by the library
     */
    private static transformRawDocumentResult;
    /**
     * Returns parsed Date.
     *
     * @param address Date to parse
     */
    private static parseDate;
    /**
     * Returns whether given address is of US type.
     *
     * @param address Address to check
     */
    private static isUsAddress;
    /**
     * Returns whether given address is of EU type.
     *
     * @param address Address to check
     */
    private static isEuAddress;
    /**
     * Returns whether given address is of raw type.
     *
     * @param address Address to check
     */
    private static isRawAddress;
    /**
     * Returns express router that handles Jumio integration.
     *
     * Example: `router.use("/jumio", jumio.middleware());`
     */
    middleware(): Router;
    /**
     * Initiates identity verification.
     *
     * @param parameters Identity verification initiation parameters
     */
    initiateIdentityVerification(parameters: InitiateIdentityVerificationParameters): Promise<InitiateIdentityVerificationResponse>;
    /**
     * Initiates document verification.
     *
     * @param parameters Document verification initiation parameters
     */
    initiateDocumentVerification(parameters: InitiateDocumentVerificationParameters): Promise<InitiateDocumentVerificationResponse>;
    /**
     * Handles the identity verification Jumio callback.
     *
     * https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    private handleIdentityVerificationCallback;
    /**
     * Handles the document verification Jumio callback.
     *
     * https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    private handleDocumentVerificationCallback;
    /**
     * Handles the identity verification image request.
     *
     * Proxies the request to Jumio API with authentication without exposing the secrets.
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    private handleIdentityVerificationImage;
    /**
     * Handles the document verification image request.
     *
     * Proxies the request to Jumio API with authentication without exposing the secrets.
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    private handleDocumentVerificationImage;
    /**
     * Handles the document verification original document request.
     *
     * Proxies the request to Jumio API with authentication without exposing the secrets.
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    private handleDocumentVerificationOriginal;
    /**
     * Returns whether given request ip is in the whitelist and should thus be accepted.
     *
     * @param requestIp IP address to check
     */
    private isValidCallbackIp;
}
