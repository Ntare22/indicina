import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

export class EncodeUrlDto {
  @ApiProperty({
    description: 'The URL to be shortened',
    example: 'https://example.com/very/long/url',
  })
  @IsUrl()
  url: string;
}

export class UrlResponseDto {
  @ApiProperty({
    description: 'The shortened URL slug',
    example: 'abc123xy',
  })
  slug: string;
}

export class DecodeResponseDto {
  @ApiProperty({
    description: 'The original URL',
    example: 'https://example.com/very/long/url',
  })
  originalUrl: string;
}

export class UrlStatisticsDto {
  @ApiProperty({
    description: 'The shortened URL slug',
    example: 'GeAi9K',
  })
  slug: string;

  @ApiProperty({
    description: 'The original URL',
    example: 'https://example.com/very/long/url',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Total number of clicks',
    example: 150,
  })
  totalClicks: number;

  @ApiProperty({
    description: 'When the URL was created',
    example: '2024-05-03T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Age of the URL in days',
    example: 5,
  })
  ageInDays: number;

  @ApiProperty({
    description: 'Average clicks per day',
    example: '30.00',
  })
  clicksPerDay: string;

  @ApiProperty({
    description: 'URL status information',
    example: {
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 25,
    },
  })
  status: {
    isActive: boolean;
    isExpired: boolean;
    daysUntilExpiry: number | null;
  };

  @ApiProperty({
    description: 'Performance metrics',
    example: {
      averageClicksPerDay: '30.00',
      lastAccessed: '2024-05-03T15:30:00Z',
    },
  })
  performance: {
    averageClicksPerDay: string;
    lastAccessed: Date;
  };
}