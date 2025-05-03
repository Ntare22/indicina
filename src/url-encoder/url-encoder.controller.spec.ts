import { Test, TestingModule } from '@nestjs/testing';
import { UrlEncoderController } from './url-encoder.controller';
import { UrlEncoderService } from './url-encoder.service';
import { HttpException, HttpStatus } from '@nestjs/common';

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

  describe('redirectToUrl', () => {
    it('should redirect to original URL', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      const result = await controller.redirectToUrl(slug);
      expect(result).toEqual({ url });
    });

    it('should throw 404 for non-existent slug', async () => {
      await expect(controller.redirectToUrl('nonexistent')).rejects.toThrow(
        new HttpException('URL not found or expired', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('encodeUrl', () => {
    it('should create new short URL', async () => {
      const url = 'https://example.com';
      const result = await controller.encodeUrl({ url });
      expect(result).toHaveProperty('slug');
      expect(result.slug.length).toBe(8);
    });

    it('should return same slug for same URL', async () => {
      const url = 'https://example.com';
      const result1 = await controller.encodeUrl({ url });
      const result2 = await controller.encodeUrl({ url });
      expect(result1.slug).toBe(result2.slug);
    });

    it('should handle encoding errors', async () => {
      jest.spyOn(service, 'encodeUrl').mockRejectedValue(new Error());
      await expect(controller.encodeUrl({ url: 'https://example.com' })).rejects.toThrow(
        new HttpException('Failed to encode URL', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('decodeUrl', () => {
    it('should return original URL', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      const result = await controller.decodeUrl(slug);
      expect(result).toEqual({ originalUrl: url });
    });

    it('should throw 404 for non-existent slug', async () => {
      await expect(controller.decodeUrl('nonexistent')).rejects.toThrow(
        new HttpException('URL not found or expired', HttpStatus.NOT_FOUND),
      );
    });

    it('should handle decoding errors', async () => {
      jest.spyOn(service, 'decodeUrl').mockRejectedValue(new Error());
      await expect(controller.decodeUrl('test')).rejects.toThrow(
        new HttpException('Failed to decode URL', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getUrlStatistics', () => {
    it('should return URL statistics', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      const stats = await controller.getUrlStatistics(slug);
      
      expect(stats).toMatchObject({
        slug,
        originalUrl: url,
        totalClicks: 0,
        status: {
          isActive: true,
          isExpired: false,
          daysUntilExpiry: null
        }
      });
    });

    it('should throw 404 for non-existent slug', async () => {
      jest.spyOn(service, 'getUrlStatistics').mockResolvedValue(null);
      await expect(controller.getUrlStatistics('nonexistent')).rejects.toThrow(
        new HttpException('URL not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getAllUrls', () => {
    it('should return all URLs', async () => {
      const url1 = 'https://example1.com';
      const url2 = 'https://example2.com';
      
      await service.encodeUrl(url1);
      await service.encodeUrl(url2);
      
      const urls = await controller.getAllUrls();
      expect(urls.length).toBe(2);
      expect(urls[0].originalUrl).toBe(url1); // First created
      expect(urls[1].originalUrl).toBe(url2); // Last created
    });

    it('should return empty array when no URLs exist', async () => {
      const urls = await controller.getAllUrls();
      expect(urls).toEqual([]);
    });
  });
});
