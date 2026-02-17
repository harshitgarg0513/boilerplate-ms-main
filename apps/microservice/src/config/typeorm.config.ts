import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ALL_ENTITIES } from './entities';

@Injectable()
export class TypeOrmConfigService {
  constructor(private configService: ConfigService) {}

  get mysqlMasterConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('MYSQL_MASTER_HOST'),
      port: this.configService.get<number>('MYSQL_MASTER_PORT'),
      username: this.configService.get<string>('MYSQL_MASTER_USER'),
      password: this.configService.get<string>('MYSQL_MASTER_PASSWORD'),
      database: this.configService.get<string>('MYSQL_MASTER_DATABASE'),
      // entities: [__dirname + '/../**/*.entity.{js,ts}'],
      entities: ALL_ENTITIES,
      synchronize: false, // never set this to true (Danger)
      name: 'master',
    };
  }

  get mysqlSlaveConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('MYSQL_SLAVE_HOST'),
      port: this.configService.get<number>('MYSQL_SLAVE_PORT'),
      username: this.configService.get<string>('MYSQL_SLAVE_USER'),
      password: this.configService.get<string>('MYSQL_SLAVE_PASSWORD'),
      database: this.configService.get<string>('MYSQL_SLAVE_DATABASE'),
      // entities: [__dirname + '/../**/*.entity.{js,ts}'],
      entities: ALL_ENTITIES,
      synchronize: false, // never set this to true (Danger)
      name: 'slave',
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      username: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DATABASE'),
      // entities: [__dirname + '/../**/*.entity.{js,ts}'],
      entities: [],
      synchronize: false, // never set this to true (Danger)
      name: 'postgres',
    };
  }
}