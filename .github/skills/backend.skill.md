# Backend Development Skill

This skill provides expertise in NestJS backend development for Solo Guardian.

## When to Use This Skill

Use this skill when working on:
- Backend API endpoints and controllers
- Business logic in services
- Database operations with Prisma
- Authentication and authorization
- Queue jobs (BullMQ)
- Email/SMS notifications
- Backend unit tests

## Architecture Pattern

```
Controller → Service → Repository → Prisma
    ↓           ↓           ↓
Validation  Business    Database
            Logic       Operations
```

## Key Principles

1. **Separation of Concerns**
   - Controllers: Only validate requests and call services
   - Services: Contain all business logic
   - Repositories: Handle all database operations via Prisma

2. **Error Handling**
   - Use NestJS HTTP exceptions with meaningful messages
   - Error codes defined in `packages/types/src/errors.ts`
   - Log all sensitive operations

3. **Response Format**
   - Success: `{ success: true, data: {...}, meta?: {...} }`
   - Error: `{ success: false, error: { code, message, details? } }`

## Module Structure

```typescript
module/
├── dto/
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── query-*.dto.ts
├── entities/
│   └── *.entity.ts
├── *.controller.ts
├── *.service.ts
├── *.repository.ts
├── *.module.ts
└── __tests__/
    ├── *.controller.spec.ts
    ├── *.service.spec.ts
    └── *.repository.spec.ts
```

## Controller Template

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';

@Controller('api/v1/items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() createItemDto: CreateItemDto,
  ): Promise<{ success: boolean; data: Item }> {
    const item = await this.itemService.create(userId, createItemDto);
    return { success: true, data: item };
  }

  @Get(':id')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: Item }> {
    const item = await this.itemService.findOne(userId, id);
    return { success: true, data: item };
  }
}
```

## Service Template

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async create(userId: string, dto: CreateItemDto): Promise<Item> {
    // Validate business rules
    await this.validateBusinessRules(userId, dto);
    
    // Create via repository
    const item = await this.itemRepository.create({
      ...dto,
      userId,
    });

    // Log sensitive operation
    this.logger.log(\`User \${userId} created item \${item.id}\`);

    return item;
  }

  async findOne(userId: string, id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    
    if (!item) {
      throw new NotFoundException(\`Item \${id} not found\`);
    }

    // Check ownership
    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  private async validateBusinessRules(userId: string, dto: CreateItemDto): Promise<void> {
    // Add validation logic
  }
}
```

## Repository Template

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Item, Prisma } from '@prisma/client';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  async findById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async findMany(where: Prisma.ItemWhereInput): Promise<Item[]> {
    return this.prisma.item.findMany({ where });
  }

  async update(id: string, data: Prisma.ItemUpdateInput): Promise<Item> {
    return this.prisma.item.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Item> {
    return this.prisma.item.delete({ where: { id } });
  }
}
```

## DTO Template with Validation

```typescript
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ description: 'Item name', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Item description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
```

## Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { ItemRepository } from './item.repository';

describe('ItemService', () => {
  let service: ItemService;
  let repository: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: ItemRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get<ItemRepository>(ItemRepository);
  });

  it('should create an item', async () => {
    const userId = 'user-123';
    const dto = { name: 'Test Item' };
    const expectedItem = { id: '1', ...dto, userId };

    jest.spyOn(repository, 'create').mockResolvedValue(expectedItem as any);

    const result = await service.create(userId, dto);

    expect(result).toEqual(expectedItem);
    expect(repository.create).toHaveBeenCalledWith({ ...dto, userId });
  });
});
```

## Common Commands

```bash
# Development
cd apps/backend
pnpm run start:dev              # Start dev server

# Database
pnpm run prisma:generate        # Generate Prisma client
pnpm run prisma:migrate         # Run migrations
pnpm run prisma:studio          # Open Prisma Studio

# Testing
pnpm run test                   # All tests
pnpm run test:watch             # Watch mode
pnpm run test:cov               # Coverage
pnpm run test -- file.spec.ts   # Single file

# Build
pnpm run build                  # Production build
```

## Database Guidelines

1. **Schema Changes**
   - Edit `prisma/schema.prisma`
   - Run `pnpm run prisma:migrate dev`
   - Commit both schema and migration files

2. **Queries**
   - Always use Prisma client
   - Use transactions for multi-step operations
   - Add indexes for frequently queried fields

3. **Relations**
   - Use proper relation fields in schema
   - Include relations in Prisma queries when needed
   - Avoid N+1 queries

## Queue Jobs (BullMQ)

```typescript
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationProcessor {
  @Process('send-email')
  async handleSendEmail(job: Job): Promise<void> {
    const { to, subject, content } = job.data;
    // Send email logic
    await this.emailService.send(to, subject, content);
  }
}
```

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

## Code Style

- No `any` type
- Every function has return type
- Single function < 50 lines
- Single file < 300 lines
- Use dependency injection
- Log sensitive operations
- Validate all inputs with DTOs

## Security Checklist

- [ ] All endpoints protected with guards
- [ ] User ownership validated
- [ ] Sensitive data logged
- [ ] Input validation with DTOs
- [ ] SQL injection prevented (use Prisma)
- [ ] Rate limiting configured
- [ ] Secrets in environment variables

## Related Files

- `apps/backend/src/` - Backend source code
- `apps/backend/prisma/schema.prisma` - Database schema
- `packages/types/src/` - Shared types
- `AGENTS.md` - Full architecture guide
