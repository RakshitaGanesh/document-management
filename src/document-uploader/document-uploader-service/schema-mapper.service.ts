// schema-mapper.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchemaMapperService {
  map(rows: any[], schema: any): any[] {
    if (!schema) return rows;

    const mappedData = rows.map(row => {
      const mapped: any = {};
      if (Array.isArray(schema)) {
        schema.forEach(key => mapped[key] = row[key] ?? null);
      } else {
        Object.entries(schema).forEach(([header, outKey]) => {
          mapped[outKey as string] = row[header] ?? null;
        });
      }
      return mapped;
    });
    return mappedData;
  }
}
