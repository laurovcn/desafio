import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpRequestTotal: Counter<string>;

  constructor() {
    // Limpar registry anterior
    register.clear();

    // Coletar métricas padrão do processo
    collectDefaultMetrics({ register });

    // Métrica de duração de requests HTTP
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [register],
    });

    // Contador de requests HTTP
    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    });
  }

  onModuleInit() {
    if (process.env.NODE_ENV !== 'test') {
      console.log('MetricsService initialized');
    }
  }

  // Observar duração de request
  observeHttpDuration(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration);
  }

  // Incrementar contador de requests
  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestTotal.labels(method, route, statusCode.toString()).inc();
  }

  // Retornar métricas no formato Prometheus
  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
