export class FilterDto {
    page: number = 1;
    limit: number = 10;

    constructor(page: number, limit: number) {
        this.page = page;
        this.limit = limit;
    }
}