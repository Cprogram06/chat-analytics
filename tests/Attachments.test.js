"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Attachments_1 = require("@pipeline/Attachments");
it.each([
    ["image.png", Attachments_1.AttachmentType.Image],
    ["image.jpg", Attachments_1.AttachmentType.Image],
    ["image.webp", Attachments_1.AttachmentType.Image],
    ["animated.gif", Attachments_1.AttachmentType.ImageAnimated],
    ["video.mp4", Attachments_1.AttachmentType.Video],
    ["audio.mp3", Attachments_1.AttachmentType.Audio],
    ["document.pdf", Attachments_1.AttachmentType.Document],
    ["crazy.coco", Attachments_1.AttachmentType.Other],
])("should attachment of filename: %s", (filename, attachmentTypeExpected) => {
    expect((0, Attachments_1.getAttachmentTypeFromFileName)(filename)).toBe(attachmentTypeExpected);
});
it.each([
    ["image/png", Attachments_1.AttachmentType.Image],
    ["image/jpeg", Attachments_1.AttachmentType.Image],
    ["image/webp", Attachments_1.AttachmentType.Image],
    ["image/gif", Attachments_1.AttachmentType.ImageAnimated],
    ["video/mp4", Attachments_1.AttachmentType.Video],
    ["audio/mpeg", Attachments_1.AttachmentType.Audio],
    ["application/pdf", Attachments_1.AttachmentType.Document],
    ["application/coco", Attachments_1.AttachmentType.Other],
])("should recognize attachment of MIME type: %s", (filename, attachmentTypeExpected) => {
    expect((0, Attachments_1.getAttachmentTypeFromMimeType)(filename)).toBe(attachmentTypeExpected);
});
