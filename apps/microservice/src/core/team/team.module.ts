import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserIdentityService } from '../../services/user-identity.service';
import { UserRepository } from './repositories/user.repository';

@Module({
    imports: [],
    providers: [UserService, UserRepository, UserIdentityService],
    exports: [UserService]
})
export class TeamModule {}
