/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { Test, TestingModule } from '@nestjs/testing';
import { DataUpdateService } from './dataupdates.service';

describe('DataupdatesService', () => {
  let service: DataUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataUpdateService],
    }).compile();

    service = module.get<DataUpdateService>(DataUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
