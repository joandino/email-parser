import { Module } from '@nestjs/common';
import { EmailParserController } from './email-parser.controller';

@Module({
  controllers: [EmailParserController]
})
export class EmailParserModule {}
