import { Controller, Get, Body } from '@nestjs/common';
import { isValidURL } from 'src/utils';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
const simpleParser = require('mailparser').simpleParser;

declare interface BodyProps {
  path: string;
}

@Controller('email-parser')
export class EmailParserController {
  constructor() {}

  @Get()
  async getJsonData(@Body() body: BodyProps): Promise<Object> {
    let mail:unknown;
    
    if(isValidURL(body.path)){
      mail = fs.createReadStream(body.path);
    } else {
      mail = fs.createReadStream(path.join(__dirname, body.path));
    }

    const parsed = await simpleParser(mail);
    const attachments = parsed.attachments;

    if(attachments && attachments.length > 0) {
      for(let i=0, len=attachments.length; i < len; i++) {
        const attachment = attachments[i];

        if(attachment.contentType === 'application/json') {
          let json = JSON.parse(attachment.content.toString());

          return json;
        }
      }
    } else {
      const regex = /(https?:\/\/[^ ]*)/g;
      const urls = parsed.text.replace(/[&<>\n]/g, '').match(regex);

      for(let i=0, len=urls.length; i < len; i++) {
        const url = urls[i];

        if(url.includes('.json')) {
          const res = await axios.get(url);

          return res.data;
        } else {
          const res = await axios.get(url);
          const $ = cheerio.load(res.data);
          const scriptTags = $('script');

          const jsonLinks = [];
          scriptTags.each((index, element) => {
            const scriptContent = $(element).html();

            try {
              const jsonData = JSON.parse(scriptContent);
              
              if(jsonData) return jsonData;
            } catch (error) {
              // Ignore if parsing fails, as it may not be JSON data
            }
          });

          console.log(jsonLinks);
        }
      }
    }

    return null;
  }
}
