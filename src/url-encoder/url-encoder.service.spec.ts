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

  describe('encodeUrl', () => {
    it('should generate a new slug for a new URL', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      expect(slug).toBeDefined();
      expect(slug.length).toBe(8);
    });

    it('should return the same slug for the same URL', async () => {
      const url = 'https://example.com';
      const slug1 = await service.encodeUrl(url);
      const slug2 = await service.encodeUrl(url);
      expect(slug1).toBe(slug2);
    });
  });

  describe('decodeUrl', () => {
    it('should return null for non-existent slug', async () => {
      const result = await service.decodeUrl('nonexistent');
      expect(result).toBeNull();
    });

    it('should return original URL for valid slug', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      const result = await service.decodeUrl(slug);
      expect(result).toBe(url);
    });

    it('should increment click count when decoding', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      await service.decodeUrl(slug);
      const stats = await service.getUrlStatistics(slug);
      expect(stats.totalClicks).toBe(1);
    });
  });

  describe('getUrlStatistics', () => {
    it('should return null for non-existent slug', async () => {
      const result = await service.getUrlStatistics('nonexistent');
      expect(result).toBeNull();
    });

    it('should return correct statistics for valid slug', async () => {
      const url = 'https://example.com';
      const slug = await service.encodeUrl(url);
      const stats = await service.getUrlStatistics(slug);
      
      expect(stats).toMatchObject({
        slug,
        originalUrl: url,
        totalClicks: 0,
        ageInDays: 0,
        status: {
          isActive: true,
          isExpired: false,
          daysUntilExpiry: null
        }
      });
    });
  });

  describe('getAllUrls', () => {
    it('should return empty array when no URLs exist', async () => {
      const urls = await service.getAllUrls();
      expect(urls).toEqual([]);
    });

    it('should return all URLs with their statistics', async () => {
      const url1 = 'https://example1.com';
      const url2 = 'https://example2.com';
      
      await service.encodeUrl(url1);
      await service.encodeUrl(url2);
      
      const urls = await service.getAllUrls();
      expect(urls.length).toBe(2);
      expect(urls[0].originalUrl).toBe(url1);
      expect(urls[1].originalUrl).toBe(url2);
    });
  });
});
