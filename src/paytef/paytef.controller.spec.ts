import { Test, TestingModule } from '@nestjs/testing';
import { PaytefController } from './paytef.controller';

describe('PaytefController', () => {
  let controller: PaytefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaytefController],
    }).compile();

    controller = module.get<PaytefController>(PaytefController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
