import axios, { AxiosInstance } from "axios";
import { NextFunction, Request, Response, Router } from "express";
import HttpStatus from "http-status-codes";
import * as ip from "ip";
import { dummyLogger, Logger } from "ts-log";

export type HandleIdentityVerificationFn = (
  verificationResult: IdentityVerificationResult
) => Promise<void>;
export type HandleDocumentVerificationFn = (
  verificationResult: DocumentVerificationResult
) => Promise<void>;

export interface JumioConfig {
  apiToken: string;
  apiSecret: string;
  region: Region;
  company: string;
  handleIdentityVerification?: HandleIdentityVerificationFn;
  handleDocumentVerification?: HandleDocumentVerificationFn;
  version?: string;
  identityApiBaseUrl?: string; // built based on chosen region but can be overridden
  documentApiBaseUrl?: string; // built based on chosen region but can be overridden
  callbackWhitelist?: string[]; // set based on chosen region but can be overridden
  log?: Logger;
}

export enum Region {
  US = "US",
  EU = "EU"
}

export type RegionApiUrlMap = { [key in keyof typeof Region]: string };
export type RegionCallbackWhitelistMap = {
  [key in keyof typeof Region]: string[]
};

// https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#supported-workflowid-values
export enum WorkflowId {
  ID_CAMERA_AND_UPLOAD = 100,
  ID_CAMERA_ONLY = 101,
  ID_UPLOAD_ONLY = 102,
  ID_AND_IDENTITY_CAMERA_AND_UPLOAD = 200,
  ID_AND_IDENTITY_CAMERA_ONLY = 201,
  ID_AND_IDENTITY_UPLOAD_ONLY = 202
}

// https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#supported-presets-values
export interface Preset {
  // preset index
  index: number;

  // ISO 3166-1 alpha-3 country code
  country: CountryCode;

  // preset type
  type: IdType;
}

export enum Locale {
  "bg" = "bg", //	Bulgarian
  "cs" = "cs", //	Czech
  "da" = "da", //	Danish
  "de" = "de", //	German
  "el" = "el", //	Greek
  "en" = "en", //	American English (default)
  "en_GB" = "en_GB", // British English
  "es" = "es", //	Spanish
  "es_MX" = "es_MX", // Mexican Spanish
  "et" = "et", //	Estonian
  "fi" = "fi", //	Finnish
  "fr" = "fr", //	French
  "hu" = "hu", //	Hungarian
  "it" = "it", //	Italian
  "ja" = "ja", //	Japanese
  "ko" = "ko", //	Korean
  "lt" = "lt", //	Lithuanian
  "nl" = "nl", //	Dutch
  "no" = "no", //	Norwegian
  "pl" = "pl", //	Polish
  "pt" = "pt", //	Portuguese
  "pt_BR" = "pt_BR", // Brazilian Portuguese
  "ro" = "ro", //	Romanian
  "ru" = "ru", //	Russian
  "sk" = "sk", //	Slovak
  "sv" = "sv", //	Swedish
  "tr" = "tr", //	Turkish
  "vl" = "vl", //	Vietnamese
  "zh_CN" = "zh_CN", // Simplified Chinese
  "zh_HK" = "zh_HK" // Traditional Chinese
}

// https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#request-body
export interface InitiateIdentityVerificationParameters {
  // internal reference for the transaction
  customerInternalReference: string;

  // internal reference for the user
  userReference: string;

  // reporting criteria for the transaction
  reportingCriteria?: string;

  // redirects to this URL after a successful transaction (overrides Success URL in the Customer Portal)
  successUrl?: string;

  // redirects to this URL after an unsuccessful transaction (overrides Error URL in the Customer Portal)
  errorUrl?: string;

  // sends verification result to this URL upon completion (overrides Callback URL in the Customer Portal)
  callbackUrl?: string;

  // applies this acquisition workflow to the transaction (overrides Capture method in the Customer Portal)
  workflowId?: WorkflowId;

  // presets country and document to skip selection screen
  presets?: Preset[];

  // user interface language (defaults to American English)
  locale?: Locale;

  // overrides authorization token lifetime (in minutes) in the customer portal (min 5, max 86400, default 30)
  tokenLifetimeInMinutes?: number;
}

//github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#response
export interface InitiateIdentityVerificationResponse {
  // timestamp (UTC) of the response (format: YYYY-MM-DDThh:mm:ss.SSSZ)
  timestamp: string;

  // url used to load the Netverify client
  redirectUrl: string;

  // jumio reference number for the transaction
  transactionReference: string;
}

export enum IdentityVerificationStatus {
  // person has been approved and verified
  APPROVED_VERIFIED = "APPROVED_VERIFIED",

  // fraud attempt was detected
  DENIED_FRAUD = "DENIED_FRAUD",

  // denied due to supplying unsupported identification source
  DENIED_UNSUPPORTED_ID_TYPE = "DENIED_UNSUPPORTED_ID_TYPE",

  // denied due to supplying identification source from unsupported country
  DENIED_UNSUPPORTED_ID_COUNTRY = "DENIED_UNSUPPORTED_ID_COUNTRY",

  // the identification source was not readable
  ERROR_NOT_READABLE_ID = "ERROR_NOT_READABLE_ID",

  // no identification source was provided
  NO_ID_UPLOADED = "NO_ID_UPLOADED"
}

export enum IdScanStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

export enum IdScanSource {
  // embedded and no camera or upload started
  WEB = "WEB",

  // embedded via camera
  WEB_CAM = "WEB_CAM",

  // embedded via upload
  WEB_UPLOAD = "WEB_UPLOAD",

  // redirect and no camera or upload started
  REDIRECT = "REDIRECT",

  // redirect via camera
  REDIRECT_CAM = "REDIRECT_CAM",

  // redirect via upload
  REDIRECT_UPLOAD = "REDIRECT_UPLOAD",

  // performed over the api
  API = "API",

  // performed on mobile sdk
  SDK = "SDK"
}

export enum IdCheckStatus {
  OK = "OK",
  NOT_AVAILABLE = "N/A"
}

export enum IdType {
  PASSPORT = "PASSPORT",
  DRIVING_LICENSE = "DRIVING_LICENSE",
  ID_CARD = "ID_CARD",
  VISA = "VISA"
}

export enum IdSubType {
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

export enum RejectReasonCode {
  // for verificationStatus of DENIED_FRAUD
  MANIPULATED_DOCUMENT = 100,
  FRAUDSTER = 105,
  FAKE = 106,
  PHOTO_MISMATCH = 107,
  MRZ_CHECK_FAILED = 108,
  PUNCHED_DOCUMENT = 109,
  CHIP_DATA_MANIPULATED = 110,
  MISMATCH_PRINTED_BARCODE_DATA = 111,

  // for verificationStatus of ERROR_NOT_READABLE_ID
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

// must match the RejectReasonCode above
export enum RejectReasonDescription {
  // for verificationStatus of DENIED_FRAUD
  MANIPULATED_DOCUMENT = "MANIPULATED_DOCUMENT",
  FRAUDSTER = "FRAUDSTER",
  FAKE = "FAKE",
  PHOTO_MISMATCH = "PHOTO_MISMATCH",
  MRZ_CHECK_FAILED = "MRZ_CHECK_FAILED",
  PUNCHED_DOCUMENT = "PUNCHED_DOCUMENT",
  CHIP_DATA_MANIPULATED = "CHIP_DATA_MANIPULATED",
  MISMATCH_PRINTED_BARCODE_DATA = "MISMATCH_PRINTED_BARCODE_DATA",

  // for verificationStatus of ERROR_NOT_READABLE_ID
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

export enum RejectDetailsCode {
  // for rejectReasonCode of 100-MANIPULATED_DOCUMENT
  PHOTO = 1001,
  DOCUMENT_NUMBER = 1002,
  EXPIRY = 1003,
  DOB = 1004, // date of birth
  NAME = 1005,
  ADDRESS = 1006,
  SECURITY_CHECKS = 1007,
  SIGNATURE = 1008,
  PERSONAL_NUMBER = 1009,
  PLACE_OF_BIRTH = 10011,

  // for rejectReasonCode of 200-NOT_READABLE_DOCUMENT
  BLURRED = 2001,
  BAD_QUALITY = 2002,
  MISSING_PART_DOCUMENT = 2003,
  HIDDEN_PART_DOCUMENT = 2004,
  DAMAGED_DOCUMENT = 2005
}

// must match the RejectDetailsCode above
export enum RejectDetailsDescription {
  // for rejectReasonCode of 100-MANIPULATED_DOCUMENT
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

  // for rejectReasonCode of 200-NOT_READABLE_DOCUMENT
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

