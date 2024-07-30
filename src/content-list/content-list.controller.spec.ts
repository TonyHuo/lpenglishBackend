import { Test, TestingModule } from '@nestjs/testing';
import { ContentListController } from './content-list.controller';

describe('ContentListController', () => {
  let controller: ContentListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentListController],
    }).compile();

    controller = module.get<ContentListController>(ContentListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
