"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachmentTypeFromMimeType = exports.getAttachmentTypeFromFileName = exports.AttachmentType = void 0;
/** Types of attachments */
var AttachmentType;
(function (AttachmentType) {
    AttachmentType[AttachmentType["Image"] = 0] = "Image";
    AttachmentType[AttachmentType["ImageAnimated"] = 1] = "ImageAnimated";
    AttachmentType[AttachmentType["Video"] = 2] = "Video";
    AttachmentType[AttachmentType["Sticker"] = 3] = "Sticker";
    AttachmentType[AttachmentType["Audio"] = 4] = "Audio";
    AttachmentType[AttachmentType["Document"] = 5] = "Document";
    AttachmentType[AttachmentType["Other"] = 6] = "Other";
})(AttachmentType = exports.AttachmentType || (exports.AttachmentType = {}));
/** Association between common extensions and attachment types */
const ATTACHMENT_EXTS = {
    [AttachmentType.Image]: ["png", "jpg", "jpeg", "webp", "bmp", "tiff", "tif", "svg", "ico", "psd"],
    [AttachmentType.ImageAnimated]: ["gif", "gifv", "apng"],
    [AttachmentType.Video]: ["mp4", "webm", "mkv", "flv", "mov", "avi", "wmv", "mpg", "mpeg", "avi"],
    [AttachmentType.Audio]: ["mp3", "ogg", "wav", "flac", "m4a"],
    [AttachmentType.Document]: ["doc", "docx", "odt", "pdf", "xls", "xlsx", "ods", "ppt", "pptx", "txt", "html"],
};
/** MIME types of documents: word, pdf, txt, etc */
const DOC_MIME_TYPES = [
    "application/pdf",
    "application/epub",
    "application/epub+zip",
    "text/html",
    "application/rtf",
    "application/msword",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
];
/** Extract the attachment type from the extension of a filename */
const getAttachmentTypeFromFileName = (filename) => {
    const ext = (filename.split(".").pop() || "").toLowerCase();
    for (let type = 0; type <= AttachmentType.Other; type++) {
        if (ATTACHMENT_EXTS[type]?.includes(ext))
            return type;
    }
    // unknown or generic
    return AttachmentType.Other;
};
exports.getAttachmentTypeFromFileName = getAttachmentTypeFromFileName;
/** Extract the attachment type from a MIME type */
const getAttachmentTypeFromMimeType = (mimeType) => {
    mimeType = mimeType.toLowerCase();
    if (mimeType.startsWith("image/gif"))
        return AttachmentType.ImageAnimated;
    if (mimeType.startsWith("image/"))
        return AttachmentType.Image;
    if (mimeType.startsWith("video/"))
        return AttachmentType.Video;
    if (mimeType.startsWith("audio/"))
        return AttachmentType.Audio;
    if (DOC_MIME_TYPES.includes(mimeType))
        return AttachmentType.Document;
    // unknown or generic
    return AttachmentType.Other;
};
exports.getAttachmentTypeFromMimeType = getAttachmentTypeFromMimeType;
