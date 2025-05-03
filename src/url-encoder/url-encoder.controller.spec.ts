import { Test, TestingModule } from '@nestjs/testing';
import { UrlEncoderController } from './url-encoder.controller';

describe('UrlEncoderController', () => {
  let controller: UrlEncoderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlEncoderController],
    }).compile();

    controller = module.get<UrlEncoderController>(UrlEncoderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
