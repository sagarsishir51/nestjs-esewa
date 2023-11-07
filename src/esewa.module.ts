import {DynamicModule, Module} from '@nestjs/common';
import EsewaAsyncOptions, {ESEWA_CONFIG_OPTIONS} from "./esewa.interface";
import {EsewaService} from "./esewa.service";
import {HttpModule} from "@nestjs/axios";

@Module({})
export class EsewaModule {
    static registerAsync(options: EsewaAsyncOptions): DynamicModule {
        return {
            module: EsewaModule,
            imports: [HttpModule, ...options.imports],
            providers: [{
                provide: ESEWA_CONFIG_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject
            },
                EsewaService
            ],
            exports: [EsewaService]
        }
    }
}
