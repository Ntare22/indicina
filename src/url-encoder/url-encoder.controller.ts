import { Controller, Post, Get, Body, Param, HttpException, HttpStatus, Redirect } from '@nestjs/common';
import { UrlEncoderService } from './url-encoder.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DecodeResponseDto, EncodeUrlDto, UrlResponseDto, UrlStatisticsDto } from './dto/url-encoder.dto';

@ApiTags('URL Encoder')
@Controller()
export class UrlEncoderController {
  constructor(private readonly urlEncoderService: UrlEncoderService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({
    name: 'slug',
    description: 'The shortened URL slug',
    example: 'GeAi9K',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found or expired',
  })
  @Redirect()
  async redirectToUrl(@Param('slug') slug: string) {
    const originalUrl = await this.urlEncoderService.decodeUrl(slug);
    if (!originalUrl) {
      throw new HttpException('URL not found or expired', HttpStatus.NOT_FOUND);
    }
    return { url: originalUrl };
  }

  @Post('api/encode')
  @ApiOperation({ summary: 'Encode a URL to a shortened URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully shortened',
    type: EncodeUrlDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async encodeUrl(@Body() encodeUrlDto: EncodeUrlDto): Promise<UrlResponseDto> {
    try {
      const slug = await this.urlEncoderService.encodeUrl(encodeUrlDto.url);
      return { slug };
    } catch (error) {
      throw new HttpException(
        'Failed to encode URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('api/decode/:slug')
  @ApiOperation({ summary: 'Decode a shortened URL to its original URL' })
  @ApiParam({
    name: 'slug',
    description: 'The shortened URL slug to decode',
    example: 'abc123xy',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the original URL',
    type: DecodeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found or expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async decodeUrl(@Param('slug') slug: string): Promise<DecodeResponseDto> {
    try {
      const originalUrl = await this.urlEncoderService.decodeUrl(slug);
      if (!originalUrl) {
        throw new HttpException('URL not found or expired', HttpStatus.NOT_FOUND);
      }
      return { originalUrl };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to decode URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('api/statistics/:slug')
  @ApiOperation({ summary: 'Get statistics for a shortened URL' })
  @ApiParam({
    name: 'slug',
    description: 'The shortened URL slug',
    example: 'GeAi9K',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics for the shortened URL',
    type: UrlStatisticsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found',
  })
  async getUrlStatistics(@Param('slug') slug: string) {
    return this.urlEncoderService.getUrlStatistics(slug);
  }

  @Get('api/list')
  @ApiOperation({ summary: 'List all shortened URLs' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all shortened URLs with their statistics',
    type: [UrlStatisticsDto],
  })
  async getAllUrls() {
    return this.urlEncoderService.getAllUrls();
  }
}
