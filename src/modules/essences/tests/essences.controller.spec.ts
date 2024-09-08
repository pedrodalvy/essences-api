import { EssencesService } from '../essences.service';
import { EssencesController } from '../essences.controller';
import { mock } from 'jest-mock-extended';
import { listEssencesOutputMock } from './mocks/list-essences.output.mock';
import { describeEssenceOutputMock } from './mocks/describe-essence.output.mock';

describe('EssencesController', () => {
  let essencesController: EssencesController;
  const essencesService = mock<EssencesService>();

  beforeEach(async () => {
    essencesController = new EssencesController(essencesService);
  });

  describe('listEssences', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      essencesService.listEssences.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await essencesController.listEssences();

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('describeEssence', () => {
    it('should describe essence with success', async () => {
      // ARRANGE
      const expectedOutput = describeEssenceOutputMock();
      essencesService.describeEssence.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await essencesController.describeEssence('any-id');

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });
});