  // details available for 100-MANIPULATED_DOCUMENT and 200-NOT_READABLE_DOCUMENT
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

export type Address = AddressUs | AddressEu | AddressRaw;

export enum Gender {
  M = "M",
  F = "F"
}

export enum Similarity {
  MATCH = "MATCH",
  NO_MATCH = "NO_MATCH",
  NOT_POSSIBLE = "NOT_POSSIBLE"
}

export enum IdentityInvalidReason {
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

export type IdentityVerificationInfo =
  | IdentityVerificationSuccess
  | IdentityVerificationFailure;

export enum CountryCode {
  AFG = "AFG", // Afghanistan
  ALA = "ALA", // Åland Islands
  ALB = "ALB", // Albania
  DZA = "DZA", // Algeria
  ASM = "ASM", // American Samoa
  AND = "AND", // Andorra
  AGO = "AGO", // Angola
  AIA = "AIA", // Anguilla
  ATA = "ATA", // Antarctica
  ATG = "ATG", // Antigua and Barbuda
  ARG = "ARG", // Argentina
  ARM = "ARM", // Armenia
  ABW = "ABW", // Aruba
  AUS = "AUS", // Australia
  AUT = "AUT", // Austria
  AZE = "AZE", // Azerbaijan
  BHS = "BHS", // Bahamas
  BHR = "BHR", // Bahrain
  BGD = "BGD", // Bangladesh
  BRB = "BRB", // Barbados
  BLR = "BLR", // Belarus
  BEL = "BEL", // Belgium
  BLZ = "BLZ", // Belize
  BEN = "BEN", // Benin
  BMU = "BMU", // Bermuda
  BTN = "BTN", // Bhutan
  BOL = "BOL", // Bolivia (Plurinational State of)
  BES = "BES", // Bonaire, Sint Eustatius and Saba
  BIH = "BIH", // Bosnia and Herzegovina
  BWA = "BWA", // Botswana
  BVT = "BVT", // Bouvet Island
  BRA = "BRA", // Brazil
  IOT = "IOT", // British Indian Ocean Territory
  BRN = "BRN", // Brunei Darussalam
  BGR = "BGR", // Bulgaria
  BFA = "BFA", // Burkina Faso
  BDI = "BDI", // Burundi
  CPV = "CPV", // Cabo Verde
  KHM = "KHM", // Cambodia
  CMR = "CMR", // Cameroon
  CAN = "CAN", // Canada
  CYM = "CYM", // Cayman Islands
  CAF = "CAF", // Central African Republic
  TCD = "TCD", // Chad
  CHL = "CHL", // Chile
  CHN = "CHN", // China
  CXR = "CXR", // Christmas Island
  CCK = "CCK", // Cocos (Keeling) Islands
  COL = "COL", // Colombia
  COM = "COM", // Comoros
  COG = "COG", // Congo
  COD = "COD", // Congo (Democratic Republic of the)
  COK = "COK", // Cook Islands
  CRI = "CRI", // Costa Rica
  CIV = "CIV", // Côte d'Ivoire
  HRV = "HRV", // Croatia
  CUB = "CUB", // Cuba
  CUW = "CUW", // Curaçao
  CYP = "CYP", // Cyprus
  CZE = "CZE", // Czechia
  DNK = "DNK", // Denmark
  DJI = "DJI", // Djibouti
  DMA = "DMA", // Dominica
  DOM = "DOM", // Dominican Republic
  ECU = "ECU", // Ecuador
  EGY = "EGY", // Egypt
  SLV = "SLV", // El Salvador
  GNQ = "GNQ", // Equatorial Guinea
  ERI = "ERI", // Eritrea
  EST = "EST", // Estonia
  SWZ = "SWZ", // Eswatini
  ETH = "ETH", // Ethiopia
  FLK = "FLK", // Falkland Islands (Malvinas)
  FRO = "FRO", // Faroe Islands
  FJI = "FJI", // Fiji
  FIN = "FIN", // Finland
  FRA = "FRA", // France
  GUF = "GUF", // French Guiana
  PYF = "PYF", // French Polynesia
  ATF = "ATF", // French Southern Territories
  GAB = "GAB", // Gabon
  GMB = "GMB", // Gambia
  GEO = "GEO", // Georgia
  DEU = "DEU", // Germany
  GHA = "GHA", // Ghana
  GIB = "GIB", // Gibraltar
  GRC = "GRC", // Greece
  GRL = "GRL", // Greenland
  GRD = "GRD", // Grenada
  GLP = "GLP", // Guadeloupe
  GUM = "GUM", // Guam
  GTM = "GTM", // Guatemala
  GGY = "GGY", // Guernsey
  GIN = "GIN", // Guinea
  GNB = "GNB", // Guinea-Bissau
  GUY = "GUY", // Guyana
  HTI = "HTI", // Haiti
  HMD = "HMD", // Heard Island and McDonald Islands
  VAT = "VAT", // Holy See
  HND = "HND", // Honduras
  HKG = "HKG", // Hong Kong
  HUN = "HUN", // Hungary
  ISL = "ISL", // Iceland
  IND = "IND", // India
  IDN = "IDN", // Indonesia
  IRN = "IRN", // Iran (Islamic Republic of)
  IRQ = "IRQ", // Iraq
  IRL = "IRL", // Ireland
  IMN = "IMN", // Isle of Man
  ISR = "ISR", // Israel
  ITA = "ITA", // Italy
  JAM = "JAM", // Jamaica
  JPN = "JPN", // Japan
  JEY = "JEY", // Jersey
  JOR = "JOR", // Jordan
  KAZ = "KAZ", // Kazakhstan
  KEN = "KEN", // Kenya
  KIR = "KIR", // Kiribati
  PRK = "PRK", // Korea (Democratic People's Republic of)
  KOR = "KOR", // Korea (Republic of)
  KWT = "KWT", // Kuwait
  KGZ = "KGZ", // Kyrgyzstan
  LAO = "LAO", // Lao People's Democratic Republic
  LVA = "LVA", // Latvia
  LBN = "LBN", // Lebanon
  LSO = "LSO", // Lesotho
  LBR = "LBR", // Liberia
  LBY = "LBY", // Libya
  LIE = "LIE", // Liechtenstein
  LTU = "LTU", // Lithuania
  LUX = "LUX", // Luxembourg
  MAC = "MAC", // Macao
  MKD = "MKD", // Macedonia (the former Yugoslav Republic of)
  MDG = "MDG", // Madagascar
  MWI = "MWI", // Malawi
  MYS = "MYS", // Malaysia
  MDV = "MDV", // Maldives
  MLI = "MLI", // Mali
  MLT = "MLT", // Malta
  MHL = "MHL", // Marshall Islands
  MTQ = "MTQ", // Martinique
  MRT = "MRT", // Mauritania
  MUS = "MUS", // Mauritius
  MYT = "MYT", // Mayotte
  MEX = "MEX", // Mexico
  FSM = "FSM", // Micronesia (Federated States of)
  MDA = "MDA", // Moldova (Republic of)
  MCO = "MCO", // Monaco
  MNG = "MNG", // Mongolia
  MNE = "MNE", // Montenegro
  MSR = "MSR", // Montserrat
  MAR = "MAR", // Morocco
  MOZ = "MOZ", // Mozambique
  MMR = "MMR", // Myanmar
  NAM = "NAM", // Namibia
  NRU = "NRU", // Nauru
  NPL = "NPL", // Nepal
  NLD = "NLD", // Netherlands
  NCL = "NCL", // New Caledonia
  NZL = "NZL", // New Zealand
  NIC = "NIC", // Nicaragua
  NER = "NER", // Niger
  NGA = "NGA", // Nigeria
  NIU = "NIU", // Niue
  NFK = "NFK", // Norfolk Island
  MNP = "MNP", // Northern Mariana Islands
  NOR = "NOR", // Norway
  OMN = "OMN", // Oman
  PAK = "PAK", // Pakistan
  PLW = "PLW", // Palau
  PSE = "PSE", // Palestine, State of
  PAN = "PAN", // Panama
  PNG = "PNG", // Papua New Guinea
  PRY = "PRY", // Paraguay
  PER = "PER", // Peru
  PHL = "PHL", // Philippines
  PCN = "PCN", // Pitcairn
  POL = "POL", // Poland
  PRT = "PRT", // Portugal
  PRI = "PRI", // Puerto Rico
  QAT = "QAT", // Qatar
  REU = "REU", // Réunion
  ROU = "ROU", // Romania
  RUS = "RUS", // Russian Federation
  RWA = "RWA", // Rwanda
  BLM = "BLM", // Saint Barthélemy
  SHN = "SHN", // Saint Helena, Ascension and Tristan da Cunha
  KNA = "KNA", // Saint Kitts and Nevis
  LCA = "LCA", // Saint Lucia
  MAF = "MAF", // Saint Martin (French part)
  SPM = "SPM", // Saint Pierre and Miquelon
  VCT = "VCT", // Saint Vincent and the Grenadines
  WSM = "WSM", // Samoa
  SMR = "SMR", // San Marino
  STP = "STP", // Sao Tome and Principe
  SAU = "SAU", // Saudi Arabia
  SEN = "SEN", // Senegal
  SRB = "SRB", // Serbia
  SYC = "SYC", // Seychelles
  SLE = "SLE", // Sierra Leone
  SGP = "SGP", // Singapore
  SXM = "SXM", // Sint Maarten (Dutch part)
  SVK = "SVK", // Slovakia
  SVN = "SVN", // Slovenia
  SLB = "SLB", // Solomon Islands
  SOM = "SOM", // Somalia
  ZAF = "ZAF", // South Africa
  SGS = "SGS", // South Georgia and the South Sandwich Islands
  SSD = "SSD", // South Sudan
  ESP = "ESP", // Spain
  LKA = "LKA", // Sri Lanka
  SDN = "SDN", // Sudan
  SUR = "SUR", // Suriname
  SJM = "SJM", // Svalbard and Jan Mayen
  SWE = "SWE", // Sweden
  CHE = "CHE", // Switzerland
  SYR = "SYR", // Syrian Arab Republic
  TWN = "TWN", // Taiwan, Province of China
  TJK = "TJK", // Tajikistan
  TZA = "TZA", // Tanzania, United Republic of
  THA = "THA", // Thailand
  TLS = "TLS", // Timor-Leste
  TGO = "TGO", // Togo
  TKL = "TKL", // Tokelau
  TON = "TON", // Tonga
  TTO = "TTO", // Trinidad and Tobago
  TUN = "TUN", // Tunisia
  TUR = "TUR", // Turkey
  TKM = "TKM", // Turkmenistan
  TCA = "TCA", // Turks and Caicos Islands
  TUV = "TUV", // Tuvalu
  UGA = "UGA", // Uganda
  UKR = "UKR", // Ukraine
  ARE = "ARE", // United Arab Emirates
  GBR = "GBR", // United Kingdom of Great Britain and Northern Ireland
  USA = "USA", // United States of America
  UMI = "UMI", // United States Minor Outlying Islands
  URY = "URY", // Uruguay
  UZB = "UZB", // Uzbekistan
  VUT = "VUT", // Vanuatu
  VEN = "VEN", // Venezuela (Bolivarian Republic of)
  VNM = "VNM", // Viet Nam
  VGB = "VGB", // Virgin Islands (British)
  VIR = "VIR", // Virgin Islands (U.S.)
  WLF = "WLF", // Wallis and Futuna
  ESH = "ESH", // Western Sahara
  YEM = "YEM", // Yemen
  ZMB = "ZMB", // Zambia
  ZWE = "ZWE" // Zimbabwe
}

export enum DlCarPermission {
  YES = "YES",
  NO = "NO",
  NOT_READABLE = "NOT_READABLE"
}

export enum DlCategory {
  B1 = "B1",
  B = "B",
  BE = "BE"
}

export interface DlCategoryItem {
  category: DlCategory;
  issueDate?: string; // TODO: parse to Date?
  expiryDate?: string;
  isReadable?: boolean;
}

export type DlCategories = DlCategoryItem[];

// metadata added by the library
export interface VerificationMetadata {
  rawResult: object;
  callbackIp: string;
  isValidCallbackIp: boolean;
}

// https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md#callback-for-netverify
export interface VerificationResultBase {
  // metadata added by the library
  metadata: VerificationMetadata;

