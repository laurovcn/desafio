import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let app: Partial<INestApplication>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    service = module.get<PrismaService>(PrismaService);
    app = { close: jest.fn() };
    // spy on internal methods
    jest.spyOn(service, '$connect').mockResolvedValue(undefined as never);
    jest
      .spyOn(service, '$on' as any)
      .mockImplementation((event: string, callback: Function) => {
        // simulate event registration
      });
  });

  it('should connect on module init', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should register shutdown hook', async () => {
    const onSpy = jest.spyOn(service as any, '$on');
    await service.enableShutdownHooks(app as INestApplication);
    expect(onSpy).toHaveBeenCalledWith('beforeExit', expect.any(Function));
  });

  it('should invoke app.close when beforeExit callback is executed', async () => {
    const closeSpy = jest.spyOn(app, 'close');
    jest
      .spyOn(service as any, '$on')
      .mockImplementation((event: string, callback: Function) => {
        // simulate event trigger
        callback();
      });
    await service.enableShutdownHooks(app as INestApplication);
    expect(closeSpy).toHaveBeenCalled();
  });
});
