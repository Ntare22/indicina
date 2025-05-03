import { Module } from '@nestjs/common';
import { UrlEncoderModule } from './url-encoder/url-encoder.module';

@Module({
  imports: [UrlEncoderModule],
})
export class AppModule {}
