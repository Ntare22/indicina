import { Module } from '@nestjs/common';
import { UrlEncoderController } from './url-encoder.controller';
import { UrlEncoderService } from './url-encoder.service';

@Module({
  controllers: [UrlEncoderController],
  providers: [UrlEncoderService],
})
export class UrlEncoderModule {}
