import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { Constant } from "../enums/constants.enum";

export class PageSearchDto{
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number = Constant.DEFAULT_PAGE_START;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number = Constant.DEFAULT_LIMIT;
}