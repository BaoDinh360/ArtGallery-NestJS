export class PaginatePostDto<T>{
    totalCount: number;
    itemsPerPage: number;
    pageIndex : number;
    totalPage : number;
    items: T[];
}