  // callback type (always NETVERIFYID)
  callbackType: string;

  // jumio reference number for each scan
  jumioIdScanReference: string;

  // status of the verification
  verificationStatus: IdentityVerificationStatus;

  // status of the id scan
  idScanStatus: IdScanStatus;

  // source of the id scan
  idScanSource: IdScanSource;

  // status of identification data positions check
  idCheckDataPositions: IdCheckStatus;

  // status of document validation check
  idCheckDocumentValidation: IdCheckStatus;

  // status of hologram check
  idCheckHologram: IdCheckStatus;

  // status of machine readable zone check
  idCheckMRZcode: IdCheckStatus;

  // status of microprint check
  idCheckMicroprint: IdCheckStatus;

  // status of security features check
  idCheckSecurityFeatures: IdCheckStatus;

  // status of signature check
  idCheckSignature: IdCheckStatus;

  // transaction date
  transactionDate: Date;

  // callback date
  callbackDate: Date;

  // URL to the image of the scan (JPEG or PNG) if available
  idScanImage?: string;

  // URL to the face image of the scan (JPEG or PNG) if available
  idScanImageFace?: string;

  // URL to the back side image of the scan (JPEG or PNG) if available
  idScanImageBackside?: string;

  // state code for united states (ISO 3166-2:US) / australia (ISO 3166-2:AU) / canada (ISO 3166-2:CA) or ISO 3166-1
  idUsState?: string;

  // address info if available (detailed in US and EU, otherwise raw)
  idAddress?: Address;

  // provided merchant reference
  merchantIdScanReference?: string;

  // provided reporting criteria
  merchantReportingCriteria?: string;

  // provided customer id
  customerId?: string;

  // ip address of the client in the format xxx.xxx.xxx.xxx
  clientIp?: string;

  // optional field of machine readable zone (MRZ) line 1
  optionalData1?: string;

  // optional field of machine readable zone (MRZ) line 2
  optionalData2?: string;

  // DNI as available on the ID if idCountry = ESP and idSubtype = NATIONAL_ID
  dni?: string;

  // CURP as available on the ID if idCountry = MEX and idSubtype = ELECTORAL_ID
  curp?: string;

  // CURP as available on the ID if idCountry = MEX and idSubtype = ELECTORAL_ID
  gender?: Gender;

  // preset country option (ISO 3166-1 alpha-3 country code)
  presetCountry?: CountryCode;

  // preset country option (ISO 3166-1 alpha-3 country code)
  presetIdType?: IdType;

  // driving license has car permission (for supported countries)
  dlCarPermission?: DlCarPermission;

  // driving license categories (for supported countries)
  dlCategories?: DlCategories;

  // nationality if idType = VISA and additional extraction for Visa enabled
  nationality?: CountryCode;

  // passport number if idType = VISA and additional extraction for Visa enabled
  passportNumber?: string;

  // duration of stay if idType = VISA and additional extraction for Visa enabled
  durationOfStay?: string;

  // number of entries if idType = VISA and additional extraction for Visa enabled
  numberOfEntries?: string;

  // visa category if idType = VISA and additional extraction for Visa enabled
  visaCategory?: string;

  // original format of date of birth if idCountry = IND
  originDob?: string;
}

// approved result has some additional info
export interface VerificationResultApproved extends VerificationResultBase {
  // approved status
  verificationStatus: IdentityVerificationStatus.APPROVED_VERIFIED;

  // identification document type
  idType: IdType;

  // identification document subtype
  idSubtype?: IdSubType;

  // identification number of the document as available
  idNumber: string;

  // ISO 3166-1 alpha-3 country code
  idCountry: CountryCode;

  // first name of the customer as available (N/A for non-latin characters)
  idFirstName: string | "N/A";

  // last name of the customer as available (N/A for non-latin characters)
  idLastName: string | "N/A";

  // date of birth
  idDob?: Date;

  // date of expiry
  idExpiry?: Date;

  // personal number of the document
  personalNumber: string | "N/A";

  // identity verification info
  identityVerification: IdentityVerificationInfo;

  // first scan attempt date
  firstAttemptDate: Date;
}

export interface VerificationResultDeniedFraud extends VerificationResultBase {
  // approved status
  verificationStatus: IdentityVerificationStatus.DENIED_FRAUD;

  // rejection reason
  rejectReason: RejectReason;

  // first scan attempt date
  firstAttemptDate: Date;
}

export interface VerificationResultErrorNotReadableId
  extends VerificationResultBase {
  // approved status
  verificationStatus: IdentityVerificationStatus.ERROR_NOT_READABLE_ID;

  // rejection reason
  rejectReason: RejectReason;

  // first scan attempt date
  firstAttemptDate: Date;
}

export interface VerificationResultUnsupportedIdCountry
  extends VerificationResultBase {
  // approved status
  verificationStatus: IdentityVerificationStatus.DENIED_UNSUPPORTED_ID_COUNTRY;

  // first scan attempt date
  firstAttemptDate: Date;
}

export interface VerificationResultUnsupportedIdType
  extends VerificationResultBase {
  // approved status
  verificationStatus: IdentityVerificationStatus.DENIED_UNSUPPORTED_ID_TYPE;

  // first scan attempt date
  firstAttemptDate: Date;
}

export type VerificationResultCombined = VerificationResultApproved &
  VerificationResultDeniedFraud &
  VerificationResultErrorNotReadableId &
  VerificationResultUnsupportedIdCountry &
  VerificationResultUnsupportedIdType;

export type RawIdentityVerificationResult = {
  [key in keyof VerificationResultCombined]: any
};

export type IdentityVerificationResult =
  | VerificationResultApproved
  | VerificationResultDeniedFraud
  | VerificationResultErrorNotReadableId
  | VerificationResultUnsupportedIdCountry
  | VerificationResultUnsupportedIdType;

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

// list of supported document types
// https://github.com/Jumio/implementation-guides/blob/master/netverify/document-verification.md#supported-documents
export enum DocumentVerificationType {
  "CC" = "CC", // Credit card
  "IC" = "IC", // Insurance card
  "CAAP" = "CAAP", // Cash advance application
  "CRC" = "CRC", // Corporate resolution certificate
  "CCS" = "CCS", // Credit card statement
  "LAG" = "LAG", // Lease agreement
  "LOAP" = "LOAP", // Loan application
  "MOAP" = "MOAP", // Mortgage application
  "TR" = "TR", // Tax return
  "VT" = "VT", // Vehicle title
  "VC" = "VC", // Voided check
  "STUC" = "STUC", // Student card
  "HCC" = "HCC", // Health care card
  "CB" = "CB", // Council bill
  "SENC" = "SENC", // Seniors card
  "MEDC" = "MEDC", // Medicare card
  "BC" = "BC", // Birth certificate
  "WWCC" = "WWCC", // Working with children check
  "SS" = "SS", // Superannuation statement
  "TAC" = "TAC", // Trade association card
  "SEL" = "SEL", // School enrolment letter
  "PB" = "PB", // Phone bill
  "USSS" = "USSS", // US social security card
  "CUSTOM" = "CUSTOM", // DOCUMENT
  "BS" = "BS", // Bank statement
  "UB" = "UB" // Utility bill
}

export type DocumentTypeList = {
  type: DocumentVerificationType;
  name: string;
}[];

// https://github.com/Jumio/implementation-guides/blob/master/netverify/document-verification.md#initiating-the-transaction
export interface InitiateDocumentVerificationParameters {
  // document type to verify
  type: DocumentVerificationType;

