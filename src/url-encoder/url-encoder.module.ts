import { Module } from '@nestjs/common';
import { UrlEncoderService } from './url-encoder.service';
import { UrlEncoderController } from './url-encoder.controller';

@Module({
  providers: [UrlEncoderService],
  controllers: [UrlEncoderController]
})
export class UrlEncoderModule {}
