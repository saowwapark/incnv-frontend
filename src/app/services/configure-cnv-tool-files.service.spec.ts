import { TestBed } from '@angular/core/testing';

import { ConfigureCnvToolFilesService } from './configure-cnv-tool-files.service';

describe('ConfigureCnvToolFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigureCnvToolFilesService = TestBed.get(ConfigureCnvToolFilesService);
    expect(service).toBeTruthy();
  });
});
