import { Test, TestingModule } from '@nestjs/testing';
import { UrlEncoderController } from './url-encoder.controller';
import { UrlEncoderService } from './url-encoder.service';

describe('UrlEncoderController', () => {
  let controller: UrlEncoderController;
  let service: UrlEncoderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlEncoderController],
      providers: [UrlEncoderService],
    }).compile();

    controller = module.get<UrlEncoderController>(UrlEncoderController);
    service = module.get<UrlEncoderService>(UrlEncoderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
