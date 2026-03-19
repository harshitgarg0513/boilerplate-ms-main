import { Module } from '@nestjs/common';
import { SkuService } from './services/sku.service';
import { UserIdentityService } from '../../services/user-identity.service';
import { SkuRepository } from './repositories/sku.repository';

@Module({
    imports: [],
    providers: [SkuService, UserIdentityService, SkuRepository],
    exports: [SkuService]
})
export class SkuModule {}
