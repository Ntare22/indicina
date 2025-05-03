import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

interface ShortLink {
  id: string;
  originalUrl: string;
  slug: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date;
}

@Injectable()
export class UrlEncoderService {
  private urlMap: Map<string, ShortLink> = new Map();
  private slugToIdMap: Map<string, string> = new Map();

  async encodeUrl(originalUrl: string): Promise<string> {
    // Check if URL already exists
    for (const link of this.urlMap.values()) {
      if (link.originalUrl === originalUrl) {
        return link.slug;
      }
    }

    // Generate new slug
    const slug = this.generateSlug();
    const id = nanoid();

    const newLink: ShortLink = {
      id,
      originalUrl,
      slug,
      clicks: 0,
      createdAt: new Date(),
    };

    this.urlMap.set(id, newLink);
    this.slugToIdMap.set(slug, id);

    return slug;
  }

  async decodeUrl(slug: string): Promise<string | null> {
    const id = this.slugToIdMap.get(slug);
    if (!id) {
      return null;
    }

    const link = this.urlMap.get(id);
    if (!link) {
      return null;
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return null;
    }

    link.clicks++;
    this.urlMap.set(id, link);

    return link.originalUrl;
  }

  async getUrlStatistics(slug: string) {
    const id = this.slugToIdMap.get(slug);
    if (!id) {
      return null;
    }

    const link = this.urlMap.get(id);
    if (!link) {
      return null;
    }

    const now = new Date();
    const ageInDays = Math.floor(
      (now.getTime() - link.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const clicksPerDay =
      ageInDays > 0
        ? (link.clicks / ageInDays).toFixed(2)
        : link.clicks.toString();
    const isExpired = link.expiresAt ? link.expiresAt < now : false;
    const daysUntilExpiry = link.expiresAt
      ? Math.ceil(
          (link.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        )
      : null;

    return {
      slug: link.slug,
      originalUrl: link.originalUrl,
      totalClicks: link.clicks,
      createdAt: link.createdAt,
      ageInDays,
      clicksPerDay,
      status: {
        isActive: !isExpired,
        isExpired,
        daysUntilExpiry,
      },
      performance: {
        averageClicksPerDay: clicksPerDay,
        lastAccessed: link.createdAt,
      },
    };
  }

  async getAllUrls() {
    return Array.from(this.urlMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((link) => {
        const now = new Date();
        const ageInDays = Math.floor(
          (now.getTime() - link.createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );
        const clicksPerDay =
          ageInDays > 0
            ? (link.clicks / ageInDays).toFixed(2)
            : link.clicks.toString();
        const isExpired = link.expiresAt ? link.expiresAt < now : false;
        const daysUntilExpiry = link.expiresAt
          ? Math.ceil(
              (link.expiresAt.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : null;

        return {
          slug: link.slug,
          originalUrl: link.originalUrl,
          totalClicks: link.clicks,
          createdAt: link.createdAt,
          ageInDays,
          clicksPerDay,
          status: {
            isActive: !isExpired,
            isExpired,
            daysUntilExpiry,
          },
          performance: {
            averageClicksPerDay: clicksPerDay,
            lastAccessed: link.createdAt,
          },
        };
      });
  }

  private generateSlug(): string {
    return nanoid(8);
  }
}
