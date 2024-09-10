import { Test } from '@nestjs/testing';
import { EssencesService } from '../essences.service';
import { mock } from 'jest-mock-extended';
import { GbClientAdapterInterface } from '../../../infra/adapters/gb-client-adapter/gb-client.adapter.interface';
import { GbClientAdapter } from '../../../infra/adapters/gb-client-adapter/gb-client.adapter';
import { listEssencesOutputMock } from './mocks/list-essences.output.mock';
import { describeEssenceOutputMock } from './mocks/describe-essence.output.mock';

describe('EssencesService', () => {
  let essencesService: EssencesService;
  const gbClientAdapter = mock<GbClientAdapterInterface>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [EssencesService, { provide: GbClientAdapter, useValue: gbClientAdapter }],
    }).compile();

    essencesService = app.get(EssencesService);
  });

  describe('listEssences', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      gbClientAdapter.listEssences.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await essencesService.listEssences();

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('describeEssence', () => {
    it('should describe essence with success', async () => {
      // ARRANGE
      const id = 'essence-id';
      const expectedOutput = describeEssenceOutputMock();
      gbClientAdapter.describeEssence.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await essencesService.describeEssence(id);

      // ASSERT
      expect(result).toEqual(expectedOutput);
      expect(gbClientAdapter.describeEssence).toHaveBeenCalledWith(id);
    });
  });
});
