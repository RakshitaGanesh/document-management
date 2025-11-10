/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { Test, TestingModule } from '@nestjs/testing';
import { DataUpdatesController } from './dataupdates.controller';

describe('DataupdatesController', () => {
  let controller: DataUpdatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataUpdatesController],
    }).compile();

    controller = module.get<DataUpdatesController>(DataUpdatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