  // person country code (not needed for credit card) TODO: support this difference with typings
  country: CountryCode;

  // internal reference for the transaction
  merchantScanReference: string;

  // internal reference for the user
  customerId: string;

  // is data extraction enabled
  enableExtraction: boolean;

  // sends verification result to this URL upon completion (overrides Callback URL in the Customer Portal)
  callbackUrl?: string;

  // redirects to this URL after a successful transaction (overrides Success URL in the Customer Portal)
  successUrl?: string;

  // redirects to this URL after an unsuccessful transaction (overrides Error URL in the Customer Portal)
  errorUrl?: string;

  // time in seconds until the authorization token expires (default 1800 seconds, max 5184000 seconds)
  authorizationTokenLifetime?: number;

  // reporting criteria for the transaction
  merchantReportingCriteria?: string;

  // user interface language (defaults to American English)
  locale?: Locale;

  // client's main web color as hexadecimal triplet (only used if both baseColor and bgColor are present)
  baseColor?: string;

  // client's background web color as hexadecimal triplet (only used if both baseColor and bgColor are present)
  bgColor?: string;

  // header logo url (landscape 16:9 or 4:3, min height 192px, 8-64KB, https, no ip's or ports)
  headerImageUrl?: string;

  // custom document code (needs to be added if type = CUSTOM)
  customDocumentCode?: string;
}

export interface InitiateDocumentVerificationResponse {
  // url used to load the document verification client
  clientRedirectUrl: string;

  // jumio reference number for the transaction
  scanReference: string;
}

// https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md#callback-for-document-verification
export interface RawDocumentVerificationResult {
  // jumio reference number for the transaction
  scanReference: string;

  // response timestamp
  timestamp: string;

  // transaction info JSON
  transaction: string;

  // extracted document info JSON, available in case of success
  document?: string;
}

export interface DocumentVerificationResult {
  // metadata added by the library
  metadata: VerificationMetadata;

  // jumio internal unique id
  scanReference: string;

  // transaction status
  transactionStatus: DocumentVerificationTransactionStatus;

  // transaction status
  documentStatus: DocumentVerificationDocumentStatus;

  // document verification source
  source: DocumentVerificationSource;

  // our verification unique id
  merchantScanReference: string;

  // our customer unique id
  customerId: string;

  // our reporting criteria if set
  merchantReportingCriteria?: string;

  // transaction created date
  transactionDate: Date;

  // callback sent date
  callbackDate: Date;

  // urls to the images of the scan
  images: string[];

  // url of the original document if available
  originalDocument?: string;

  // name on the document
  name?: string;

  // extracted address
  address?: string;

  // ip address of the client if provided
  clientIp?: string;
}

export enum DocumentVerificationTransactionStatus {
  DONE = "DONE",
  FAILED = "FAILED"
}

export enum DocumentVerificationSource {
  DOC_UPLOAD = "DOC_UPLOAD", // document verification web
  DOC_API = "DOC_API", // document verification api
  DOC_SDK = "DOC_SDK" // document verification mobile
}

export interface DocumentVerificationTransactionInfo {
  // callback creation date
  date: string;

  // transaction status
  status: DocumentVerificationTransactionStatus;

  // transaction status
  source: DocumentVerificationSource;

  // our verification unique id
  merchantScanReference: string;

  // our customer unique id
  customerId: string;

  // our reporting criteria if set
  merchantReportingCriteria?: string;

