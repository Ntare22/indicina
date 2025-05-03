import { Test, TestingModule } from '@nestjs/testing';
import { UrlEncoderService } from './url-encoder.service';

describe('UrlEncoderService', () => {
  let service: UrlEncoderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlEncoderService],
    }).compile();

    service = module.get<UrlEncoderService>(UrlEncoderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
