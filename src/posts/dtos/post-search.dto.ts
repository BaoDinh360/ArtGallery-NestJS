import { IsOptional } from "class-validator";
import { PageSearchDto } from "src/shared/dtos/page-search.dto";

export class PostSearchDto extends PageSearchDto{
    @IsOptional()
    postName?: string;
    @IsOptional()
    authorName?: string; // only used to received data from query params
    @IsOptional()
    authorId?: string; // used authorId to search base on authorName
    @IsOptional()
    sort?: string
}