import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Router } from 'express';
import { RouteService } from './services/route.service';
import { RouteRepository } from './repositories/route.repository';
import { UserIdentityService } from '../../services/user-identity.service';
import { TeamModule } from '../team/team.module';

@Module({
    imports: [TeamModule],
    providers: [RouteService, UserIdentityService, RouteRepository],
    exports: [RouteService]
})
export class RouteModule {}
