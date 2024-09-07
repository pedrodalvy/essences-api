import { EssencesService } from '../essences.service';
import { EssencesController } from '../essences.controller';
import { mock } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';
import { listEssencesOutputMock } from './mocks/list-essences.output.mock';

describe('EssencesController', () => {
  let essencesController: EssencesController;
  const essencesService = mock<EssencesService>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [EssencesController],
      providers: [{ provide: EssencesService, useValue: essencesService }],
    }).compile();

    essencesController = app.get(EssencesController);
  });

  describe('listEssences', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      essencesService.listEssences.mockResolvedValue(expectedOutput);

      // ACT
      const result = await essencesController.listEssences();

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });
});
