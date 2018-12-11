"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e;
var axios_1 = __importDefault(require("axios"));
var express_1 = require("express");
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var ip = __importStar(require("ip"));
var ts_log_1 = require("ts-log");
var Region;
(function (Region) {
    Region["US"] = "US";
    Region["EU"] = "EU";
})(Region = exports.Region || (exports.Region = {}));
// https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#supported-workflowid-values
var WorkflowId;
(function (WorkflowId) {
    WorkflowId[WorkflowId["ID_CAMERA_AND_UPLOAD"] = 100] = "ID_CAMERA_AND_UPLOAD";
    WorkflowId[WorkflowId["ID_CAMERA_ONLY"] = 101] = "ID_CAMERA_ONLY";
    WorkflowId[WorkflowId["ID_UPLOAD_ONLY"] = 102] = "ID_UPLOAD_ONLY";
    WorkflowId[WorkflowId["ID_AND_IDENTITY_CAMERA_AND_UPLOAD"] = 200] = "ID_AND_IDENTITY_CAMERA_AND_UPLOAD";
    WorkflowId[WorkflowId["ID_AND_IDENTITY_CAMERA_ONLY"] = 201] = "ID_AND_IDENTITY_CAMERA_ONLY";
    WorkflowId[WorkflowId["ID_AND_IDENTITY_UPLOAD_ONLY"] = 202] = "ID_AND_IDENTITY_UPLOAD_ONLY";
})(WorkflowId = exports.WorkflowId || (exports.WorkflowId = {}));
var Locale;
(function (Locale) {
    Locale["bg"] = "bg";
    Locale["cs"] = "cs";
    Locale["da"] = "da";
    Locale["de"] = "de";
    Locale["el"] = "el";
    Locale["en"] = "en";
    Locale["en_GB"] = "en_GB";
    Locale["es"] = "es";
    Locale["es_MX"] = "es_MX";
    Locale["et"] = "et";
    Locale["fi"] = "fi";
    Locale["fr"] = "fr";
    Locale["hu"] = "hu";
    Locale["it"] = "it";
    Locale["ja"] = "ja";
    Locale["ko"] = "ko";
    Locale["lt"] = "lt";
    Locale["nl"] = "nl";
    Locale["no"] = "no";
    Locale["pl"] = "pl";
    Locale["pt"] = "pt";
    Locale["pt_BR"] = "pt_BR";
    Locale["ro"] = "ro";
    Locale["ru"] = "ru";
    Locale["sk"] = "sk";
    Locale["sv"] = "sv";
    Locale["tr"] = "tr";
    Locale["vl"] = "vl";
    Locale["zh_CN"] = "zh_CN";
    Locale["zh_HK"] = "zh_HK"; // Traditional Chinese
})(Locale = exports.Locale || (exports.Locale = {}));
var IdentityVerificationStatus;
(function (IdentityVerificationStatus) {
    // person has been approved and verified
    IdentityVerificationStatus["APPROVED_VERIFIED"] = "APPROVED_VERIFIED";
    // fraud attempt was detected
    IdentityVerificationStatus["DENIED_FRAUD"] = "DENIED_FRAUD";
    // denied due to supplying unsupported identification source
    IdentityVerificationStatus["DENIED_UNSUPPORTED_ID_TYPE"] = "DENIED_UNSUPPORTED_ID_TYPE";
    // denied due to supplying identification source from unsupported country
    IdentityVerificationStatus["DENIED_UNSUPPORTED_ID_COUNTRY"] = "DENIED_UNSUPPORTED_ID_COUNTRY";
    // the identification source was not readable
    IdentityVerificationStatus["ERROR_NOT_READABLE_ID"] = "ERROR_NOT_READABLE_ID";
    // no identification source was provided
    IdentityVerificationStatus["NO_ID_UPLOADED"] = "NO_ID_UPLOADED";
})(IdentityVerificationStatus = exports.IdentityVerificationStatus || (exports.IdentityVerificationStatus = {}));
var IdScanStatus;
(function (IdScanStatus) {
    IdScanStatus["SUCCESS"] = "SUCCESS";
    IdScanStatus["ERROR"] = "ERROR";
})(IdScanStatus = exports.IdScanStatus || (exports.IdScanStatus = {}));
var IdScanSource;
(function (IdScanSource) {
    // embedded and no camera or upload started
    IdScanSource["WEB"] = "WEB";
    // embedded via camera
    IdScanSource["WEB_CAM"] = "WEB_CAM";
    // embedded via upload
    IdScanSource["WEB_UPLOAD"] = "WEB_UPLOAD";
    // redirect and no camera or upload started
    IdScanSource["REDIRECT"] = "REDIRECT";
    // redirect via camera
    IdScanSource["REDIRECT_CAM"] = "REDIRECT_CAM";
    // redirect via upload
    IdScanSource["REDIRECT_UPLOAD"] = "REDIRECT_UPLOAD";
    // performed over the api
    IdScanSource["API"] = "API";
    // performed on mobile sdk
    IdScanSource["SDK"] = "SDK";
})(IdScanSource = exports.IdScanSource || (exports.IdScanSource = {}));
var IdCheckStatus;
(function (IdCheckStatus) {
    IdCheckStatus["OK"] = "OK";
    IdCheckStatus["NOT_AVAILABLE"] = "N/A";
})(IdCheckStatus = exports.IdCheckStatus || (exports.IdCheckStatus = {}));
var IdType;
(function (IdType) {
    IdType["PASSPORT"] = "PASSPORT";
    IdType["DRIVING_LICENSE"] = "DRIVING_LICENSE";
    IdType["ID_CARD"] = "ID_CARD";
    IdType["VISA"] = "VISA";
})(IdType = exports.IdType || (exports.IdType = {}));
var IdSubType;
(function (IdSubType) {
    IdSubType["NATIONAL_ID"] = "NATIONAL_ID";
    IdSubType["CONSULAR_ID"] = "CONSULAR_ID";
    IdSubType["ELECTORAL_ID"] = "ELECTORAL_ID";
    IdSubType["RESIDENT_PERMIT_ID"] = "RESIDENT_PERMIT_ID";
    IdSubType["TAX_ID"] = "TAX_ID";
    IdSubType["STUDENT_ID"] = "STUDENT_ID";
    IdSubType["PASSPORT_CARD_ID"] = "PASSPORT_CARD_ID";
    IdSubType["MILITARY_ID"] = "MILITARY_ID";
    IdSubType["OTHER_ID"] = "OTHER_ID";
    IdSubType["VISA"] = "VISA";
    IdSubType["LEARNING_DRIVING_LICENSE"] = "LEARNING_DRIVING_LICENSE";
    IdSubType["E_PASSPORT"] = "E_PASSPORT";
    IdSubType["UNKNOWN"] = "UNKNOWN";
})(IdSubType = exports.IdSubType || (exports.IdSubType = {}));
var RejectReasonCode;
(function (RejectReasonCode) {
    // for verificationStatus of DENIED_FRAUD
    RejectReasonCode[RejectReasonCode["MANIPULATED_DOCUMENT"] = 100] = "MANIPULATED_DOCUMENT";
    RejectReasonCode[RejectReasonCode["FRAUDSTER"] = 105] = "FRAUDSTER";
    RejectReasonCode[RejectReasonCode["FAKE"] = 106] = "FAKE";
    RejectReasonCode[RejectReasonCode["PHOTO_MISMATCH"] = 107] = "PHOTO_MISMATCH";
    RejectReasonCode[RejectReasonCode["MRZ_CHECK_FAILED"] = 108] = "MRZ_CHECK_FAILED";
    RejectReasonCode[RejectReasonCode["PUNCHED_DOCUMENT"] = 109] = "PUNCHED_DOCUMENT";
    RejectReasonCode[RejectReasonCode["CHIP_DATA_MANIPULATED"] = 110] = "CHIP_DATA_MANIPULATED";
    RejectReasonCode[RejectReasonCode["MISMATCH_PRINTED_BARCODE_DATA"] = 111] = "MISMATCH_PRINTED_BARCODE_DATA";
    // for verificationStatus of ERROR_NOT_READABLE_ID
    RejectReasonCode[RejectReasonCode["PHOTOCOPY_BLACK_WHITE"] = 102] = "PHOTOCOPY_BLACK_WHITE";
    RejectReasonCode[RejectReasonCode["PHOTOCOPY_COLOR"] = 103] = "PHOTOCOPY_COLOR";
    RejectReasonCode[RejectReasonCode["DIGITAL_COPY"] = 104] = "DIGITAL_COPY";
    RejectReasonCode[RejectReasonCode["NOT_READABLE_DOCUMENT"] = 200] = "NOT_READABLE_DOCUMENT";
    RejectReasonCode[RejectReasonCode["NO_DOCUMENT"] = 201] = "NO_DOCUMENT";
    RejectReasonCode[RejectReasonCode["SAMPLE_DOCUMENT"] = 202] = "SAMPLE_DOCUMENT";
    RejectReasonCode[RejectReasonCode["MISSING_BACK"] = 206] = "MISSING_BACK";
    RejectReasonCode[RejectReasonCode["WRONG_DOCUMENT_PAGE"] = 207] = "WRONG_DOCUMENT_PAGE";
    RejectReasonCode[RejectReasonCode["MISSING_SIGNATURE"] = 209] = "MISSING_SIGNATURE";
    RejectReasonCode[RejectReasonCode["CAMERA_BLACK_WHITE"] = 210] = "CAMERA_BLACK_WHITE";
    RejectReasonCode[RejectReasonCode["DIFFERENT_PERSONS_SHOWN"] = 211] = "DIFFERENT_PERSONS_SHOWN";
    RejectReasonCode[RejectReasonCode["MANUAL_REJECTION"] = 300] = "MANUAL_REJECTION";
})(RejectReasonCode = exports.RejectReasonCode || (exports.RejectReasonCode = {}));
// must match the RejectReasonCode above
var RejectReasonDescription;
(function (RejectReasonDescription) {
    // for verificationStatus of DENIED_FRAUD
    RejectReasonDescription["MANIPULATED_DOCUMENT"] = "MANIPULATED_DOCUMENT";
    RejectReasonDescription["FRAUDSTER"] = "FRAUDSTER";
    RejectReasonDescription["FAKE"] = "FAKE";
    RejectReasonDescription["PHOTO_MISMATCH"] = "PHOTO_MISMATCH";
    RejectReasonDescription["MRZ_CHECK_FAILED"] = "MRZ_CHECK_FAILED";
    RejectReasonDescription["PUNCHED_DOCUMENT"] = "PUNCHED_DOCUMENT";
    RejectReasonDescription["CHIP_DATA_MANIPULATED"] = "CHIP_DATA_MANIPULATED";
    RejectReasonDescription["MISMATCH_PRINTED_BARCODE_DATA"] = "MISMATCH_PRINTED_BARCODE_DATA";
    // for verificationStatus of ERROR_NOT_READABLE_ID
    RejectReasonDescription["PHOTOCOPY_BLACK_WHITE"] = "PHOTOCOPY_BLACK_WHITE";
    RejectReasonDescription["PHOTOCOPY_COLOR"] = "PHOTOCOPY_COLOR";
    RejectReasonDescription["DIGITAL_COPY"] = "DIGITAL_COPY";
    RejectReasonDescription["NOT_READABLE_DOCUMENT"] = "NOT_READABLE_DOCUMENT";
    RejectReasonDescription["NO_DOCUMENT"] = "NO_DOCUMENT";
    RejectReasonDescription["SAMPLE_DOCUMENT"] = "SAMPLE_DOCUMENT";
    RejectReasonDescription["MISSING_BACK"] = "MISSING_BACK";
    RejectReasonDescription["WRONG_DOCUMENT_PAGE"] = "WRONG_DOCUMENT_PAGE";
    RejectReasonDescription["MISSING_SIGNATURE"] = "MISSING_SIGNATURE";
    RejectReasonDescription["CAMERA_BLACK_WHITE"] = "CAMERA_BLACK_WHITE";
    RejectReasonDescription["DIFFERENT_PERSONS_SHOWN"] = "DIFFERENT_PERSONS_SHOWN";
    RejectReasonDescription["MANUAL_REJECTION"] = "MANUAL_REJECTION";
})(RejectReasonDescription = exports.RejectReasonDescription || (exports.RejectReasonDescription = {}));
var RejectDetailsCode;
(function (RejectDetailsCode) {
    // for rejectReasonCode of 100-MANIPULATED_DOCUMENT
    RejectDetailsCode[RejectDetailsCode["PHOTO"] = 1001] = "PHOTO";
    RejectDetailsCode[RejectDetailsCode["DOCUMENT_NUMBER"] = 1002] = "DOCUMENT_NUMBER";
    RejectDetailsCode[RejectDetailsCode["EXPIRY"] = 1003] = "EXPIRY";
    RejectDetailsCode[RejectDetailsCode["DOB"] = 1004] = "DOB";
    RejectDetailsCode[RejectDetailsCode["NAME"] = 1005] = "NAME";
    RejectDetailsCode[RejectDetailsCode["ADDRESS"] = 1006] = "ADDRESS";
    RejectDetailsCode[RejectDetailsCode["SECURITY_CHECKS"] = 1007] = "SECURITY_CHECKS";
    RejectDetailsCode[RejectDetailsCode["SIGNATURE"] = 1008] = "SIGNATURE";
    RejectDetailsCode[RejectDetailsCode["PERSONAL_NUMBER"] = 1009] = "PERSONAL_NUMBER";
    RejectDetailsCode[RejectDetailsCode["PLACE_OF_BIRTH"] = 10011] = "PLACE_OF_BIRTH";
    // for rejectReasonCode of 200-NOT_READABLE_DOCUMENT
    RejectDetailsCode[RejectDetailsCode["BLURRED"] = 2001] = "BLURRED";
    RejectDetailsCode[RejectDetailsCode["BAD_QUALITY"] = 2002] = "BAD_QUALITY";
    RejectDetailsCode[RejectDetailsCode["MISSING_PART_DOCUMENT"] = 2003] = "MISSING_PART_DOCUMENT";
    RejectDetailsCode[RejectDetailsCode["HIDDEN_PART_DOCUMENT"] = 2004] = "HIDDEN_PART_DOCUMENT";
    RejectDetailsCode[RejectDetailsCode["DAMAGED_DOCUMENT"] = 2005] = "DAMAGED_DOCUMENT";
})(RejectDetailsCode = exports.RejectDetailsCode || (exports.RejectDetailsCode = {}));
// must match the RejectDetailsCode above
var RejectDetailsDescription;
(function (RejectDetailsDescription) {
    // for rejectReasonCode of 100-MANIPULATED_DOCUMENT
    RejectDetailsDescription["PHOTO"] = "PHOTO";
    RejectDetailsDescription["DOCUMENT_NUMBER"] = "DOCUMENT_NUMBER";
    RejectDetailsDescription["EXPIRY"] = "EXPIRY";
    RejectDetailsDescription["DOB"] = "DOB";
    RejectDetailsDescription["NAME"] = "NAME";
    RejectDetailsDescription["ADDRESS"] = "ADDRESS";
    RejectDetailsDescription["SECURITY_CHECKS"] = "SECURITY_CHECKS";
    RejectDetailsDescription["SIGNATURE"] = "SIGNATURE";
    RejectDetailsDescription["PERSONAL_NUMBER"] = "PERSONAL_NUMBER";
    RejectDetailsDescription["PLACE_OF_BIRTH"] = "PLACE_OF_BIRTH";
    // for rejectReasonCode of 200-NOT_READABLE_DOCUMENT
    RejectDetailsDescription["BLURRED"] = "BLURRED";
    RejectDetailsDescription["BAD_QUALITY"] = "BAD_QUALITY";
    RejectDetailsDescription["MISSING_PART_DOCUMENT"] = "MISSING_PART_DOCUMENT";
    RejectDetailsDescription["HIDDEN_PART_DOCUMENT"] = "HIDDEN_PART_DOCUMENT";
    RejectDetailsDescription["DAMAGED_DOCUMENT"] = "DAMAGED_DOCUMENT";
})(RejectDetailsDescription = exports.RejectDetailsDescription || (exports.RejectDetailsDescription = {}));
var Gender;
(function (Gender) {
    Gender["M"] = "M";
    Gender["F"] = "F";
})(Gender = exports.Gender || (exports.Gender = {}));
var Similarity;
(function (Similarity) {
    Similarity["MATCH"] = "MATCH";
    Similarity["NO_MATCH"] = "NO_MATCH";
    Similarity["NOT_POSSIBLE"] = "NOT_POSSIBLE";
})(Similarity = exports.Similarity || (exports.Similarity = {}));
var IdentityInvalidReason;
(function (IdentityInvalidReason) {
    IdentityInvalidReason["SELFIE_CROPPED_FROM_ID"] = "SELFIE_CROPPED_FROM_ID";
    IdentityInvalidReason["ENTIRE_ID_USED_AS_SELFIE"] = "ENTIRE_ID_USED_AS_SELFIE";
    IdentityInvalidReason["MULTIPLE_PEOPLE"] = "MULTIPLE_PEOPLE";
    IdentityInvalidReason["SELFIE_IS_SCREEN_PAPER_VIDEO"] = "SELFIE_IS_SCREEN_PAPER_VIDEO";
    IdentityInvalidReason["SELFIE_MANIPULATED"] = "SELFIE_MANIPULATED";
    IdentityInvalidReason["AGE_DIFFERENCE_TOO_BIG"] = "AGE_DIFFERENCE_TOO_BIG";
    IdentityInvalidReason["NO_FACE_PRESENT"] = "NO_FACE_PRESENT";
    IdentityInvalidReason["FACE_NOT_FULLY_VISIBLE"] = "FACE_NOT_FULLY_VISIBLE";
    IdentityInvalidReason["BAD_QUALITY"] = "BAD_QUALITY";
    IdentityInvalidReason["BLACK_AND_WHITE"] = "BLACK_AND_WHITE";
})(IdentityInvalidReason = exports.IdentityInvalidReason || (exports.IdentityInvalidReason = {}));
var CountryCode;
(function (CountryCode) {
    CountryCode["AFG"] = "AFG";
    CountryCode["ALA"] = "ALA";
    CountryCode["ALB"] = "ALB";
    CountryCode["DZA"] = "DZA";
    CountryCode["ASM"] = "ASM";
    CountryCode["AND"] = "AND";
    CountryCode["AGO"] = "AGO";
    CountryCode["AIA"] = "AIA";
    CountryCode["ATA"] = "ATA";
    CountryCode["ATG"] = "ATG";
    CountryCode["ARG"] = "ARG";
    CountryCode["ARM"] = "ARM";
    CountryCode["ABW"] = "ABW";
    CountryCode["AUS"] = "AUS";
    CountryCode["AUT"] = "AUT";
    CountryCode["AZE"] = "AZE";
    CountryCode["BHS"] = "BHS";
    CountryCode["BHR"] = "BHR";
    CountryCode["BGD"] = "BGD";
    CountryCode["BRB"] = "BRB";
    CountryCode["BLR"] = "BLR";
    CountryCode["BEL"] = "BEL";
    CountryCode["BLZ"] = "BLZ";
    CountryCode["BEN"] = "BEN";
    CountryCode["BMU"] = "BMU";
    CountryCode["BTN"] = "BTN";
    CountryCode["BOL"] = "BOL";
    CountryCode["BES"] = "BES";
    CountryCode["BIH"] = "BIH";
    CountryCode["BWA"] = "BWA";
    CountryCode["BVT"] = "BVT";
    CountryCode["BRA"] = "BRA";
    CountryCode["IOT"] = "IOT";
    CountryCode["BRN"] = "BRN";
    CountryCode["BGR"] = "BGR";
    CountryCode["BFA"] = "BFA";
    CountryCode["BDI"] = "BDI";
    CountryCode["CPV"] = "CPV";
    CountryCode["KHM"] = "KHM";
    CountryCode["CMR"] = "CMR";
    CountryCode["CAN"] = "CAN";
    CountryCode["CYM"] = "CYM";
    CountryCode["CAF"] = "CAF";
    CountryCode["TCD"] = "TCD";
    CountryCode["CHL"] = "CHL";
    CountryCode["CHN"] = "CHN";
    CountryCode["CXR"] = "CXR";
    CountryCode["CCK"] = "CCK";
    CountryCode["COL"] = "COL";
    CountryCode["COM"] = "COM";
    CountryCode["COG"] = "COG";
    CountryCode["COD"] = "COD";
    CountryCode["COK"] = "COK";
    CountryCode["CRI"] = "CRI";
    CountryCode["CIV"] = "CIV";
    CountryCode["HRV"] = "HRV";
    CountryCode["CUB"] = "CUB";
    CountryCode["CUW"] = "CUW";
    CountryCode["CYP"] = "CYP";
    CountryCode["CZE"] = "CZE";
    CountryCode["DNK"] = "DNK";
    CountryCode["DJI"] = "DJI";
    CountryCode["DMA"] = "DMA";
    CountryCode["DOM"] = "DOM";
    CountryCode["ECU"] = "ECU";
    CountryCode["EGY"] = "EGY";
    CountryCode["SLV"] = "SLV";
    CountryCode["GNQ"] = "GNQ";
    CountryCode["ERI"] = "ERI";
    CountryCode["EST"] = "EST";
    CountryCode["SWZ"] = "SWZ";
    CountryCode["ETH"] = "ETH";
    CountryCode["FLK"] = "FLK";
    CountryCode["FRO"] = "FRO";
    CountryCode["FJI"] = "FJI";
    CountryCode["FIN"] = "FIN";
    CountryCode["FRA"] = "FRA";
    CountryCode["GUF"] = "GUF";
    CountryCode["PYF"] = "PYF";
    CountryCode["ATF"] = "ATF";
    CountryCode["GAB"] = "GAB";
    CountryCode["GMB"] = "GMB";
    CountryCode["GEO"] = "GEO";
    CountryCode["DEU"] = "DEU";
    CountryCode["GHA"] = "GHA";
    CountryCode["GIB"] = "GIB";
    CountryCode["GRC"] = "GRC";
    CountryCode["GRL"] = "GRL";
    CountryCode["GRD"] = "GRD";
    CountryCode["GLP"] = "GLP";
    CountryCode["GUM"] = "GUM";
    CountryCode["GTM"] = "GTM";
    CountryCode["GGY"] = "GGY";
    CountryCode["GIN"] = "GIN";
    CountryCode["GNB"] = "GNB";
    CountryCode["GUY"] = "GUY";
    CountryCode["HTI"] = "HTI";
    CountryCode["HMD"] = "HMD";
    CountryCode["VAT"] = "VAT";
    CountryCode["HND"] = "HND";
    CountryCode["HKG"] = "HKG";
    CountryCode["HUN"] = "HUN";
    CountryCode["ISL"] = "ISL";
    CountryCode["IND"] = "IND";
    CountryCode["IDN"] = "IDN";
    CountryCode["IRN"] = "IRN";
    CountryCode["IRQ"] = "IRQ";
    CountryCode["IRL"] = "IRL";
    CountryCode["IMN"] = "IMN";
    CountryCode["ISR"] = "ISR";
    CountryCode["ITA"] = "ITA";
    CountryCode["JAM"] = "JAM";
    CountryCode["JPN"] = "JPN";
    CountryCode["JEY"] = "JEY";
    CountryCode["JOR"] = "JOR";
    CountryCode["KAZ"] = "KAZ";
    CountryCode["KEN"] = "KEN";
    CountryCode["KIR"] = "KIR";
    CountryCode["PRK"] = "PRK";
    CountryCode["KOR"] = "KOR";
    CountryCode["KWT"] = "KWT";
    CountryCode["KGZ"] = "KGZ";
    CountryCode["LAO"] = "LAO";
    CountryCode["LVA"] = "LVA";
    CountryCode["LBN"] = "LBN";
    CountryCode["LSO"] = "LSO";
    CountryCode["LBR"] = "LBR";
    CountryCode["LBY"] = "LBY";
    CountryCode["LIE"] = "LIE";
    CountryCode["LTU"] = "LTU";
    CountryCode["LUX"] = "LUX";
    CountryCode["MAC"] = "MAC";
    CountryCode["MKD"] = "MKD";
    CountryCode["MDG"] = "MDG";
    CountryCode["MWI"] = "MWI";
    CountryCode["MYS"] = "MYS";
    CountryCode["MDV"] = "MDV";
    CountryCode["MLI"] = "MLI";
    CountryCode["MLT"] = "MLT";
    CountryCode["MHL"] = "MHL";
    CountryCode["MTQ"] = "MTQ";
    CountryCode["MRT"] = "MRT";
    CountryCode["MUS"] = "MUS";
    CountryCode["MYT"] = "MYT";
    CountryCode["MEX"] = "MEX";
    CountryCode["FSM"] = "FSM";
    CountryCode["MDA"] = "MDA";
    CountryCode["MCO"] = "MCO";
    CountryCode["MNG"] = "MNG";
    CountryCode["MNE"] = "MNE";
    CountryCode["MSR"] = "MSR";
    CountryCode["MAR"] = "MAR";
    CountryCode["MOZ"] = "MOZ";
    CountryCode["MMR"] = "MMR";
    CountryCode["NAM"] = "NAM";
    CountryCode["NRU"] = "NRU";
    CountryCode["NPL"] = "NPL";
    CountryCode["NLD"] = "NLD";
    CountryCode["NCL"] = "NCL";
    CountryCode["NZL"] = "NZL";
    CountryCode["NIC"] = "NIC";
    CountryCode["NER"] = "NER";
    CountryCode["NGA"] = "NGA";
    CountryCode["NIU"] = "NIU";
    CountryCode["NFK"] = "NFK";
    CountryCode["MNP"] = "MNP";
    CountryCode["NOR"] = "NOR";
    CountryCode["OMN"] = "OMN";
    CountryCode["PAK"] = "PAK";
    CountryCode["PLW"] = "PLW";
    CountryCode["PSE"] = "PSE";
    CountryCode["PAN"] = "PAN";
    CountryCode["PNG"] = "PNG";
    CountryCode["PRY"] = "PRY";
    CountryCode["PER"] = "PER";
    CountryCode["PHL"] = "PHL";
    CountryCode["PCN"] = "PCN";
    CountryCode["POL"] = "POL";
    CountryCode["PRT"] = "PRT";
    CountryCode["PRI"] = "PRI";
    CountryCode["QAT"] = "QAT";
    CountryCode["REU"] = "REU";
    CountryCode["ROU"] = "ROU";
    CountryCode["RUS"] = "RUS";
    CountryCode["RWA"] = "RWA";
    CountryCode["BLM"] = "BLM";
    CountryCode["SHN"] = "SHN";
    CountryCode["KNA"] = "KNA";
    CountryCode["LCA"] = "LCA";
    CountryCode["MAF"] = "MAF";
    CountryCode["SPM"] = "SPM";
    CountryCode["VCT"] = "VCT";
    CountryCode["WSM"] = "WSM";
    CountryCode["SMR"] = "SMR";
    CountryCode["STP"] = "STP";
    CountryCode["SAU"] = "SAU";
    CountryCode["SEN"] = "SEN";
    CountryCode["SRB"] = "SRB";
    CountryCode["SYC"] = "SYC";
    CountryCode["SLE"] = "SLE";
    CountryCode["SGP"] = "SGP";
    CountryCode["SXM"] = "SXM";
    CountryCode["SVK"] = "SVK";
    CountryCode["SVN"] = "SVN";
    CountryCode["SLB"] = "SLB";
    CountryCode["SOM"] = "SOM";
    CountryCode["ZAF"] = "ZAF";
    CountryCode["SGS"] = "SGS";
    CountryCode["SSD"] = "SSD";
    CountryCode["ESP"] = "ESP";
    CountryCode["LKA"] = "LKA";
    CountryCode["SDN"] = "SDN";
    CountryCode["SUR"] = "SUR";
    CountryCode["SJM"] = "SJM";
    CountryCode["SWE"] = "SWE";
    CountryCode["CHE"] = "CHE";
    CountryCode["SYR"] = "SYR";
    CountryCode["TWN"] = "TWN";
    CountryCode["TJK"] = "TJK";
    CountryCode["TZA"] = "TZA";
    CountryCode["THA"] = "THA";
    CountryCode["TLS"] = "TLS";
    CountryCode["TGO"] = "TGO";
    CountryCode["TKL"] = "TKL";
    CountryCode["TON"] = "TON";
    CountryCode["TTO"] = "TTO";
    CountryCode["TUN"] = "TUN";
    CountryCode["TUR"] = "TUR";
    CountryCode["TKM"] = "TKM";
    CountryCode["TCA"] = "TCA";
    CountryCode["TUV"] = "TUV";
    CountryCode["UGA"] = "UGA";
    CountryCode["UKR"] = "UKR";
    CountryCode["ARE"] = "ARE";
    CountryCode["GBR"] = "GBR";
    CountryCode["USA"] = "USA";
    CountryCode["UMI"] = "UMI";
    CountryCode["URY"] = "URY";
    CountryCode["UZB"] = "UZB";
    CountryCode["VUT"] = "VUT";
    CountryCode["VEN"] = "VEN";
    CountryCode["VNM"] = "VNM";
    CountryCode["VGB"] = "VGB";
    CountryCode["VIR"] = "VIR";
    CountryCode["WLF"] = "WLF";
    CountryCode["ESH"] = "ESH";
    CountryCode["YEM"] = "YEM";
    CountryCode["ZMB"] = "ZMB";
    CountryCode["ZWE"] = "ZWE"; // Zimbabwe
})(CountryCode = exports.CountryCode || (exports.CountryCode = {}));
var DlCarPermission;
(function (DlCarPermission) {
    DlCarPermission["YES"] = "YES";
    DlCarPermission["NO"] = "NO";
    DlCarPermission["NOT_READABLE"] = "NOT_READABLE";
})(DlCarPermission = exports.DlCarPermission || (exports.DlCarPermission = {}));
var DlCategory;
(function (DlCategory) {
    DlCategory["B1"] = "B1";
    DlCategory["B"] = "B";
    DlCategory["BE"] = "BE";
})(DlCategory = exports.DlCategory || (exports.DlCategory = {}));
// list of supported document types
// https://github.com/Jumio/implementation-guides/blob/master/netverify/document-verification.md#supported-documents
var DocumentVerificationType;
(function (DocumentVerificationType) {
    DocumentVerificationType["CC"] = "CC";
    DocumentVerificationType["IC"] = "IC";
    DocumentVerificationType["CAAP"] = "CAAP";
    DocumentVerificationType["CRC"] = "CRC";
    DocumentVerificationType["CCS"] = "CCS";
    DocumentVerificationType["LAG"] = "LAG";
    DocumentVerificationType["LOAP"] = "LOAP";
    DocumentVerificationType["MOAP"] = "MOAP";
    DocumentVerificationType["TR"] = "TR";
    DocumentVerificationType["VT"] = "VT";
    DocumentVerificationType["VC"] = "VC";
    DocumentVerificationType["STUC"] = "STUC";
    DocumentVerificationType["HCC"] = "HCC";
    DocumentVerificationType["CB"] = "CB";
    DocumentVerificationType["SENC"] = "SENC";
    DocumentVerificationType["MEDC"] = "MEDC";
    DocumentVerificationType["BC"] = "BC";
    DocumentVerificationType["WWCC"] = "WWCC";
    DocumentVerificationType["SS"] = "SS";
    DocumentVerificationType["TAC"] = "TAC";
    DocumentVerificationType["SEL"] = "SEL";
    DocumentVerificationType["PB"] = "PB";
    DocumentVerificationType["USSS"] = "USSS";
    DocumentVerificationType["CUSTOM"] = "CUSTOM";
    DocumentVerificationType["BS"] = "BS";
    DocumentVerificationType["UB"] = "UB"; // Utility bill
})(DocumentVerificationType = exports.DocumentVerificationType || (exports.DocumentVerificationType = {}));
var DocumentVerificationTransactionStatus;
(function (DocumentVerificationTransactionStatus) {
    DocumentVerificationTransactionStatus["DONE"] = "DONE";
    DocumentVerificationTransactionStatus["FAILED"] = "FAILED";
})(DocumentVerificationTransactionStatus = exports.DocumentVerificationTransactionStatus || (exports.DocumentVerificationTransactionStatus = {}));
var DocumentVerificationSource;
(function (DocumentVerificationSource) {
    DocumentVerificationSource["DOC_UPLOAD"] = "DOC_UPLOAD";
    DocumentVerificationSource["DOC_API"] = "DOC_API";
    DocumentVerificationSource["DOC_SDK"] = "DOC_SDK"; // document verification mobile
})(DocumentVerificationSource = exports.DocumentVerificationSource || (exports.DocumentVerificationSource = {}));
var DocumentVerificationDocumentStatus;
(function (DocumentVerificationDocumentStatus) {
    DocumentVerificationDocumentStatus["NOT_AVAILABLE"] = "NOT_AVAILABLE";
    DocumentVerificationDocumentStatus["UPLOADED"] = "UPLOADED";
    DocumentVerificationDocumentStatus["EXTRACTED"] = "EXTRACTED";
    DocumentVerificationDocumentStatus["DISCARDED"] = "DISCARDED";
})(DocumentVerificationDocumentStatus = exports.DocumentVerificationDocumentStatus || (exports.DocumentVerificationDocumentStatus = {}));
exports.identityRegionApiUrlMap = (_a = {},
    _a[Region.US] = "https://netverify.com/api/v4",
    _a[Region.EU] = "https://lon.netverify.com/api/v4",
    _a);
