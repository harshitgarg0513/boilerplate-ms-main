import { Module } from '@nestjs/common';
import { TeamModule } from './team/team.module';
import { RouteModule } from './route/route.module';
import { SkuModule } from './sku/sku.module';
import { CompnayModule } from './company/compnay.module';

@Module({
    imports: [TeamModule, RouteModule, SkuModule, CompnayModule],
    providers: [],
    exports: [TeamModule, RouteModule, SkuModule, CompnayModule]
})
export class CoreModule {}
