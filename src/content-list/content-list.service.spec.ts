import { Test, TestingModule } from '@nestjs/testing';
import { ContentListService } from './content-list.service';

describe('ContentListService', () => {
  let service: ContentListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentListService],
    }).compile();

    service = module.get<ContentListService>(ContentListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