exports.documentRegionApiUrlMap = (_b = {},
    _b[Region.US] = "https://upload.netverify.com/api/netverify/v2",
    _b[Region.EU] = "https://upload.lon.netverify.com/api/netverify/v2",
    _b);
exports.identityRetrievalRegionApiUrlMap = (_c = {},
    _c[Region.US] = "https://netverify.com/recognition/v1/idscan",
    _c[Region.EU] = "https://lon.netverify.com/recognition/v1/idscan",
    _c);
exports.documentRetrievalRegionApiUrlMap = (_d = {},
    _d[Region.US] = "https://retrieval.netverify.com/api/netverify/v2/documents",
    _d[Region.EU] = "https://retrieval.lon.netverify.com/api/netverify/v2/documents",
    _d);
exports.regionCallbackWhitelistMap = (_e = {},
    _e[Region.US] = [
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
    _e[Region.EU] = [
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
    ],
    _e);
exports.documentTypeList = [
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
exports.countries = [
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
var Jumio = /** @class */ (function () {
    /**
     * Sets up the library.
     *
     * @param config Configuration
     */
    function Jumio(config) {
        var _this = this;
        // setup configuration with defaults
        this.config = __assign({ version: "1.0.0", identityApiBaseUrl: exports.identityRegionApiUrlMap[config.region], documentApiBaseUrl: exports.documentRegionApiUrlMap[config.region], callbackWhitelist: exports.regionCallbackWhitelistMap[config.region], handleIdentityVerification: function (_result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); }, handleDocumentVerification: function (_result) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); }, log: ts_log_1.dummyLogger }, config);
        // keep a shorter reference to the logger
        this.log = this.config.log;
        // build company-specific user agent
        var userAgent = this.config.company + "/" + this.config.version;
        // configure axios for making API requests to the identity verification api
        this.identityApi = axios_1.default.create({
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
        this.documentApi = axios_1.default.create({
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
        this.log.info({
            identityApiBaseUrl: this.config.identityApiBaseUrl,
            documentApiBaseUrl: this.config.documentApiBaseUrl,
            apiToken: this.config.apiToken,
            apiSecret: new Array(this.config.apiSecret.length + 1).join("x"),
            userAgent: userAgent
        }, "initialized");
    }
    /**
     * Returns whether given identity verification result can be considered a successful verification.
     *
     * @param result Verification result
     */
    Jumio.isIdentityConsideredVerified = function (result) {
        // verification status must be approved-verified
        if (result.verificationStatus !== IdentityVerificationStatus.APPROVED_VERIFIED) {
            return false;
        }
        // selfie must match the documents
        if (!result.identityVerification.validity) {
            return false;
        }
        // the callback ip must be valid
        if (!result.metadata.isValidCallbackIp) {
            return false;
        }
        return true;
    };
    /**
     * Returns whether given document verification result can be considered a successful verification.
     *
     * @param result Verification result
     */
    Jumio.isDocumentConsideredVerified = function (result) {
        // transaction status must be done
        if (result.transactionStatus !== DocumentVerificationTransactionStatus.DONE) {
            return false;
        }
        // document info must be extracted
        if (result.documentStatus !== DocumentVerificationDocumentStatus.EXTRACTED) {
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
    };
    /**
     * Extracts name from the document verification document info if available.
     *
     * @param document Document info
     */
    Jumio.extractDocumentName = function (document) {
        if (!document.extractedData) {
            return undefined;
        }
        if (document.extractedData.firstName && document.extractedData.lastName) {
            return document.extractedData.firstName + " " + document.extractedData.lastName;
        }
        return document.extractedData.name;
    };
    /**
     * Extracts address from the document verification document info if available.
     *
     * @param document Document info
     */
    Jumio.stringifyAddress = function (address) {
        var tokens = [];
        if (Jumio.isUsAddress(address)) {
            tokens = [
                address.streetName,
                address.streetSuffix,
                address.streetDirection,
                address.streetNumber,
                address.unitNumber + " " + address.unitDesignator,
                address.stateCode,
                address.zip,
                address.zipExtension,
                address.country
            ];
        }
        else if (Jumio.isEuAddress(address)) {
            tokens = [
                address.streetName,
                address.streetNumber,
                address.unitDetails,
                address.city,
                address.province,
                address.country,
                address.postalCode
            ];
        }
        else if (Jumio.isRawAddress(address)) {
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
        return tokens.filter(function (token) { return typeof token === "string"; }).join(", ");
    };
    /**
     * Transforms raw callback result into parsed object with proper dates, parsed JSON payloads etc.
     *
     * @param info Raw verification result info
     * @param metadata Metadata added by the library
     */
    Jumio.transformRawIdentityResult = function (info, metadata) {
        var result = __assign({}, info, { metadata: metadata, transactionDate: new Date(info.transactionDate), callbackDate: new Date(info.callbackDate) });
        if (result.verificationStatus === IdentityVerificationStatus.APPROVED_VERIFIED) {
            result.idDob = new Date(info.idDob);
            result.idExpiry = new Date(info.idExpiry);
            result.identityVerification = JSON.parse(info.identityVerification);
            if (info.idAddress) {
                result.idAddress = JSON.parse(info.idAddress);
            }
            if (info.dlCategories) {
                result.dlCategories = JSON.parse(info.dlCategories);
            }
        }
        else if (result.verificationStatus === IdentityVerificationStatus.DENIED_FRAUD ||
            result.verificationStatus ===
                IdentityVerificationStatus.ERROR_NOT_READABLE_ID) {
            result.rejectReason = JSON.parse(info.rejectReason);
        }
        return result;
    };
    /**
     * Transforms raw callback result into parsed object with proper dates, parsed JSON payloads etc.
     *
     * @param info Raw verification result info
     * @param metadata Metadata added by the library
     */
    Jumio.transformRawDocumentResult = function (info, metadata) {
        var transaction = JSON.parse(info.transaction);
        var document = info.document
            ? JSON.parse(info.document)
            : undefined;
        var result = {
            metadata: metadata,
            scanReference: info.scanReference,
            transactionStatus: transaction.status,
            documentStatus: document
                ? document.status
                : DocumentVerificationDocumentStatus.NOT_AVAILABLE,
            name: document ? Jumio.extractDocumentName(document) : undefined,
            address: document && document.extractedData && document.extractedData.address
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
    };
    /**
     * Returns whether given address is of US type.
     *
     * @param address Address to check
     */
    Jumio.isUsAddress = function (address) {
        return typeof address.stateCode === "string";
    };
    /**
     * Returns whether given address is of EU type.
     *
     * @param address Address to check
     */
    Jumio.isEuAddress = function (address) {
        return typeof address.streetName === "string";
    };
    /**
     * Returns whether given address is of raw type.
     *
     * @param address Address to check
     */
    Jumio.isRawAddress = function (address) {
        return typeof address.line1 === "string";
    };
    /**
     * Returns express router that handles Jumio integration.
     *
     * Example: `router.use("/jumio", jumio.middleware());`
     */
    Jumio.prototype.middleware = function () {
        // we need to handle multiple endpoints so use a router
        var router = express_1.Router();
        // handles identity verification callback
        router.post("/identity-verification-callback", this.handleIdentityVerificationCallback.bind(this));
        // handles document verification callback
        router.post("/document-verification-callback", this.handleDocumentVerificationCallback.bind(this));
        // handles identity verification image request, proxies the verification image using authentication
        router.get("/identity-verification-image/:id/:type", this.handleIdentityVerificationImage.bind(this));
        // handles document verification image request, proxies the verification image using authentication
        router.get("/document-verification-image/:id/:index", this.handleDocumentVerificationImage.bind(this));
        // handles document verification original document request, proxies the document using authentication
        router.get("/document-verification-original/:id", this.handleDocumentVerificationOriginal.bind(this));
        return router;
    };
    /**
     * Initiates identity verification.
     *
     * @param parameters Identity verification initiation parameters
     */
    Jumio.prototype.initiateIdentityVerification = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identityApi.post("/initiate", parameters)];
                    case 1:
                        response = _a.sent();
                        this.log.info({
                            parameters: parameters,
                            response: response.data
                        }, "initiated identity verification");
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Initiates document verification.
     *
     * @param parameters Document verification initiation parameters
     */
    Jumio.prototype.initiateDocumentVerification = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.documentApi.post("/acquisitions", parameters)];
                    case 1:
                        response = _a.sent();
                        this.log.info({
                            parameters: parameters,
                            response: response.data
                        }, "initiated document verification");
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Handles the identity verification Jumio callback.
     *
     * https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    Jumio.prototype.handleIdentityVerificationCallback = function (request, response, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var callbackIp, isValidCallbackIp, rawResult, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        callbackIp = request.ip;
                        isValidCallbackIp = this.isValidCallbackIp(callbackIp);
                        rawResult = request.body;
                        result = Jumio.transformRawIdentityResult(rawResult, {
                            rawResult: rawResult,
                            callbackIp: callbackIp,
                            isValidCallbackIp: isValidCallbackIp
                        });
                        // log callback info
                        this.log.info({
                            callbackIp: callbackIp,
                            isValidCallbackIp: isValidCallbackIp,
                            rawResult: rawResult,
                            result: result
                        }, "received identity validation callback");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.config.handleIdentityVerification(result)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        response
                            .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
                            .send("handling identity verification callback failed");
                        return [2 /*return*/];
                    case 4:
                        // respond with 200 OK
                        response.send("OK");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles the document verification Jumio callback.
     *
     * https://github.com/Jumio/implementation-guides/blob/master/netverify/callback.md
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    Jumio.prototype.handleDocumentVerificationCallback = function (request, response, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var callbackIp, isValidCallbackIp, rawResult, verificationResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        callbackIp = request.ip;
                        isValidCallbackIp = this.isValidCallbackIp(callbackIp);
                        rawResult = request.body;
                        verificationResult = Jumio.transformRawDocumentResult(rawResult, {
                            rawResult: rawResult,
                            callbackIp: callbackIp,
                            isValidCallbackIp: isValidCallbackIp
                        });
                        // log callback info
                        this.log.info({
                            callbackIp: callbackIp,
                            isValidCallbackIp: isValidCallbackIp,
                            rawResult: rawResult,
                            verificationResult: verificationResult
                        }, "received document validation callback");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.config.handleDocumentVerification(verificationResult)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        response
                            .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
                            .send("handling document verification callback failed");
                        return [2 /*return*/];
                    case 4:
                        // respond with 200 OK
                        response.send("OK");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles the identity verification image request.
     *
     * Proxies the request to Jumio API with authentication without exposing the secrets.
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    Jumio.prototype.handleIdentityVerificationImage = function (request, response, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, type, apiUrl, imageUrl, image, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.params, id = _a.id, type = _a.type;
                        apiUrl = exports.identityRetrievalRegionApiUrlMap[this.config.region];
                        imageUrl = apiUrl + "/" + id + "/" + type;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.identityApi.get(imageUrl, {
                                responseType: "arraybuffer"
                            })];
                    case 2:
                        image = _b.sent();
                        // send back proxied headers and data
                        response.writeHead(200, image.headers);
                        response.end(image.data, "binary");
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        // log failure
                        this.log.warn({
                            imageUrl: imageUrl,
                            error: error_3
                        }, "identity verification image could not be found");
                        // TODO: send 404 image instead
                        response.status(404).send("not found");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles the document verification image request.
     *
     * Proxies the request to Jumio API with authentication without exposing the secrets.
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    Jumio.prototype.handleDocumentVerificationImage = function (request, response, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, index, apiUrl, imageUrl, image, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.params, id = _a.id, index = _a.index;
                        apiUrl = exports.documentRetrievalRegionApiUrlMap[this.config.region];
                        imageUrl = apiUrl + "/" + id + "/pages/" + index;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.documentApi.get(imageUrl, {
                                responseType: "arraybuffer"
                            })];
                    case 2:
                        image = _b.sent();
                        // send back proxied headers and data
                        response.writeHead(200, image.headers);
                        response.end(image.data, "binary");
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        // log failure
                        this.log.warn({
                            imageUrl: imageUrl,
                            error: error_4
                        }, "document verification image could not be found");
                        // TODO: send 404 image instead
                        response.status(404).send("not found");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles the document verification original document request.
     *
     * Proxies the request to Jumio API with authentication without exposing the secrets.
     *
     * @param request Express request
     * @param response Express response
     * @param _next Express next function
     */
    Jumio.prototype.handleDocumentVerificationOriginal = function (request, response, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, apiUrl, documentUrl, document_1, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        apiUrl = exports.documentRetrievalRegionApiUrlMap[this.config.region];
                        documentUrl = apiUrl + "/" + id + "/original";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.documentApi.get(documentUrl, {
                                responseType: "arraybuffer"
                            })];
                    case 2:
                        document_1 = _a.sent();
                        // send back proxied headers and data
                        response.writeHead(200, document_1.headers);
                        response.end(document_1.data, "binary");
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        // log failure
                        this.log.warn({
                            documentUrl: documentUrl,
                            error: error_5
                        }, "document verification original document could not be found");
                        response.status(404).send("not found");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns whether given request ip is in the whitelist and should thus be accepted.
     *
     * @param requestIp IP address to check
     */
    Jumio.prototype.isValidCallbackIp = function (requestIp) {
        return this.config.callbackWhitelist.some(function (validIp) {
            return ip.isEqual(requestIp, validIp);
        });
    };
    return Jumio;
}());
exports.default = Jumio;
//# sourceMappingURL=index.js.map