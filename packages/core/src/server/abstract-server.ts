import { Server as HttpServer } from 'http';
import {Injector} from 'injection-js';
import {Transport, TransportDefinition} from '../kernel';

const winston = require('winston');

/**
 * Base class for servers
 */
export abstract class AbstractServer {

  /**
   * Injector
   */
  protected injector: Injector;

  /**
   * Server engine
   */
  protected engine: any;

  /**
   * Hostname
   */
  protected host: string;

  /**
   * Port number server is running on
   */
  protected port: number;

  /**
   * Http Server
   */
  protected httpServer: HttpServer;

  /**
   * Sets injector
   *
   * @param {Injector} injector
   */
  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  /**
   * Gets injector
   *
   * @returns {Injector}
   */
  getInjector(): Injector {
    return this.injector;
  }

  /**
   * Kicks off the server
   */
  async start(routeDefinitions: TransportDefinition[]): Promise<void> {
    await this.configure(routeDefinitions);
    await this.startEngine();
  }

  /**
   * Retrieve the base instance of Server
   * @returns {HttpServer}
   */
  getHttpServer(): HttpServer {
    return this.httpServer;
  }

  /**
   * Retrieve underlying engine
   *
   * @returns {any}
   */
  getEngine(): any {
    return this.engine;
  }

  /**
   * Kicks off the server using the specific underlying engine
   */
  async startEngine(): Promise<void> {
    this.getHttpServer().listen(this.port, this.host, () => this.logMessage('Starting'));
  }

  /**
   * Stops underlying engine
   *
   * @returns {Promise<void>}
   */
  async stopEngine(): Promise<void> {
    this.getHttpServer().close(() => this.logMessage('Closing'));
  }

  /**
   * Get the host name (for logging)
   * @returns {string}
   */
  getHost(): string {
    return `http://${this.host}:${this.port}`;
  }

  /**
   * Name of the server
   *
   * @returns {string}
   */
  abstract getName(): string;

  /**
   * Transport type
   *
   * @returns {Transport}
   */
  abstract getTransport(): Transport;

  /**
   * Logs server message
   *
   * @param {string} message
   */
  protected logMessage(message: string): void {
    winston.debug(`${message} ${this.getHost()}`);
  }

  /**
   * Configures the server
   *
   * @param {RouteDefinition[]} routeDefinitions
   * @returns {Promise<void>}
   */
  protected abstract async configure(routeDefinitions: TransportDefinition[]): Promise<void>;
}
