class FilterRequests {
    constructor(pageSize, page, name, serialNumber, status, date) {
        this.pageSize = pageSize;
        this.page = page;
        this.name = name;
        this.serialNumber = serialNumber;
        this.status = status;
        this.date = date;
    }
}

export { FilterRequests };