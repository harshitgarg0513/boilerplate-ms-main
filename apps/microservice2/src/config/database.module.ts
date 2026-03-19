import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './typeorm.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      name: 'master',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const typeOrmConfigService = new TypeOrmConfigService(configService);
        return typeOrmConfigService.mysqlMasterConfig;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
        name: 'slave',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const typeOrmConfigService = new TypeOrmConfigService(configService);
          return typeOrmConfigService.mysqlSlaveConfig;
        },
        inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'postgres',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const typeOrmConfigService = new TypeOrmConfigService(configService);
        return typeOrmConfigService.postgresConfig;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
