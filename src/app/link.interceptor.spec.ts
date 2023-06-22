import { TestBed } from '@angular/core/testing';

import { LinkInterceptor } from './link.interceptor';

describe('LinkInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LinkInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LinkInterceptor = TestBed.inject(LinkInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
