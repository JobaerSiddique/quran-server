import { Query, FilterQuery } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /**
   * Search functionality for multiple fields
   * @param searchableFields - Array of field names to search in
   * @returns QueryBuilder instance
   */
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  /**
   * Filter out excluded fields and apply range operators
   * Supports: gt, gte, lt, lte, eq, ne, in, nin
   * @returns QueryBuilder instance
   */
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle advanced filtering with operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|eq|ne|in|nin)\b/g,
      (match) => `$${match}`,
    );

    const filterObj = JSON.parse(queryStr);

    // Handle special cases like array operations
    Object.keys(filterObj).forEach((key) => {
      const value = filterObj[key];
      if (typeof value === "object" && value !== null) {
        if (value.$in && Array.isArray(value.$in)) {
          filterObj[key] = { $in: value.$in };
        }
        if (value.$nin && Array.isArray(value.$nin)) {
          filterObj[key] = { $nin: value.$nin };
        }
      }
    });

    this.modelQuery = this.modelQuery.find(filterObj as FilterQuery<T>);
    return this;
  }

  /**
   * Sort results by field(s)
   * Format: field1,-field2 (ascending, descending)
   * @returns QueryBuilder instance
   */
  sort() {
    const sortField =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortField as string);
    return this;
  }

  /**
   * Select specific fields to return
   * Format: field1,field2,field3
   * @returns QueryBuilder instance
   */
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /**
   * Apply pagination
   * @returns QueryBuilder instance
   */
  paginate() {
    const page = Math.max(1, Number(this?.query?.page) || 1);
    const limit = Math.max(1, Math.min(Number(this?.query?.limit) || 10, 100));
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /**
   * Apply population for referenced fields
   * @param populateFields - Array of population configurations
   * @returns QueryBuilder instance
   */
  populate(populateFields: string | string[] | Record<string, any>) {
    if (populateFields) {
      this.modelQuery = this.modelQuery.populate(populateFields);
    }
    return this;
  }

  /**
   * Apply distinct values for a field
   * @param field - Field to get distinct values from
   * @returns Promise of distinct values
   */
  async distinct(field: string) {
    const result = await this.modelQuery.distinct(field);
    return result;
  }

  /**
   * Count total documents matching the filter
   * @returns Promise of count
   */
  async countTotal() {
    // Get the filter from the current query
    const filter = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(filter);
    const page = Math.max(1, Number(this?.query?.page) || 1);
    const limit = Math.max(1, Math.min(Number(this?.query?.limit) || 10, 100));
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  /**
   * Execute query and get results with pagination meta
   * @returns Promise with data and meta
   */
  async execute() {
    const data = await this.modelQuery;
    const meta = await this.countTotal();
    return { data, meta };
  }

  /**
   * Get the raw query (useful for debugging)
   * @returns The mongoose query object
   */
  getQuery() {
    return this.modelQuery;
  }

  /**
   * Reset the query builder to initial state
   * @returns QueryBuilder instance
   */
  reset() {
    this.modelQuery = this.modelQuery.model.find();
    return this;
  }

  /**
   * Add custom where clause
   * @param condition - Filter condition
   * @returns QueryBuilder instance
   */
  where(condition: FilterQuery<T>) {
    this.modelQuery = this.modelQuery.find(condition);
    return this;
  }

  /**
   * Add select for specific fields (alias for fields)
   * @param selectString - Fields to select
   * @returns QueryBuilder instance
   */
  select(selectString: string) {
    this.modelQuery = this.modelQuery.select(selectString);
    return this;
  }

  /**
   * Add limit to query
   * @param limit - Maximum number of documents
   * @returns QueryBuilder instance
   */
  limit(limit: number) {
    this.modelQuery = this.modelQuery.limit(limit);
    return this;
  }

  /**
   * Add skip to query
   * @param skip - Number of documents to skip
   * @returns QueryBuilder instance
   */
  skip(skip: number) {
    this.modelQuery = this.modelQuery.skip(skip);
    return this;
  }
}

export default QueryBuilder;
