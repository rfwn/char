import { DataSource, Entity, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

import Client from '../structures/Client';
import entities from './entities/';

export default class Database {
  public client: Client;
  public datasource: DataSource;

  constructor(client: Client) {
    this.client = client;
    this.datasource = new DataSource({
      type: "mongodb",
      host: client.config.dbHost,
      port: client.config.dbPort,
      database: client.config.dbName,
      synchronize: true,
      logging: false,
	  entities: entities
    });
  }

  /**
   * Init db
   */
  public async init() {
	await this.datasource.initialize();
	return this.client.logger.info('[+] database connection established');
  }

  public repo<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
	return this.datasource.getRepository(target);
  }
}
