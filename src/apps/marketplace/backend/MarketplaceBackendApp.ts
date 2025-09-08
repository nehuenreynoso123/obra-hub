import { Server } from './server';

export class MarketplaceBackendApp {
  server?: Server;

  async start() {
    const port = process.env.PORT || '4000';
    this.server = new Server(port);
    return this.server.listen();
  }

  async stop() {
    return this.server?.stop();
  }
}
