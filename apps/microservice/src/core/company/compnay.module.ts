import { Module } from '@nestjs/common';
import { UserIdentityService } from '../../services/user-identity.service';
import { CompanyService } from './services/compnay.service';
import { CompnayRepository } from './repositories/compnay.repository';

@Module({
    imports: [],
    providers: [CompanyService, CompnayRepository, UserIdentityService],
    exports: [CompanyService]
})
export class CompnayModule {}
