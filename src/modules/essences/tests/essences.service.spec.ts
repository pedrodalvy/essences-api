import { Test } from '@nestjs/testing';
import { EssencesService } from '../essences.service';
import { mock } from 'jest-mock-extended';
import { GBClientInterface } from '../../../infra/clients/gb-client/gb.client.interface';
import { GBClient } from '../../../infra/clients/gb-client/gb.client';
import { listEssencesOutputMock } from './mocks/list-essences.output.mock';

describe('EssencesService', () => {
  let essencesService: EssencesService;
  const gbClient = mock<GBClientInterface>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [EssencesService, { provide: GBClient, useValue: gbClient }],
    }).compile();

    essencesService = app.get(EssencesService);
  });

  describe('listEssences', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      gbClient.listEssences.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await essencesService.listEssences();

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('describeEssence', () => {
    it('should describe essence with success', async () => {
      // ARRANGE
      const expectedOutput = { id: 'SI' };

      // ACT
      const result = await essencesService.describeEssence('SI');

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });
  });
});
