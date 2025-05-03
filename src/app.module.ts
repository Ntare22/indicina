import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UrlEncoderModule } from './url-encoder/url-encoder.module';

@Module({
  imports: [PrismaModule, UrlEncoderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
