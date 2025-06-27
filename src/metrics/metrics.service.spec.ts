import { MetricsService } from './metrics.service';
import { register } from 'prom-client';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    register.clear();
  });

  beforeEach(() => {
    service = new MetricsService();
  });

  it('should create counters and histograms without throwing', () => {
    expect(service).toBeDefined();
  });

  it('should observe HTTP durations and increment request counters', () => {
    expect(() => {
      service.observeHttpDuration('GET', '/test', 200, 0.123);
      service.incrementHttpRequests('POST', '/test', 201);
    }).not.toThrow();
  });

  it('getMetrics should return a metrics string including known metric names', async () => {
    // ensure some metrics are recorded
    service.incrementHttpRequests('GET', '/a', 200);
    service.observeHttpDuration('GET', '/a', 200, 0.5);

    const metrics = await service.getMetrics();
    expect(typeof metrics).toBe('string');
    expect(metrics).toContain('http_requests_total');
    expect(metrics).toContain('http_request_duration_seconds');
  });
});
