import { Test } from '@nestjs/testing';
import { EssencesService } from '../essences.service';

describe('EssencesService', () => {
  let essencesService: EssencesService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [EssencesService],
    }).compile();

    essencesService = app.get(EssencesService);
  });

  describe('listEssences', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = [];

      // ACT
      const result = await essencesService.listEssences();

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });
});
