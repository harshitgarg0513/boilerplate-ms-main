import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config';

export const DataSources = [
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
];