  // ip address of the client if provided
  clientIp?: string;
}

export enum DocumentVerificationDocumentStatus {
  NOT_AVAILABLE = "NOT_AVAILABLE",
  UPLOADED = "UPLOADED",
  EXTRACTED = "EXTRACTED",
  DISCARDED = "DISCARDED"
}

export type ExtractedDocumentData = {
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
  // transaction status
  status: DocumentVerificationDocumentStatus;

  // document country code
  country: CountryCode;

  // type of document that was verified
  type: DocumentVerificationType;

  // urls to images of the scan
  images: string[];

  // url to the originally submitted document
  originalDocument?: string;

  // custom document code
  customDocumentCode?: string;

  // extracted document data
  extractedData?: ExtractedDocumentData;
}

// represents a supported country
export interface Country {
  name: string;
  countryCode: CountryCode;
  region: string;
  subRegion: string;
  locale: Locale;
}

export const identityRegionApiUrlMap: RegionApiUrlMap = {
  [Region.US]: "https://netverify.com/api/v4",
  [Region.EU]: "https://lon.netverify.com/api/v4"
};

export const documentRegionApiUrlMap: RegionApiUrlMap = {
  [Region.US]: "https://upload.netverify.com/api/netverify/v2",
  [Region.EU]: "https://upload.lon.netverify.com/api/netverify/v2"
};

export const identityRetrievalRegionApiUrlMap: RegionApiUrlMap = {
  [Region.US]: "https://netverify.com/recognition/v1/idscan",
  [Region.EU]: "https://lon.netverify.com/recognition/v1/idscan"
};

export const documentRetrievalRegionApiUrlMap: RegionApiUrlMap = {
  [Region.US]: "https://retrieval.netverify.com/api/netverify/v2/documents",
  [Region.EU]: "https://retrieval.lon.netverify.com/api/netverify/v2/documents"
};

export const regionCallbackWhitelistMap: RegionCallbackWhitelistMap = {
  [Region.US]: [
    "34.202.241.227",
    "34.226.103.119",
    "34.226.254.127",
    "52.52.51.178",
    "52.53.95.123",
    "54.67.101.173",
    "104.130.61.196",
    "146.20.77.156",
    "184.106.91.66",
    "184.106.91.67"
  ],
  [Region.EU]: [
    "34.253.41.236",
    "35.157.27.193",
    "52.48.0.25",
    "52.57.194.92",
    "52.58.113.86",
    "52.209.180.134",
    "162.13.228.132",
    "162.13.228.134",
    "162.13.229.103",
    "162.13.229.104"
  ]
};

export const documentTypeList: DocumentTypeList = [
  {
    type: DocumentVerificationType.CC,
    name: "Credit card"
  },
  {
    type: DocumentVerificationType.IC,
    name: "Insurance card"
  },
  {
    type: DocumentVerificationType.CAAP,
    name: "Cash advance application"
  },
  {
    type: DocumentVerificationType.CRC,
    name: "Corporate resolution certificate"
  },
  {
    type: DocumentVerificationType.CCS,
    name: "Credit card statement"
  },
  {
    type: DocumentVerificationType.LAG,
    name: "Lease agreement"
  },
  {
    type: DocumentVerificationType.LOAP,
    name: "Loan application"
  },
  {
    type: DocumentVerificationType.MOAP,
    name: "Mortgage application"
  },
  {
    type: DocumentVerificationType.TR,
    name: "Tax return"
  },
  {
    type: DocumentVerificationType.VT,
    name: "Vehicle title"
  },
  {
    type: DocumentVerificationType.VC,
    name: "Voided check"
  },
  {
    type: DocumentVerificationType.STUC,
    name: "Student card"
  },
  {
    type: DocumentVerificationType.HCC,
    name: "Health care card"
  },
  {
    type: DocumentVerificationType.CB,
    name: "Council bill"
  },
  {
    type: DocumentVerificationType.SENC,
    name: "Seniors card"
  },
  {
    type: DocumentVerificationType.MEDC,
    name: "Medicare card"
  },
  {
    type: DocumentVerificationType.BC,
    name: "Birth certificate"
  },
  {
    type: DocumentVerificationType.WWCC,
    name: "Working with children check"
  },
  {
    type: DocumentVerificationType.SS,
    name: "Superannuation statement"
  },
  {
    type: DocumentVerificationType.TAC,
    name: "Trade association card"
  },
  {
    type: DocumentVerificationType.SEL,
    name: "School enrolment letter"
  },
  {
    type: DocumentVerificationType.PB,
    name: "Phone bill"
  },
  {
    type: DocumentVerificationType.USSS,
    name: "US social security card"
  },
  {
    type: DocumentVerificationType.BS,
    name: "Bank statement"
  },
  {
    type: DocumentVerificationType.UB,
    name: "Utility bill"
  }
];

export const countries: Country[] = [
  {
    name: "Afghanistan",
    countryCode: CountryCode.AFG,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Åland Islands",
    countryCode: CountryCode.ALA,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Albania",
    countryCode: CountryCode.ALB,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Algeria",
    countryCode: CountryCode.DZA,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "American Samoa",
    countryCode: CountryCode.ASM,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Andorra",
    countryCode: CountryCode.AND,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Angola",
    countryCode: CountryCode.AGO,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Anguilla",
    countryCode: CountryCode.AIA,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Antarctica",
    countryCode: CountryCode.ATA,
    region: "",
    subRegion: "",
    locale: Locale.en
  },
  {
    name: "Antigua and Barbuda",
    countryCode: CountryCode.ATG,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Argentina",
    countryCode: CountryCode.ARG,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Armenia",
    countryCode: CountryCode.ARM,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Aruba",
    countryCode: CountryCode.ABW,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Australia",
    countryCode: CountryCode.AUS,
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    locale: Locale.en
  },
  {
    name: "Austria",
    countryCode: CountryCode.AUT,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.en
  },
  {
    name: "Azerbaijan",
    countryCode: CountryCode.AZE,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Bahamas",
    countryCode: CountryCode.BHS,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Bahrain",
    countryCode: CountryCode.BHR,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Bangladesh",
    countryCode: CountryCode.BGD,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Barbados",
    countryCode: CountryCode.BRB,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Belarus",
    countryCode: CountryCode.BLR,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.en
  },
  {
    name: "Belgium",
    countryCode: CountryCode.BEL,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.en
  },
  {
    name: "Belize",
    countryCode: CountryCode.BLZ,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Benin",
    countryCode: CountryCode.BEN,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Bermuda",
    countryCode: CountryCode.BMU,
    region: "Americas",
    subRegion: "Northern America",
    locale: Locale.en
  },
  {
    name: "Bhutan",
    countryCode: CountryCode.BTN,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Bolivia (Plurinational State of)",
    countryCode: CountryCode.BOL,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Bonaire, Sint Eustatius and Saba",
    countryCode: CountryCode.BES,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Bosnia and Herzegovina",
    countryCode: CountryCode.BIH,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Botswana",
    countryCode: CountryCode.BWA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Bouvet Island",
    countryCode: CountryCode.BVT,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Brazil",
    countryCode: CountryCode.BRA,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.pt_BR
  },
  {
    name: "British Indian Ocean Territory",
    countryCode: CountryCode.IOT,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Brunei Darussalam",
    countryCode: CountryCode.BRN,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Bulgaria",
    countryCode: CountryCode.BGR,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.bg
  },
  {
    name: "Burkina Faso",
    countryCode: CountryCode.BFA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Burundi",
    countryCode: CountryCode.BDI,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Cabo Verde",
    countryCode: CountryCode.CPV,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Cambodia",
    countryCode: CountryCode.KHM,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Cameroon",
    countryCode: CountryCode.CMR,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Canada",
    countryCode: CountryCode.CAN,
    region: "Americas",
    subRegion: "Northern America",
    locale: Locale.en
  },
  {
    name: "Cayman Islands",
    countryCode: CountryCode.CYM,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Central African Republic",
    countryCode: CountryCode.CAF,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Chad",
    countryCode: CountryCode.TCD,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Chile",
    countryCode: CountryCode.CHL,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "China",
    countryCode: CountryCode.CHN,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.zh_HK
  },
  {
    name: "Christmas Island",
    countryCode: CountryCode.CXR,
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    locale: Locale.en
  },
  {
    name: "Cocos (Keeling) Islands",
    countryCode: CountryCode.CCK,
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    locale: Locale.en
  },
  {
    name: "Colombia",
    countryCode: CountryCode.COL,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Comoros",
    countryCode: CountryCode.COM,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Congo",
    countryCode: CountryCode.COG,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Congo (Democratic Republic of the)",
    countryCode: CountryCode.COD,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Cook Islands",
    countryCode: CountryCode.COK,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Costa Rica",
    countryCode: CountryCode.CRI,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Côte d'Ivoire",
    countryCode: CountryCode.CIV,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Croatia",
    countryCode: CountryCode.HRV,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Cuba",
    countryCode: CountryCode.CUB,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Curaçao",
    countryCode: CountryCode.CUW,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Cyprus",
    countryCode: CountryCode.CYP,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Czechia",
    countryCode: CountryCode.CZE,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.cs
  },
  {
    name: "Denmark",
    countryCode: CountryCode.DNK,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.da
  },
  {
    name: "Djibouti",
    countryCode: CountryCode.DJI,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Dominica",
    countryCode: CountryCode.DMA,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Dominican Republic",
    countryCode: CountryCode.DOM,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Ecuador",
    countryCode: CountryCode.ECU,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Egypt",
    countryCode: CountryCode.EGY,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "El Salvador",
    countryCode: CountryCode.SLV,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Equatorial Guinea",
    countryCode: CountryCode.GNQ,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Eritrea",
    countryCode: CountryCode.ERI,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Estonia",
    countryCode: CountryCode.EST,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.et
  },
  {
    name: "Eswatini",
    countryCode: CountryCode.SWZ,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Ethiopia",
    countryCode: CountryCode.ETH,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Falkland Islands (Malvinas)",
    countryCode: CountryCode.FLK,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Faroe Islands",
    countryCode: CountryCode.FRO,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Fiji",
    countryCode: CountryCode.FJI,
    region: "Oceania",
    subRegion: "Melanesia",
    locale: Locale.en
  },
  {
    name: "Finland",
    countryCode: CountryCode.FIN,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.fi
  },
  {
    name: "France",
    countryCode: CountryCode.FRA,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.fr
  },
  {
    name: "French Guiana",
    countryCode: CountryCode.GUF,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "French Polynesia",
    countryCode: CountryCode.PYF,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "French Southern Territories",
    countryCode: CountryCode.ATF,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Gabon",
    countryCode: CountryCode.GAB,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Gambia",
    countryCode: CountryCode.GMB,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Georgia",
    countryCode: CountryCode.GEO,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Germany",
    countryCode: CountryCode.DEU,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.de
  },
  {
    name: "Ghana",
    countryCode: CountryCode.GHA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Gibraltar",
    countryCode: CountryCode.GIB,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Greece",
    countryCode: CountryCode.GRC,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.el
  },
  {
    name: "Greenland",
    countryCode: CountryCode.GRL,
    region: "Americas",
    subRegion: "Northern America",
    locale: Locale.en
  },
  {
    name: "Grenada",
    countryCode: CountryCode.GRD,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Guadeloupe",
    countryCode: CountryCode.GLP,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Guam",
    countryCode: CountryCode.GUM,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Guatemala",
    countryCode: CountryCode.GTM,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Guernsey",
    countryCode: CountryCode.GGY,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Guinea",
    countryCode: CountryCode.GIN,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Guinea-Bissau",
    countryCode: CountryCode.GNB,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Guyana",
    countryCode: CountryCode.GUY,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Haiti",
    countryCode: CountryCode.HTI,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Heard Island and McDonald Islands",
    countryCode: CountryCode.HMD,
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    locale: Locale.en
  },
  {
    name: "Holy See",
    countryCode: CountryCode.VAT,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Honduras",
    countryCode: CountryCode.HND,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Hong Kong",
    countryCode: CountryCode.HKG,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.en
  },
  {
    name: "Hungary",
    countryCode: CountryCode.HUN,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.hu
  },
  {
    name: "Iceland",
    countryCode: CountryCode.ISL,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "India",
    countryCode: CountryCode.IND,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Indonesia",
    countryCode: CountryCode.IDN,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Iran (Islamic Republic of)",
    countryCode: CountryCode.IRN,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Iraq",
    countryCode: CountryCode.IRQ,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Ireland",
    countryCode: CountryCode.IRL,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Isle of Man",
    countryCode: CountryCode.IMN,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Israel",
    countryCode: CountryCode.ISR,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Italy",
    countryCode: CountryCode.ITA,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.it
  },
  {
    name: "Jamaica",
    countryCode: CountryCode.JAM,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Japan",
    countryCode: CountryCode.JPN,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.ja
  },
  {
    name: "Jersey",
    countryCode: CountryCode.JEY,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Jordan",
    countryCode: CountryCode.JOR,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Kazakhstan",
    countryCode: CountryCode.KAZ,
    region: "Asia",
    subRegion: "Central Asia",
    locale: Locale.en
  },
  {
    name: "Kenya",
    countryCode: CountryCode.KEN,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Kiribati",
    countryCode: CountryCode.KIR,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Korea (Democratic People's Republic of)",
    countryCode: CountryCode.PRK,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.ko
  },
  {
    name: "Korea (Republic of)",
    countryCode: CountryCode.KOR,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.ko
  },
  {
    name: "Kuwait",
    countryCode: CountryCode.KWT,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Kyrgyzstan",
    countryCode: CountryCode.KGZ,
    region: "Asia",
    subRegion: "Central Asia",
    locale: Locale.en
  },
  {
    name: "Lao People's Democratic Republic",
    countryCode: CountryCode.LAO,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Latvia",
    countryCode: CountryCode.LVA,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Lebanon",
    countryCode: CountryCode.LBN,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Lesotho",
    countryCode: CountryCode.LSO,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Liberia",
    countryCode: CountryCode.LBR,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Libya",
    countryCode: CountryCode.LBY,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "Liechtenstein",
    countryCode: CountryCode.LIE,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.en
  },
  {
    name: "Lithuania",
    countryCode: CountryCode.LTU,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.lt
  },
  {
    name: "Luxembourg",
    countryCode: CountryCode.LUX,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.en
  },
  {
    name: "Macao",
    countryCode: CountryCode.MAC,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.en
  },
  {
    name: "Macedonia (the former Yugoslav Republic of)",
    countryCode: CountryCode.MKD,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Madagascar",
    countryCode: CountryCode.MDG,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Malawi",
    countryCode: CountryCode.MWI,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Malaysia",
    countryCode: CountryCode.MYS,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Maldives",
    countryCode: CountryCode.MDV,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Mali",
    countryCode: CountryCode.MLI,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Malta",
    countryCode: CountryCode.MLT,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Marshall Islands",
    countryCode: CountryCode.MHL,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Martinique",
    countryCode: CountryCode.MTQ,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Mauritania",
    countryCode: CountryCode.MRT,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Mauritius",
    countryCode: CountryCode.MUS,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Mayotte",
    countryCode: CountryCode.MYT,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Mexico",
    countryCode: CountryCode.MEX,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.es_MX
  },
  {
    name: "Micronesia (Federated States of)",
    countryCode: CountryCode.FSM,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Moldova (Republic of)",
    countryCode: CountryCode.MDA,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.en
  },
  {
    name: "Monaco",
    countryCode: CountryCode.MCO,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.en
  },
  {
    name: "Mongolia",
    countryCode: CountryCode.MNG,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.en
  },
  {
    name: "Montenegro",
    countryCode: CountryCode.MNE,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Montserrat",
    countryCode: CountryCode.MSR,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Morocco",
    countryCode: CountryCode.MAR,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "Mozambique",
    countryCode: CountryCode.MOZ,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Myanmar",
    countryCode: CountryCode.MMR,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Namibia",
    countryCode: CountryCode.NAM,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Nauru",
    countryCode: CountryCode.NRU,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Nepal",
    countryCode: CountryCode.NPL,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Netherlands",
    countryCode: CountryCode.NLD,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.nl
  },
  {
    name: "New Caledonia",
    countryCode: CountryCode.NCL,
    region: "Oceania",
    subRegion: "Melanesia",
    locale: Locale.en
  },
  {
    name: "New Zealand",
    countryCode: CountryCode.NZL,
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    locale: Locale.en
  },
  {
    name: "Nicaragua",
    countryCode: CountryCode.NIC,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Niger",
    countryCode: CountryCode.NER,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Nigeria",
    countryCode: CountryCode.NGA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Niue",
    countryCode: CountryCode.NIU,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Norfolk Island",
    countryCode: CountryCode.NFK,
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    locale: Locale.en
  },
  {
    name: "Northern Mariana Islands",
    countryCode: CountryCode.MNP,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Norway",
    countryCode: CountryCode.NOR,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.no
  },
  {
    name: "Oman",
    countryCode: CountryCode.OMN,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Pakistan",
    countryCode: CountryCode.PAK,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Palau",
    countryCode: CountryCode.PLW,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Palestine, State of",
    countryCode: CountryCode.PSE,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Panama",
    countryCode: CountryCode.PAN,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Papua New Guinea",
    countryCode: CountryCode.PNG,
    region: "Oceania",
    subRegion: "Melanesia",
    locale: Locale.en
  },
  {
    name: "Paraguay",
    countryCode: CountryCode.PRY,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Peru",
    countryCode: CountryCode.PER,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Philippines",
    countryCode: CountryCode.PHL,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Pitcairn",
    countryCode: CountryCode.PCN,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Poland",
    countryCode: CountryCode.POL,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.pl
  },
  {
    name: "Portugal",
    countryCode: CountryCode.PRT,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.pt
  },
  {
    name: "Puerto Rico",
    countryCode: CountryCode.PRI,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Qatar",
    countryCode: CountryCode.QAT,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Réunion",
    countryCode: CountryCode.REU,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Romania",
    countryCode: CountryCode.ROU,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.ro
  },
  {
    name: "Russian Federation",
    countryCode: CountryCode.RUS,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.ru
  },
  {
    name: "Rwanda",
    countryCode: CountryCode.RWA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Saint Barthélemy",
    countryCode: CountryCode.BLM,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    countryCode: CountryCode.SHN,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Saint Kitts and Nevis",
    countryCode: CountryCode.KNA,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Saint Lucia",
    countryCode: CountryCode.LCA,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Saint Martin (French part)",
    countryCode: CountryCode.MAF,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Saint Pierre and Miquelon",
    countryCode: CountryCode.SPM,
    region: "Americas",
    subRegion: "Northern America",
    locale: Locale.en
  },
  {
    name: "Saint Vincent and the Grenadines",
    countryCode: CountryCode.VCT,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Samoa",
    countryCode: CountryCode.WSM,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "San Marino",
    countryCode: CountryCode.SMR,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Sao Tome and Principe",
    countryCode: CountryCode.STP,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Saudi Arabia",
    countryCode: CountryCode.SAU,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Senegal",
    countryCode: CountryCode.SEN,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Serbia",
    countryCode: CountryCode.SRB,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Seychelles",
    countryCode: CountryCode.SYC,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Sierra Leone",
    countryCode: CountryCode.SLE,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Singapore",
    countryCode: CountryCode.SGP,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Sint Maarten (Dutch part)",
    countryCode: CountryCode.SXM,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Slovakia",
    countryCode: CountryCode.SVK,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.sk
  },
  {
    name: "Slovenia",
    countryCode: CountryCode.SVN,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.en
  },
  {
    name: "Solomon Islands",
    countryCode: CountryCode.SLB,
    region: "Oceania",
    subRegion: "Melanesia",
    locale: Locale.en
  },
  {
    name: "Somalia",
    countryCode: CountryCode.SOM,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "South Africa",
    countryCode: CountryCode.ZAF,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "South Georgia and the South Sandwich Islands",
    countryCode: CountryCode.SGS,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "South Sudan",
    countryCode: CountryCode.SSD,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Spain",
    countryCode: CountryCode.ESP,
    region: "Europe",
    subRegion: "Southern Europe",
    locale: Locale.es
  },
  {
    name: "Sri Lanka",
    countryCode: CountryCode.LKA,
    region: "Asia",
    subRegion: "Southern Asia",
    locale: Locale.en
  },
  {
    name: "Sudan",
    countryCode: CountryCode.SDN,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "Suriname",
    countryCode: CountryCode.SUR,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Svalbard and Jan Mayen",
    countryCode: CountryCode.SJM,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en
  },
  {
    name: "Sweden",
    countryCode: CountryCode.SWE,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.sv
  },
  {
    name: "Switzerland",
    countryCode: CountryCode.CHE,
    region: "Europe",
    subRegion: "Western Europe",
    locale: Locale.en
  },
  {
    name: "Syrian Arab Republic",
    countryCode: CountryCode.SYR,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Taiwan, Province of China",
    countryCode: CountryCode.TWN,
    region: "Asia",
    subRegion: "Eastern Asia",
    locale: Locale.en
  },
  {
    name: "Tajikistan",
    countryCode: CountryCode.TJK,
    region: "Asia",
    subRegion: "Central Asia",
    locale: Locale.en
  },
  {
    name: "Tanzania, United Republic of",
    countryCode: CountryCode.TZA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Thailand",
    countryCode: CountryCode.THA,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Timor-Leste",
    countryCode: CountryCode.TLS,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.en
  },
  {
    name: "Togo",
    countryCode: CountryCode.TGO,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Tokelau",
    countryCode: CountryCode.TKL,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Tonga",
    countryCode: CountryCode.TON,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Trinidad and Tobago",
    countryCode: CountryCode.TTO,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Tunisia",
    countryCode: CountryCode.TUN,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "Turkey",
    countryCode: CountryCode.TUR,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.tr
  },
  {
    name: "Turkmenistan",
    countryCode: CountryCode.TKM,
    region: "Asia",
    subRegion: "Central Asia",
    locale: Locale.en
  },
  {
    name: "Turks and Caicos Islands",
    countryCode: CountryCode.TCA,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Tuvalu",
    countryCode: CountryCode.TUV,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Uganda",
    countryCode: CountryCode.UGA,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Ukraine",
    countryCode: CountryCode.UKR,
    region: "Europe",
    subRegion: "Eastern Europe",
    locale: Locale.en
  },
  {
    name: "United Arab Emirates",
    countryCode: CountryCode.ARE,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "United Kingdom of Great Britain and Northern Ireland",
    countryCode: CountryCode.GBR,
    region: "Europe",
    subRegion: "Northern Europe",
    locale: Locale.en_GB
  },
  {
    name: "United States of America",
    countryCode: CountryCode.USA,
    region: "Americas",
    subRegion: "Northern America",
    locale: Locale.en
  },
  {
    name: "United States Minor Outlying Islands",
    countryCode: CountryCode.UMI,
    region: "Oceania",
    subRegion: "Micronesia",
    locale: Locale.en
  },
  {
    name: "Uruguay",
    countryCode: CountryCode.URY,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Uzbekistan",
    countryCode: CountryCode.UZB,
    region: "Asia",
    subRegion: "Central Asia",
    locale: Locale.en
  },
  {
    name: "Vanuatu",
    countryCode: CountryCode.VUT,
    region: "Oceania",
    subRegion: "Melanesia",
    locale: Locale.en
  },
  {
    name: "Venezuela (Bolivarian Republic of)",
    countryCode: CountryCode.VEN,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Viet Nam",
    countryCode: CountryCode.VNM,
    region: "Asia",
    subRegion: "South-eastern Asia",
    locale: Locale.vl
  },
  {
    name: "Virgin Islands (British)",
    countryCode: CountryCode.VGB,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Virgin Islands (U.S.)",
    countryCode: CountryCode.VIR,
    region: "Americas",
    subRegion: "Latin America and the Caribbean",
    locale: Locale.en
  },
  {
    name: "Wallis and Futuna",
    countryCode: CountryCode.WLF,
    region: "Oceania",
    subRegion: "Polynesia",
    locale: Locale.en
  },
  {
    name: "Western Sahara",
    countryCode: CountryCode.ESH,
    region: "Africa",
    subRegion: "Northern Africa",
    locale: Locale.en
  },
  {
    name: "Yemen",
    countryCode: CountryCode.YEM,
    region: "Asia",
    subRegion: "Western Asia",
    locale: Locale.en
  },
  {
    name: "Zambia",
    countryCode: CountryCode.ZMB,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  },
  {
    name: "Zimbabwe",
    countryCode: CountryCode.ZWE,
    region: "Africa",
    subRegion: "Sub-Saharan Africa",
    locale: Locale.en
  }
];

/**
 * Provides integration to Jumio NetVerify service.
 */
export default class Jumio {
  private readonly config: Required<JumioConfig>;
  private readonly log: Logger;
  private readonly identityApi: AxiosInstance;
  private readonly documentApi: AxiosInstance;

  /**
   * Sets up the library.
   *
   * @param config Configuration
   */
  constructor(config: JumioConfig) {
    // setup configuration with defaults
    this.config = {
      version: "1.0.0",
      identityApiBaseUrl: identityRegionApiUrlMap[config.region],
      documentApiBaseUrl: documentRegionApiUrlMap[config.region],
      callbackWhitelist: regionCallbackWhitelistMap[config.region],
      handleIdentityVerification: async _result => {},
      handleDocumentVerification: async _result => {},
      log: dummyLogger,
      ...config
    };

    // keep a shorter reference to the logger
    this.log = this.config.log;

    // build company-specific user agent
    const userAgent = `${this.config.company}/${this.config.version}`;

    // configure axios for making API requests to the identity verification api
    this.identityApi = axios.create({
      baseURL: this.config.identityApiBaseUrl,
      auth: {
        username: this.config.apiToken,
        password: this.config.apiSecret
      },
      headers: {
        "User-Agent": userAgent
      }
    });

    // configure axios for making API requests to the document verification api
    this.documentApi = axios.create({
      baseURL: this.config.documentApiBaseUrl,
      auth: {
        username: this.config.apiToken,
        password: this.config.apiSecret
      },
      headers: {
        "User-Agent": userAgent
      }
    });

    // log initialized
    this.log.info(
      {
        identityApiBaseUrl: this.config.identityApiBaseUrl,
        documentApiBaseUrl: this.config.documentApiBaseUrl,
        apiToken: this.config.apiToken,
        apiSecret: new Array(this.config.apiSecret.length + 1).join("x"),
        userAgent
      },
      "initialized"
    );
  }

  /**
   * Returns whether given identity verification result can be considered a successful verification.
   *
   * @param result Verification result
   */
  static isIdentityConsideredVerified(result: IdentityVerificationResult) {
    // verification status must be approved-verified
    if (
      result.verificationStatus !== IdentityVerificationStatus.APPROVED_VERIFIED
    ) {
      return false;
    }

    // selfie must match the documents
    if (
      !result.identityVerification.validity ||
      result.identityVerification.similarity !== Similarity.MATCH
    ) {
      return false;
    }

    // the callback ip must be valid
    if (!result.metadata.isValidCallbackIp) {
      return false;
    }

    return true;
  }

  /**
   * Returns whether given document verification result can be considered a successful verification.
   *
   * @param result Verification result
   */
  static isDocumentConsideredVerified(result: DocumentVerificationResult) {
    // transaction status must be done
    if (
      result.transactionStatus !== DocumentVerificationTransactionStatus.DONE
    ) {
      return false;
    }

    // document info must be extracted
    if (
      result.documentStatus !== DocumentVerificationDocumentStatus.EXTRACTED
    ) {
      return false;
    }

    // the callback ip must be valid
    if (!result.metadata.isValidCallbackIp) {
      return false;
    }

    // name must have been extracted
    if (typeof result.name !== "string" || result.name.length === 0) {
      return false;
    }

    // address must have been extracted
    if (typeof result.address !== "string" || result.address.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Extracts name from the document verification document info if available.
   *
   * @param document Document info
   */
  private static extractDocumentName(
    document: DocumentVerificationDocumentInfo
  ): string | undefined {
    if (!document.extractedData) {
      return undefined;
    }

    if (document.extractedData.firstName && document.extractedData.lastName) {
      return `${document.extractedData.firstName} ${
        document.extractedData.lastName
      }`;
    }

    return document.extractedData.name;
  }

  /**
   * Extracts address from the document verification document info if available.
   *
   * @param document Document info
   */
  private static stringifyAddress(address: Address): string {
    let tokens: (string | undefined)[] = [];

    if (Jumio.isUsAddress(address)) {
      tokens = [
        address.streetName,
        address.streetSuffix,
        address.streetDirection,
        address.streetNumber,
        `${address.unitNumber} ${address.unitDesignator}`,
        address.stateCode,
        address.zip,
        address.zipExtension,
        address.country
      ];
    } else if (Jumio.isEuAddress(address)) {
      tokens = [
        address.streetName,
        address.streetNumber,
        address.unitDetails,
        address.city,
        address.province,
        address.country,
        address.postalCode
      ];
    } else if (Jumio.isRawAddress(address)) {
      tokens = [
        address.line1,
        address.line2,
        address.line3,
        address.line4,
        address.line5,
        address.city,
        address.country,
        address.postalCode
      ];
    }

    return tokens.filter(token => typeof token === "string").join(", ");
  }

  /**
   * Transforms raw callback result into parsed object with proper dates, parsed JSON payloads etc.
   *
   * @param info Raw verification result info
   * @param metadata Metadata added by the library
   */
  private static transformRawIdentityResult(
    info: RawIdentityVerificationResult,
    metadata: VerificationMetadata
  ): IdentityVerificationResult {
    const result: IdentityVerificationResult = {
      ...info,
      metadata,
      transactionDate: new Date(info.transactionDate),
      callbackDate: new Date(info.callbackDate)
    };

    if (
      result.verificationStatus === IdentityVerificationStatus.APPROVED_VERIFIED
    ) {
      result.idDob = Jumio.parseDate(info.idDob);
      result.idExpiry = Jumio.parseDate(info.idExpiry);
      result.identityVerification = JSON.parse(info.identityVerification);

      if (info.idAddress) {
        result.idAddress = JSON.parse(info.idAddress);
      }

      if (info.dlCategories) {
        result.dlCategories = JSON.parse(info.dlCategories);
      }
    } else if (
      result.verificationStatus === IdentityVerificationStatus.DENIED_FRAUD ||
      result.verificationStatus ===
        IdentityVerificationStatus.ERROR_NOT_READABLE_ID
    ) {
      result.rejectReason = JSON.parse(info.rejectReason);
    }

    return result;
  }
  /**
   * Transforms raw callback result into parsed object with proper dates, parsed JSON payloads etc.
   *
   * @param info Raw verification result info
   * @param metadata Metadata added by the library
   */
  private static transformRawDocumentResult(
    info: RawDocumentVerificationResult,
    metadata: VerificationMetadata
  ): DocumentVerificationResult {
    const transaction: DocumentVerificationTransactionInfo = JSON.parse(
      info.transaction
    );
    const document: DocumentVerificationDocumentInfo | undefined = info.document
      ? JSON.parse(info.document)
      : undefined;

    const result: DocumentVerificationResult = {
      metadata,
      scanReference: info.scanReference,
      transactionStatus: transaction.status,
      documentStatus: document
        ? document.status
        : DocumentVerificationDocumentStatus.NOT_AVAILABLE,
      name: document ? Jumio.extractDocumentName(document) : undefined,
      address:
        document && document.extractedData && document.extractedData.address
          ? Jumio.stringifyAddress(document.extractedData.address)
          : undefined,
      source: transaction.source,
      merchantScanReference: transaction.merchantScanReference,
      customerId: transaction.customerId,
      merchantReportingCriteria: transaction.merchantReportingCriteria,
      images: document ? document.images : [],
      originalDocument: document ? document.originalDocument : undefined,
      clientIp: transaction.clientIp,
      transactionDate: new Date(transaction.date),
      callbackDate: new Date(info.timestamp)
    };

    return result;
  }

  /**
   * Returns parsed Date.
   *
   * @param address Date to parse
   */
  private static parseDate(date: any): Date | undefined {
    return date && new Date(date);
  }

  /**
   * Returns whether given address is of US type.
   *
   * @param address Address to check
   */
  private static isUsAddress(address: any): address is AddressUs {
    return typeof address.stateCode === "string";
  }

  /**
   * Returns whether given address is of EU type.
   *
   * @param address Address to check
   */
  private static isEuAddress(address: any): address is AddressEu {
    return typeof address.streetName === "string";
  }

  /**
   * Returns whether given address is of raw type.
   *
   * @param address Address to check
   */
  private static isRawAddress(address: any): address is AddressRaw {
    return typeof address.line1 === "string";
  }

  /**
   * Returns express router that handles Jumio integration.
   *
   * Example: `router.use("/jumio", jumio.middleware());`
   */
  middleware(): Router {
    // we need to handle multiple endpoints so use a router
    const router = Router();

    // handles identity verification callback
    router.post(
      "/identity-verification-callback",
      this.handleIdentityVerificationCallback.bind(this)
    );

    // handles document verification callback
    router.post(
      "/document-verification-callback",
      this.handleDocumentVerificationCallback.bind(this)
    );

    // handles identity verification image request, proxies the verification image using authentication
    router.get(
      "/identity-verification-image/:id/:type",
      this.handleIdentityVerificationImage.bind(this)
    );

    // handles document verification image request, proxies the verification image using authentication
    router.get(
      "/document-verification-image/:id/:index",
      this.handleDocumentVerificationImage.bind(this)
    );

    // handles document verification original document request, proxies the document using authentication
    router.get(
      "/document-verification-original/:id",
      this.handleDocumentVerificationOriginal.bind(this)
    );

    return router;
  }

  /**
   * Initiates identity verification.
   *
   * @param parameters Identity verification initiation parameters
   */
  async initiateIdentityVerification(
    parameters: InitiateIdentityVerificationParameters
  ): Promise<InitiateIdentityVerificationResponse> {
    const response = await this.identityApi.post<
      InitiateIdentityVerificationResponse
    >("/initiate", parameters);

    this.log.info(
      {
        parameters,
        response: response.data
      },
      "initiated identity verification"
    );

    return response.data;
  }

  /**
   * Initiates document verification.
   *
   * @param parameters Document verification initiation parameters
   */
  async initiateDocumentVerification(
    parameters: InitiateDocumentVerificationParameters
  ): Promise<InitiateDocumentVerificationResponse> {
    const response = await this.documentApi.post<
      InitiateDocumentVerificationResponse
    >("/acquisitions", parameters);

    this.log.info(
      {
        parameters,
        response: response.data
      },
      "initiated document verification"
    );

    return response.data;
  }

  /**
   * Handles the identity verification Jumio callback.
   *
   * https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md
   *
   * @param request Express request
   * @param response Express response
   * @param _next Express next function
   */
  private async handleIdentityVerificationCallback(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    // validate callback ip
    const callbackIp = request.ip;
    const isValidCallbackIp = this.isValidCallbackIp(callbackIp);

    // transform the raw result to well-formed format
    const rawResult: RawIdentityVerificationResult = request.body;
    // TODO: validate against schema?
    const result: IdentityVerificationResult = Jumio.transformRawIdentityResult(
      rawResult,
      {
        rawResult,
        callbackIp,
        isValidCallbackIp
      }
    );

    // log callback info
    this.log.info(
      {
        callbackIp,
        isValidCallbackIp,
        rawResult,
        result
      },
      "received identity validation callback"
    );

    // attempt to remotely handle the callback
    try {
      await this.config.handleIdentityVerification(result);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("handling identity verification callback failed");

      return;
    }

    // respond with 200 OK
    response.send("OK");
  }

  /**
   * Handles the document verification Jumio callback.
   *
   * https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md
   *
   * @param request Express request
   * @param response Express response
   * @param _next Express next function
   */
  private async handleDocumentVerificationCallback(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    // validate callback ip
    const callbackIp = request.ip;
    const isValidCallbackIp = this.isValidCallbackIp(callbackIp);

    // transform the raw result to well-formed format
    const rawResult: RawDocumentVerificationResult = request.body;
    // TODO: validate against schema?
    const verificationResult: DocumentVerificationResult = Jumio.transformRawDocumentResult(
      rawResult,
      {
        rawResult,
        callbackIp,
        isValidCallbackIp
      }
    );

    // log callback info
    this.log.info(
      {
        callbackIp,
        isValidCallbackIp,
        rawResult,
        verificationResult
      },
      "received document validation callback"
    );

    // attempt to remotely handle the callback
    try {
      await this.config.handleDocumentVerification(verificationResult);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("handling document verification callback failed");

      return;
    }

    // respond with 200 OK
    response.send("OK");
  }

  /**
   * Handles the identity verification image request.
   *
   * Proxies the request to Jumio API with authentication without exposing the secrets.
   *
   * @param request Express request
   * @param response Express response
   * @param _next Express next function
   */
  private async handleIdentityVerificationImage(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { id, type } = request.params as IdentityImageEndpointParams;
    const apiUrl = identityRetrievalRegionApiUrlMap[this.config.region];
    const imageUrl = `${apiUrl}/${id}/${type}`;

    try {
      // fetch the file
      const image = await this.identityApi.get(imageUrl, {
        responseType: "arraybuffer"
      });

      // send back proxied headers and data
      response.writeHead(200, image.headers);
      response.end(image.data, "binary");
    } catch (error) {
      // log failure
      this.log.warn(
        {
          imageUrl,
          error
        },
        "identity verification image could not be found"
      );

      // TODO: send 404 image instead
      response.status(404).send("not found");
    }
  }

  /**
   * Handles the document verification image request.
   *
   * Proxies the request to Jumio API with authentication without exposing the secrets.
   *
   * @param request Express request
   * @param response Express response
   * @param _next Express next function
   */
  private async handleDocumentVerificationImage(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { id, index } = request.params as DocumentImageEndpointParams;
    const apiUrl = documentRetrievalRegionApiUrlMap[this.config.region];
    const imageUrl = `${apiUrl}/${id}/pages/${index}`;

    try {
      // fetch the file
      const image = await this.documentApi.get(imageUrl, {
        responseType: "arraybuffer"
      });

      // send back proxied headers and data
      response.writeHead(200, image.headers);
      response.end(image.data, "binary");
    } catch (error) {
      // log failure
      this.log.warn(
        {
          imageUrl,
          error
        },
        "document verification image could not be found"
      );

      // TODO: send 404 image instead
      response.status(404).send("not found");
    }
  }

  /**
   * Handles the document verification original document request.
   *
   * Proxies the request to Jumio API with authentication without exposing the secrets.
   *
   * @param request Express request
   * @param response Express response
   * @param _next Express next function
   */
  private async handleDocumentVerificationOriginal(
    request: Request,
    response: Response,
    _next: NextFunction
  ) {
    const { id } = request.params as DocumentOriginalEndpointParams;
    const apiUrl = documentRetrievalRegionApiUrlMap[this.config.region];
    const documentUrl = `${apiUrl}/${id}/original`;

    try {
      // fetch the file
      const document = await this.documentApi.get(documentUrl, {
        responseType: "arraybuffer"
      });

      // send back proxied headers and data
      response.writeHead(200, document.headers);
      response.end(document.data, "binary");
    } catch (error) {
      // log failure
      this.log.warn(
        {
          documentUrl,
          error
        },
        "document verification original document could not be found"
      );

      response.status(404).send("not found");
    }
  }

  /**
   * Returns whether given request ip is in the whitelist and should thus be accepted.
   *
   * @param requestIp IP address to check
   */
  private isValidCallbackIp(requestIp: string) {
    return this.config.callbackWhitelist.some(validIp =>
      ip.isEqual(requestIp, validIp)
    );
  }
}
