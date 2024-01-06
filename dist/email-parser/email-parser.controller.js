"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailParserController = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
const fs = require("fs");
const path = require("path");
const axios_1 = require("axios");
const cheerio = require("cheerio");
const simpleParser = require('mailparser').simpleParser;
let EmailParserController = class EmailParserController {
    constructor() { }
    async getJsonData(body) {
        let mail;
        if ((0, utils_1.isValidURL)(body.path)) {
            mail = fs.createReadStream(body.path);
        }
        else {
            mail = fs.createReadStream(path.join(__dirname, body.path));
        }
        const parsed = await simpleParser(mail);
        const attachments = parsed.attachments;
        if (attachments && attachments.length > 0) {
            for (let i = 0, len = attachments.length; i < len; i++) {
                const attachment = attachments[i];
                if (attachment.contentType === 'application/json') {
                    let json = JSON.parse(attachment.content.toString());
                    return json;
                }
            }
        }
        else {
            const regex = /(https?:\/\/[^ ]*)/g;
            const urls = parsed.text.replace(/[&<>\n]/g, '').match(regex);
            for (let i = 0, len = urls.length; i < len; i++) {
                const url = urls[i];
                if (url.includes('.json')) {
                    const res = await axios_1.default.get(url);
                    return res.data;
                }
                else {
                    const res = await axios_1.default.get(url);
                    const $ = cheerio.load(res.data);
                    const scriptTags = $('script');
                    const jsonLinks = [];
                    scriptTags.each((index, element) => {
                        const scriptContent = $(element).html();
                        try {
                            const jsonData = JSON.parse(scriptContent);
                            if (jsonData)
                                return jsonData;
                        }
                        catch (error) {
                        }
                    });
                    console.log(jsonLinks);
                }
            }
        }
        return null;
    }
};
exports.EmailParserController = EmailParserController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailParserController.prototype, "getJsonData", null);
exports.EmailParserController = EmailParserController = __decorate([
    (0, common_1.Controller)('email-parser'),
    __metadata("design:paramtypes", [])
], EmailParserController);
//# sourceMappingURL=email-parser.controller.js.map